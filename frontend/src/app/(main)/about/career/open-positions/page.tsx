import React from "react";
import OpenPositions from "@/components/career/OpenPositions";

export const metadata = {
    title: "Open Positions | Hamadan Craft Revival Foundation",
    description: "Explore opportunities to make a real impact in heritage preservation and social innovation.",
};

export default function OpenPositionsPage() {
    return (
        <main className="bg-gray-50 min-h-screen font-sans text-gray-800 pt-20">
            {/* Simple Header */}
            <section className="universal-hero text-white py-16">
                <div className="container mx-auto px-4 md:px-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Join Our Team
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        We're looking for passionate individuals to help us preserve heritage and empower artisans.
                    </p>
                </div>
            </section>

            <OpenPositions />
        </main>
    );
}
