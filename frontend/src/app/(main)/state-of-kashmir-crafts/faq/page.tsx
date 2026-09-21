"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  FaQuestionCircle, FaSearch, FaEnvelope, FaInfoCircle, 
  FaUsers, FaBuilding, FaBookOpen, FaMicrophone, 
  FaCheckDouble, FaFileAlt, FaUserGraduate, FaCamera, 
  FaWrench, FaChevronDown, FaTimes, FaFilePdf,
  FaFileWord,
  FaExternalLinkAlt
} from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { faqHeroFallback } from '@/config/heroFallbacks';

export default function FAQPage() {
  const [faqCategories, setFaqCategories] = useState<any[]>([]);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {
        const all = data.data || data;
        const mapItems = (kind: string) =>
          all.filter((d: any) => d.metadata?.kind === kind).map((d: any) => ({
            ...d.metadata,
            title: d.title,
            desc: d.summary || d.metadata.desc,
            slug: d.slug,
            id: d.id,
            icon: d.metadata.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
          }));

        setFaqCategories(mapItems('FAQCATEGORIES'));
        setQuickLinks(mapItems('QUICKLINKS'));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const faqs: Record<string, { q: string; a: string }[]> = {
    "About & Governance": [
      { q: "What is State of Kashmir Crafts?", a: "The State of Kashmir Crafts Assessment 2026–2027 is a flagship, independent annual assessment designed to create a comprehensive public record of Kashmir's artisan ecosystem. It serves as a transparent, evidence-based diagnostic of the current realities, challenges, and future priorities of the handicraft sector." },
      { q: "What is the Governance Framework?", a: "Our Governance Framework guarantees absolute independence, neutrality, and multi-stakeholder participation. It outlines the strict ethical standards, anti-bias protocols, and data protection policies we adhere to while conducting this assessment." },
      { q: "What is the Methodology?", a: "The assessment employs a rigorous, mixed-methods approach. It combines quantitative data collection through dynamic questionnaires with qualitative insights gathered from public hearings, site visits, and evidence submissions to form a holistic picture." },
      { q: "Who sits on the Advisory Council?", a: "The Advisory Council comprises distinguished domain experts, master artisans, seasoned policymakers, and academic researchers who provide strategic oversight, validate the methodology, and ensure the assessment remains unbiased." },
      { q: "What are Official Messages?", a: "Official Messages are formal communications, endorsements, and directives from key institutional stakeholders, government bodies, and international craft organisations that guide and support the assessment process." }
    ],
    "Participating Institutions": [
      { q: "Who are Participating Institutions?", a: "These are formal entities including government departments, trade bodies, academic universities, and non-governmental organisations that formally register to submit collective evidence and participate in hearings." },
      { q: "How do institutions contribute?", a: "Institutions contribute by providing official administrative data, policy context, historical records, and structured research that drastically enhances the macro-level accuracy of the final report." }
    ],
    "Stakeholder Registry": [
      { q: "What is the Stakeholder Registry?", a: "It is a central database of all participants—artisans, buyers, researchers, and institutions—who wish to contribute to the assessment. Registration ensures your voice is formally documented." },
      { q: "Why should I register?", a: "Registering integrates you into the consultation workflow. You will receive direct invitations to submit evidence, tailored questionnaires, and access to upcoming virtual public hearings." },
      { q: "Will my information be public?", a: "Your personal contact information remains strictly internal and protected. Your name and affiliation will only be publicly listed if you explicitly grant consent to be visibly associated with the assessment." }
    ],
    "Participate": [
      { q: "Who can participate?", a: "Participation is completely open to anyone connected to Kashmir's craft sector: artisans, manufacturers, exporters, retailers, online sellers, citizens, youth, researchers, and institutional representatives." },
      { q: "Is participation free?", a: "Yes, participation across all aspects of the State of Kashmir Crafts assessment is 100% free. There should be no financial barrier to contributing to the public record." },
      { q: "Can diaspora members participate?", a: "Yes, diaspora members play a crucial role in international market access and cultural preservation. The platform is entirely digital, enabling global participation." }
    ],
    "Consultation Tracker": [
      { q: "What is the Consultation Tracker?", a: "The Consultation Tracker is a real-time dashboard that transparently displays the progress of the assessment phases, showing ongoing public hearings, evidence submission deadlines, and upcoming validation rounds." }
    ],
    "Review & Findings": [
      { q: "What are Public Hearings?", a: "Public hearings are structured, moderated online sessions designed for stakeholders to present their views directly to the Review Panel, engage in cross-examination, and place their testimonies on the public record." },
      { q: "What is the Evidence Repository?", a: "It is a central, searchable archive of all submitted documentation, photographs, research papers, and data sets that form the irrefutable factual basis for the assessment's draft findings." },
      { q: "What are Draft Findings?", a: "Draft Findings are preliminary conclusions published for absolute transparency. They allow the public to aggressively review, correct, and validate our analysis before it becomes an official record." },
      { q: "What happens during the Validation Round?", a: "Any registered stakeholder can formally challenge a specific Draft Finding if they believe it is factually incorrect. Fact-based corrections are reviewed and incorporated." },
      { q: "What is the Expert Review?", a: "The Expert Review is the final stage where the Advisory Council and independent domain experts meticulously scrutinize the validated findings for logical consistency, accuracy, and sector impact before the final report is authored." }
    ],
    "Reports & Resources": [
      { q: "When will the Final Report be released?", a: "The comprehensive final report is released at the conclusion of the annual assessment cycle, offering deep insights, district-by-district breakdowns, and actionable policy recommendations." },
      { q: "What is the Reports Archive?", a: "A permanent historical archive of all past reports, evidence logs, and methodologies, ensuring that the evolution of the craft ecosystem is continuously tracked over the years." },
      { q: "What is the Media Center?", a: "The Media Center is a dedicated hub providing registered journalists and media partners with embargoed reports, high-resolution assets, press releases, and interview facilitation." },
      { q: "How does the Fellowship Programme work?", a: "The Fellowship Programme is a project-based opportunity for young professionals and researchers to actively work on data collection and analysis for the assessment. Fellows receive a stipend, official certificates, and author credits." },
      { q: "Can working professionals apply for the Fellowship?", a: "Yes, working professionals can apply, provided they can reliably manage the rigorous time commitment and output requirements for the duration of their project." }
    ],
    "Technical Support": [
      { q: "I cannot submit my form.", a: "Ensure all required fields (marked with an asterisk) are completely filled out. If the issue persists, clear your browser cache or contact our technical support desk." },
      { q: "I forgot my login details.", a: "Use the secure password reset function on the login page. A time-sensitive recovery link will be sent to your registered email address." }
    ]
  };

  // Client-side search filtering
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    const result: Record<string, { q: string; a: string }[]> = {};
    Object.entries(faqs).forEach(([category, questions]) => {
      const matched = questions.filter(
        item => item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query) || category.toLowerCase().includes(query)
      );
      if (matched.length > 0) {
        result[category] = matched;
      }
    });
    return result;
  }, [searchQuery]);

  const totalFilteredQuestions = Object.values(filteredFaqs).reduce((sum, qs) => sum + qs.length, 0);
  const totalQuestions = Object.values(faqs).reduce((sum, qs) => sum + qs.length, 0);

  // Static category icons for hardcoded FAQ categories
  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "About the Assessment": FaInfoCircle,
    "Participation": FaUsers,
    "Stakeholder Registry": FaCheckDouble,
    "Institutions": FaBuilding,
    "Evidence Submission": FaFileAlt,
    "Public Hearings": FaMicrophone,
    "Draft Findings & Validation": FaBookOpen,
    "Reports": FaFileAlt,
    "Fellowship Programme": FaUserGraduate,
    "Media & Communications": FaCamera,
    "Technical Support": FaWrench,
  };

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="faq" 
        fallbackConfig={faqHeroFallback as any} 
      />

      {/* 14. Search FAQ & 2. FAQ Categories */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4 max-w-2xl mx-auto mb-8">
              <FaSearch className="text-gray-400 text-xl ml-4" />
              <input
                type="text"
                placeholder="Search questions, keywords, or categories..."
                className="w-full py-3 bg-transparent outline-none text-gray-800 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
           </div>

           {searchQuery.trim() && (
             <p className="text-center text-sm font-bold text-gray-500 mb-6">
               Showing {totalFilteredQuestions} of {totalQuestions} questions matching &ldquo;{searchQuery}&rdquo;
               {totalFilteredQuestions === 0 && (
                 <span className="block mt-2 text-gray-400 font-medium">No matching questions found. Try a different search term or <button onClick={() => setSearchQuery('')} className="text-brand-primary hover:underline">clear the search</button>.</span>
               )}
             </p>
           )}
           
           {/* Static category quick-jump buttons */}
           <div className="flex flex-wrap justify-center gap-3">
              {Object.keys(faqs).map((cat, i) => {
                const IconComp = categoryIcons[cat] || FaQuestionCircle;
                return (
                  <Link key={i} href={`#cat-${i}`} className="bg-white px-5 py-3 rounded-[14px] border border-gray-200 shadow-sm text-sm font-bold text-gray-700 hover:border-brand-primary transition flex items-center gap-2">
                     <IconComp className="text-icon-on-light" /> {cat}
                  </Link>
                );
              })}
           </div>
        </div>
      </section>

      {/* 3-13. Accordion Questions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="space-y-16">
              {Object.entries(filteredFaqs).map(([category, questions], catIdx) => {
                const IconComp = categoryIcons[category] || FaQuestionCircle;
                // Find the original index for the anchor
                const originalIdx = Object.keys(faqs).indexOf(category);
                return (
                  <div key={catIdx} id={`cat-${originalIdx}`} className="scroll-mt-32">
                     <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <IconComp className="text-icon-on-light" />
                        {category}
                     </h2>
                     <div className="space-y-4">
                        {questions.map((item, qIdx: number) => (
                          <details key={qIdx} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden" open={!!searchQuery.trim()}>
                             <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-gray-800 hover:bg-gray-100 transition">
                                <span>{item.q}</span>
                                <span className="transition group-open:rotate-180">
                                  <FaChevronDown className="text-gray-400" />
                                </span>
                             </summary>
                             <div className="text-gray-600 font-medium p-5 pt-0 text-sm leading-relaxed border-t border-gray-100 mt-2">
                                <div className="pt-3">{item.a}</div>
                             </div>
                          </details>
                        ))}
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* 15. Contact Support */}
      <section id="support" className="py-20 universal-hero text-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-16">
              <div className="w-full lg:w-1/2">
                 <h2 className="text-4xl font-black mb-6">Contact Support</h2>
                 <p className="text-gray-300 leading-relaxed font-medium mb-8">
                   If you cannot find the answer to your question in the FAQ, our support team is ready to assist you. Please fill out the form, and we will get back to you shortly.
                 </p>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/20 shadow-lg">
                       <div className="bg-white/20 p-3 rounded-xl">
                           <FaEnvelope className="text-2xl text-white" />
                       </div>
                       <div>
                          <div className="font-bold text-white text-lg">Email Support</div>
                          <a href="mailto:support@khcrf.org" className="text-sm font-bold text-gray-200 hover:text-white hover:underline transition-colors mt-1 inline-block">support@khcrf.org</a>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="w-full lg:w-1/2 bg-white p-8 md:p-10 rounded-3xl shadow-xl text-brand-dark">
                 <h3 className="text-2xl font-black mb-6">Submit a Request</h3>
                 <form 
                   className="space-y-4"
                   onSubmit={(e) => e.preventDefault()}
                 >
                   <fieldset disabled aria-describedby="service-unavailable-message">
                     <div id="service-unavailable-message" className="bg-gray-100 p-4 rounded text-sm text-gray-500 mb-4 text-center">
                       This form is currently unavailable. Please use the email support option above.
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                         <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 opacity-50 cursor-not-allowed" />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                         <input type="email" className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 opacity-50 cursor-not-allowed" />
                       </div>
                   </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                       <input type="text" className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 opacity-50 cursor-not-allowed" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                       <select className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 opacity-50 cursor-not-allowed">
                          <option value="">Select Category</option>
                          <option value="Participation">Participation</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
                       <textarea className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 h-32 opacity-50 cursor-not-allowed"></textarea>
                     </div>
                     <button type="submit" className="w-full py-4 bg-gray-400 text-white font-black rounded-xl cursor-not-allowed mt-4">
                       Submit Request
                     </button>
                   </fieldset>
                 </form>
              </div>
           </div>
        </div>
      </section>

      {/* 16. Quick Links — only shown if API returns data */}
      {quickLinks.length > 0 && (
        <section className="py-20 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
             <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Quick Links</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {quickLinks.map((link: any, i: number) => (
                  <Link key={i} href={link.url || link.slug || '#'} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-brand-primary hover:shadow-md transition text-center flex flex-col items-center justify-center h-24">
                     <span className="font-bold text-sm text-gray-800">{link.title}</span>
                     <FaExternalLinkAlt className="text-gray-300 mt-2 text-xs" />
                  </Link>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* 17. Call to Action */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Still have questions?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#support"
                className="px-8 py-4 bg-white text-brand-dark font-black rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Contact Support
              </Link>
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-brand-dark text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Register as Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/participate"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Participate Online
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
