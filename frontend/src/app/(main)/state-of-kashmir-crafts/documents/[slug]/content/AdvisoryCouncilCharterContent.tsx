import React from "react";
import { FaProjectDiagram, FaCheckCircle, FaUserCheck, FaListUl, FaInfoCircle, FaFileAlt } from "react-icons/fa";

export default function AdvisoryCouncilCharterContent() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      
      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-3">
          <FaInfoCircle data-ui-icon  className="" /> Document Summary
        </h2>
        <p className="leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          The Advisory Council Charter establishes the role, composition, responsibilities, operating principles, and ethical obligations of the Advisory Council supporting the State of Kashmir Crafts Assessment 2026–2027 assessment. The Council serves as an independent source of guidance and expertise, helping ensure that the assessment remains credible, inclusive, evidence-based, and aligned with the interests of the broader crafts ecosystem.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4">Why This Document Exists</h2>
          <p className="leading-relaxed text-gray-600">
            The State of Kashmir Crafts assessment seeks to represent diverse stakeholder perspectives. The Advisory Council provides strategic guidance, strengthens public trust, and helps maintain transparency throughout the assessment process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-brand-dark mb-4 flex items-center gap-2">
            <FaUserCheck data-ui-icon  className="" /> Who Should Use It
          </h2>
          <ul className="space-y-2 pl-0 list-none">
            {["Advisory Council Members", "Assessment Secretariat", "Expert Review Panel", "Fellows", "Institutional Partners"].map((user: any) => (
              <li key={user} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                <span className="font-medium text-gray-800">{user}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <FaListUl data-ui-icon  className="" /> Document Scope
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {["Council purpose and mandate", "Membership criteria", "Selection procedures", "Terms of appointment", "Meeting protocols", "Ethical obligations", "Conflict management", "Reporting responsibilities", "Public communications"].map((scope: any) => (
             <div key={scope} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm font-medium text-gray-700">
               {scope}
             </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-6">Council Responsibilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Advise on assessment priorities", "Review methodology", "Strengthen stakeholder engagement", "Support institutional outreach", "Promote transparency", "Review emerging findings"].map((resp: any) => (
             <div key={resp} className="flex items-center gap-3 bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl">
               <FaCheckCircle data-ui-icon  className="" />
               <span className="font-bold text-brand-dark">{resp}</span>
             </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-2">
          <FaProjectDiagram data-ui-icon  className="" /> Document Workflow
        </h2>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
           <div className="absolute left-12 top-12 bottom-12 w-1 bg-brand-primary/20"></div>
           <div className="space-y-6">
              {[
                { step: "Member Nomination" },
                { step: "Appointment" },
                { step: "Orientation" },
                { step: "Council Meetings" },
                { step: "Recommendations" },
                { step: "Assessment Support" },
                { step: "Annual Review" }
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
