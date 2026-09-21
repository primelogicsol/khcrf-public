import React from "react";

export default function ConsultationFrameworkContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Assessment Objectives</h2>
      <p className="mb-8 leading-relaxed">
        What the consultation seeks to learn. This becomes the methodology bible.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Stakeholder Categories</h2>
      <p className="mb-4">Detailed definitions:</p>
      <ul className="grid grid-cols-2 gap-4 pl-0 mb-8 list-none">
        {["Artisan", "Manufacturer", "Exporter", "Retailer", "Online Seller", "Citizen", "Youth", "Government", "Institution", "Political Party", "Researcher"].map((cat: any) => (
          <li key={cat} className="bg-gray-50 p-3 rounded-lg border font-medium text-brand-dark">
            {cat}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Participation Methods</h2>
      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Online Questionnaires</h3>
          <p>Digital structured responses.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Evidence Submissions</h3>
          <p>Direct uploads of supporting documentation.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Public Hearings</h3>
          <p>Open floor discussions and testimonies.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Validation Round</h3>
          <p>Draft review by the public.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-dark">Expert Review</h3>
          <p>Final quality and accuracy checks.</p>
        </div>
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">District Coverage</h2>
      <p className="mb-8 leading-relaxed">
        All ten districts in the Kashmir Valley. Essential to ensure comprehensive geographical representation.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Questionnaire Architecture</h2>
      <p className="mb-8 leading-relaxed">
        Explain dynamic questionnaires. Adapts based on stakeholder category and region.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Data Classification</h2>
      <p className="mb-4">Themes:</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {["Livelihoods", "Markets", "Exports", "Tourism", "Youth", "Women", "Training", "Authenticity", "GI", "Innovation"].map((theme: any) => (
          <span key={theme} className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/30 rounded-[10px] text-sm font-bold">
            {theme}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Analysis Methodology</h2>
      <p className="mb-8 leading-relaxed">
        How responses become findings through qualitative and quantitative processing.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Validation Methodology</h2>
      <p className="mb-8 leading-relaxed">
        How stakeholder review occurs to ensure findings match realities.
      </p>

      <h2 className="text-2xl font-black text-brand-dark mb-4 border-b pb-2">Report Methodology</h2>
      <p className="mb-8 leading-relaxed">
        How final findings are prepared for public release and archived.
      </p>
    </div>
  );
}
