"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBookOpen, FaDownload, FaUserPlus, FaSignInAlt, FaLock, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

import { CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import { getPublicationAccessState } from "@/lib/authorization";

interface PublicationAccessCardProps {
  canonical: CanonicalPublicationPresentation;
}

export default function PublicationAccessCard({
  canonical,
}: PublicationAccessCardProps) {
  const { user, isLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const isLoggedIn = !!user;
  const isAdmin = user?.isAdmin || user?.role === "ADMIN";

  // Fetch membership status
  useEffect(() => {
    if (isLoggedIn) {
      api.get("/membership/my-membership")
        .then((res) => {
          setMembership(res.data || null);
        })
        .catch(() => setMembership(null))
        .finally(() => setMembershipLoading(false));
    } else {
      setMembershipLoading(false);
    }
  }, [isLoggedIn]);

  // Use the canonical access state verifier
  const canRead = getPublicationAccessState(user, membership);
  
  // Membership explicit states
  const membershipStatus = membership?.status || "NONE";
  const isPending = membershipStatus === "PENDING";
  const isRejected = membershipStatus === "REJECTED";
  const isSuspended = membershipStatus === "SUSPENDED" || membership?.suspendedAt != null;
  const isRevoked = membershipStatus === "REVOKED" || membership?.revokedAt != null;
  const isApprovedMember = membershipStatus === "APPROVED" && !isSuspended && !isRevoked;

  // Check if bookmarked when component mounts
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (isLoggedIn) {
        try {
          const { data } = await api.get("/publications/my-library");
          const found = data.some((book: any) => String(book.id) === String(canonical.id));
          setIsBookmarked(found);
        } catch (error) {
          console.error("Error loading library status:", error);
        }
      }
    };
    checkBookmarkStatus();
  }, [isLoggedIn, canonical.id]);

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) return;
    setBookmarkLoading(true);
    try {
      const { data } = await api.post("/publications/my-library/toggle", {
        publicationId: canonical.id,
      });
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (isLoading || membershipLoading) {
    return (
      <div className="h-20 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-xs text-gray-400">
        Loading Access Details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* CTA Interface */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8">
      {/* Action Buttons */}
      <div className="pt-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {!isLoggedIn && (
              <Link 
                href="/about/memberships" 
                className="flex-1 text-center py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-brand-secondary transition-all text-sm"
              >
                Apply for Membership
              </Link>
            )}

            {isLoggedIn && !isAdmin && (membershipStatus === "NONE" || membershipStatus === null) && (
              <Link 
                href="/about/memberships" 
                className="flex-1 text-center py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-brand-secondary transition-all text-sm"
              >
                Apply for Membership
              </Link>
            )}

            {isLoggedIn && !isAdmin && isPending && (
              <button disabled className="flex-1 py-3 px-4 bg-stone-200 text-stone-500 font-bold rounded-lg cursor-not-allowed shadow-inner text-sm">
                Membership Application Under Review
              </button>
            )}

            {isLoggedIn && !isAdmin && isRejected && (
              <Link href="/support" className="flex-1 text-center py-3 px-4 bg-red-50 text-red-700 border border-red-200 font-bold rounded-lg text-sm">
                Contact KHCRF Support
              </Link>
            )}

            {isLoggedIn && !isAdmin && (isSuspended || isRevoked) && (
              <button disabled className="flex-1 py-3 px-4 bg-red-50 text-red-600 font-bold rounded-lg cursor-not-allowed border border-red-200 text-sm">
                Membership Access Suspended
              </button>
            )}

            {isLoggedIn && !isAdmin && isApprovedMember && canonical.readerEnabled && canonical.readerPath && (
              <Link 
                href={canonical.readerPath}
                className="flex-1 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FaBookOpen /> Read Online
              </Link>
            )}

            {isAdmin && canonical.readerEnabled && canonical.readerPath && (
              <Link 
                href={canonical.readerPath}
                className="flex-1 py-3 px-4 bg-brand-primary text-white font-bold rounded-lg shadow-sm hover:shadow-md hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FaBookOpen /> Open Knowledge Reader
              </Link>
            )}

            {isLoggedIn && (
              <button 
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                className={`flex-none w-12 flex items-center justify-center rounded-lg border transition-all ${
                  isBookmarked 
                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary" 
                    : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-brand-primary"
                }`}
                title={isBookmarked ? "Saved to Personal Library" : "Bookmark in Library"}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            )}
          </div>

          {isAdmin && (!canonical.readerEnabled || !canonical.readerPath) && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
              <strong>Admin Warning:</strong> No valid Reader Route is configured for this publication. The "Read Online" button is currently hidden from approved members. Please configure the Reader Route in the Admin Dashboard.
            </div>
          )}

          <div className="pt-5 mt-2 border-t border-stone-200/60 flex flex-col gap-2">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px]">Access Tier</span>
            <div className="flex flex-col">
              <span data-editorial-accent-text className="font-black uppercase tracking-widest  text-sm">
                APPROVED MEMBER ACCESS
              </span>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                These publications are available exclusively to approved KHCRF members. Registration alone does not grant access. Membership applications are reviewed prior to activation.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Institutional Knowledge Hub Disclaimer message */}
      <div className="bg-stone-50/50 border border-stone-100 rounded-xl p-4 text-[11px] text-stone-500 leading-relaxed italic mt-2">
        <p>
          <strong className="text-brand-dark not-italic">Access Policy:</strong> KHCRF publications are maintained as institutional knowledge resources. To protect research integrity, citation quality, and responsible use, full-text access is restricted to approved KHCRF members. Membership applications are reviewed by KHCRF administrators before access privileges are activated.
        </p>
      </div>
    </div>
  );
}
