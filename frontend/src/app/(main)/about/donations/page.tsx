"use client";

import React, { useState } from "react";
import Image from "next/image";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutDonationsHeroFallback } from "@/config/heroFallbacks";
import FeatureCard from "@/components/common/FeatureCard";
import CTASection from "@/components/common/CTASection";
import {
  FaTools,
  FaWarehouse,
  FaLightbulb,
  FaCamera,
  FaFilm,
  FaSearch,
  FaBullhorn,
  FaBalanceScale,
  FaHandHoldingHeart,
  FaBolt,
} from "react-icons/fa";
import { HiUserGroup, HiBuildingOffice2 } from "react-icons/hi2";
import { BiWorld } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import DonationCTA from "@/components/membership/DonationCTA";
import DonationMainSection from "@/components/business/DonationMainSection";

// FAQ Item Component
// FAQ Item Component - Material Expansion Panel Style
const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`mb-4 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "shadow-lg bg-white ring-1 ring-brand-primary/10" : "shadow-sm bg-white hover:shadow-md border border-gray-100"}`}
    >
      <button
        className={`w-full text-left px-6 py-5 font-bold flex justify-between items-center transition-colors ${isOpen ? "bg-brand-primary/5 text-icon-on-light" : "bg-white text-gray-800"}`}
        onClick={onClick}
      >
        <span className="text-lg tracking-tight">{question}</span>
        <span
          className={`text-2xl transition-transform duration-300 ${isOpen ? "rotate-180 text-icon-on-light" : "text-gray-400"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const DonationsPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // Open first by default
  const [openInstFAQ, setOpenInstFAQ] = useState<number[]>([0, 4]); // Specific items open by default

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const toggleInstFAQ = (index: number) => {
    if (openInstFAQ.includes(index)) {
      setOpenInstFAQ(openInstFAQ.filter((i) => i !== index));
    } else {
      setOpenInstFAQ([...openInstFAQ, index]);
    }
  };

  const opportunities = [
    {
      icon: FaTools,
      title: "Tools & Equipment",
      description: "Essential resources artisans need to thrive.",
      link: "/about/memberships#membership-form",
    },
    {
      icon: FaWarehouse,
      title: "Enhanced Workshop Conditions",
      description: "Improving ventilation, lighting, waste mgt.",
      link: "/about/memberships#membership-form",
    },
    {
      icon: FaLightbulb,
      title: "Craft Innovation Support",
      description: "Funding fresh, creative artisan design projects.",
      link: "/about/memberships#membership-form",
    },
    {
      icon: FaCamera,
      title: "Product Photography",
      description: "Visuals capturing artisans' craft beauty.",
      link: "/about/memberships#membership-form",
    },
    {
      icon: FaFilm,
      title: "Craft Documentaries",
      description: "Sharing artisans’ journeys globally.",
      link: "/about/memberships#membership-form",
    },
    {
      icon: FaSearch,
      title: "Research & Development",
      description: "Researching design innovations.",
      link: "/about/memberships#membership-form",
    },
  ];

  const individualFAQs = [
    {
      question: "Personal Impact",
      answer:
        "Besides getting Tax deduction, each donation, no matter the size, contributes directly to specific relief efforts and projects.",
    },
    {
      question: "Flexibility",
      answer:
        "Individuals can choose to donate to specific causes or funds, providing them with the option to support the areas they are most passionate about.",
    },
    {
      question: "Emotional Connection",
      answer:
        "Many individual donors feel a personal connection to the cause, which can increase their level of commitment and involvement.",
    },
    {
      question: "Donor Recognition",
      answer:
        "Donors may receive acknowledgment for their contributions, such as thank-you notes, public recognition, or special events.",
    },
    {
      question: "Transparency & Accountability",
      answer:
        "Every contribution is tracked with care and responsibility. Donors can trust that funds are directed toward clearly defined programs and outcomes, aligned with the values of integrity and openness.",
    },
    {
      question: "Purpose-Driven Giving",
      answer:
        "Donations are not pooled blindly. Each contribution supports a specific intention—education, preservation, healing, or community service—allowing donors to give with clarity and meaning.",
    },
    {
      question: "Cultural Preservation Impact",
      answer:
        "Your support helps safeguard Kashmir’s spiritual heritage, traditional crafts, manuscripts, and oral traditions—ensuring they remain alive for future generations.",
    },
    {
      question: "Spiritual Ethics of Giving",
      answer:
        "Giving is viewed as a sacred act, grounded in humility and responsibility. Contributions are guided by ethical principles rather than publicity or prestige.",
    },
  ];

  const institutionalFAQs = [
    {
      question: "Large-scale impact",
      answer:
        "Institutional donors can provide significant financial resources, enabling larger projects or long-term programs.",
    },
    {
      question: "Strategic Goals",
      answer:
        "These donations are often part of a broader strategy to fulfill the donor organization’s social or environmental goals.",
    },
    {
      question: "Tax Benefits",
      answer:
        "Corporations and foundations can often receive tax incentives for charitable donations, encouraging them to give more generously.",
    },
    {
      question: "Partnerships",
      answer:
        "Institutional donations often come with opportunities for collaboration or joint projects with the recipients of the funds.",
    },
    {
      question: "Long-Term Program Alignment",
      answer:
        "Institutional contributions are aligned with clearly defined, long-term programs in education, cultural preservation, research, and community well-being, ensuring continuity rather than one-time impact.",
    },
    {
      question: "Structured Impact Framework",
      answer:
        "Projects supported through institutional giving follow documented objectives, milestones, and outcomes, enabling meaningful assessment of social, cultural, and educational impact.",
    },
    {
      question: "Governance & Compliance",
      answer:
        "All institutional donations are managed in accordance with applicable regulations, ethical standards, and internal governance frameworks, ensuring responsible stewardship of funds.",
    },
    {
      question: "Collaborative Program Design",
      answer:
        "Institutions may co-design initiatives with the Sufi Science Center USA, shaping programs that reflect shared values, cultural sensitivity, and mutual goals.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <UniversalEditorialHero pageKey="donations" fallbackConfig={aboutDonationsHeroFallback as any} />

      {/* Intro Section - Material Paper Style */}
      <section className="py-24 container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-8">
              <span data-ui-icon className=" text-sm font-bold uppercase tracking-widest shadow-sm bg-brand-primary/5 py-1 px-3 rounded-full inline-block mb-3">
                Your Donation
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 font-head tracking-tight leading-tight">
                A Lifeline for{" "}
                <span data-ui-icon className="">Kashmir’s Artisans</span>
              </h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
              When you donate to the artisans of Kashmir, your contribution goes
              far beyond a simple cash transaction—it becomes a lifeline of
              essential resources that help preserve traditional crafts and
              empower artisans to thrive in a modern world.
            </p>
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              With each donation, you’re not just offering financial assistance;
              you’re providing the tools, technology, and opportunities that
              artisans need to flourish.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("donate-now-btn")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mb-10 inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Donate Now
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-primary/5 border-l-4 border-[var(--card-left-accent)] transform hover:scale-[1.02] transition-transform duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaBolt data-ui-icon  className=" text-xl" />
                Action Over Words—Empower Artisans
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your contribution directly provides artisans with essential
                tools, improved workshop ventilation, better lighting, sponsored
                photography, videography projects, and digital portfolios.
              </p>
            </div>
          </div>
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl elevation-high group border-[12px] border-[var(--image-frame-color)]">
            
            <Image
              src="/assets/images/generated/lifeline-support-real.png"
              alt="Kashmiri Artisan with Modern Tools"
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Opportunities Section - Card Grid */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-grid-slate-50/[0.05] bg-[bottom_1px_center]"></div>
        <div className="container mx-auto px-4 md:px-10 relative z-10">
          <div className="text-center mb-20">
            <span data-ui-icon className=" font-bold uppercase tracking-widest text-sm bg-brand-primary/5 py-1 px-3 rounded-full">
              Donation Opportunities
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
              How You Can Help
            </h2>
            <div className="w-24 h-1 bg-brand-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((item, index) => (
              <div key={index} className={` h-full`}>
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  link={item.link}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Donations FAQ - Material Accordion */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <span data-editorial-accent-text className=" font-bold uppercase tracking-widest text-sm">
                KHCRF Policy Regulation
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                Individual Donations
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-loose">
                Individual donations are contributions made by private
                individuals, typically in the form of cash, goods, or services.
                These donations can range from small one-time gifts to larger
                recurring pledges.
              </p>
              <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 border-[12px] border-[var(--image-frame-color)]">
                <Image
                  src="/assets/images/generated/individual-donation-v3.png"
                  alt="Individual Donations"
                  fill
                  className="object-cover"
                />
                
              </div>
            </div>
            <div className="space-y-4">
              {individualFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onClick={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Donations FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="order-2 lg:order-1 space-y-4">
              {institutionalFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openInstFAQ.includes(index)}
                  onClick={() => toggleInstFAQ(index)}
                />
              ))}
            </div>
            <div className="order-1 lg:order-2 lg:sticky lg:top-32">
              <span data-editorial-accent-text className=" font-bold uppercase tracking-widest text-sm">
                KHCRF Policy Regulation
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-6">
                Institutional Donations
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-loose">
                Institutional donations come from organizations such as
                corporations, foundations, government agencies, or other formal
                entities. These donations are often much larger than individual
                contributions.
              </p>
              <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 border-[12px] border-[var(--image-frame-color)]">
                <Image
                  src="/assets/images/generated/institutional-donation-mou-closed.jpg"
                  alt="Institutional Donations MOU Signing with Closed Curtains"
                  fill
                  className="object-cover"
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Support Section - Material Dark Theme (Redesigned) */}
      <DonationMainSection />

      {/* Donation CTA Section */}
      <DonationCTA />

      {/* Impact Stats - Material Cards */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span data-editorial-accent-text className=" font-bold uppercase tracking-widest text-sm bg-white py-2 px-4 rounded-full shadow-sm">
              Our Impact Statements
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 tracking-tight">
              Every donation makes a direct, measurable difference.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg border-b-4 border-brand-secondary text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-secondary/20 transition-colors">
                <FaTools data-ui-icon  className="text-4xl " />
              </div>
              <p className="text-gray-900 font-bold text-xl">
                Provides Tools For Artisans
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg border-b-4 border-brand-primary text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-primary/20 transition-colors">
                <HiUserGroup data-ui-icon  className="text-4xl " />
              </div>
              <p className="text-gray-900 font-bold text-xl">
                Supports Craft Education Programs
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg border-b-4 border-brand-secondary text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-secondary/20 transition-colors">
                <HiBuildingOffice2 data-ui-icon  className="text-4xl " />
              </div>
              <p className="text-gray-900 font-bold text-xl">
                Policy Advocacy For Artisan Rights
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg border-b-4 border-brand-primary text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-primary/20 transition-colors">
                <BiWorld data-ui-icon  className="text-4xl " />
              </div>
              <p className="text-gray-900 font-bold text-xl">
                Fair Trade Certifications
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DonationsPage;
