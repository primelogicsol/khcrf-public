"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { cmsService } from "@/services/cmsService";

const Footer = () => {
  const [address, setAddress] = useState(
    "KHCRF 2 Darul Zamrood - Gousia Colony Ext, Zakura - Srinagar, Jammu & Kashmir India 190006",
  );

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await cmsService.get("contact");
        if (data?.content?.address) {
          setAddress(data.content.address);
        }
      } catch {
        // API unavailable or error — keep default address, no console noise
      }
    };
    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-brand-dark text-white pt-16 font-manrope">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12 pb-16">
          {/* Column 1: Institutional Identity Block */}
          <div className="xl:col-span-1 block">
            <Link href="/" className="float-left mr-4 mb-1 mt-1 block">
              <Image
                src="/assets/images/HCRF_LOGO_1.png"
                alt="KHCRF Logo"
                width={64}
                height={64}
                className="brightness-100 invert-0 object-contain w-[50px] md:w-[64px]"
              />
            </Link>
            <p className="text-gray-400 text-[14px] leading-relaxed">
              KHCRF is a Section 8 public-interest institution and India’s first
              Craft Policy Think Tank dedicated to Kashmir. We work at the
              intersection of research, policy, and practice to protect traditional
              handicrafts, strengthen artisan livelihoods, and advance sustainable
              craft ecosystems rooted in heritage. Through evidence-based research,
              policy advocacy, institutional partnerships, artisan support, documentation,
              and public engagement, KHCRF works to preserve Kashmir’s craft knowledge.
            </p>
          </div>

          {/* Column 2: Policy & Publications */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Policy Action
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/research/advocacy"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Policy Advocacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/campaigns"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Policy Campaign
                  </Link>
                </li>
                <li>
                  <Link
                    href="/research/lobbying"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Policy Lobbying
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legislative-office"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Policy Lobbying Blogs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Publications
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/publications?category=Best%20Practices"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Best Practices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publications?category=Case%20Studies"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publications?category=Research%20Papers"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Research Papers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publications?category=Policy%20Briefs"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Policy Briefs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publications?category=Knowledge%20Books"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Knowledge Books
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Business & About KHCRF */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Business Support
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/business-support/evaluation"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Business Evaluation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business-support/grants"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Grants Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business-support/accreditation"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Accreditation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business-support/entrepreneur-kits"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Entrepreneurs Kit
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                About KHCRF
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/about/shared-principle"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Shared Principle
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/partner-network"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Partner Network
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/hcrf-project"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/career"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Career
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/apprenticeship"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Apprenticeship
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Membership & Donation */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Membership
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/about/memberships"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Artisan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/memberships"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Individual
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/memberships"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Professional
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/memberships"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Corporate Patron
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Donation
              </h4>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <Link
                    href="/about/donations/donate"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Artisan Support Fund
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/donations/donate"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    In-Kind
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/donations/donate"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Legacy & Planned Giving
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about/donations/donate"
                    className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                  >
                    Event Sponsorships
                  </Link>
                </li>
              </ul>
            </div>
              <div>
                <Link
                  href="/knowledge/kashmir-crafts"
                  className="text-lg font-bold text-white uppercase tracking-wider block transition-colors duration-200 hover:text-white/80"
                >
                  CRAFT KNOWLEDGE
                  </Link>
              </div>
          </div>

          {/* Column 5: CTA & QR */}
          <div className="space-y-8">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h4 className="text-[14px] font-bold text-white mb-4 leading-tight italic">
                Let&apos;s come together to raise donations &amp; help amplify the voices
                of Kashmiri artisans.
              </h4>
              <Link
                href="/about/donations"
                className="bg-brand-secondary hover:bg-brand-primary text-white py-3 px-6 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 block text-center mb-6"
              >
                Donate Now
              </Link>
              <div className="flex justify-center">
                <Image
                  src="/assets/images/donation_scan.png"
                  alt="Hamadan Craft Revival Foundation Official Donation QR Code"
                  width={140}
                  height={140}
                  className="rounded-lg bg-white p-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side: Policy & Social */}
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © Copyright {new Date().getFullYear()} by KHCRF
              </p>
              <div className="flex justify-center lg:justify-start space-x-4">
                <a
                  href="https://x.com/artisanvoice"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-primary transition text-lg"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61567325408681"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-primary transition text-lg"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.linkedin.com/company/105864580/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-primary transition text-lg"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/kashmirhcrf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-primary transition text-lg"
                >
                  <FaInstagram />
                </a>
              </div>
              <div className="flex justify-center lg:justify-start items-center space-x-3 text-xs text-gray-400 uppercase tracking-widest font-bold">
                <Link href="/terms" className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white">
                  Legal
                </Link>
                <span className="opacity-30">|</span>
                <Link href="/privacy" className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white">
                  Privacy Policy
                </Link>
                <span className="opacity-30">|</span>
                <Link
                  href="/refund-policy"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                >
                  Refund Policy
                </Link>
              </div>
            </div>
            {/* Right Side: Address, Disclaimer & Credit */}
            <div className="text-center lg:text-right space-y-4 flex flex-col justify-end">
              <p className="text-gray-400 text-sm leading-relaxed ml-auto lg:max-w-md">
                KHCRF 2 Darul Zamrood - Gousia Colony Ext, Zakura
                <br />
                Srinagar, Jammu &amp; Kashmir India 190006
              </p>
              
              <div className="border-t border-white/10 my-4 lg:ml-auto w-full lg:max-w-lg"></div>
              
              <p className="text-xs text-gray-500 text-center lg:text-right italic lg:max-w-lg ml-auto mb-4">
                Membership fees, donations, sponsorships, partnerships, commercial relationships and financial contributions do not influence KHCRF research findings, policy positions, evaluations, rankings, recognition decisions, grant decisions, publication conclusions or assessment outcomes.
              </p>

              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-6">
                Website Developed & Maintained by{" "}
                <a
                  href="https://primelogicsol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white"
                >
                  Prime Logic Solutions - USA
                </a>
              </p>
              {process.env.NEXT_PUBLIC_RELEASE_SHA && (
                <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-1">
                  Release: {process.env.NEXT_PUBLIC_RELEASE_SHA.substring(0, 7)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
