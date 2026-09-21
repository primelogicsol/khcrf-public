"use client";

import {
  FaEnvelope,
  FaCheckCircle,
  FaTag,
  FaFileAlt,
  FaBalanceScale,
  FaShieldAlt,
  FaBullhorn,
  FaChartPie,
  FaUsers,
  FaIndustry,
  FaFlag,
  FaBriefcase,
  FaClipboardCheck,
} from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import Indicator from "./Indicator";

export default function OverviewTab({ office, overviewData }: any) {
  const {
    rStats,
    craftComposition,
    economicIndicators,
    caseStatus,
    officeMessage,
  } = overviewData || {};

  const displayRStats = {
    totalStakeholders: rStats?.totalStakeholders || 0,
    verifiedProfiles: rStats?.verifiedProfiles || 0,
    underEvaluation: rStats?.underEvaluation || 0,
    commerceInterest: rStats?.commerceInterest || 0,
  };

  const displayCraftComp = craftComposition || [];
  const displayEcoInd = economicIndicators || [];
  const displayCaseStatus = caseStatus || [];

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* --- SECTION A: Constituency Craft Impact Overview --- */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair mb-2">
            KHCRF Constituency Craft Impact Overview
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Verified metrics and craft composition within the constituency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <FaUsers className="absolute top-4 right-4 text-4xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-2">
              Registered
            </h4>
            <div className="text-3xl font-black mb-1 font-playfair">
              {displayRStats.totalStakeholders}
            </div>
            <div className="text-xs font-medium text-blue-50">
              CCSI Stakeholders
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-lg shadow-teal-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <FaCheckCircle className="absolute top-4 right-4 text-4xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-2">
              Identity Confirmed
            </h4>
            <div className="text-3xl font-black mb-1 font-playfair">
              {displayRStats.verifiedProfiles}
            </div>
            <div className="text-xs font-medium text-emerald-50">
              Verified Profiles
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 shadow-lg shadow-orange-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <FaChartPie className="absolute top-4 right-4 text-4xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-100 mb-2">
              Pending Review
            </h4>
            <div className="text-3xl font-black mb-1 font-playfair">
              {displayRStats.underEvaluation}
            </div>
            <div className="text-xs font-medium text-amber-50">
              Under Evaluation
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl p-6 shadow-lg shadow-fuchsia-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <FaBriefcase className="absolute top-4 right-4 text-4xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-100 mb-2">
              Declared
            </h4>
            <div className="text-3xl font-black mb-1 font-playfair">
              {displayRStats.commerceInterest}
            </div>
            <div className="text-xs font-medium text-purple-50">
              Commerce Interest
            </div>
          </div>
        </div>

        {/* Office Message Card */}
        <div className="bg-[#050A1E] text-white p-8 rounded-xl shadow-xl relative overflow-hidden mb-8">
          {/* <div className="absolute top-0 right-0 p-4 opacity-10">
            <FaEnvelope size={120} />
          </div> */}
          <h3 className="text-xl font-bold font-playfair mb-4 text-[#ca8a04]">
            Message from {office.representativeName}
          </h3>
          <blockquote className="text-lg font-light leading-relaxed italic z-10 relative">
            "
            {officeMessage ||
              office.engagementSummary ||
              "Committed to supporting our artisans, protecting GI crafts, enhancing cluster development, and combating counterfeit goods for a sustainable craft economy."}
            "
          </blockquote>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Craft Composition */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaIndustry />
              KHCRF CCSI Constituency Craft Composition
            </h3>
            <div className="space-y-4">
              {displayCraftComp.length > 0 ? (
                displayCraftComp.map((c: any) => (
                  <div key={c.name} className="flex items-center gap-4">
                    <div className="w-1/3 text-sm font-bold text-gray-700">
                      {c.name}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-primary h-full rounded-full"
                        style={{
                          width: `${displayRStats.totalStakeholders > 0 ? (c.count / displayRStats.totalStakeholders) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm font-bold text-gray-500">
                      {c.count}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg">
                  No data found
                </div>
              )}
            </div>
          </div>

          {/* Economic Indicators */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaUsers />
              KHCRF CCSI Constituency Economic Indicators
            </h3>
            <div className="space-y-6">
              {displayEcoInd.length > 0 ? (
                displayEcoInd.map((ind: any, i: number) => (
                  <Indicator key={i} label={ind.label} value={ind.value} />
                ))
              ) : (
                <div className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg">
                  No data found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <p className="md:col-span-2 lg:col-span-4 font-bold text-gray-900 mb-2">
            KHCRF CCSI Constituency Craft Counterfeit Reporting Engine
          </p>
          {displayCaseStatus.length > 0 ? (
            displayCaseStatus.map((cs: any, i: number) => {
              // Ensure we load the right icon safely
              const IconComponent =
                (FaIcons as any)[cs.icon] || FaIcons.FaShieldAlt;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div
                    className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${cs.color}`}
                  ></div>
                  <IconComponent className="text-gray-100 text-4xl absolute -right-2 -bottom-2 group-hover:scale-110 transition-transform" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {cs.title}
                  </h4>
                  <div className="text-2xl font-black mb-1 font-playfair text-gray-900">
                    {cs.value}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 lg:col-span-4 text-gray-500 text-sm italic py-8 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
              No data found
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
