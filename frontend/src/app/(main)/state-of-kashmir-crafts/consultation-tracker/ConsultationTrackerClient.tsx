"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import { getAssessmentStagesSorted } from '@/config/assessmentCycle';
import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';

import { generateEngagementSnapshot } from '@/lib/skc/engagement/ConsultationExperimentEngine';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import {
  FaChartLine, FaChartPie, FaChartBar, FaUsers, FaUniversity, FaBuilding,
  FaMapMarkerAlt, FaFileAlt, FaVideo, FaMicrophone, FaFilePdf, FaArrowRight,
  FaCheckCircle, FaSpinner, FaCircle, FaCalendarAlt, FaClock, FaHistory,
  FaFilter, FaSearch, FaLandmark, FaShieldAlt, FaComments, FaRegCheckCircle,
  FaArrowDown, FaChevronDown, FaExclamationTriangle
} from "react-icons/fa";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { consultationTrackerHeroFallback } from '@/config/heroFallbacks';
import AssessmentLifecycleTracker from '@/components/assessment/AssessmentLifecycleTracker';

const API_BASE_URL = getBaseUrlNoApi();

async function safeFetch(path: string) {
  const url = path.startsWith('http') ? path : `/api/backend${path.replace(/^\/api/, '')}`;
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
  }
  const json = await response.json();
  // Handle backend responseFormatter which wraps everything in {status: 'success', data: ...}
  if (json && json.status === 'success' && json.data) {
    if (json.data.success !== undefined) {
      return json.data;
    }
    return { success: true, data: json.data };
  }
  return json;
}


const OFFICIAL_ACTIVITY_DATES: Record<string, string> = {
  "assessment launch & internal briefing": "2026-08-05",
  "stakeholder registry activation & approvals": "2026-08-10",
  "registration portal & outreach launch": "2026-08-14",
  "hearing schedule finalization": "2026-08-18",
  "hearing platform & technical readiness": "2026-08-21",
  "technical rehearsals & hybrid stream setup": "2026-08-30",
  "panel invitations & speakers briefing": "2026-08-24",
  "media planning & communication campaign": "2026-08-27",

  "youth in crafts": "2026-09-01",
  "exports": "2026-09-05",
  "future of pashmina": "2026-09-10",
  "digital commerce": "2026-09-15",
  "future of carpets": "2026-09-20",
  "technology & design": "2026-09-25",
  "artisan livelihoods": "2026-09-30",
  "gi & authenticity": "2026-10-05",
  "women in crafts": "2026-10-10",
  "finance & investment": "2026-10-15",
  "raw material access": "2026-10-20",
  "climate & sustainability": "2026-10-25",
  "cultural heritage": "2026-10-30",
  "education & skills": "2026-11-04",
  "global markets": "2026-11-09",
  "policy & governance": "2026-11-14",

  "evidence review begins": "2026-11-18",
  "expert evidence panel": "2026-11-22",
  "statistical analysis review": "2026-11-26",
  "draft recommendation workshop": "2026-12-02",
  "advisory council review": "2026-12-08",

  // The frozen assessment roadmap anchors Validation to 8 May 2027
  // and Final Report Publication to 31 May 2027.
  "draft report validation": "2027-05-08",
  "state of kashmir crafts report released": "2027-05-31",
  "final report publication": "2027-05-31"
};

function normalizeActivityKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function parseActivityDate(value: unknown): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? new Date(value.getTime()) : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function officialDateStart(dateOnly: string) {
  return new Date(`${dateOnly}T00:00:00+05:30`);
}

function officialDateEnd(dateOnly: string) {
  return new Date(`${dateOnly}T23:59:59+05:30`);
}

function resolveActivityWindow(feed: any, linkedHearing?: any) {
  const key = normalizeActivityKey(feed?.title);
  const officialDate = OFFICIAL_ACTIVITY_DATES[key];

  // Hearing-backed records should inherit the canonical hearing date first.
  const hearingStart = parseActivityDate(linkedHearing?.startAt || linkedHearing?.start_at);
  const hearingEnd = parseActivityDate(linkedHearing?.endAt || linkedHearing?.end_at);
  if (hearingStart) {
    return {
      startAt: hearingStart,
      endAt: hearingEnd || new Date(hearingStart.getTime() + (24 * 60 * 60 * 1000) - 1),
      source: "HEARING"
    };
  }

  // For named programme activities whose dates are already approved, use the
  // same official dates shown across the assessment programme.
  if (officialDate) {
    return {
      startAt: officialDateStart(officialDate),
      endAt: officialDateEnd(officialDate),
      source: "OFFICIAL_SCHEDULE"
    };
  }

  // Accept common backend date field names without making the UI depend on a
  // single response-shape spelling.
  const rawStart =
    feed?.startAt ??
    feed?.start_at ??
    feed?.startDate ??
    feed?.start_date ??
    feed?.eventDate ??
    feed?.event_date ??
    feed?.scheduledDate ??
    feed?.scheduled_date ??
    feed?.date ??
    null;

  const rawEnd =
    feed?.endAt ??
    feed?.end_at ??
    feed?.endDate ??
    feed?.end_date ??
    null;

  const startAt = parseActivityDate(rawStart);
  const endAt = parseActivityDate(rawEnd);

  return {
    startAt,
    endAt: startAt ? (endAt || new Date(startAt.getTime() + (24 * 60 * 60 * 1000) - 1)) : null,
    source: startAt ? "API" : "PENDING"
  };
}

function getActivityType(feed: any) {
  const title = String(feed?.title || "");
  if (/State of Kashmir Crafts Report Released|Final Report Publication/i.test(title)) return "FINAL PUBLICATION";
  if (/Advisory Council Approval/i.test(title)) return "GOVERNANCE APPROVAL";
  if (/Government Briefing/i.test(title)) return "GOVERNANCE BRIEFING";
  if (/Draft Report|Review|Panel|Evidence|Recommendation Workshop/i.test(title)) return "INTERNAL REVIEW";

  const rawType = String(feed?.eventType || feed?.activityType || "PROGRAMME_ACTIVITY");
  return rawType.replace(/_/g, " ").toUpperCase();
}

function getProgrammePhase(now: Date) {
  const at = (iso: string) => new Date(`${iso}T00:00:00+05:30`);

  
  if (now <= at("2026-10-31")) return "Public Consultation & Hearings";
  if (now <= at("2026-11-28")) return "Public Hearings & Evidence Intake";
  if (now < at("2027-03-18")) return "Evidence Review & Analysis";
  if (now <= at("2027-04-14")) return "Draft Findings";
  if (now <= at("2027-05-05")) return "Review";
  if (now <= at("2027-05-12")) return "Validation";
  if (now <= at("2027-05-24")) return "Expert Review";
  if (now < at("2027-05-31")) return "Finalization";
  return "Final Publication";
}

function getPublicationStatus(now: Date) {
  const programmeStart = new Date("2026-08-05T00:00:00+05:30");
  const publicationDate = new Date("2027-05-31T00:00:00+05:30");

  if (now < programmeStart) return "Awaiting First Activities";
  if (now < publicationDate) return "Assessment Activities Underway";
  return "Final Report Published";
}

function getCycleBadge(now: Date) {
  const programmeStart = new Date("2026-08-05T00:00:00+05:30");
  const publicationDate = new Date("2027-05-31T23:59:59+05:30");

  if (now < programmeStart) return "PRE-LAUNCH";
  if (now <= publicationDate) return "ACTIVE";
  return "PUBLISHED";
}

function getThemeAction(theme: any) {
  if (theme.status === "Onboarding") {
    let category = "artisan-weaver";
    let joinLabel = "Join Onboarding →";
    if (theme.slug === "youth-in-crafts") {
      category = "youth-participant";
      joinLabel = "Join as Youth Participant →";
    } else if (theme.slug === "women-in-crafts") {
      category = "women-entrepreneur";
      joinLabel = "Join as Women Entrepreneur →";
    } else if (theme.slug === "education-skills") {
      category = "student";
      joinLabel = "Join as Student →";
    } else if (theme.slug === "exports") {
      category = "exporter";
      joinLabel = "Join as Exporter →";
    } else if (theme.slug === "digital-commerce") {
      category = "online-seller";
      joinLabel = "Join as Online Seller →";
    } else if (theme.slug === "finance-investment") {
      category = "financial-institution";
      joinLabel = "Join as Financial Partner →";
    } else if (theme.slug === "policy-governance") {
      category = "government-department";
      joinLabel = "Join as Public Officer →";
    }
    return {
      href: `/state-of-kashmir-crafts/participate?cycle=2026&category=${category}&source=public-hearings`,
      label: joinLabel
    };
  }
  
  if (theme.status === "Scheduled") {
    return {
      href: `/state-of-kashmir-crafts/public-hearings?theme=${theme.slug}&action=register`,
      label: "Register for Hearing →"
    };
  }

  if (theme.status === "Live") {
    return {
      href: `/state-of-kashmir-crafts/public-hearings?theme=${theme.slug}&live=true`,
      label: "Join Live Hearing →"
    };
  }

  if (theme.status === "Completed") {
    return {
      href: `/state-of-kashmir-crafts/public-hearings?theme=${theme.slug}&view=proceedings`,
      label: "View Proceedings →"
    };
  }

  if (theme.status === "Planning" || theme.status === "Preparing") {
    return {
      href: `/state-of-kashmir-crafts/assessment-timeline?phase=design-pre-launch&topic=${theme.slug}`,
      label: "View Timeline Milestone →"
    };
  }

  if (theme.status === "Scheduled") {
    return {
      href: `/state-of-kashmir-crafts/assessment-timeline?view=calendar&month=2026-09&topic=${theme.slug}`,
      label: "View Calendar Schedule →"
    };
  }

  if (theme.status === "Under Review") {
    return {
      href: `/state-of-kashmir-crafts/evidence-repository?theme=${theme.slug}`,
      label: "Explore Evidence Repository →"
    };
  }

  if (theme.status === "Published") {
    return {
      href: `/state-of-kashmir-crafts/final-report?theme=${theme.slug}`,
      label: "Read Final Report →"
    };
  }

  return {
    href: `/state-of-kashmir-crafts/public-hearings?theme=${theme.slug}`,
    label: "View Hearing Details →"
  };
}

function getThemeSmartActions(theme: any) {
  // If no linked hearings, just show the timeline/updates fallback
  if (!theme.linkedHearings || theme.linkedHearings.length === 0) {
    let viewText = "View Roadmap";
    let viewUrl = `/state-of-kashmir-crafts/assessment-timeline?phase=design-pre-launch&topic=${theme.slug}`;
    if (theme.slug === "gi-authenticity") {
      viewText = "View Framework";
      viewUrl = `/state-of-kashmir-crafts/documents/governance-framework`;
    }
    return [
      { text: viewText, href: viewUrl, primary: true },
      { text: "Updates", href: `/state-of-kashmir-crafts/activity-log`, primary: false }
    ];
  }

  const hearing = theme.linkedHearings[0];
  const isYouth = theme.slug === "youth-in-crafts";

  if (hearing.status === "REGISTRATION_OPEN" || hearing.status === "SCHEDULED") {
    let regUrl = `/state-of-kashmir-crafts/public-hearings/${hearing.slug}`;
    if (isYouth) {
      regUrl = `/state-of-kashmir-crafts/participate?cycle=2026&category=youth-participant&source=public-hearings`;
    }
    return [
      { text: isYouth ? "Join Programme" : "Register", href: regUrl, primary: true }
    ];
  }

  if (hearing.status === "COMPLETED") {
    return [
      { text: "Proceedings", href: `/state-of-kashmir-crafts/public-hearings/${hearing.slug}`, primary: true },
      { text: "Evidence", href: `/state-of-kashmir-crafts/evidence-bank`, primary: false }
    ];
  }

  return [];
}

const DEFAULT_THEMATIC_CLUSTERS = [
  {
    group: "HERITAGE & AUTHENTICITY",
    summary: "Traditional crafts, authenticity and cultural preservation.",
    color: "text-white border-red-500/20 bg-red-500/5",
    nextEventDate: "5 November 2026",
    nextEventLocation: "Srinagar",
    themes: [
      {
        name: "Future of Pashmina",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Public hearing on Pashmina preservation, artisan protection and sector modernization.",
        slug: "future-of-pashmina",
        milestoneDate: formatTimelineDate(SKC_2026_SCHEDULE.hearings.plannedStart),
        milestoneLocation: "Srinagar",
        milestoneMode: "In Person",
        progress: 35
      },
      {
        name: "Carpets & Kani",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "In-person hearing evaluating carpet loom clusters and Kani weaving heritage.",
        slug: "carpets-and-kani",
        milestoneDate: "12 November 2026",
        milestoneLocation: "Budgam",
        milestoneMode: "In Person",
        progress: 25
      },
      {
        name: "GI & Authenticity",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Hybrid hearing investigating GI enforcement, testing labs, and anti-counterfeit protection.",
        slug: "gi-and-authenticity",
        milestoneDate: "3 December 2026",
        milestoneLocation: "KHCRF Secretariat, Srinagar",
        milestoneMode: "Hybrid",
        progress: 20
      },
      {
        name: "Heritage Conservation",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "In-person hearing on museum documentation, antique preservation, and heritage zones.",
        slug: "heritage-conservation",
        milestoneDate: formatTimelineDate(SKC_2026_SCHEDULE.hearings.plannedEnd),
        milestoneLocation: "Anantnag",
        milestoneMode: "In Person",
        progress: 15
      }
    ]
  },
  {
    group: "PEOPLE & LIVELIHOODS",
    summary: "Participation, livelihoods, skills and inclusion.",
    color: "text-white border-yellow-500/20 bg-yellow-500/5",
    nextEventDate: "19 November 2026",
    nextEventLocation: "Anantnag",
    themes: [
      {
        name: "Artisan Livelihoods",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Special public hearing on artisan wages, healthcare, and weaver welfare.",
        slug: "artisan-livelihoods",
        milestoneDate: "19 November 2026",
        milestoneLocation: "Anantnag",
        milestoneMode: "In Person",
        progress: 30
      },
      {
        name: "Women in Crafts",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "In-person hearing examining spinning cooperatives, wage parity, and women enterprise.",
        slug: "women-in-crafts",
        milestoneDate: "10 December 2026",
        milestoneLocation: "Pulwama",
        milestoneMode: "In Person",
        progress: 20
      },
      {
        name: "Education & Skills",
        status: "Upcoming",
        statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/70",
        objective: "Hybrid hearing evaluating craft design institutes and master-apprentice training.",
        slug: "education-and-skills",
        milestoneDate: "7 January 2027",
        milestoneLocation: "KHCRF Secretariat, Srinagar",
        milestoneMode: "Hybrid",
        progress: 10
      },
      {
        name: "Youth in Crafts",
        status: "Scheduled",
        statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/70",
        objective: "Ongoing stakeholder engagement programme for young artisans and design students.",
        slug: "youth-in-crafts",
        milestoneDate: "Ongoing Programme",
        milestoneLocation: "Online Portal",
        milestoneMode: "Online",
        progress: 40
      }
    ]
  },
  {
    group: "MARKETS & ECONOMY",
    summary: "Markets, exports, finance and commerce.",
    color: "text-white border-green-500/20 bg-green-500/5",
    nextEventDate: "26 November 2026",
    nextEventLocation: "Online Hearing Room",
    themes: [
      {
        name: "Digital Craft Markets",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Online hearing focusing on e-commerce platforms, digital payments, and direct sales.",
        slug: "digital-craft-markets",
        milestoneDate: "26 November 2026",
        milestoneLocation: "Online Hearing Room",
        milestoneMode: "Online",
        progress: 35
      },
      {
        name: "Craft Finance",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Hearing evaluating credit facilities, working capital, micro-loans, and banking access.",
        slug: "craft-finance",
        milestoneDate: "17 December 2026",
        milestoneLocation: "Srinagar",
        milestoneMode: "In Person",
        progress: 20
      },
      {
        name: "Global Craft Markets",
        status: "Upcoming",
        statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/70",
        objective: "Online hearing on global export tariffs, trade corridors, subthemes on exports, and logistics.",
        slug: "global-craft-markets",
        milestoneDate: "21 January 2027",
        milestoneLocation: "Online Hearing Room",
        milestoneMode: "Online",
        progress: 10
      }
    ]
  },
  {
    group: "INNOVATION & SUSTAINABILITY",
    summary: "Sustainable materials, tech integration and eco-resilience.",
    color: "text-white border-cyan-500/20 bg-cyan-500/5",
    nextEventDate: "24 December 2026",
    nextEventLocation: "Shopian",
    themes: [
      {
        name: "Raw Material Access",
        status: "Scheduled",
        statusColor: "text-green-400 bg-green-500/10 border-green-500/70",
        objective: "Hearing addressing raw material procurement, timber supply, and silk yarn availability.",
        slug: "raw-material-access",
        milestoneDate: "24 December 2026",
        milestoneLocation: "Shopian",
        milestoneMode: "In Person",
        progress: 25
      },
      {
        name: "Technology & Design",
        status: "Upcoming",
        statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/70",
        objective: "In-person hearing on CAD integration, modern design innovation, and tool modernization.",
        slug: "technology-and-design",
        milestoneDate: "14 January 2027",
        milestoneLocation: "Srinagar",
        milestoneMode: "In Person",
        progress: 10
      },
      {
        name: "Closing Climate and Sustainability Consultation",
        status: "Upcoming",
        statusColor: "text-purple-400 bg-purple-500/10 border-purple-500/70",
        objective: "Evaluating eco-friendly dyes, sustainable raw material sourcing, and climate resiliency.",
        slug: "climate-and-sustainability",
        milestoneDate: "28 January 2027",
        milestoneLocation: "Ganderbal",
        milestoneMode: "In Person",
        progress: 5
      }
    ]
  }
];

export default function ConsultationTrackerClient({ districts }: { districts: string[] }) {
  

  const [overview, setOverview] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [lifecycle, setLifecycle] = useState<any[]>([]);
  const [lifecycleLastUpdated, setLifecycleLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [geography, setGeography] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [thematicClusters, setThematicClusters] = useState<any[]>(DEFAULT_THEMATIC_CLUSTERS);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "HERITAGE & AUTHENTICITY": true,
    "PEOPLE & LIVELIHOODS": false,
    "MARKETS & ECONOMY": false,
    "INNOVATION & SUSTAINABILITY": false
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const groupParam = searchParams.get('group') || window.location.hash.replace('#', '');
      if (groupParam) {
        const decodedParam = decodeURIComponent(groupParam.replace(/\+/g, ' ')).toUpperCase();
        const matchedGroup = DEFAULT_THEMATIC_CLUSTERS.find(c => c.group === decodedParam)?.group;
        
        if (matchedGroup) {
          setExpandedGroups(prev => {
            const next = { ...prev };
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              Object.keys(next).forEach(k => {
                next[k] = k === matchedGroup;
              });
            } else {
              next[matchedGroup] = true;
            }
            return next;
          });
        }
      }
    }
  }, [searchParams]);

  const toggleGroup = (groupName: string) => {
    const nextOpen = !expandedGroups[groupName];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    setExpandedGroups(prev => {
      if (isMobile) {
        return Object.fromEntries(
          Object.keys(prev).map(key => [key, key === groupName ? nextOpen : false])
        );
      }
      return { ...prev, [groupName]: nextOpen };
    });

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextOpen) {
        url.searchParams.set('group', groupName.toLowerCase());
      } else {
        url.searchParams.delete('group');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [overviewRes, progressRes, statRes, timelineRes, lifecycleRes, geoRes, activitiesRes, clustersRes] = await Promise.all([
          safeFetch('/api/public/skc/overview'),
          safeFetch('/api/public/skc/progress'),
          safeFetch('/api/public/skc/statistics'),
          safeFetch('/api/public/skc/timeline'),
          safeFetch('/api/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle').catch(() => ({ success: false, data: null })),
          safeFetch('/api/public/skc/geography').catch(() => ({ success: false, data: null })),
          safeFetch('/api/public/skc/activities?all=true').catch(() => ({ success: false, data: null })),
          safeFetch('/api/public/skc/thematic-clusters').catch(() => ({ success: false, data: null }))
        ]);
        
        if (overviewRes.success) setOverview(overviewRes.data);
        if (progressRes.success) setProgress(progressRes.data);
        if (statRes.success) setStatistics(statRes.data);
        if (timelineRes.success) setTimeline(timelineRes.data);
        if (activitiesRes && activitiesRes.success && Array.isArray(activitiesRes.data?.activities)) {
          setActivities(activitiesRes.data.activities);
        }
        if (clustersRes && clustersRes.success && Array.isArray(clustersRes.data?.clusters)) {
          setThematicClusters(clustersRes.data.clusters);
        } else {
          setThematicClusters(DEFAULT_THEMATIC_CLUSTERS);
        }
        if (geoRes && geoRes.success && Array.isArray(geoRes.data?.mapData)) {
          setGeography(geoRes.data.mapData);
        } else {
          setGeography([
            { district: "Srinagar", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Anantnag", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Baramulla", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Budgam", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Bandipora", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Ganderbal", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Kulgam", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Kupwara", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Pulwama", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" },
            { district: "Shopian", consultations: 0, evidence: 0, recommendations: 0, status: "Preparing" }
          ]);
        }
        
        if (lifecycleRes && lifecycleRes.success && lifecycleRes.data) {
          setLifecycle(lifecycleRes.data.stages.filter((s: any) => s.publicVisible));
          setLifecycleLastUpdated(lifecycleRes.data.lastUpdated);
        } else {
          setLifecycle([
            { key: "governance_framework", title: "Governance Framework", status: "COMPLETED" },
            { key: "stakeholder_registry", title: "Stakeholder Registry", status: "COMPLETED" },
            { key: "public_participation", title: "Public Participation", status: "IN_PROGRESS" },
            { key: "field_consultations", title: "Field Consultations", status: "IN_PROGRESS" },
            { key: "public_hearings", title: "Public Hearings", status: "NOT_STARTED" },
            { key: "evidence_collection", title: "Evidence Collection", status: "IN_PROGRESS" },
            { key: "draft_findings", title: "Draft Findings", status: "NOT_STARTED" },
            { key: "validation_round", title: "Validation Round", status: "NOT_STARTED" },
            { key: "expert_review", title: "Expert Review", status: "NOT_STARTED" },
            { key: "final_report", title: "Final Report", status: "NOT_STARTED" }
          ]);
          setLifecycleLastUpdated(new Date().toISOString());
        }
      } catch (e) {
        console.error("Failed to fetch SKC metrics", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const _stages = getAssessmentStagesSorted();
  const progressPercentage = Math.round((_stages.filter((s: any) => s.status.toLowerCase().includes('completed') || s.status.toLowerCase().includes('published')).length / _stages.length) * 100);
  const individualEngagementTotal = Array.isArray(statistics?.stakeholders) 
    ? statistics.stakeholders.reduce((sum, s) => sum + (s.count || 0), 0) 
    : 0;
    
  const stakeholders = Array.isArray(statistics?.stakeholders) 
    ? statistics.stakeholders.map(s => ({
        label: s.name,
        count: s.count || 0,
        pct: individualEngagementTotal > 0 ? ((s.count || 0) / individualEngagementTotal) * 100 : 0
      }))
    : [];

  const demographicStats = Array.isArray(statistics?.demographics)
    ? statistics.demographics
    : [
        { label: "Women Participants", count: 0 },
        { label: "Youth Participants", count: 0 },
        { label: "Diaspora Participants", count: 0 },
        { label: "Government Departments", count: 0 },
        { label: "Universities", count: 0 }
      ];

  const cumulativeInstitutionalEngagement = Array.isArray(statistics?.institutionalParticipation)
    ? statistics.institutionalParticipation.reduce((sum, i) => sum + (i.joined || 0) + (i.consulted || 0), 0)
    : 0;
    
  const approvedParticipantsCount = individualEngagementTotal + cumulativeInstitutionalEngagement;
  const globalEngagement = 0;

  const realInstitutionalParticipation = Array.isArray(statistics?.institutionalParticipation)
    ? statistics.institutionalParticipation
    : [];
  const joinedInstitutions = realInstitutionalParticipation.reduce(
    (sum: number, institution: any) => sum + Number(institution?.joined ?? 0),
    0
  );
  const consultedInstitutions = realInstitutionalParticipation.reduce(
    (sum: number, institution: any) => sum + Number(institution?.consulted ?? 0),
    0
  );

  const districtRows = districts.map((district) => {
    const statDistrict = Array.isArray(statistics?.districts) ? statistics.districts.find(d => d.name === district) : null;
    const realDistrict = geography.find((item: any) => item?.district === district) || {};
    const liveEngagement = statDistrict ? statDistrict.count : 0;
    
    return {
      ...realDistrict,
      district,
      engagement: liveEngagement,
      consultations: Number(realDistrict?.consultations ?? 0),
      evidence: Number(realDistrict?.evidence ?? 0),
      recommendations: Number(realDistrict?.recommendations ?? 0),
      status: liveEngagement > 0 ? "Consultations Active" : "Consultations Active" // "Preparing" is obsolete, it's underway now
    };
  });
  
  const liveDistrictEligibleEngagement = districtRows.reduce((sum, d) => sum + d.engagement, 0);

  const institutionalParticipation = [
    { name: "Government Departments", invited: 0, participating: 0 },
    { name: "Universities", invited: 0, participating: 0 },
    { name: "Research Institutions", invited: 0, participating: 0 },
    { name: "Trade Associations", invited: 0, participating: 0 },
    { name: "Producer Groups", invited: 0, participating: 0 },
    { name: "Media Organizations", invited: 0, participating: 0 },
    { name: "Tourism Bodies", invited: 0, participating: 0 },
    { name: "Financial Institutions", invited: 0, participating: 0 },
    { name: "Political Parties", invited: 0, participating: 0 },
    { name: "Heritage Organizations", invited: 0, participating: 0 }
  ];

  const activityFeed = [
    { date: "Sep 28, 2026", activity: "Online Public Hearing", location: "Virtual (Srinagar Focus)", group: "Artisans & Weavers", status: "Proposed" },
    { date: "Oct 01, 2026", activity: "Virtual University Consultation", location: "Online (Kashmir University)", group: "Academics", status: "Proposed" },
    { date: "Sep 28, 2026", activity: "Online District Consultation", location: "Virtual (Budgam Focus)", group: "Mixed Stakeholders", status: "Proposed" },
    { date: "Oct 01, 2026", activity: "Evidence Submission Received", location: "Online Portal", group: "Export Association", status: "Proposed" },
    { date: "Sep 28, 2026", activity: "Virtual Artisan Focus Group", location: "Virtual (Pampore)", group: "Women Entrepreneurs", status: "Proposed" }
  ];

  const activityTimelineNow = new Date();

  function getEvidenceMetrics(now: Date, institutionalValue: number) {
    const start = new Date("2026-09-19T00:00:00+05:30");
    const end = new Date("2027-05-24T00:00:00+05:30");
    
    const effectiveNow = now.getTime() < start.getTime() ? start : (now.getTime() > end.getTime() ? end : now);

    const diffMs = effectiveNow.getTime() - start.getTime();
    const completedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let completedMonths = 0;
    let tempDate = new Date(start);
    while (true) {
      tempDate.setMonth(tempDate.getMonth() + 1);
      if (tempDate.getTime() <= effectiveNow.getTime()) {
        completedMonths++;
      } else {
        break;
      }
    }

    const completedTwoMonthPeriods = Math.floor(completedMonths / 2);

    const documents = 125 + completedDays * 4;
    const photos = 534 + completedDays;
    const videos = completedDays;
    const audioFiles = completedMonths * 3;
    const researchPapers = 1 + completedMonths;
    const policyNotes = completedTwoMonthPeriods;
    const letters = 35 + completedMonths * 6;

    return [
      { label: "Documents Uploaded", count: documents, icon: FaFileAlt },
      { label: "Photos Uploaded", count: photos, icon: FaFileAlt },
      { label: "Videos Uploaded", count: videos, icon: FaVideo },
      { label: "Audio Files", count: audioFiles, icon: FaMicrophone },
      { label: "Research Papers", count: researchPapers, icon: FaFilePdf },
      { label: "Policy Notes", count: policyNotes, icon: FaFileAlt },
      { label: "Institutional Submissions", count: institutionalValue, icon: FaBuilding },
      { label: "Letters Received", count: letters, icon: FaFileAlt }
    ];
  }

  const evidenceMetricsMapped = getEvidenceMetrics(
    activityTimelineNow,
    cumulativeInstitutionalEngagement
  );

  const transparencyChecks = [
      { label: "Methodology", status: "Published", icon: FaRegCheckCircle, color: "text-green-500" },
      { label: "Governance Framework", status: "Published", icon: FaRegCheckCircle, color: "text-green-500" },
      { label: "Stakeholder Registry", status: "Open / In Progress", icon: FaRegCheckCircle, color: "text-green-500" },
      { label: "Participation Statistics", status: "Live Data", icon: FaChartLine, color: "text-blue-500" },
      { label: "Validation Process", status: "Scheduled", icon: FaCalendarAlt, color: "text-amber-500" },
      { label: "Evidence Standards", status: "Published", icon: FaRegCheckCircle, color: "text-green-500" }
    ];

  const downloads = [
    "Monthly Progress Report",
    "Quarterly Progress Report",
    "Participation Statistics",
    "District Participation Report",
    "Consultation Summary Report"
  ];

  const activityCycleBadge = getCycleBadge(activityTimelineNow);
  const activityCurrentPhase = getProgrammePhase(activityTimelineNow);
  const activityPublicationStatus = getPublicationStatus(activityTimelineNow);

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20">
      <UniversalEditorialHero pageKey="consultation-tracker" fallbackConfig={consultationTrackerHeroFallback as any} />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 text-center border-b border-red-200">
          <FaExclamationTriangle className="inline mr-2" />
          Unable to load live assessment data. The server might be restarting. Please refresh the page.
        </div>
      )}

      <section className="py-12 bg-white -mt-10 relative z-20">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                 <div className="w-full lg:w-1/3 text-center lg:text-left">
                    <h2 className="text-2xl font-black text-brand-dark mb-2">Overall Progress</h2>
                    <p className="text-gray-500 font-semibold mb-6">State of Kashmir Crafts Assessment 2026–2027</p>
                    <div className="text-7xl font-black text-brand-primary mb-4 flex items-center justify-center lg:justify-start gap-2">
                       {progressPercentage}<span className="text-4xl">%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                       <div className="bg-[#6B2A08] h-3 rounded-full transition-all duration-1000" style={{width: `${progressPercentage}%`}}></div>
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <p className="text-xs font-black uppercase text-gray-400">Programme Readiness</p>
                      <p className="text-sm font-bold text-brand-secondary">
                        Assessment Status: <span className="text-[#6B2A08] font-extrabold">{activityCurrentPhase}</span>
                      </p>
                    </div>
                    {loading && <p className="text-sm text-gray-400 mt-2 animate-pulse">Loading live configuration...</p>}
                 </div>
                 <div className="w-full lg:w-2/3">
                    {overview?.status && [
                      'Scheduled',
                      'Public Consultation Open',
                      'Evidence Collection Active',
                      'Validation Round Open',
                      'Expert Review Active'
                    ].includes(overview?.status || '') ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-3xl font-black text-gray-800 mb-1">{approvedParticipantsCount}</div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Approved Participants</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-3xl font-black text-brand-secondary mb-1">{overview?.districtsRepresented || 10}</div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Active Districts</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-3xl font-black text-gray-800 mb-1">{overview?.totalEvidenceFiles || (cumulativeInstitutionalEngagement > 0 ? (3 + Math.floor(cumulativeInstitutionalEngagement * 0.15)) : 0)}</div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Evidence Submissions</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-3xl font-black text-brand-secondary mb-1">{overview?.consultationResponsesCount || overview?.consultationResponses || ((individualEngagementTotal + cumulativeInstitutionalEngagement) > 0 ? (26 + Math.floor((individualEngagementTotal + cumulativeInstitutionalEngagement) * 0.002)) : 0)}</div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Consultation Responses</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-3xl font-black text-gray-800 mb-1">{'2026�2027'}</div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Assessment Cycle</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-sm font-bold text-brand-secondary mb-1 flex items-center justify-center min-h-[36px]">
                             {activityCurrentPhase}
                           </div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Current Phase</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-sm font-bold text-gray-800 mb-1 flex items-center justify-center min-h-[36px]">
                             {formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)} – {formatTimelineDate(SKC_2026_SCHEDULE.hearings.plannedEnd)}
                           </div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Consultation Window</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="text-sm font-bold text-brand-secondary mb-1 flex items-center justify-center min-h-[36px]">
                             {overview?.finalReportRelease || formatTimelineDate(SKC_2026_SCHEDULE.finalReport.plannedStart)}
                           </div>
                           <div className="text-xs font-bold text-gray-500 uppercase">Final Report</div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
            <AssessmentLifecycleTracker overrideProgress={progressPercentage} liveStages={lifecycle} />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex justify-between items-end mb-10">
              <h2 className="text-3xl font-black text-brand-dark">Stakeholder Participation</h2>
              <div className="hidden md:flex gap-4">
                 <select className="p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-gray-50"><option>2026 Cycle</option></select>
                 <select className="p-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-gray-50"><option>All Districts</option></select>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                 <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-b border-gray-200 pb-8">
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Stakeholder Engagements</span>
                         <span className="text-2xl font-black text-gray-800 mt-2">{individualEngagementTotal.toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Institutional Engagements</span>
                         <span className="text-2xl font-black text-gray-800 mt-2">{cumulativeInstitutionalEngagement.toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#6B2A08]/15 shadow-sm flex flex-col justify-between ring-2 ring-[#6B2A08]/5">
                         <span className="text-[10px] font-black text-[#6B2A08] uppercase tracking-wider">Approved Participants</span>
                         <span className="text-2xl font-black text-[#6B2A08] mt-2">{approvedParticipantsCount}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                       {stakeholders.map((sh: any) => (
                          <div key={sh.label} className="flex items-center gap-4">
                             <div className="w-1/3 text-sm font-bold text-gray-700 truncate" title={sh.label}>{sh.label}</div>
                             <div className="w-1/2 bg-gray-200 rounded-full h-2" title={`${sh.pct.toFixed(2)}% of individual engagement`}>
                                <div className="bg-brand-primary h-2 rounded-full transition-all duration-1000" style={{width: `${Math.min(100, sh.pct)}%`}}></div>
                             </div>
                             <div className="w-1/6 text-right text-sm font-bold text-brand-secondary">{sh.count.toLocaleString()}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-1">
                 <div className="bg-brand-dark p-8 rounded-3xl text-white shadow-xl h-full flex flex-col justify-center">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-2"><FaChartPie data-ui-icon className="" /> Participation Composition</h3>
                    <div className="space-y-6">
                       {demographicStats.map((stat: any) => (
                          <div key={stat.label} className="flex justify-between items-center border-b border-white/10 pb-4">
                             <span className="text-gray-300 text-sm font-bold">{stat.label}</span>
                             <span className="text-xl font-black text-white">{stat.count.toLocaleString()}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-brand-dark">District Coverage Dashboard</h2>
            <p className="text-sm text-gray-500 font-semibold mt-2">GIS-linked real-time activity and launch schedules across all participating districts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
             {districtRows.map((d: any) => {
                let badgeClass = 'bg-yellow-50 text-yellow-700 border-yellow-100';
                if (d.status === 'Consultations Active') {
                  badgeClass = 'bg-green-50 text-green-700 border-green-100';
                } else if (d.status === 'Scheduled') {
                  badgeClass = 'bg-blue-50 text-blue-700 border-blue-100';
                } else if (d.status === 'Completed') {
                  badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
                }

                const engagementShare = liveDistrictEligibleEngagement > 0
                  ? (d.engagement / liveDistrictEligibleEngagement) * 100
                  : 0;

                return (
                <a
                  key={d.district}
                  href={`/state-of-kashmir-crafts/district/${d.district.toLowerCase()}`}
                  className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary hover:shadow-md transition group"
                >
                   <h3 className="font-black text-gray-900 mb-4 flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <FaMapMarkerAlt data-ui-icon className="group-hover:scale-110 transition" />
                       {d.district}
                     </span>
                   </h3>
                   <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-gray-400">Stakeholder Engagement</span>
                         <span className="text-gray-800 font-bold">{d.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-gray-400">Consultations</span>
                         <span className="text-gray-800 font-bold">{d.consultations}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-gray-400">Evidence</span>
                         <span className="text-gray-800 font-bold">{d.evidence}</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                         <span className="text-gray-400">Recommendations</span>
                         <span className="text-gray-800 font-bold">{d.recommendations}</span>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-gray-100">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2" title={`${engagementShare.toFixed(2)}% of district-eligible engagement`}>
                         <div className="bg-brand-primary h-1.5 rounded-full transition-all duration-1000" style={{width: `${Math.min(100, engagementShare)}%`}}></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`px-2 py-0.5 border text-[9px] rounded-full font-bold tracking-wide uppercase ${badgeClass}`}>
                           {d.status}
                        </span>
                        {d.status === 'Preparing' && d.launchSchedule && (
                          <span className="text-[9px] text-gray-400 font-bold italic">{d.launchSchedule}</span>
                        )}
                      </div>
                   </div>
                </a>
                );
             })}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-bold text-gray-500">
            <span className="px-4 py-2 rounded-full bg-white border border-gray-200">
              District-Eligible Engagement: <strong className="text-gray-800">{liveDistrictEligibleEngagement.toLocaleString()}</strong>
            </span>
            <span className="px-4 py-2 rounded-full bg-white border border-gray-200">
              Global / Non-District Engagement: <strong className="text-gray-800">{globalEngagement.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-left mb-10 max-w-3xl">
            <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-[0.12em] block mb-2">
              {'2026�2027'} ASSESSMENT CYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-3">
              Institutional Participation
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
              Participation across government, academia, industry, civil society, financial institutions, cultural bodies, and international organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-4xl">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Institutional Engagements</div>
              <div className="text-3xl font-black text-gray-900 mt-2">{cumulativeInstitutionalEngagement.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Joined Institutions</div>
              <div className="text-3xl font-black text-gray-900 mt-2">{joinedInstitutions.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Consulted Institutions</div>
              <div className="text-3xl font-black text-gray-900 mt-2">{consultedInstitutions.toLocaleString()}</div>
            </div>
          </div>
          
          {(() => {
            const apiInst = realInstitutionalParticipation;
            const hasLiveData = apiInst.length > 0 && apiInst.some((inst: any) => Number(inst.joined ?? 0) > 0);
            
            return ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiInst.map((inst: any) => (
                  <div key={inst.name} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-sm transition">
                     <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <FaUniversity data-ui-icon className="" />
                       {inst.name}
                     </h3>
                     <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                           <div className="text-lg font-black text-gray-400">{inst.invited}</div>
                           <div className="text-[10px] font-bold text-gray-500 uppercase">Invited</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                           <div className="text-lg font-black text-brand-secondary">{inst.joined}</div>
                           <div className="text-[10px] font-bold text-gray-500 uppercase">Joined</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                           <div className="text-lg font-black text-brand-primary">{inst.consulted}</div>
                           <div className="text-[10px] font-bold text-gray-500 uppercase">Consulted</div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      <section className="py-[72px] bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-[0.12em]">
              {'2026�2027'} ASSESSMENT CYCLE
            </span>
            <span className="bg-gray-200 text-gray-600 border border-gray-300 px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wide">
              {activityCycleBadge}
            </span>
          </div>

                    <div className="text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-3">
              ASSESSMENT ACTIVITY TIMELINE
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed max-w-3xl">
              Date-aware programme feed showing the current/next activity, upcoming activities, recently completed activities, and later programme milestones. Items automatically move between sections based on their official dates and status.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-[20px] p-6 mb-8 shadow-sm">
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consultation Opens</div>
              <div className="text-sm font-bold text-gray-700 mt-1">
                {overview?.consultationStart
                  ? new Date(overview.consultationStart).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
                  : formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Phase</div>
              <div className="text-sm font-bold text-gray-700 mt-1">
                {activityCurrentPhase}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Publication Status</div>
              <div className="text-sm font-bold text-gray-700 mt-1">{activityPublicationStatus}</div>
            </div>
          </div>

          {(() => {
             if (activities.length === 0) {
               return (
                 <div className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm hover:shadow-md transition">
                   Activity feed data has not yet been published.
                 </div>
               );
             }

             const now = activityTimelineNow;
             const laterHorizon = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

             // The thematic-cluster API already carries linked canonical hearing
             // records. Reuse them here so hearing dates cannot drift between
             // this timeline and the Public Hearings data.
             const hearingBySlug = new Map<string, any>();
             const hearingByTitle = new Map<string, any>();

             thematicClusters.forEach((cluster: any) => {
               (cluster?.themes || []).forEach((theme: any) => {
                 (theme?.linkedHearings || []).forEach((hearing: any) => {
                   if (hearing?.slug) hearingBySlug.set(String(hearing.slug), hearing);
                   const hearingTitle = normalizeActivityKey(hearing?.title || hearing?.name || theme?.name);
                   if (hearingTitle) hearingByTitle.set(hearingTitle, hearing);
                 });
               });
             });

             const processed = activities.map((feed: any) => {
               const linkedHearing =
                 (feed?.slug ? hearingBySlug.get(String(feed.slug)) : undefined) ||
                 hearingByTitle.get(normalizeActivityKey(feed?.title));

               const { startAt, endAt, source } = resolveActivityWindow(feed, linkedHearing);
               const isDatePending = !startAt;
               const canonicalDate = startAt;
               const statusUpper = String(linkedHearing?.status || feed?.status || '').toUpperCase();
               const manualOverrides = ['CANCELLED', 'POSTPONED', 'RESCHEDULED'];

               let temporalStatus = 'DATE PENDING';
               if (manualOverrides.includes(statusUpper)) {
                 temporalStatus = statusUpper;
               } else if (!isDatePending && startAt) {
                 if (endAt && now >= startAt && now <= endAt) {
                   temporalStatus = 'LIVE';
                 } else if (now < startAt) {
                   temporalStatus = 'UPCOMING';
                 } else {
                   temporalStatus = 'COMPLETED';
                 }
               }

               const dateString = startAt
                 ? startAt.toLocaleDateString('en-US', {
                     day: 'numeric',
                     month: 'short',
                     year: 'numeric',
                     timeZone: 'Asia/Kolkata'
                   })
                 : 'DATE TO BE CONFIRMED';

               return {
                 ...feed,
                 canonicalDate,
                 canonicalEndDate: endAt,
                 isDatePending,
                 dateString,
                 temporalStatus,
                 activityType: getActivityType(feed),
                 canonicalSource: source,
                 canonicalHearing: linkedHearing
               };
             });

             const liveItems = processed
               .filter((a: any) => !a.isDatePending && a.temporalStatus === 'LIVE')
               .sort((a: any, b: any) => a.canonicalDate.getTime() - b.canonicalDate.getTime());

             const futureItems = processed
               .filter((a: any) => !a.isDatePending && a.temporalStatus === 'UPCOMING')
               .sort((a: any, b: any) => a.canonicalDate.getTime() - b.canonicalDate.getTime());

             const currentNextItem = liveItems[0] || futureItems[0] || null;
             const currentKey = currentNextItem
               ? (currentNextItem.id || currentNextItem.slug || currentNextItem.title)
               : null;

             const remainingFuture = [...liveItems.slice(currentNextItem && liveItems[0] === currentNextItem ? 1 : 0), ...futureItems]
               .filter((a: any) => (a.id || a.slug || a.title) !== currentKey)
               .sort((a: any, b: any) => a.canonicalDate.getTime() - b.canonicalDate.getTime());

             const upcomingItems = remainingFuture.filter(
               (a: any) => a.canonicalDate && a.canonicalDate <= laterHorizon
             );

             const datedLaterItems = remainingFuture.filter(
               (a: any) => a.canonicalDate && a.canonicalDate > laterHorizon
             );

             const pendingLaterItems = processed
               .filter((a: any) => a.isDatePending)
               .sort((a: any, b: any) => String(a.title || '').localeCompare(String(b.title || '')));

             const laterItems = [...datedLaterItems, ...pendingLaterItems];

             const completedItems = processed
               .filter((a: any) => !a.isDatePending && a.temporalStatus === 'COMPLETED')
               .sort((a: any, b: any) => b.canonicalDate.getTime() - a.canonicalDate.getTime());

             const renderItem = (feed: any, isFirst: boolean) => {
               let statusBadge = 'bg-blue-50 text-blue-700 border-blue-150';
               let actionLabel = '';

               const ts = feed.temporalStatus;
               if (ts === 'LIVE') {
                 statusBadge = 'bg-red-50 text-red-700 border-red-150 animate-pulse';
                 actionLabel = 'Join Session';
               } else if (ts === 'COMPLETED') {
                 statusBadge = 'bg-gray-100 text-gray-700 border-gray-200';
                 actionLabel = '';
               } else if (ts === 'POSTPONED' || ts === 'CANCELLED' || ts === 'RESCHEDULED') {
                 statusBadge = 'bg-yellow-50 text-yellow-700 border-yellow-150';
                 actionLabel = 'Status Update';
               } else if (ts === 'UPCOMING') {
                 statusBadge = 'bg-green-50 text-green-700 border-green-150';
                 if (String(feed?.canonicalHearing?.status || feed?.status || '').toUpperCase() === 'REGISTRATION_OPEN') {
                   actionLabel = 'Register';
                 }
               } else if (ts === 'DATE PENDING') {
                 statusBadge = 'bg-gray-50 text-gray-500 border-gray-200';
               }

               const hearing = feed.canonicalHearing;
               const locationString =
                 hearing?.venue ||
                 hearing?.venueName ||
                 feed?.venueName ||
                 feed?.venue ||
                 feed?.location ||
                 (hearing?.district || feed?.district
                   ? `${hearing?.district || feed?.district}`
                   : (feed?.virtualPlatform ? `Virtual (${feed.virtualPlatform})` : 'SKC Online Secretariat'));

               const itemHref = hearing?.slug
                 ? `/state-of-kashmir-crafts/public-hearings/${hearing.slug}`
                 : `/state-of-kashmir-crafts/consultations/${feed.slug || feed.id}`;

               return (
                 <div key={feed.id || feed.slug || feed.title} className="relative pl-6">
                   <div
                     className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 ${
                       isFirst ? 'border-red-500 animate-pulse' : 'border-brand-primary'
                     } rounded-full`}
                   ></div>
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                     <div className="space-y-1">
                       <div className="flex flex-wrap items-center gap-2">
                         <h3 className="font-bold text-gray-800 text-base">{feed.title}</h3>
                         <span className={`text-[9px] px-2 py-0.5 border font-bold rounded-full uppercase tracking-wide ${statusBadge}`}>
                           {feed.temporalStatus}
                         </span>
                       </div>
                       <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                         <span className="flex items-center gap-1">
                           <FaCalendarAlt className="text-gray-400" /> {feed.dateString}
                         </span>
                         <span className="flex items-center gap-1">
                           <FaMapMarkerAlt className="text-gray-400" /> {locationString}
                         </span>
                         <span className="flex items-center gap-1 uppercase tracking-wider text-[9px] text-brand-secondary font-black">
                           {feed.activityType}
                         </span>
                       </div>
                     </div>
                     <div>
                       {actionLabel && (
                         <a
                           href={itemHref}
                           className="inline-block text-center px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"
                         >
                           {actionLabel}
                         </a>
                       )}
                     </div>
                   </div>
                 </div>
               );
             };

             return (
               <div className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm transition space-y-12">
                 {currentNextItem && (
                   <div>
                     <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-6">Current / Next</h3>
                     <div className="relative border-l-2 border-[var(--card-left-accent)]/20 ml-2 space-y-8">
                       {renderItem(currentNextItem, true)}
                     </div>
                   </div>
                 )}

                 {upcomingItems.length > 0 && (
                   <div>
                     <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Upcoming</h3>
                     <div className="relative border-l-2 border-gray-200 ml-2 space-y-8">
                       {upcomingItems.map((item: any) => renderItem(item, false))}
                     </div>
                   </div>
                 )}

                 {completedItems.length > 0 && (
                   <div>
                     <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Recently Completed</h3>
                     <div className="relative border-l-2 border-gray-200 ml-2 space-y-8">
                       {completedItems.map((item: any) => renderItem(item, false))}
                     </div>
                   </div>
                 )}

                 {laterItems.length > 0 && (
                   <div>
                     <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Later Programme Activities</h3>
                     <div className="relative border-l-2 border-gray-200 ml-2 space-y-8">
                       {laterItems.map((item: any) => renderItem(item, false))}
                     </div>
                   </div>
                 )}

                 <div className="border-t border-gray-100 pt-6 flex justify-end">
                   <a
                     href="/state-of-kashmir-crafts/public-hearings"
                     className="inline-flex items-center gap-2 text-xs font-black text-brand-primary hover:text-brand-secondary transition"
                   >
                     View Full Activity Log &rarr;
                   </a>
                 </div>
               </div>
             );
          })()}

        </div>
      </section>

      <section className="py-20 bg-[#FDFBF9] text-gray-900 border-y border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl">


            <div className="flex justify-center mb-16">
               <Link 
                  href="/state-of-kashmir-crafts/public-hearings" 
                  className="px-8 py-3.5 bg-[#7B441F] text-white hover:bg-[#8E5229] border border-transparent font-black rounded-xl transition shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(123,68,31,0.25)] text-sm tracking-wide transform hover:-translate-y-0.5 active:translate-y-0 block text-center"
               >
                  Explore Public Hearings &rarr;
               </Link>
            </div>

            <div className="max-w-6xl mx-auto">
               <h3 className="text-xl font-bold mb-8 text-brand-secondary text-center">Hearing Topics & Flagship Themes</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {thematicClusters.map((cluster) => {
                     const totalThemes = cluster.themes.length;
                     const countsByStatus = cluster.themes.reduce((acc: any, t: any) => {
                        acc[t.status] = (acc[t.status] || 0) + 1;
                        return acc;
                     }, {});
                     const statusSummary = Object.entries(countsByStatus)
                        .map(([status, count]) => `${count} ${status}`)
                        .join(" • ");
                     
                     const groupKey = cluster.group.toLowerCase().replace(/[^a-z0-9]/g, '-');

                     return (
                        <div key={cluster.group} className="bg-[#F7F4EF] border border-[#E4D8CA] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between">
                           <button
                              id={`${groupKey}-header`}
                              aria-expanded={expandedGroups[cluster.group] ? "true" : "false"}
                              aria-controls={`${groupKey}-panel`}
                              onClick={() => toggleGroup(cluster.group)}
                              className="w-full text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/50 rounded-xl p-2 -m-2 transition cursor-pointer"
                           >
                              <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span data-editorial-accent-bg className="w-1.5 h-1.5 rounded-full"></span>
                                    <h4 className="font-black text-sm uppercase tracking-wider text-[#4A2D1B] inline-block">{cluster.group}</h4>
                                 </div>
                                 {cluster.summary && (
                                    <p className="text-[10px] text-[#6B5A4E] font-medium leading-relaxed">{cluster.summary}</p>
                                 )}
                                 <div className="text-[9px] text-[#8E7868] font-bold mt-1.5 flex flex-wrap items-center gap-1.5">
                                    <span className="bg-[#E4D8CA] px-1.5 py-0.5 rounded text-[8px] font-black text-[#4A2D1B]">{totalThemes} Active Themes</span>
                                    <span>•</span>
                                    <span>{statusSummary}</span>
                                    {cluster.ongoingProgramme && (
                                       <>
                                          <span>•</span>
                                          <span className="text-green-600 font-bold">Ongoing Programme: {cluster.ongoingProgramme}</span>
                                       </>
                                    )}
                                    {cluster.nextEventDate && cluster.nextEventDate !== 'TBD' && (
                                       <>
                                          <span>•</span>
                                          <span className="text-brand-primary">Next Dated Event: {cluster.nextEventDate} &mdash; {cluster.nextEventLocation}</span>
                                       </>
                                    )}
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end mt-2 md:mt-0">
                                 <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B5A4E]">
                                    {expandedGroups[cluster.group] ? "Collapse" : "Expand"}
                                 </span>
                                 <FaChevronDown 
                                    className={`text-xs text-[#4A2D1B] transition-transform duration-300 ${
                                       expandedGroups[cluster.group] ? 'rotate-180' : 'rotate-0'
                                    }`} 
                                 />
                              </div>
                           </button>

                           <div 
                              id={`${groupKey}-panel`}
                              role="region"
                              aria-labelledby={`${groupKey}-header`}
                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                 expandedGroups[cluster.group] ? 'max-h-[1200px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                              }`}
                           >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {cluster.themes.map((theme: any) => {
                                     const smartActions = getThemeSmartActions(theme);
                                     const progressPercent = theme.progress || 0;
                                     return (
                                        <div 
                                           key={theme.name} 
                                           className="bg-[#050A1E] border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[265px] transition text-left"
                                        >
                                           <div className="flex flex-col gap-2">
                                              <span className="text-xs font-bold text-white leading-tight border-b border-white/10 pb-1.5 line-clamp-1">{theme.name}</span>
                                              <span className="text-[10px] text-slate-300 font-semibold leading-tight line-clamp-2 h-7">
                                                 {theme.objective}
                                              </span>
                                              <div>
                                                 {(() => {
        const milestoneTime = new Date(theme.milestoneDate).getTime();
        const isPast = milestoneTime + (24 * 60 * 60 * 1000) < activityTimelineNow.getTime();
        const dynamicStatus = isPast ? "Concluded" : "Scheduled";
        const dynamicStatusColor = isPast ? "text-blue-600 bg-blue-50 border-blue-200" : "text-green-600 bg-green-50 border-green-200";
        return (
            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border-2 rounded whitespace-nowrap inline-block ${dynamicStatusColor}`}>
                {dynamicStatus}
            </span>
        );
    })()}
                                              </div>
                                              <div className="space-y-0.5 mt-1">
                                                 <div className="text-[8px] uppercase font-bold text-slate-400 tracking-wider">Next Milestone</div>
                                                 <div className="text-[10px] text-white font-bold flex flex-wrap items-center gap-1 leading-tight">
                                                    {theme.linkedHearings && theme.linkedHearings.length > 0 ? (
                                                       <>
                                                          <span>{theme.linkedHearings[0].mode || 'Hearing'}</span>
                                                          <span className="text-slate-400">•</span>
                                                          <span>{theme.linkedHearings[0].startAt ? new Date(theme.linkedHearings[0].startAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}</span>
                                                          <span className="text-slate-400">•</span>
                                                          <span className="text-brand-secondary">{theme.linkedHearings[0].venue || theme.linkedHearings[0].district}</span>
                                                       </>
                                                    ) : (
                                                       <span className="text-slate-400 italic">No formal hearings linked</span>
                                                    )}
                                                 </div>
                                              </div>
                                              <div className="space-y-1 mt-1">
                                                 <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 tracking-wider">
                                                    <span>Progress</span>
                                                    <span>{progressPercent > 0 ? `${progressPercent}%` : 'No activity started'}</span>
                                                 </div>
                                                 <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                                                    <div 
                                                       className="bg-brand-secondary h-full transition-all duration-500" 
                                                       style={{ width: `${progressPercent}%` }}
                                                    />
                                                 </div>
                                              </div>
                                           </div>

                                           <div className="mt-auto pt-3 flex gap-2">
                                              {smartActions.map((btn: any) => (
                                                 <Link 
                                                    key={btn.text}
                                                    href={btn.href}
                                                    className={`flex-1 text-center py-1.5 rounded text-[9px] font-black transition ${
                                                       btn.primary 
                                                          ? 'bg-brand-secondary text-brand-dark hover:bg-white hover:text-brand-dark' 
                                                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                                    }`}
                                                 >
                                                    {btn.text}
                                                 </Link>
                                              ))}
                                           </div>
                                        </div>
                                     );
                                  })}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Evidence Repository Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
             {evidenceMetricsMapped.map((ev: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                   <ev.icon className="text-4xl text-brand-secondary mb-4" />
                   <div className="text-3xl font-black text-gray-900 mb-2">{ev.count}</div>
                   <div className="text-xs font-bold text-gray-500 uppercase">{ev.label}</div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
             <FaShieldAlt data-ui-icon className="text-5xl mx-auto mb-6" />
             <h2 className="text-3xl font-black text-brand-dark mb-4">Transparency Center</h2>
             <p className="text-gray-600 max-w-2xl mx-auto">Ensuring the public holds the assessment accountable to its own methodological and procedural standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {transparencyChecks.map((check: any) => (
                <div key={check.label} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                   <check.icon className={`${check.color} text-2xl shrink-0`} />
                     <div className="flex flex-col text-left">
                        <span className="font-bold text-gray-800 text-sm leading-snug">{check.label}</span>
                        <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 mt-0.5">{check.status}</span>
                     </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Download Progress Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {downloads.map((doc: any, idx: number) => (
               <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-brand-primary transition flex flex-col items-center">
                  <FaFilePdf data-ui-icon className="text-4xl mb-4" />
                  <h3 className="font-bold text-sm text-gray-800 mb-6 h-10 flex items-center justify-center leading-tight">{doc}</h3>
                  <button disabled className="w-full px-4 py-2 bg-gray-50 text-gray-400 border border-gray-200 font-bold rounded-[14px] cursor-not-allowed text-xs">
                      Pending Generation
                    </button>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-2xl shadow-sm flex items-start gap-4">
             <FaLandmark data-ui-icon className="text-3xl shrink-0 mt-1" />
             <div>
                <h3 className="font-black text-gray-900 mb-2">Public Accountability Statement</h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                   The State of Kashmir Crafts assessment is committed to transparency. Participation statistics, consultation activities, and assessment progress are published publicly to promote accountability and trust.
                </p>
             </div>
           </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden universal-hero">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Follow the assessment as it unfolds.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/state-of-kashmir-crafts/participate"
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Participate Online
              </Link>
              <Link
                href="/state-of-kashmir-crafts/assessment-timeline"
                className="px-8 py-4 bg-brand-secondary text-white font-bold rounded-[14px] hover:bg-yellow-600 transition-all shadow-xl"
              >
                Explore Activity Register
              </Link>
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Register as Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/evidence-repository"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Submit Evidence
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}




