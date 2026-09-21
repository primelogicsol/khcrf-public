import React from "react";
import Link from "next/link";
import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';
import { FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Archival Policy — Official Messages | SKC 2026",
};

export default function ArchivalPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8 font-medium">
          <FaArrowLeft /> Official Messages
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-10 text-white">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Official Messages Register</div>
            <h1 className="text-3xl font-black">Archival Policy</h1>
            <p className="mt-3 text-white/80">State of Kashmir Crafts Assessment 2026–2027 Assessment</p>
          </div>
          <div className="p-8 space-y-8 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">What is Archived</h2>
              <p>The following records are archived and retained as part of the permanent Assessment record:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>All published official messages</li>
                <li>Messages that were withdrawn after publication, with a withdrawal notice</li>
                <li>Messages that were declined, stored internally for audit purposes only (not public)</li>
                <li>Superseded versions of messages that were revised post-publication</li>
                <li>Associated verification records and audit logs</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">When Records are Archived</h2>
              <p>A record transitions to archived status in the following circumstances:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>The contributor formally requests withdrawal after the consultation period closes</li>
                <li>The Assessment Secretariat determines, in consultation with governance oversight, that a record must be removed from public view</li>
                <li>A superseding version is published, rendering the previous version historical</li>
                <li>The Assessment programme concludes and records are migrated to the final archive</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Public Access After Archiving</h2>
              <p>Archived messages are removed from the public-facing Official Messages Register. However, the original text and metadata are retained in the Assessment&apos;s institutional archive. Where a record is withdrawn, a notice is displayed at the original location explaining the withdrawal without disclosing the content.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Requesting Withdrawal</h2>
              <p>Contributors may request withdrawal of a published message by contacting the Assessment Secretariat in writing. Withdrawal requests received during the Submission and Public Participation Period ({formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)} to {formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedEnd)}) will be reviewed within 10 working days. Withdrawal does not guarantee removal of references to the contribution in the Final Report if it has already been cited.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Retention Period</h2>
              <p>All records associated with the State of Kashmir Crafts Assessment 2026–2027 Assessment, including official messages and associated verification materials, are retained for a minimum of ten years from the date of the Final Report publication, in accordance with the KHCRF institutional records management policy.</p>
            </section>
          </div>
          <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-wrap gap-4">
            <Link href="/state-of-kashmir-crafts/official-messages/submission-guidelines" className="text-sm text-brand-primary font-medium hover:underline">Submission Guidelines →</Link>
            <Link href="/state-of-kashmir-crafts/official-messages/editorial-policy" className="text-sm text-brand-primary font-medium hover:underline">Editorial Policy →</Link>
            <Link href="/state-of-kashmir-crafts/contact-secretariat" className="text-sm text-brand-primary font-medium hover:underline">Contact Secretariat →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
