import React from "react";
import { FaShieldAlt, FaDatabase, FaUserLock, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

export default function DataProtectionPolicyContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Data Protection Policy governs the collection, storage, processing, use, sharing, and retention of information provided by assessment participants.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaDatabase data-ui-icon  className="" /> Data Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {["User profiles", "Registration information", "Questionnaire responses", "Evidence submissions", "Hearing registrations", "Validation comments"].map((cat: any) => (
            <span key={cat} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">
              {cat}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaShieldAlt data-ui-icon  className="" /> Principles
          </h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Lawful collection", "Purpose limitation", "Data minimization", "Security protection", "User rights"].map((item: any) => (
              <li key={item} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <FaCheckCircle className="text-green-500 shrink-0" />
                <span className="font-bold text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaUserLock data-ui-icon  className="" /> User Rights
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {["Access", "Correction", "Withdrawal", "Deletion requests"].map((right: any) => (
              <div key={right} className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 font-bold text-brand-dark">
                {right}
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
