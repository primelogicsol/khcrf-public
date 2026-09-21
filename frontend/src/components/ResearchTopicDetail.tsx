"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

import { notFound } from "next/navigation";

export interface ResearchTopic {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  objective: string;
  narrative: string;
  proposals?: {
    title: string;
    objective: string;
    rationale: {
      title: string;
      description: string;
    }[];
    legislativeAsk: string;
  }[];
  itemStrategies?: {
    title: string;
    objective: string;
    points: {
      title: string;
      description: string;
    }[];
    actionSteps: string[];
  }[];
  // Allow flexibility for different naming conventions if needed, but defaulting to Lobbying structure
  strategies?: {
    title: string;
    objective: string;
    points: {
      title: string;
      description: string;
    }[];
    actionSteps: string[];
  }[];
  outcomes: {
    title: string;
    description: string;
    points: {
      title: string;
      description: string;
    }[];
  }[];
  conclusion: string;
}

interface ResearchTopicDetailProps {
  topic: ResearchTopic | undefined;
  backLink: string;
  backLabel: string;
  breadcrumbMiddle: string;
  children?: React.ReactNode;
}

export default function ResearchTopicDetail({
  topic,
  backLink,
  backLabel,
  breadcrumbMiddle,
  children,
}: ResearchTopicDetailProps) {
  if (!topic) {
    notFound();
  }

  // Normalize strategies vs itemStrategies
  const strategies = topic.strategies || topic.itemStrategies || [];

  return (
    <div className="min-h-screen bg-stone-50 font-roboto text-stone-700 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={backLink}
            className="group flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-brand-primary transition-colors uppercase tracking-wider"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </Link>
          <div className="text-sm font-medium text-stone-400 hidden sm:block">
            Research / {breadcrumbMiddle} /{" "}
            <span className="text-brand-primary font-bold">{topic.title}</span>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden bg-white border-b border-stone-200">
          {/* Removed background pattern per global rule */}

          <div className="max-w-4xl mx-auto px-4 md:px-6 relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
              <i className={`fa-solid ${topic.icon}`} />
              Strategic Initiative
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-stone-900 font-playfair leading-tight">
              {topic.title}
            </h1>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
              {topic.shortDescription}
            </p>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left bg-[#fdfbf7] border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-lg shadow-xs">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2 font-playfair">
                  <i className="fa-solid fa-bullseye text-brand-primary" />
                  Objective
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {topic.objective}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2 font-playfair">
                  <i className="fa-solid fa-bookmark text-brand-primary" />
                  Context
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">
                  {topic.narrative.split("\n")[0]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-20 border-b border-stone-200 bg-stone-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-8 text-stone-900 font-playfair">
              The Narrative
            </h2>
            <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed whitespace-pre-line">
              {topic.narrative}
            </div>
          </div>
        </section>

        {/* Proposals Section */}
        {topic.proposals && topic.proposals.length > 0 && (
          <section className="py-20 border-b border-stone-200 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                  Legislative Action
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
                  Policy Proposals
                </h2>
                <p className="text-stone-500 text-lg">
                  Key legislative actions and their rationale
                </p>
              </div>

              <div className="grid gap-12">
                {topic.proposals.map((proposal, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-6xl md:text-9xl font-black text-brand-primary leading-none">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="p-5 md:p-10 relative z-10">
                      <h3 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-brand-primary transition-colors font-playfair">
                        {proposal.title}
                      </h3>
                      <p className="text-stone-600 mb-8 border-l-4 border-[var(--card-left-accent)] pl-4 italic bg-stone-50 py-2 pr-2 rounded-r">
                        {proposal.objective}
                      </p>

                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {proposal.rationale.map((r, rIdx) => (
                          <div
                            key={rIdx}
                            className="bg-stone-50 p-5 rounded-lg border border-stone-100"
                          >
                            <h4 data-editorial-accent-text className=" font-bold mb-2 text-xs uppercase tracking-wide">
                              {r.title}
                            </h4>
                            <p className="text-stone-600 text-sm leading-relaxed">
                              {r.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-4 bg-[#fdfbf7] border border-brand-primary/20 p-5 rounded-lg">
                        <div className="bg-brand-primary/10 p-2 rounded-md shrink-0">
                          <i className="fa-solid fa-file-pen text-brand-primary text-xl" />
                        </div>
                        <div>
                          <h4 className="text-stone-900 font-bold mb-1 font-playfair">
                            Legislative Ask
                          </h4>
                          <p className="text-stone-600 text-sm">
                            {proposal.legislativeAsk}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Strategies Section */}
        <section className="py-12 md:py-20 border-b border-stone-200 bg-stone-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-black mb-8 md:mb-12 text-center text-stone-900 font-playfair">
              Strategic Implementation
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {strategies.map((strategy, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mb-4 font-bold shadow-md group-hover:scale-110 transition-transform">
                      S{idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3 font-playfair">
                      {strategy.title}
                    </h3>
                    <p className="text-stone-500 text-sm mb-6">
                      {strategy.objective}
                    </p>

                    <ul className="space-y-3 mb-6">
                      {strategy.points.map((point, pIdx) => (
                        <li key={pIdx} className="text-xs text-stone-600">
                          <strong className="text-stone-900 block mb-0.5">
                            {point.title}
                          </strong>
                          {point.description}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-6 border-t border-stone-100">
                    <h4 data-editorial-accent-text className="text-xs font-bold  uppercase tracking-wider mb-3">
                      Action Steps
                    </h4>
                    <ul className="space-y-2">
                      {strategy.actionSteps.map((step, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-2 text-xs text-stone-500"
                        >
                          <i className="fa-solid fa-check text-green-600 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black mb-12 text-center text-stone-900 font-playfair">
              Expected Outcomes
            </h2>
            <div className="space-y-8">
              {topic.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="flex-col items-center gap-2 hidden md:flex pt-2">
                    <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {idx + 1}
                    </div>
                    {idx !== topic.outcomes.length - 1 && (
                      <div className="w-0.5 h-full bg-stone-200 min-h-[100px] hidden md:block" />
                    )}
                  </div>

                  <div className="flex-1 bg-white border border-stone-200 rounded-lg p-6 md:p-8 hover:border-brand-primary/50 transition-all shadow-sm">
                    <h3 className="text-xl font-bold text-stone-900 mb-2 font-playfair">
                      {outcome.title}
                    </h3>
                    <p className="text-stone-600 mb-6 font-medium">
                      {outcome.description}
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {outcome.points.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="bg-stone-50 p-4 rounded-md border border-stone-100"
                        >
                          <p className="text-brand-primary text-xs font-bold mb-1 uppercase">
                            {point.title}
                          </p>
                          <p className="text-stone-500 text-xs leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="py-20 border-t border-stone-200 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 "></div>
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
            <i className="fa-solid fa-quote-left text-4xl text-brand-primary mb-8" />
            <p className="text-xl md:text-2xl font-light italic leading-relaxed mb-8 font-playfair">
              {topic.conclusion}
            </p>
            {/* <div className="flex justify-center gap-4">
                            <Link
                                href={backLink}
                                className="px-8 py-3 rounded-sm bg-brand-primary hover:bg-white hover:text-brand-primary text-white text-sm font-bold transition-all uppercase tracking-widest"
                            >
                                Explore Other Topics
                            </Link>
                        </div> */}
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
