"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { certifications, Certification } from "@/data/certifications";
import CertificationCardLayout from "@/components/business-support/CertificationCardLayout";
import DeKoshurPartnerCTA from "@/components/DeKoshurPartnerCTA";

const FILTER_TABS = [
  "All Certifications",
  "Fair Trade",
  "Organic",
  "Environmental",
  "Quality",
  "Social",
  "Sustainability",
  "General",
];

export default function PackagesClient() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Certifications");
  const [displayCerts, setDisplayCerts] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/certificate-packages");
        if (res.data && res.data.length > 0) {
          const apiPackages: Certification[] = res.data.map((pkg: any) => ({
            id: pkg.id,
            type: "General", // Default type for API packages as they lack this field currently
            name: pkg.name,
            description: pkg.description,
            initialCost: pkg.price,
            annualFee: pkg.annualFee || 0,
            requirements: Array.isArray(pkg.features) ? pkg.features : [],
            imagePath: "1.png", // Default image
            level: pkg.validity || "Standard",
          }));
          setDisplayCerts(apiPackages);
        } else {
          setDisplayCerts(certifications);
        }
      } catch (error) {
        console.error("Failed to fetch packages, using fallback", error);
        setDisplayCerts(certifications);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredCerts =
    activeFilter === "All Certifications"
      ? displayCerts
      : displayCerts.filter(
          (cert) =>
            cert.type === activeFilter ||
            (activeFilter === "General" &&
              ![
                "Fair Trade",
                "Organic",
                "Environmental",
                "Quality",
                "Social",
                "Sustainability",
              ].includes(cert.type)),
        );

  const handleProceed = (certId: string) => {
    router.push(`/business-support/certifications/checkout?id=${certId}`);
  };

  return (
    <>
      <CertificationCardLayout
        title="Kashmir Handicrafts Certifications Portal"
        subtitle="Complete Certification Directory"
        maxWidth="max-w-7xl"
      >
        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        )}
        {/* Filter Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 bg-white p-4 rounded-xl shadow-sm no-scrollbar">
          {FILTER_TABS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-brand-secondary text-white shadow-md"
                  : "bg-gray-100 text-brand-secondary hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCerts.map((cert, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Shape */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    {cert.type}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight min-h-12">
                    {cert.name}
                  </h2>
                </div>

                {/* Pricing */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹
                      {cert.initialCost / 1000 >= 100
                        ? (cert.initialCost / 1000).toFixed(0)
                        : (cert.initialCost / 1000).toFixed(1)}
                      k
                    </span>
                    <span className="text-gray-500 font-medium text-sm">
                      / One-time
                    </span>
                  </div>
                  <div className="text-sm text-brand-secondary font-semibold flex items-center gap-1">
                    <span>+ ₹{cert.annualFee.toLocaleString()} Annual Fee</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="grow space-y-4 mb-8">
                  {cert.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0">
                        <svg data-ui-icon 
                          className="w-2.5 h-2.5 "
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm leading-snug">
                        {req}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleProceed(cert.id)}
                  className="w-full py-4 px-6 rounded-xl font-bold border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2 group-hover:bg-brand-secondary group-hover:text-white"
                >
                  <span>Get Certified</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </CertificationCardLayout>
      <DeKoshurPartnerCTA />
    </>
  );
}
