"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { businessSupportEntrepreneurKitsHeroFallback } from "@/config/heroFallbacks";
import Link from "next/link";
import {
  FaToolbox,
  FaChartLine,
  FaCoins,
  FaPalette,
  FaBullhorn,
  FaLeaf,
  FaLaptopCode,
  FaBalanceScale,
  FaHandHoldingUsd,
  FaArrowRight,
  FaUsers,
} from "react-icons/fa";

import FeatureCard from "@/components/common/FeatureCard";
import GetKitCTASection from "@/components/business/GetKitCTASection";

export default function EntrepreneurKitsPage() {
  return (
    <main>
      <UniversalEditorialHero pageKey="entrepreneur-kits" fallbackConfig={businessSupportEntrepreneurKitsHeroFallback as any} />

      {/* Main Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]">
              <img
                src="/assets/images/generated/entrepreneur-kit-visual.png"
                alt="Entrepreneur Business Kit"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Your Complete Guide to Business Growth
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                Transforming Tradition into Enterprise
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                The Kashmir Startup Entrepreneurs Kit, supported by the Hamdan
                Craft Revival Foundation (KHCRF), equips Kashmiri craft
                entrepreneurs with essential tools, innovative strategies, and
                sustainable solutions, empowering them to transform traditional
                craftsmanship into thriving global businesses.
              </p>
              <div className="bg-brand-secondary/5 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg">
                <p className="text-gray-800 font-medium italic">
                  "The Kashmir Startup Entrepreneurs Kit revolutionizes artisan
                  entrepreneurship, blending centuries-old craftsmanship with
                  next-generation innovations to build globally competitive
                  Kashmiri businesses."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Entrepreneurs Kit (Basic) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Business Development Guidance
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Entrepreneurs Kit
            </h2>
            <p className="text-gray-600 text-lg">
              The Hamdan Craft Entrepreneurs Kit is a comprehensive resource
              designed to empower artisans and small businesses in the Kashmiri
              handicrafts sector. It provides essential tools, guidance, and
              strategies to help entrepreneurs navigate the challenges of the
              craft industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaBullhorn}
              title="Marketing & Digital Strategy"
              description="Tools for promoting crafts online, building a brand, and reaching global markets."
            />

            <FeatureCard
              icon={FaLaptopCode}
              title="Technology Integration"
              description="Access to modern tools such as blockchain for authenticity verification, predictive logistics, and geo-fencing for targeted marketing."
            />

            <FeatureCard
              icon={FaHandHoldingUsd}
              title="Funding & Grant Resources"
              description="Information on securing financial support through grants and other opportunities."
            />

            <FeatureCard
              icon={FaBalanceScale}
              title="Legal Support"
              description="Guidance on intellectual property rights, trademarks, and safeguarding traditional crafts."
            />

            <FeatureCard
              icon={FaLeaf}
              title="Sustainability Practices"
              description="Best practices for integrating eco-friendly production and ethical business methods into everyday operations."
            />

            <FeatureCard
              icon={FaUsers}
              title="Networking & Collaboration"
              description="Opportunities to connect with mentors, industry experts, and a community of like-minded entrepreneurs."
            />
          </div>
        </div>
      </section>

      {/* Section 2: KHCRF Entrepreneur's Business Support Kit (Detailed) */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Empowering Kashmir's Entrepreneurs with Tools for Success
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              KHCRF Entrepreneur's Business Support Kit
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              The kit offers practical guidance and expert support across key
              areas essential for business success, including Business Planning
              & Strategy, Financial Management & Funding, Product Development,
              Marketing, Branding & Sales, Sustainability & Ethical Practices,
              and more. Whether you're a startup, a seasoned business owner, or
              an artisan looking to scale, the KHCRF kit is tailored to help you
              navigate the challenges of entrepreneurship while promoting
              ethical and sustainable growth.
            </p>
            <p className="text-gray-600 text-lg">
              Each module in the kit covers crucial aspects such as Technology
              Integration, Legal & Regulatory Compliance, Networking &
              Collaboration, and Government & NGO Schemes, ensuring you have the
              right foundation and support to turn your ideas into reality,
              while contributing to the rich legacy of Kashmiri crafts and
              businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaChartLine}
              title="Business Planning & Strategy"
            >
              <ul className="space-y-3">
                {[
                  "Business Plan Templates",
                  "Market Research Tools",
                  "Identify strengths and risks",
                  "Competitor Analysis",
                  "Define business growth objectives",
                  "Plan for potential challenges",
                  "Expand business sustainably",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaCoins} title="Financial Management & Funding">
              <ul className="space-y-3">
                {[
                  "Track expenses and revenues",
                  "Manage financial inflows",
                  "Apply for funding",
                  "Leverage online platforms",
                  "Access microfinance options",
                  "NHDP, AHVY, CGTMSE",
                  "Long-term financial planning",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaPalette} title="Product Development">
              <ul className="space-y-3">
                {[
                  "Traditional production techniques",
                  "Blend modern and classic designs",
                  "High-quality, sustainable materials",
                  "Testing product concepts",
                  "Consistent product standards",
                  "Eco-friendly and innovative",
                  "Obtain fair trade certifications",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaBullhorn} title="Marketing, Branding & Sales">
              <ul className="space-y-3">
                {[
                  "Build a strong identity",
                  "Optimize social platforms",
                  "Share your craft’s journey",
                  "Sell online seamlessly",
                  "Boost search engine rankings",
                  "Navigate international markets",
                  "Connect with global buyers",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard
              icon={FaLeaf}
              title="Sustainability & Ethical Practices"
            >
              <ul className="space-y-3">
                {[
                  "Ethical labor practices",
                  "Eco-friendly initiatives",
                  "Promote circular economy",
                  "Sustainable packaging solutions",
                  "Reduce production consumption",
                  "Minimize production waste",
                  "Achieve eco-recognition",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            <FeatureCard icon={FaLaptopCode} title="Technology Integration">
              <ul className="space-y-3">
                {[
                  "Verify craft authenticity",
                  "Manage e-commerce operations",
                  "Interactive experiences",
                  "Automated customer service",
                  "Streamline shipping processes",
                  "Virtual texture",
                  "Location-targeted marketing campaigns",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 text-sm"
                  >
                    <span className="mr-2 text-brand-secondary mt-1.5 text-xs">
                      ●
                    </span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Mission / Summary Section */}
      <GetKitCTASection />
    </main>
  );
}
