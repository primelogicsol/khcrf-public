"use client";

import {
  FaLandmark,
  FaCheckCircle,
  FaFileAlt,
  FaGlobe,
  FaInstagram,
  FaBalanceScale,
  FaShieldAlt,
  FaAward,
  FaChartPie,
  FaUsers,
  FaBriefcase,
  FaClipboardCheck,
  FaChartLine,
} from "react-icons/fa";

export default function CCEProgramTab({ setActiveTab }: any) {
  return (
    <div className="animate-fadeIn p-4 md:p-8 space-y-8">
      <section className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4 text-yellow-400">
              <FaAward className="text-3xl" />
              <span className="font-bold uppercase tracking-widest text-sm">
                Merit-Based Recognition
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6 leading-tight">
              Constituency Craft Excellence Program (CCE Program)
            </h2>
            <p className="text-gray-300 md:text-lg mb-8">
              A structured merit-based recognition initiative designed to honor
              outstanding contribution, integrity, innovation, and leadership
              within the verified constituency craft ecosystem.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Managed By
                </p>
                <p className="font-bold text-sm">
                  Local Constituency Representative
                </p>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Tech & Sponsorship Support
                </p>
                <p className="font-bold text-sm text-brand-primary-light">
                  Hamadan Craft Revival Foundation
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 p-8 opacity-10 pointer-events-none">
            <FaAward size={200} />
          </div>
        </div>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column (Left - 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-4 flex items-center gap-3">
                <FaBriefcase data-ui-icon  className="" /> About the Program
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  The program operates within the CCSI registry framework and
                  recognizes excellence across artisans, cooperatives,
                  businesses, and institutions within the constituency.
                </p>
                <p className="font-medium text-gray-800 border-l-4 border-[var(--card-left-accent)] pl-4 py-1">
                  It is governance-led, evaluation-driven, and data-supported.
                  This is not a nomination-based promotional event. It is a
                  structured excellence benchmark system.
                </p>
              </div>
            </div>

            {/* Award Categories */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6 flex items-center gap-3">
                <FaAward className="text-yellow-500" /> Award Categories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Craft Excellence",
                    desc: "Exceptional craftsmanship & quality consistency.",
                    icon: FaAward,
                  },
                  {
                    title: "GI Integrity & Authenticity",
                    desc: "Commitment to GI standards & cultural preservation.",
                    icon: FaShieldAlt,
                  },
                  {
                    title: "Innovation in Craft",
                    desc: "Design advancement, digital integration, or process innovation.",
                    icon: FaChartLine,
                  },
                  {
                    title: "Women Leadership",
                    desc: "Impactful leadership and community contribution.",
                    icon: FaUsers,
                  },
                  {
                    title: "Export & Market Readiness",
                    desc: "Structured growth and verified trade readiness.",
                    icon: FaGlobe,
                  },
                ].map((cat: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-4 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="bg-white p-2 rounded-lg text-brand-primary shadow-sm">
                      <cat.icon className="text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-gray-500">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p data-editorial-accent-text className="text-xs  mt-4 font-bold uppercase tracking-wide">
                * Additional categories may be introduced based on ecosystem
                development.
              </p>
            </div>

            {/* Evaluation & Institutional Structure */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6 flex items-center gap-3">
                <FaClipboardCheck data-ui-icon  className="" /> How Awards
                Are Evaluated
              </h3>
              <p className="text-sm text-gray-600 mb-6 font-medium">
                The evaluation framework follows a structured, transparent
                process.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Eligibility Screening
                    </h4>
                    <p className="text-xs text-gray-600">
                      Only verified stakeholders under the CCSI registry are
                      considered.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-t border-gray-100 pt-4">
                  <div className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Compliance & Documentation Review
                    </h4>
                    <p className="text-xs text-gray-600">
                      Assessment includes registry consistency, GI compliance,
                      cluster participation, and ethical records.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-t border-gray-100 pt-4">
                  <div className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Performance Indicators
                    </h4>
                    <p className="text-xs text-gray-600">
                      Evaluation considers craft quality, market participation,
                      institutional engagement, and sustainability.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start border-t border-gray-100 pt-4">
                  <div className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Review Panel Assessment
                    </h4>
                    <p className="text-xs text-gray-600">
                      A structured evaluation panel reviews shortlisted
                      candidates. Scoring is data-backed and documented. The
                      constituency representative participates in formal
                      recognition, not technical scoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Right - 1/3) */}
          <div className="space-y-6">
            {/* Institutional Structure */}
            <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 uppercase tracking-wide text-sm">
                <FaLandmark data-ui-icon  className="" /> Institutional
                Structure
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-brand-primary uppercase mb-1">
                    Program Authority
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    The Local Constituency Representative oversees and
                    administers the CCE Program. Ensures transparency and formal
                    recognition.
                  </p>
                </div>
                <div className="border-t border-brand-primary/10 pt-4">
                  <h4 className="text-xs font-bold text-brand-primary uppercase mb-1">
                    Technical Support
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    KHCRF provides verified registry data support, compliance
                    screening, validation, and documentation systems to ensure
                    neutrality.
                  </p>
                </div>
                <div className="border-t border-brand-primary/10 pt-4">
                  <h4 className="text-xs font-bold text-brand-primary uppercase mb-1">
                    Sponsorship Support
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    KHCRF provides logistical, coordination, and certification
                    support. Sponsorship does not influence scoring.
                  </p>
                </div>
              </div>
            </div>

            {/* Governance Safeguards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 uppercase tracking-wide text-sm">
                <FaBalanceScale className="text-blue-600" /> Governance
                Safeguards
              </h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex gap-2 items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />{" "}
                  Operates under published criteria
                </li>
                <li className="flex gap-2 items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />{" "}
                  Maintains documented scoring processes
                </li>
                <li className="flex gap-2 items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />{" "}
                  Separates sponsorship from evaluation
                </li>
                <li className="flex gap-2 items-start">
                  <FaCheckCircle className="text-green-500 mt-0.5 shrink-0" />{" "}
                  Ensures neutrality of public office
                </li>
              </ul>
              <div className="border-t border-gray-100 my-4" />
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex gap-2 items-start">
                  <span className="text-red-500 font-bold">×</span> Guarantee
                  commercial contracts
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-red-500 font-bold">×</span> Provide
                  automatic financial rewards
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-red-500 font-bold">×</span> Allow
                  political favoritism
                </li>
              </ul>
            </div>

            {/* CTA CTA */}
            <div className="bg-brand-primary text-white rounded-2xl p-6 text-center shadow-lg">
              <FaClipboardCheck className="text-3xl mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-bold font-playfair mb-2">
                Ready to Participate?
              </h3>
              <p className="text-xs text-brand-primary-light mb-6">
                Eligibility is automatic upon completing CCSI verification. We
                do not accept direct paid nominations.
              </p>
              <button
                onClick={() => {
                  window.location.href =
                    window.location.pathname + "/cce-application";
                }}
                className="w-full bg-white text-brand-primary font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-xl transition-all text-sm uppercase tracking-widest"
              >
                Apply for CCE Program
              </button>
              <p data-editorial-accent-text className="text-[10px] -light mt-4 uppercase tracking-wider font-medium">
                Only verified stakeholders may be considered
              </p>
            </div>
          </div>
        </div>

        {/* Hall of Excellence Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 p-6 md:p-8 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold font-playfair text-gray-900 flex items-center gap-3">
                <FaAward data-ui-icon  className="" /> Hall of Excellence
                Showcase
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Publicly showcasing recognized award recipients. Building
                long-term prestige for the constituency.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-[#0077b5] hover:border-[#0077b5] transition-colors">
                <FaGlobe />
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-black hover:border-black transition-colors">
                <FaInstagram />
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-brand-primary hover:border-brand-primary transition-colors">
                <FaFileAlt />
              </button>
            </div>
          </div>
          <div className="p-8 md:p-12 text-center text-gray-400">
            <FaChartPie className="text-5xl mx-auto mb-4 text-gray-200" />
            <p className="font-bold uppercase tracking-widest text-sm mb-2">
              Evaluations in Progress
            </p>
            <p className="text-xs">
              The inaugural Hall of Excellence will be published following the
              first structured evaluation cycle.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
