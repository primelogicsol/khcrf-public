import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";

import Link from "next/link";
import { FaArrowLeft, FaAward, FaDesktop, FaSearchDollar } from "react-icons/fa";
import EvaluationRegistryClient from "./EvaluationRegistryClient";
import CommonCta from "@/components/common/CommonCta";
import FeatureCard from "@/components/common/FeatureCard";
import SubmissionPortalSection from "@/components/SubmissionPortalSection";

export const metadata = {
    title: "Evaluation Registry | KHCRF",
    description: "Access the official list of evaluated and verified businesses and artisans under the KHCRF Business Evaluation Program.",
};

export default function EvaluationRegistryPage() {
    return (
        <main className="min-h-screen bg-gray-50">
        <UniversalEditorialHero 
            pageKey="evaluation-registry" 
            fallbackConfig={{
              id: 'registry-hero-fallback',
              pageKey: 'evaluation-registry',
              autoplayEnabled: true,
              autoplayIntervalMs: 6000,
              slides: [
                {
                  id: 'registry-slide-1',
                  internalName: 'Verified Directory',
                  eyebrow: 'OFFICIAL REGISTRY',
                  titleLineOne: 'THE VERIFIED',
                  titleConnector: 'directory of',
                  titleLineTwo: 'KASHMIR CRAFT ENTERPRISES',
                  description: 'Access the definitive registry of artisans, cooperatives, and businesses that have successfully passed KHCRF\'s rigorous compliance, ethical wage, and GI evaluation standards.',
                  primaryCtaLabel: 'Browse Registry',
                  primaryCtaUrl: '#registry',
                  secondaryCtaLabel: 'Get Evaluated',
                  secondaryCtaUrl: '/business-support/evaluation',
                  tertiaryLinkLabel: 'Evaluation Criteria',
                  tertiaryLinkUrl: '/business-support/evaluation#criteria',
                  meta1: 'Verified Partners',
                  meta2: 'Compliance',
                  meta3: 'Fair Trade',
                  meta4: 'Registry'
                },
                {
                  id: 'registry-slide-2',
                  internalName: 'Global Trust',
                  eyebrow: 'GLOBAL TRUST & TRANSPARENCY',
                  titleLineOne: 'INSTITUTIONAL',
                  titleConnector: 'backing for',
                  titleLineTwo: 'GLOBAL MARKETS',
                  description: 'Empowering local craft businesses with internationally recognized compliance certificates. Connect with verified partners who uphold the true legacy of Kashmiri craftsmanship.',
                  primaryCtaLabel: 'Start Evaluation',
                  primaryCtaUrl: '/business-support/evaluation',
                  secondaryCtaLabel: 'Search Directory',
                  secondaryCtaUrl: '#registry',
                  tertiaryLinkLabel: 'About the Program',
                  tertiaryLinkUrl: '/about',
                  meta1: 'Trust',
                  meta2: 'Certification',
                  meta3: 'B2B Connect',
                  meta4: 'Registry'
                },
                {
                  id: 'registry-slide-3',
                  internalName: 'Ethical Commerce',
                  eyebrow: 'SUSTAINABILITY & FAIR WAGES',
                  titleLineOne: 'ELEVATING',
                  titleConnector: 'standards for',
                  titleLineTwo: 'CONSCIOUS BUYERS',
                  description: 'Every verified business listed here is audited against 12 core sustainability indicators, ensuring fair compensation and environmental stewardship in every thread woven.',
                  primaryCtaLabel: 'Learn More',
                  primaryCtaUrl: '/business-support/evaluation#criteria',
                  secondaryCtaLabel: 'View Members',
                  secondaryCtaUrl: '#registry',
                  tertiaryLinkLabel: 'Policy Advocacy',
                  tertiaryLinkUrl: '/about/initiatives',
                  meta1: 'Fair Trade',
                  meta2: 'Wages',
                  meta3: 'Eco-Friendly',
                  meta4: 'Compliance'
                },
                {
                  id: 'registry-slide-4',
                  internalName: 'GI Protection',
                  eyebrow: 'AUTHENTICITY & HERITAGE',
                  titleLineOne: 'SAFEGUARDING',
                  titleConnector: 'the legacy of',
                  titleLineTwo: 'GEOGRAPHICAL INDICATIONS',
                  description: 'Protecting the authenticity of Pashmina, Kani, and Sozni through rigorous scientific evaluation. We bridge the gap between traditional heritage and modern international trade requirements.',
                  primaryCtaLabel: 'Browse Artisans',
                  primaryCtaUrl: '/master-artisans',
                  secondaryCtaLabel: 'Read Reports',
                  secondaryCtaUrl: '/publications',
                  tertiaryLinkLabel: 'Get Certified',
                  tertiaryLinkUrl: '/business-support/evaluation',
                  meta1: 'GI Tags',
                  meta2: 'Authenticity',
                  meta3: 'Trade',
                  meta4: 'Audits'
                }
              ]
        }} />

            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Link
                        href="/business-support/evaluation"
                        className="inline-flex items-center text-gray-500 hover:text-brand-primary mb-8 transition-colors text-sm font-bold uppercase tracking-wider group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Evaluation
                    </Link>
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-brand-dark mb-4">Evaluated & Verified Registry</h2>
                        <p className="text-gray-600 max-w-2xl">
                            Browse through our detailed list of businesses and artisans who have successfully completed the KHCRF evaluation process. Filter by type to find trusted partners.
                        </p>
                    </div>

                    <EvaluationRegistryClient />
                </div>
            </section>
            {/* 4. Submission Portal Section */}
            <SubmissionPortalSection />
            <CommonCta
                title={{ firstPart: "Ready to", highlightedPart: "Get Verified?" }}
                description="Join the registry of trusted businesses and gain global recognition."
                primaryAction={{
                    label: "Start Evaluation",
                    href: "/business-support/evaluation/form"
                }}
            />
        </main>
    );
}
