"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { businessSupportGrantsHeroFallback } from "@/config/heroFallbacks";
import Link from "next/link";
import { FaArrowRight, FaMoneyBillWave, FaEdit, FaHandHoldingHeart, FaGlobeAmericas, FaSeedling, FaUsers } from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";
import GrantCtaButtonSection from "@/components/business/GrantCtaButtonSection";

export default function GrantsPage() {
    return (
        <main>
            <UniversalEditorialHero pageKey="grants" fallbackConfig={businessSupportGrantsHeroFallback as any} />

            {/* Main Introduction */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Welcome to Hamadan Craft Revival Foundation</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">KHCRF Business Support Grants</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                The Hamdan Craft Revival Foundation offers specialized Business Support Grants designed to uplift artisans and entrepreneurs in the Kashmiri handicraft sector. These grants provide crucial financial backing for capacity-building initiatives, market expansion, and innovative product development. Eligible applicants include master artisans, craft-based enterprises, and cooperative businesses dedicated to preserving traditional craftsmanship.
                            </p>
                            <div className="bg-brand-secondary/5 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg">
                                <p className="text-gray-800 font-medium italic">
                                    "Through these grants, the Foundation fosters sustainable business practices, strengthens market positioning, and drives innovation in craft production, ensuring that the legacy of Kashmiri handicrafts thrives in both local and international markets."
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]">
                            <img
                                src="/assets/images/generated/grants-visual.png"
                                alt="Artisans receiving grant support"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Grants Matter */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Empowering Handicraft with Grants</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Why Grants Matter for Handicraft Businesses</h2>
                        <p className="text-gray-600 text-lg">
                            The Hamdan Craft Revival Foundation provides comprehensive Grant Service Support to artisans, businesses, and organizations within the Kashmiri handicrafts sector.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1: Benefits */}
                        <FeatureCard
                            icon={FaMoneyBillWave}
                            title="Why It Matters"
                        >
                            <ul className="space-y-3">
                                {["Provides funding for expansion", "Supports eco-friendly practices", "Improves artisans' conditions", "Modernizes traditional methods", "Enables global scaling", "Preserves cultural heritage"].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        {/* Card 2: Support Services */}
                        <FeatureCard
                            icon={FaHandHoldingHeart}
                            title="Support Services"
                        >
                            <ul className="space-y-3">
                                {["Identify local, global grants", "Assess business eligibility", "Assist in proposal writing", "Manage application process", "Ensure timely documentation", "Provide follow-up support"].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        {/* Card 3: Writing Services */}
                        <FeatureCard
                            icon={FaEdit}
                            title="Writing Assistance"
                        >
                            <ul className="space-y-3">
                                {["Personalized business proposals", "Clearly communicate project vision", "Develop detailed budgets", "Integrate data for proposals", "Edit applications for clarity", "Create compelling success narratives"].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* Grant Types Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Grant Solutions for Your Success</span>
                            <h2 className="text-3xl font-black text-gray-900 mb-6 font-manrope">Grant Types We Support</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                The Foundation offers step-by-step guidance on how to secure grants, ensuring that businesses access the financial resources they need to grow, innovate, and compete globally.
                            </p>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaGlobeAmericas data-ui-icon  className="" /> Types of Grants</h3>
                                <ul className="space-y-2">
                                    {["Cultural Preservation Grants", "Sustainability Grants", "Innovation Grants", "Technology Support Grants", "Market Expansion Grants", "Artisan Empowerment Grants", "Community Development Grants"].map((g, i) => (
                                        <li key={i} className="text-gray-600 text-sm py-1 border-b border-gray-200 last:border-0">{g}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FaUsers data-ui-icon  className="" /> KHCRF's Advantage</h3>
                                <ul className="space-y-2">
                                    {["Expertise in handicraft sector", "Proven funding success", "Comprehensive support process", "Commitment to craft heritage", "Guidance for business growth"].map((g, i) => (
                                        <li key={i} className="text-gray-600 text-sm py-1 border-b border-gray-200 last:border-0">{g}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <GrantCtaButtonSection />
        </main>
    );
}
