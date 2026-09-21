"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutMissionHeroFallback } from "@/config/heroFallbacks";
import {
  FaHandsHelping,
  FaBrain,
  FaGavel,
  FaLeaf,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";
import CTASection from "@/components/common/CTASection";
import * as FaIcons from "react-icons/fa";
import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/api";

const DEFAULT_ITEMS = [
  {
    title: "Empower Artisan Livelihoods",
    description:
      "We work directly with artisan communities to strengthen income stability, improve working conditions, and ensure dignity in traditional craftsmanship through fair practices and sustained support.",
    icon: "FaHandsHelping",
  },
  {
    title: "Knowledge & Skill Transmission",
    description:
      "We support the documentation, teaching, and intergenerational transfer of traditional knowledge so that centuries-old skills are not lost to modernization or economic pressure.",
    icon: "FaBrain",
  },
  {
    title: "Cultural Policy & Advocacy",
    description:
      "We engage with institutions and policymakers to advocate for artisan-friendly regulations, heritage protection frameworks, and long-term cultural sustainability strategies.",
    icon: "FaGavel",
  },
  {
    title: "Ethical & Responsible Growth",
    description:
      "Our initiatives promote ethical sourcing, environmentally responsible production, and mindful consumption to ensure craft revival does not come at the cost of people or ecology.",
    icon: "FaLeaf",
  },
  {
    title: "Community-Led Development",
    description:
      "We believe real revival comes from within communities. Our programs are designed with artisans, not for them, ensuring ownership, relevance, and long-term success.",
    icon: "FaUsers",
  },
  {
    title: "Global Cultural Dialogue",
    description:
      "We position Kashmiri crafts within global cultural and economic conversations, building bridges between local traditions and international markets, scholars, and institutions.",
    icon: "FaGlobe",
  },
];

export default function MissionPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("mission-framework");
        if (data && data.content) {
          setItems(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch mission framework, using defaults");
      }
    };
    fetchContent();
  }, []);

  const getIconComponent = (iconName: string) => {
    const Icon = (FaIcons as any)[iconName];
    return Icon || FaIcons.FaHandsHelping;
  };

  return (
    <main>
      {/* Using BusinessHero for now, we can customize or enhance it later if the slider is strictly required. 
                For a modern look, a single strong hero image is often preferred. 
                I will use one of the generated images or a placeholder for now. */}
      <UniversalEditorialHero pageKey="mission" fallbackConfig={aboutMissionHeroFallback as any} />

      {/* Mission Cards Section - matching donation-two structure from legacy */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-3 block">
              Our Core Pillars
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-6 font-manrope">
              The Mission Framework
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The Hamdan Craft Revival Foundation operates on a holistic model
              of preservation and empowerment. Our mission is built on these six
              foundational pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      <CTASection buttonLink="/about/memberships" dark={false} />
    </main>
  );
}
