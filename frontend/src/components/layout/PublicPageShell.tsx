import React from "react";
import { PageHero, PageHeroData } from "./PageHero";

export interface PublicPageShellProps {
  heroData: PageHeroData;
  children: React.ReactNode;
  introTitle?: string;
  introLead?: string;
  introClassName?: string;
  surfaceTransition?: "dark-to-light" | "image-to-neutral" | "none";
}

export function PublicPageShell({
  heroData,
  children,
  introTitle,
  introLead,
  introClassName = "",
  surfaceTransition = "none"
}: PublicPageShellProps) {

  // Surface transition logic (first surface beneath hero)
  let transitionClass = "";
  if (surfaceTransition === "dark-to-light") {
    transitionClass = "bg-[#FFFCF7]"; // Reading White
  } else if (surfaceTransition === "image-to-neutral") {
    transitionClass = "bg-[#F3F4F6]"; // Gray-100 neutral
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Page Hero Layer */}
      <PageHero data={heroData} />

      {/* 2. Optional Introduction / Transition Surface */}
      {(introTitle || introLead) && (
        <section className={`w-full py-16 px-4 md:px-8 xl:px-12 ${transitionClass} ${introClassName}`}>
          <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-6">
            <div className="max-w-4xl">
              {introTitle && (
                <h2 className="text-[var(--text-page-title)] font-serif text-[#050A1E] mb-4 tracking-tight">
                  {introTitle}
                </h2>
              )}
              {introLead && (
                <p className="text-[var(--text-page-lead)] text-gray-700 leading-relaxed" style={{ maxWidth: '75ch' }}>
                  {introLead}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Content Layer */}
      {/* The main content area assumes full width wrapper, allowing legacy components to span if needed, but optimally restricting content width. */}
      <main className="w-full flex-grow bg-white">
        {children}
      </main>
    </div>
  );
}
