import React from "react";
import { FaCheckCircle, FaUserCheck, FaInfoCircle, FaBullhorn, FaCamera } from "react-icons/fa";

export default function MediaParticipationGuidelinesContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Media Participation Guidelines establish standards for media engagement, reporting, interviews, and public communication related to the assessment.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaCamera data-ui-icon  className="" /> Eligible Media
        </h2>
        <div className="flex flex-wrap gap-3">
          {["Newspapers", "Television", "Radio", "Digital media", "Independent journalists", "Podcasts"].map((media: any) => (
            <span key={media} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 shadow-sm">
              {media}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaUserCheck data-ui-icon  className="" /> Media Responsibilities
          </h2>
          <ul className="space-y-3 pl-0 list-none">
            {["Accurate reporting", "Proper attribution", "Respect participant privacy", "Avoid misrepresentation"].map((item: any) => (
              <li key={item} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" />
                <span className="font-bold text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaBullhorn data-ui-icon  className="" /> Media Access
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {["Public hearings", "Published reports", "Media briefings", "Public statements"].map((access: any) => (
              <div key={access} className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 font-bold text-brand-dark">
                {access}
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
