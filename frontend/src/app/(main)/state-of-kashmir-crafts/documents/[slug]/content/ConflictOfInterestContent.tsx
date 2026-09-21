import React from "react";

export default function ConflictOfInterestContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Purpose</h2>
      <p className="mb-8 leading-relaxed">
        Protect integrity and ensure impartial assessment analysis.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Who Must Submit</h2>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Advisory Council</li>
        <li>Reviewers</li>
        <li>Experts</li>
        <li>Fellows</li>
        <li>Authors</li>
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Disclosure Categories</h2>
      <div className="space-y-4 mb-8">
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Financial Interests</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Employment</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Consultancy</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Ownership</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Family Relationships</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Political Roles</h3></div>
        <div><h3 className="text-lg font-bold text-brand-dark m-0">Institutional Affiliations</h3></div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Assessment Process</h2>
      <div className="bg-brand-dark text-white p-6 rounded-xl mb-8 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-[400px]">
          {["Disclosure", "Review", "Determination", "Approval"].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div className="bg-white/10 px-3 py-2 rounded font-bold text-sm border border-white/20 whitespace-nowrap">{step}</div>
              {idx < arr.length - 1 && <span className="text-brand-secondary">↓</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Possible Outcomes</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl font-bold">No Conflict</div>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl font-bold">Minor Conflict</div>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl font-bold">Manageable Conflict</div>
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl font-bold">Recusal Required</div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Declaration Form</h2>
      <div className="bg-gray-50 border p-6 rounded-xl space-y-4 font-mono text-sm">
        <div className="border-b pb-2"><span className="text-gray-400">Name:</span> ___________________</div>
        <div className="border-b pb-2"><span className="text-gray-400">Position:</span> _______________</div>
        <div className="border-b pb-2"><span className="text-gray-400">Organization:</span> ___________</div>
        <div className="border-b pb-2 h-20"><span className="text-gray-400">Conflict statement:</span><br/></div>
        <div className="border-b pb-2"><span className="text-gray-400">Signature:</span> ______________</div>
        <div className="border-b pb-2"><span className="text-gray-400">Date:</span> ___________________</div>
      </div>
    </div>
  );
}
