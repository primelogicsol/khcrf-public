import React from "react";
import { FaProjectDiagram, FaCheckCircle, FaFileAlt, FaInfoCircle, FaSearch } from "react-icons/fa";

export default function EvidenceSubmissionGuidelinesContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          This document defines standards for submitting evidence to support assessment findings and recommendations.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaFileAlt data-ui-icon  className="" /> Accepted Evidence Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Reports", "Research papers", "Case studies", "Photographs", "Videos", "Audio recordings", "Institutional submissions", "Policy documents", "Survey results"].map((type: any) => (
              <span key={type} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-[10px] text-sm font-bold text-gray-700">
                {type}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaSearch data-ui-icon  className="" /> Evidence Requirements
          </h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Authentic", "Relevant", "Verifiable", "Properly attributed"].map((item: any) => (
              <li key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <FaCheckCircle className="text-green-500" />
                <span className="font-bold text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-2">
          <FaProjectDiagram data-ui-icon  className="" /> Review Process
        </h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
           <div className="absolute left-12 top-12 bottom-12 w-1 bg-brand-primary/20"></div>
           <div className="space-y-6">
              {[
                { step: "Submission" },
                { step: "Screening" },
                { step: "Verification" },
                { step: "Classification" },
                { step: "Evidence Repository" },
                { step: "Analysis" }
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
