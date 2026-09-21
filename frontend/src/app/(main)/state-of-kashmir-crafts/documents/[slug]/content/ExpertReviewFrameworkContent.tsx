import React from "react";
import { FaProjectDiagram, FaCheckCircle, FaUserCheck, FaInfoCircle, FaSearch } from "react-icons/fa";

export default function ExpertReviewFrameworkContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Expert Review Framework establishes procedures for independent expert assessment of methodologies, findings, evidence, and recommendations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaUserCheck data-ui-icon  className="" /> Eligible Experts
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Master artisans", "Academics", "Heritage professionals", "Export specialists", "Economists", "Tourism experts", "GI specialists"].map((role: any) => (
            <span key={role} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">
              {role}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaSearch data-ui-icon  className="" /> Review Areas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Methodology", "Evidence quality", "Findings", "Recommendations", "Bias assessment"].map((area: any) => (
             <div key={area} className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 font-bold text-brand-dark text-center">
               {area}
             </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-2">
          <FaProjectDiagram data-ui-icon  className="" /> Review Workflow
        </h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
           <div className="absolute left-12 top-12 bottom-12 w-1 bg-brand-primary/20"></div>
           <div className="space-y-6">
              {[
                { step: "Draft Report" },
                { step: "Expert Assignment" },
                { step: "Independent Review" },
                { step: "Comments" },
                { step: "Revision" },
                { step: "Final Acceptance" }
              ].map((flow: any, idx: number) => (
                <div key={idx} className="flex items-center gap-6 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md shrink-0 border-2 border-white">
                    {idx + 1}
                  </div>
                  <div className="bg-gray-50 px-6 py-4 rounded-[14px] border border-gray-100 flex-1 font-bold text-gray-800">
                    {flow.step}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
