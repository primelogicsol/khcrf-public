import { prisma } from '../config/db.js';

interface AuditLogOptions {
  module: string;
  recordType: string;
  recordId: string;
  action: string;
  previousValue?: string | null;
  newValue?: string | null;
  notes?: string | null;
  req?: any; // To extract user info, IP, userAgent if available
}

export const createAuditLog = async (options: AuditLogOptions) => {
  try {
    const performedById = options.req?.user?.id || null;
    const performedByEmail = options.req?.user?.email || null;
    const performedByRole = options.req?.user?.role || null;
    const ipAddress = options.req?.ip || options.req?.socket?.remoteAddress || null;
    const userAgent = options.req?.headers ? options.req.headers['user-agent'] : null;

    await prisma.dashboardAuditLog.create({
      data: {
        module: options.module,
        recordType: options.recordType,
        recordId: options.recordId,
        action: options.action,
        previousValue: options.previousValue || null,
        newValue: options.newValue || null,
        notes: options.notes || null,
        performedById,
        performedByEmail,
        performedByRole,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('[AuditLogger] Failed to create audit log:', error);
  }
};
