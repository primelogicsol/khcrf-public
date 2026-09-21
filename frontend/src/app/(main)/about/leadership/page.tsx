"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutLeadershipHeroFallback } from "@/config/heroFallbacks";
import FeatureCard from "@/components/common/FeatureCard";
import { FaUserTie, FaCheckCircle } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/api";
import LeadershipCTA from "@/components/membership/LeadershipCTA";
import ScrollReveal from "@/components/ScrollReveal";

const DEFAULT_PROFILES = [
  {
    title: "Jasif Khan - Founder & Chairman",
    description:
      "Oversees strategic direction, governance, partnerships, and international advocacy for preserving and promoting Kashmir’s traditional handicrafts globally.",
    icon: "FaUserTie",
  },
  {
    title: "Dr. Iqbal Khan - CEO",
    description:
      "Manages operations, strategic growth, partnerships, and compliance, ensuring organizational goals and project implementation are effectively executed.",
    icon: "FaUserTie",
  },
  {
    title: "Iftekhar Wani - Policy & Research",
    description:
      "Leads policy development, research initiatives, and advocacy efforts, collaborating with academic and governmental institutions to support artisans.",
    icon: "FaUserTie",
  },
  {
    title: "Nusrat Jan - Business Support",
    description:
      "Oversees business development programs, helping artisans build sustainable businesses through resources & entrepreneurship initiatives.",
    icon: "FaUserTie",
  },
  {
    title: "Adv. Omar Lone - Legal Affairs",
    description:
      "Ensures compliance with regulations, intellectual property protection, and legal support, managing all contracts and risk mitigation processes.",
    icon: "FaUserTie",
  },
  {
    title: "Sheeba Atiya - Grants & Partnerships",
    description:
      "Leads grant acquisition, donor relationships, and fundraising efforts, ensuring financial accountability and managing external partnerships.",
    icon: "FaUserTie",
  },
  {
    title: "Tariq Mir - Finance",
    description:
      "Manages financial operations, budgeting, and auditing, ensuring transparency, resource allocation, and financial health for all foundation projects.",
    icon: "FaUserTie",
  },
  {
    title: "Ayesha Bhat - Communications",
    description:
      "Oversees public relations, media outreach, and digital communications, promoting the foundation’s mission through strategic community engagement efforts.",
    icon: "FaUserTie",
  },
  {
    title: "Majid Qureshi - Programs & Projects",
    description:
      "Coordinates program implementation and project execution, ensuring alignment with organizational goals, timelines, and budgetary constraints.",
    icon: "FaUserTie",
  },
  {
    title: "Tariq Bhat - Artisanal Education",
    description:
      "Manages educational programs for artisans, offering training opportunities to enhance skills, craftsmanship, and innovation within the craft sector.",
    icon: "FaUserTie",
  },
  {
    title: "Mutaharra Deva - Sustainability",
    description:
      "Oversees sustainability initiatives, eco-friendly practices, and resource management, reducing environmental impact in the craft production process.",
    icon: "FaUserTie",
  },
  {
    title: "Farooq Ahmed - Technology Head",
    description:
      "Leads digital transformation initiatives, overseeing technical infrastructure and implementing innovative solutions to modernize craft sector operations.",
    icon: "FaUserTie",
  },
];

export default function LeadershipPage() {
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("leadership-profiles");
        if (data && data.content) {
          setProfiles(data.content);
        }
      } catch {
        // API unavailable — keep DEFAULT_PROFILES
      }
    };
    fetchContent();
  }, []);

  const getIconComponent = (iconName: string) => {
    const Icon = (FaIcons as any)[iconName];
    return Icon || FaUserTie;
  };

  return (
    <main>
      <UniversalEditorialHero pageKey="leadership" fallbackConfig={aboutLeadershipHeroFallback as any} />

      {/* Introduction Section */}
      <section className="py-20 bg-white ">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
            <ScrollReveal delay={200}>
              <div className="relative h-full min-h-[400px] rounded-4xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/images/about_hcrf_bnr/2.png"
                  alt="KHCRF Apprenticeship"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </ScrollReveal>
            <div className="text-left">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Visionaries Driving Craft Revival
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                KHCRF Leadership
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Under this leadership, KHCRF is not just a foundation; it’s a
                movement. A movement that champions Kashmiri heritage,
                revitalizes the craft sector, and secures its place in the
                global economy. We are building a future where every artisan’s
                story is part of a larger global narrative—one that speaks of
                excellence, authenticity, and resilience.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                KHCRF leadership is rooted in strategic clarity and cultural
                responsibility. The foundation operates at the intersection of
                heritage preservation and economic modernization, ensuring that
                Kashmiri craft traditions are not merely sustained but
                strengthened for future generations. This leadership model
                prioritizes artisan dignity, transparent systems, and measurable
                growth across clusters.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Rather than approaching craft revival as charity, KHCRF
                approaches it as infrastructure development. That means
                structured training programs, market integration strategies,
                quality control frameworks, and international positioning. Every
                intervention is designed to enhance long-term stability, improve
                income security, and build institutional trust within the
                artisan ecosystem.
              </p>

              <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg hover:shadow-md transition-shadow">
                <p className="text-gray-800 font-medium italic">
                  "Our leaders embody the perfect fusion of innovation and
                  tradition, using their expertise to propel Kashmiri artisans
                  into the next era of craft excellence, where authenticity,
                  sustainability, and global competitiveness are the
                  cornerstones of success."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-left md:text-center mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Leaders
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Meet KHCRF Leadership
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              The leadership at Hamdan Craft Revival Foundation is dedicated to
              preserving the cultural heritage of Kashmir's crafts. With a focus
              on sustainable practices, social impact, and strategic growth, the
              team guides the foundation towards achieving its mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile, index) => (
              <FeatureCard
                key={index}
                icon={getIconComponent(profile.icon)}
                title={profile.title}
                description={profile.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join our Board of Visionaries */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-left md:text-center mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Shaping the Future of Kashmir’s Handicraft Industry
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Join our Board of Visionaries
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[1.01] duration-500">
              <img
                src="/assets/images/generated/board-members-dark-kashmiri.jpg"
                alt="Kashmiri Board Members in Dramatic Lighting"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <ul className="space-y-8">
                {[
                  {
                    title: "International Trade & Global Markets",
                    text: "Expertise in fostering trade agreements",
                  },
                  {
                    title: "Cultural Heritage & Preservation",
                    text: "Expertise in promoting traditional Kashmiri crafts",
                  },
                  {
                    title: "Sustainability & Innovation",
                    text: "Passion for eco-friendly production and innovation",
                  },
                  {
                    title: "Policy Development & Advocacy",
                    text: "Crafting policies for industry standards and fair trade",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="shrink-0 mt-1 transition-transform group-hover:scale-110 duration-300">
                      <FaCheckCircle data-ui-icon  className=" text-xl" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Responsibilities of Board Members */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-left md:text-center mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Hamadan Craft Revival Foundation
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Responsibilities of Board Members
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <ul className="space-y-8">
                {[
                  {
                    title: "Strategic Oversight",
                    text: "Guide the foundation’s long-term goals.",
                  },
                  {
                    title: "Global Networking",
                    text: "Build impactful partnerships.",
                  },
                  {
                    title: "Philanthropic Leadership",
                    text: "Secure resources for key initiatives.",
                  },
                  {
                    title: "Ethical Stewardship",
                    text: "Ensure sustainability and cultural integrity.",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="shrink-0 mt-1 transition-transform group-hover:scale-110 duration-300">
                      <FaCheckCircle data-ui-icon  className=" text-xl" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg order-1 lg:order-2">
              <img
                src="/assets/images/generated/board-responsibilities-dark-kashmiri.jpg"
                alt="Board Members Responsibilities in Dramatic Lighting"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <LeadershipCTA />
    </main>
  );
}
