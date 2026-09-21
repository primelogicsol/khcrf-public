import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaFilePdf, FaArrowLeft, FaCheckCircle, FaFileAlt, FaHistory, FaDownload, FaProjectDiagram, FaFileSignature, FaLock
} from "react-icons/fa";

import GovernanceFrameworkContent from "./content/GovernanceFrameworkContent";
import ConsultationFrameworkContent from "./content/ConsultationFrameworkContent";
import ConsentProtocolContent from "./content/ConsentProtocolContent";
import ConflictOfInterestContent from "./content/ConflictOfInterestContent";
import AdvisoryCouncilCharterContent from "./content/AdvisoryCouncilCharterContent";
import TermsOfReferenceContent from "./content/TermsOfReferenceContent";
import ParticipationGuidelinesContent from "./content/ParticipationGuidelinesContent";
import EvidenceSubmissionGuidelinesContent from "./content/EvidenceSubmissionGuidelinesContent";
import PublicHearingGuidelinesContent from "./content/PublicHearingGuidelinesContent";
import ValidationFrameworkContent from "./content/ValidationFrameworkContent";
import ExpertReviewFrameworkContent from "./content/ExpertReviewFrameworkContent";
import PublicationPolicyContent from "./content/PublicationPolicyContent";
import DataProtectionPolicyContent from "./content/DataProtectionPolicyContent";
import MediaParticipationGuidelinesContent from "./content/MediaParticipationGuidelinesContent";
import FellowshipHandbookContent from "./content/FellowshipHandbookContent";

const contentMap: Record<string, React.ElementType> = {
  "governance-framework": GovernanceFrameworkContent,
  "consultation-framework": ConsultationFrameworkContent,
  "consent-protocol": ConsentProtocolContent,
  "conflict-of-interest-disclosure": ConflictOfInterestContent,
  "advisory-council-charter": AdvisoryCouncilCharterContent,
  "terms-of-reference": TermsOfReferenceContent,
  "participation-guidelines": ParticipationGuidelinesContent,
  "evidence-submission-guidelines": EvidenceSubmissionGuidelinesContent,
  "public-hearing-guidelines": PublicHearingGuidelinesContent,
  "validation-framework": ValidationFrameworkContent,
  "expert-review-framework": ExpertReviewFrameworkContent,
  "publication-policy": PublicationPolicyContent,
  "data-protection-policy": DataProtectionPolicyContent,
  "media-participation-guidelines": MediaParticipationGuidelinesContent,
  "fellowship-handbook": FellowshipHandbookContent
};

const documentData: Record<string, any> = {
  "governance-framework": {
    title: "Governance Framework",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Governance Committee",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines how the State of Kashmir Crafts assessment is governed, reviewed, validated, published, and protected from bias.",
    whyItExists: "To ensure that the assessment remains neutral, transparent, and driven by the best interests of the crafts ecosystem rather than political or commercial influence.",
    whoShouldUse: "Advisory Council members, research teams, government observers, and stakeholders evaluating the credibility of the report.",
    scope: [
      "Assessment Mission and Independence",
      "Governance structure and responsibilities",
      "Roles of Advisory Council and Expert Review Panel",
      "Ethical guidelines and transparency mandates",
      "Publication standards and review procedures"
    ],
    changeLog: [
      { version: "1.0", date: "June 2026", desc: "Initial Approval and Publication" }
    ],
    fileAvailable: false,
    isTemplate: false
  },
  "consultation-framework": {
    title: "Consultation Framework",
    type: "Methodology Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Research Division",
    approvalAuthority: "Assessment Director",
    summary: "Defines stakeholder categories, participation methods, questionnaires, public hearings, evidence collection, and validation.",
    whyItExists: "To provide a structured, inclusive methodology that ensures every segment of the crafts sector is heard systematically.",
    whoShouldUse: "Field researchers, participating institutions, district coordinators, and stakeholders submitting complex evidence.",
    scope: [
      "Definition of 20 stakeholder categories",
      "Questionnaire and interview methodology",
      "Public hearing formats and district integration",
      "Evidence collection and verification standards",
      "Public validation and response integration"
    ],
    changeLog: [
      { version: "1.0", date: "June 2026", desc: "Initial Approval and Publication" }
    ],
    fileAvailable: false,
    isTemplate: false
  },
  "consent-protocol": {
    title: "Consent Protocol",
    type: "Governance Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Ethics Committee",
    approvalAuthority: "KHCRF Legal Counsel",
    summary: "Defines participant rights, privacy, data use, recording permissions, evidence handling, and publication consent.",
    whyItExists: "To protect the privacy and rights of artisans and stakeholders sharing sensitive business, financial, or personal information.",
    whoShouldUse: "All participants, field researchers, and data handlers.",
    scope: [
      "Informed consent for participation",
      "Audio and video recording permissions",
      "Anonymity and attribution options",
      "Data protection and storage policies",
      "Evidence usage rights"
    ],
    changeLog: [
      { version: "1.0", date: "June 2026", desc: "Initial Approval and Publication" }
    ],
    fileAvailable: false,
    isTemplate: false
  },
  "conflict-of-interest-disclosure": {
    title: "Conflict of Interest Disclosure",
    type: "Compliance Template",
    version: "1.0",
    status: "Active",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Governance Committee",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Required for advisors, reviewers, fellows, authors, and contributors involved in assessment preparation or review.",
    whyItExists: "To declare any potential commercial, political, or institutional conflicts that might influence the assessment findings.",
    whoShouldUse: "Advisory Council members, Expert Review Panelists, internal research leads, and contributing institutional partners.",
    scope: [
      "Financial disclosures related to the crafts sector",
      "Political or institutional affiliations",
      "Commercial interests in recommended policies",
      "Declaration of impartiality"
    ],
    changeLog: [
      { version: "1.0", date: "June 2026", desc: "Template Activated" }
    ],
    fileAvailable: false,
    isTemplate: true
  },
  "advisory-council-charter": {
    title: "Advisory Council Charter",
    type: "Governance Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Governance Committee",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines the role, composition, responsibilities, and ethical obligations of the Advisory Council.",
    whyItExists: "To establish a clear mandate for the Advisory Council.",
    whoShouldUse: "Advisory Council Members",
    scope: ["Mission", "Structure", "Guidelines"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Approval" }],
    fileAvailable: false,
    isTemplate: false
  },
  "terms-of-reference": {
    title: "Terms of Reference",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Governance Committee",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines how the State of Kashmir Crafts Assessment 2026–2027 assessment operates.",
    whyItExists: "To clarify member roles.",
    whoShouldUse: "Advisory Council Members",
    scope: ["Roles", "Responsibilities", "Contributions"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Approval" }],
    fileAvailable: false,
    isTemplate: false
  },
  "participation-guidelines": {
    title: "Participation Guidelines",
    type: "Information Packet",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Stakeholder Division",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Explains how individuals and institutions participate.",
    whyItExists: "To help users navigate the platform.",
    whoShouldUse: "All Participants",
    scope: ["Submitting Evidence", "Attending Hearings", "Tracking Impact"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Approval" }],
    fileAvailable: false,
    isTemplate: false
  },
  "evidence-submission-guidelines": {
    title: "Evidence Submission Guidelines",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Research Division",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines acceptable evidence standards.",
    whyItExists: "To ensure quality evidence.",
    whoShouldUse: "All Participants",
    scope: ["Evidence standards", "Formats"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "public-hearing-guidelines": {
    title: "Public Hearing Guidelines",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Public Engagement",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Governs online public hearings.",
    whyItExists: "To ensure fair hearings.",
    whoShouldUse: "Speakers and Observers",
    scope: ["Hearing rules", "Conduct"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "validation-framework": {
    title: "Validation Framework",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Research Division",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines how draft findings are reviewed.",
    whyItExists: "To ensure findings accuracy.",
    whoShouldUse: "All Participants",
    scope: ["Validation Process", "Corrections"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "expert-review-framework": {
    title: "Expert Review Framework",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Governance Committee",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Governs independent expert review.",
    whyItExists: "To mandate rigorous quality checks.",
    whoShouldUse: "Expert Review Panel",
    scope: ["Expert rules", "Procedures"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "publication-policy": {
    title: "Publication Policy",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Communications",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Defines publication standards.",
    whyItExists: "To standardise report outputs.",
    whoShouldUse: "Authors",
    scope: ["Publication Types", "Standards"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "data-protection-policy": {
    title: "Data Protection Policy",
    type: "Governance Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Ethics Committee",
    approvalAuthority: "KHCRF Legal Counsel",
    summary: "Governs participant data.",
    whyItExists: "To protect data privacy.",
    whoShouldUse: "All Participants",
    scope: ["Data Privacy", "Storage"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "media-participation-guidelines": {
    title: "Media Participation Guidelines",
    type: "Policy Document",
    version: "1.0",
    status: "Approved",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Communications",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Governs media involvement.",
    whyItExists: "To help media cover hearings.",
    whoShouldUse: "Media Partners",
    scope: ["Media Rules", "Ethics"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  },
  "fellowship-handbook": {
    title: "Fellowship Handbook",
    type: "Reference Guide",
    version: "1.0",
    status: "Active",
    publishedDate: "June 2026",
    lastUpdated: "June 2026",
    owner: "KHCRF Fellowship Division",
    approvalAuthority: "KHCRF Executive Board",
    summary: "Operational manual for fellows.",
    whyItExists: "To guide new fellows.",
    whoShouldUse: "Fellows",
    scope: ["Guidelines", "Responsibilities"],
    changeLog: [{ version: "1.0", date: "June 2026", desc: "Initial Publish" }],
    fileAvailable: false,
    isTemplate: false
  }
};

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(documentData).map((slug: any) => ({
    slug: slug,
  }));
}

export default async function DocumentDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug.toLowerCase();
  let doc = documentData[slug];
  let isDbResource = false;

  if (!doc) {
    try {
      const res = await fetch(`http://127.0.0.1:4000/api/skc/stakeholder-registry/resources/${slug}`, {
        next: { revalidate: 30 }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const dbResource = json.data;
          doc = {
            title: dbResource.title,
            type: dbResource.documentType,
            version: dbResource.version,
            status: dbResource.status === 'ACTIVE' ? 'Active' : dbResource.status,
            publishedDate: dbResource.publicationDate ? new Date(dbResource.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
            lastUpdated: dbResource.updatedAt ? new Date(dbResource.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
            owner: 'Hamadan Craft Revival Foundation',
            approvalAuthority: 'Secretariat',
            summary: dbResource.shortDescription,
            whyItExists: dbResource.longDescription || dbResource.shortDescription,
            whoShouldUse: 'All stakeholders, artisans, and organization leads.',
            scope: [
              `Document category: ${dbResource.category}`,
              `Format: ${dbResource.mimeType || 'application/pdf'}`,
              `Language: ${dbResource.language === 'en' ? 'English' : dbResource.language}`
            ],
            changeLog: [
              { version: dbResource.version, date: dbResource.publicationDate ? new Date(dbResource.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', desc: 'Active version' }
            ],
            fileAvailable: true,
            isTemplate: false,
            fileUrl: `/api/backend/skc/stakeholder-registry/resources/${slug}/download`,
            fileSizeBytes: dbResource.fileSizeBytes
          };
          isDbResource = true;
        }
      }
    } catch (err) {
      console.error("Error fetching db resource:", err);
    }
  }

  if (!doc) {
    notFound();
  }

  const relatedDocuments = Object.keys(documentData).filter(key => key !== slug);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans text-brand-dark">
      {/* Hero Section */}
      <section className="universal-hero text-white py-24 relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Link href="/state-of-kashmir-crafts/governance-framework" className="inline-flex items-center gap-2 text-brand-secondary font-bold hover:text-white transition mb-8 text-sm tracking-wide uppercase">
              <FaArrowLeft /> Back to Official Documents
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">{doc.title}</h1>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-[10px] text-sm font-bold text-gray-200">
                    {doc.type}
                  </span>
                  <span className="px-3 py-1 bg-brand-primary/20 border border-brand-primary/50 rounded-[10px] text-sm font-bold text-white">
                    Version {doc.version}
                  </span>
                  <span className={`px-3 py-1 border rounded-[10px] text-sm font-bold ${doc.status === 'Approved' || doc.status === 'Active' ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-amber-500/20 border-amber-500/50 text-amber-300'}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                {doc.fileAvailable ? (
                  <a 
                    href={doc.fileUrl || `/api/backend/skc/stakeholder-registry/resources/${slug}/download`}
                    className="px-8 py-4 bg-white text-brand-dark font-black rounded-[14px] hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Download {doc.isTemplate ? "Template" : "PDF"}
                  </a>
                ) : (
                  <div className="px-8 py-4 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-[14px] flex items-center justify-center gap-2 cursor-not-allowed">
                    <FaLock className="text-sm" /> Available Soon
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Published</div>
                <div className="font-medium text-white">{doc.publishedDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Last Updated</div>
                <div className="font-medium text-white">{doc.lastUpdated}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Document Owner</div>
                <div className="font-medium text-white">{doc.owner}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Approval Authority</div>
                <div className="font-medium text-white">{doc.approvalAuthority}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-10">
              
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                {contentMap[slug] ? (
                   React.createElement(contentMap[slug])
                ) : (
                  <>
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <FaFileAlt data-ui-icon  className="" /> Document Summary
                    </h2>
                    <div className="prose prose-lg text-gray-600 mb-10">
                      <p className="font-medium text-xl text-brand-dark mb-6 leading-relaxed">
                        {doc.summary}
                      </p>
                      <h3 className="text-lg font-bold text-brand-dark mb-3">Why This Document Exists</h3>
                      <p className="mb-6">{doc.whyItExists}</p>
                      
                      <h3 className="text-lg font-bold text-brand-dark mb-3">Who Should Use It</h3>
                      <p>{doc.whoShouldUse}</p>
                    </div>

                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <FaCheckCircle data-ui-icon  className="" /> Document Scope
                    </h2>
                    <ul className="space-y-4 mb-10">
                      {doc.scope.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" />
                          <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <FaProjectDiagram data-ui-icon  className="" /> Document Workflow
                    </h2>
                    <div className="bg-brand-dark rounded-2xl p-6 text-white overflow-x-auto">
                       <div className="flex items-center gap-4 min-w-[600px]">
                          {["Draft", "Review", "Approval", "Publication", "Version Control", "Archive"].map((step, i, arr) => (
                            <React.Fragment key={step}>
                              <div className="bg-white/10 px-4 py-2 rounded-[12px] font-bold text-sm whitespace-nowrap border border-white/20">
                                {step}
                              </div>
                              {i < arr.length - 1 && <span className="text-brand-secondary">→</span>}
                            </React.Fragment>
                          ))}
                       </div>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-8">
              
              {/* Version & Admin Control */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><FaHistory data-ui-icon  className="" /> Version Control</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Current Version</div>
                    <div className="text-brand-dark font-black text-xl">{doc.version}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Change Log</div>
                    <div className="space-y-3">
                      {doc.changeLog.map((log: any, i: number) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm">
                          <div className="flex justify-between font-bold mb-1">
                            <span className="text-brand-primary">v{log.version}</span>
                            <span className="text-gray-500">{log.date}</span>
                          </div>
                          <p className="text-gray-600">{log.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Downloads */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><FaDownload data-ui-icon  className="" /> File Repository</h3>
                <div className="space-y-3">
                  <a
                    href={doc.fileAvailable ? (doc.fileUrl || `/api/backend/skc/stakeholder-registry/resources/${slug}/download`) : "#"}
                    className={`p-4 border rounded-xl flex items-center justify-between block ${doc.fileAvailable ? 'bg-brand-primary/5 border-brand-primary hover:bg-brand-primary/10 transition cursor-pointer' : 'bg-gray-50 border-gray-200 opacity-60 pointer-events-none'}`}
                  >
                    <div className="flex items-center gap-3">
                      <FaFilePdf data-ui-icon  className="text-2xl " />
                      <div>
                        <div className="font-bold text-sm text-brand-dark">Current {doc.isTemplate ? "Template" : "PDF"}</div>
                        <div className="text-xs text-gray-500">
                          {doc.fileAvailable ? (doc.fileSizeBytes ? `${(doc.fileSizeBytes / 1024).toFixed(1)} KB` : "1.2 MB") : "Available Soon"}
                        </div>
                      </div>
                    </div>
                  </a>
                  
                  <div className="p-4 border rounded-xl flex items-center justify-between bg-gray-50 border-gray-200 opacity-60">
                    <div className="flex items-center gap-3">
                      <FaHistory className="text-xl text-gray-400" />
                      <div>
                        <div className="font-bold text-sm text-gray-600">Previous Versions</div>
                        <div className="text-xs text-gray-500">Archive Empty</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><FaFileSignature data-ui-icon  className="" /> Related Documents</h3>
                <div className="space-y-2">
                  {relatedDocuments.map((key: any) => (
                    <Link key={key} href={`/state-of-kashmir-crafts/documents/${key}`} className="block p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-brand-primary hover:text-brand-primary transition font-medium text-sm text-gray-700">
                      {documentData[key].title}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
