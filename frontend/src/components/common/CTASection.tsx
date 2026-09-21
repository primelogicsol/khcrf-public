import React from "react";
import { FaHandHoldingHeart } from "react-icons/fa";
import Link from "next/link";

interface CTASectionProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    dark?: boolean;
}

export default function CTASection({
    title = "Stay Connected With Hamadan Craft Revival Foundation - Kashmir",
    subtitle = "Kashmir's Craft Policy Think-Tank",
    buttonText = "Subscribe Membership Today",
    buttonLink = "/about/memberships",
    dark = true
}: CTASectionProps) {
    return (
        <section className={`py-20 relative overflow-hidden ${dark ? "bg-gray-600" : "bg-white"}`}>
            {dark && (
                <div className="absolute inset-0  opacity-5"></div>
            )}

            <div className={`container mx-auto px-4 text-center relative z-10`}>
                <div className="flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl shadow-lg ${dark ? "bg-white/10 backdrop-blur-md text-white border border-white/20" : "bg-brand-secondary text-white"}`}>
                        <FaHandHoldingHeart />
                    </div>
                    <h3 className={`text-3xl font-black mb-2 tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>{title}</h3>
                    <p className={`text-xl font-medium mb-8 ${dark ? "text-brand-secondary" : "text-brand-primary"}`}>{subtitle}</p>
                    <Link href={buttonLink} className="px-8 py-4 bg-brand-secondary text-white font-bold rounded-lg hover:bg-white hover:text-brand-dark transition-all shadow-lg transform hover:-translate-y-1">
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
