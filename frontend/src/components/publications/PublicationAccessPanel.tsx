"use client";

import React from "react";
import Link from "next/link";
import { FaBookOpen, FaUserCheck, FaHourglassHalf } from "react-icons/fa";
import { CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import PublicationPricing from "./PublicationPricing";
import { usePublicationAccess } from "@/hooks/usePublicationAccess";

interface PublicationAccessPanelProps {
  canonical: CanonicalPublicationPresentation;
  isPreviewMode?: boolean;
  initialAccessState?: any;
}

export default function PublicationAccessPanel({
  canonical,
  isPreviewMode = false,
  initialAccessState,
}: PublicationAccessPanelProps) {
  const { isbn, pageCount: pages, publicationType, chapters } = canonical;

  const hasReadingContent = publicationType === "Knowledge Books" || publicationType === "Research Papers" || (chapters && chapters.length > 0);

  const {
    loading,
    accessState,
    setAccessState,
    checkAccess,
    AccessModal,
  } = usePublicationAccess(initialAccessState);

  React.useEffect(() => {
    if (isPreviewMode || initialAccessState) return;
    async function checkInitialAccess() {
      try {
        const res = await fetch(`/api/backend/publications/access/${canonical.slug}`);
        if (res.ok) {
          const data = await res.json();
          setAccessState(data);
        }
      } catch (err) {
        console.error("Failed to fetch access state:", err);
      }
    }
    checkInitialAccess();
  }, [canonical.slug, isPreviewMode, setAccessState]);

  const handleReadOnline = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPreviewMode) return;
    await checkAccess(canonical.slug, canonical.readerPath);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="p-4 sm:p-5 bg-white border border-stone-200/60 rounded-3xl shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {canonical.accessTier !== "PUBLIC" ? (
              <div className="space-y-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 flex flex-col gap-3">
                  {accessState?.state === "APPROVED" ? (
                    <>
                      <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                        <FaUserCheck /> APPROVED MEMBER ACCESS
                      </h3>
                      {canonical.readerAvailability === "AVAILABLE" ? (
                        <button
                          onClick={handleReadOnline}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-[0.98]"
                        >
                          <FaBookOpen size={12} /> {loading ? "Opening..." : "Open Publication"}
                        </button>
                      ) : (
                        <button
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-black rounded-xl border border-stone-200 shadow-sm transition-all"
                        >
                          Request Access
                        </button>
                      )}
                    </>
                  ) : accessState?.state === "UNDER_REVIEW" || accessState?.state === "SUBMITTED" ? (
                    <>
                      <h3 className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2">
                        <FaHourglassHalf /> MEMBERSHIP APPLICATION UNDER REVIEW
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Your application is currently under review. Publication access will become available upon membership approval.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-[10px] font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                        <FaUserCheck /> APPROVED MEMBER ACCESS
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed mb-2">
                        Full-text access to this KHCRF Press publication is available to approved KHCRF members.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/about/memberships"
                          className="flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm"
                        >
                          Apply for Membership
                        </Link>
                        <Link
                          href="/sign-in"
                          className="flex items-center justify-center px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm"
                        >
                          Sign In
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {canonical.readerAvailability === "AVAILABLE" ? (
                  <button
                    onClick={handleReadOnline}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-[0.98]"
                  >
                    <FaBookOpen size={12} /> {loading ? "Opening..." : "Read Online"}
                  </button>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-stone-100 text-stone-700 text-xs font-black rounded-xl border border-stone-200 shadow-sm"
                  >
                    Open Publication
                  </button>
                )}
              </div>
            )}
            
            <div className="pt-4 mt-4 border-t border-stone-100">
              <PublicationPricing 
                canonical={canonical}
              />
            </div>
          </>
        )}
      </div>

      <AccessModal />
    </div>
  );
}
