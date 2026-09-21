import React from "react";

export default function ConsentProtocolContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Participant Rights</h2>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Right to participate.</li>
        <li>Right to withdraw.</li>
        <li>Right to request corrections.</li>
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Data Collection</h2>
      <p className="mb-4">What is collected. Examples:</p>
      <div className="bg-gray-50 border p-4 rounded-xl mb-8 space-y-2 font-medium font-mono text-brand-dark text-sm">
        <div>Name</div>
        <div>Email</div>
        <div>District</div>
        <div>Responses</div>
        <div>Evidence</div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Data Usage</h2>
      <p className="mb-4">Used only for:</p>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        <li>Assessment</li>
        <li>Analysis</li>
        <li>Reporting</li>
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Recording Policy</h2>
      <p className="mb-8 leading-relaxed">
        Virtual hearings may be recorded for accurate transcription and inclusion in the final evidence log.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Evidence Policy</h2>
      <p className="mb-8 leading-relaxed">
        How uploads are securely stored and referenced in the report.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Publication Policy</h2>
      <p className="mb-8 leading-relaxed">
        Aggregated findings. Not personal exposure. Anonymity is protected for sensitive disclosures.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Data Retention</h2>
      <p className="mb-8 leading-relaxed">
        How long information is retained according to global data compliance standards.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Contact Information</h2>
      <p className="mb-8 leading-relaxed font-bold text-brand-dark">
        Assessment Secretariat.
      </p>
    </div>
  );
}
