"use client";
import React from "react";
import Link from "next/link";
import {
  FaShieldAlt, FaFileAlt, FaCheckDouble, FaLock, FaExclamationTriangle,
  FaBookOpen, FaFolderOpen, FaHistory, FaCheckCircle, FaBan, FaQuoteRight,
  FaGavel, FaEye
} from "react-icons/fa";

export default function EvidenceStandardsClient() {
  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20">
      {/* 1. HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden universal-hero">
        
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
            STATE OF KASHMIR CRAFTS
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Evidence Standards
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
            The authoritative reference for acceptable evidence submission, quality requirements, and verification protocols for the public repository.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/state-of-kashmir-crafts/methodology" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-[14px] font-bold hover:bg-white/10 transition flex items-center gap-2">
              <FaBookOpen /> View Methodology
            </Link>
            <Link href="/state-of-kashmir-crafts/participate" className="px-8 py-4 bg-brand-primary text-white rounded-[14px] font-bold hover:bg-brand-secondary transition shadow-xl">
              Submit Evidence
            </Link>
          </div>
        </div>
      </section>

      {/* 1. Purpose */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div data-ui-icon className="w-12 h-12 rounded-full bg-brand-primary/10  flex items-center justify-center text-xl shrink-0">
               <FaShieldAlt />
            </div>
            <h2 className="text-3xl font-black text-brand-dark">1. Purpose</h2>
          </div>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-gray-700 leading-relaxed space-y-4 text-lg">
             <p>Evidence standards define what constitutes acceptable, verifiable, and relevant information for inclusion in the State of Kashmir Crafts public repository.</p>
             <p>These strict standards protect the assessment from misinformation, prevent institutional capture, and ensure that all published findings are grounded in authentic, traceable reality. By establishing clear rules for submission, the KHCRF ensures that the repository remains a globally credible baseline for policy and research.</p>
          </div>
        </div>
      </section>

      {/* 2. Accepted Evidence Types */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-black text-brand-dark mb-10 text-center">2. Accepted Evidence Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Documents", "Photographs", "Videos", "Audio recordings",
              "Survey responses", "Institutional reports", "Government publications",
              "Academic research", "Historical archives", "Maps", "GIS data",
              "Official correspondence", "Public hearing transcripts"
            ].map((type, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 hover:border-brand-primary transition group">
                <FaCheckCircle data-ui-icon  className=" group-hover:text-brand-primary transition text-xl shrink-0" />
                <span className="font-bold text-gray-800">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Evidence Quality Requirements */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-center gap-4 mb-10">
            <FaCheckDouble data-ui-icon  className="text-4xl " />
            <h2 className="text-3xl font-black text-brand-dark">3. Evidence Quality Requirements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/20">
                <h3 className="font-bold text-xl text-brand-dark mb-3">Authenticity &amp; Provenance</h3>
                <p className="text-gray-600">The origin of the evidence must be verifiable. Anonymous submissions are generally not accepted unless specifically authorized for whistleblower protection. Chain of custody must be demonstrated for historical or physical claims.</p>
             </div>
             <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/20">
                <h3 className="font-bold text-xl text-brand-dark mb-3">Accuracy &amp; Completeness</h3>
                <p className="text-gray-600">Evidence must not be deceptively cropped, edited, or presented out of context. Statistical data must include methodology and sample sizes. Incomplete forms may be held in review until clarified.</p>
             </div>
             <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/20">
                <h3 className="font-bold text-xl text-brand-dark mb-3">Date &amp; Context</h3>
                <p className="text-gray-600">All submissions must carry a verified timestamp or established date of creation to differentiate current realities from historical baselines.</p>
             </div>
             <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/20">
                <h3 className="font-bold text-xl text-brand-dark mb-3">Source Attribution</h3>
                <p className="text-gray-600">Clear attribution to the original author, photographer, or institutional source is required to prevent plagiarism and verify intellectual property rights.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Verification Levels */}
      <section className="py-20 universal-hero text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black mb-10 text-center">4. Verification Levels</h2>
          <div className="relative">
             <div className="hidden md:block absolute left-[27px] top-4 bottom-4 w-1 bg-white/10 z-0"></div>
             <div className="space-y-6 relative z-10">
               {[
                 { level: "1. Submitted", desc: "Evidence uploaded to the secure portal. Awaiting triage." },
                 { level: "2. Initial Review", desc: "Secretariat confirms files are readable, complete, and within scope." },
                 { level: "3. Technical Verification", desc: "Subject matter experts verify provenance, translation, and technical accuracy." },
                 { level: "4. Authenticity Confirmed", desc: "Evidence meets all core quality standards and is admitted to the internal database." },
                 { level: "5. Public Release Approved", desc: "Cleared of privacy or copyright concerns and published to the live repository." },
                 { level: "6. Restricted Archive", desc: "Admitted to the assessment but withheld from public view due to confidentiality." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                   <div data-ui-icon className="w-14 h-14 rounded-full bg-brand-secondary  flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
                      {i + 1}
                   </div>
                   <div>
                      <h3 className="text-xl font-bold mb-2">{item.level.substring(3)}</h3>
                      <p className="text-gray-300">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 5. Confidentiality & Privacy */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <FaLock className="text-4xl text-gray-400" />
            <h2 className="text-3xl font-black text-brand-dark">5. Confidentiality &amp; Privacy</h2>
          </div>
          <div className="space-y-6 text-gray-700">
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-lg text-brand-dark mb-2">Public Evidence</h4>
                <p>Default classification for institutional submissions, hearing transcripts, and public testimony. Fully accessible in the repository.</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-lg text-brand-dark mb-2">Restricted Evidence</h4>
                <p>Commercially sensitive data (e.g., specific pricing contracts) or culturally sensitive heritage maps that are used for internal assessment but shielded from public download.</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-lg text-brand-dark mb-2">Confidential Evidence &amp; Anonymization</h4>
                <p>Testimonies involving vulnerable individuals or whistleblowers. Names and identifying metadata are stripped via a strict redaction policy before any aggregated use.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 6. File Requirements & 7. Rejection */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* 6. File Requirements */}
             <div>
                <h2 className="text-3xl font-black text-brand-dark mb-6 flex items-center gap-3">
                   <FaFolderOpen data-ui-icon  className="" /> 6. File Requirements
                </h2>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                   <ul className="space-y-4 text-gray-600">
                     <li><strong>Supported Formats:</strong> PDF, DOCX, JPG, PNG, MP4, MP3, CSV.</li>
                     <li><strong>Maximum Size:</strong> 50MB per standard file. (Video submissions may use external verified links).</li>
                     <li><strong>Naming Conventions:</strong> Clear, descriptive titles avoiding generic names (e.g., "Pashmina_Loom_Condition_2026.jpg" instead of "IMG001.jpg").</li>
                     <li><strong>Metadata:</strong> EXIF data is preferred for photography to verify location and date.</li>
                   </ul>
                </div>
             </div>

             {/* 7. Rejection */}
             <div>
                <h2 className="text-3xl font-black text-brand-dark mb-6 flex items-center gap-3">
                   <FaBan className="text-red-500" /> 7. Rejection Criteria
                </h2>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                   <p className="text-gray-600 mb-4">Submissions may be rejected if they are:</p>
                   <ul className="space-y-2 text-gray-700 font-medium">
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Duplicate of existing record</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Fabricated or manipulated</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Unverifiable provenance</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Copyright or intellectual property violation</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Major privacy concerns without consent</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Grossly incomplete metadata</li>
                     <li className="flex items-center gap-2"><FaExclamationTriangle className="text-red-400" /> Outside geographic or sector scope</li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 8. Referencing & Citation */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black text-brand-dark mb-8 flex items-center gap-4">
            <FaQuoteRight data-ui-icon  className="" /> 8. Referencing &amp; Citation
          </h2>
          <div className="text-gray-700 text-lg space-y-6">
             <p>Every piece of accepted evidence is assigned a unique cryptographic <strong>Reference Number</strong> (e.g., `SKC-2026-EV-9402`).</p>
             <p>This reference number ensures absolute traceability. It is used to cite the evidence in:</p>
             <ul className="list-disc pl-6 space-y-2 font-bold text-brand-dark">
                <li>Draft Findings reports</li>
                <li>The Final Assessment Report</li>
                <li>Public Hearing determinations</li>
             </ul>
             <p>Readers of the final report can input this reference number into the public Evidence Repository to view the exact source material underlying a specific conclusion.</p>
          </div>
        </div>
      </section>

      {/* 9. Transparency Policy */}
      <section className="py-20 bg-brand-primary text-white border-b border-brand-primary">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <FaEye className="text-5xl mx-auto mb-6 text-white/50" />
          <h2 className="text-3xl font-black mb-8">9. Transparency Policy</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-90">
            The KHCRF operates the State of Kashmir Crafts assessment on the principle of maximum defensibility. Evidence is reviewed objectively without institutional bias, classified strictly by standard rules, and archived permanently. Except where strict confidentiality protects vulnerable individuals, the evidence base supporting all policy conclusions is published in the open repository for global review.
          </p>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black text-brand-dark mb-10 text-center">10. Frequently Asked Questions</h2>
          <div className="space-y-4">
             <details className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer group">
                <summary className="font-bold text-lg text-brand-dark group-hover:text-brand-primary outline-none list-none flex justify-between items-center">
                   Can I submit evidence anonymously?
                   <span className="text-brand-primary font-black">+</span>
                </summary>
                <div className="mt-4 text-gray-600">
                   You may request confidentiality, meaning your identity is verified internally but hidden from the public repository. True anonymous submissions (where we cannot verify who you are) are generally rejected due to lack of provenance.
                </div>
             </details>
             <details className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer group">
                <summary className="font-bold text-lg text-brand-dark group-hover:text-brand-primary outline-none list-none flex justify-between items-center">
                   What happens if my evidence contradicts official government data?
                   <span className="text-brand-primary font-black">+</span>
                </summary>
                <div className="mt-4 text-gray-600">
                   It will be accepted if it meets quality requirements. The assessment explicitly documents divergences between grassroots realities and administrative data. Contradictory evidence is vital for a truthful assessment.
                </div>
             </details>
             <details className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 cursor-pointer group">
                <summary className="font-bold text-lg text-brand-dark group-hover:text-brand-primary outline-none list-none flex justify-between items-center">
                   Will I be notified when my submission is approved?
                   <span className="text-brand-primary font-black">+</span>
                </summary>
                <div className="mt-4 text-gray-600">
                   Yes. You will receive an email containing your permanent Reference Number once your submission passes Technical Verification and enters the repository.
                </div>
             </details>
          </div>
        </div>
      </section>
    </main>
  );
}
