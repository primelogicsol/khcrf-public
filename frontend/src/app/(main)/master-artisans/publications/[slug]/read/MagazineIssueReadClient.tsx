'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';



const API_BASE_URL = getBaseUrlNoApi();

// Authenticated fetcher — sends cookies for membership verification
// Unwraps {status, data} envelope from responseFormatter middleware
const authFetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json?.data?.error ?? json?.error ?? `HTTP ${res.status}`), { status: res.status });
  // Unwrap envelope if present
  return json?.data !== undefined ? json.data : json;
};

export default function MagazineIssueReadClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  // Issue metadata (public fields, no readerAssetKey)
  const { data: issue, error: issueError, isLoading: issueLoading } =
    useSWR(`${API_BASE_URL}/api/backend/magazine-issues/${slug}`, authFetcher);

  // Access check — re-validates every 5 minutes to detect session expiry
  const { data: accessData, isLoading: accessLoading } =
    useSWR(slug ? `${API_BASE_URL}/api/backend/magazine-issues/${slug}/access` : null, authFetcher, {
      refreshInterval: 5 * 60 * 1000,
    });

  // Reader asset — authorised delivery endpoint (returns { pdfUrl, downloadable })
  const { data: readerData, error: readerError, isLoading: readerLoading } =
    useSWR(
      // Only fetch once we know access is approved
      accessData?.authorized ? `${API_BASE_URL}/api/backend/magazine-issues/${slug}/read` : null,
      authFetcher,
    );

  // Redirect unauthorized users back to the issue detail page
  useEffect(() => {
    if (accessData && !accessData.authorized) {
      router.replace(`/master-artisans/publications/${slug}`);
    }
  }, [accessData, router, slug]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (issueLoading || accessLoading) {
    return (
      <div className="min-h-screen bg-[#050A1E] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#B8860B]/30 border-t-[#B8860B] rounded-full animate-spin" />
        <p className="text-[#B8860B] text-xs tracking-[0.3em] uppercase font-medium">
          Authenticating Member Access
        </p>
      </div>
    );
  }

  // ── Error states ─────────────────────────────────────────────────────────────
  if (issueError || !issue) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Issue not available</p>
        <button onClick={() => router.push('/master-artisans/publications')}
          className="text-sm text-[#B8860B] underline">← Back to all issues</button>
      </div>
    );
  }

  // ── Awaiting redirect (access denied) ────────────────────────────────────────
  if (!accessData?.authorized) return null;

  // ── No PDF available yet ──────────────────────────────────────────────────────
  const pdfUrl = readerData?.pdfUrl ?? null;
  const downloadable = readerData?.downloadable ?? issue?.downloadable ?? false;

  return (
    <div className="w-full h-screen bg-neutral-950 flex flex-col select-none overflow-hidden">
      {/* ── Reader toolbar ────────────────────────────────────────────────────── */}
      <header className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/master-artisans/publications/${slug}`)}
            className="text-gray-400 hover:text-white text-sm uppercase tracking-widest font-medium transition-colors"
          >
            ← Exit Reader
          </button>
          <div className="h-4 w-px bg-white/20 mx-2" />
          <h1 className="text-white font-serif text-sm opacity-80 hidden sm:block truncate max-w-xs">
            {issue.title} — {issue.edition ?? issue.issueNumber}
          </h1>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-[#B8860B] text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Member Session
          </span>
          {downloadable && pdfUrl && (
            <a
              href={pdfUrl}
              download={`${issue.issueNumber ?? slug}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white text-xs uppercase tracking-widest border border-white/20 px-3 py-1.5 rounded transition-colors"
            >
              Download PDF
            </a>
          )}
        </div>
      </header>

      {/* ── Reader viewport ───────────────────────────────────────────────────── */}
      <main className="flex-1 w-full relative overflow-auto">
        {readerLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-[#B8860B]/30 border-t-[#B8860B] rounded-full animate-spin" />
            <p className="text-gray-500 text-xs tracking-widest">Loading issue content…</p>
          </div>
        ) : readerError ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-4">
            <p className="text-gray-400 text-sm">Reader content is not yet available for this issue.</p>
            <p className="text-gray-600 text-xs max-w-sm">
              The PDF for {issue.title} has not been uploaded yet. Check back once the issue is fully published.
            </p>
          </div>
        ) : pdfUrl ? (
          /*
           * PDF delivery: the pdfUrl is returned by the server-side /read endpoint
           * after membership verification. It is never exposed from the public API.
           * The iframe renders the PDF in-browser without downloading.
           */
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title={`${issue.title} — KHCRF Magazine Reader`}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          // No PDF uploaded for this issue yet
          <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-4">
            <div className="w-24 h-32 bg-gray-800 rounded border border-gray-700 flex items-center justify-center">
              <span className="text-gray-600 text-4xl">📄</span>
            </div>
            <div>
              <p className="text-gray-300 text-base font-serif mb-2">{issue.title}</p>
              <p className="text-gray-500 text-sm">{issue.edition}</p>
            </div>
            <p className="text-gray-600 text-sm max-w-sm">
              The digital reader for this issue is not yet available. The PDF will appear here once uploaded by the editorial team.
            </p>
            <button
              onClick={() => router.push(`/master-artisans/publications/${slug}`)}
              className="text-sm text-[#B8860B] underline"
            >
              ← Return to issue details
            </button>
          </div>
        )}

        {/* Member watermark — positioned absolutely over iframe */}
        {pdfUrl && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <p
              className="text-white text-3xl font-black uppercase tracking-[0.4em] opacity-[0.04] rotate-[-35deg] select-none whitespace-nowrap"
              aria-hidden="true"
            >
              KHCRF MEMBER COPY
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
