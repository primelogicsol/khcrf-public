"use client";

import AccreditedCTAsection from "@/components/business/AccreditedCTAsection";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { businessSupportAccreditationHeroFallback } from "@/config/heroFallbacks";
import FeatureCard from "@/components/common/FeatureCard";
import {
  FaAward,
  FaCertificate,
  FaHandHoldingHeart,
  FaLeaf,
  FaPalette,
  FaFemale,
  FaMicrochip,
  FaUsers,
  FaArrowRight,
  FaTags,
  FaBoxOpen,
  FaGlobe,
  FaStore,
  FaBullhorn,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/api";

const DEFAULT_CERTIFICATES = [
  { image: "https://i.ibb.co/gJLb9q6/1.png", title: "Certificate 1" },
  { image: "https://i.ibb.co/k9Y3Fn0/2.png", title: "Certificate 2" },
  { image: "https://i.ibb.co/t31NLf3/3.png", title: "Certificate 3" },
];

export default function AccreditationPage() {
  const [certificates, setCertificates] = useState(DEFAULT_CERTIFICATES);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("accreditation-certificates");
        if (data && data.content) {
          setCertificates(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch certificates, using defaults");
      }
    };
    fetchContent();
  }, []);

  return (
    <main>
      <UniversalEditorialHero pageKey="accreditation" fallbackConfig={businessSupportAccreditationHeroFallback as any} />

      {/* Main Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                A Mark of Excellence
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
                What is the KHCRF Badge?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                The KHCRF Badge is a Institutional Recognition awarded by the
                Hamdan Craft Revival Foundation to artisans and businesses in
                the Kashmiri handicraft industry. This badge serves as a mark of
                authenticity, quality, and ethical craftsmanship. It signals to
                consumers and the global market that the products are genuine,
                traditionally made, and adhere to the highest standards of
                sustainability and fair trade.
              </p>
              <div className="bg-brand-secondary/5 border-l-4 border-[var(--card-left-accent)] p-6 rounded-r-lg">
                <p className="text-gray-800 font-medium italic">
                  "Earning the KHCRF Badge allows artisans and businesses to gain
                  recognition for their commitment to preserving Kashmiri
                  cultural heritage and maintaining ethical production
                  practices."
                </p>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]">
              <img
                src="/assets/images/generated/hcrf_matte_badge_2024.jpg"
                alt="Matte KHCRF Certified EST. 2024 Accreditation Badge"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Badge Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Showcasing Excellence
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
              Types of KHCRF Recognition Badges
            </h2>
            <p className="text-gray-600 text-lg">
              Each badge highlights a different area of excellence, helping
              businesses stand out in the global market and build consumer
              trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={FaCertificate}
              title="Authentic Craftsmanship"
              description="Recognizes artisans who maintain the integrity of traditional Kashmiri craftsmanship."
            />
            <FeatureCard
              icon={FaHandHoldingHeart}
              title="Ethical Trade"
              description="Honors commitment to ethical trade practices and fair wages for artisans."
            />
            <FeatureCard
              icon={FaLeaf}
              title="Sustainable Practices"
              description="Awarded for environmentally conscious craftsmanship and sustainable materials."
            />
            <FeatureCard
              icon={FaAward}
              title="Cultural Preservation"
              description="Celebrates efforts to protect and preserve Kashmir’s cultural heritage."
            />
            <FeatureCard
              icon={FaPalette}
              title="Innovative Design"
              description="Recognizes creativity blending with tradition to introduce fresh, modern designs."
            />
            <FeatureCard
              icon={FaFemale}
              title="Women Empowerment"
              description="Acknowledges initiatives providing opportunities for women artisans."
            />
            <FeatureCard
              icon={FaMicrochip}
              title="Innovation in Tech"
              description="Highlights use of modern technology to enhance production and processes."
            />
            <FeatureCard
              icon={FaUsers}
              title="Community Development"
              description="Honors contributions toward social and economic upliftment of artisan communities."
            />
          </div>
        </div>
      </section>

      {/* Benefits / Usage Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="bg-brand-primary/5 p-8 rounded-3xl border border-brand-primary/10">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Why use the KHCRF Badge?
                </h3>
                <ul className="space-y-4">
                  <BenefitItem
                    icon={FaTags}
                    text="Product Labels: demonstrate independently evaluated practices and institutional recognition."
                  />
                  <BenefitItem
                    icon={FaBoxOpen}
                    text="Packaging: Highlight craftsmanship."
                  />
                  <BenefitItem
                    icon={FaBullhorn}
                    text="Marketing Materials: Build consumer trust."
                  />
                  <BenefitItem
                    icon={FaGlobe}
                    text="Website: Feature the badge for credibility."
                  />
                  <BenefitItem
                    icon={FaStore}
                    text="Online Marketplaces: Attract buyers."
                  />
                </ul>
              </div>
            </div>
            <div className="lg:order-1">
              <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
                Value of Accreditation
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-6 font-manrope">
                Showcase your commitment to craftsmanship & ethics
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                The KHCRF Recognition Badge isn't just a symbol; it's a
                powerful tool to communicate your values to customers. Use it
                across your physical and digital presence to differentiate your
                products in a crowded market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-12">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Recognitions
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              Official Certificates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="w-full max-w-sm hover:scale-105 transition-transform duration-300 shadow-lg rounded-xl overflow-hidden border border-gray-100"
              >
                <img
                  src={cert.image}
                  alt={cert.title || "Certificate"}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application CTA Section */}
      <AccreditedCTAsection />
    </main>
  );
}

function BenefitItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-3 text-gray-700">
      <Icon className="text-icon-on-light text-lg" />
      <span className="font-medium">{text}</span>
    </li>
  );
}
