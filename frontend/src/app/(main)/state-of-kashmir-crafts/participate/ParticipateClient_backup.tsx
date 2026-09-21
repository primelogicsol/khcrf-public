"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FaGlobe, FaUniversity, FaStore, FaUsers, 
  FaHammer, FaBuilding, FaLaptop, FaUserGraduate, FaFileAlt, FaLandmark, FaFemale, FaHandsHelping, FaLandmark as FaMonument, FaCamera, FaPlane, FaMapMarkedAlt, FaShoppingBag, FaBookOpen, FaHands, FaUniversity as FaMuseum,
  FaSignInAlt, FaUserCheck, FaHourglassHalf, FaExclamationCircle, FaBan, FaCheckCircle, FaSpinner, FaArrowRight, FaClipboardList, FaFileUpload, FaBullhorn, FaCalendarAlt, FaStar, FaShieldAlt, FaBook, FaDownload
} from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { participateHeroFallback } from '@/config/heroFallbacks';

import ArtisanPathwayClient from './ArtisanPathwayClient';
import ManufacturerPathwayClient from './ManufacturerPathwayClient';
import CooperativePathwayClient from './CooperativePathwayClient';
import ExporterPathwayClient from './ExporterPathwayClient';
import RetailerPathwayClient from './RetailerPathwayClient';
import OnlineSellerPathwayClient from './OnlineSellerPathwayClient';
import StudentPathwayClient from './StudentPathwayClient';
import ResearcherPathwayClient from './ResearcherPathwayClient';
import UniversityPathwayClient from './UniversityPathwayClient';
import GovernmentPathwayClient from './GovernmentPathwayClient';
import PoliticalPathwayClient from './PoliticalPathwayClient';
import FinancialPathwayClient from './FinancialPathwayClient';
import CitizenPathwayClient from './CitizenPathwayClient';
import YouthPathwayClient from './YouthPathwayClient';
import WomenPathwayClient from './WomenPathwayClient';
import CivilSocietyPathwayClient from './CivilSocietyPathwayClient';
import AdminPreviewToolbar from './AdminPreviewToolbar';
import HeritagePathwayClient from './HeritagePathwayClient';
import MediaPathwayClient from './MediaPathwayClient';
import TourismPathwayClient from './TourismPathwayClient';
import DiasporaPathwayClient from './DiasporaPathwayClient';
import InternationalBuyerPathwayClient from './InternationalBuyerPathwayClient';
import IntResearcherPathwayClient from './IntResearcherPathwayClient';
import IntOrgPathwayClient from './IntOrgPathwayClient';
import IntMuseumPathwayClient from './IntMuseumPathwayClient';

export default function ParticipateClient() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  const [realCategory, setRealCategory] = useState("");
  // Registration status states
  const [regLoading, setRegLoading] = useState(true);
  const [realHasReg, setRealHasReg] = useState(false);
  const [realRegStatus, setRealRegStatus] = useState("");
  const [realRegType, setRealRegType] = useState("");
  const [realRegRef, setRealRegRef] = useState("");
  const [realRegData, setRealRegData] = useState<any>(null);

  const [previewActive, setPreviewActive] = useState(false);
  const [previewCategory, setPreviewCategory] = useState("");
  const [previewStatus, setPreviewStatus] = useState("APPROVED");
  const [previewModes, setPreviewModes] = useState<string[]>(["Online Survey"]);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);

  const isAdmin = user?.isAdmin || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isPreviewing = previewActive && isAdmin;

  const category = isPreviewing ? (impersonatedUser ? impersonatedUser.categoryLabel : previewCategory) : realCategory;
  const hasReg = isPreviewing ? (previewStatus !== 'NOT_REGISTERED' || !!impersonatedUser) : realHasReg;
  const regStatus = isPreviewing ? (impersonatedUser ? impersonatedUser.status : (previewStatus === 'NOT_REGISTERED' ? '' : previewStatus)) : realRegStatus;
  const regType = isPreviewing ? (impersonatedUser ? impersonatedUser.registrationType : 'INDIVIDUAL') : realRegType;
  const regRef = isPreviewing ? (impersonatedUser ? impersonatedUser.referenceNumber : 'SKC-PREVIEW-0000') : realRegRef;
  const regData = isPreviewing ? (impersonatedUser || { approvedParticipationModes: previewModes }) : realRegData;
  const effectiveUser = (isPreviewing && impersonatedUser) ? { ...user, ...impersonatedUser, isAdmin: false } : user;

  useEffect(() => {
    if (isPreviewing) {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        const method = (args[1]?.method || 'GET').toUpperCase();
        
        if (method !== 'GET' && url.includes('/api')) {
          alert("Preview Mode\n\nAction disabled.\nNo data has been written.");
          return new Response(JSON.stringify({ success: true, message: "Mocked success" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return originalFetch(...args);
      };
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [isPreviewing]);


  const setCategory = (val: string) => {
    if (isPreviewing && !impersonatedUser) {
      setPreviewCategory(val);
    } else {
      setRealCategory(val);
    }
  };
  const setHasReg = (val: boolean) => setRealHasReg(val);
  const setRegStatus = (val: string) => setRealRegStatus(val);
  const setRegType = (val: string) => setRealRegType(val);
  const setRegRef = (val: string) => setRealRegRef(val);
  const setRegData = (val: any) => setRealRegData(val);


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRegLoading(false);
      return;
    }

    setRegLoading(true);
    fetch('/api/backend/skc/stakeholders/registration-status', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated or error');
        return res.json();
      })
      .then(resData => {
        if (resData.success) {
          setHasReg(resData.hasRegistration);
          if (resData.hasRegistration && resData.registration) {
            setRegStatus(resData.registration.status || "");
            setRegType(resData.registration.registrationType || "");
            setRegRef(resData.registration.referenceNumber || "");
            setRegData(resData.registration || null);
            
            // Prefill sessionStorage for survey pre-fills
            sessionStorage.setItem('skc_registered_profile', JSON.stringify({
              fullName: resData.registration.fullName || '',
              organization: resData.registration.organizationName || '',
              category: resData.registration.categoryLabel || '',
              designation: resData.registration.designation || '',
              district: resData.registration.district || '',
              email: resData.registration.email || '',
              website: resData.registration.website || '',
              referenceNumber: resData.registration.referenceNumber || ''
            }));
          }
        }
        setRegLoading(false);
      })
      .catch(err => {
        console.error('registration-status fetch error:', err);
        setRegLoading(false);
      });
  }, [user, authLoading]);

  useEffect(() => {
    const categoryParam = searchParams.get('category') || searchParams.get('type');
    if (categoryParam) {
      import('@/lib/skc/participant-categories').then(({ normalizeCategory }) => {
        const matchedCategory = normalizeCategory(categoryParam);
        if (matchedCategory) {
          console.log(`Deep link category activated: ${matchedCategory}`);
          setCategory(matchedCategory);
        }
      });
    }
  }, [searchParams]);

  // Loading Screen
  
  const renderContent = () => {
    if (authLoading || (effectiveUser && regLoading)) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
        <p className="text-sm text-gray-500 font-semibold">Verifying your participation access credentials...</p>
      </main>
    );
  }

  // CASE 1: Not logged in
  if (!effectiveUser) {
    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
        <UniversalEditorialHero pageKey="participate" fallbackConfig={participateHeroFallback as any} />
        
        <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-10">
            
            {/* Restricted Access Alert Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <FaShieldAlt className="text-sm" /> Restricted Workspace
              </div>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight font-bold">
                Restricted Access to the Participation Portal
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                The Participation Portal is a secure workspace for verified and approved participants contributing to the <strong className="text-brand-dark">State of Kashmir Crafts Assessment 2026–2027</strong>. 
                Access is available only to registered stakeholders and institutions whose participation has been reviewed and approved.
              </p>
            </div>

            {/* Content Split: Process Workflow & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              
              {/* Process / Steps Section */}
              <div className="md:col-span-2 space-y-6">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                  Before You Can Access This Portal
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  To participate in the assessment, you must complete the following lifecycle stages:
                </p>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      1
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Register Profile</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        Submit your details via the <Link href={`/state-of-kashmir-crafts/stakeholder-registry?type=individual${category ? "&category=" + encodeURIComponent(category) : ""}`} className="text-brand-primary hover:underline">Individual Stakeholder</Link> or the <Link href="/state-of-kashmir-crafts/participating-institutions" className="text-brand-primary hover:underline">Institutional Registration</Link> pathway.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      2
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Verification & Review</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        The Assessment Secretariat reviews your profile identity, category, and eligibility parameters to prevent duplicate entries and verify credentials.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      3
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Approval & Portal Grant</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        Once approved, you will be notified and granted access to contribute evidence, surveys, or validation round files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Access Requirements Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm self-start">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FaShieldAlt data-ui-icon  className="" /> Access Requirements
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-600 font-semibold">
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Registered stakeholder or institution
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Verification completed
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Participation approved
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Valid effectiveUser account
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Action Portals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              
              {/* Option: Login */}
              <div className="p-6 border border-gray-200 rounded-2xl hover:border-brand-primary/40 hover:bg-amber-50/10 transition shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm">Already Registered & Approved?</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    If your registry application has already been approved, please sign in to open your workspace dashboard.
                  </p>
                </div>
                <div>
                  <Link 
                    href="/login?redirect=/state-of-kashmir-crafts/participate"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B2A08] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition shadow-sm font-semibold"
                  >
                    Sign In to Continue <FaArrowRight />
                  </Link>
                </div>
              </div>

              {/* Option: Register */}
              <div className="p-6 border border-gray-200 rounded-2xl hover:border-brand-primary/40 hover:bg-amber-50/10 transition shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm font-bold">Not Yet Registered?</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                    Submit your application parameters to begin. Choose the correct pathway matching your contributor profile.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/state-of-kashmir-crafts/stakeholder-registry?type=individual${category ? "&category=" + encodeURIComponent(category) : ""}`}
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50 transition shadow-sm font-semibold"
                  >
                    Register Individual
                  </Link>
                  <Link 
                    href={`/state-of-kashmir-crafts/stakeholder-registry?type=institution${category ? "&category=" + encodeURIComponent(category) : ""}`}
                    className="inline-flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50 transition shadow-sm font-semibold"
                  >
                    Register Institution
                  </Link>
                </div>
              </div>
            </div>

            {/* Status Check & Assistance Footnote */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block">Registration Under Review?</span>
                <span className="text-gray-500 font-semibold block">You can check your submission state using your prefix reference code.</span>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/state-of-kashmir-crafts/contact-secretariat?tab=status" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition font-bold"
                >
                  Check Registration Status
                </Link>
                <Link 
                  href="/state-of-kashmir-crafts/contact-secretariat" 
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition font-bold"
                >
                  Need Assistance?
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // CASE 2: Logged in, Not registered
  if (!hasReg && !effectiveUser.isAdmin) {
    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
        <UniversalEditorialHero pageKey="participate" fallbackConfig={participateHeroFallback as any} />
        
        <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-10">
            
            {/* Restricted Access Alert Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                <FaShieldAlt className="text-sm" /> Restricted Workspace
              </div>
              <h2 className="text-3xl font-black text-brand-dark tracking-tight font-bold">
                Restricted Access to the Participation Portal
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                The Participation Portal is a secure workspace for verified and approved participants contributing to the <strong className="text-brand-dark">State of Kashmir Crafts Assessment 2026–2027</strong>. 
                Access is available only to registered stakeholders and institutions whose participation has been reviewed and approved.
              </p>
            </div>

            {/* Content Split: Process Workflow & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              
              {/* Process / Steps Section */}
              <div className="md:col-span-2 space-y-6">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
                  Before You Can Access This Portal
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  To participate in the assessment, you must complete the following lifecycle stages:
                </p>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      1
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Register Profile</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        Submit your details via the <Link href={`/state-of-kashmir-crafts/stakeholder-registry?type=individual${category ? "&category=" + encodeURIComponent(category) : ""}`} className="text-brand-primary hover:underline">Individual Stakeholder</Link> or the <Link href="/state-of-kashmir-crafts/participating-institutions" className="text-brand-primary hover:underline">Institutional Registration</Link> pathway.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      2
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Verification & Review</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        The Assessment Secretariat reviews your profile identity, category, and eligibility parameters to prevent duplicate entries and verify credentials.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-amber-50  flex items-center justify-center shrink-0 border border-amber-200 text-sm font-bold shadow-sm">
                      3
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-gray-900 text-sm">Approval & Portal Grant</h5>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                        Once approved, you will be notified and granted access to contribute evidence, surveys, or validation round files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Access Requirements Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm self-start">
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FaShieldAlt data-ui-icon  className="" /> Access Requirements
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-600 font-semibold">
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Registered stakeholder or institution
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Verification completed
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Participation approved
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <span className="text-brand-primary font-bold">✓</span> Valid effectiveUser account
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Action Portals Grid */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-amber-50/10 shadow-sm space-y-4 pt-6 border-t border-gray-200">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-sm">Choose Your Registration Pathway</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                  You are signed in as <span className="font-bold text-brand-dark">{effectiveUser.email}</span>. Complete registration to request workspace access.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href={`/state-of-kashmir-crafts/stakeholder-registry?type=individual${category ? "&category=" + encodeURIComponent(category) : ""}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#6B2A08] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition shadow-sm font-semibold"
                >
                  Register as an Individual
                </Link>
                <Link 
                  href={`/state-of-kashmir-crafts/stakeholder-registry?type=institution${category ? "&category=" + encodeURIComponent(category) : ""}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-50 transition shadow-sm font-semibold"
                >
                  Register an Institution
                </Link>
              </div>
            </div>

            {/* Status Check & Assistance Footnote */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block">Need Assistance?</span>
                <span className="text-gray-500 font-semibold block">Contact the State of Kashmir Crafts Assessment team for registration support.</span>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/state-of-kashmir-crafts/contact-secretariat" 
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition font-bold"
                >
                  Contact Support
                </Link>
                <button 
                  onClick={async () => { await logout(); }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition font-bold"
                >
                  Sign Out
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // CASE 3: Registered, Status = Submitted or Under Review
  if (!effectiveUser.isAdmin && hasReg && (regStatus === 'SUBMITTED' || regStatus === 'UNDER_REVIEW')) {
    const confirmationUrl = regType === 'INDIVIDUAL'
      ? `/state-of-kashmir-crafts/stakeholder-registry/individual-confirmation/${regRef}`
      : `/state-of-kashmir-crafts/stakeholder-registry/institution-confirmation/${regRef}`;

    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
        <UniversalEditorialHero pageKey="participate" fallbackConfig={participateHeroFallback as any} />
        
        <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8 text-center">
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 animate-pulse">
              <FaHourglassHalf className="text-2xl" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight font-bold">
                Registration Under Review
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-semibold max-w-md mx-auto">
                Your stakeholder registration has been successfully received and is currently under review by the State of Kashmir Crafts Assessment Secretariat.
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Your participation workspace will become available after your application has been verified and approved.
              </p>
            </div>

            {/* Metadata Info Panel */}
            <div className="border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden shadow-inner text-left max-w-md mx-auto text-xs">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                  🟡 Under Review
                </span>
              </div>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase tracking-wider">Reference Number</span>
                <span className="font-mono font-bold text-gray-700">{regRef}</span>
              </div>
              {regData?.submittedAt && (
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Submitted</span>
                  <span className="font-bold text-gray-700">
                    {new Date(regData.submittedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
              <div className="p-4 flex justify-between items-center">
                <span className="font-bold text-gray-400 uppercase tracking-wider">Registration Type</span>
                <span className="font-bold text-gray-700">
                  {regType === 'INDIVIDUAL' ? 'Individual Stakeholder' : 'Institutional Registration'}
                </span>
              </div>
            </div>

            {/* Timeline info */}
            <div className="text-xs text-gray-500 text-left max-w-md mx-auto space-y-2 border-t border-gray-100 pt-6">
              <h5 className="font-bold text-gray-700">While You Wait</h5>
              <p className="leading-relaxed">
                Your registration is currently being reviewed for:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-400 font-semibold">
                <li>Identity verification</li>
                <li>Stakeholder eligibility parameters</li>
                <li>Duplication & security validation</li>
              </ul>
            </div>

            {/* Available Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link 
                href={confirmationUrl}
                className="px-5 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm uppercase tracking-wider font-bold"
              >
                View Registration Details
              </Link>
              <Link 
                href="/state-of-kashmir-crafts/contact-secretariat"
                className="px-5 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm uppercase tracking-wider font-bold"
              >
                Contact Secretariat
              </Link>
              <button 
                onClick={async () => { await logout(); }}
                className="px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm uppercase tracking-wider font-bold"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // CASE 4: Additional information required
  const isInfoRequired = regStatus.includes('INFO') || regStatus.includes('CLARIFICATION') || regStatus.includes('REVISION') || regStatus.includes('REQUIRED') || regStatus.includes('NEED');
  if (!effectiveUser.isAdmin && hasReg && isInfoRequired) {
    const confirmationUrl = regType === 'INDIVIDUAL'
      ? `/state-of-kashmir-crafts/stakeholder-registry/individual-confirmation/${regRef}`
      : `/state-of-kashmir-crafts/stakeholder-registry/institution-confirmation/${regRef}`;

    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
        <UniversalEditorialHero pageKey="participate" fallbackConfig={participateHeroFallback as any} />
        
        <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8 text-center">
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              <FaExclamationCircle className="text-2xl animate-bounce" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight font-bold">
                Registration Requires Attention
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-semibold max-w-md mx-auto">
                Some additional information is required before your participation workspace can be verified and approved.
              </p>
            </div>

            {/* Status indicators */}
            <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4 max-w-md mx-auto text-xs flex justify-between items-center">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full font-bold">
                🟠 Action Required
              </span>
            </div>

            <div className="text-xs text-orange-700 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl font-semibold leading-relaxed max-w-md mx-auto text-left">
              Please check your confirmation file details or contact support directly to supply the verification credentials.
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link 
                href={confirmationUrl}
                className="px-5 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm uppercase tracking-wider font-bold"
              >
                Update Registration
              </Link>
              <Link 
                href="/state-of-kashmir-crafts/contact-secretariat"
                className="px-5 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm uppercase tracking-wider font-bold"
              >
                Contact Secretariat
              </Link>
              <button 
                onClick={async () => { await logout(); }}
                className="px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm uppercase tracking-wider font-bold"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // CASE 5: Rejected
  if (!effectiveUser.isAdmin && hasReg && regStatus === 'REJECTED') {
    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
        <UniversalEditorialHero pageKey="participate" fallbackConfig={participateHeroFallback as any} />
        
        <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 space-y-8 text-center">
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200">
              <FaBan className="text-2xl" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight font-bold">
                Registration Decision
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed font-semibold max-w-md mx-auto">
                Your stakeholder registration has not been approved for the State of Kashmir Crafts participation portal at this time.
              </p>
            </div>

            {/* Decision Status */}
            <div className="border border-gray-200 rounded-2xl bg-gray-50 p-4 max-w-md mx-auto text-xs flex justify-between items-center">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Decision</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold">
                🔴 Rejected
              </span>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto text-left space-y-2 border-t border-gray-100 pt-6">
              <p className="font-bold text-gray-700">Available Options</p>
              <p className="font-semibold">
                If you believe this decision is in error, or you wish to submit an appeal with updated credentials, please contact the Assessment Secretariat.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link 
                href="/state-of-kashmir-crafts/contact-secretariat"
                className="px-5 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm uppercase tracking-wider font-bold"
              >
                Contact Secretariat
              </Link>
              <button 
                onClick={async () => { await logout(); }}
                className="px-5 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm uppercase tracking-wider font-bold"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // CASE 6: APPROVED PARTICIPATION WORKSPACE / DASHBOARD
  const isApproved = effectiveUser.isAdmin || (hasReg && (regStatus === 'APPROVED' || regStatus === 'VERIFIED' || regStatus === 'ACTIVE'));
  
  if (!isApproved) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <FaExclamationCircle className="text-3xl text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
          <p className="text-sm text-gray-500 font-semibold">You do not have the required approval status to access this page.</p>
        </div>
      </main>
    );
  }

  // RENDER SPECIALIZED PATHWAY SURVEY DIRECTLY IF USER HAS ALREADY OPENED IT
  if (category === "Artisan / Weaver") {
    return <ArtisanPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Manufacturer") {
    return <ManufacturerPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Cooperative / Producer Group") {
    return <CooperativePathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Exporter") {
    return <ExporterPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Retailer") {
    return <RetailerPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Online Seller") {
    return <OnlineSellerPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Student") {
    return <StudentPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Researcher") {
    return <ResearcherPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "University / Academic Institution") {
    return <UniversityPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Government Department") {
    return <GovernmentPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Political Party") {
    return <PoliticalPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Financial Institution") {
    return <FinancialPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Citizen") {
    return <CitizenPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Youth Participant") {
    return <YouthPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Women Entrepreneur") {
    return <WomenPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Civil Society Organization") {
    return <CivilSocietyPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Heritage Organization") {
    return <HeritagePathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Media Professional") {
    return <MediaPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Tourism Stakeholder") {
    return <TourismPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "Diaspora Member") {
    return <DiasporaPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "International Buyer / Collector") {
    return <InternationalBuyerPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "International Researcher") {
    return <IntResearcherPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "International Organization / Development Agency") {
    return <IntOrgPathwayClient onBackToCategories={() => setCategory("")} />;
  }
  if (category === "International Museum / Cultural Institution") {
    return <IntMuseumPathwayClient onBackToCategories={() => setCategory("")} />;
  }

  // If an authenticated effectiveUser has portal access but no linked registration, show controlled error
  if (!hasReg || !regData) {
    return (
      <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 md:p-12 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200">
              <FaBan className="text-2xl" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Participant Profile Not Linked</h2>
            <p className="text-sm text-gray-600 leading-relaxed font-semibold max-w-md mx-auto">
              Your account is authorized, but no approved SKC registration is linked to this workspace. Contact the Assessment Secretariat and provide your registration reference.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/state-of-kashmir-crafts/contact-secretariat"
                className="px-6 py-3 bg-[#050a1e] text-white font-bold rounded-xl hover:bg-gray-800 transition uppercase tracking-wider text-xs"
              >
                Contact Secretariat
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Dashboard configuration based strictly on approved registration details
  const participantName = regData.fullName || regData.representativeName || "Approved Participant";
  const participantOrg = regData.organization || regData.institutionName || "Individual Contributor";
  const participantCat = regData.categoryLabel || regData.category || "Participant";
  const participantDistrict = regData.district || regData.districtCity || "Not Specified";
  const participantSector = regData.craftSector || "Not Specified";
  const participantEmail = regData.email || effectiveUser.email || "Not Provided";
  
  const participantModes = regData.approvedParticipationModes || regData.participationModes || ["Online Survey"];
  
  const isIndividual = regType === 'INDIVIDUAL' || !regType;
  const isInstitution = regType === 'INSTITUTION';

  // Determine authorized dashboard panels based on preferred modes and attributes
  const showSurveyTask = isIndividual || participantModes.includes("Online Survey") || participantModes.includes("ONLINE_SURVEY");
  const showEvidenceTask = isInstitution || participantModes.includes("Evidence Submission") || participantModes.includes("EVIDENCE_SUBMISSION") || participantModes.includes("Evidence Contribution") || ["Exporter", "Researcher", "University / Academic Institution"].includes(participantCat);
  const showWrittenTask = participantModes.includes("Written Submission") || participantModes.includes("Written Contribution");
  const showHearingTask = participantModes.includes("Public Hearing");
  const showConsultationTask = participantModes.includes("Field Consultation");
  const showExpertTask = participantModes.includes("Expert Review") || ["Researcher", "Student / Scholar", "University / Academic Institution"].includes(participantCat);
  const showValidationTask = participantModes.includes("Validation Review") || participantCat === "Artisan / Weaver";

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800">
      {/* Participant Dashboard Header */}
      <div className="bg-[#050a1e] text-white py-12 shadow-md">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-emerald-300 uppercase bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Secure Workspace
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">Participant Dashboard</h1>
              <h2 className="text-2xl text-stone-100 font-bold mt-2">Welcome, {participantName}</h2>
              <p className="text-stone-300 text-sm leading-relaxed max-w-xl font-medium mt-1">
                Your approved participant workspace for the State of Kashmir Crafts Assessment 2026–2027. 
                Complete authorized tasks and review evidence contributions below.
              </p>
            </div>
            {/* Quick Facts Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 w-full md:w-auto md:min-w-[340px] space-y-4 shadow-2xl hover:bg-white/10 transition-colors duration-500">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-[10px] font-black text-stone-400 tracking-[0.2em] uppercase">REFERENCE NUMBER</span>
                <span className="font-mono text-xs font-bold bg-white/10 px-3 py-1 rounded-lg text-white shadow-inner">{regRef}</span>
              </div>
              
              <div className="space-y-2 pb-3 border-b border-white/10">
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">PARTICIPANT</span>
                  <span className="text-white text-xs font-bold block text-right">{participantName}</span>
                </div>
                {participantOrg && participantOrg !== "Individual Contributor" && (
                  <div className="flex justify-between items-end gap-4">
                    <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">ORGANIZATION</span>
                    <span className="text-white text-xs font-bold block text-right">{participantOrg}</span>
                  </div>
                )}
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">REGISTRATION TYPE</span>
                  <span className="text-white text-[10px] font-bold block bg-white/10 px-2 py-0.5 rounded uppercase">{isIndividual ? "Individual Stakeholder" : "Institutional Registration"}</span>
                </div>
              </div>

              <div className="space-y-2 pb-3 border-b border-white/10">
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">CATEGORY</span>
                  <span className="text-white text-xs font-bold block text-right">{participantCat}</span>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">DISTRICT</span>
                  <span className="text-white text-xs font-bold block text-right">{participantDistrict}</span>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">CRAFT SECTOR</span>
                  <span className="text-white text-xs font-bold block text-right">{participantSector}</span>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">EMAIL</span>
                  <span className="text-white text-xs font-bold block text-right">{participantEmail}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">REGISTRATION STATUS</span>
                  <span className="text-white text-xs font-bold block">Approved</span>
                </div>
                <div className="flex justify-between items-end gap-4">
                  <span className="text-[10px] font-black text-stone-400 tracking-wider uppercase block">WORKSPACE ACCESS</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <FaCheckCircle className="text-[9px]" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-6xl space-y-8 animate-fadeIn">
        
        {/* Main Workspace Tasks */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-stone-900 uppercase tracking-[0.15em] border-b border-stone-200 pb-3 flex items-center gap-2">
            <FaClipboardList data-ui-icon  className=" text-xl" /> Active Authorized Tasks
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Online Survey Card */}
            {showSurveyTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-indigo-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaClipboardList className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">
                      {participantCat.includes("Artisan") || participantCat.includes("Weaver") 
                        ? "Artisan & Weaver Assessment Survey" 
                        : "Complete Online Survey"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      {participantCat.includes("Artisan") || participantCat.includes("Weaver")
                        ? "Provide information on production practices, raw materials, market access, income conditions, certification, training, and sector challenges." 
                        : "Submit your detailed feedback and field metrics directly. The questionnaire is customized for your registered category."}
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <button 
                    onClick={() => { setCategory(participantCat); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 group-hover:text-indigo-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Open Survey <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Evidence Submission Card */}
            {showEvidenceTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-emerald-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaFileUpload className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Evidence Repository</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Submit documents, pricing logs, photography, reports, or materials tests to the official assessment evidence database.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/evidence-repository"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 group-hover:text-emerald-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Manage Evidence <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}

            {/* Written Submission Card */}
            {showWrittenTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-amber-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaFileAlt className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Submit Written Contribution</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Draft a formal position statement, craft history brief, or policy recommendation letter for assessment record.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/official-messages/submit"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-amber-600 group-hover:text-amber-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Submit Document <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}

            {/* Public Hearing Card */}
            {showHearingTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-purple-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaBullhorn className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Public Hearing Schedule</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Reserve testifier slots, access hearing transcripts, and participate in active virtual hearing boards.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/public-hearings"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-purple-600 group-hover:text-purple-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Open Schedule <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}

            {/* Field Consultation Card */}
            {showConsultationTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-rose-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Consultation Tracker</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Track field team visits in your district and view schedule times for interactive village and workshop consultations.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/consultation-tracker"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-rose-600 group-hover:text-rose-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Track Visits <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}

            {/* Expert Review Card */}
            {showExpertTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaStar className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Expert Review Platform</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Access draft chapters under technical review, comment on methodologies, and browse scientific references.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/expert-review"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 group-hover:text-blue-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Review Drafts <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}

            {/* Validation Review Card */}
            {showValidationTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-teal-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-sm group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaShieldAlt className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight">Validation Briefings</h4>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                      Participate in validation rounds. Confirm the accuracy of sector-wise findings before the final report is compiled.
                    </p>
                  </div>
                </div>
                <div className="pt-8 relative z-10">
                  <Link 
                    href="/state-of-kashmir-crafts/validation-round"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-teal-600 group-hover:text-teal-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Open Briefings <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Resources & Information Panels */}
        <div className="space-y-6 pt-6">
          <h2 className="text-lg font-black text-stone-900 uppercase tracking-[0.15em] border-b border-stone-200 pb-3 flex items-center gap-2">
            <FaBook data-ui-icon  className=" text-xl" /> Resources & Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="group bg-stone-50 border border-stone-200 rounded-[2rem] p-8 flex items-start gap-6 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 shrink-0 shadow-sm group-hover:text-brand-primary group-hover:border-brand-primary/30 group-hover:scale-110 transition-all duration-300">
                <FaBookOpen className="text-xl" />
              </div>
              <div className="space-y-3">
                <h5 className="font-black text-stone-900 text-base">Draft Findings & Archive</h5>
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                  Read previously published chapters, regional drafts, and sector reviews completed in the first half of the assessment cycle.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/state-of-kashmir-crafts/draft-findings"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-icon-on-light hover:text-[#8B3F12] transition-colors uppercase tracking-[0.15em]"
                  >
                    Browse Reports <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="group bg-stone-50 border border-stone-200 rounded-[2rem] p-8 flex items-start gap-6 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 shrink-0 shadow-sm group-hover:text-brand-primary group-hover:border-brand-primary/30 group-hover:scale-110 transition-all duration-300">
                <FaDownload className="text-xl" />
              </div>
              <div className="space-y-3">
                <h5 className="font-black text-stone-900 text-base">Downloads & Governance Standards</h5>
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                  Download standard consent protocols, evidence standards documents, and physical survey forms for printing.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/state-of-kashmir-crafts/stakeholder-registry"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-icon-on-light hover:text-[#8B3F12] transition-colors uppercase tracking-[0.15em]"
                  >
                    Open Registry Resources <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Participation Timeline */}
        <div className="border border-stone-200 rounded-[2.5rem] bg-white p-8 md:p-12 shadow-sm space-y-10 mt-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-stone-50 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
          
          <h4 className="font-black text-stone-900 text-sm uppercase tracking-[0.15em] relative z-10">Workspace Timeline Progression</h4>
          
          <div className="relative z-10">
            {/* Timeline Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-400 via-brand-primary to-stone-200 md:left-1/2 md:-ml-[1px]"></div>
            
            <div className="space-y-12 relative z-10 text-xs">
              
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center group">
                <div className="flex items-center gap-4 md:w-[47%] md:justify-end">
                  <span className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-200 shadow-sm z-10 group-hover:scale-110 transition-transform duration-300">
                    <FaCheckCircle className="text-lg" />
                  </span>
                  <div className="text-left md:text-right">
                    <span className="font-black text-stone-900 block text-base tracking-tight">Profile Registered</span>
                    <span className="text-stone-400 font-bold uppercase tracking-[0.15em] text-[9px] mt-1 block">Step 1 (Completed)</span>
                  </div>
                </div>
                <div className="hidden md:block w-[6%]"></div>
                <div className="md:w-[47%] pl-16 md:pl-0 text-stone-500 font-medium text-xs leading-relaxed">
                  Stakeholder registration submitted and recorded under reference <span className="font-mono text-stone-700 font-bold bg-stone-100 px-1.5 py-0.5 rounded">{regRef}</span>.
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center group">
                <div className="flex items-center gap-4 md:w-[47%] md:justify-end">
                  <span className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-200 shadow-sm z-10 group-hover:scale-110 transition-transform duration-300">
                    <FaCheckCircle className="text-lg" />
                  </span>
                  <div className="text-left md:text-right">
                    <span className="font-black text-stone-900 block text-base tracking-tight">Identity and Eligibility Approved</span>
                    <span className="text-stone-400 font-bold uppercase tracking-[0.15em] text-[9px] mt-1 block">Step 2 (Completed)</span>
                  </div>
                </div>
                <div className="hidden md:block w-[6%]"></div>
                <div className="md:w-[47%] pl-16 md:pl-0 text-stone-500 font-medium text-xs leading-relaxed">
                  <span className="font-bold">{participantName}</span> was approved by the Assessment Secretariat. Participant workspace access is active.
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center group relative">
                <div className="absolute top-1/2 left-6 md:left-1/2 w-12 h-12 bg-brand-primary/20 rounded-full blur-[20px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex items-center gap-4 md:w-[47%] md:justify-end relative z-10">
                  <span className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/30 z-10">
                    <FaSpinner className="animate-spin text-lg" />
                  </span>
                  <div className="text-left md:text-right">
                    <span className="font-black text-brand-dark block text-base tracking-tight">Active Consultation and Evidence</span>
                    <span data-editorial-accent-text className=" font-black uppercase tracking-[0.15em] text-[9px] mt-1 block">Step 3 (In Progress)</span>
                  </div>
                </div>
                <div className="hidden md:block w-[6%]"></div>
                <div className="md:w-[47%] pl-16 md:pl-0 text-stone-700 font-semibold text-xs leading-relaxed relative z-10">
                  Complete the authorized {participantCat} survey and submit eligible evidence for the current assessment stage.
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center opacity-50 group">
                <div className="flex items-center gap-4 md:w-[47%] md:justify-end">
                  <span className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 border border-stone-200 z-10 group-hover:bg-stone-200 transition-colors">
                    <FaHourglassHalf className="text-sm" />
                  </span>
                  <div className="text-left md:text-right">
                    <span className="font-black text-stone-800 block text-base tracking-tight">Validation & Revision Rounds</span>
                    <span className="text-stone-400 font-bold uppercase tracking-[0.15em] text-[9px] mt-1 block">Step 4 (Upcoming)</span>
                  </div>
                </div>
                <div className="hidden md:block w-[6%]"></div>
                <div className="md:w-[47%] pl-16 md:pl-0 text-stone-500 font-medium text-xs leading-relaxed">
                  Validation access will appear when the assessment enters the validation stage and this participant is authorized.
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );

  };

  return (
    <>
      {isAdmin && (
        <AdminPreviewToolbar 
          isActive={previewActive}
          onActivatePreview={() => setPreviewActive(true)}
          onExitPreview={() => { setPreviewActive(false); setPreviewCategory(''); setImpersonatedUser(null); }}
          onPreviewCategory={setPreviewCategory}
          onPreviewStatus={setPreviewStatus}
          onPreviewModes={setPreviewModes}
          onImpersonate={setImpersonatedUser}
          currentCategory={previewCategory}
          currentStatus={previewStatus}
          currentModes={previewModes}
          impersonatedUser={impersonatedUser}
        />
      )}
      {renderContent()}
    </>
  );
}

