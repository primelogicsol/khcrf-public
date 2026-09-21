import React from "react";
import { FaCheckCircle, FaUserCheck, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function ParticipationGuidelinesContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Participation Guidelines explain how individuals, organizations, institutions, and stakeholders can participate in the assessment process.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaUserCheck data-ui-icon  className="" /> Eligible Participants
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Artisans", "Manufacturers", "Exporters", "Retailers", "Researchers", "Students", "Youth", "Citizens", "Government agencies", "Media organizations", "Political parties", "Civil society organizations"].map((role: any) => (
            <span key={role} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">
              {role}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4">Participant Responsibilities</h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Provide accurate information", "Respect hearing procedures", "Follow ethical standards", "Submit authentic evidence"].map((item: any) => (
              <li key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <FaCheckCircle data-ui-icon  className="" />
                <span className="font-bold text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaShieldAlt data-ui-icon  className="" /> Participant Rights
          </h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Equal participation", "Privacy protection", "Access to public findings", "Opportunity to provide feedback"].map((item: any) => (
              <li key={item} className="flex items-center gap-3 bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20">
                <FaCheckCircle data-ui-icon  className="" />
                <span className="font-bold text-brand-dark">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

    </div>
  );
}
