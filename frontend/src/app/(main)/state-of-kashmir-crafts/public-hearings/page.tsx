"use client";

import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';

import { SKC_PUBLIC_STATE } from '@/config/skc_prelaunch';
import React, { useState, useEffect, useMemo } from "react";
import { PARTICIPANT_CATEGORIES } from "@/lib/skc/participant-categories";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import {
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaVideo, 
  FaSearch,
  FaFilter, 
  FaArrowRight, 
  FaHistory, 
  FaFileSignature, 
  FaUserPlus, 
  FaChevronDown, 
  FaChevronUp,
  FaBell,
  FaInfoCircle, 
  FaFileAlt, 
  FaMap, 
  FaClock, 
  FaCheckCircle, 
  FaShieldAlt,
  FaUsers
} from "react-icons/fa";
import HearingSubscriptionModal from "./components/HearingSubscriptionModal";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { publicHearingsHeroFallback } from '@/config/heroFallbacks';
import { APPROVED_GOOGLE_MEET_URL, shouldShowMeetAction, getMeetButtonState, getHearingTimeWindow } from '@/config/googleMeetConfig';


const EVENT_TYPE_LABELS: Record<string, string> = {
  REGISTRATION: "Registration",
  PUBLIC_PARTICIPATION: "Public Participation",
  EVIDENCE_SUBMISSION: "Evidence Submission",
  ORIENTATION: "Orientation",
  PUBLIC_HEARING: "Public Hearing",
  THEMATIC_CONSULTATION: "Thematic Consultation",
  SUBMISSION_DEADLINE: "Submission Deadline",
  DRAFT_REVIEW: "Draft Review",
  VALIDATION: "Stakeholder Validation",
  EXPERT_REVIEW: "Expert Review",
  FINAL_PUBLICATION: "Final Publication",
};


function renderActions(hearing: any, primaryRoute: string) {
  const type = (hearing.eventType || '').toUpperCase();
  const isClosed = hearing.status === 'COMPLETED' || hearing.status === 'CLOSED';
  const now = new Date();
  
  const startAt = hearing.startAt || hearing.scheduledDate || hearing.date;
  const startDate = startAt ? new Date(startAt) : null;
  const isFuture = startDate ? now < startDate : false;
  
  if (type === 'REGISTRATION') {
    return (
      <>
        <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
        <Link href="/state-of-kashmir-crafts/participation-guidelines" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Guidelines</Link>
      </>
    );
  }
  if (type === 'PUBLIC_PARTICIPATION') {
    return (
      <>
        <Link href="/state-of-kashmir-crafts/participate" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Participate</Link>
        <Link href="/state-of-kashmir-crafts/questionnaires" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Questionnaires</Link>
      </>
    );
  }
  if (type === 'ORIENTATION') {
    return (
      <>
        <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
        <Link href="/state-of-kashmir-crafts/orientation-details" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Orientation Details</Link>
      </>
    );
  }
  if (type === 'PUBLIC_HEARING') {
    return (
      <>
        {!isClosed && <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>}
        {!isClosed && <Link href={`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=${hearing.slug}&hearingId=${hearing.id}`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>}
      </>
    );
  }
  if (type === 'THEMATIC_CONSULTATION') {
    return (
      <>
        {!isClosed && <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>}
        {!isClosed && <Link href={`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=${hearing.slug}&hearingId=${hearing.id}`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Evidence</Link>}
      </>
    );
  }
  if (type === 'SUBMISSION_DEADLINE') {
    return isClosed ? (
      <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">Submissions Closed</div>
    ) : (
      <>
        <Link href={`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=${hearing.slug}&hearingId=${hearing.id}`} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Submit Testimony</Link>
        <Link href={`/state-of-kashmir-crafts/submit-evidence`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Evidence</Link>
      </>
    );
  }
  if (type === 'DRAFT_REVIEW') {
    if (isFuture) {
      return (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">
          Opens 8 December 2026
        </div>
      );
    }
    return (
      <>
        <Link href="/state-of-kashmir-crafts/draft-findings" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Review Draft Findings</Link>
        {!isClosed && <Link href="/state-of-kashmir-crafts/public-comment" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Public Comment</Link>}
      </>
    );
  }
  if (type === 'VALIDATION') {
    if (isFuture) {
      return (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">
          Opens 18 December 2026
        </div>
      );
    }
    return (
      <>
        <Link href="/state-of-kashmir-crafts/validation-portal" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Open Validation Portal</Link>
        {!isClosed && <Link href="/state-of-kashmir-crafts/validation-response" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Validation Response</Link>}
      </>
    );
  }
  if (type === 'EXPERT_REVIEW') {
    if (isFuture) {
      return (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">
          Opens 22 December 2026
        </div>
      );
    }
    return (
      <Link href="/state-of-kashmir-crafts/expert-review-info" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">View Review Information</Link>
    );
  }
  if (type === 'FINAL_PUBLICATION') {
    if (isFuture) {
      return (
        <div className="w-full py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl text-xs font-bold text-center">
          Publishes 29 December 2026
        </div>
      );
    }
    return (
      <>
        <Link href="/state-of-kashmir-crafts/final-report" className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">View Final Report</Link>
        <a href="/state-of-kashmir-crafts/final-report/download" className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Download Report</a>
      </>
    );
  }

  return (
    <>
      <Link href={primaryRoute} className="w-full py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition text-center">Register</Link>
      <Link href={`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=${hearing.slug}&hearingId=${hearing.id}`} className="w-full py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-55 transition text-xs font-bold text-center">Submit Testimony</Link>
    </>
  );
}

function shouldShowTime(hearing: any) {
  const type = (hearing.eventType || '').toUpperCase();
  if (type === 'FINAL_PUBLICATION' || type === 'SUBMISSION_DEADLINE' || type === 'DRAFT_REVIEW' || type === 'VALIDATION' || type === 'EXPERT_REVIEW') return false;
  return true;
}


function getBetterType(hearing: any) {
  const t = hearing.title || '';
  if (t.includes('Exports')) return 'Thematic Consultation';
  if (t.includes('Future of Pashmina')) return 'Craft-Specific Hearing';
  if (t.includes('Digital Commerce')) return 'Thematic Consultation';
  if (t.includes('Future of Carpets')) return 'Craft-Specific Hearing';
  if (t.includes('Technology & Design')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Artisan Livelihoods')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('GI & Authenticity')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Women in Crafts')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Finance & Investment')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Raw Material Access')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Climate & Sustainability')) return 'Cross-Craft / Multi-Craft Thematic Hearing';
  if (t.includes('Cultural Heritage')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Education & Skills')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Global Markets')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Policy & Governance')) return 'Cross-Craft Policy Hearing';
  if (t.includes('Youth in Crafts')) return 'General Public Consultation';
  return getEventTypeLabel(hearing.eventType) || hearing.type || 'Public Consultation';
}

function getEventTypeLabel(eventType: string, defaultVal: string = '') {
  return EVENT_TYPE_LABELS[eventType] || defaultVal || eventType;
}

function getModeLabel(eventType: string, mode: string = '') {
  const typeUpper = (eventType || '').toUpperCase();
  const modeUpper = (mode || '').toUpperCase();
  const isOnline = modeUpper.includes('ONLINE') || modeUpper.includes('VIRTUAL') || modeUpper.includes('PORTAL') || modeUpper.includes('WEB');
  const isHybrid = modeUpper.includes('HYBRID') || modeUpper.includes('SRINAGAR / ONLINE');
  
  if (typeUpper === 'REGISTRATION') return isOnline ? 'Online Registration' : 'Registration';
  if (typeUpper === 'PUBLIC_PARTICIPATION') return isOnline ? 'Online Participation' : 'Participation';
  if (typeUpper === 'ORIENTATION') return isHybrid ? 'Hybrid Orientation' : (isOnline ? 'Online Orientation' : 'Orientation');
  if (typeUpper === 'PUBLIC_HEARING') return isOnline ? 'Online Public Hearing' : (isHybrid ? 'Hybrid Public Hearing' : 'In-Person Public Hearing');
  if (typeUpper === 'THEMATIC_CONSULTATION') return 'Online Thematic Consultation';
  if (typeUpper === 'SUBMISSION_DEADLINE') return 'Online Submission Deadline';
  if (typeUpper === 'DRAFT_REVIEW') return isHybrid ? 'Hybrid Draft Review' : 'Draft Review';
  if (typeUpper === 'VALIDATION') return isOnline ? 'Online Validation' : 'Validation';
  if (typeUpper === 'EXPERT_REVIEW') return isHybrid ? 'Hybrid Expert Review' : 'Expert Review';
  if (typeUpper === 'FINAL_PUBLICATION') return isOnline ? 'Online Publication' : 'Publication';
  
  return mode || 'Online';
}

export default function Page() {
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View switch tab state
  const [activeTab, setActiveTab] = useState<'timeline' | 'calendar' | 'map'>('timeline');
  const [currentPhase, setCurrentPhase] = useState<string>(SKC_PUBLIC_STATE.currentPhase);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const canonicalSlugs = ['stakeholder-registration-opens-17-aug-2026', 'public-participation-opens-17-aug-2026', 'public-hearing-orientation-25-aug-2026', 'future-of-pashmina-05-sept-2026', 'carpets-and-kani-12-sept-2026', 'artisan-livelihoods-19-sept-2026', 'raw-material-access-26-sept-2026', 'gi-and-authenticity-03-oct-2026', 'women-in-crafts-10-oct-2026', 'craft-finance-17-oct-2026', 'education-and-skills-24-oct-2026', 'heritage-conservation-31-oct-2026', 'digital-craft-markets-07-nov-2026', 'technology-and-design-14-nov-2026', 'global-craft-markets-21-nov-2026', 'climate-and-sustainability-28-nov-2026', 'final-submission-deadline', 'draft-findings-review-08-dec-2026', 'stakeholder-validation-18-dec-2026', 'expert-review-meeting-22-dec-2026', 'final-report-tabled-29-dec-2026'];
  const canonicalHearings = hearings.filter(h => canonicalSlugs.includes(h.slug));

  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedCraft, setSelectedCraft] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRegistrationOpen, setSelectedRegistrationOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showCompletedSection, setShowCompletedSection] = useState(false);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any | null>(null);

  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026
  // Interactive Map District state
  const [selectedGeoDistrict, setSelectedGeoDistrict] = useState('Srinagar');

  // Sync calendar date view when Date Range filter changes
  useEffect(() => {
    if (selectedDateRange === 'November 2026') {
      setCurrentDate(new Date(2026, 10, 1));
    } else if (selectedDateRange === 'December 2026') {
      setCurrentDate(new Date(2026, 11, 1));
    } else if (selectedDateRange === 'January 2027') {
      setCurrentDate(new Date(2027, 0, 1));
    } else if (selectedDateRange === 'February 2027') {
      setCurrentDate(new Date(2027, 1, 1));
    } else if (selectedDateRange === 'March 2027') {
      setCurrentDate(new Date(2027, 2, 1));
    } else if (selectedDateRange === 'This Month' || selectedDateRange === 'This Week') {
      const now = new Date();
      setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [selectedDateRange]);

  const [fetchError, setFetchError] = useState(false);
  useEffect(() => {
    fetch('/api/backend/skc/hearings/public')
      .then(async res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        let actualEvents: any[] = [];
        if (data.success && Array.isArray(data.data)) {
          actualEvents = data.data;
        } else if (data.status === 'success' && data.data && data.data.success && Array.isArray(data.data.data)) {
          actualEvents = data.data.data;
        } else if (data.status === 'success' && Array.isArray(data.data)) {
          actualEvents = data.data;
        }
        
        actualEvents = actualEvents.filter(evt => evt.isFormalHearing || evt.eventType === 'PUBLIC_HEARING' || evt.category === 'PUBLIC_HEARING').filter(evt => !evt.title?.includes('Youth in Crafts')).map(evt => {
            const craftFocusMap: Record<string, string[]> = {
              'Youth in Crafts': ['ALL_CRAFTS'],
              'Exports': ['ALL_CRAFTS'],
              'Future of Pashmina': ['Pashmina'],
              'Digital Commerce': ['ALL_CRAFTS'],
              'Future of Carpets': ['Carpet'],
              'Technology & Design': ['Pashmina', 'Carpet', 'Papier-Mâché', 'Walnut Wood', 'Sozni', 'Kani'],
              'Artisan Livelihoods': ['ALL_CRAFTS'],
              'GI & Authenticity': ['Pashmina', 'Kani', 'Carpet', 'Papier-Mâché', 'Walnut Wood'],
              'Women in Crafts': ['ALL_CRAFTS'],
              'Finance & Investment': ['ALL_CRAFTS'],
              'Raw Material Access': ['Pashmina', 'Carpet', 'Silk'],
              'Climate & Sustainability': ['Pashmina', 'Carpet', 'ALL_CRAFTS'],
              'Cultural Heritage': ['ALL_CRAFTS'],
              'Education & Skills': ['ALL_CRAFTS'],
              'Global Markets': ['ALL_CRAFTS'],
              'Policy & Governance': ['ALL_CRAFTS']
            };
            
            if (craftFocusMap[evt.title]) {
              evt.craftFocus = craftFocusMap[evt.title];
            }
          const rawType = (evt.eventType || '').toUpperCase().replace(/-/g, '_');
          let normalizedStatus = evt.status || 'UPCOMING';
          let regStatus = 'NOT_OPEN';
            
            // Dynamic registration calculation
            if (evt.registration_open_at && evt.registration_close_at) {
              const nowTime = new Date().getTime();
              const openTime = new Date(evt.registration_open_at).getTime();
              const closeTime = new Date(evt.registration_close_at).getTime();
              if (openTime <= nowTime && closeTime >= nowTime) {
                regStatus = 'OPEN';
              }
            } else if (evt.registrationOpenAt && evt.registrationCloseAt) {
              const nowTime = new Date().getTime();
              const openTime = new Date(evt.registrationOpenAt).getTime();
              const closeTime = new Date(evt.registrationCloseAt).getTime();
              if (openTime <= nowTime && closeTime >= nowTime) {
                regStatus = 'OPEN';
              }
            } else if (normalizedStatus === 'REGISTRATION_OPEN') {
               // Fallback if no dates but explicit status
               normalizedStatus = 'UPCOMING';
               regStatus = 'OPEN';
            }

            if (rawType === 'REGISTRATION' || rawType === 'PUBLIC_PARTICIPATION') {
            const endDate = evt.endDate ? new Date(evt.endDate) : new Date('2026-11-28');
            endDate.setHours(23, 59, 59, 999);
            const now = new Date();
            if (now <= endDate) {
              normalizedStatus = 'ONGOING';
            }
          }
          return {
            ...evt,
            eventType: rawType,
            status: normalizedStatus,
            registrationStatus: regStatus
          };
        });
        
        actualEvents.sort((a, b) => {
          const dateA = typeof a.startAt === 'string' ? a.startAt : (a.date || a.scheduledDate);
          const dateB = typeof b.startAt === 'string' ? b.startAt : (b.date || b.scheduledDate);
          const tA = new Date(dateA).getTime();
          const tB = new Date(dateB).getTime();
          if (!isNaN(tA) && !isNaN(tB) && tA !== tB) return tA - tB;
          return (a.programmeSequence || 0) - (b.programmeSequence || 0);
        });
        setHearings(actualEvents);

        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch hearings:', err);
        setFetchError(true);
        setHearings([]);
        setLoading(false);
      });
  }, []);

  // Filter logic
    const baseHearingsForStatusFacets = useMemo(() => {
      let result = [...hearings];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(h => 
          h.title?.toLowerCase().includes(q) || 
          h.venue?.toLowerCase().includes(q) || 
          h.shortSummary?.toLowerCase().includes(q) ||
          h.fullDescription?.toLowerCase().includes(q) ||
          h.district?.toLowerCase().includes(q) ||
          h.craftFocus?.toLowerCase().includes(q) ||
          h.panelChair?.toLowerCase().includes(q) ||
          h.agenda?.toLowerCase().includes(q) ||
          h.summary?.toLowerCase().includes(q) ||
          h.recommendations?.toLowerCase().includes(q) ||
          (h.topics && h.topics.some((t: string) => t.toLowerCase().includes(q))) ||
          (h.moderators && h.moderators.some((m: string) => m.toLowerCase().includes(q))) ||
          (h.speakers && h.speakers.some((s: string) => s.toLowerCase().includes(q)))
        );
      }

      if (selectedDistrict !== 'ALL') {
        result = result.filter(h => h.district === selectedDistrict);
      }

      if (selectedTopic !== 'ALL') {
        result = result.filter(h => {
          if (!h.topics || !Array.isArray(h.topics)) return false;
          return h.topics.includes(selectedTopic);
        });
      }

      if (selectedCraft !== 'ALL') {
        result = result.filter(h => {
          if (!h.craftFocus) return false;
          let crafts = Array.isArray(h.craftFocus) ? h.craftFocus : [h.craftFocus];
          // Core rule: Match specific craft OR if the hearing is cross-craft
          return crafts.includes(selectedCraft) || crafts.includes('ALL_CRAFTS') || crafts.includes('Cross-craft') || crafts.includes('All Crafts');
        });
      }

      if (selectedStakeholder !== 'ALL') {
      result = result.filter(h => h.stakeholderCategories && h.stakeholderCategories.includes(selectedStakeholder));
    }

    

    if (selectedDateRange !== 'ALL' && activeTab !== 'calendar') {
      const today = new Date();
      result = result.filter(h => {
        if (!h.date) return false;
        const hDate = new Date(h.date);
        if (selectedDateRange === 'This Week') {
          const oneWeekLater = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
          return hDate >= today && hDate <= oneWeekLater;
        }
        if (selectedDateRange === 'This Month') {
          return hDate.getMonth() === today.getMonth() && hDate.getFullYear() === today.getFullYear();
        }
        if (selectedDateRange === 'Next Month') {
          return hDate.getMonth() === 7 && hDate.getFullYear() === 2026;
        }
        if (selectedDateRange === 'November 2026') {
          return hDate.getMonth() === 10 && hDate.getFullYear() === 2026;
        }
        if (selectedDateRange === 'December 2026') {
          return hDate.getMonth() === 11 && hDate.getFullYear() === 2026;
        }
        if (selectedDateRange === 'January 2027') {
          return hDate.getMonth() === 0 && hDate.getFullYear() === 2027;
        }
        if (selectedDateRange === 'February 2027') {
          return hDate.getMonth() === 1 && hDate.getFullYear() === 2027;
        }
        if (selectedDateRange === 'March 2027') {
          return hDate.getMonth() === 2 && hDate.getFullYear() === 2027;
        }
        if (selectedDateRange === 'Past Hearings') {
          return hDate < today || h.status === 'COMPLETED';
        }
        return true;
      });
    }

    return result;
  }, [hearings, searchQuery, selectedDistrict, selectedTopic, selectedCraft, selectedStakeholder, selectedDateRange, activeTab]);

  const filteredHearings = useMemo(() => {
    let result = [...baseHearingsForStatusFacets];
    
    if (selectedRegistrationOpen) {
      result = result.filter(h => h.registrationStatus === 'OPEN');
    }
    
    if (selectedStatus !== 'ALL') {
      result = result.filter(h => {
        const s = selectedStatus.toUpperCase();
        if (s === 'LIVE / ONGOING') {
          return h.status === 'LIVE' || h.status === 'ONGOING';
        }
        if (s === 'UPCOMING') {
          return h.status === 'UPCOMING' || h.status === 'SCHEDULED' || h.status === 'REGISTRATION_OPEN';
        }
        if (s === 'SCHEDULED' || s === 'REGISTRATION OPEN') {
          return h.registrationStatus === 'OPEN';
        }
        return h.status === s;
      });
    }
    const getStatusPriority = (h: any) => {
        if (h.status === 'LIVE' || h.status === 'ONGOING') return 1;
        if (h.registrationStatus === 'OPEN') return 2;
        if (h.status === 'UPCOMING' || h.status === 'SCHEDULED' || h.status === 'REGISTRATION_OPEN') return 3;
        if (h.status === 'POSTPONED') return 4;
        if (h.status === 'CANCELLED') return 5;
        if (h.status === 'COMPLETED' || h.status === 'CLOSED') return 6;
        return 7;
      };
      
      result.sort((a, b) => {
        const pA = getStatusPriority(a);
        const pB = getStatusPriority(b);
        if (pA !== pB) return pA - pB;
        
        if (pA === 6) {
          const dA = a.date || a.scheduledDate ? new Date(a.date || a.scheduledDate).getTime() : 0;
          const dB = b.date || b.scheduledDate ? new Date(b.date || b.scheduledDate).getTime() : 0;
          return dB - dA;
        } else {
          const dA = a.date || a.scheduledDate ? new Date(a.date || a.scheduledDate).getTime() : Infinity;
          const dB = b.date || b.scheduledDate ? new Date(b.date || b.scheduledDate).getTime() : Infinity;
          return dA - dB;
        }
      });
      return result;
    }, [baseHearingsForStatusFacets, selectedStatus, selectedRegistrationOpen]);

  // Dropdown list categories
  const derivedDistricts = useMemo(() => Array.from(new Set(canonicalHearings.map((h: any) => h.district).filter(Boolean))), [canonicalHearings]);
  const derivedCrafts = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.craftFocus || []);
    return Array.from(new Set(all)).filter(Boolean).filter(c => c !== 'ALL_CRAFTS');
  }, [hearings]);
  const derivedTopics = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.topics || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [hearings]);
  const derivedStakeholders = useMemo(() => {
    const all = hearings.flatMap((h: any) => h.stakeholderCategories || []);
    return Array.from(new Set(all)).filter(Boolean);
  }, [hearings]);
  const participationTypes = ["Attend / Register", "Submit Written Testimony", "Submit Evidence", "Panel Speaker", "Observer", "Institutional Submission"];
  const dateRanges = ["This Week", "This Month", "Next 30 Days", "September 2026", "October 2026", "November 2026", "Past Hearings"];

  useEffect(() => {
    fetch('/api/backend/public/skc/metadata')
      .then(res => {
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Not a JSON response");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.success && resData.data) {
          if (Array.isArray(resData.data.districts)) setDistricts(resData.data.districts);
          if (Array.isArray(resData.data.crafts)) setCrafts(resData.data.crafts);
          if (Array.isArray(resData.data.topics)) setTopics(resData.data.topics);
          if (Array.isArray(resData.data.stakeholders)) setStakeholders(resData.data.stakeholders);
          if (Array.isArray(resData.data.participationTypes)) setParticipationTypes(resData.data.participationTypes.map((p: any) => p.name));
        }
      })
      .catch(err => console.error('Failed to fetch metadata:', err));
  }, []);

  // Interactive GIS metrics
  const districtGisData: { [key: string]: { hearingsCount: number; participants: number } } = useMemo(() => {
    return derivedDistricts.reduce((acc, dist) => {
      const distHearings = filteredHearings.filter(h => h.district === dist && h.eventType === 'PUBLIC_HEARING');
      acc[dist] = {
        hearingsCount: distHearings.length,
        participants: distHearings.reduce((sum, h) => sum + (h.participantsCount || 0), 0)
      };
      return acc;
    }, {} as { [key: string]: { hearingsCount: number; participants: number } });
  }, [filteredHearings, derivedDistricts]);
  const selectedGis = districtGisData[selectedGeoDistrict] || { hearingsCount: 0, participants: 0 };

  // Calendar calculations
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getHearingsForDate = (day: Date) => {
    const dayKey = format(day, "yyyy-MM-dd");
    return filteredHearings.filter(event => event.scheduledDate === dayKey);
  };
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Pre-Launch program milestones list
  const preLaunchMilestones = [
    { date: formatTimelineDate(SKC_2026_SCHEDULE.registration.plannedStart), title: 'Public Hearing Registration Opens', status: 'Scheduled' },
    { date: formatTimelineDate(SKC_2026_SCHEDULE.orientation.plannedStart), title: 'Public Hearing Orientation', status: 'Scheduled' },
    { date: formatTimelineDate(SKC_2026_SCHEDULE.hearings.plannedStart), title: 'Formal Public Hearings Begin', status: 'Scheduled' },
    { date: formatTimelineDate(SKC_2026_SCHEDULE.hearings.plannedEnd), title: 'Formal Public Hearings Conclude', status: 'Scheduled' },
    { date: formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedEnd), title: 'Written Testimony Closes', status: 'Scheduled' }
  ];
  // Diagnostic logs
  const events = filteredHearings;
  console.log("Calendar events:", events);
  console.log(
    "October events:",
    events.filter((event) =>
      event.scheduledDate?.startsWith("2026-10")
    )
  );

  return (
    <main className="w-full bg-gray-50 min-h-screen font-sans antialiased text-gray-800">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="public-hearings" 
        fallbackConfig={publicHearingsHeroFallback as any} 
      />

      {/* 2. Status Strip Ribbon */}
      <section className="bg-brand-primary text-white py-6 border-b-4 border-brand-secondary">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-xs font-black uppercase tracking-wider text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400">Assessment Cycle:</span>
              <span className="text-brand-secondary">2026</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400">Current Phase:</span>
              <span className="text-brand-secondary">Registration & Public Participation</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="text-gray-500">Published Programme Events</span>
              <span className="text-brand-secondary font-black">{canonicalHearings.length}</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="text-gray-500">Formal Public Hearings</span>
              <span className="text-brand-secondary font-black">{canonicalHearings.filter(h => h.code && h.code.startsWith('HEARING_') && h.code !== 'HEARING_ORIENTATION').length}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400">Participation Coverage:</span>
              <span className="text-brand-secondary">10 of 10 Districts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main content */}
      <section className="py-[72px]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header row with Segmented View switch */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="text-left">
              <span data-editorial-accent-text className="text-[10px] font-black  uppercase tracking-[0.12em] block mb-1">
                PUBLIC INQUIRY PLATFORM
              </span>
              <h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Public Hearings</h2>
                <div className="mt-4 bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-blue-900">
                  <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-blue-800">Assessment Programme: 17 Aug–29 Dec 2026</h3>
                  <p className="text-xs font-medium leading-relaxed">Scheduled hearing sessions run from 5 September through 28 November. December includes validation and expert review meetings.</p>
                </div>
            </div>

            {/* Segmented View Switch */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shrink-0">
              <button 
                onClick={() => setActiveTab('timeline')} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'timeline' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                List
                </button>
              <button 
                onClick={() => setActiveTab('calendar')} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Calendar
              </button>
              <button 
                onClick={() => setActiveTab('map')} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'map' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Map
              </button>
            </div>
          </div>

          {/* 4. Search & Filters Panel */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="text-gray-400 text-xs" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search hearings, testimony, districts, crafts, organizations, speakers or keywords..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* District */}
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Districts</option>
                {derivedDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              {/* Craft Focus */}
              <select
                value={selectedCraft}
                onChange={e => setSelectedCraft(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              >
                <option value="ALL">All Crafts</option>
                {derivedCrafts.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              

                {/* Status */}
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live / Ongoing">Live Now</option>
                  <option value="Completed">Completed</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Date Range */}
                <select
                  value={selectedDateRange}
                  onChange={e => setSelectedDateRange(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                >
                  <option value="ALL">All Dates</option>
                  {dateRanges.map(dr => <option key={dr} value={dr}>{dr}</option>)}
                </select>

                <button 
                  onClick={() => setShowMoreFilters(!showMoreFilters)} 
                  className="w-full text-xs px-3 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-between transition"
                >
                  <span>More Filters</span>
                  <span className="text-[9px]">{showMoreFilters ? '▲' : '▼'}</span>
                </button>

                {showMoreFilters && (
                  <>
                    {/* Hearing Theme / Topic */}
                    <select
                      value={selectedTopic}
                      onChange={e => setSelectedTopic(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="ALL">All Themes</option>
                      {derivedTopics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Stakeholder */}
                    <select
                      value={selectedStakeholder}
                      onChange={e => setSelectedStakeholder(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="ALL">All Stakeholders</option>
                      {derivedStakeholders.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    
                  </>
                )}
              </div>

            {/* Quick Action Button Row */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-[11px]">
              <button 
                onClick={() => setSelectedStatus(selectedStatus === 'Upcoming' ? 'ALL' : 'Upcoming')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  selectedStatus === 'Upcoming' ? 'bg-stone-800 text-white border-stone-900 shadow-sm font-black' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                Upcoming {baseHearingsForStatusFacets.filter(h => h.status === 'SCHEDULED' || h.status === 'UPCOMING').length}
              </button>
              
              <button 
                onClick={() => setSelectedStatus(selectedStatus === 'Scheduled' ? 'ALL' : 'Scheduled')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  selectedStatus === 'Scheduled' ? 'bg-stone-800 text-white border-stone-900 shadow-sm font-black' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Registration Open {(() => {
                    const hasRegFields = baseHearingsForStatusFacets.some(h => (h.registration_open_at && h.registration_close_at) || (h.registrationOpenAt && h.registrationCloseAt));
                    if (!hasRegFields) return '—';
                    return baseHearingsForStatusFacets.filter(h => h.registrationStatus === 'OPEN').length;
                  })()}
              </button>

              <button 
                onClick={() => setSelectedStatus(selectedStatus === 'Live / Ongoing' ? 'ALL' : 'Live / Ongoing')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  selectedStatus === 'Live / Ongoing' ? 'bg-stone-800 text-white border-stone-900 shadow-sm font-black' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                Live {baseHearingsForStatusFacets.filter(h => h.status === 'LIVE' || h.status === 'ONGOING').length}
              </button>

              <button 
                onClick={() => setSelectedStatus(selectedStatus === 'Completed' ? 'ALL' : 'Completed')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  selectedStatus === 'Completed' ? 'bg-stone-800 text-white border-stone-900 shadow-sm font-black' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                Completed {baseHearingsForStatusFacets.filter(h => h.status === 'COMPLETED').length}
              </button>

              <Link 
                href="/state-of-kashmir-crafts/public-hearings/submit-testimony"
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold flex items-center gap-1.5 transition"
              >
                <span>📄</span>
                Written Testimonies (Not yet published)
              </Link>

              <a 
                href="/state-of-kashmir-crafts/assessment-timeline"
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold flex items-center gap-1.5 transition"
              >
                <span>📥</span>
                Download Schedule
              </a>

              <button 
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  activeTab === 'calendar' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span>📅</span>
                Calendar View
              </button>

              <button 
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
                  activeTab === 'map' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span>🗺</span>
                District Map
              </button>
            </div>
          </div>

          {/* 5. Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              
              
              {/* Results Count and Filter Chips */}
                <div className="mb-6 flex flex-col gap-3">

                {(selectedDistrict !== 'ALL' || selectedCraft !== 'ALL' || selectedTopic !== 'ALL' || selectedStatus !== 'ALL' || selectedStakeholder !== 'ALL' || selectedDateRange !== 'ALL' || selectedRegistrationOpen) && (
                  <div className="flex flex-wrap items-center gap-2 bg-stone-50 border border-gray-150 p-3 rounded-xl">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider mr-2">Active Filters:</span>
                    {selectedDistrict !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        District: {selectedDistrict}
                        <button onClick={() => setSelectedDistrict('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    {selectedCraft !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        Craft: {selectedCraft}
                        <button onClick={() => setSelectedCraft('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    {selectedTopic !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        Theme: {selectedTopic}
                        <button onClick={() => setSelectedTopic('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    {selectedStatus !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        Status: {selectedStatus}
                        <button onClick={() => setSelectedStatus('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    {selectedStakeholder !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        Stakeholder: {selectedStakeholder}
                        <button onClick={() => setSelectedStakeholder('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    {selectedDateRange !== 'ALL' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-stone-750 rounded-full text-xs font-semibold shadow-2xs">
                        Dates: {selectedDateRange}
                        <button onClick={() => setSelectedDateRange('ALL')} className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedDistrict('ALL');
                        setSelectedCraft('ALL');
                        setSelectedTopic('ALL');
                        setSelectedStatus('ALL');
                        setSelectedStakeholder('ALL');
                        setSelectedDateRange('ALL');
                      }} 
                      className="text-xs font-black text-red-500 hover:text-red-650 hover:underline px-2"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  {canonicalHearings.length === 0 ? (
                    /* Milestones Timeline */
                    <div className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {loading ? 'Loading public hearings...' : (fetchError ? 'Public hearing information could not be loaded. Please try again shortly.' : 'No public assessment programme events are currently available.')}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 max-w-2xl">
                        {loading ? 'Please wait while we fetch the latest public hearing schedules and testimonies.' : (fetchError ? 'There was a problem communicating with the server. If this issue persists, please check back later.' : 'Confirmed public hearings, agendas, and participant registration links will be published here once approved by the Assessment Secretariat.')}
                      </p>

                      <div className="border-t border-gray-100 pt-8">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-6">Programme Schedule Milestones</h4>
                        <div className="relative border-l-2 border-[var(--card-left-accent)]/20 ml-4 space-y-8">
                          {preLaunchMilestones.map((m, idx) => (
                            <div key={idx} className="relative pl-8">
                              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-brand-primary rounded-full"></div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <span className="text-[10px] font-bold text-brand-secondary uppercase block mb-0.5">{m.date}</span>
                                  <h5 className="font-bold text-gray-800 text-sm">{m.title}</h5>
                                </div>
                                <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full self-start sm:self-center">
                                  {m.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : filteredHearings.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                      <p className="text-gray-500 font-bold">No programme events matching the selected filters were found.</p>
                      <p className="text-xs text-gray-400 mt-2">Adjust your filters or search terms above.</p>
                    </div>
                  ) : (
                    (selectedStatus === 'ALL' && !selectedRegistrationOpen ? [
                        ...filteredHearings.filter(h => h.status !== 'COMPLETED' && h.status !== 'CLOSED'),
                        ...(filteredHearings.some(h => h.status === 'COMPLETED' || h.status === 'CLOSED') ? [{
                          _isDivider: true,
                          id: 'completed-divider',
                          count: filteredHearings.filter(h => h.status === 'COMPLETED' || h.status === 'CLOSED').length
                        }] : []),
                        ...(showCompletedSection ? filteredHearings.filter(h => h.status === 'COMPLETED' || h.status === 'CLOSED') : [])
                      ] : filteredHearings).map(hearing => {
                        if (hearing._isDivider) {
                          return (
                            <div key={hearing.id} className="mt-8 mb-2 border-t border-gray-200 pt-8 w-full flex items-center col-span-full">
                              <button 
                                onClick={() => setShowCompletedSection(!showCompletedSection)}
                                className="flex items-center gap-2 text-stone-500 font-black uppercase tracking-wider text-xs hover:text-stone-700 transition w-full text-left"
                              >
                                Completed Hearings ({hearing.count}) <span className="ml-auto text-[10px]">{showCompletedSection ? '▲' : '▼'}</span>
                              </button>
                            </div>
                          );
                        }
                        
                        let statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                      if (hearing.status === 'ONGOING') statusBadge = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
                      if (hearing.status === 'COMPLETED') statusBadge = 'bg-gray-100 text-gray-650 border-gray-200';

                      // Approved 4-Route destination mapping via event metadata (eventType/craftFocus/category with slug fallback)
                      const getApprovedEventRoute = (event: any) => {
                          const type = (event.eventType || event.category || event.craftFocus || '').toUpperCase();
                          const slug = (event.slug || '').toLowerCase();

                          if (type.includes('REGISTRATION') || slug.includes('stakeholder-registration')) {
                            return '/state-of-kashmir-crafts/stakeholder-registry';
                          }
                          if (type.includes('VALIDATION') || type.includes('DRAFT FINDINGS') || slug.includes('draft-findings') || slug.includes('validation')) {
                            return '/state-of-kashmir-crafts/validation-round';
                          }
                          if (type.includes('EXPERT REVIEW') || slug.includes('expert-review')) {
                            return '/state-of-kashmir-crafts/expert-review';
                          }
                          return '/state-of-kashmir-crafts/participate?hearingSlug=' + event.slug + '&hearingId=' + event.id;
                        };

                      const primaryRoute = getApprovedEventRoute(hearing);

                      return (
                        <div key={hearing.id} className="bg-white border border-gray-200 rounded-[24px] p-6 hover:shadow-md transition flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-2 py-0.5 border font-bold rounded-full uppercase tracking-wide ${statusBadge}`}>
                                {hearing.status.replace(/_/g, ' ')}
                              </span>
                              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                  <FaMapMarkerAlt /> {hearing.district || 'All Districts'}
                                </span>
                                {hearing.craftFocus && Array.isArray(hearing.craftFocus) && hearing.craftFocus.map((craft: string, i: number) => (
                                  <span key={i} className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 font-bold rounded-full uppercase tracking-wide">
                                    {craft === 'ALL_CRAFTS' ? 'Cross-Craft' : craft}
                                  </span>
                                ))}
                            </div>
                            <div data-editorial-accent-text className="text-[10px] font-bold  uppercase tracking-wider mb-1">{getBetterType(hearing)}</div>
<h3 className="text-xl font-bold text-gray-900 leading-snug">{hearing.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{hearing.shortSummary}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                              <span data-ui-icon className="flex items-center gap-1.5  font-bold">
                                <FaCalendarAlt data-ui-icon  className="" /> {(() => {
                                  
                                  if (hearing.eventType === 'DRAFT_REVIEW' || (hearing.title && hearing.title.includes('Draft Findings'))) {
                                    return '8–17 December 2026';
                                  }
                                  const displayDate = hearing.scheduledDate || hearing.date || hearing.startAt;

                                  if (displayDate) {
                                    const parsed = new Date(displayDate);
                                    if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1970) {
                                      return parsed.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
                                    }
                                  }
                                  return 'Date to be confirmed';
                                })()}
                              </span>
                              <span className="flex items-center gap-1.5 text-brand-secondary font-bold">
                                {shouldShowTime(hearing) ? <><FaClock /> {hearing.eventType === 'REGISTRATION' || hearing.eventType === 'PUBLIC_PARTICIPATION' ? 'Window Active' : '11:00 AM – 3:00 PM IST'}</> : null}
                              </span>
                              <span className="flex items-center gap-1">📍 {getModeLabel(hearing.eventType, hearing.venue || hearing.mode || 'Virtual Webcast')}</span>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col justify-end md:justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-56">
                            {/* Reserved fixed-height header slot for Meet Pill (54px) to guarantee 100% button alignment across all 20 cards */}
                            <div className="w-full h-[54px] flex items-center justify-center">
                              {(() => {
                                const meetState = getMeetButtonState(hearing);
                                if (meetState.status === 'ACTIVE') {
                                  return (
                                    <a
                                      href={meetState.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full flex flex-col items-center justify-center h-[52px] px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-center leading-tight transition shadow-xs"
                                    >
                                      <span className="text-[13px] font-semibold flex items-center gap-1.5">
                                        {meetState.title}
                                      </span>
                                      <span className="text-[11px] font-medium opacity-90">
                                        {meetState.timeSubtitle}
                                      </span>
                                    </a>
                                  );
                                }
                                if (meetState.status === 'BEFORE_WINDOW') {
                                  return (
                                    <button
                                      disabled
                                      title={meetState.label}
                                      className="w-full flex flex-col items-center justify-center h-[52px] px-4 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-center leading-tight cursor-not-allowed"
                                    >
                                      <span className="text-[13px] font-semibold text-gray-700">
                                        {meetState.title}
                                      </span>
                                      <span className="text-[11px] font-medium text-gray-500">
                                        {meetState.timeSubtitle}
                                      </span>
                                    </button>
                                  );
                                }
                                if (meetState.status === 'AFTER_WINDOW') {
                                  return (
                                    <div className="w-full flex flex-col items-center justify-center h-[52px] px-4 rounded-full bg-gray-50 border border-gray-200 text-center leading-tight">
                                      <span className="text-[13px] font-semibold text-gray-600">
                                        {meetState.title}
                                      </span>
                                      <span className="text-[11px] font-medium text-gray-400">
                                        {meetState.timeSubtitle}
                                      </span>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                            {(() => {
                                const isExpanded = expandedCardId === hearing.id;
                                const isCompleted = hearing.status === 'COMPLETED' || hearing.status === 'CLOSED';
                                const hearingDate = hearing.date || hearing.scheduledDate || hearing.startAt;
                                  const isPast = hearingDate ? new Date(hearingDate) < new Date() : false;
                                  const regOpen = hearing.registrationStatus === 'OPEN' && !isPast;
                                const testimonyOpen = hearing.status !== 'CANCELLED' && hearing.status !== 'POSTPONED';
                                
                                return (
                                  <div className="w-full flex flex-col gap-2 mt-2">
                                    <div className="flex gap-2 w-full">
                                      <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}`} className="flex-1 py-2 bg-white text-brand-primary border border-gray-250 rounded-xl hover:bg-gray-50 transition text-xs font-bold text-center">
                                        View Details
                                      </Link>
                                      <button 
                                        onClick={() => setExpandedCardId(isExpanded ? null : hearing.id)}
                                        className={`flex-1 py-2 text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1 ${isCompleted ? 'bg-gray-600 hover:bg-gray-700' : 'bg-brand-primary hover:bg-brand-secondary'}`}
                                      >
                                        {isCompleted ? 'Archival' : 'Participate'} <FaChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    </div>
                                    
                                    {isExpanded && (
                                      <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col gap-3 text-xs text-left animate-fadeIn mt-1">
                                        {isCompleted ? (
                                          <>
                                            <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#record`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Record</Link>
                                            <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#testimony`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Published Testimony</Link>
                                            <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#summary`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">✓ View Findings / Summary</Link>
                                          </>
                                        ) : (
                                          <>
                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/participate" className={`flex items-center gap-2 font-semibold ${regOpen ? 'text-gray-700 hover:text-brand-primary' : 'text-gray-400 cursor-not-allowed pointer-events-none'}`}>
                                                <span className={`${regOpen ? 'text-emerald-600' : 'text-gray-400'}`}>✓</span> Attend / Register
                                              </Link>
                                              {!regOpen && <span className="text-[10px] text-red-500 font-bold ml-5">Registration Closed</span>}
                                            </div>
                                            
                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/public-hearings/submit-testimony" className={`flex items-center gap-2 font-semibold ${testimonyOpen ? 'text-gray-700 hover:text-brand-primary' : 'text-gray-400 cursor-not-allowed pointer-events-none'}`}>
                                                <span className={`${testimonyOpen ? 'text-emerald-600' : 'text-gray-400'}`}>✓</span> Submit Written Testimony
                                              </Link>
                                              {!testimonyOpen && <span className="text-[10px] text-red-500 font-bold ml-5">Submissions Closed</span>}
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                              <Link href="/state-of-kashmir-crafts/evidence-repository" className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-emerald-600">✓</span> Submit Evidence
                                              </Link>
                                            </div>
                                            
                                            {hearing.speakers && hearing.speakers.length > 0 && (
                                              <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#speaker`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Panel Speaker
                                              </Link>
                                            )}

                                            {(hearing.format?.name === 'Hybrid' || hearing.format?.name === 'Virtual' || (hearing.venue && hearing.venue.toLowerCase().includes('online'))) && (
                                              <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#observer`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Observer
                                              </Link>
                                            )}

                                            {hearing.stakeholderCategories?.some((c: string) => ['Government Official', 'Exporter / Trader', 'Financial Institution'].includes(c)) && (
                                              <Link href={`/state-of-kashmir-crafts/public-hearings/${hearing.slug || hearing.id}#institutional`} className="flex items-center gap-2 hover:text-brand-primary font-semibold text-gray-700">
                                                <span className="text-gray-400">○</span> Institutional Submission
                                              </Link>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
              {activeTab === 'calendar' && (() => {
                const ongoingEvents = filteredHearings.filter(h => h.isOngoing === true);
                const datedEvents = filteredHearings.filter(h => h.isOngoing !== true);
                
                const getHearingsForDate = (day: Date) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  return datedEvents.filter(event => {
                    if (event.scheduledDate === dayKey) return true;
                    if (event.date) {
                      try {
                        const eventDateKey = format(parseISO(typeof event.date === 'string' ? event.date : event.date.toISOString()), "yyyy-MM-dd");
                        if (eventDateKey === dayKey) return true;
                      } catch (e) {}
                    }
                    return false;
                  });
                };

                const getCategoryStyle = (category: string) => {
                  const catUpper = category?.toUpperCase() || "";
                  if (catUpper.includes("HERITAGE") || catUpper.includes("AUTHENTICITY")) {
                    return {
                      bg: "bg-red-50 text-red-700 border-red-200",
                      dot: "bg-red-500",
                      text: "text-red-700"
                    };
                  }
                  if (catUpper.includes("PEOPLE") || catUpper.includes("LIVELIHOOD")) {
                    return {
                      bg: "bg-amber-50 text-amber-700 border-amber-200",
                      dot: "bg-amber-500",
                      text: "text-amber-700"
                    };
                  }
                  if (catUpper.includes("MARKET") || catUpper.includes("ECONOMY")) {
                    return {
                      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      dot: "bg-emerald-500",
                      text: "text-emerald-700"
                    };
                  }
                  if (catUpper.includes("INNOVATION") || catUpper.includes("SUSTAINABILITY")) {
                    return {
                      bg: "bg-purple-50 text-purple-700 border-purple-200",
                      dot: "bg-purple-500",
                      text: "text-purple-700"
                    };
                  }
                  return {
                    bg: "bg-blue-50 text-blue-700 border-blue-200",
                    dot: "bg-blue-500",
                    text: "text-blue-700"
                  };
                };

                const getStatusBadgeStyle = (status: string) => {
                  const s = status?.toUpperCase() || "";
                  if (s === "REGISTRATION_OPEN" || s === "OPEN" || s === "REGISTRATION OPEN") {
                    return "bg-green-100 text-green-800 border-green-200";
                  }
                  if (s === "COMPLETED") {
                    return "bg-gray-100 text-gray-800 border-gray-200";
                  }
                  if (s === "SCHEDULED" || s === "PLANNING") {
                    return "bg-amber-100 text-amber-800 border-amber-200";
                  }
                  return "bg-blue-100 text-blue-800 border-blue-200";
                };

                return (
                  <div className="space-y-6">
                    {/* Ongoing Programmes section */}
                    {ongoingEvents.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm text-left">
                        <h4 className="text-xs font-black uppercase text-brand-primary tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                          Ongoing Programmes & Registrations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ongoingEvents.map(event => {
                            const catStyle = getCategoryStyle(event.category);
                            return (
                              <div 
                                key={event.id}
                                onClick={() => setSelectedCalendarEvent(event)}
                                className="bg-gray-55 hover:bg-[#FDFBF9] border border-gray-200 rounded-2xl p-5 hover:shadow-md transition cursor-pointer hover:border-brand-primary/30 flex justify-between items-start gap-4"
                              >
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${getStatusBadgeStyle(event.status)}`}>
                                      {event.registrationState || event.status}
                                    </span>
                                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-md ${catStyle.bg}`}>
                                      {event.category}
                                    </span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                                      {event.eventType}
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-gray-800 text-sm">{event.title}</h5>
                                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{event.description || event.shortSummary || event.fullDescription}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span data-editorial-accent-text className="text-[10px] font-black  uppercase tracking-wider block">{event.location}</span>
                                  <span className="text-[9px] text-gray-400 font-bold block mt-1">{event.mode}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-gray-800">
                          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={prevMonth} 
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 font-bold shadow-sm transition"
                          >
                            &larr; Prev
                          </button>
                          <button 
                            onClick={nextMonth} 
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 font-bold shadow-sm transition"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-center font-bold text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, idx) => {
                          if (!day) {
                            return <div key={`empty-${idx}`} className="bg-gray-50/50 rounded-xl min-h-[95px]"></div>;
                          }

                          const dateHearings = getHearingsForDate(day);
                          const isToday = new Date().toDateString() === day.toDateString();
                          const hasEvent = dateHearings.length > 0;

                          return (
                            <div 
                                key={day.toString()} 
                                className={`border border-gray-150 rounded-xl p-2 min-h-[95px] flex flex-col justify-between transition ${
                                hasEvent ? 'cursor-pointer hover:border-brand-primary/50 hover:shadow-xs bg-[#FAF8F5]/30' : 'bg-white'
                              } ${
                                isToday ? 'bg-brand-primary/5 border-brand-primary/20' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className={`text-xs font-black p-0.5 rounded ${isToday ? 'text-brand-primary font-black' : 'text-gray-400'}`}>{day.getDate()}</span>
                                {hasEvent && (
                                  <span className={`w-2 h-2 rounded-full ${getCategoryStyle(dateHearings[0].category).dot}`}></span>
                                )}
                              </div>
                              <div className="mt-1 flex-1 flex flex-col gap-1 overflow-y-auto p-1">
                                {hasEvent ? (
                                  dateHearings.map((evt: any, evtIdx: number) => {
                                    const type = (evt.eventType || '').toUpperCase();
                                    const isRange = type === 'DRAFT_REVIEW';
                                    const displayDate = isRange ? '8–17 Dec' : '';
                                    return (
                                      <div key={evtIdx} onClick={(e) => { e.stopPropagation(); setSelectedCalendarEvent(evt); }} className="bg-white/80 border border-gray-200 rounded p-1 shadow-xs cursor-pointer hover:border-brand-primary/50 transition">
                                        <div className="text-[9px] font-black text-gray-800 leading-tight text-center break-words line-clamp-2">
                                          {evt.title}
                                        </div>
                                        <div className="mt-0.5 text-[7px] text-gray-500 font-bold text-center truncate">
                                          {evt.venue || evt.district}
                                        </div>
                                        <div className="mt-0.5 flex flex-wrap items-center justify-center gap-1">
                                          <span className="text-[6px] px-1 py-0.5 font-black uppercase rounded bg-gray-100 text-brand-primary border border-gray-200">
                                            {displayDate || evt.mode || 'In Person'}
                                          </span>
                                          <span className="text-[6px] px-1 py-0.5 font-black uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {evt.registrationStatus === 'OPEN' ? 'Registration Open' : (evt.status || '').replace(/_/g, ' ')}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="h-4"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Calendar Event Popover/Modal */}
                      {selectedCalendarEvent && (() => {
                        const catStyle = getCategoryStyle(selectedCalendarEvent.category);
                        return (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
                            <div className="bg-white border border-gray-250 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-6">
                              <button 
                                onClick={() => setSelectedCalendarEvent(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                              >
                                &times;
                              </button>
                              
                              <div className="space-y-3 text-left">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`border text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${catStyle.bg}`}>
                                    {selectedCalendarEvent.category}
                                  </span>
                                  <span className={`border text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeStyle(selectedCalendarEvent.status)}`}>
                                    {selectedCalendarEvent.registrationState || selectedCalendarEvent.status}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                      {selectedCalendarEvent.eventType}
                                    </span>
                                    {selectedCalendarEvent.craftFocus && Array.isArray(selectedCalendarEvent.craftFocus) && selectedCalendarEvent.craftFocus.map((craft: string, i: number) => (
                                      <span key={i} className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 font-bold rounded-full uppercase tracking-wide">
                                        {craft === 'ALL_CRAFTS' ? 'Cross-Craft' : craft}
                                      </span>
                                    ))}
                                </div>
                                <h4 className="text-xl font-black text-gray-900 leading-snug">
                                  {selectedCalendarEvent.title}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                  {selectedCalendarEvent.description || selectedCalendarEvent.shortSummary || selectedCalendarEvent.fullDescription}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 text-xs text-left">
                                <div>
                                  <span className="font-bold text-gray-400 uppercase text-[9px] block">Date & Time</span>
                                  <span className="font-bold text-gray-700">
                                    {selectedCalendarEvent.isOngoing ? "Ongoing Programme" : (selectedCalendarEvent.scheduledDate && selectedCalendarEvent.scheduledDate !== '1969-12-31' && selectedCalendarEvent.scheduledDate !== '1970-01-01' ? format(parseISO(selectedCalendarEvent.scheduledDate), 'dd MMM yyyy') : 'Date to be confirmed')}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-400 uppercase text-[9px] block">Venue & Mode</span>
                                  <span className="font-bold text-gray-700">
                                    {getModeLabel(selectedCalendarEvent.eventType, selectedCalendarEvent.location || selectedCalendarEvent.mode || 'Virtual Webcast')}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-400 uppercase text-[9px] block">Milestone & Status</span>
                                  <span className="font-bold text-gray-700">
                                    {selectedCalendarEvent.milestoneLabel || selectedCalendarEvent.actionType} ({selectedCalendarEvent.status})
                                  </span>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-400 uppercase text-[9px] block">Progress</span>
                                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                                    <span className="inline-block w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <span className="block h-full bg-brand-primary" style={{ width: `${selectedCalendarEvent.progress || 0}%` }}></span>
                                    </span>
                                    <span>{selectedCalendarEvent.progress || 0}%</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                {(() => {
                                  const meetState = getMeetButtonState(selectedCalendarEvent);
                                  if (meetState.status === 'ACTIVE') {
                                    return (
                                      <a
                                        href={meetState.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center min-h-[50px] px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-center leading-tight transition shadow-xs"
                                      >
                                        <span className="text-[13px] font-semibold flex items-center gap-1.5">
                                          {meetState.title}
                                        </span>
                                        <span className="text-[11px] font-medium opacity-90">
                                          {meetState.timeSubtitle}
                                        </span>
                                      </a>
                                    );
                                  }
                                  if (meetState.status === 'BEFORE_WINDOW') {
                                    return (
                                      <button
                                        disabled
                                        title={meetState.label}
                                        className="flex flex-col items-center justify-center min-h-[50px] px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-center leading-tight cursor-not-allowed"
                                      >
                                        <span className="text-[13px] font-semibold text-gray-700">
                                          {meetState.title}
                                        </span>
                                        <span className="text-[11px] font-medium text-gray-500">
                                          {meetState.timeSubtitle}
                                        </span>
                                      </button>
                                    );
                                  }
                                  if (meetState.status === 'AFTER_WINDOW') {
                                    return (
                                      <div className="flex flex-col items-center justify-center min-h-[50px] px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-center leading-tight">
                                        <span className="text-[13px] font-semibold text-gray-600">
                                          {meetState.title}
                                        </span>
                                        <span className="text-[11px] font-medium text-gray-400">
                                          {meetState.timeSubtitle}
                                        </span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                                <Link
                                  href={
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('REGISTRATION') || (selectedCalendarEvent.slug || '').includes('stakeholder-registration') ? '/state-of-kashmir-crafts/stakeholder-registry' :
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('VALIDATION') || (selectedCalendarEvent.slug || '').includes('draft-findings') || (selectedCalendarEvent.slug || '').includes('validation') ? '/state-of-kashmir-crafts/validation-round' :
                                    (selectedCalendarEvent.eventType || selectedCalendarEvent.category || '').toUpperCase().includes('EXPERT REVIEW') || (selectedCalendarEvent.slug || '').includes('expert-review') ? '/state-of-kashmir-crafts/expert-review' :
                                    '/state-of-kashmir-crafts/participate'
                                  }
                                  onClick={() => setSelectedCalendarEvent(null)}
                                  className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs rounded-xl text-center transition"
                                >
                                  Register & Participate
                                </Link>
                                <Link
                                  href={`/state-of-kashmir-crafts/public-hearings/submit-testimony?hearingSlug=${selectedCalendarEvent.slug}&hearingId=${selectedCalendarEvent.id}`}
                                  onClick={() => setSelectedCalendarEvent(null)}
                                  className="px-4 py-2.5 border border-gray-250 text-brand-primary hover:bg-gray-55 font-bold text-xs rounded-xl text-center transition"
                                >
                                  Submit Testimony
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'map' && (
                <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm">
                  <div className="text-left mb-6">
                    <h3 className="text-base font-bold text-gray-800">Geographic Hearings Distribution</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>12 Formal Hearings:</strong> 10 In-Person Hearings • 2 Online Hearings • 5 Districts Hosting In-Person Hearings
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 border-r border-gray-100">
                      {derivedDistricts.map(dist => {
                        const isActive = selectedGeoDistrict === dist;
                        const stats = districtGisData[dist] || { hearingsCount: 0 };
                        return (
                          <button
                            key={dist}
                            onClick={() => setSelectedGeoDistrict(dist)}
                            className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl border transition flex justify-between items-center ${
                              isActive 
                                ? 'bg-brand-primary text-white border-brand-primary' 
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                            }`}
                          >
                            <span>{dist}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {stats.hearingsCount} Hearings
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-center bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                      <span data-editorial-accent-text className="text-[10px] font-black  tracking-widest uppercase block mb-1">District Focus</span>
                      <h4 className="text-xl font-bold text-gray-850 mb-6">{selectedGeoDistrict} District</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hearings Mapped</span>
                          <span className="text-lg font-black text-gray-750 block mt-1">{selectedGis.hearingsCount}</span>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Registered Participants</span>
                          <span className="text-lg font-black text-gray-750 block mt-1">{selectedGis.participants}</span>
                        </div>
                        <div className="col-span-2 bg-white border border-gray-200 p-4 rounded-xl shadow-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Regional Coverage</span>
                          <span className="text-sm font-bold text-brand-secondary block mt-1">{
                            selectedGeoDistrict === 'Srinagar' ? 'Srinagar & Central Kashmir (State-level institutional hub)' :
                            selectedGeoDistrict === 'Budgam' ? 'Major artisan and weaving/embroidery cluster' :
                            selectedGeoDistrict === 'Pulwama' ? 'South-Central Kashmir cluster' :
                            selectedGeoDistrict === 'Anantnag' ? 'South Kashmir regional hub' :
                            selectedGeoDistrict === 'Baramulla' ? 'North Kashmir regional hub' :
                            selectedGeoDistrict === 'Bandipora' ? 'Covered through North Kashmir hearings' :
                            selectedGeoDistrict === 'Kupwara' ? 'Covered through North Kashmir hearings' :
                            selectedGeoDistrict === 'Ganderbal' ? 'Covered through Central Kashmir hearings' :
                            selectedGeoDistrict === 'Shopian' ? 'Covered through South Kashmir hearings' :
                            selectedGeoDistrict === 'Kulgam' ? 'Covered through South Kashmir hearings' :
                            'Regional coverage information pending'
                          }</span>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button 
                          onClick={() => { setSelectedDistrict(selectedGeoDistrict); setActiveTab('timeline'); }}
                          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"
                        >
                          Show Hearings in {selectedGeoDistrict}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-6">
              {/* Alert Sign Up Button */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Hearing Alerts
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Subscribe to receive email alerts when hearings are scheduled for your district, craft sector, or preferred topics.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition flex items-center justify-center gap-2"
                >
                  <FaBell /> Subscribe to Alerts
                </button>
              </div>

              {/* Submit Written Testimony */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Written Testimony
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Unable to attend a hearing? Submit your general written testimony online to ensure your voice is counted in the official record.
                </p>
                <Link
                  href="/state-of-kashmir-crafts/public-hearings/submit-testimony"
                  className="w-full py-2.5 bg-gray-50 border border-gray-200 text-brand-dark text-xs font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <FaFileSignature /> Submit Testimony
                </Link>
              </div>

              {/* Transparency Panel */}
              <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm text-xs text-gray-500 leading-relaxed space-y-4">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 pb-2 border-b border-gray-100">
                  <FaShieldAlt data-ui-icon  className="" />
                  <span>Transparency & Audit</span>
                </div>
                <p>
                  Every hearing notice and schedule published here has been audited and approved by the Assessment Secretariat.
                </p>
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 font-bold text-brand-primary">
                  <a href="/state-of-kashmir-crafts/assessment-timeline" className="hover:underline flex items-center gap-1">&bull; Audit Trail</a>
                  <a href="/state-of-kashmir-crafts/evidence-standards" className="hover:underline flex items-center gap-1">&bull; Publication Policy</a>
                  <a href="/state-of-kashmir-crafts/about" className="hover:underline flex items-center gap-1">&bull; Assessment Methodology</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hearing Alerts Modal */}
      <HearingSubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}



