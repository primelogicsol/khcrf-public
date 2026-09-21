"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutComplianceHeroFallback } from "@/config/heroFallbacks";
import {
  FaBalanceScale,
  FaBuilding,
  FaGlobeAmericas,
  FaHandshake,
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";
import Image from "next/image";
import * as FaIcons from "react-icons/fa";
import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/api";

const DEFAULT_ITEMS = [
  {
    title: "Section 8 Compliance",
    description:
      "KHCRF is incorporated under Section 8 of the Companies Act, 2013. Its income and resources are applied toward its registered objects, and no dividend is distributed to its members.",
    icon: "FaBalanceScale",
  },
  {
    title: "U.S. 501(c)(3) Status",
    description:
      "KHCRF is working toward U.S. 501(c)(3) recognition. Until recognition is granted, U.S. donations should not be represented as assuredly tax-deductible.",
    icon: "FaBuilding",
  },
  {
    title: "FCRA Status",
    description:
      "KHCRF is working toward compliance under the Foreign Contribution (Regulation) Act. Foreign contributions will be accepted only after valid FCRA registration or specific prior permission is obtained.",
    icon: "FaGlobeAmericas",
  },
  {
    title: "Non-Partisan Independence",
    description:
      "KHCRF is an independent, non-partisan public-interest institution. It engages in lawful research and policy advocacy without supporting or opposing any political party or electoral candidate.",
    icon: "FaHandshake",
  },
];

const COMPLIANCE_FRAMEWORK = [
  {
    id: "01",
    title: "Corporate Governance",
    description: "KHCRF is governed through a framework of documented authority, statutory compliance, board oversight and institutional accountability. Our governance structure is designed to ensure that every decision supports the Foundation's registered objects, protects the public interest and upholds the highest standards of integrity, transparency and responsible stewardship.",
    items: [
      "Corporate identity",
      "Board governance",
      "Registered objects",
      "Institutional independence",
      "Governance policies",
      "Decision-making framework",
      "Statutory compliance"
    ]
  },
  {
    id: "02",
    title: "Financial Stewardship & Accountability",
    description: "Every financial resource entrusted to KHCRF is managed responsibly, transparently and exclusively in support of its registered public-benefit objectives. We are committed to sound financial governance, prudent stewardship and accountable use of institutional resources.",
    items: [
      "Mission-based use of funds",
      "No private benefit",
      "Financial controls",
      "Audited accounts",
      "Procurement integrity",
      "Internal accountability",
      "Responsible donor stewardship"
    ]
  },
  {
    id: "03",
    title: "Regulatory Compliance",
    description: "KHCRF is committed to maintaining compliance with all applicable statutory, regulatory and reporting obligations. Our legal registrations, approvals and governance obligations form the regulatory foundation that supports our institutional operations and public accountability.",
    items: [
      "Companies Act, 2013 & Section 8",
      "Income Tax: 12AB & 80G",
      "FCRA Registration / Prior Permission",
      "CSR-1 Registration & Eligibility",
      "Prospective U.S. 501(c)(3) Status"
    ]
  },
  {
    id: "04",
    title: "Ethics & Institutional Integrity",
    description: "Integrity is fundamental to KHCRF's governance. Our institutional policies promote independence, ethical conduct, professional responsibility, transparency and respect for the public trust placed in our work.",
    items: [
      "Independence",
      "Non-partisanship",
      "Conflict of Interest",
      "Anti-corruption",
      "Anti-fraud",
      "Research integrity",
      "Professional conduct",
      "Confidentiality"
    ]
  },
  {
    id: "05",
    title: "Research, Policy & Public Interest",
    description: "KHCRF advances evidence-based research and public-interest policy engagement to strengthen Kashmir's craft sector. Our work remains independent, non-partisan and guided by objective analysis, institutional integrity and the long-term interests of artisans, heritage and sustainable development.",
    items: [
      "Evidence-based research",
      "Public policy analysis",
      "Legislative engagement",
      "Consultation",
      "Public-interest advocacy",
      "Institutional neutrality"
    ]
  },
  {
    id: "06",
    title: "Transparency & Public Disclosure",
    description: "Transparency strengthens institutional credibility and public confidence. KHCRF is committed to providing timely, accurate and meaningful disclosures concerning its governance, finances, policies, programmes and regulatory obligations, subject to applicable legal and privacy requirements.",
    items: [
      "Annual reports",
      "Financial statements",
      "Governance documents",
      "Policies",
      "Major institutional updates",
      "Programme methodologies",
      "Public notices",
      "Regulatory changes"
    ]
  },
  {
    id: "07",
    title: "Grants, Partnerships & Funding Integrity",
    description: "KHCRF establishes partnerships and administers grants through transparent, objective and accountable processes. Every collaboration is evaluated to safeguard institutional independence, public confidence and alignment with the Foundation's mission and values.",
    items: [
      "Donor independence",
      "Grant governance",
      "Partnership due diligence",
      "Ethical fundraising",
      "Restricted funds",
      "Sponsorship transparency",
      "International collaborations"
    ]
  },
  {
    id: "08",
    title: "Data Protection & Privacy",
    description: "KHCRF respects the privacy of artisans, donors, applicants, partners and members of the public. We are committed to the responsible collection, secure management and lawful use of personal information entrusted to the Foundation.",
    items: [
      "Personal information",
      "Donor privacy",
      "Applicant confidentiality",
      "Secure storage",
      "Responsible data use",
      "Digital security"
    ]
  },
  {
    id: "09",
    title: "Equality, Inclusion & Safeguarding",
    description: "KHCRF is committed to fostering an inclusive, respectful and safe environment in which every individual is treated with dignity, fairness and equal opportunity, consistent with applicable law and institutional policy.",
    items: [
      "Equal opportunity",
      "Non-discrimination",
      "Respectful workplace",
      "Safe participation",
      "Cultural dignity",
      "Protection of vulnerable participants",
      "Accessibility"
    ]
  },
  {
    id: "10",
    title: "Public Accountability",
    description: "Public trust requires accountability. KHCRF maintains mechanisms for reporting concerns, reviewing complaints, addressing grievances and continually strengthening its governance, policies and institutional practices through regular evaluation and improvement.",
    items: [
      "Complaints mechanism",
      "Whistleblower protection",
      "Appeals",
      "Reporting misconduct",
      "Corrective actions",
      "Continuous improvement",
      "Periodic policy review"
    ]
  }
];

export default function CompliancePage() {
  const items = DEFAULT_ITEMS;

  const getIconComponent = (iconName: string) => {
    const Icon = (FaIcons as any)[iconName];
    return Icon || FaIcons.FaBalanceScale;
  };

  return (
    <main>
      <UniversalEditorialHero pageKey="compliance" fallbackConfig={aboutComplianceHeroFallback as any} />

      {/* Organizational Compliance Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Upholding Laws, Ensuring Integrity
              </span>
              <h2 className="text-4xl font-black text-gray-900 mb-6 font-manrope">
                Organizational Compliance
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We ensure all our operations meet legal, ethical, and regulatory
                standards, fostering transparency, accountability, and
                integrity. This safeguards stakeholder interests, supports
                sustainable growth, and strengthens trust within the artisan
                community and global partners.
              </p>
            </div>
            {/* We could add an image here if we had one, for now keeping it text focused as per legacy layout which had text on left and carousel on right/bottom */}
          </div>

          {/* Compliance Cards - Replaces Legacy Carousel for better usability */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <FeatureCard
                key={index}
                title={item.title}
                description={item.description}
                icon={getIconComponent(item.icon)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Governance Framework Detailed Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-8 font-manrope">
              Compliance & Governance Framework
            </h2>
            <div className="mt-8 w-full border-l-4 border-[var(--card-left-accent)] bg-gray-50 px-8 py-6">
              <p className="max-w-none text-lg leading-8 text-gray-700">
                The following sections provide a detailed overview of KHCRF&apos;s legal status, regulatory commitments, governance framework, financial accountability, institutional policies, and public transparency. Together, they demonstrate how KHCRF upholds the standards expected of a Section 8 public-interest institution while maintaining independence, integrity, and accountability in every aspect of its work.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {COMPLIANCE_FRAMEWORK.map((section, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary text-white font-black text-xl font-mono shadow-sm">
                    {section.id}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight flex-1">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">
                  {section.description}
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <FaIcons.FaCheckCircle data-ui-icon className="/60 mt-1 flex-shrink-0 text-sm" />
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section - High Contrast */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Building Trust Through Transparency
              </span>
              <h3 className="text-3xl font-black text-gray-900 mb-6">
                Transparency is our foundation, ensuring integrity,
                accountability, and trust in our every action.
              </h3>
              <p className="text-gray-600 leading-relaxed">
                At the heart of our operations, the Hamdan Craft Revival
                Foundation (KHCRF) stands unwavering, committed to honesty and
                openness in every aspect of our business.
              </p>
            </div>
            <div className="lg:col-span-8">
              {/* Image Grid for Transparency - Using original URLs as requested */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <TransparencyImage
                  src="/assets/images/compliance/1.png"
                  alt="Transparency Image 1"
                />
                <TransparencyImage
                  src="/assets/images/compliance/2.png"
                  alt="Transparency Image 2"
                />
                <TransparencyImage
                  src="/assets/images/compliance/3.png"
                  alt="Transparency Image 3"
                />
                <TransparencyImage
                  src="/assets/images/compliance/4.png"
                  alt="Transparency Image 4"
                />
                <TransparencyImage
                  src="/assets/images/compliance/5.png"
                  alt="Transparency Image 5"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TransparencyImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="aspect-square relative rounded-xl overflow-hidden shadow-lg bg-slate-900 p-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
      {/* Inner container for image overflow handling if we want zoom inside the frame */}
      <div className="w-full h-full relative rounded-lg overflow-hidden border border-white/10">
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>
  );
}
