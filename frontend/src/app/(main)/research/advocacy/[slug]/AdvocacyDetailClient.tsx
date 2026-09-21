"use client";

import React from "react";
import { notFound } from "next/navigation";
import { ADVOCACY_TOPICS } from "@/data/advocacy-data";
import ResearchBookClient from "@/components/research/ResearchBookClient";

interface AdvocacyDetailClientProps {
    slug: string;
}

export default function AdvocacyDetailClient({ slug }: AdvocacyDetailClientProps) {
    const advocacyTopic = ADVOCACY_TOPICS.find(t => t.slug === slug);
    if (!advocacyTopic) notFound();

    // Transform AdvocacyTopic to ResearchTopic
    const topic = {
        id: advocacyTopic.slug,
        title: advocacyTopic.title,
        subtitle: advocacyTopic.shortDescription,
        heroImage: "/assets/images/advo.png", // Using valid asset instead of broken placeholder
        content: {
            category: "Advocacy",
            tags: ["Policy", "Reform", "Kashmir"],
            richContent: [
                // Page 1: Narrative
                <div key="narrative">
                    <h3 className="text-2xl font-serif font-bold mb-4 text-brand-secondary">The Narrative</h3>
                    <div className="whitespace-pre-line text-lg leading-relaxed">
                        {advocacyTopic.narrative}
                    </div>
                </div>,

                // Page 2: Proposals
                <div key="proposals">
                    <h3 className="text-2xl font-serif font-bold mb-4 text-brand-secondary">Key Proposals</h3>
                    {advocacyTopic.proposals.map((prop, i) => (
                        <div key={i} className="mb-8">
                            <h4 className="text-xl font-bold mb-2">{prop.title}</h4>
                            <p className="italic mb-4 text-stone-600">{prop.objective}</p>
                            <ul className="space-y-4">
                                {prop.rationale.map((r, j) => (
                                    <li key={j} className="bg-stone-100 p-4 rounded-lg">
                                        <strong className="block text-brand-primary mb-1">{r.title}</strong>
                                        {r.description}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 p-4 border-l-4 border-brand-accent bg-brand-accent/10">
                                <strong className="uppercase text-xs tracking-wider text-brand-accent block mb-1">Legislative Ask</strong>
                                {prop.legislativeAsk}
                            </div>
                        </div>
                    ))}
                </div>,

                // Page 3: Strategies
                <div key="strategies">
                    <h3 className="text-2xl font-serif font-bold mb-4 text-brand-secondary">Strategic Approach</h3>
                    {advocacyTopic.strategies.map((strat, i) => (
                        <div key={i} className="mb-8 border-b border-stone-200 pb-8 last:border-0">
                            <h4 className="text-xl font-bold mb-2">{strat.title}</h4>
                            <p className="mb-4">{strat.objective}</p>

                            <h5 className="font-bold text-sm uppercase tracking-wider mb-3 text-stone-500">Key Points</h5>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                {strat.points.map((p, j) => (
                                    <div key={j}>
                                        <span className="font-bold text-stone-800">{p.title}:</span> {p.description}
                                    </div>
                                ))}
                            </div>

                            <h5 className="font-bold text-sm uppercase tracking-wider mb-3 text-stone-500">Action Steps</h5>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                {strat.actionSteps.map((step, k) => (
                                    <li key={k}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>,

                // Page 4: Outcomes & Conclusion
                <div key="outcomes">
                    <h3 className="text-2xl font-serif font-bold mb-4 text-brand-secondary">Expected Outcomes</h3>
                    <div className="grid grid-cols-1 gap-6 mb-12">
                        {advocacyTopic.outcomes.map((outcome, i) => (
                            <div key={i} className="bg-stone-800 text-stone-100 p-6 rounded-lg shadow-lg">
                                <h4 className="text-xl font-bold mb-2 text-brand-primary">{outcome.title}</h4>
                                <p className="mb-4 opacity-90">{outcome.description}</p>
                                <ul className="space-y-2 text-sm opacity-80">
                                    {outcome.points.map((p, j) => (
                                        <li key={j}>• <strong className="text-white">{p.title}:</strong> {p.description}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 border border-stone-300 text-center relative">
                        <span className="text-5xl text-stone-200 absolute -top-6 left-1/2 -translate-x-1/2 bg-[#fdfbf7] px-4">❝</span>
                        <p className="text-xl font-serif italic leading-relaxed text-stone-800">
                            {advocacyTopic.conclusion}
                        </p>
                    </div>
                </div>
            ]
        }
    };

    return <ResearchBookClient topic={topic} backLink="/research/advocacy" />;
}
