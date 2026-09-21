"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { methodologyHeroFallback } from "@/config/heroFallbacks";
import {
  FaHammer, FaGlobe, FaUserGraduate, FaLandmark, FaUsers, FaPlane,
  FaFileAlt, FaCheckDouble, FaSearch, FaArrowRight, FaChartLine, FaBalanceScale,
  FaFilePdf, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaBookOpen,
  FaCogs, FaHandshake, FaLock, FaHistory, FaBuilding, FaMicrophone, FaDatabase, FaArchive
} from "react-icons/fa";

export default function MethodologyPage() {
  const [researchQuestions, setResearchQuestions] = useState<any[]>([]);
  const [officialDoc, setOfficialDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback content to ensure essential methodology sections are present
  const fallbackQuestions = [
    { theme: "Artisan Livelihoods", question: "How are artisan incomes, working conditions, and economic security evolving?", rationale: "Essential for understanding the sustainability of craft livelihoods.", status: "Approved" },
    { theme: "Production Systems", question: "What are the current capacities, constraints, and conditions of craft production workshops?", rationale: "Determines the sector's ability to meet market demand sustainably.", status: "Approved" },
    { theme: "Heritage Continuity", question: "To what extent are traditional skills, motifs, and techniques being preserved and transmitted?", rationale: "Core to measuring cultural loss or resilience.", status: "Approved" },
    { theme: "Raw Materials", question: "What are the trends in the availability, quality, and pricing of authentic raw materials?", rationale: "Critical constraint for genuine handmade production.", status: "Approved" },
    { theme: "Markets and Pricing", question: "How is domestic demand and retail pricing affecting artisan profitability?", rationale: "Identifies market viability and value distribution.", status: "Approved" },
    { theme: "Exports", question: "What barriers and opportunities exist for Kashmiri crafts in international markets?", rationale: "Key to expanding the economic base of the sector.", status: "Approved" },
    { theme: "Authenticity and GI", question: "How effective are current Geographical Indication frameworks in preventing counterfeiting?", rationale: "Protects the Kashmir brand and consumer trust.", status: "Approved" },
    { theme: "Youth Participation", question: "What factors encourage or discourage young people from entering the craft sector?", rationale: "Indicates the long-term demographic survival of crafts.", status: "Approved" },
    { theme: "Women in Crafts", question: "What is the specific economic and social condition of women artisans and entrepreneurs?", rationale: "Highlights gender disparities and targeted support needs.", status: "Approved" },
    { theme: "Institutional Capacity", question: "How effective are current institutional structures in supporting the craft ecosystem?", rationale: "Measures governance and support efficacy.", status: "Approved" }
  ];

  useEffect(() => {
    // Attempt to fetch from dashboard/admin API. Fallback used if empty or errors.
    const fetchDashboardData = async () => {
      try {
const API_BASE_URL = getBaseUrlNoApi();
        const res = await fetch(`/api/backend/v1/knowledge?entityType=SKC_METHODOLOGY`);
        if (res.ok) {
          const data = await res.json();
          const items = data.data || data;
          
          const questions = items.filter((d: any) => d.metadata?.kind === 'RESEARCH_QUESTION').map((d:any) => d.metadata);
          if (questions.length > 0) setResearchQuestions(questions);
          else setResearchQuestions(fallbackQuestions);

          const docs = items.filter((d: any) => d.metadata?.kind === 'OFFICIAL_DOCUMENT');
          if (docs.length > 0) setOfficialDoc(docs[0].metadata);
        } else {
          setResearchQuestions(fallbackQuestions);
        }
      } catch (e) {
        setResearchQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <main className="w-full">
      {/* 1. HERO */}
      <UniversalEditorialHero pageKey="skc-methodology" fallbackConfig={methodologyHeroFallback} />

      {/* 2. METHODOLOGY OVERVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-brand-primary/5 border border-brand-primary/20 p-8 md:p-12 rounded-3xl shadow-sm">
             <h2 className="text-3xl font-black text-brand-dark mb-6 text-center">Methodology Overview</h2>
             <div className="text-gray-700 leading-relaxed space-y-4 font-medium text-lg">
                <p>The State of Kashmir Crafts assessment uses a mixed-method, participatory research framework designed to document the condition, performance, challenges, and emerging priorities of Kashmir&apos;s handicraft ecosystem.</p>
                <p>The methodology combines structured stakeholder registration, surveys, institutional submissions, expert interviews, public hearings, documentary evidence, validation, and expert review. Evidence is assessed for relevance, credibility, provenance, consistency, and representativeness before being incorporated into draft findings.</p>
                <p>The assessment does not rely on a single source or consultation method. Findings are developed through triangulation, comparing evidence from multiple stakeholder groups and sources to identify areas of agreement, divergence, uncertainty, and missing information.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. ASSESSMENT SCOPE */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Assessment Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-icon-on-light mb-3 flex items-center gap-2"><FaGlobe /> Geographic Scope</h3>
                <p className="text-gray-600">The assessment is strictly bounded to the officially recognized districts and traditional craft clusters of the Kashmir Valley. Data and evidence outside this territory are excluded unless directly demonstrating export or external market linkages.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-icon-on-light mb-3 flex items-center gap-2"><FaHammer /> Craft-Sector Scope</h3>
                <p className="text-gray-600">Includes core traditional handicrafts (e.g., Pashmina, Sozni, Carpets, Papier-Mâché, Walnut Woodcarving, Crewel, Khatamband, Copperware) and excludes highly industrialized mass manufacturing or unrelated agricultural products.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-icon-on-light mb-3 flex items-center gap-2"><FaUsers /> Stakeholder Scope</h3>
                <p className="text-gray-600">Encompasses artisans, producers, cooperatives, exporters, retailers, researchers, government agencies, civil society, and international buyers to ensure a 360-degree ecosystem view.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-icon-on-light mb-3 flex items-center gap-2"><FaHistory /> Assessment Period</h3>
                <p className="text-gray-600">The baseline assessment (2026) evaluates current conditions while establishing historical context. Future editions will cover the preceding 12-month period to measure year-on-year change.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CORE RESEARCH QUESTIONS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Core Research Questions</h2>
            <p className="text-gray-600">The primary inquiries driving the assessment&apos;s data collection and analysis.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
              <thead className="bg-brand-primary text-white">
                <tr>
                  <th className="p-4 font-bold">Theme</th>
                  <th className="p-4 font-bold">Question</th>
                  <th className="p-4 font-bold">Rationale</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {researchQuestions.map((q, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-bold text-brand-dark whitespace-nowrap">{q.theme}</td>
                    <td className="p-4 text-gray-800">{q.question}</td>
                    <td className="p-4 text-gray-600">{q.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. STAKEHOLDER FRAMEWORK */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Stakeholder Framework</h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            The assessment classifies participants to ensure appropriate weighting, context, and instrument routing. Eligibility is open to any individual or organization directly engaged with or impacted by the Kashmir handicraft sector.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Artisans &amp; Producers</h4>
               <p className="text-sm text-gray-600">The foundation of the ecosystem. Includes master artisans, weavers, family workshops, and cooperatives.</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Trade &amp; Markets</h4>
               <p className="text-sm text-gray-600">Exporters, retailers, e-commerce platforms, raw material suppliers, and allied logistics.</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Government &amp; Policy</h4>
               <p className="text-sm text-gray-600">Craft departments, GI registries, skill development agencies, and elected representatives.</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Education &amp; Research</h4>
               <p className="text-sm text-gray-600">Universities, design schools, independent scholars, and heritage conservationists.</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Civil Society</h4>
               <p className="text-sm text-gray-600">NGOs, advocacy groups, trade unions, and cultural foundations.</p>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-2">Buyers &amp; Tourism</h4>
               <p className="text-sm text-gray-600">International buyers, conscious consumers, and cultural tourism operators.</p>
             </div>
          </div>
          <div className="mt-8 bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10">
            <h4 className="font-bold text-brand-dark mb-2">Duplicate &amp; Representation Handling</h4>
            <p className="text-sm text-gray-700">All submissions are deduplicated using identity metadata. Organizational submissions are weighted separately from individual opinions to prevent institutional capture. Consent for public attribution is required for named citations.</p>
          </div>
        </div>
      </section>

      {/* 6. EVIDENCE SOURCES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Evidence Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaFileAlt, title: "Structured Surveys", desc: "Quantitative and standardized qualitative data gathered via digital forms customized for specific stakeholder types." },
              { icon: FaUsers, title: "Public Participation Forms", desc: "Open-ended qualitative feedback collected from the broader public regarding awareness, preferences, and cultural value." },
              { icon: FaBuilding, title: "Institutional Submissions", desc: "Formal memos, policy briefs, and aggregated data provided by government bodies, NGOs, and trade associations." },
              { icon: FaUserGraduate, title: "Expert Interviews", desc: "In-depth, semi-structured interviews with master artisans, senior researchers, and industry veterans." },
              { icon: FaMicrophone, title: "Public Hearings", desc: "Moderated virtual or in-person sessions to gather consensus, debate contested issues, and record oral testimonies." },
              { icon: FaArchive, title: "Documentary Evidence", desc: "Submitted photographs, wage slips, trade invoices, quality certificates, and historical records verifying claims." },
              { icon: FaDatabase, title: "Administrative Data", desc: "Export statistics, GI registration numbers, artisan census figures, and budget allocations published by authorities." },
              { icon: FaBookOpen, title: "Research Literature", desc: "Peer-reviewed academic papers, market reports, and historical texts providing context and historical baselines." },
              { icon: FaChartLine, title: "Market & Trade Evidence", desc: "Pricing surveys, e-commerce trend analysis, and buyer feedback regarding quality and market demand." }
            ].map((source, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 hover:border-brand-primary transition">
                <source.icon className="text-2xl text-brand-secondary" />
                <h3 className="font-bold text-gray-900">{source.title}</h3>
                <p className="text-sm text-gray-600">{source.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SAMPLING AND PARTICIPATION */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Sampling and Participation</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed space-y-4">
             <p>The State of Kashmir Crafts assessment is primarily an <strong>open, purposive, and participatory</strong> process rather than a strictly randomized statistical survey.</p>
             <p><strong>Open Public Participation:</strong> Any willing stakeholder can submit evidence or complete a survey. While this maximizes inclusivity, it does not guarantee a statistically representative sample of the total artisan population.</p>
             <p><strong>Purposive Stakeholder Outreach:</strong> To mitigate self-selection bias, the assessment actively targets critical but underrepresented groups, specific geographic craft clusters, and specialized craft sectors ensuring a holistic view.</p>
             <p><strong>Expert Selection &amp; Institutional Invitations:</strong> Key institutions and recognized experts are formally invited to provide structured submissions.</p>
             <p><em>Limitation note: Generalizations about the entire population must be made cautiously when relying purely on self-selected respondents. Administrative data is used to weight and contextualize these findings.</em></p>
          </div>
        </div>
      </section>

      {/* 8. DATA COLLECTION INSTRUMENTS & 9. EVIDENCE ADMISSIBILITY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h2 className="text-3xl font-black text-brand-dark mb-6">Data Collection Instruments</h2>
               <ul className="space-y-4 text-gray-700">
                 <li className="flex gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> <span><strong>Questionnaires:</strong> Digital forms using skip-logic to ensure relevance.</span></li>
                 <li className="flex gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> <span><strong>Interview Protocols:</strong> Standardized topic guides for semi-structured interviews.</span></li>
                 <li className="flex gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> <span><strong>Evidence Submission Forms:</strong> Secure portals requiring metadata (date, provenance) and consent.</span></li>
                 <li className="flex gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> <span><strong>Hearing Templates:</strong> Agendas and recording protocols for public sessions.</span></li>
               </ul>
            </div>
            <div>
               <h2 className="text-3xl font-black text-brand-dark mb-6">Evidence Admissibility</h2>
               <p className="text-gray-600 mb-4">Evidence is evaluated against strict criteria before inclusion:</p>
               <div className="flex flex-wrap gap-2 mb-6">
                 {["Relevance", "Provenance", "Credibility", "Completeness", "Internal Consistency", "Corroboration"].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{tag}</span>
                 ))}
               </div>
               <p className="text-sm font-bold text-gray-800 mb-2">Evidence Outcomes:</p>
               <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                 <div>• Accepted</div>
                 <div>• Accepted with Qualification</div>
                 <div>• Requires Clarification</div>
                 <div>• Restricted (Confidential)</div>
                 <div>• Rejected / Duplicate</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TRIANGULATION & 11. VALIDATION */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
               <h2 className="text-3xl font-black text-brand-dark mb-6">Triangulation and Analysis</h2>
               <p className="text-gray-700 leading-relaxed mb-4">
                 Evidence from one group (e.g., Exporters) is systematically cross-referenced against evidence from others (e.g., Artisans) and hard data (e.g., Export Statistics).
               </p>
               <p className="text-gray-700 leading-relaxed mb-4">
                 When agreement exists, findings are strengthened. When disagreement occurs (e.g., contested claims over wages), the assessment documents the divergence explicitly rather than forcing artificial consensus. Data gaps and outliers are noted as areas requiring future research.
               </p>
               <p className="text-gray-500 text-sm italic">Note: The assessment does not claim statistical significance unless rigorous statistical methods support the specific dataset.</p>
            </div>
            <div className="bg-brand-primary text-white p-8 rounded-3xl shadow-lg">
               <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><FaCheckDouble /> Validation Methodology</h2>
               <p className="text-white/90 mb-6 leading-relaxed">
                 Draft findings are published prior to finalization. Eligible stakeholders are invited during a designated validation period to:
               </p>
               <ul className="space-y-2 mb-6 text-sm">
                 <li>• Review findings for accuracy</li>
                 <li>• Correct factual errors</li>
                 <li>• Submit additional missing evidence</li>
                 <li>• Challenge interpretations</li>
                 <li>• Improve draft recommendations</li>
               </ul>
               <p className="text-xs text-white/70">Revisions are logged and published, ensuring transparency in how the final report was formed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12, 13, 14. EXPERT, ETHICS, QA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-brand-dark mb-4 flex items-center gap-2"><FaUserGraduate data-ui-icon  className=""/> Expert Review</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Independent subject-matter experts review the validated findings for methodological soundness, objectivity, and analytical rigor. Reviewers must disclose conflicts of interest. Their recommendations improve the final document, though ultimate editorial authority remains with the assessment convener.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-brand-dark mb-4 flex items-center gap-2"><FaShieldAlt data-ui-icon  className=""/> Ethics &amp; Data Protection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Participation is strictly voluntary with informed consent. Participants may choose to remain anonymous in public reports. Restricted evidence (e.g., sensitive financial data) is aggregated and anonymized. Strict access controls govern raw data retention and handling.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-brand-dark mb-4 flex items-center gap-2"><FaCogs data-ui-icon  className=""/> Quality Assurance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Internal QA involves rigorous instrument review, duplicate detection, data cleaning scripts, and manual coding reviews for qualitative data. A strict version control system and audit log track all changes from draft to final publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. LIMITATIONS & 16. COMPARABILITY */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h2 className="text-3xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaExclamationTriangle className="text-red-500" /> Limitations</h2>
               <p className="text-gray-600 mb-4">Honesty regarding limitations is central to methodological integrity. Known constraints include:</p>
               <ul className="space-y-2 text-sm text-gray-700">
                 <li>• Open participation may not be statistically representative.</li>
                 <li>• Uneven geographic participation across remote clusters.</li>
                 <li>• Reliance on self-reported financial and production information.</li>
                 <li>• Incomplete or conflicting administrative baseline data.</li>
                 <li>• Non-response bias from highly marginalized artisan groups.</li>
               </ul>
            </div>
            <div>
               <h2 className="text-3xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaChartLine data-ui-icon  className="" /> Annual Comparability</h2>
               <p className="text-gray-600 leading-relaxed mb-4">
                 To function as a permanent institutional record, future assessments will preserve comparability through:
               </p>
               <ul className="space-y-2 text-sm text-gray-700">
                 <li>• Stable core indicators tracked year-on-year.</li>
                 <li>• Consistent operational definitions of crafts and sectors.</li>
                 <li>• Repeated baseline questions in surveys.</li>
                 <li>• Strict version control and documentation of any methodology changes.</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 17. GOVERNANCE & 18. OFFICIAL DOC */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <h2 className="text-3xl font-black text-brand-dark mb-6">Methodology Governance</h2>
           <p className="text-gray-600 leading-relaxed mb-8">
             The Hamadan Craft Revival Foundation (KHCRF), as the institutional convener, owns and reviews the methodology. Proposed revisions are logged, publicly documented, and take effect only after formal approval. Public and expert comments on methodology improvement are continually considered to strengthen future iterations.
           </p>
           
           <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl inline-block text-left w-full max-w-2xl mx-auto shadow-sm">
             <h3 className="font-black text-xl text-brand-dark mb-6 border-b border-gray-200 pb-4">Official Methodology Document</h3>
             {officialDoc ? (
               <div className="space-y-3 text-sm text-gray-700">
                 <p><strong className="w-32 inline-block">Title:</strong> {officialDoc.title}</p>
                 <p><strong className="w-32 inline-block">Version:</strong> {officialDoc.version}</p>
                 <p><strong className="w-32 inline-block">Status:</strong> {officialDoc.status}</p>
                 <p><strong className="w-32 inline-block">Approval Date:</strong> {officialDoc.approvalDate}</p>
                 <p><strong className="w-32 inline-block">Effective Date:</strong> {officialDoc.effectiveDate}</p>
                 <p><strong className="w-32 inline-block">Authority:</strong> {officialDoc.authority}</p>
                 <div className="mt-6">
                   <a href={officialDoc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition">
                     <FaFilePdf /> Download Official Document
                   </a>
                 </div>
               </div>
             ) : (
               <div className="text-center text-gray-500 py-4">
                 <FaLock className="text-3xl text-gray-300 mx-auto mb-3" />
                 <p className="font-medium">The official methodology document is currently in preparation and will be published prior to data collection.</p>
               </div>
             )}
           </div>
        </div>
      </section>

      {/* 19. FINAL CTA */}
      <section className="py-24 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight text-white leading-tight">
            A Credible Assessment Requires Broad Participation
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl">
              Register as Stakeholder
            </Link>
            <Link href="/state-of-kashmir-crafts/participate" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl">
              Participate Online
            </Link>
            <Link href="/state-of-kashmir-crafts/evidence-repository" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all">
              Submit Evidence
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
