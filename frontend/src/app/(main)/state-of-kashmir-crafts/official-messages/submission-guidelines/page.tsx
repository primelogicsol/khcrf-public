import React from "react";
import Link from "next/link";
import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';
import { FaArrowLeft, FaClock } from "react-icons/fa";

export const metadata = {
  title: "Submission Guidelines — Official Messages | SKC 2026–2027 Assessment",
  description: "Guidelines for submitting an official message to the State of Kashmir Crafts Assessment 2026–2027 Assessment public record.",
};

const sections = [
  {
    title: "Who May Contribute",
    content: `The Official Messages Register is open to individuals who hold formal institutional authority relevant to the Kashmir crafts sector. Contributions are accepted by invitation only. The Assessment Secretariat issues personalised invitations to:\n\n• Heads of government ministries, departments and statutory bodies responsible for crafts, textiles, culture, trade, and rural development\n• Senior representatives of national and international development agencies and cultural institutions\n• Academic and research leaders from universities and institutes working on craft heritage, design, or policy\n• Senior officers of artisan associations, trade federations and sector organisations\n• Political representatives with portfolios directly connected to craft-sector policy\n• Senior leadership of the KHCRF and the Assessment itself`,
  },
  {
    title: "What Makes a Qualifying Message",
    content: `A qualifying message:\n\n• Represents the formal perspective of an institution or sector authority\n• Is relevant to the State of Kashmir Crafts Assessment 2026–2027 Assessment and its scope\n• Is written in formal institutional language\n• Reflects matters of policy, evidence, or institutional concern — not commercial promotion\n• Is original and has not been published elsewhere in the same form\n• Is written or formally authorised by the named contributor`,
  },
  {
    title: "Content Requirements",
    content: `Messages must:\n\n• Be at least 200 characters in length\n• Be written in a formal institutional register\n• Be free of commercial promotional language\n• Be factually accurate and, where claims are made, consistent with available evidence\n• Not contain defamatory, discriminatory or legally problematic content\n• Be submitted in English (translations may be included in addition)`,
  },
  {
    title: "Photograph Requirements",
    content: `An official photograph is required for all published messages:\n\n• Must be a professional portrait (formal, neutral background preferred)\n• Minimum resolution: 400 × 400 pixels\n• Must clearly show the contributor's face\n• Should not be a logo, illustration or group photograph\n• The contributor confirms they own or have rights to use the photograph`,
  },
  {
    title: "Signed Letter",
    content: `A signed institutional letter is required to verify authority:\n\n• Must be on official institutional letterhead\n• Must be signed by the contributor or an authorised institutional officer\n• Should confirm the contributor's designation and their authority to submit\n• Must be submitted in PDF format\n• The Secretariat will treat the letter as a confidential verification document and will not publish it without consent`,
  },
  {
    title: "Consent and Publication",
    content: `By submitting, contributors confirm:\n\n• They are the named contributor and have institutional authority to submit\n• They consent to the message being published on the Assessment platform\n• They understand the message will form part of a permanent public record\n• They consent to editorial formatting without alteration of meaning\n• They will be invited to approve the final proof before publication`,
  },
  {
    title: "Revision Process",
    content: `After submission, messages go through the following review stages:\n\n1. Identity Review — the contributor's identity and role are confirmed\n2. Authority Verification — institutional authority to submit is verified against the signed letter\n3. Editorial Review — formatting, clarity and language are assessed. Corrections may be made without altering meaning\n4. Contributor Proof — the contributor receives the final version for approval before publication\n5. Publication — upon contributor approval, the message is scheduled and published`,
  },
  {
    title: "Submission Timeline",
    content: `Invitations are issued between 1 June 2026 and 16 August 2026 (Design and Pre-Launch Phase).\n\nThe Submission and Public Participation Period runs from ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)} to ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedEnd)}.\n\nFollowing the submission period, evidence review and validation will be conducted prior to the publication stage and archival stage. Messages submitted before ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)} will be processed and may be published from that date, subject to completion of the review process.`,
    icon: FaClock
  },
];

export default function SubmissionGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8 font-medium">
          <FaArrowLeft /> Official Messages
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-10 text-white">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Official Messages Register</div>
            <h1 className="text-3xl font-black">Submission Guidelines</h1>
            <p className="mt-3 text-white/80">State of Kashmir Crafts Assessment 2026–2027 Assessment</p>
          </div>

          <div className="p-8 divide-y divide-gray-100">
            {sections.map((section, i) => (
              <div key={i} className="py-7 first:pt-0">
                <h2 className="text-lg font-black text-gray-900 mb-3">{section.title}</h2>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              For questions about submission guidelines, please{" "}
              <Link href="/state-of-kashmir-crafts/contact-secretariat" className="text-brand-primary font-bold hover:underline">
                contact the Assessment Secretariat
              </Link>.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/state-of-kashmir-crafts/official-messages/editorial-policy" className="text-sm text-brand-primary font-medium hover:underline">Editorial Policy →</Link>
              <Link href="/state-of-kashmir-crafts/official-messages/archival-policy" className="text-sm text-brand-primary font-medium hover:underline">Archival Policy →</Link>
              <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="text-sm text-brand-primary font-medium hover:underline">Request an Invitation →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
