import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Editorial Policy — Official Messages | SKC 2026",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8 font-medium">
          <FaArrowLeft /> Official Messages
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-10 text-white">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Official Messages Register</div>
            <h1 className="text-3xl font-black">Editorial Policy</h1>
            <p className="mt-3 text-white/80">State of Kashmir Crafts Assessment 2026–2027 Assessment</p>
          </div>
          <div className="p-8 space-y-8 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Editorial Independence</h2>
              <p>The editorial review of Official Messages is conducted by the Assessment Secretariat independently of political, institutional or commercial influence. No message is modified without the contributor&apos;s knowledge, and no message is published without the contributor&apos;s explicit approval of the final version.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Review Process</h2>
              <p>Each submitted message passes through three review stages before the contributor receives a proof:</p>
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Identity Review — the contributor&apos;s claimed identity and designation are verified</li>
                <li>Authority Verification — the institutional authority to submit is confirmed against the signed letter on record</li>
                <li>Editorial Review — the text is assessed for clarity, formatting and consistency with submission guidelines</li>
              </ol>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">What May Be Edited</h2>
              <p>The editorial team may make the following changes without requiring contributor consent, provided meaning and intent are preserved:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Typographical and spelling corrections</li>
                <li>Punctuation and grammatical standardisation</li>
                <li>Formatting to match the platform design system</li>
                <li>Standardisation of dates, titles and institutional names</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">What Cannot Be Changed</h2>
              <p>The following are not subject to editorial modification without explicit contributor consent:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>The substance or meaning of any statement</li>
                <li>Policy positions, recommendations or factual claims</li>
                <li>The tone or rhetorical register of the message</li>
                <li>Names of organisations, programmes or individuals</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Contributor Approval</h2>
              <p>Before publication, every contributor receives a final proof by email. Publication proceeds only after the contributor explicitly approves the proof. Contributors may request revisions to the editorial version. No message is published without this approval.</p>
            </section>
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3">Corrections After Publication</h2>
              <p>If a published message requires correction due to a factual error introduced by the editorial process, the Secretariat will issue a correction notice and update the record. Corrections introduced by the contributor require a written request and follow the standard revision process.</p>
            </section>
          </div>
          <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-wrap gap-4">
            <Link href="/state-of-kashmir-crafts/official-messages/submission-guidelines" className="text-sm text-brand-primary font-medium hover:underline">Submission Guidelines →</Link>
            <Link href="/state-of-kashmir-crafts/official-messages/archival-policy" className="text-sm text-brand-primary font-medium hover:underline">Archival Policy →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
