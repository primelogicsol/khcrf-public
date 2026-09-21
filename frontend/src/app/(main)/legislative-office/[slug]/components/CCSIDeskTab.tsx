"use client";

import {
  FaLandmark,
  FaCheckCircle,
  FaGlobe,
  FaShieldAlt,
  FaChartPie,
  FaUsers,
  FaHandshake,
  FaBriefcase,
  FaClipboardCheck,
  FaBullseye,
  FaChartLine,
  FaChevronDown,
  FaArrowRight,
} from "react-icons/fa";

export default function CCSIDeskTab({
  office,
  slug,
  router,
  openReferralSections,
  toggleReferralSection,
}: any) {
  return (
    <div className="animate-fadeIn p-4 md:p-8 space-y-8">
      <section className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* 1. Header Banner */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-4 text-yellow-500">
              <FaUsers className="text-3xl" />
              <span className="font-bold uppercase tracking-widest text-sm">
                CCSI Program
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6 leading-tight">
              KHCRF Constituency Craft & Stakeholder Intake (CCSI) Program
            </h2>

            <div className="space-y-6 mb-8">
              <p className="text-gray-300 md:text-lg leading-relaxed font-medium">
                The Constituency Craft & Stakeholder Intake (CCSI) Program is a
                structured ecosystem coordination initiative designed to
                organize, verify, and enable the handicraft community within a
                legislative constituency.
              </p>
              <p className="text-gray-300 md:text-lg leading-relaxed">
                The program operates under a formal MoU framework through which{" "}
                <strong className="text-white">
                  Hamadan Craft Revival Foundation
                </strong>{" "}
                connects global trade, institutional, and e-commerce ecosystems
                with the local craft community through structured referral,
                verification, and registry systems facilitated via the
                constituency office.
              </p>
              <div className="inline-block bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm tracking-wide uppercase backdrop-blur-sm shadow-md mt-2">
                This is institutional infrastructure designed for long-term
                ecosystem strengthening.
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Operational Authority
                </p>
                <p className="font-bold text-sm">
                  Hamadan Craft Revival Foundation
                </p>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                  Referral & Facilitation
                </p>
                <p className="font-bold text-sm text-brand-primary-light">
                  Local Constituency Office
                </p>
              </div>
            </div>
            <div className="mt-10 md:mt-12">
              <button
                onClick={() =>
                  router.push(`/legislative-office/${slug}/register`)
                }
                className="group bg-brand-primary text-white hover:bg-white hover:text-brand-primary font-black py-4 px-8 md:py-5 md:px-12 rounded-full shadow-2xl shadow-brand-primary/20 hover:shadow-white/20 transition-all hover:-translate-y-1 text-base md:text-lg uppercase tracking-widest flex items-center justify-center gap-3 border border-transparent hover:border-brand-primary"
              >
                Register Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 p-8 opacity-10 pointer-events-none">
            <FaUsers size={200} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold font-playfair mb-8 flex items-center gap-3">
              <FaChartLine data-ui-icon  className="" /> Ecosystem Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaCheckCircle data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Formal Identity
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Documented recognition & traceable classification.
                </p>
              </div>
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaUsers data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Cluster Strengthening
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Structured mapping & collective visibility.
                </p>
              </div>
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaGlobe data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Multi-Channel Access
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Eligibility for B2B, B2C, institutional, and export.
                </p>
              </div>
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaChartPie data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Policy Visibility
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Data-driven advocacy and GI protection.
                </p>
              </div>
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaShieldAlt data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Transparency
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  MoU-based role separation and audit logging.
                </p>
              </div>
              <div className="bg-white border border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-brand-primary transition-all group">
                <h4 className="flex items-center gap-2 text-[15px] font-bold text-gray-900 mb-2">
                  <FaBriefcase data-ui-icon  className=" group-hover:scale-110 transition-transform" />{" "}
                  Long-Term Resilience
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Reduced informal dependency; global readiness.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 text-[15px] font-bold text-center text-brand-primary leading-relaxed bg-brand-primary/5 p-4 rounded-xl">
              &quot;Scattered participation becomes verified, documented, and
              globally connected integration.&quot;
            </div>
          </section>

          {/* 6. Interaction Model & Clarifications */}
          <div className="space-y-8 h-full">
            <section className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-3xl p-8 md:p-10 border border-brand-primary/50 text-white relative overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold font-playfair mb-6 flex items-center gap-3 text-white border-b border-brand-primary/30 pb-4">
                  <FaHandshake data-ui-icon  className="-light" />{" "}
                  Interaction Model
                </h3>

                <p className="text-[15px] text-gray-300 mb-8 leading-relaxed font-medium">
                  The CCSI ecosystem supports structured interaction between:{" "}
                  <strong className="text-white">
                    Artisans (A), Businesses (B), Institutions (I), Consumers
                    (C), and Government (G)
                  </strong>
                  .
                </p>

                {/* Enhanced Interaction Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Artisan Initiated */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-brand-primary/20 flex items-center justify-center">
                        A
                      </span>
                      Artisan-Led
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "A2B (Business)",
                        "A2C (Consumer)",
                        "A2I (Institution)",
                        "A2G (Gov)",
                      ].map((ch) => (
                        <span
                          key={ch}
                          className="bg-black/30 border border-white/10 text-xs text-gray-300 px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Business Initiated */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-brand-primary/20 flex items-center justify-center">
                        B
                      </span>
                      Business-Led
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "B2B (Business)",
                        "B2C (Consumer)",
                        "B2I (Institution)",
                        "B2G (Gov)",
                      ].map((ch) => (
                        <span
                          key={ch}
                          className="bg-black/30 border border-white/10 text-xs text-gray-300 px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Institution/Gov Initiated */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors sm:col-span-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-brand-primary/20 flex items-center justify-center">
                        I/G
                      </span>
                      Institutional & Gov-Led
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "I2A (Artisan)",
                        "I2B (Business)",
                        "G2A (Artisan)",
                        "G2B (Business)",
                      ].map((ch) => (
                        <span
                          key={ch}
                          className="bg-black/30 border border-white/10 text-xs text-gray-300 px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl border border-white/5 shadow-inner mt-auto backdrop-blur-sm">
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    This framework supports structured trade, certification,
                    compliance, retail, education, and governance integration
                    across the constituency craft ecosystem.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400 space-y-2">
                    <p>
                      <strong className="text-white">
                        Hamadan Craft Revival Foundation
                      </strong>{" "}
                      {" & "}
                      <strong className="text-white">
                        Local Constituency Office
                      </strong>{" "}
                      facilitate these traceable, compliant, and export-ready
                      pathways.
                    </p>
                    <p>
                      The{" "}
                      <strong className="text-brand-primary-light">
                        Legislative Office
                      </strong>{" "}
                      functions as the strategic oversight and validation
                      partner.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* TAB CONTENT: PROCESS */}
        {/* 2. How the Program Works (4 Steps) */}
        <section>
          <h3 className="text-3xl font-bold font-playfair text-center mb-12">
            How the Program Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Registration with Official Referral Code",
                desc: "Stakeholders submit the intake form & enter the official Constituency Referral Code issued by the local constituency representative for structured jurisdiction mapping & monitoring",
                gradient: "from-brand-primary to-brand-dark",
                icon: FaClipboardCheck,
              },
              {
                step: "02",
                title: "Verification & Cluster Mapping",
                desc: "KHCRF reviews submitted documentation, validates craft classification, confirms GI alignment where applicable, and maps stakeholders to relevant constituency craft clusters.",
                gradient: "from-brand-primary to-brand-dark",
                icon: FaUsers,
              },
              {
                step: "03",
                title: "Registry Entry & Documentation",
                desc: "Approved stakeholders are formally recorded in the structured constituency craft registry with verified classification and documented ecosystem inclusion.",
                gradient: "from-brand-primary to-brand-dark",
                icon: FaCheckCircle,
              },
              {
                step: "04",
                title: "Ecosystem & Trade Alignment",
                desc: "Verified stakeholders may be aligned with multi-channel trade, institutional, and global e-commerce pathways based on eligibility and independent platform criteria.",
                gradient: "from-brand-primary to-brand-dark",
                icon: FaGlobe,
              },
            ].map((s: any, i: number) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${s.gradient} p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform text-white border border-brand-primary-light/20`}
              >
                <div className="text-8xl font-black text-white/5 absolute -top-4 -right-4 group-hover:scale-110 group-hover:text-white/10 transition-all font-playfair">
                  {s.step}
                </div>
                <div className="relative z-10">
                  <div data-ui-icon className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm -light flex items-center justify-center font-bold mb-6 shadow-md border border-white/20">
                    <s.icon className="text-xl" />
                  </div>
                  <h4 className="font-bold text-lg mb-4 text-white leading-tight">
                    {s.title}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-gray-500 font-medium">
            *Registration does not guarantee marketplace listing or contracts.
          </div>
        </section>

        <div className="max-w-4xl mx-auto">
          <section className="bg-brand-primary/5 rounded-3xl p-8 md:p-10 border border-brand-primary/10">
            <h3 className="text-2xl font-bold font-playfair mb-8 flex items-center gap-3 text-gray-900 border-b border-brand-primary/10 pb-4">
              <FaBullseye data-ui-icon  className="" /> Referral &
              Monitoring
            </h3>

            <h4 className="font-bold text-gray-900 mb-4 text-lg">
              Purpose of the Constituency Referral Code
            </h4>
            <p className="text-[15px] text-gray-700 mb-8 leading-relaxed">
              The Referral Code serves multiple institutional objectives:
            </p>

            <div className="space-y-4 mb-10">
              {/* Section 1 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleReferralSection("sec1")}
                  className="w-full text-left p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <h5 className="font-bold text-brand-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-sm font-black group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      1
                    </span>
                    Jurisdiction Authentication
                  </h5>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${openReferralSections["sec1"] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openReferralSections["sec1"] ? "max-h-[500px]" : "max-h-0"}`}
                >
                  <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    Verifies that the applicant is registering under the correct
                    legislative constituency and prevents cross-jurisdictional
                    duplication or misclassification.
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleReferralSection("sec2")}
                  className="w-full text-left p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <h5 className="font-bold text-brand-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-sm font-black group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      2
                    </span>
                    Structured Constituency Mapping
                  </h5>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${openReferralSections["sec2"] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openReferralSections["sec2"] ? "max-h-[500px]" : "max-h-0"}`}
                >
                  <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    Links the stakeholder profile to the designated constituency
                    database, ensuring accurate cluster distribution tracking
                    and regional documentation.
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleReferralSection("sec3")}
                  className="w-full text-left p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <h5 className="font-bold text-brand-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-sm font-black group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      3
                    </span>
                    Dashboard-Level Monitoring
                  </h5>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${openReferralSections["sec3"] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${openReferralSections["sec3"] ? "max-h-[2000px]" : "max-h-0"}`}
                >
                  <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100 space-y-5">
                    <p className="font-medium text-gray-800">
                      The Referral Code activates governance-level monitoring
                      through the Legislative Artisan Desk dashboard.
                      <br />
                      The constituency representative may monitor:
                    </p>

                    <ul className="space-y-4 text-sm text-gray-700">
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-1">
                          • Total Registered Stakeholders
                        </strong>
                        Verified artisans, cooperatives, businesses, and
                        institutions within the constituency.
                      </li>
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-1">
                          • Stakeholder Category Distribution
                        </strong>
                        Classification-based breakdown across stakeholder types.
                      </li>
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-1">
                          • Cluster-Level Growth Indicators
                        </strong>
                        Registration density and participation patterns across
                        mapped craft clusters.
                      </li>
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-1">
                          • GI-Linked Participation Rates
                        </strong>
                        Number and percentage of stakeholders aligned with
                        recognized GI frameworks.
                      </li>
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-2">
                          • Global E-Commerce & Trade Integration Metrics
                        </strong>
                        Number of verified stakeholders integrated into
                        structured global trade ecosystems, including:
                        <ul className="mt-2 space-y-1 ml-4 list-[circle] text-gray-600">
                          <li>
                            Profiles activated on approved global e-commerce
                            platforms
                          </li>
                          <li>
                            Stakeholders onboarded into B2B trade networks
                          </li>
                          <li>Export-ready participants</li>
                          <li>Institutional trade or certification linkages</li>
                        </ul>
                      </li>
                      <li className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <strong className="text-gray-900 block mb-1">
                          • Registration & Integration Trends Over Time
                        </strong>
                        Periodic growth tracking across registry inclusion and
                        global alignment.
                      </li>
                    </ul>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm">
                      <p className="font-bold text-blue-900 mb-1">
                        Monitoring is statistical, governance-oriented, and
                        ecosystem-focused.
                      </p>
                      <p className="text-blue-800">
                        It does not expose confidential commercial data, pricing
                        structures, revenue details, or contractual terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleReferralSection("sec4")}
                  className="w-full text-left p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <h5 className="font-bold text-brand-primary flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-sm font-black group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      4
                    </span>
                    Audit & Traceability Control
                  </h5>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${openReferralSections["sec4"] ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openReferralSections["sec4"] ? "max-h-[500px]" : "max-h-0"}`}
                >
                  <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    <p className="mb-3">Each Referral Code is:</p>
                    <ul className="flex flex-wrap gap-2 mb-4">
                      {[
                        "Officially issued",
                        "Digitally recorded",
                        "System-logged",
                        "Audit-traceable",
                      ].map((tag: any) => (
                        <li
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p>
                      This ensures transparency, prevents misuse, and maintains
                      institutional accountability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h5 className="font-playfair font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-gray-400" /> Governance
                    Safeguards
                  </h5>
                  <p className="text-sm text-gray-600 mb-4">
                    The Referral Code mechanism:
                  </p>
                  <ul className="space-y-3 text-sm text-gray-700 font-medium mb-6">
                    <li className="flex gap-2">
                      <span className="text-red-500 font-bold">✖</span> Does not
                      guarantee approval
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 font-bold">✖</span> Does not
                      override verification standards
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 font-bold">✖</span> Does not
                      provide preferential treatment
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 font-bold">✖</span> Does not
                      authorize financial or commercial commitments
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    All applications remain subject to independent operational
                    verification conducted by{" "}
                    <strong className="text-gray-900">
                      Hamadan Craft Revival Foundation
                    </strong>{" "}
                    under the MoU framework.
                  </p>
                </div>

                <div className="bg-brand-dark p-6 rounded-2xl shadow-lg border border-brand-primary text-white flex flex-col justify-center">
                  <h5 className="font-playfair font-bold text-xl border-b border-white/10 pb-3 mb-4 text-brand-primary-light">
                    Institutional Integrity Principle
                  </h5>
                  <p className="text-[15px] text-gray-300 mb-4 font-medium">
                    The Referral Code ensures that:
                  </p>
                  <div className="space-y-4 text-white font-bold leading-snug">
                    <p className="border-l-2 border-[var(--card-left-accent)] pl-4 py-1">
                      Craft participation is documented responsibly,
                    </p>
                    <p className="border-l-2 border-[var(--card-left-accent)] pl-4 py-1">
                      Monitored transparently,
                    </p>
                    <p className="border-l-2 border-[var(--card-left-accent)] pl-4 py-1">
                      And measured not only by registration —<br />
                      <span className="text-brand-primary-light font-black mt-2 inline-block">
                        But by structured progression into verified global
                        integration.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* TAB CONTENT: GOVERNANCE & ELIGIBILITY */}
        {/* 3. Governance Structure */}
        <section className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold font-playfair mb-12 text-center text-white">
              Governance Structure
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur-md">
                <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <FaBriefcase /> Operational Authority
                </h4>
                <h5 className="text-2xl font-bold mb-4 text-white font-playfair">
                  Hamadan Craft Revival Foundation
                </h5>
                <p className="text-sm text-gray-300 mb-8 font-medium">
                  KHCRF serves as the operational and technical anchor of the
                  program. Responsible for:
                </p>
                <ul className="space-y-4 text-sm text-gray-200">
                  {[
                    "Stakeholder intake and verification",
                    "Craft classification and cluster mapping",
                    "GI alignment validation",
                    "Registry maintenance",
                    "Digital dashboard infrastructure",
                    "Integration across all craft bussines channels",
                    "Export readiness alignment",
                    "Data governance and audit compliance",
                    "Performance Analytics & Reporting",
                    "Platform Due Diligence",
                    "System Integrity Controls",
                    "Data Governance & Compliance",
                  ].map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur-md">
                <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                  <FaLandmark /> Constituency Role
                </h4>
                <h5 className="text-2xl font-bold mb-4 text-white font-playfair">
                  Constituency Representative
                </h5>
                <p className="text-sm text-gray-300 mb-8 font-medium">
                  The constituency representative functions as a referral and
                  oversight authority. Responsibilities include:
                </p>
                <ul className="space-y-4 text-sm text-gray-200 mb-10">
                  {[
                    "Referring eligible stakeholders into the intake system",
                    "Facilitating structured cluster engagement",
                    "Supporting governance-level visibility of the craft ecosystem",
                    "Using verified data for policy advocacy",
                  ].map((item: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-6">
                  <h6 className="text-red-200 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-red-400" /> The public office
                    does not:
                  </h6>
                  <ul className="space-y-3 text-sm text-red-200/80 font-medium">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-black">✖</span>{" "}
                      Negotiate commercial contracts
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-black">✖</span> Handle
                      financial transactions
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-black">✖</span>{" "}
                      Guarantee marketplace placement
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-black">✖</span>{" "}
                      Override verification outcomes
                    </li>
                  </ul>
                  <p className="text-xs text-red-300 mt-5 pt-4 border-t border-red-900/50 font-medium">
                    This ensures neutrality and institutional integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 4. Who Can Register & Eligibility */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold font-playfair mb-8 flex items-center gap-3">
                <FaUsers data-ui-icon  className="" /> Who Can Register?
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    title: "Individual artisans",
                    color:
                      "from-brand-primary/10 to-brand-primary/5 text-brand-dark border-brand-primary/20",
                  },
                  {
                    title: "Cooperatives & SHGs",
                    color:
                      "from-brand-primary/10 to-brand-primary/5 text-brand-dark border-brand-primary/20",
                  },
                  {
                    title: "Craft businesses",
                    color:
                      "from-brand-primary/10 to-brand-primary/5 text-brand-dark border-brand-primary/20",
                  },
                  {
                    title: "Training institutions",
                    color:
                      "from-brand-primary/10 to-brand-primary/5 text-brand-dark border-brand-primary/20",
                  },
                ].map((item: any) => (
                  <div
                    key={item.title}
                    className={`bg-gradient-to-br ${item.color} border flex items-center justify-center text-center p-4 rounded-xl font-bold text-sm shadow-sm hover:border-brand-primary hover:-translate-y-1 transition-all`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium bg-gray-50 py-3 px-2 rounded-lg">
                Applicants must operate within the officially defined
                constituency jurisdiction. Registration requires active
                engagement in recognized handicraft activity. A valid
                Constituency Referral Code must be entered during intake
                submission. Applicants must provide verifiable identity and
                category documentation. Accurate craft classification and
                cluster location details are required. Verification is conducted
                independently under KHCRF registry standards.
              </p>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-200 h-full">
              <h3 className="text-2xl font-bold font-playfair mb-8 flex items-center gap-3">
                <FaClipboardCheck data-ui-icon  className="" /> Eligibility
                Requirements
              </h3>
              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full shrink-0 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <span className="text-[15px] font-medium text-gray-800">
                    Engage in recognized handicraft activity
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full shrink-0 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <span className="text-[15px] font-medium text-gray-800">
                    Provide valid identity documentation
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full shrink-0 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <span className="text-[15px] font-medium text-gray-800">
                    Submit accurate production details
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full shrink-0 mt-0.5">
                    <FaCheckCircle />
                  </div>
                  <span className="text-[15px] font-medium text-gray-800">
                    Declare GI authorization where applicable
                  </span>
                </li>
              </ul>
              <div className="text-sm text-red-800 font-medium bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3">
                <FaShieldAlt className="text-red-500 shrink-0 text-lg" />
                Incomplete or inaccurate submissions may delay verification.
              </div>
            </section>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <section className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold font-playfair mb-8 text-gray-900">
              Important Clarifications
            </h3>
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                    <FaCheckCircle />
                  </div>
                  <h4 className="text-sm font-bold text-green-800 uppercase tracking-widest">
                    Registration Enables
                  </h4>
                </div>
                <ul className="space-y-4 text-[15px] text-gray-700 font-medium">
                  <li className="flex gap-3">
                    <span className="text-green-500">•</span> Structured
                    participation
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-500">•</span> Registry
                    recognition
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-500">•</span> Monitoring and
                    policy visibility
                  </li>
                </ul>
              </div>

              <div className="hidden sm:block w-px bg-gray-200"></div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl font-black">
                    ✖
                  </div>
                  <h4 className="text-sm font-bold text-red-800 uppercase tracking-widest">
                    Does Not Guarantee
                  </h4>
                </div>
                <ul className="space-y-4 text-[15px] text-gray-700 font-medium">
                  <li className="flex gap-3">
                    <span className="text-red-500">•</span> Marketplace listing
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500">•</span> Sales contracts or
                    funding
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500">•</span> Commercial
                    commitments by the public office
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <FaShieldAlt className="text-gray-400 text-2xl shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900 text-sm mb-1 uppercase tracking-wide">
                    Data Privacy & Compliance
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Data is strictly for registry and ecosystem coordination,
                    protected under structured governance standards with audit
                    logs. No unauthorized commercial exploitation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Call to Action */}
        <div className="flex flex-col items-center text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold font-playfair mb-6 text-gray-900">
            Ready to Join the CCSI Program?
          </h3>
          <button
            onClick={() => router.push(`/legislative-office/${slug}/register`)}
            className="group bg-brand-primary text-white hover:bg-brand-dark font-black py-4 px-8 md:py-5 md:px-12 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-base md:text-lg uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Register Now
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
