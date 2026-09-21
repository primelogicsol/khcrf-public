"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutMembershipsHeroFallback } from "@/config/heroFallbacks";
import FeatureCard from "@/components/common/FeatureCard";
import CTASection from "@/components/common/CTASection";
import MembershipCTA from "@/components/membership/MembershipCTA";
import { calculateGrowthStats } from "@/utils/growthCalculator";
import CountUpStats from "@/components/common/CountUpStats";
import {
  FaTools,
  FaUserGraduate,
  FaUser,
  FaBriefcase,
  FaCrown,
  FaBuilding,
  FaLock,
  FaNetworkWired,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaBookOpen,
  FaBalanceScale,
} from "react-icons/fa";

export default function MembershipsPage() {

      

  return (
    <main>
      <UniversalEditorialHero pageKey="memberships" fallbackConfig={aboutMembershipsHeroFallback as any} />

      {/* Membership Opportunities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-left mb-12">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Explore Our Initiatives | Get Involved
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
              Membership Opportunities
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We offer various membership categories to individuals and
              organizations that wish to support our mission and engage with the
              thriving world of Kashmiri handicrafts.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("apply-now")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-full shadow-lg hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Apply for Membership
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={FaTools} title="Artisan Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹0</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Artisans, weavers, embroiderers, woodcarvers, papier-mâché artists, cooperatives, and traditional craft producers.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["Resource Access", "Training Opportunities", "Policy Participation", "Artisan Support Programs"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard icon={FaUserGraduate} title="Student Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹0</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Students interested in heritage, crafts, sustainability, design, culture, research, and community development.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["Learning Opportunities", "Research Exposure", "Internship Access", "Volunteer Programs"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard icon={FaUser} title="Individual Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹25</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Citizens and supporters passionate about preserving Kashmir's cultural heritage.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["Research Updates", "Community Participation", "Event Access", "Advocacy Support"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard icon={FaBriefcase} title="Professional Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹100</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Researchers, consultants, academics, designers, development professionals, and subject experts.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["Professional Networking", "Project Collaboration", "Research Access", "Expert Forums"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard icon={FaCrown} title="Patron Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹1,000</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Individuals wishing to make significant contributions toward heritage preservation and artisan welfare.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["Strategic Recognition", "Heritage Support Opportunities", "Leadership Engagement", "Special Acknowledgement"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard icon={FaBuilding} title="Corporate Membership">
              <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Annual Membership Fee
                  </span>
                  <span className="text-2xl font-black text-brand-primary">₹5,000</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                    Best For
                  </span>
                  <p className="text-sm text-gray-600">
                    Organizations, brands, CSR programs, institutions, and responsible businesses.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-2">
                    Includes
                  </span>
                  <ul className="space-y-1.5">
                    {["CSR Partnerships", "Industry Engagement", "Project Collaboration", "Organizational Recognition"].map((item) => (
                      <li key={item} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-brand-secondary text-lg leading-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP BENEFITS MATRIX */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-manrope">
              Membership Benefits Matrix
            </h3>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider">Benefit</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Artisan</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Student</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Individual</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Professional</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Patron</th>
                  <th className="p-4 font-bold text-gray-900 uppercase text-xs tracking-wider text-center">Corporate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: "Digital Membership Certificate", vals: [true, true, true, true, true, true] },
                  { name: "Member Directory", vals: [true, true, true, true, true, true] },
                  { name: "Research Updates", vals: [true, true, true, true, true, true] },
                  { name: "Workshops & Events", vals: [true, true, true, true, true, true] },
                  { name: "Volunteer Opportunities", vals: [true, true, true, true, true, true] },
                  { name: "Networking Opportunities", vals: [true, true, true, true, true, true] },
                  { name: "Project Participation", vals: [true, true, true, true, true, true] },
                  { name: "Recognition Opportunities", vals: [false, false, false, true, true, true] },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-800 font-medium">{row.name}</td>
                    {row.vals.map((val, j) => (
                      <td key={j} className="p-4 text-center">
                        {val ? <span className="text-brand-primary font-bold">✓</span> : <span className="text-gray-300">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Join KHCRF (Benefits) Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Preserve Tradition, Empower Artisans, Shape the Future
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
              Why Join KHCRF?
            </h2>
            <h4 className="text-xl text-gray-700 font-medium leading-relaxed">
              Becoming a member of the Hamdan Craft Revival Foundation offers
              exclusive opportunities to contribute to the preservation and
              advancement of Kashmiri handicrafts.
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaLock}
              title="Exclusive Access"
              description="As a member, you’ll gain early access to cutting-edge research publications, detailed industry reports, and insights into emerging policy trends. Stay ahead of developments that affect the handicraft sector and understand how shifts in policies and markets will impact artisans."
            />
            <FeatureCard
              icon={FaNetworkWired}
              title="Networking"
              description="Join a vibrant community of artisans, industry leaders, and policymakers dedicated to preserving Kashmir’s craftsmanship. KHCRF membership offers opportunities to connect with influential figures passionate about safeguarding traditional crafts."
            />
            <FeatureCard
              icon={FaHandHoldingHeart}
              title="Impact"
              description="Your membership directly supports the protection and promotion of Kashmir’s cultural heritage. Through advocacy, help influence policies, improve artisans' working conditions, and create sustainable opportunities."
            />
            <FeatureCard
              icon={FaCalendarAlt}
              title="Events & Workshops"
              description="KHCRF members enjoy access to exclusive events and workshops addressing the key challenges in the handicraft sector. These events unite experts, artisans, and leaders to discuss topics like sustainability, innovation, and market trends."
            />
            <FeatureCard
              icon={FaBookOpen}
              title="Knowledge & Research"
              description="Gain access to research publications, policy briefs, market intelligence, heritage documentation, and emerging trends shaping the future of Kashmir's craft sector."
            />
            <FeatureCard
              icon={FaBalanceScale}
              title="Advocacy & Policy"
              description="Your membership strengthens KHCRF’s voice in craft policy, artisan rights, GI protection, fair trade, sustainability, and heritage preservation. Members help shape informed advocacy for Kashmir’s craft sector."
            />
          </div>
        </div>
      </section>

      {/* Fun Facts / Impact Statistics */}
      <section className="py-20 bg-white text-gray-900 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">
              Crafting a Future
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
              Join our network for a better future
              <br /> of our Artisans and Craft Industry
            </h2>
          </div>

          <StatsGrid />
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-gray-50 py-8 border-y border-gray-200">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm font-semibold text-gray-600">
          {[
            "Secure Membership Application",
            "Privacy Protected",
            "Global Participation Welcome",
            "Heritage-Focused Community",
            "Trusted Nonprofit Initiative",
          ].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-brand-primary">✓</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Application CTA */}
      <div id="apply-now">
        <MembershipCTA />
      </div>
    </main>
  );
}

function StatsGrid() {
  const stats = calculateGrowthStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
        <div data-ui-icon className=" text-3xl mb-4 group-hover:scale-110 transition-transform">
          <FaTools className="mx-auto" />
        </div>
        <div className="text-3xl font-bold font-manrope mb-1">
          <CountUpStats value={stats.artisans} />
        </div>
        <div className="text-gray-600 text-sm uppercase tracking-wide">
          Artisan Members
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
        <div data-ui-icon className=" text-3xl mb-4 group-hover:scale-110 transition-transform">
          <FaUser className="mx-auto" />
        </div>
        <div className="text-3xl font-bold font-manrope mb-1">
          <CountUpStats value={stats.individuals} />
        </div>
        <div className="text-gray-600 text-sm uppercase tracking-wide">
          Individual Members
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
        <div data-ui-icon className=" text-3xl mb-4 group-hover:scale-110 transition-transform">
          <FaBriefcase className="mx-auto" />
        </div>
        <div className="text-3xl font-bold font-manrope mb-1">
          <CountUpStats value={stats.professionals} />
        </div>
        <div className="text-gray-600 text-sm uppercase tracking-wide">
          Professional Members
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
        <div data-ui-icon className=" text-3xl mb-4 group-hover:scale-110 transition-transform">
          <FaCrown className="mx-auto" />
        </div>
        <div className="text-3xl font-bold font-manrope mb-1">
          <CountUpStats value={stats.patrons} />
        </div>
        <div className="text-gray-600 text-sm uppercase tracking-wide">
          Patron Members
        </div>
      </div>
      <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all group">
        <div data-ui-icon className=" text-3xl mb-4 group-hover:scale-110 transition-transform">
          <FaUserGraduate className="mx-auto" />
        </div>
        <div className="text-3xl font-bold font-manrope mb-1">
          <CountUpStats value={stats.students} />
        </div>
        <div className="text-gray-600 text-sm uppercase tracking-wide">
          Student Members
        </div>
      </div>
    </div>
  );
}



