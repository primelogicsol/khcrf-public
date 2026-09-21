"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { businessSupportEvaluationHeroFallback } from "@/config/heroFallbacks";
import Link from "next/link";
import { FaChartLine, FaGlobe, FaHandshake, FaBullhorn, FaAward, FaSearchDollar, FaCheckCircle, FaFileAlt, FaDesktop, FaArrowRight } from "react-icons/fa";

import FeatureCard from "@/components/common/FeatureCard";
import EvaluationRegistry from "@/components/business/EvaluationRegistry";
import EvaluateFarmLink from "@/components/business/EvaluateFarmLink";

export default function EvaluationPage() {
    return (
        <main>
            <UniversalEditorialHero pageKey="evaluation" fallbackConfig={businessSupportEvaluationHeroFallback as any} />

            {/* 1. Intro Section - Matching networking.html */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]">
                            <img
                                src="/assets/images/generated/kashmir-modern-conference-room-closed.jpg"
                                alt="Modern Conference Room with Khatamband Ceiling and Closed Crewel Curtains"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Welcome to Hamadan Craft Revival Foundation</span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">KHCRF's Independent Verification & Compliance Validation Project</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                In collaboration with Craftlore, the Hamdan Craft Revival Foundation (KHCRF) is proud to launch a comprehensive Independent Verification & Compliance Validation project aimed at elevating the standards of the Kashmiri handicraft industry.
                            </p>
                            <div className="bg-brand-secondary/5 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg">
                                <p className="text-gray-800 font-medium italic">
                                    "This initiative is designed to assess businesses based on their craftsmanship, sustainability, ethical practices, and market readiness. By undergoing detailed evaluation, businesses are Documented in Craftlore’s Craft Intelligence Systems, gaining global recognition and enhanced credibility."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Mission / Optimization Section 1 */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Elevate Your Business Standards</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Unlock Your Business Potential</h2>
                        <p className="text-gray-600 text-lg">
                            Achieve excellence through structured evaluation, industry rankings, and global market readiness. Boost credibility, trust, and buyer education through strategic rankings. Maximize growth and visibility with KHCRF's comprehensive network.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FaChartLine}
                            title="Why It Matters"
                        >
                            <ul className="space-y-3">
                                {[
                                    "Businesses need more skills",
                                    "Global markets demand sustainability",
                                    "Ensure sound business practices",
                                    "Showcase excellence globally",
                                    "Build brand credibility trust",
                                    "Enhance market scalability readiness",
                                    "Prepare for global success"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        <FeatureCard
                            icon={FaAward}
                            title="Benefits of Verification"
                        >
                            <ul className="space-y-3">
                                {[
                                    "Gain visibility worldwide",
                                    "Build trust with consumers",
                                    "Join marketing campaigns globally",
                                    "Exclusive opportunities await top rank",
                                    "Position yourself as leader",
                                    "Increase influencer partnerships",
                                    "Boost exposure and growth"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        <FeatureCard
                            icon={FaHandshake}
                            title="KHCRF Networking"
                        >
                            <ul className="space-y-3">
                                {[
                                    "Connect with partners globally",
                                    "Build strong supplier relationships",
                                    "Engage in trade opportunities",
                                    "Expand your international market",
                                    "Strengthen business partnerships",
                                    "Access key business intelligence",
                                    "Position for scalable growth"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* 3. New Section: Optimize Your Business for Global Success */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">Evaluate and apply for institutional readiness validation and authenticity documentation.</span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Optimize Your Business for Global Success</h2>
                        <p className="text-gray-600 text-lg">
                            KHCRF helps businesses achieve global recognition through its Evidence Review and Ground Verification system, offering growth, market expansion, and sustainability in the competitive handicraft industry. By undergoing evaluation, businesses gain visibility, attract partnerships, and unlock new opportunities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FaChartLine}
                            title="Evidence Review Process"
                        >
                            <ul className="space-y-3">
                                {[
                                    "Assess businesses in four areas",
                                    "Review craftsmanship and product quality",
                                    "Evaluate financial health and stability",
                                    "Check sustainability and ethical practices",
                                    "Ensure business meets global standards",
                                    "Thorough assessment by KHCRF experts",
                                    "Align business with growth potential"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        <FeatureCard
                            icon={FaAward}
                            title="Ground Verification"
                        >
                            <ul className="space-y-3">
                                {[
                                    "On-site verification by field officers",
                                    "Physical inspection of workshops and facilities",
                                    "In-person authentication of submitted evidence",
                                    "Direct interviews with artisans and staff",
                                    "Validation of safe working conditions",
                                    "Final clearance by KHCRF Verification Board",
                                    "Status updates throughout the validation cycle"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>

                        <FeatureCard
                            icon={FaHandshake}
                            title="How to Apply"
                        >
                            <ul className="space-y-3">
                                {[
                                    "Submit application for expert evaluation",
                                    "Review business practices assessment",
                                    "Apply online via the KHCRF platform",
                                    "Experts assess in four key areas",
                                    "Receive Authenticity / Compliance Validation",
                                    "Ensure your business meets requirements",
                                    "Documented in Craftlore’s Craft Intelligence Systems"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="mr-2 text-brand-secondary mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </FeatureCard>
                    </div>
                </div>
            </section>



            {/* 4. About Six Section / Test Your Basic Business - (Replacing Embedded Form) */}
            <EvaluateFarmLink buttonLink="/business-support/evaluation/form" />

            {/* <EvaluationRegistry /> */}


            {/* 4. Submission Portal Section - (Missed previously) */}
                    </main>
    );
}

