import React from "react";

export default function GovernanceFrameworkContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Executive Summary</h2>
      <p className="mb-6 leading-relaxed">
        Why State of Kashmir Crafts Assessment 2026–2027 exists. <br />
        Purpose:
      </p>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Independent assessment</li>
        <li>Public participation</li>
        <li>Evidence-based findings</li>
        <li>Transparency</li>
        <li>Annual reporting</li>
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Mission</h2>
      <p className="mb-8 leading-relaxed">
        Document the current realities, opportunities, challenges, and future priorities of Kashmir's handicraft ecosystem.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Principles</h2>
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Independence</h3>
          <p>Assessment findings are evidence-driven.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Inclusivity</h3>
          <p>All stakeholder groups may participate.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Transparency</h3>
          <p>Methodology is publicly available.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Accountability</h3>
          <p>All findings traceable to evidence.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Non-Partisanship</h3>
          <p>No political endorsement.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Public Benefit</h3>
          <p>Findings serve public knowledge.</p>
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Governance Structure</h2>
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Patron</h3>
          <p>Provides moral support.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Advisory Council</h3>
          <p>Strategic guidance.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Assessment Secretariat</h3>
          <p>Daily management.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Review Panel</h3>
          <p>Quality control.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Public Participants</h3>
          <p>Evidence contributors.</p>
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Roles & Responsibilities</h2>
      <p className="mb-4">Detailed matrix. Example:</p>
      <div className="bg-gray-50 border p-6 rounded-xl mb-8 space-y-4">
        <div>
          <div className="font-bold text-brand-dark">Advisory Council</div>
          <div className="text-sm">Provide strategic advice</div>
        </div>
        <div>
          <div className="font-bold text-brand-dark">Secretariat</div>
          <div className="text-sm">Manage operations</div>
        </div>
        <div>
          <div className="font-bold text-brand-dark">Review Panel</div>
          <div className="text-sm">Validate quality</div>
        </div>
        <div>
          <div className="font-bold text-brand-dark">Stakeholders</div>
          <div className="text-sm">Provide evidence</div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Ethics</h2>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>No fabrication</li>
        <li>No manipulation</li>
        <li>No undisclosed conflicts</li>
        <li>No selective reporting</li>
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Review Process</h2>
      <div className="bg-brand-dark text-white p-6 rounded-xl mb-8 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-[700px]">
          {["Submission", "Verification", "Analysis", "Draft Findings", "Validation", "Expert Review", "Final Report"].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="bg-white/10 px-3 py-2 rounded font-bold text-sm border border-white/20 whitespace-nowrap">{step}</div>
              {idx < arr.length - 1 && <span className="text-brand-secondary">↓</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Publication Policy</h2>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Annual publication.</li>
        <li>Archive retention.</li>
        <li>Version control.</li>
      </ul>
    </div>
  );
}
