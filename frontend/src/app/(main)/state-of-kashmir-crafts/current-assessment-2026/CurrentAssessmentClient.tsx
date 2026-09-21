"use client";

import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaHammer,
  FaBuilding,
  FaGlobe,
  FaStore,
  FaLaptop,
  FaUserGraduate,
  FaUniversity,
  FaLandmark,
  FaFlag,
  FaNewspaper,
  FaPlane,
  FaUser,
  FaUsers,
  FaUserTie,
  FaSeedling,
  FaFileAlt,
  FaBalanceScale,
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBookOpen,
  FaCheckCircle,
  FaVideo,
  FaMicrophone,
  FaMapMarkedAlt,
  FaShoppingBag,
  FaHands,
  FaSpinner,
  FaCircle,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaCalendarCheck,
  FaFileSignature,
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";
import { assessmentPipeline, currentAssessmentStage } from "@/config/assessment";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { currentAssessmentHeroFallback } from '@/config/heroFallbacks';
import AssessmentLifecycleTracker from '@/components/assessment/AssessmentLifecycleTracker';
import { generateEngagementSnapshot } from '@/lib/skc/engagement/ConsultationExperimentEngine';

const IconMap: Record<string, any> = {
  FaHammer, FaBuilding, FaGlobe, FaStore, FaLaptop, FaUserGraduate, FaUniversity,
  FaLandmark, FaFlag, FaNewspaper, FaPlane, FaUser, FaUsers, FaUserTie, FaSeedling,
  FaFileAlt, FaBalanceScale, FaChartLine, FaCalendarAlt, FaMapMarkerAlt, FaBookOpen,
  FaCheckCircle, FaVideo, FaMicrophone, FaMapMarkedAlt, FaShoppingBag, FaHands,
};

const resolveIcon = (iconName: string, fallback: any) => IconMap[iconName] || fallback;


async function safeFetch(path: string) {
  try {
    const url = path.startsWith('http') 
      ? path 
      : path.startsWith('/api/backend/') 
        ? path 
        : `/api/backend${path.replace(/^\/api/, '')}`;
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return { success: false };
    return response.json();
  } catch {
    return { success: false };
  }
}
export default function CurrentAssessmentClient() {
  const engagementSnapshot = React.useMemo(() => generateEngagementSnapshot(), []);
  const [overview, setOverview] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [hearings, setHearings] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [lifecycle, setLifecycle] = useState<any[]>([]);
  const [lifecycleLastUpdated, setLifecycleLastUpdated] = useState<string>('');
  
  const [workflowConfig, setWorkflowConfig] = useState<any[] | null>(null);
  const [participationConfig, setParticipationConfig] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [overviewRes, progressRes, timelineRes, hearingsRes, institutionsRes, workflowRes, partRes, lifecycleRes] = await Promise.all([
          safeFetch('/api/backend/public/skc/overview'),
          safeFetch('/api/backend/public/skc/progress'),
          safeFetch('/api/backend/public/skc/timeline'),
          safeFetch('/api/backend/skc/hearings/public'),
          safeFetch('/api/backend/skc/institutions/public'),
          safeFetch('/api/backend/skc/config/workflowSteps').catch(() => ({ success: false })),
          safeFetch('/api/backend/skc/config/participationGroups').catch(() => ({ success: false })),
          safeFetch('/api/backend/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle').catch(() => ({ success: false, data: null }))
        ]);
        
        if(overviewRes.success) setOverview(overviewRes.data);
        if(progressRes.success) setProgress(progressRes.data);
        if(timelineRes.success) setTimeline(timelineRes.data);
        if(hearingsRes.success) setHearings(hearingsRes.data);
        if(institutionsRes.success) setInstitutions(institutionsRes.data);
        if(workflowRes.success && Array.isArray(workflowRes.data)) setWorkflowConfig(workflowRes.data);
        if(partRes.success && Array.isArray(partRes.data)) setParticipationConfig(partRes.data);
        
        if (lifecycleRes && lifecycleRes.success && lifecycleRes.data) {
          setLifecycle(lifecycleRes.data.stages.filter((s: any) => s.publicVisible));
          setLifecycleLastUpdated(lifecycleRes.data.lastUpdated);
        } else {
          setLifecycle([
            { key: "governance_framework", title: "Governance Framework", status: "Completed", description: 'Institutional rules and standards for the assessment.', order: 1, linkedRoute: '/state-of-kashmir-crafts/governance-framework', displaySchedule: 'Aug–Sep 2026' },
            { key: "stakeholder_registry", title: "Stakeholder Registry System", status: "Completed", description: 'Registry of individual craftspeople, professionals, and institutions.', order: 2, linkedRoute: '/state-of-kashmir-crafts/stakeholder-registry', displaySchedule: 'Aug–Sep 2026' },
            { key: "stakeholder_registration", title: "Stakeholder Registration", status: "Active", description: 'Public registration for individuals and institutions.', order: 3, displaySchedule: '31 Aug 2026 – 26 Jan 2027' },
            { key: "public_participation", title: "Public Participation", status: "Active", description: 'Active surveys, questionnaires, and testimonies open to stakeholders.', order: 4, linkedRoute: '/state-of-kashmir-crafts/participate', progressPercent: 46, displaySchedule: '31 Aug 2026 – 22 Mar 2027' },
            { key: "public_hearing_orientation", title: "Public Hearing Orientation", status: "Scheduled", description: 'Orientation for stakeholders regarding hearing procedures.', order: 5, displaySchedule: '23 Oct 2026' },
            { key: "public_hearings", title: "Public Hearings", status: "Scheduled", description: 'Formal webcasts and testimonies recorded from key craft zones.', order: 6, linkedRoute: '/state-of-kashmir-crafts/public-hearings', displaySchedule: '16 Nov 2026 – 15 Mar 2027' },
            { key: "draft_findings", title: "Draft Findings", status: "Scheduled", description: 'Preliminary report chapters opened for public commentary and correction.', order: 7, linkedRoute: '/state-of-kashmir-crafts/draft-findings', displaySchedule: '17 Mar – 13 Apr 2027' },
            { key: "draft_review", title: "Draft Review", status: "Scheduled", description: 'Initial review of the drafted findings.', order: 8, displaySchedule: '14 Apr – 4 May 2027' },
            { key: "validation_round", title: "Validation", status: "Scheduled", description: 'Multi-district check rounds to audit numbers and regional facts.', order: 9, linkedRoute: '/state-of-kashmir-crafts/validation-round', displaySchedule: '7–11 May 2027' },
            { key: "expert_review", title: "Expert Review", status: "Scheduled", description: 'Oversight panel and advisory review of final assessment draft.', order: 10, linkedRoute: '/state-of-kashmir-crafts/expert-review', displaySchedule: '14–23 May 2027' },
            { key: "final_report_publication", title: "Final Report Publication", status: "Scheduled", description: 'The compiled, approved State of Kashmir Crafts 2026 assessment report.', order: 11, linkedRoute: '/state-of-kashmir-crafts/final-report', displaySchedule: '30 May 2027' }
          ]);
          setLifecycleLastUpdated(new Date().toISOString());
        }
        
      } catch {
        // API unavailable — keep static defaults
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const totalSubmissions = overview?.totalSubmissions || 0;
  const districtsCount = overview?.districtsRepresented || 0;
  const institutionsCount = institutions.length;
  const totalEvidence = overview?.totalEvidenceFiles || 0;
  
  // Progress calculations
  const totalTarget = 500;
  
  const weightMap: Record<string, number> = {
    governance_framework: 10,
    stakeholder_registry: 10,
    evidence_collection: 15,
    stakeholder_registration: 10,
    public_participation: 15,
    field_consultations: 10,
    public_hearings: 5,
    draft_findings: 10,
    validation_round: 5,
    expert_review: 5,
    final_report: 5
  };

  const statusMultiplier: Record<string, number> = {
    COMPLETED: 1.0,
    IN_PROGRESS: 0.5,
    SCHEDULED: 0.25,
    OPENS_17_AUG: 0.0,
    NOT_STARTED: 0.0
  };

  const calculatedProgress = lifecycle.reduce((acc, step) => {
    const weight = weightMap[step.key] || 0;
    const multiplier = statusMultiplier[step.status] || 0;
    return acc + (weight * multiplier);
  }, 0);

  const progressPercentage = Math.round(calculatedProgress) || 0;

  const mockTotalStakeholders = engagementSnapshot.cumulativeIndividualEngagement;
  const mockTotalResponses = engagementSnapshot.totalEngagement > 0 ? (26 + Math.floor(engagementSnapshot.totalEngagement * 0.002)) : 0;
  const mockInstitutionsCount = engagementSnapshot.cumulativeInstitutionalEngagement;
  const mockDistrictsCount = 10;
  const mockHearingsLength = 31;



  const getHearingDate = (hearing: any): Date | null => {
    // Some backend fields might return empty objects {} instead of null
    const getValidDateStr = (val: any) => (val && typeof val === 'string' && val.trim().length > 0) ? val : null;
    const raw = getValidDateStr(hearing.date) ?? getValidDateStr(hearing.scheduledDate) ?? getValidDateStr(hearing.startAt) ?? getValidDateStr(hearing.rawScheduledDate);
    if (!raw) return null;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const completedHearings = hearings.filter((h: any) => h.status === 'COMPLETED').length;
  const scheduledHearingsCount = hearings.length > 0 ? hearings.length : mockHearingsLength;

  // Canonical current date
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Kolkata', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  const kashmirDateString = formatter.format(now);
  const today = new Date(kashmirDateString + 'T00:00:00Z');

  // Canonical next hearing logic
  const formalHearingsMap = new Map();
  hearings.filter((h: any) => h.eventType === 'PUBLIC_HEARING').forEach((h: any) => {
    const d = getHearingDate(h);
    const key = d ? h.title + d.getTime() : h.id;
    if (!formalHearingsMap.has(key)) {
      formalHearingsMap.set(key, h);
    }
  });
  const formalHearings = Array.from(formalHearingsMap.values());
  const sortedHearings = [...formalHearings]
    .filter((h: any) => getHearingDate(h) !== null)
    .sort((a: any, b: any) => getHearingDate(a).getTime() - getHearingDate(b).getTime());
  
  const nextScheduledHearing = sortedHearings.find((h: any) => {
    const hDate = getHearingDate(h);
    const hDay = new Date(hDate.toISOString().split('T')[0] + 'T00:00:00Z');
    return hDay >= today;
  });

  const nextHearingText = nextScheduledHearing ? 'Next: ' + formatTimelineDate(getHearingDate(nextScheduledHearing).toISOString()) : '';


  const participationGoals = [

    { label: "Stakeholders Registered", target: 100000, current: totalSubmissions > 0 ? totalSubmissions : mockTotalStakeholders, suffix: "+", desc: "Across artisans, businesses, institutions, researchers, and public representatives." },
    { label: "Institutional Participants", target: 500, current: institutionsCount > 0 ? institutionsCount : mockInstitutionsCount, suffix: "+", desc: "Universities, craft clusters, trade bodies, and government departments." },
    { label: "District Coverage", target: 10, current: districtsCount > 0 ? districtsCount : mockDistrictsCount, suffix: " Districts", desc: "Comprehensive mapping across all 10 districts of the Kashmir Valley." },
    { label: "Consultation Responses", target: 10000, current: totalSubmissions > 0 ? totalSubmissions : mockTotalResponses, suffix: "+", desc: "Structured baseline data collected through sector-specific consultation instruments." },
    { label: "Evidence Submissions", target: 2000, current: totalEvidence > 0 ? totalEvidence : mockInstitutionsCount > 0 ? (3 + Math.floor(mockInstitutionsCount * 0.15)) : 0, suffix: "+", desc: "Formal documents, testimonies, photos, and reports submitted to the repository." },
    { label: "Public Hearings", target: scheduledHearingsCount, current: completedHearings, suffix: "", exactTarget: true, percentLabel: "Conducted", desc: `${scheduledHearingsCount} hearings scheduled across the 2026-27 assessment programme. ${nextHearingText}` },
  ];

  const defaultWorkflowSteps = [
    { phaseGroup: "Foundation", title: "Governance Framework", desc: "Define scope, principles, methodology, and public accountability.", status: "In Preparation", icon: "FaBalanceScale" },
    { phaseGroup: "Foundation", title: "Stakeholder Enrollment", desc: "Register artisans, institutions, experts, citizens, and organizations online.", status: "Currently Open", icon: "FaUsers" },
    { phaseGroup: "Participation", title: "Public Participation", desc: "Collect structured online responses from all stakeholder categories.", status: "Currently Open", icon: "FaLaptop" },
    { phaseGroup: "Participation", title: "Structured Data Collection", desc: "Use category-specific consultation instruments and tagged responses.", status: "Currently Open", icon: "FaChartLine" },
    { phaseGroup: "Participation", title: "Virtual Consultations", desc: "Enable written submissions, online meetings, and stakeholder follow-ups.", status: "Scheduled", icon: "FaVideo" },
    { phaseGroup: "Participation", title: "Online Public Hearings", desc: "Host topic-based virtual hearings on major craft-sector priorities.", status: "Scheduled", icon: "FaMicrophone" },
    { phaseGroup: "Participation", title: "Evidence Repository", desc: "Collect documents, photos, reports, testimonies, and supporting evidence.", status: "Currently Open", icon: "FaFileAlt" },
    { phaseGroup: "Analysis", title: "Draft Findings", desc: 'Publish "What We Heard" before final recommendations.', status: "Pending", icon: "FaNewspaper" },
    { phaseGroup: "Analysis", title: "Validation Round", desc: "Allow stakeholders to correct, clarify, and strengthen findings.", status: "Pending", icon: "FaCheckCircle" },
    { phaseGroup: "Analysis", title: "Expert Review", desc: "Invite experts to review findings, evidence, and recommendations.", status: "Pending", icon: "FaUserGraduate" },
    { phaseGroup: "Publication", title: "Final Report", desc: "Executive Summary, Evidence Index, Media Kit.", status: `Scheduled: ${formatTimelineDate(SKC_2026_SCHEDULE.finalReport.plannedStart)}`, icon: "FaBookOpen", isFinal: true },
  ];

  const defaultParticipationGroups = [
    {
      group: "Artisan & Production",
      roles: [
        { type: "Artisan / Weaver", icon: "FaHammer", desc: "Share production realities, skill challenges, and livelihood experiences." },
        { type: "Manufacturer", icon: "FaBuilding", desc: "Discuss production systems, labor, scaling, and infrastructure needs." },
        { type: "Cooperative / Producer Group", icon: "FaUsers", desc: "Share collective experiences, procurement, and market access challenges." }
      ]
    },
    {
      group: "Trade & Markets",
      roles: [
        { type: "Exporter", icon: "FaGlobe", desc: "Provide insights on exports, tariffs, buyers, compliance, and international markets." },
        { type: "Retailer", icon: "FaStore", desc: "Discuss domestic demand, consumer preferences, and retail trends." },
        { type: "Online Seller", icon: "FaLaptop", desc: "Share experiences with e-commerce, logistics, and digital marketing." }
      ]
    },
    {
      group: "Education & Research",
      roles: [
        { type: "Student", icon: "FaUserGraduate", desc: "Contribute educational perspectives and future workforce insights." },
        { type: "Researcher", icon: "FaFileAlt", desc: "Share studies, evidence, data, and sector analysis." },
        { type: "University / Academic Institution", icon: "FaUniversity", desc: "Provide institutional, research, and curriculum perspectives." }
      ]
    },
    {
      group: "Government & Policy",
      roles: [
        { type: "Government Department", icon: "FaLandmark", desc: "Share policy, implementation, program, and official perspectives." },
        { type: "Political Party", icon: "FaFlag", desc: "Contribute policy priorities and legislative perspectives related to crafts." },
        { type: "Financial Institution", icon: "FaUniversity", desc: "Provide perspectives on credit, finance, insurance, and enterprise support." }
      ]
    },
    {
      group: "Society & Community",
      roles: [
        { type: "Citizen", icon: "FaUser", desc: "Share consumer perspectives, trust, and appreciation of Kashmir crafts." },
        { type: "Youth Participant", icon: "FaSeedling", desc: "Contribute perspectives on skills, careers, innovation, and future opportunities." },
        { type: "Women Entrepreneur", icon: "FaUserTie", desc: "Share experiences related to entrepreneurship, leadership, and market participation." },
        { type: "Civil Society Organization", icon: "FaUsers", desc: "Share community-level experiences and development priorities." },
        { type: "Heritage Organization", icon: "FaBookOpen", desc: "Provide insights on conservation, documentation, and cultural preservation." }
      ]
    },
    {
      group: "Communication & Tourism",
      roles: [
        { type: "Media Professional", icon: "FaNewspaper", desc: "Report on craft sector developments, document stories, and raise awareness." },
        { type: "Tourism Stakeholder", icon: "FaMapMarkedAlt", desc: "Share experiences on craft tourism, visitor economy, and heritage trails." }
      ]
    },
    {
      group: "Global Community",
      roles: [
        { type: "Diaspora Member", icon: "FaGlobe", desc: "Contribute global perspectives and ideas for international promotion of Kashmir crafts." },
        { type: "International Buyer / Collector", icon: "FaShoppingBag", desc: "Share market requirements, quality expectations, and sourcing feedback." },
        { type: "International Researcher", icon: "FaBookOpen", desc: "Provide comparative research insights, academic evidence, and sector analysis." },
        { type: "International Organization / Development Agency", icon: "FaHands", desc: "Share development perspectives, program insights, and partnership opportunities." },
        { type: "International Museum / Cultural Institution", icon: "FaUniversity", desc: "Provide perspectives on collection, preservation, and cultural diplomacy." }
      ]
    }
  ];

  const workflowSteps = (workflowConfig && workflowConfig.length > 0) ? workflowConfig : defaultWorkflowSteps;
  const participationGroups = (participationConfig && participationConfig.length > 0) ? participationConfig : defaultParticipationGroups;

  const finalTotalStakeholders = totalSubmissions > 0 ? totalSubmissions : mockTotalStakeholders;
  const finalTotalResponses = totalSubmissions > 0 ? totalSubmissions : mockTotalResponses;
  const finalInstitutionsCount = institutionsCount > 0 ? institutionsCount : mockInstitutionsCount;
  const finalDistrictsCount = districtsCount > 0 ? districtsCount : mockDistrictsCount;
  const finalTotalEvidence = totalEvidence > 0 ? totalEvidence : (mockInstitutionsCount > 0 ? (3 + Math.floor(mockInstitutionsCount * 0.15)) : 0);

  const defaultDistrictTargets = [
    { name: "Srinagar", stakeholdersTarget: 33000, institutionsTarget: 165 },
    { name: "Anantnag", stakeholdersTarget: 9200, institutionsTarget: 46 },
    { name: "Baramulla", stakeholdersTarget: 8500, institutionsTarget: 43 },
    { name: "Budgam", stakeholdersTarget: 13100, institutionsTarget: 66 },
    { name: "Bandipora", stakeholdersTarget: 6200, institutionsTarget: 31 },
    { name: "Ganderbal", stakeholdersTarget: 6900, institutionsTarget: 35 },
    { name: "Kulgam", stakeholdersTarget: 6200, institutionsTarget: 31 },
    { name: "Kupwara", stakeholdersTarget: 3800, institutionsTarget: 19 },
    { name: "Pulwama", stakeholdersTarget: 7700, institutionsTarget: 39 },
    { name: "Shopian", stakeholdersTarget: 5400, institutionsTarget: 27 },
  ];

  const districtIntelligence = defaultDistrictTargets.map(d => {
    const mockEngagement = (engagementSnapshot.districts as Record<string, number>)[d.name] || 0;
    const isMockMode = totalSubmissions === 0;
    const currentStakeholders = isMockMode ? mockEngagement : 0; // Ideally from real DB, but 0 fallback works for now
    const currentInstitutions = isMockMode ? Math.round(finalInstitutionsCount * (mockEngagement / Math.max(1, finalTotalStakeholders))) : 0;
    
    return {
      ...d,
      currentStakeholders,
      currentInstitutions,
      status: currentStakeholders > 0 ? "Active Coverage" : "Opens 17 October 2026"
    };
  });

  type PhaseStatus = "completed" | "current" | "upcoming";

  interface AssessmentPhase {
    id: string;
    label: string;
    dateLabel: string | React.ReactNode;
    title: string;
    startDate: string;
    endDate: string;
    icon: any;
  }

  
  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const startStr = formatTimelineDate(start);
    const endStr = formatTimelineDate(end);
    const startYear = startStr.match(/\d{4}$/)?.[0];
    const endYear = endStr.match(/\d{4}$/)?.[0];
    if (startYear && endYear && startYear === endYear) {
      return startStr.replace(new RegExp(' ' + startYear + '$'), '') + ' - ' + endStr;
    }
    return startStr + ' - ' + endStr;
  };

  const assessmentPhases: AssessmentPhase[] = [
    {
      id: "current-phase",
      label: "CURRENT PHASE",
      dateLabel: "Current Assessment Phase",
      title: "Status: In Progress",
      startDate: "2026-06-01",
      endDate: SKC_2026_SCHEDULE.finalReport.plannedStart,
      icon: FaChartLine
    },
    {
      id: "registration",
      label: "REGISTRATION",
      dateLabel: formatTimelineDate(SKC_2026_SCHEDULE.registration.plannedStart),
      title: "Stakeholder Registration Opens",
      startDate: SKC_2026_SCHEDULE.registration.plannedStart,
      endDate: SKC_2026_SCHEDULE.registration.plannedEnd,
      icon: FaUsers
    },
    {
      id: "public-participation",
      label: "PUBLIC PARTICIPATION",
      dateLabel: formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart),
      title: "Public Participation Opens",
      startDate: SKC_2026_SCHEDULE.publicParticipation.plannedStart,
      endDate: SKC_2026_SCHEDULE.publicParticipation.plannedEnd,
      icon: FaFileSignature
    },
    {
      id: "public-hearings",
      label: "PUBLIC HEARINGS",
      dateLabel: formatDateRange(SKC_2026_SCHEDULE.hearings.plannedStart, SKC_2026_SCHEDULE.hearings.plannedEnd),
      title: "Public Hearing Programme",
      startDate: SKC_2026_SCHEDULE.hearings.plannedStart,
      endDate: SKC_2026_SCHEDULE.hearings.plannedEnd,
      icon: FaCalendarAlt
    },
    {
      id: "evidence-review",
      label: "EVIDENCE AND REVIEW",
      dateLabel: formatDateRange(SKC_2026_SCHEDULE.review.plannedStart, SKC_2026_SCHEDULE.expertReview.plannedStart),
      title: "Evidence Review, Validation and Expert Review",
      startDate: SKC_2026_SCHEDULE.review.plannedStart,
      endDate: SKC_2026_SCHEDULE.expertReview.plannedStart,
      icon: FaLandmark
    },
    {
      id: "final-report",
      label: "FINAL REPORT",
      dateLabel: formatTimelineDate(SKC_2026_SCHEDULE.finalReport.plannedStart),
      title: "Final Report Tabled",
      startDate: SKC_2026_SCHEDULE.finalReport.plannedStart,
      endDate: SKC_2026_SCHEDULE.finalReport.plannedStart,
      icon: FaFileAlt
    },
  ];

  function getIndiaDate(): Date {
    const indiaDateString = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    return new Date(`${indiaDateString}T00:00:00+05:30`);
  }

  function parseIndiaDate(date: string, endOfDay = false): Date {
    return new Date(
      `${date}T${endOfDay ? "23:59:59" : "00:00:00"}+05:30`
    );
  }

  function getPhaseStatus(phase: AssessmentPhase): PhaseStatus {
    const today = getIndiaDate();
    const start = parseIndiaDate(phase.startDate);
    const end = parseIndiaDate(phase.endDate, true);

    if (today < start) return "upcoming";
    if (today > end) return "completed";

    return "current";
  }

  const statusContent: Record<
    PhaseStatus,
    { label: string; className: string }
  > = {
    completed: {
      label: "Completed",
      className: "text-emerald-700 bg-emerald-50",
    },
    current: {
      label: "In Progress",
      className: "text-amber-800 bg-amber-50",
    },
    upcoming: {
      label: "Upcoming",
      className: "text-slate-600 bg-slate-100",
    },
  };



  const getEventStatus = (hearing: any) => {
    const eventDate = getHearingDate(hearing);
    if (!eventDate) return 'Scheduled';
    const eventDay = new Date(eventDate.toISOString().split('T')[0] + 'T00:00:00Z');
    if (eventDay < today) return 'Completed';
    if (eventDay.getTime() === today.getTime()) return 'Live / Ongoing';
    return 'Upcoming';
  };

  const programmeMilestones = hearings.filter(h => ['PROGRAMME_MILESTONE', 'INTERNAL_OPERATIONS', 'COMMUNICATIONS_MILESTONE', 'TECHNICAL_PREPARATION'].includes(h.eventType));
  const thematicConsultations = hearings.filter(h => ['ONGOING_STAKEHOLDER_ENGAGEMENT', 'THEMATIC_CONSULTATION', 'PREPARATORY_CONSULTATION', 'THEMATIC_ROUNDTABLE', 'INNOVATION_CONSULTATION', 'SOCIOECONOMIC_CONSULTATION', 'EXPERT_CONSULTATION', 'PUBLIC_CONSULTATION', 'FINANCIAL_CONSULTATION', 'REGIONAL_CONSULTATION', 'WORKSHOP', 'ACADEMIC_CONSULTATION', 'INTERNATIONAL_CONSULTATION', 'POLICY_CONSULTATION'].includes(h.eventType));
  const workflowEvents = hearings.filter(h => ['ASSESSMENT_WORKFLOW', 'INTERNAL_PANEL', 'EVIDENCE_ANALYSIS', 'DRAFTING_WORKFLOW', 'REVIEW_WORKFLOW'].includes(h.eventType));

  const groupedHearings: Record<string, any[]> = {};
  sortedHearings.forEach(e => {
    const date = getHearingDate(e);
    if (!date) return;
    const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).toUpperCase();
    if (!groupedHearings[month]) groupedHearings[month] = [];
    groupedHearings[month].push(e);
  });

  const completedHearingsCount = sortedHearings.filter(h => getEventStatus(h) === 'Completed').length;
  const upcomingHearingsCount = sortedHearings.filter(h => getEventStatus(h) !== 'Completed').length;
  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero pageKey="current-assessment-2026" fallbackConfig={currentAssessmentHeroFallback} />

      {/* 2. Status Board */}
      <section className="bg-gray-50 py-10 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto text-left">
            {assessmentPhases.map((phase) => {
              const status = getPhaseStatus(phase);
              const Icon = phase.icon;

              let cardClass = "";
              let statusText = "";
              let statusClass = "";

              if (phase.id === "current-phase") {
                cardClass = "bg-[#FAF8F5] border-2 border-brand-secondary/60 border-t-4 border-t-brand-secondary shadow-sm";
                statusText = "Status: In Progress";
                statusClass = "text-green-600 font-bold";
              } else {
                if (status === "completed") {
                  cardClass = "bg-gray-100 border border-gray-200 shadow-sm opacity-70";
                  statusText = "Status: Completed";
                  statusClass = "text-gray-500 font-bold";
                } else if (status === "current") {
                  cardClass = "bg-blue-50 border-2 border-blue-400 shadow-sm";
                  statusText = "Status: Open / Active";
                  statusClass = "text-blue-700 font-black";
                } else {
                  // upcoming
                  cardClass = "bg-white border border-gray-200/80 shadow-sm";
                  statusText = "Status: Upcoming";
                  statusClass = "text-gray-400 font-bold";
                }

                // Add mode qualifiers for specific steps
                if (phase.id === "final-report" && status === "upcoming") {
                  statusText += " | Mode: Online Only";
                } else if ((phase.id === "registration" || phase.id === "public-participation") && status === "upcoming") {
                  statusText += " | Mode: Online";
                } else if (phase.id === "public-hearings" && status === "upcoming") {
                  statusText = "Status: Scheduled";
                  statusClass = "text-purple-600 font-bold";
                }
              }

              return (
                <div key={phase.id} className={`p-4 rounded-2xl flex flex-col justify-between h-36 transition relative overflow-hidden group ${cardClass}`}>
                  <Icon className="absolute top-4 right-4 text-icon-on-light/[0.04] text-4xl group-hover:scale-110 transition-transform duration-300" />
                  
                  <div className="flex justify-between items-center w-full relative z-10">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[#8E7868] block">
                      {phase.label}
                    </span>
                  </div>
                  
                  <div className="relative z-10">
                    <span className="text-xs font-black text-brand-dark leading-tight block">{phase.dateLabel}</span>
                    <span className="text-[10px] text-[#8E7868] font-bold block mt-1 leading-tight">{phase.title}</span>
                    <span className={`text-[8px] block mt-1 ${statusClass}`}>{statusText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 3. Why This Assessment Matters */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-brand-dark mb-6">
                Why This Assessment Matters
              </h2>
              <div className="text-gray-600 mb-6 leading-relaxed space-y-4 font-medium">
                <p>The State of Kashmir Crafts Assessment 2026–2027 is a flagship annual assessment designed to create a credible public record of Kashmir’s handicraft ecosystem.</p>
                <p>It will document the voices of artisans, manufacturers, exporters, retailers, researchers, institutions, citizens, and public representatives through structured online participation, evidence submissions, virtual hearings, validation, and expert review.</p>
                <p>This assessment matters because Kashmir crafts are not only products. They are livelihoods, inherited knowledge, cultural memory, tourism value, export identity, and community resilience.</p>
                <p>By establishing 2026 as the baseline year, KHCRF will be able to track yearly changes in artisan welfare, market access, youth participation, women-led enterprise, GI protection, digital commerce, tourism linkages, and heritage preservation.</p>
                <p>The goal is to support better decisions, stronger institutions, informed public dialogue, and a more accountable future for Kashmir’s craft sector.</p>
              </div>
              <div className="w-20 h-1 bg-brand-secondary rounded"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={FaHammer}
                title="Artisan Livelihoods"
                description="Assessing income, working conditions, and welfare programs."
              />
              <FeatureCard
                icon={FaLandmark}
                title="Heritage Preservation"
                description="Documenting dying crafts and traditional techniques."
              />
              <FeatureCard
                icon={FaGlobe}
                title="Market & Export Realities"
                description="Understanding global demand, barriers, and opportunities."
              />
              <FeatureCard
                icon={FaUserGraduate}
                title="Youth & Future Skills"
                description="Analyzing skill transfer and youth participation in crafts."
              />
              <FeatureCard
                icon={FaBalanceScale}
                title="GI, Authenticity & Trust"
                description="Evaluating Geographical Indication effectiveness and counterfeit issues."
              />
              <FeatureCard
                icon={FaPlane}
                title="Tourism & Craft Economy"
                description="Exploring the intersection of heritage tourism and artisanal sales."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Assessment Workflow */}
      <section className="py-24 bg-white border-t border-gray-100 relative">
        <AssessmentLifecycleTracker liveStages={lifecycle} />
      </section>

      {/* 5. Stakeholder Participation Gateway */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">
              Choose Your Participation Path
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              The State of Kashmir Crafts Assessment 2026–2027 seeks perspectives from every part of the handicrafts ecosystem. Select the category that best represents your experience to access a consultation pathway designed specifically for your role.
            </p>
          </div>
          
          <div className="space-y-16">
            {participationGroups.map((group: any, groupIdx: number) => (
              <div key={groupIdx}>
                <h3 className="text-2xl font-black text-brand-secondary mb-8 border-b border-gray-200 pb-4">{group.group}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.roles.map((role: any) => (
                    <div
                      key={role.type}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-full flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-brand-primary transition duration-300">
                      {(() => {
                        const RoleIcon = resolveIcon(role.icon, FaUser);
                        return <RoleIcon data-ui-icon  className="text-4xl  mb-4" />;
                      })()}
                      <h4 className="font-bold text-gray-900 mb-3">{role.type}</h4>
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">{role.desc}</p>
                      <Link
                        href={`/state-of-kashmir-crafts/participate?type=${role.type
                          .toLowerCase()
                          .replace(/ \/ /g, "-")
                          .replace(/ /g, "-")}`}
                        className="mt-auto w-full px-4 py-3 bg-gray-50 text-brand-primary font-bold rounded-[12px] border border-gray-200 hover:bg-brand-primary hover:text-white transition shadow-sm text-sm">
                        Participate
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 2026–2027 Assessment Participation Goals */}
      <section className="py-24 universal-hero text-white relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-6">2026–2027 Assessment Participation Goals</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              The State of Kashmir Crafts assessment aims to engage stakeholders across all ten districts of Kashmir through structured participation, evidence submissions, institutional engagement, and public consultation.
            </p>
            
            <div className="bg-brand-secondary/10 border border-brand-secondary/30 rounded-xl p-6 text-center shadow-inner">
              <h3 className="text-brand-secondary font-black uppercase tracking-widest text-sm mb-3">
                Assessment Status: Lifecycle Underway
              </h3>
              <p className="text-gray-300 text-sm font-medium leading-relaxed">
                Governance and registry systems are active. Public Consultation & Hearings open on 17 October 2026.<br/>
                Progress indicators reflect the overall assessment lifecycle status.
              </p>
              {loading && <p className="text-brand-secondary mt-2 text-sm animate-pulse">Live data loading...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participationGoals.map((stat: any) => {
              const p = stat.target > 0 ? Math.min(100, Math.round((stat.current / stat.target) * 100)) : 0;
              return (
                <div
                  key={stat.label}
                  className="text-left border border-white/10 p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition duration-300 flex flex-col shadow-lg backdrop-blur-sm"
                >
                  <div className="flex justify-between items-end mb-5">
                    <div>
                      <div className="text-4xl font-black text-brand-secondary">
                        {stat.current} <span className="text-xl text-gray-400 font-bold">/ {stat.target}{(stat as any).exactTarget ? "" : stat.suffix}</span>
                      </div>
                      <div className="text-brand-secondary text-sm font-bold mt-1">
                        {p}% {(stat as any).percentLabel || ""}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white/20">{p}%</div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
                    <div 
                      className="h-full bg-brand-secondary transition-all duration-1000" 
                      style={{ width: `${p}%` }}
                    ></div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{stat.label}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed mt-auto">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* 6. Programme Calendar Dashboard */}
      {hearings.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Header / Current Position */}
            <div className="mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-primary mb-2 block">State of Kashmir Crafts 2026</span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Upcoming Hearings, Consultations & Programme Events</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                Follow scheduled public hearings, thematic consultations, stakeholder engagements and key milestones of the State of Kashmir Crafts 2026 assessment.
              </p>
            </div>

            {/* Status Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Current Phase</span>
                <span className="text-sm font-bold text-brand-dark">Public Hearings</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Today</span>
                <span className="text-sm font-bold text-brand-dark">{formatter.format(now)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">{nextScheduledHearing && getEventStatus(nextScheduledHearing) === 'Live / Ongoing' ? "Today's Hearing" : "Next Hearing"}</span>
                <span className="text-sm font-bold text-brand-dark">
                  {nextScheduledHearing ? (
                    <>
                      {getHearingDate(nextScheduledHearing)?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })} {"\u00B7"} {nextScheduledHearing.title} {"\u00B7"} {nextScheduledHearing.district || nextScheduledHearing.venue}
                    </>
                  ) : 'None Scheduled'}
                </span>
              </div>
            </div>

            {/* Next Event Panel */}
            {nextScheduledHearing && (
              <div className="mb-16 border border-brand-primary/20 bg-brand-primary/5 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4 md:mb-0">{getEventStatus(nextScheduledHearing) === 'Live / Ongoing' ? "Today's Public Hearing" : "Next Public Hearing"}</span>
                  <span className="bg-brand-primary text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm">
                    {getHearingDate(nextScheduledHearing)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })?.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-brand-dark mb-2 relative">{nextScheduledHearing.title}</h3>
                <div className="text-brand-primary font-bold mb-4 flex items-center gap-2 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {nextScheduledHearing.district || nextScheduledHearing.venue}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-3xl relative">
                  {nextScheduledHearing.description}
                </p>
              </div>
            )}

            {/* Programme Milestones */}
            {programmeMilestones.length > 0 && (
              <div className="mb-20">
                <h3 className="text-xl font-black text-brand-dark mb-8 border-b border-gray-200 pb-4">PROGRAMME MILESTONES</h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  {programmeMilestones.map((m, i) => {
                    const status = getEventStatus(m);
                    const isCompleted = status === 'Completed';
                    return (
                      <React.Fragment key={m.id}>
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              {getHearingDate(m)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })?.toUpperCase() || 'TBD'}
                            </span>
                          </div>
                        </div>
                        {i < programmeMilestones.length - 1 && (
                          <div className="w-4 h-px bg-gray-300 hidden md:block"></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Public Consultations & Hearings */}
            <div className="mb-20">
              <h3 className="text-xl font-black text-brand-dark mb-4 border-b border-gray-200 pb-4">PUBLIC CONSULTATIONS & HEARINGS</h3>
              <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">Youth engagement followed by the official scheduled public-hearing programme across craft, livelihood, market, authenticity, technology and policy themes.</p>
              
              <div className="bg-gray-50 rounded-2xl p-6 md:p-10 border border-gray-200 shadow-sm relative">
                {/* Status Summary */}
                <div className="absolute top-6 right-6 hidden md:flex gap-2 text-[10px] uppercase tracking-wider font-bold">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-sm">Completed: {completedHearingsCount}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-sm">Upcoming: {upcomingHearingsCount}</span>
                </div>

                {/* Youth in Crafts */}
                {thematicConsultations.filter(h => h.title.includes('Youth in Crafts')).map(h => {
                  const status = getEventStatus(h);
                  const isCompleted = status === 'Completed';
                  return (
                  <div key={h.id} className="mb-12 border-b border-gray-200 pb-12">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">General Public Consultation</div>
                    <div className="flex items-start gap-4 md:gap-8">
                      <div className="w-12 md:w-16 flex-shrink-0 text-center pt-1">
                        {isCompleted ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto mb-1"></div>
                        )}
                        <span className="text-xs font-bold text-gray-900">{getHearingDate(h)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })?.toUpperCase() || 'TBD'}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-gray-900">{h.title}</h4>
                          <span className="text-gray-500 text-sm">{"\u00B7"} {h.district}</span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">{h.description}</p>
                      </div>
                    </div>
                  </div>
                  );
                })}

                {/* Formal Hearings Timeline */}
                <div className="space-y-12">
                  {Object.keys(groupedHearings).map((month) => (
                    <div key={month}>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">{month}</div>
                      <div className="space-y-8 relative">
                        <div className="absolute left-6 md:left-8 top-2 bottom-2 w-px bg-gray-200 z-0 hidden md:block"></div>
                        {groupedHearings[month].map(h => {
                          const status = getEventStatus(h);
                          const isCompleted = status === 'Completed';
                          const isNext = h.id === nextScheduledHearing?.id;
                          return (
                            <div key={h.id} className={`flex items-start gap-4 md:gap-8 relative z-10 ${isNext ? 'bg-white p-4 -ml-4 rounded-xl border border-brand-primary/20 shadow-sm' : ''}`}>
                              <div className="w-12 md:w-16 flex-shrink-0 text-center pt-1 bg-gray-50">
                                {isCompleted ? (
                                  <svg className="w-5 h-5 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                ) : isNext ? (
                                  <div className="w-5 h-5 rounded-full border-4 border-brand-primary mx-auto mb-1 flex items-center justify-center bg-white"><div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div></div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto mb-1 bg-white"></div>
                                )}
                                <span className={`text-xs font-bold ${isNext ? 'text-brand-primary' : 'text-gray-900'}`}>{getHearingDate(h)?.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Asia/Kolkata' }) || 'TBD'}</span>
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className={`text-lg font-bold ${isNext ? 'text-brand-primary' : 'text-gray-900'}`}>{h.title}</h4>
                                  <span className="text-gray-500 text-sm">{"\u00B7"} {h.district}</span>
                                  {isNext && <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ml-2 tracking-wider">{getEventStatus(h) === 'Live / Ongoing' ? 'TODAY' : 'NEXT'}</span>}
                                </div>
                                <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">{h.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stage 07 Context */}
                <div className="mt-16 bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">Stage 07 {"\u00B7"} Public Hearings</div>
                  <div className="text-sm font-bold text-gray-900 mb-2">5 Sep 2026 {"\u2013"} 28 Nov 2026</div>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">Scheduled headline hearings conclude 14 Nov. The remaining programme window supports post-hearing testimony, evidence submissions, record completion and hearing follow-up.</p>
                </div>
              </div>
            </div>

            {/* Assessment & Publication Workflow */}
            <div className="mb-20">
              <h3 className="text-xl font-black text-brand-dark mb-8 border-b border-gray-200 pb-4">ASSESSMENT & PUBLICATION WORKFLOW</h3>
              
              {/* Preparatory Analysis */}
              <div className="mb-12">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Preparatory Analysis</div>
                <p className="text-gray-600 text-sm mb-6 max-w-3xl leading-relaxed">Internal evidence collation, technical review and recommendation development ahead of the formal findings and validation stages.</p>
                <div className="flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2 md:gap-4 pb-4 w-full">
                  {workflowEvents.filter(h => h.eventType === 'INTERNAL_PANEL' && !h.title.toLowerCase().includes('report')).map((h, i) => (
                    <React.Fragment key={h.id}>
                      <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                        <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">{getHearingDate(h)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) || 'TBD'}</div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{h.title}</div>
                      </div>
                      {i < workflowEvents.filter(e => e.eventType === 'INTERNAL_PANEL' && !e.title.toLowerCase().includes('report')).length - 1 && (
                        <div className="hidden md:flex items-center text-gray-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Formal 2027 Stages */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">Formal 2027 Assessment Stages</div>
                <div className="flex flex-col md:flex-row items-stretch border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                  {[
                    { stage: '08', title: 'Draft Findings', date: <>18 Mar 2027 {"\u2013"} 14 Apr 2027</> },
                    { stage: '09', title: 'Review', date: <>15 Apr 2027 {"\u2013"} 5 May 2027</> },
                    { stage: '10', title: 'Validation', date: <>8 May 2027 {"\u2013"} 12 May 2027</> },
                    { stage: '11', title: 'Expert Review', date: <>15 May 2027 {"\u2013"} 24 May 2027</> }
                  ].map((st) => (
                    <div key={st.stage} className="flex-1 p-4 md:p-5 border-b md:border-b-0 md:border-r border-gray-200 relative">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Stage {st.stage}</div>
                      <div className="font-bold text-gray-900 mb-1 text-sm">{st.title}</div>
                      <div className="text-xs text-gray-600 font-medium">{st.date}</div>
                      <div className="hidden md:block absolute right-[-10px] top-1/2 transform -translate-y-1/2 text-gray-300 z-10 bg-gray-50">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                      </div>
                    </div>
                  ))}
                  <div className="flex-1 p-4 md:p-5 bg-brand-primary text-white relative">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-brand-primary/50 mb-1">Stage 12</div>
                    <div className="font-bold mb-1 text-sm">Final Report</div>
                    <div className="text-xs text-white/90 font-bold">31 May 2027</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Activities */}
            {hearings.filter(h => h.title.includes('Government Briefing') || h.title.includes('Final Editorial') || h.title.includes('Advisory Council Approval')).length > 0 && (
              <div className="mb-20">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Supporting Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {hearings.filter(h => h.title.includes('Government Briefing') || h.title.includes('Final Editorial') || h.title.includes('Advisory Council Approval')).map(h => (
                    <div key={h.id} className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {h.title} (TBD)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}


      {/* 7. District Participation Dashboard */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6">
              District Participation Dashboard
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">{finalDistrictsCount} Districts</span>
              <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">{finalTotalStakeholders} Stakeholders</span>
              <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">{finalInstitutionsCount}+ Institutions</span>
              <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">{finalTotalResponses} Responses</span>
              <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">{finalTotalEvidence} Evidence Submissions</span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-end mb-2 relative z-10">
                <div>
                  <h3 className="font-bold text-brand-dark text-lg">District Coverage Progress</h3>
                  <p className="text-sm text-gray-500">{finalDistrictsCount > 0 ? "Active Coverage" : "Enrollment opens 17 October 2026."}</p>
                </div>
                <div className="text-2xl font-black text-brand-secondary">{finalDistrictsCount} / 10 <span className="text-sm text-gray-500 font-bold">Active</span></div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-4 relative z-10 overflow-hidden">
                <div className="h-full bg-brand-secondary transition-all duration-1000" style={{width: `${(finalDistrictsCount/10)*100}%`}}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {districtIntelligence.map((district: any) => (
              <div
                key={district.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-brand-secondary hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-brand-dark text-xl">{district.name}</h3>
                  <FaMapMarkerAlt className="text-xl text-gray-200 group-hover:text-brand-secondary transition-colors" />
                </div>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Stakeholders:</span>
                    <span className="font-bold text-brand-dark">{district.currentStakeholders} / {district.stakeholdersTarget}</span>
                  </div>
                  {/* Progress bar for stakeholders */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-brand-secondary h-1.5 rounded-full" style={{ width: `${Math.min(100, (district.currentStakeholders / district.stakeholdersTarget) * 100)}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-3">
                    <span className="text-gray-500 font-medium">Institutions:</span>
                    <span className="font-bold text-brand-dark">{district.currentInstitutions} / {district.institutionsTarget}</span>
                  </div>
                  {/* Progress bar for institutions */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (district.currentInstitutions / district.institutionsTarget) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className={`inline-block px-3 py-1 text-xs rounded-[10px] font-bold border mb-4 w-full text-center ${district.currentStakeholders > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                    Status: {district.status}
                  </div>
                  <Link href={`/state-of-kashmir-crafts/district/${district.name.toLowerCase()}`} className="block w-full text-center px-4 py-2 bg-gray-50 text-brand-primary font-bold text-sm rounded-[12px] hover:bg-brand-primary hover:text-white transition border border-gray-200 group-hover:border-brand-primary">
                    View District Dashboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          </main>
  );
}
// Trigger CI deployment



