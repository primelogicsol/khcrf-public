"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutApprenticeshipHeroFallback } from "@/config/heroFallbacks";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import {
  FaHandshake,
  FaUserFriends,
  FaLightbulb,
  FaGlobeAmericas,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaGift,
  FaCalendarAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { apprenticeshipApi } from "@/lib/api";

interface Opening {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  duration?: string;
  stipend?: string;
  status: string;
}

export default function Apprenticeship() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const data = await apprenticeshipApi.getOpenings();
        // Filter only OPEN status openings for public display
        const activeOpenings = Array.isArray(data)
          ? data.filter((op: any) => op.status === "OPEN")
          : [];
        setOpenings(activeOpenings);
      } catch (error) {
        console.error("Failed to fetch openings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <UniversalEditorialHero pageKey="apprenticeship" fallbackConfig={aboutApprenticeshipHeroFallback as any} />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <ScrollReveal>
              <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                Program Structure
              </h5>
              <h2 className="text-4xl font-black text-brand-dark mb-6">
                KHCRF Apprenticeship Program
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-6">
                The KHCRF Apprenticeship Program offers a comprehensive training
                platform for individuals interested in key support roles within
                the Kashmir handicraft industry. This program includes hands-on
                experience in areas such as Packaging Design, Logistics,
                Marketing & Digital Strategy, Design & Product Development, Web
                Development, App Development, Storytelling, Content Development,
                Research, and Writing. The goal is to equip future professionals
                with the skills necessary to support, innovate, and grow the
                handicraft sector.
              </p>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-6">
                Our immersive curriculum emphasizes practical skill-building for
                dedicated learners seeking to impact the broader ecosystem of
                the regional Kashmiri craft sector. This initiative provides
                specialized training in technical fields like Supply Chain
                Management, E-commerce, Visual Merchandising, Brand Identity,
                Software Engineering, UI/UX Design, Narrative Craft, Media
                Production, Market Analysis, and Technical Documentation. We aim
                to empower the next generation of leaders with the tools
                required to sustain.
              </p>
              <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                <p className="text-gray-800 font-medium italic">
                  "Join a team where your daily tasks contribute to a
                  centuries-old legacy. We are building the future of
                  craftsmanship, one innovation at a time."
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative h-full min-h-[400px] rounded-4xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/images/about_hcrf_bnr/1.png"
                  alt="KHCRF Apprenticeship"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Why Join KHCRF’s? */}
          <section className="py-24 bg-gray-50 -mx-4 md:-mx-10 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-left md:text-center mb-16">
                <ScrollReveal>
                  <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                    Apprenticeship Program
                  </h5>
                  <h2 className="text-4xl font-black text-brand-dark mb-6">
                    Why Join KHCRF’s?
                  </h2>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
                    Our mission is to offer practical, evidence-based solutions
                    and alternatives that not only address the current
                    challenges in the Kashmir Handicraft Industry but also
                    capitalize on future opportunities.
                  </p>
                </ScrollReveal>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: FaHandshake,
                    title: "Hands-On Experience",
                    text: "Collaborate with industry leaders to gain hands-on experience in business operations and strategic planning.",
                  },
                  {
                    icon: FaUserFriends,
                    title: "Mentorship",
                    text: "Receive personalized guidance from seasoned mentors focusing on your professional growth.",
                  },
                  {
                    icon: FaLightbulb,
                    title: "Skill Development",
                    text: "Enhance your expertise through specialized training designed to accelerate growth in key areas.",
                  },
                  {
                    icon: FaGlobeAmericas,
                    title: "Cultural Immersion",
                    text: "Immerse yourself in rich cultural experiences, gaining unique insights into heritage and traditions.",
                  },
                ].map((item, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group h-full hover:-translate-y-1">
                      <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors duration-300">
                        <item.icon className="text-2xl text-brand-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        {item.text}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Gul Zamrooda Memorial Apprenticeship */}
          <section className="py-24 bg-brand-secondary/5 -mx-4 md:-mx-10 px-4 md:px-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <ScrollReveal>
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg shadow-brand-secondary/20">
                  <span className="text-3xl">🕊️</span>
                </div>
                <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                  In Loving Memory
                </h5>
                <h2 className="text-3xl md:text-5xl font-playfair font-black text-brand-dark mb-8">
                  Gul Zamrooda Memorial Apprenticeship
                </h2>
                <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                  <p className="mb-6">
                    The Gul Zamrooda Memorial Apprenticeship is established in
                    honor of <strong>Gulam Mohammad Khan</strong> and{" "}
                    <strong>Zamrooda Banday</strong>, the late parents of the
                    Founder of KHCRF. Their lives were grounded in integrity,
                    perseverance, and quiet service—values that continue to
                    shape the foundation’s long-term vision for cultural and
                    economic renewal.
                  </p>
                  <p className="mb-8 font-medium text-brand-dark/80 italic text-xl">
                    "This memorial initiative embodies a simple principle:
                    heritage must be actively transmitted, not passively
                    remembered."
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="grid md:grid-cols-2 gap-8 text-left mt-12 mb-12">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-secondary/10">
                    <h4 className="font-bold text-brand-dark text-lg mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-brand-secondary rounded-full"></span>
                      Commitment to Continuity
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      This program reflects a living commitment to generational
                      continuity. It is not simply a training initiative, but a
                      structured pathway for preserving skill, discipline, and
                      ethical craftsmanship within the Kashmiri artisan
                      ecosystem.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-secondary/10">
                    <h4 className="font-bold text-brand-dark text-lg mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                      Modern Economic Participation
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      The apprenticeship model is designed to protect
                      traditional knowledge while preparing artisans for modern
                      economic participation. Apprentices are trained not only
                      in technique, but in discipline, consistency, and
                      professional responsibility.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-left">
                  <h3 className="text-2xl font-black text-brand-dark mb-6 text-center">
                    Program Benefits
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      "Direct mentorship under master craftsmen",
                      "Structured, hands-on skill development",
                      "Access to tools and raw materials",
                      "Stipend-supported apprenticeship placements",
                      "Exposure to quality benchmarks",
                      "Certification and professional recognition",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span data-editorial-accent-bg className="w-2 h-2 rounded-full "></span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-500 italic">
                      By honoring Gulam Mohammad Khan and Zamrooda Banday, the
                      foundation ensures that their legacy endures through
                      empowered artisans, strengthened craft clusters, and
                      renewed dignity in skilled labor.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Current Apprenticeship Openings */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto">
              <div className="text-left md:text-center mb-16">
                <ScrollReveal>
                  <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.3em] text-[11px] mb-4">
                    Craft Your Career with Purpose!
                  </h5>
                  <h2 className="text-4xl font-black text-brand-dark mb-6">
                    Current Apprenticeship Openings
                  </h2>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl mx-auto">
                    Join our team at the Hamdan Craft Revival Foundation and be
                    part of a movement dedicated to preserving and promoting
                    Kashmir’s rich craft heritage.
                  </p>
                </ScrollReveal>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">
                    Loading opportunities...
                  </p>
                </div>
              ) : openings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">
                    No active apprenticeship openings at the moment.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Please check back later or submit a general application.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {openings.map((job, index) => (
                    <ScrollReveal key={job.id} delay={index * 100}>
                      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-brand-primary/50 transition-all duration-300 group hover:-translate-y-1 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                            <div className="flex items-start space-x-4 mb-4 md:mb-0">
                              <div data-ui-icon className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center  text-xl shrink-0">
                                <FaBriefcase />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                                  {job.title}
                                </h3>
                                <span data-editorial-accent-text className="text-xs font-bold  uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-md mt-1 inline-block">
                                  {job.type.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <Link
                              href="/about/apprenticeship/apply"
                              className="px-6 py-2 bg-gray-50 text-brand-dark font-bold rounded-lg text-sm hover:bg-brand-primary hover:text-white transition-colors text-center shrink-0"
                            >
                              Apply Now
                            </Link>
                          </div>
                          <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                            {job.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t border-gray-100 pt-6 mt-auto">
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt data-ui-icon  className=" shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          {job.duration && (
                            <div className="flex items-center space-x-2">
                              <FaClock data-ui-icon  className=" shrink-0" />
                              <span>{job.duration}</span>
                            </div>
                          )}
                          {job.stipend && (
                            <div className="flex items-center space-x-2">
                              <FaGift data-ui-icon  className=" shrink-0" />
                              <span className="truncate">{job.stipend}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <FaCalendarAlt data-ui-icon  className=" shrink-0" />
                            <span>Open until filled</span>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Call to Action */}
          <div className="py-24 bg-brand-dark text-white relative overflow-hidden rounded-3xl">
            
            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl font-black mb-8">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Apply now for the KHCRF Apprenticeship Program and become a
                  guardian of our cultural legacy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/about/apprenticeship/apply"
                    className="px-10 py-5 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-primary transition-all shadow-xl"
                  >
                    Apply Now
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
