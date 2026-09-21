"use client";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";


import React from "react";

import ApplicationForm from "@/components/career/ApplicationForm";

export default function TalentPoolPage() {
  return (
    <main className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <UniversalEditorialHero pageKey="auto-generated-pagehero-page" fallbackConfig={{
          id: 'auto-generated-pagehero-page-fallback',
          pageKey: 'auto-generated-pagehero-page',
          autoplayEnabled: false,
          autoplayIntervalMs: 6000,
          slides: [
            {
              id: 'slide-1',
              internalName: 'Auto Slide',
              eyebrow: 'JOIN OUR NETWORK',
              titleLineOne: 'TALENT POOL',
              titleConnector: '',
              titleLineTwo: '',
              description: 'We are always looking for exceptional talent. Submit your details, and we'
            }
          ]
        }} />

      <section className="py-20 relative">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-dark/5 -z-10"></div>

        <div className="container mx-auto px-4 md:px-10">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="h-2 bg-linear-to-r from-brand-secondary to-brand-primary w-full"></div>

            <div className="p-8 md:p-12 space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                  Submit Your Application
                </h2>
                <p className="text-gray-500">
                  Tell us about yourself and how you can contribute to our
                  mission.
                </p>
              </div>

              <ApplicationForm onSuccess={() => window.scrollTo(0, 0)} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
