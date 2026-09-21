"use client";

import React from "react";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { campaignsHeroFallback } from "@/config/heroFallbacks";
import InfoGrid from "@/app/(main)/industry-research/components/InfoGrid";
import { IconType } from "react-icons";
import {
  FaLandmark,
  FaFemale,
  FaLeaf,
  FaHardHat,
  FaHandHoldingUsd,
  FaUsers,
  FaChevronRight,
  FaBullhorn,
  FaHandshake,
} from "react-icons/fa";
import { CAMPAIGN_TOPICS } from "@/data/campaigns-data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { initiativeApi } from "@/lib/api";

const iconMap: { [key: string]: IconType } = {
  "fa-landmark": FaLandmark,
  "fa-person-dress": FaFemale,
  "fa-leaf": FaLeaf,
  "fa-helmet-safety": FaHardHat,
  "fa-hand-holding-dollar": FaHandHoldingUsd,
  "fa-users": FaUsers,
};

export default function CampaignsClient() {
  const gridItems = CAMPAIGN_TOPICS.map((topic) => ({
    title: topic.title,
    text: topic.shortDescription, // Changed description to shortDescription
    icon: iconMap[topic.icon] || FaLandmark, // Fallback
    link: `/research/campaigns/${topic.slug}`, // Changed id to slug
  }));

  const hashtags = [
    {
      img: "/assets/images/slide_pic_com_adcy/1.png",
      tag: "#CraftingEquality",
    },
    {
      img: "/assets/images/slide_pic_com_adcy/2.png",
      tag: "#ArtisanHandsCarryHistory",
    },
    {
      img: "/assets/images/slide_pic_com_adcy/3.png",
      tag: "#FundArtisanFutures",
    },
    { img: "/assets/images/slide_pic_com_adcy/4.png", tag: "#DirectToArtisan" },
    {
      img: "/assets/images/slide_pic_com_adcy/5.png",
      tag: "#StrengthInAuthenticHands",
    },
    {
      img: "/assets/images/slide_pic_com_adcy/6.png",
      tag: "#HandsDeserveCare",
    },
  ];

  /* Wrapper to fetch data */
  const [campaigns, setCampaigns] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await initiativeApi.getAll("CAMPAIGN");
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  /* Filter out campaigns that might render in the main grid if we wanted, 
     but for now we replace the HASHTAGS section with these "Generated Graphics" */

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: "KHCRF Campaigns",
      text: "Join the movement for Artisan Empowerment and Craft Protection.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto">
      {/* Hero Section */}
      <UniversalEditorialHero
        pageKey="research-campaigns"
        fallbackConfig={campaignsHeroFallback as any}
      />

      {/* Intro & Objectives Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... Existing static content ... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="order-2 lg:order-1">
              <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                Driving Policy Change for a Thriving Craft Future
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-black text-stone-900 mb-6 leading-tight">
                Kashmir Craft Policy Campaigns
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8 text-left md:text-justify">
                Our Policy Campaigns are designed to mobilize support for key
                issues affecting the Kashmiri handicraft industry. By building
                coalitions of stakeholders, including policymakers, business
                leaders, and craft advocacy organizations, we drive legislative
                and public awareness campaigns that aim to shape the future of
                the craft industry.
              </p>

              <p className="text-stone-600 text-lg leading-relaxed mb-8 text-left md:text-justify">
                Our advocacy programs are focused on building momentum for vital
                concerns within the regional craftsmanship sector.
              </p>

              <div className="bg-[#fdfbf7] p-5 md:p-8 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                <h3 className="font-playfair text-xl font-bold text-stone-900 mb-4">
                  Campaign Objectives
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-brand-primary">
                        Combating Counterfeiting:
                      </span>{" "}
                      Raising public and governmental awareness on the economic
                      damage caused by counterfeit goods and pushing for
                      stricter anti-counterfeit legislation.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-brand-primary">
                        Promoting Fair Trade:
                      </span>{" "}
                      Advocating for fair trade certifications and policies that
                      ensure equitable treatment and fair compensation for
                      Kashmiri artisans in the global market.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-primary mt-1">✦</span>
                    <p className="text-stone-700 text-sm">
                      <span className="font-bold text-brand-primary">
                        Sustainability Campaigns:
                      </span>{" "}
                      Encouraging policies that promote the use of sustainable
                      materials and eco-friendly production methods to preserve
                      the environment while maintaining craft traditions.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[700px] rounded-lg overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-stone-200">
                <img
                  src="/assets/images/get_involved/9.png"
                  alt="Shaping Artisan Futures"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/600x800/e2e8f0/475569?text=Artisan+Future")
                  }
                />
              </div>
              {/* <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="font-playfair text-2xl italic">
                  "Lobbying for sector-specific needs"
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Grid of Topics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <InfoGrid
          title="Active Campaigns"
          items={gridItems}
          bgClass="bg-transparent"
        />
      </div>

      {/* Participate Section */}
      <section className="py-20 bg-stone-50 relative overflow-hidden">
        {/* ... (Kept existing Participate section content) ... */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl aspect-square"
            >
              <Image
                width={800}
                height={800}
                src="/assets/images/get_involved/collaboration.png"
                alt="Participate"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/800x600/e2e8f0/475569?text=Participate")
                }
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-4">
                Join the Movement
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-black text-stone-900 mb-6 leading-tight">
                Become a Campaigning Partner or Collaborator
              </h2>
              <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                KHCRF offers opportunities for individuals passionate about
                preserving Kashmiri crafts to join its advocacy efforts. Support
                campaigns focused on fair trade, intellectual property
                protections, artisan rights, and sustainable practices.
              </p>

              <div className="flex flex-col gap-6">
                {/* ... (collaborate blocks) ... */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#fdfbf7] rounded-xl shadow-sm border border-stone-200 transition-all hover:shadow-md hover:border-brand-primary">
                  <div className="flex-grow">
                    <h3 className="font-playfair text-xl font-bold text-stone-900 mb-2">
                      Campaign Partner Application
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed max-w-md">
                      Apply to join KHCRF&apos;s campaign network and support advocacy for artisan rights, fair trade, cultural heritage, and craft sector protection.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Link
                      href="/research/campaigns/cultural-pride/join?type=partner"
                      className="inline-block w-full sm:w-auto px-6 py-3 bg-stone-900 text-white text-sm font-bold text-center rounded-xl hover:bg-stone-800 transition-colors shadow-sm"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm border border-stone-200 transition-all hover:shadow-md hover:border-amber-500">
                  <div className="flex-grow">
                    <h3 className="font-playfair text-xl font-bold text-stone-900 mb-2">
                      Existing Campaign Members
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed max-w-md">
                      Access your campaign dashboard, manage activities, submit reports, and participate in approved campaigns.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <Link
                      href="/login"
                      className="inline-block w-full sm:w-auto px-6 py-3 bg-white border border-stone-300 text-stone-900 text-sm font-bold text-center rounded-xl hover:bg-stone-50 hover:border-stone-400 transition-colors shadow-sm"
                    >
                      Login To Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campaign Movement Platform Section */}
      <section className="py-24 bg-[#fdfbf7] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Info & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100/50 border border-amber-200/50 text-amber-800 font-bold tracking-widest uppercase text-xs mb-6 shadow-sm">
                Campaign Mission
              </span>
              <h2 className="text-3xl md:text-5xl font-playfair font-black text-stone-900 leading-tight mb-6">
                Campaigning for Artisan Empowerment
              </h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                Your voice matters in the fight to protect artisans and promote sustainable craftsmanship. We use data, policy advocacy, and public mobilization to secure a future for Kashmir's heritage.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {["Policy", "Gender", "Trade", "Welfare", "Authenticity", "Education"].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white border border-stone-200 text-stone-600 text-sm font-semibold rounded-lg hover:border-amber-300 hover:text-amber-700 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: campaigns.length > 0 ? campaigns.length : CAMPAIGN_TOPICS.length, label: "Active Campaigns", color: "text-emerald-700" },
                  { value: "14", label: "Districts Reached", color: "text-amber-700" },
                  { value: "120+", label: "Partner Organizations", color: "text-blue-700" },
                  { value: "18", label: "Awareness Drives", color: "text-purple-700" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm text-center">
                    <div className={`text-3xl md:text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Campaign */}
          {(() => {
            const featuredCampaign = campaigns.length > 0 ? campaigns[0] : CAMPAIGN_TOPICS[0];
            return featuredCampaign ? (
              <div className="mb-16">
                <span className="block text-stone-400 font-bold tracking-widest uppercase text-xs mb-4">
                  Featured Campaign
                </span>
                <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all duration-500">
                  <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                    <Image src={featuredCampaign.heroImage?.includes("campaign-1.jpg") ? "/assets/images/compaign/1.png" : featuredCampaign.heroImage || "/assets/images/compaign/1.png"} alt={featuredCampaign.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      {featuredCampaign.status || "ACTIVE"}
                    </div>
                  </div>
                  <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                    <h3 className="text-2xl md:text-3xl font-playfair font-black text-stone-900 mb-4">
                      {featuredCampaign.title}
                    </h3>
                    <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                      {featuredCampaign.shortDescription || featuredCampaign.description || "Advocating for structural empowerment and formal recognition of artisans through targeted policy action."}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 mt-auto">
                      <div className="flex -space-x-3">
                        {/* Fake avatars for supporters */}
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Supporter" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500">
                          +2k
                        </div>
                      </div>
                      <Link href={`/research/campaigns/${featuredCampaign.slug || featuredCampaign.id}`} className="px-6 py-3 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-md ml-auto flex items-center gap-2">
                        Join Movement <FaChevronRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Campaign Grid */}
          <div className="mb-20">
            <div className="flex justify-between items-end mb-8">
              <span className="block text-stone-400 font-bold tracking-widest uppercase text-xs">
                All Campaigns
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const gridCampaigns = campaigns.length > 1 ? campaigns.slice(1) : CAMPAIGN_TOPICS.slice(1);
                const bgColors = ["bg-amber-50/50", "bg-stone-50", "bg-orange-50/30", "bg-white border-stone-200", "bg-stone-100/50 border-stone-200", "bg-amber-50/30 border-amber-100"];
                const metrics = ["4 Policy Submissions", "12 Global Partners", "Launch: Next Month", "12,000 Reached", "500 Trained", "In State Review"];
                const statuses = ["ACTIVE", "ONGOING", "UPCOMING", "ACTIVE", "COMPLETED", "ACTIVE"];
                const statusColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-stone-500", "bg-emerald-500"];
                
                return gridCampaigns.map((camp, i) => (
                  <div key={camp.id || i} className={`rounded-2xl border border-stone-100 p-8 flex flex-col h-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${bgColors[i % bgColors.length]}`}>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-2.5 py-1 text-[10px] font-bold text-white rounded uppercase tracking-widest ${camp.statusColor || statusColors[i % statusColors.length]}`}>
                        {camp.status || statuses[i % statuses.length]}
                      </span>
                      <span className="text-stone-300 group-hover:text-amber-600 transition-colors">
                        {camp.icon && iconMap[camp.icon] ? React.createElement(iconMap[camp.icon], { className: "text-xl" }) : <FaLeaf className="text-xl" />}
                      </span>
                    </div>
                    <h4 className="text-xl font-playfair font-bold text-stone-900 mb-3">{camp.title}</h4>
                    <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                      {camp.shortDescription || camp.description || "Supporting the structural empowerment and formal recognition of artisans through targeted advocacy."}
                    </p>
                    
                    <div className="flex items-center justify-between border-t border-stone-200/60 pt-5 mt-auto">
                      <div className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                        {camp.metric || metrics[i % metrics.length]}
                      </div>
                      <Link href={`/research/campaigns/${camp.slug || camp.id}`} className="text-stone-900 hover:text-amber-700 transition-colors flex items-center gap-1 text-sm font-bold">
                        View <FaChevronRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Get Involved Action Cards */}
          <div>
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 font-bold tracking-widest uppercase text-xs mb-4 shadow-sm">
                Get Involved
              </span>
              <h3 className="text-3xl font-playfair font-black text-stone-900">How You Can Help</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: FaBullhorn, label: "Share", link: "#" },
                { icon: FaUsers, label: "Participate", link: "/legislative-office" },
                { icon: FaHandshake, label: "Partner", link: "/about/partner-network/join" },
                { icon: FaHandHoldingUsd, label: "Sponsor", link: "/about/donations/donate" },
                { icon: FaLandmark, label: "Advocate", link: "/research/advocacy" },
              ].map((action, i) => {
                if (action.label === "Share") {
                  return (
                    <button onClick={handleShare} key={i} className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-amber-300 hover:shadow-md transition-all group block w-full">
                      <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                        <action.icon className="text-xl" />
                      </div>
                      <h4 className="font-bold text-stone-900">{action.label}</h4>
                    </button>
                  );
                }
                return (
                  <Link href={action.link} key={i} className="bg-white border border-stone-200 rounded-2xl p-6 text-center hover:border-amber-300 hover:shadow-md transition-all group block">
                    <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-600 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <action.icon className="text-xl" />
                    </div>
                    <h4 className="font-bold text-stone-900">{action.label}</h4>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
