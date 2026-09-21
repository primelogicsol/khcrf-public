import React from "react";
import { FaProjectDiagram, FaCheckCircle, FaUserCheck, FaListUl, FaInfoCircle, FaFileAlt } from "react-icons/fa";

export default function TermsOfReferenceContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Terms of Reference define the objectives, scope, governance arrangements, timeline, deliverables, and operational boundaries of the State of Kashmir Crafts Assessment 2026–2027 assessment.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4">Why This Document Exists</h2>
        <p className="leading-relaxed text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          To ensure that all participants, institutions, and contributors share a common understanding of the purpose, methodology, and expected outputs of the assessment.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaListUl data-ui-icon  className="" /> Scope
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {["Geographic coverage", "Stakeholder groups", "Research methodology", "Consultation process", "Reporting structure", "Deliverables", "Governance arrangements"].map((scope: any) => (
             <div key={scope} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm font-medium text-gray-700">
               {scope}
             </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaFileAlt data-ui-icon  className="" /> Assessment Outputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["State of Kashmir Crafts Report 2026", "Executive Summary", "District Profiles", "Stakeholder Analysis", "Public Hearing Reports", "Policy Recommendations"].map((output: any) => (
             <div key={output} className="flex items-center gap-3 bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl">
               <FaCheckCircle data-ui-icon  className="" />
               <span className="font-bold text-brand-dark">{output}</span>
             </div>
          ))}
        </div>
      </section>

    </div>
  );
}
