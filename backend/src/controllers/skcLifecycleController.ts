import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { requireString } from "../utils/routeHelpers";

const DEFAULT_STAGES = [
  { key: 'governance_framework', title: 'Governance Framework', description: 'Institutional rules and standards for the assessment.', order: 1, status: 'Completed', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/governance-framework' },
  { key: 'stakeholder_registry', title: 'Stakeholder Registry System', description: 'Registry of individual craftspeople, professionals, and institutions.', order: 2, status: 'Completed', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/stakeholder-registry' },
  { key: 'stakeholder_registration', title: 'Stakeholder Registration', description: 'Public registration for individuals and institutions.', order: 3, status: 'Active', statusMode: 'MANUAL' },
  { key: 'public_participation', title: 'Public Participation', description: 'Active surveys, questionnaires, and testimonies open to stakeholders.', order: 4, status: 'Active', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/participate' },
  { key: 'public_hearing_orientation', title: 'Public Hearing Orientation', description: 'Orientation for stakeholders regarding hearing procedures.', order: 5, status: 'Scheduled', statusMode: 'MANUAL' },
  { key: 'public_hearings', title: 'Public Hearings', description: 'Formal webcasts and testimonies recorded from key craft zones.', order: 6, status: 'Scheduled', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/public-hearings' },
  { key: 'draft_findings', title: 'Draft Findings', description: 'Preliminary report chapters opened for public commentary and correction.', order: 7, status: 'Scheduled', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/draft-findings' },
  { key: 'draft_review', title: 'Draft Review', description: 'Initial review of the drafted findings.', order: 8, status: 'Scheduled', statusMode: 'MANUAL' },
  { key: 'validation_round', title: 'Validation', description: 'Multi-district check rounds to audit numbers and regional facts.', order: 9, status: 'Scheduled', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/validation-round' },
  { key: 'expert_review', title: 'Expert Review', description: 'Oversight panel and advisory review of final assessment draft.', order: 10, status: 'Scheduled', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/expert-review' },
  { key: 'final_report_publication', title: 'Final Report Publication', description: 'The compiled, approved State of Kashmir Crafts 2026 assessment report.', order: 11, status: 'Scheduled', statusMode: 'MANUAL', linkedRoute: '/state-of-kashmir-crafts/final-report' }
];

const STAGE_SCHEDULES: Record<string, string> = {
  'governance_framework': 'Aug–Sep 2026',
  'stakeholder_registry': 'Aug–Sep 2026',
  'stakeholder_registration': '31 Aug 2026 – 26 Jan 2027',
  'public_participation': '31 Aug 2026 – 22 Mar 2027',
  'public_hearing_orientation': '23 Oct 2026',
  'public_hearings': '5 Sep 2026 – 28 Nov 2026',
  'draft_findings': '18 Mar – 14 Apr 2027',
  'draft_review': '15 Apr – 5 May 2027',
  'validation_round': '8–12 May 2027',
  'expert_review': '15–24 May 2027',
  'final_report_publication': '31 May 2027'
};

// Helper to seed stages
async function seedDefaultStages() {
  const currentKeys = DEFAULT_STAGES.map(s => s.key);
  await prisma.skcLifecycleStage.deleteMany({
    where: { key: { notIn: currentKeys } }
  });

  for (const stage of DEFAULT_STAGES) {
    await prisma.skcLifecycleStage.upsert({
      where: { key: stage.key },
      update: { title: stage.title, description: stage.description, order: stage.order, status: stage.status },
      create: stage
    });
  }
}

// Calculate status for Date-Driven stage
function calculateDateDrivenStatus(stage: any): string {
  const now = new Date();
  if (stage.completedDate) {
    return 'COMPLETED';
  }

  if (stage.startDate) {
    const start = new Date(stage.startDate);
    if (now < start) {
      // If start is within 30 days, we can classify it as UPCOMING, else NOT_STARTED
      const diffMs = start.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays <= 30 ? 'UPCOMING' : 'NOT_STARTED';
    }

    if (stage.targetEndDate) {
      const end = new Date(stage.targetEndDate);
      if (now > end) {
        return 'DELAYED';
      }
    }
    return 'IN_PROGRESS';
  }

  return stage.status || 'NOT_STARTED';
}

// Calculate status for Workflow-Driven stage
async function calculateWorkflowDrivenStatus(stage: any): Promise<string> {
  if (stage.completedDate) {
    return 'COMPLETED';
  }

  try {
    switch (stage.key) {
      case 'governance_framework':
        return 'COMPLETED';

      case 'stakeholder_registry': {
        const count = await prisma.skcStakeholderRegistration.count();
        // Assume active / In Progress if we have records, or Completed if closed
        const now = new Date();
        const registryEnd = new Date('2026-10-13T23:59:59');
        if (now > registryEnd) return 'COMPLETED';
        return count > 0 ? 'IN_PROGRESS' : 'UPCOMING';
      }

      case 'public_participation': {
        const count = await prisma.skcStakeholderRegistration.count({
          where: { status: 'APPROVED' }
        });
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'field_consultations': {
        const count = await prisma.consultationSubmission.count();
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'evidence_collection': {
        const count = await prisma.skcEvidence.count();
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'draft_findings': {
        const count = await prisma.skcFinding.count();
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'validation_round': {
        const count = await prisma.skcFinding.count({
          where: { status: 'VALIDATION' }
        });
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'expert_review': {
        const count = await prisma.skcFinding.count({
          where: { status: 'EXPERT_REVIEW' }
        });
        return count > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      case 'final_report': {
        const count = await prisma.skcFinding.count({
          where: { status: 'PUBLISHED' }
        });
        return count > 0 ? 'COMPLETED' : 'NOT_STARTED';
      }

      default:
        return stage.status || 'NOT_STARTED';
    }
  } catch (error) {
    console.error(`Workflow evaluation error for ${stage.key}:`, error);
    return stage.status || 'NOT_STARTED';
  }
}

// Get helper user name
async function getUserName(userId: string): Promise<string> {
  if (!userId) return 'System';
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });
    return user ? (user.name || user.email) : 'Secretariat Administrator';
  } catch {
    return 'Secretariat Administrator';
  }
}

// --- CONTROLLER HANDLERS ---

// GET /api/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle
export const getLifecycle = async (req: Request, res: Response) => {
  try {
    // Force seed to ensure updates are applied
    await seedDefaultStages();

    const stages = await prisma.skcLifecycleStage.findMany({
      orderBy: { order: 'asc' }
    });

    // Dynamically calculate statuses where applicable
    const resolvedStages = await Promise.all(stages.map(async (stage) => {
      let resolvedStatus = stage.status;
      if (stage.statusMode === 'DATE_DRIVEN') {
        resolvedStatus = calculateDateDrivenStatus(stage);
      } else if (stage.statusMode === 'WORKFLOW_DRIVEN') {
        resolvedStatus = await calculateWorkflowDrivenStatus(stage);
      }
        return {
          ...stage,
          status: resolvedStatus,
          displaySchedule: STAGE_SCHEDULES[stage.key] || null
        };
    }));

    // Find the latest updatedAt timestamp across stages and audit logs
    const latestStageUpdate = stages.reduce((max, s) => s.updatedAt > max ? s.updatedAt : max, new Date(0));
    const latestAudit = await prisma.skcLifecycleAuditLog.findFirst({
      orderBy: { timestamp: 'desc' }
    });
    const lastUpdated = latestAudit && latestAudit.timestamp > latestStageUpdate
      ? latestAudit.timestamp.toISOString()
      : latestStageUpdate.toISOString();

    res.json({
      success: true,
      data: {
        cycle: '2026',
        stages: resolvedStages,
        lastUpdated
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to retrieve assessment lifecycle' });
  }
};

// GET /api/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle/audit-history
export const getAuditHistory = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.skcLifecycleAuditLog.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json({
      success: true,
      data: logs
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to retrieve audit logs' });
  }
};

// POST /api/admin/skc/assessment-cycles/2026/lifecycle
export const createLifecycleStage = async (req: Request, res: Response) => {
  try {
    const { key, title, description, status, order, weight, startDate, targetEndDate, progressPercent, publicVisible, linkedRoute, statusMode } = req.body;
    const userId = (req as any).user?.userId;
    const adminName = await getUserName(userId);

    if (!key || !title) {
      return res.status(400).json({ success: false, error: 'Stage key and title are required' });
    }

    const newStage = await prisma.skcLifecycleStage.create({
      data: {
        key,
        title,
        description,
        status: status || 'NOT_STARTED',
        order: order || 1,
        weight: weight !== undefined ? Number(weight) : 10,
        startDate: startDate ? new Date(startDate) : null,
        targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
        progressPercent: progressPercent || 0,
        publicVisible: publicVisible !== undefined ? publicVisible : true,
        linkedRoute,
        statusMode: statusMode || 'MANUAL',
        updatedBy: adminName
      }
    });

    // Record initial audit log
    await prisma.skcLifecycleAuditLog.create({
      data: {
        stageId: newStage.id,
        stageKey: newStage.key,
        previousStatus: 'NONE',
        newStatus: newStage.status,
        updatedBy: adminName,
        reason: 'Stage creation initialized',
        publicVisible: newStage.publicVisible
      }
    });

    res.json({ success: true, data: newStage });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create lifecycle stage' });
  }
};

// PATCH /api/admin/skc/lifecycle/:stageId
export const updateLifecycleStage = async (req: Request, res: Response) => {
  try {
    const stageId = requireString(req.params.stageId);
    const { title, description, status, order, weight, startDate, targetEndDate, completedDate, progressPercent, publicVisible, linkedRoute, statusMode, reason } = req.body;
    const userId = (req as any).user?.userId;
    const adminName = await getUserName(userId);

    const existingStage = await prisma.skcLifecycleStage.findUnique({
      where: { id: stageId }
    });

    if (!existingStage) {
      return res.status(404).json({ success: false, error: 'Stage not found' });
    }

    // Determine target status update
    let targetStatus = status !== undefined ? status : existingStage.status;
    
    // Create new stage payload
    const updatedStage = await prisma.skcLifecycleStage.update({
      where: { id: stageId },
      data: {
        title: title !== undefined ? title : existingStage.title,
        description: description !== undefined ? description : existingStage.description,
        status: targetStatus,
        order: order !== undefined ? order : existingStage.order,
        weight: weight !== undefined ? Number(weight) : existingStage.weight,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingStage.startDate,
        targetEndDate: targetEndDate !== undefined ? (targetEndDate ? new Date(targetEndDate) : null) : existingStage.targetEndDate,
        completedDate: completedDate !== undefined ? (completedDate ? new Date(completedDate) : null) : existingStage.completedDate,
        progressPercent: progressPercent !== undefined ? progressPercent : existingStage.progressPercent,
        publicVisible: publicVisible !== undefined ? publicVisible : existingStage.publicVisible,
        linkedRoute: linkedRoute !== undefined ? linkedRoute : existingStage.linkedRoute,
        statusMode: statusMode !== undefined ? statusMode : existingStage.statusMode,
        updatedBy: adminName
      }
    });

    // Record audit log if status changed
    if (existingStage.status !== updatedStage.status) {
      await prisma.skcLifecycleAuditLog.create({
        data: {
          stageId: updatedStage.id,
          stageKey: updatedStage.key,
          previousStatus: existingStage.status,
          newStatus: updatedStage.status,
          updatedBy: adminName,
          reason: reason || 'Manual override update',
          publicVisible: updatedStage.publicVisible
        }
      });
    }

    res.json({ success: true, data: updatedStage });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update lifecycle stage' });
  }
};

// DELETE /api/admin/skc/lifecycle/:stageId
export const deleteLifecycleStage = async (req: Request, res: Response) => {
  try {
    const stageId = requireString(req.params.stageId);
    const userId = (req as any).user?.userId;
    const adminName = await getUserName(userId);

    const existingStage = await prisma.skcLifecycleStage.findUnique({
      where: { id: stageId }
    });

    if (!existingStage) {
      return res.status(404).json({ success: false, error: 'Stage not found' });
    }

    await prisma.skcLifecycleStage.delete({
      where: { id: stageId }
    });

    // Record audit log of deletion
    await prisma.skcLifecycleAuditLog.create({
      data: {
        stageId: stageId,
        stageKey: existingStage.key,
        previousStatus: existingStage.status,
        newStatus: 'DELETED',
        updatedBy: adminName,
        reason: 'Stage removed from cycle lifecycle',
        publicVisible: false
      }
    });

    res.json({ success: true, message: 'Lifecycle stage successfully removed' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete lifecycle stage' });
  }
};

// POST /api/admin/skc/lifecycle/reorder
export const reorderStages = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body; // Array of { id: string, order: number }
    const userId = (req as any).user?.userId;
    const adminName = await getUserName(userId);

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, error: 'Orders array is required' });
    }

    await Promise.all(orders.map(async (item) => {
      await prisma.skcLifecycleStage.update({
        where: { id: item.id },
        data: {
          order: item.order,
          updatedBy: adminName
        }
      });
    }));

    res.json({ success: true, message: 'Lifecycle stages successfully reordered' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to reorder lifecycle stages' });
  }
};
