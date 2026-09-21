import React from "react";
import { FaProjectDiagram, FaCheckCircle, FaBook, FaInfoCircle, FaStar } from "react-icons/fa";

export default function PublicationPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Publication Policy governs how reports, summaries, briefs, and supporting documents are prepared, approved, published, corrected, and archived.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaStar data-ui-icon  className="" /> Publication Principles
          </h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Accuracy", "Transparency", "Evidence-based reporting", "Public accessibility", "Proper citation"].map((item: any) => (
              <li key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <FaCheckCircle data-ui-icon  className=" shrink-0" />
                <span className="font-bold text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaBook data-ui-icon  className="" /> Publication Types
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {["Annual Report", "Executive Summary", "Technical Notes", "District Profiles", "Hearing Reports", "Policy Briefs"].map((type: any) => (
              <div key={type} className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 font-bold text-brand-dark">
                {type}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-2">
          <FaProjectDiagram data-ui-icon  className="" /> Publication Workflow
        </h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
           <div className="absolute left-12 top-12 bottom-12 w-1 bg-brand-primary/20"></div>
           <div className="space-y-6">
              {[
                { step: "Draft" },
                { step: "Review" },
                { step: "Approval" },
                { step: "Publication" },
                { step: "Archive" }
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
