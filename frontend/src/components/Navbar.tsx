"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaBars,
  FaTimes,
  FaHeart,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { MdDashboard } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";

const Navbar = () => {
  const { user } = useAuth();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Original uses 130px for sticky header trigger
      setIsHeaderSticky(window.scrollY > 130);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    {
      name: "Research & Policy",
      isMega: true,
      megaWidth: "780px",
      megaCols: 2,
      columns: [
        {
          title: "Industry & Governance",
          links: [
            { name: "Handicrafts Industry Research", href: "/industry-research" },
            { name: "Kashmir Craft Policy Insights", href: "/research/policy" },
            { name: "Handicrafts Governance", href: "/research/governance" },
            { name: "Kashmir Craft Regulations", href: "/research/regulations" },
          ]
        },
        {
          title: "Advocacy & Action",
          links: [
            { name: "Artisan Advocacy", href: "/research/advocacy" },
            { name: "Craft Protection Campaigns", href: "/research/campaigns" },
            { name: "Kashmir Legislative Lobbying", href: "/research/lobbying" },
            { name: "Legislative Office Updates", href: "/legislative-office" },
          ]
        }
      ],
      submenu: [
        { name: "Industry Research", href: "/industry-research" },
        { name: "Policy Insights", href: "/research/policy" },
        { name: "Governance", href: "/research/governance" },
        { name: "Advocacy", href: "/research/advocacy" },
      ],
    },
    {
      name: "State of Kashmir Crafts",
      isMega: true,
      megaCols: 4,
      columns: [
        {
          title: "About & Governance",
          links: [
            { name: "Current Assessment 2026–2027", href: "/state-of-kashmir-crafts/current-assessment-2026" },
            { name: "About the Assessment", href: "/state-of-kashmir-crafts/about" },
            { name: "Governance Framework", href: "/state-of-kashmir-crafts/governance-framework" },
            { name: "Methodology", href: "/state-of-kashmir-crafts/methodology" },
            { name: "Advisory Council", href: "/state-of-kashmir-crafts/advisory-council" },
          ]
        },
        {
          title: "Engagement",
          links: [
            { name: "Official Messages", href: "/state-of-kashmir-crafts/official-messages" },
            { name: "Participating Institutions", href: "/state-of-kashmir-crafts/participating-institutions" },
            { name: "Stakeholder Registry", href: "/state-of-kashmir-crafts/stakeholder-registry" },
            { name: "Participate", href: "/state-of-kashmir-crafts/participate" },
            { name: "Consultation Tracker", href: "/state-of-kashmir-crafts/consultation-tracker" },
          ]
        },
        {
          title: "Review & Findings",
          links: [
            { name: "Public Hearings", href: "/state-of-kashmir-crafts/public-hearings" },
            { name: "Evidence Repository", href: "/state-of-kashmir-crafts/evidence-repository" },
            { name: "Draft Findings", href: "/state-of-kashmir-crafts/draft-findings" },
            { name: "Validation Round", href: "/state-of-kashmir-crafts/validation-round" },
            { name: "Expert Review", href: "/state-of-kashmir-crafts/expert-review" },
          ]
        },
        {
          title: "Reports & Resources",
          links: [
            { name: "Final Report", href: "/state-of-kashmir-crafts/final-report" },
            { name: "Reports Archive", href: "/state-of-kashmir-crafts/reports-archive" },
            { name: "Media Center", href: "/state-of-kashmir-crafts/media-center" },
            { name: "Become a Fellow", href: "/state-of-kashmir-crafts/become-a-fellow" },
            { name: "FAQ", href: "/state-of-kashmir-crafts/faq" },
          ]
        }
      ],
      submenu: [
        { name: "About Initiative", href: "/state-of-kashmir-crafts/about" },
        { name: "Participate", href: "/state-of-kashmir-crafts/participate" },
        { name: "Draft Findings", href: "/state-of-kashmir-crafts/draft-findings" },
        { name: "Final Report", href: "/state-of-kashmir-crafts/final-report" },
      ],
    },
    {
      name: "Master Artisans",
      isMega: true,
      megaCols: 6,
      columns: [
        {
          title: "Discover",
          links: [
            { name: "Featured Artisan", href: "/master-artisans#featured" },
            { name: "Latest Stories", href: "/master-artisans#stories" },
            { name: "Magazine Issues", href: "/master-artisans/issues" },
            { name: "Editorial Series", href: "/master-artisans/editorial" },
          ]
        },
        {
          title: "People",
          links: [
            { name: "Master Artisans", href: "/master-artisans/artisans" },
            { name: "Living Legends", href: "/master-artisans/artisans/living-legends" },
            { name: "Women Artisans", href: "/master-artisans/artisans/women-artisans" },
            { name: "Emerging Artisans", href: "/master-artisans/artisans/emerging-artisans" },
            { name: "Apprentices", href: "/master-artisans/artisans/apprentices" },
            { name: "Workshop Communities", href: "/master-artisans/artisans/workshop-communities" },
          ]
        },
        {
          title: "Studio",
          links: [
            { name: "Documentary Films", href: "/master-artisans/studio/documentary-films" },
            { name: "Oral Histories", href: "/master-artisans/studio/oral-histories" },
            { name: "Video Interviews", href: "/master-artisans/studio/video-interviews" },
            { name: "Audio Stories", href: "/master-artisans/studio/audio-stories" },
            { name: "Workshop Diaries", href: "/master-artisans/studio/workshop-diaries" },
            { name: "Craft Demonstrations", href: "/master-artisans/studio/craft-demonstrations" },
          ]
        },
        {
          title: "Collections",
          links: [
            { name: "Heritage Collections", href: "/master-artisans/collections" },
            { name: "Signature Masterpieces", href: "/master-artisans/collections/signature-masterpieces" },
            { name: "Museum Archive", href: "/master-artisans/collections/museum-archive" },
            { name: "Rare Objects", href: "/master-artisans/collections/rare-objects" },
            { name: "Contemporary Excellence", href: "/master-artisans/collections/contemporary-excellence" },
            { name: "Collection Essays", href: "/master-artisans/collections/essays" },
          ]
        },
        {
          title: "Knowledge",
          links: [
            { name: "Craft Lineages", href: "/master-artisans/lineages" },
            { name: "Traditional Techniques", href: "/master-artisans/techniques" },
            { name: "Tools & Materials", href: "/master-artisans/tools-materials" },
            { name: "Motifs & Symbols", href: "/master-artisans/motifs-symbols" },
            { name: "Natural Dyes", href: "/master-artisans/natural-dyes" },
            { name: "Glossary", href: "/master-artisans/knowledge/glossary" },
          ]
        },
        {
          title: "Participate",
          links: [
            { name: "Nominate an Artisan", href: "/master-artisans/nominate" },
            { name: "Submit a Story", href: "/master-artisans/submit-story" },
            { name: "Become a Contributor", href: "/master-artisans/contributor" },
            { name: "Support Documentation", href: "/master-artisans/support" },
          ]
        },
      ],
      submenu: [
        { name: "Artisans Directory", href: "/master-artisans/artisans" },
        { name: "Studio", href: "/master-artisans/studio" },
        { name: "Collections", href: "/master-artisans/collections" },
        { name: "Nominate", href: "/master-artisans/nominate" },
      ]
    },
    {
      name: "Publications",
      isMega: true,
      megaWidth: "780px",
      megaCols: 2,
      columns: [
        {
          title: "Industry Intelligence",
          links: [
            { name: "All Publications", href: "/publications" },
            { name: "Market Intelligence", href: "/publications/market-intelligence" },
            { name: "Policy Briefs", href: "/publications/policy-briefs" },
            { name: "Research Papers", href: "/publications/research-papers" },
          ]
        },
        {
          title: "Guides & Studies",
          links: [
            { name: "Best Practices", href: "/publications/best-practices" },
            { name: "Case Studies", href: "/publications/case-studies" },
            { name: "Knowledge Books", href: "/publications/knowledge-books" },
          ]
        }
      ],
      submenu: [
        { name: "All Publications", href: "/publications" },
        { name: "Best Practices", href: "/publications/best-practices" },
        { name: "Research Papers", href: "/publications/research-papers" },
        { name: "Knowledge Books", href: "/publications/knowledge-books" },
      ],
    },
    {
      name: "Craft Business Support",
      isMega: true,
      megaWidth: "780px",
      megaAlign: "right",
      megaCols: 2,
      columns: [
        {
          title: "Evaluations & Grants",
          links: [
            { name: "Craft Enterprise Evaluation & Ranking", href: "/business-support/evaluation" },
            { name: "Kashmir Artisan Enterprise Grants", href: "/business-support/grants" },
          ]
        },
        {
          title: "Certifications",
          links: [
            { name: "Handicrafts Business Certification", href: "/business-support/certifications" },
            { name: "Verified Craft Accreditation Badge", href: "/business-support/accreditation" },
            { name: "Craft Entrepreneurs Kit", href: "/business-support/entrepreneur-kits" },
          ]
        }
      ],
      submenu: [
        { name: "Enterprise Grants", href: "/business-support/grants" },
        { name: "Certifications", href: "/business-support/certifications" },
        { name: "Accreditation", href: "/business-support/accreditation" },
      ],
    },
    {
      name: "About KHCRF",
      isMega: true,
      megaWidth: "780px",
      megaAlign: "right",
      megaCols: 3,
      columns: [
        {
          title: "Foundation",
          links: [
            { name: "Shared Principle", href: "/about/shared-principle" },
            { name: "Mission", href: "/about/mission" },
            { name: "Leadership", href: "/about/leadership" },
            { name: "Compliance", href: "/about/compliance" },
          ]
        },
        {
          title: "Network & Careers",
          links: [
            { name: "Memberships", href: "/about/memberships" },
            { name: "Partner Network", href: "/about/partner-network" },
            { name: "Apprenticeship", href: "/about/apprenticeship" },
            { name: "Career", href: "/about/career" },
          ]
        },
        {
          title: "Initiatives & Support",
          links: [
            { name: "KHCRF Projects", href: "/about/hcrf-project" },
            { name: "Donations", href: "/about/donations" },
            { name: "Contact", href: "/about/contact" },
          ]
        }
      ],
      submenu: [
        { name: "Mission", href: "/about/mission" },
        { name: "Leadership", href: "/about/leadership" },
        { name: "Memberships", href: "/about/memberships" },
        { name: "Contact", href: "/about/contact" },
      ],
    },
  ];

  return (
    <header className="relative w-full z-50">
      {/* Original Topbar - Brown, 85% width, aligned right */}
      <div className="bg-white hidden lg:block">
        <div className="container-fluid mx-auto">
          <div className="flex justify-end">
            <div className="bg-brand-secondary w-[85%] rounded-bl-[10px] flex justify-between items-center py-2 px-10 text-white text-sm font-medium">
              <div className="flex items-center space-x-6">
                <span className="text-lg">
                  Hamadan Craft Revival Foundation
                </span>
                <span className="text-shadow-blue-300 text-2xl font-light">
                  |
                </span>
                <span className="italic">
                  A Kashmir Craft Policy Think Tank - Shaping the Future of
                  Artisans
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4 pr-6 border-r border-white/20 text-lg">
                  <a
                    href="https://x.com/artisanvoice"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (formerly Twitter)"
                    className="hover:text-black transition"
                  >
                    <FaXTwitter />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61567325408681"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="hover:text-black transition"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/105864580/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-black transition"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://www.instagram.com/kashmirhcrf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-black transition"
                  >
                    <FaInstagram />
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/about/memberships"
                    className="hover:text-[#D4AF37] transition font-bold whitespace-nowrap"
                  >
                    Join KHCRF
                  </Link>
                  {user ? (
                    <>
                      <Link href="/profile">
                        <div className="flex items-center gap-2">
                          <FaUserCircle className="text-xl" />
                          <span className="font-bold">{user.name}</span>
                        </div>
                      </Link>
                      {user.role !== "COLLABORATOR_EBOOKS" &&
                        user.role !== "USER" && (
                          <Link
                            href="/dashboard"
                            className="hover:text-black transition font-bold bg-white/20 px-3 py-1 rounded hover:bg-white text-white flex items-center gap-2"
                          >
                            <span>
                              <MdDashboard />
                            </span>{" "}
                            Dashboard
                          </Link>
                        )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="hover:text-[#D4AF37] transition font-bold whitespace-nowrap"
                    >
                      Login & Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu Header */}
      <nav className="bg-white py-4 lg:pt-4 lg:pb-8 shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)] relative">
        <div className="container-fluid mx-auto">
          <div className="flex justify-end">
            <div className="w-full lg:w-[85%] px-4 md:px-10 flex max-[405px]:flex-wrap max-[405px]:gap-y-4 justify-between items-center">
          <Link href="/" className="relative z-10 flex items-center gap-3 md:gap-4 shrink-0 mr-4 max-[405px]:w-full max-[405px]:mr-0">
            <Image
              src="/assets/images/HCRF_LOGO_1.png"
              alt="KHCRF Logo"
              width={160}
              height={227}
              priority
              className="w-[56px] h-[56px] md:w-[80px] md:h-[80px] lg:w-[127px] lg:h-[127px] object-contain shrink-0"
            />
            {/* Organization Identity - Visible on mobile/tablet, hidden on desktop where Top Bar exists */}
            <div className="flex flex-col lg:hidden min-w-0">
              <span className="text-sm md:text-base font-black uppercase text-brand-dark leading-tight">
                <span className="block md:inline">HAMADAN CRAFT</span>
                <span className="block md:inline md:ml-1">REVIVAL FOUNDATION</span>
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold leading-tight mt-0.5 truncate">
                A Kashmir Craft Policy Think Tank
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden xl:flex items-center space-x-8">
            <li>
              <Link
                href="/"
                className="text-xl text-brand-dark hover:text-brand-primary transition-all duration-300"
              >
                <FaHome />
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.name} className={`${(link as any).isMega && !(link as any).megaWidth ? '' : 'relative'} group py-6`}>
                <button className="flex items-center font-bold text-[16px] uppercase tracking-[0.05em] text-brand-dark group-hover:text-brand-primary transition-all duration-300">
                  {(link as any).href ? (
                    <Link href={(link as any).href} className="flex items-center w-full">
                      {link.name}
                    </Link>
                  ) : (
                    <>{link.name}</>
                  )}
                  <svg
                    className="w-4 h-4 ml-1 fill-current opacity-30 group-hover:rotate-180 transition-transform duration-300"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                
                {(link as any).isMega ? (
                  <div 
                    className={`absolute top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-[#FAF9F6] shadow-2xl border-t-2 border-[#D4AF37] translate-y-4 group-hover:translate-y-0 transition-all duration-400 z-[100] border-b-[8px] border-b-[#3E2723] ${(link as any).megaWidth ? ((link as any).megaAlign === 'right' ? 'right-0' : 'left-0') : 'left-0 w-full'}`}
                    style={(link as any).megaWidth ? { minWidth: (link as any).megaWidth, width: 'max-content' } : {}}
                  >
                    <div className={`${(link as any).megaWidth ? 'py-12 px-14' : 'container-fluid mx-auto px-4 md:px-10 py-10'}`}>
                      <div className={`grid gap-y-6 ${(link as any).megaWidth ? 'gap-x-10' : 'gap-x-8'} ${
                        (link as any).megaCols === 2 ? 'grid-cols-2' :
                        (link as any).megaCols === 3 ? 'grid-cols-3' :
                        (link as any).megaCols === 4 ? 'grid-cols-4' :
                        'grid-cols-6'
                      }`}>
                        {(link as any).columns.map((col: any) => (
                          <div key={col.title}>
                            <h4 className="text-[#3E2723] font-serif font-bold text-lg mb-4 border-b border-[#3E2723]/20 pb-2 whitespace-nowrap">{col.title}</h4>
                            <ul className="space-y-3">
                              {col.links.map((sub: any) => (
                                <li key={sub.name}>
                                  <Link href={sub.href} className="text-[13px] font-bold text-gray-900 hover:text-brand-primary transition-colors block leading-tight whitespace-nowrap hover:bg-gray-100 py-1.5 px-2 -ml-2 rounded">
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-white shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)] min-w-[280px] border-t-2 border-brand-primary translate-y-4 group-hover:translate-y-0 transition-all duration-400 z-[100]">
                    {link.submenu.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="flex items-center px-8 py-3 text-[14px] font-bold text-gray-700 hover:bg-brand-primary hover:text-white transition-all duration-200 uppercase tracking-widest border-b border-gray-50 last:border-0"
                        >
                          {sub.name}
                          {(sub as any).beta && (
                            <span className="ml-2 bg-brand-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-brand-primary transition-colors">
                              Beta
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3 md:space-x-6 shrink-0 max-[405px]:w-full max-[405px]:justify-end">
            <Link
              href="/about/donations"
              className="bg-[#6B2B08] hover:bg-[#4A1C05] text-white px-4 py-2 md:px-6 md:py-2.5 rounded shadow-md hover:shadow-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-sm flex items-center gap-2"
            >
              <FaHeart className="text-xs md:text-sm animate-pulse" />
              <span>
                DONATE
              </span>
            </Link>
            {/* Mobile Toggler */}
            <button
              className="xl:hidden bg-white text-brand-dark p-2 md:p-3 rounded-lg shadow-md border border-gray-100 hover:bg-brand-primary hover:text-white transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <FaBars className="text-lg md:text-xl" />
            </button>
          </div>
        </div>
                </div>
        </div>
      </nav>

      {/* Sticky Header - Slide down fixed header */}
      <div
        className={`fixed top-0 left-0 w-full bg-brand-dark z-[101] shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 block ${isHeaderSticky ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container-fluid mx-auto px-4 md:px-10 flex justify-between items-center py-2 h-[64px] xl:h-[100px]">
          <Link href="/" className="p-2 flex items-center gap-3 shrink-0 mr-4">
            <Image
              src="/assets/images/HCRF_LOGO_1.png"
              alt="KHCRF Logo"
              width={80}
              height={80}
              className="w-[40px] h-[40px] xl:w-[80px] xl:h-[80px] object-contain shrink-0"
            />
            {/* Organization Identity - Sticky Mobile/Tablet */}
            <span className="xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">
              Hamadan Craft Revival Foundation
            </span>
          </Link>
          <ul className="hidden xl:flex items-center space-x-6">
            <li>
              <Link
                href="/"
                className="text-white hover:text-brand-primary transition-colors duration-300 text-lg"
              >
                <FaHome />
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.name} className={`${(link as any).isMega && !(link as any).megaWidth ? '' : 'relative'} group py-4`}>
                <button className="font-bold text-[15px] uppercase tracking-wider text-white group-hover:text-brand-primary transition-colors duration-300">
                  {(link as any).href ? (
                    <Link href={(link as any).href} className="flex items-center w-full">
                      {link.name}
                    </Link>
                  ) : (
                    <>{link.name}</>
                  )}
                </button>
                {(link as any).isMega ? (
                  <div 
                    className={`absolute top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-[#FAF9F6] shadow-2xl border-t-2 border-[#D4AF37] translate-y-2 group-hover:translate-y-0 transition-all duration-400 z-[100] border-b-[8px] border-b-[#3E2723] ${(link as any).megaWidth ? ((link as any).megaAlign === 'right' ? 'right-0' : 'left-0') : 'left-0 w-full'}`}
                    style={(link as any).megaWidth ? { minWidth: (link as any).megaWidth, width: 'max-content' } : {}}
                  >
                    <div className={`${(link as any).megaWidth ? 'py-12 px-14' : 'container-fluid mx-auto px-10 py-8'}`}>
                      <div className={`grid gap-y-6 ${(link as any).megaWidth ? 'gap-x-10' : 'gap-x-8'} ${
                        (link as any).megaCols === 2 ? 'grid-cols-2' :
                        (link as any).megaCols === 3 ? 'grid-cols-3' :
                        (link as any).megaCols === 4 ? 'grid-cols-4' :
                        'grid-cols-6'
                      }`}>
                        {(link as any).columns.map((col: any) => (
                          <div key={col.title}>
                            <h4 className="text-[#3E2723] font-serif font-bold text-lg mb-4 border-b border-[#3E2723]/20 pb-2 whitespace-nowrap">{col.title}</h4>
                            <ul className="space-y-3">
                              {col.links.map((sub: any) => (
                                <li key={sub.name}>
                                  <Link href={sub.href} className="text-[13px] font-medium text-gray-700 hover:text-[#D4AF37] transition-colors block leading-tight whitespace-nowrap">
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-white shadow-2xl min-w-[240px] border-t-2 border-brand-primary translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    {link.submenu.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="flex items-center px-6 py-2.5 text-[14px] font-bold text-gray-700 hover:bg-brand-primary hover:text-white transition-all duration-200 uppercase tracking-widest border-b border-gray-50 last:border-0"
                        >
                          {sub.name}
                          {(sub as any).beta && (
                            <span className="ml-2 bg-brand-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-brand-primary transition-colors">
                              Beta
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {user && (
              <Link
                href="/profile"
                className="hidden xl:block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Profile
              </Link>
            )}
            <Link
              href="/about/donations"
              className="bg-[#6B2B08] hover:bg-[#4A1C05] text-white px-3 py-1.5 md:px-5 md:py-2 rounded shadow-md transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs flex items-center gap-2"
            >
              <FaHeart className="text-[10px] md:text-xs" /> DONATE
            </Link>
            {/* Mobile Toggler - Sticky */}
            <button
              className="xl:hidden bg-brand-primary text-white p-2 md:p-3 rounded-lg shadow-md border border-white/10 hover:bg-white hover:text-brand-primary transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <FaBars className="text-lg md:text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div
        className={`fixed inset-0 bg-brand-dark/95 z-[200] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={(e) => { if (e.target === e.currentTarget) setIsMobileMenuOpen(false); }}
      >
        <div
          id="mobile-menu-drawer"
          className={`absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <Link href="/">
              <Image
                src="/assets/images/HCRF_LOGO_1.png"
                alt="KHCRF Logo"
                width={80}
                height={80}
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu"
              className="bg-brand-primary text-white p-2 rounded-full hover:rotate-90 transition-transform shadow-lg"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="p-6 pb-2 grid grid-cols-1 gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaUserCircle data-ui-icon  className="text-2xl " />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      Logged in as
                    </span>
                    <span className="font-bold text-brand-dark">
                      {user.name}
                    </span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Go to Profile
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl border-2 border-brand-dark text-brand-dark font-black uppercase tracking-widest text-xs hover:bg-brand-dark hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-brand-secondary hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <ul className="p-4 space-y-2">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="border-b border-gray-100 last:border-0"
              >
                <button
                  className="flex justify-between items-center w-full py-4 text-brand-dark font-bold uppercase text-[15px]"
                  onClick={() =>
                    setOpenSubmenu(openSubmenu === link.name ? null : link.name)
                  }
                >
                  {link.name}
                  <span
                    className={`transition-transform duration-300 ${openSubmenu === link.name ? "rotate-180" : ""}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${openSubmenu === link.name ? "max-h-[2000px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
                >
                  <ul className="pl-4 space-y-4 pt-2">
                    {(link as any).isMega ? (
                      (link as any).columns.map((col: any) => (
                        <li key={col.title} className="mb-4 last:mb-0">
                          <h5 data-editorial-accent-text className="text-[11px] font-bold  uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">{col.title}</h5>
                          <ul className="pl-2 space-y-2">
                            {col.links.map((sub: any) => (
                              <li key={sub.name}>
                                <Link
                                  href={sub.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-[13px] text-gray-800 font-bold hover:text-brand-primary hover:bg-gray-100 flex items-center leading-tight py-2 px-3 -ml-3 rounded-lg transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))
                    ) : (
                      link.submenu.map((sub: any) => (
                        <li key={sub.name}>
                          <Link
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[14px] text-gray-500 font-medium hover:text-brand-primary flex items-center"
                          >
                            {sub.name}
                            {(sub as any).beta && (
                              <span className="ml-2 bg-brand-primary text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Beta
                              </span>
                            )}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-8 space-y-4">
            <div className="flex justify-center space-x-6 text-xl text-brand-dark">
              <a
                href="https://x.com/artisanvoice"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61567325408681"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.linkedin.com/company/105864580/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/kashmirhcrf/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

