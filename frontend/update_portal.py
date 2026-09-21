import os

filepath = 'src/components/SubmissionPortalSection.tsx'

content = """import { FaDesktop, FaSearchDollar, FaAward } from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";

export default function SubmissionPortalSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-10 max-w-6xl">
                <div className="mb-12">
                    <span data-editorial-accent-text className="font-bold tracking-wider uppercase text-sm mb-4 block">
                        CRAFTLORE ECOSYSTEM RESOURCE
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                        Explore Craftlore's Non-Profit Craft Intelligence &amp; Evaluation Platform
                    </h2>
                    <div className="prose prose-lg text-gray-600 max-w-none">
                        <p className="mb-4">
                            <a href="https://www.craftlore.org/" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold hover:underline">Craftlore</a> is a non-profit craft intelligence platform operating within the broader KHCRF integrated ecosystem. It provides independent tools and services for craft documentation, provenance, sustainability assessment, market readiness, fair-value intelligence and sector knowledge.
                        </p>
                        <p className="font-medium text-gray-800 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <strong>Participation in Craftlore is voluntary and is not required for KHCRF partnership, inclusion in the KHCRF Partner Registry, institutional recognition, or participation in KHCRF programs.</strong> Applications, evaluations, rankings or listings administered by Craftlore are governed through Craftlore's own processes and do not constitute KHCRF certification or preferential treatment.
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={FaDesktop}
                        title="Submit to Craftlore"
                        description="Submit information and supporting documentation directly through Craftlore's own portal and track the progress of your submission."
                    />
                    <FeatureCard
                        icon={FaSearchDollar}
                        title="Independent Evaluation"
                        description="Craftlore may assess relevant areas including craftsmanship, provenance, sustainability, market readiness and supporting evidence under its own methodologies."
                    />
                    <FeatureCard
                        icon={FaAward}
                        title="Registry & Market Intelligence"
                        description="Eligible participants may access applicable Craftlore registry, intelligence, ranking and market-visibility functions according to Craftlore's own criteria."
                    />
                </div>
                
                <div className="mt-10 text-center">
                    <a href="https://www.craftlore.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center khcrf-btn--navy px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg">
                        Visit Craftlore Portal &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SubmissionPortalSection")
