"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { businessSupportCertificationsHeroFallback } from "@/config/heroFallbacks";
import Link from "next/link";
import DeKoshurPartnerCTA from "@/components/DeKoshurPartnerCTA";
import {
  FaCheckCircle,
  FaGlobe,
  FaHandshake,
  FaLeaf,
  FaChartLine,
  FaAward,
  FaDesktop,
  FaSearchDollar,
  FaFileAlt,
  FaClipboardCheck,
  FaCertificate,
  FaFileContract,
  FaRocket,
  FaClipboardList,
  FaCreditCard,
  FaPaperPlane,
  FaCheckDouble,
  FaSync,
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";

export default function BusinessCertificationPage() {
  return (
    <main>
      <UniversalEditorialHero pageKey="certifications" fallbackConfig={businessSupportCertificationsHeroFallback as any} />

      {/* 1. Main Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]">
              <img
                src="/assets/images/generated/certification-visual.png"
                alt="Artisan holding certification"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Welcome to Hamadan Craft Revival Foundation
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                Empowering Kashmiri businesses with globally recognized
                certifications
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                KHCRF Certification Services assist Kashmiri handicraft
                businesses in obtaining globally recognized certifications.
                These certifications enhance market access, credibility, and
                promote sustainable, ethical practices, empowering businesses to
                thrive in international markets while maintaining craftsmanship
                standards.
              </p>
              <div className="bg-brand-secondary/5 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg">
                <p className="text-gray-800 font-medium italic">
                  "KHCRF Certification Services empowers Kashmiri handicraft
                  businesses by managing the entire certification process on
                  your behalf. From sustainability to fair trade, we identify
                  the right certifications to elevate your brand."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission / Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Elevate Your Business Standards
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Unlock Your Craft Industry Business Potential
            </h2>
            <p className="text-gray-600 text-lg">
              Unlock new growth and market opportunities through KHCRF’s Global
              Craft Industry Business Certification Program. Our certification
              services help elevate your craftsmanship to global standards,
              enhancing your credibility, expanding market access, and promoting
              sustainability and ethical practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaGlobe}
              title="Access Global Markets"
              description="Increase visibility across global markets, connect with global buyers, and open doors to new international opportunities."
            />
            <FeatureCard
              icon={FaHandshake}
              title="Connect with Buyers"
              description="Establish valuable connections with big buyers and retailers worldwide, partnering with top certification bodies globally."
            />
            <FeatureCard
              icon={FaCheckCircle}
              title="Build Consumer Trust"
              description="Build lasting trust with consumers by showcasing your verified quality and authenticity with certified products worldwide."
            />
            <FeatureCard
              icon={FaLeaf}
              title="Sustainable Practices"
              description="Demonstrate your commitment to sustainability and eco-friendly production methods, showing responsibility."
            />
            <FeatureCard
              icon={FaAward}
              title="Partner with Leaders"
              description="Partner with top certification bodies globally to validate your business standards and gain recognition."
            />
            <FeatureCard
              icon={FaChartLine}
              title="Showcase Excellence"
              description="Highlight your commitment to ethical sourcing and craftsmanship excellence to boost product value."
            />
          </div>
        </div>
      </section>

      {/* 3. New Section: Optimize Your Business with KHCRF Certification Services */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Evaluate, apply, certify, and unlock global market opportunities
              for enhanced visibility and growth.
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Optimize Your Business with KHCRF Certification Services
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              KHCRF offers tailored certification services to businesses,
              artisans, and institutions in the Kashmiri craft industry. By
              partnering with globally recognized certification bodies, we help
              enhance your business's reputation, increase market access, and
              boost consumer trust.
            </p>
            <p className="text-gray-600 text-lg">
              KHCRF works with you to navigate the complex certification process,
              from identifying the right certification packages to completing
              all documentation and meeting global standards. Our support is
              comprehensive and designed to ensure that your products are
              ethically sourced, sustainably produced, and meet international
              quality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={FaClipboardCheck} title="Evaluate your Business">
              <ul className="space-y-3">
                {[
                  "Evaluate Craftsmanship Quality and Uniqueness",
                  "Review Sustainability Practices and Sourcing",
                  "Assess Business’s Market Positioning Strategy",
                  "Ensure Compliance with Industry Standards",
                  "Examine Supply Chain Transparency and Ethics",
                  "Optimize Operational Efficiency and Processes",
                  "Certification Readiness and Documentation",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1">●</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaCertificate} title="Select Certifications">
              <ul className="space-y-3">
                {[
                  "Sustainability and Environmental Certifications",
                  "Ethical Sourcing and Fair Trade Certifications",
                  "Textile and Fabric Certifications (Apparel)",
                  "Wood and Paper Certifications",
                  "Social Responsibility & Worker Well-being",
                  "Recycled Materials & Circular Economy",
                  "Quality and Safety Certifications",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1">●</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaFileContract} title="Application Preparation">
              <ul className="space-y-3">
                {[
                  "Help You Select Certification Packages",
                  "Organize Necessary Documents for Submission",
                  "Assist in Form Completion",
                  "Provide Technical Guidance for Application",
                  "Tailor Solutions for Your Needs",
                  "Review and Submit Your Application",
                  "Ensure Application Completeness and Accuracy",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1">●</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* 4. New Section: Empowering Your Craft Business */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center mb-12">
            <div className="lg:col-span-1">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                HRCF INDUSTRY CERTIFICATIONS
              </span>
              <h2 className="text-3xl font-black text-gray-900">
                Empowering Your Craft Business with Trusted Certifications for
                Market Expansion and Global Success
              </h2>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* <FeatureCard
                                    icon={FaRocket}
                                    title="Elevate Your Craft Business"
                                    description="Enhance your business with KHCRF’s global certification and market recognition."
                                >
                                    <a href="https://www.craftlore.org/craft-industry-listing/business" className="text-brand-secondary font-bold text-sm hover:underline mt-2 inline-block">Elevate Now →</a>
                                </FeatureCard> */}

                <FeatureCard
                  icon={FaClipboardList}
                  title="Evaluate Your Business"
                  description="We assess quality, sustainability, market readiness, and operational efficiency for certification."
                />

                <FeatureCard
                  icon={FaPaperPlane}
                  title="Submit Your Application"
                  description="Complete and submit your application with required documentation for the certification process."
                />

                <FeatureCard
                  icon={FaCreditCard}
                  title="Complete Payment for Package"
                  description="Choose and pay for a tailored certification package that meets your business needs."
                />

                <FeatureCard
                  icon={FaCheckDouble}
                  title="Certification Review & Validation"
                  description="Your application and documentation are reviewed by subject experts to ensure accuracy, authenticity, and alignment with certification standards."
                />

                <FeatureCard
                  icon={FaSync}
                  title="Maintain Certification Status"
                  description="Certification remains valid through periodic reviews, updates, and continued compliance with defined standards."
                />

                <FeatureCard
                  icon={FaAward}
                  title="Get Your Certification"
                  description="Upon approval, receive your certification, enhancing credibility and opening global market access."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. test your basic business readiness (Matching legacy) */}
      <section className="py-20 bg-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Placeholder Image for assets/images/advocy_side.png */}
              <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] border-[12px] border-[var(--image-frame-color)]">
                <img
                  src="/assets/images/generated/business_evaluation_dashboard_v2.png"
                  alt="Online Business Evaluation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Certification Readiness Assessment
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Test your basic business readiness in Real Time
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Certify your business against recognized standards for Kashmiri
                handicrafts and formalize your compliance with ethical, quality,
                and operational benchmarks. Once approved, your business
                receives official certification aligned with national and
                international expectations for authentic Kashmiri craft
                enterprises.
              </p>

              <h3 className="text-xl font-bold text-brand-primary mb-6">
                How It Works:
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <FaCheckCircle data-ui-icon  className=" text-2xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Answer Questions:
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Provide answers based on your current business practices.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <FaFileAlt data-ui-icon  className=" text-2xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Upload Documentation:
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Attach the necessary proofs (e.g., certifications,
                      reports) to support your claims.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <FaCheckCircle data-ui-icon  className=" text-2xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Receive Instant Results:
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get immediate feedback based on your responses and
                      documentation.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-10">
                <Link
                  href="/business-support/certifications/evaluation"
                  className="inline-block px-8 py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-dark transition-colors transform hover:-translate-y-1"
                >
                  Start Preliminary Readiness Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DeKoshurPartnerCTA />
    </main>
  );
}
