"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CountUpAnimation from "@/components/common/CountUpAnimation";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaArrowRight,
  FaRocket,
  FaHeart,
  FaBolt,
  FaChartLine,
  FaUsers,
  FaLaptopHouse,
  FaHandshake,
  FaUserGraduate,
  FaCheckCircle,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";
import { HiUserGroup, HiOutlineOfficeBuilding } from "react-icons/hi";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutCareerHeroFallback } from "@/config/heroFallbacks";
import { careerApi } from "@/lib/api";
import { jobs as staticJobs, Job } from "@/data/jobs";
import ScrollReveal from "@/components/ScrollReveal";

export default function Career() {
  const [jobList, setJobList] = useState<Job[]>(staticJobs); // Default to static
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const apiJobs = await careerApi.getJobs();
        if (apiJobs && apiJobs.length > 0) {
          // Map API data to UI format
          const mappedJobs: Job[] = apiJobs.map((job: any) => ({
            id: job.id,
            slug: job.slug,
            jobCode: job.jobCode,
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            salaryRange: job.salaryRange || "Competitive",
            applicantsCount: job._count?.applications || 0, // Assuming count might be added later, else 0
            status: job.status === "OPEN" ? "Open" : "Closed",
            description: job.description,
            responsibilities: Array.isArray(job.responsibilities)
              ? job.responsibilities
              : [],
            requirements: Array.isArray(job.requirements)
              ? job.requirements
              : [],
            postedDate: new Date(job.postedAt).toISOString().split("T")[0],
          }));
          setJobList(mappedJobs);
        } else {
          console.log("No dynamic jobs found, using static fallback.");
        }
      } catch (error) {
        console.error("Failed to fetch jobs, using static fallback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs for stats and "Past Opportunities"
  const openJobs = jobList.filter((job) => job.status === "Open");
  const closedJobs = jobList.filter((job) => job.status === "Closed");

  return (
    <main className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <UniversalEditorialHero pageKey="career" fallbackConfig={aboutCareerHeroFallback as any} />
      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
            <div className="text-left">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Build a Legacy, Not Just a Career
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                Careers at KHCRF
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At KHCRF, we don't just offer jobs; we offer the opportunity to
                be part of a historic movement. Working here means dedicating
                your skills to the revival of Kashmir’s tangible heritage,
                impacting thousands of artisan lives, and structuring an entire
                industry for the modern era.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We are looking for passionate innovators, policy researchers,
                and spirited changemakers who believe that economic development
                and cultural preservation go hand in hand. Our team operates at
                the intersection of tradition and technology, requiring agility,
                empathy, and strategic thinking.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Your work will directly contribute to sustainable ecosystems,
                from drafting policy frameworks to implementing digital supply
                chains. If you are ready to challenge the status quo and drive
                measurable social impact, KHCRF is the place where your
                professional growth meets purpose.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We value professionals who combine analytical thinking with
                cultural sensitivity. KHCRF careers demand measurable
                outcomes—income growth for artisans, improved production
                standards, verified authenticity frameworks, and responsible
                global positioning of Kashmiri craft.
              </p>
              <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                <p className="text-gray-800 font-medium italic">
                  "Join a team where your daily tasks contribute to a
                  centuries-old legacy. We are building the future of
                  craftsmanship, one innovation at a time."
                </p>
              </div>
            </div>
            <ScrollReveal delay={200}>
              <div className="relative h-full min-h-[400px] rounded-4xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/images/about_hcrf_bnr/3.png"
                  alt="KHCRF Careers"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 1. Original Hero Section (Moved Down) */}
      <section className="relative bg-white py-24 overflow-hidden text-gray-900 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-10 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
            Join Our Mission to Preserve Heritage
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-gray-900">
            Build Your Career at <br />{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-secondary">
              Hamadan Craft Revival Foundation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Join a mission-driven team preserving 700+ years of Kashmir's craft
            heritage while empowering 16,000+ artisans through cutting-edge
            technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              href="/about/career/open-positions"
              className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-bold transition-all shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2 group"
            >
              View Open Roles{" "}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about/career/talent-pool"
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <FaUsers /> Join Job Bank
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transform hover:scale-105 transition-transform duration-300">
              <CountUpAnimation
                target={openJobs.length}
                className="block text-3xl font-bold text-brand-primary mb-1"
              />
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                Open Positions
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transform hover:scale-105 transition-transform duration-300">
              <CountUpAnimation
                target={closedJobs.length + 5}
                className="block text-3xl font-bold text-brand-primary mb-1"
              />
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                Past Opportunities
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transform hover:scale-105 transition-transform duration-300">
              <CountUpAnimation
                target="16K+"
                className="block text-3xl font-bold text-brand-primary mb-1"
              />
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                Artisans Empowered
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 transform hover:scale-105 transition-transform duration-300">
              <CountUpAnimation
                target="14+"
                className="block text-3xl font-bold text-brand-primary mb-1"
              />
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                GI Crafts Protected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Work With Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-xs bg-brand-primary/5 py-1 px-3 rounded-full">
              Why KHCRF
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
              Why Work With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FaHeart,
                title: "Mission-Driven Work",
                desc: "Join us in preserving Kashmir's 700-year-old craft heritage while empowering thousands of artisans through technology and innovation.",
              },
              {
                icon: FaChartLine,
                title: "Impact at Scale",
                desc: "Your work directly impacts 16,000+ artisans and helps protect authentic crafts worth millions in economic value.",
              },
              {
                icon: FaBolt,
                title: "Innovation & Technology",
                desc: "Work with cutting-edge technologies including blockchain, AI, and big data to solve real-world problems in heritage preservation.",
              },
              {
                icon: FaUserGraduate,
                title: "Growth Opportunities",
                desc: "Be part of a fast-growing startup where you can wear multiple hats, learn rapidly, and grow your career exponentially.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-6 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-brand-primary rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-primary/20">
                    <item.icon />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Culture Section */}
      <section className="relative bg-[#020617] text-white py-24 overflow-hidden">
        

        <div className="container mx-auto px-4 md:px-10 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-xs bg-brand-primary/20 border border-brand-primary/30 py-1 px-3 rounded-full">
              Our Culture
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-3">
              Life at Hamadan Craft Revival Foundation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Remote-First Culture",
                text: "Work from anywhere with flexible hours. We believe in outcomes, not clock-watching.",
              },
              {
                title: "Learning & Development",
                text: "Regular workshops, conference sponsorships, and learning budgets to help you grow professionally.",
              },
              {
                title: "Collaborative Environment",
                text: "Small, focused teams working on meaningful problems. Your voice matters and your ideas are heard.",
              },
              {
                title: "Work-Life Balance",
                text: "Generous time off, mental health support, and a culture that respects personal time.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10 flex items-start gap-4 hover:bg-white/10 transition-colors"
              >
                <span data-editorial-accent-bg className="mt-1.5 w-2 h-2 rounded-full  flex-shrink-0"></span>
                <div>
                  <h4 className="font-bold text-lg text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Past Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-500 text-xl shadow-inner">
              <FaBriefcase />
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              Past Opportunities
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              These positions are no longer accepting applications, but showcase
              the types of roles we hire for.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {closedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-xl border border-gray-200 opacity-70 hover:opacity-100 transition-opacity mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-gray-200">
                      Closed
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {job.jobCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {job.applicantsCount} applications received
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Talent Community */}
      <section
        id="talent-community"
        className="py-24 relative overflow-hidden universal-hero"
      >
        <div className="absolute inset-0 bg-linear-to-r from-black to-brand-dark"></div>
        

        <div className="container mx-auto px-4 md:px-10 relative z-10 text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 backdrop-blur-md">
            <FaUsers data-ui-icon  className="text-3xl " />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">
            Join Our Talent Community
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-16 text-lg">
            Don't see the perfect role? We're always building our talent
            network. Submit your profile and be first in line when opportunities
            match your expertise.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {[
              {
                icon: FaCheckCircle,
                title: "Stay Connected",
                desc: "Get notified when roles matching your profile open up.",
              },
              {
                icon: FaHandshake,
                title: "Join the Mission",
                desc: "Be part of our network of passionate professionals.",
              },
              {
                icon: FaStar,
                title: "Priority Access",
                desc: "First to know about new openings, and programs",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <div data-ui-icon className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4  text-xl">
                  <item.icon />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about/career/talent-pool"
            className="inline-flex items-center px-10 py-5 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-lg shadow-xl shadow-brand-primary/20 transition-all transform hover:-translate-y-1"
          >
            Join Talent Pool <FaArrowRight className="inline ml-2" />
          </Link>
          <p className="mt-4 text-xs text-white/40">
            No commitment required • takes 2 minutes • Always free
          </p>
        </div>
      </section>

      {/* 8. Join Network CTA */}
      <section className="bg-linear-to-r from-brand-secondary to-brand-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-10 text-center text-white relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 text-white/80 relative flex items-center justify-center">
            <HiUserGroup className="text-5xl" />
            <span className="absolute top-0 right-0 -mr-2 text-xl text-white font-bold">
              +
            </span>
          </div>
          <h2 className="text-3xl font-black mb-4">Join Our Network</h2>
          <p className="max-w-3xl mx-auto text-white/90 text-lg mb-10">
            Are you an institution, development body, or market enabler
            committed to preserving craft heritage? Partner with us to make a
            lasting impact.
          </p>
          <Link
            href="/about/partner-network/join"
            className="inline-flex items-center px-8 py-4 bg-white text-brand-primary font-bold rounded-lg transition-colors hover:bg-gray-100 shadow-lg"
          >
            Apply for Partnership{" "}
            <HiOutlineOfficeBuilding className="ml-2 text-xl" />
          </Link>
        </div>
      </section>
    </main>
  );
}

// Icon helper
function FaStar(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 576 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
    </svg>
  );
}
