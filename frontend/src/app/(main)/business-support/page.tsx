"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import Link from "next/link";
import {
    FaChartLine,
    FaCertificate,
    FaHandHoldingUsd,
    FaIdBadge,
    FaToolbox
} from "react-icons/fa";

const cards = [
    {
        title: "Evaluation & Ranking",
        description: "Analyze your business performance and get ranked against industry standards.",
        icon: FaChartLine,
        href: "/business-support/evaluation",
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Business Certification",
        description: "Get certified to prove your authenticity and quality to the world.",
        icon: FaCertificate,
        href: "/business-support/certifications",
        color: "bg-green-50 text-green-600"
    },
    {
        title: "Grants Support",
        description: "Find and apply for grants to fuel your business growth.",
        icon: FaHandHoldingUsd,
        href: "/business-support/grants",
        color: "bg-yellow-50 text-yellow-600"
    },
    {
        title: "Accreditation Badge",
        description: "Earn accreditation badges to display on your products and profile.",
        icon: FaIdBadge,
        href: "/business-support/accreditation",
        color: "bg-purple-50 text-purple-600"
    },
    {
        title: "Entrepreneur's Kit",
        description: "Access essential tools and resources for your entrepreneurial journey.",
        icon: FaToolbox,
        href: "/business-support/entrepreneur-kits",
        color: "bg-red-50 text-red-600"
    }
];

export default function BusinessSupportPage() {
    return (
        <main>
            <UniversalEditorialHero pageKey="auto-generated-page" fallbackConfig={{
          id: 'auto-generated-page-fallback',
          pageKey: 'auto-generated-page',
          autoplayEnabled: false,
          autoplayIntervalMs: 6000,
          slides: [
            {
              id: 'slide-1',
              internalName: 'Auto Slide',
              eyebrow: 'PAGE',
              titleLineOne: 'EMPOWERING YOUR',
              titleConnector: '',
              titleLineTwo: 'BUSINESS JOURNEY',
              description: 'Comprehensive support systems designed to elevate artisans and entrepreneurs through evaluation, certification, and funding opportunities.'
            }
          ]
        }} />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cards.map((card, index) => (
                            <Link
                                key={index}
                                href={card.href}
                                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                            >
                                <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                                    <card.icon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 font-manrope group-hover:text-brand-primary transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {card.description}
                                </p>
                                <div className="mt-6 flex items-center text-sm font-semibold text-brand-secondary group-hover:translate-x-2 transition-transform">
                                    Explore <span className="ml-2">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
