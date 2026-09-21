"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
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
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  weight: '600',
  subsets: ['latin'],
});

import FocusTrap from "focus-trap-react";
import { navLinks } from "./navData";
import { useHeroOverlay } from "@/components/layout/HeroOverlayProvider";

interface GlobalHeaderProps {
  mode?: "solid" | "overlay";
}

export function GlobalHeader({ mode = "solid" }: GlobalHeaderProps) {
  const overlayContext = useHeroOverlay();
  const effectiveMode = overlayContext?.isOverlay ? "overlay" : mode;

  const { user } = useAuth();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const isOverlay = effectiveMode === "overlay" && !isHeaderSticky;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Original uses 130px for sticky header trigger
      setIsHeaderSticky(window.scrollY > 130);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    
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
    }
  }, [isMobileMenuOpen]);

  
  return (
    <header className={`${effectiveMode === "overlay" ? "absolute" : "relative"} w-full z-[var(--z-header)]`}>
      {/* Original Topbar - Brown, 85% width, aligned right */}
      <div className={`hidden lg:block ${isOverlay ? "bg-transparent" : "bg-white"}`}>
        <div className="container-fluid mx-auto">
          <div className="flex justify-end">
            <div className={`w-[85%] rounded-bl-[10px] flex justify-between items-center py-2 px-6 xl:px-10 text-sm font-medium transition-colors duration-300 ${isOverlay ? 'bg-[#050A1E] text-white' : 'bg-transparent text-[#0f172a]'}`}>
              <div className="flex items-center space-x-4 xl:space-x-6">
                <span className={`text-lg ${cormorant.className}`}>
                  Kashmir Hamadan Craft Revival Foundation
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
                    className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
                  >
                    <FaXTwitter className="fill-current" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61567325408681"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
                  >
                    <FaFacebook className="fill-current" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/105864580/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
                  >
                    <FaLinkedin className="fill-current" />
                  </a>
                  <a
                    href="https://www.instagram.com/kashmirhcrf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
                  >
                    <FaInstagram className="fill-current" />
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/about/memberships"
                    className="hover:text-icon-on-light transition font-bold whitespace-nowrap"
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
                            className={`transition font-bold px-3 py-1 rounded flex items-center gap-2 ${isOverlay ? 'bg-white/20 hover:bg-white text-white hover:text-[#050A1E]' : 'bg-[#050A1E] hover:bg-[#6B2B08] text-white'}`}
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
                      className="hover:text-icon-on-light transition font-bold whitespace-nowrap"
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
      <nav className={`py-4 lg:pt-4 lg:pb-8 relative transition-colors duration-300 ${isOverlay ? "bg-transparent shadow-none" : "bg-white shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)]"}`}>
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
              <span className="text-sm md:text-base font-black uppercase text-[#050A1E] leading-tight">
                <span className="block">KASHMIR HAMADAN CRAFT</span>
                <span className="block">REVIVAL FOUNDATION</span>
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold leading-tight mt-0.5 truncate">
                A Kashmir Craft Policy Think Tank
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.name} className={`relative group py-6`}>
                <button className={`flex items-center font-bold text-[16px] uppercase tracking-[0.05em] transition-all duration-300 ${isOverlay ? "text-white" : "text-[#050A1E]"} group-hover:text-icon-on-light`}>
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
                    className={`megaMenu absolute top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400 z-[var(--z-mega-menu)] ${(link as any).megaAlign === 'right' ? 'right-0' : (link as any).megaAlign === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} ${(link as any).megaExtraClass || ''}`}
                    style={{ width: 'max-content', minWidth: (link as any).megaWidth || 'auto', maxWidth: '90vw' }}
                  >
                    <div className={`py-12 ${(link as any).megaPadding || 'px-14'}`}>
                      <div className={`grid gap-y-6 ${(link as any).megaGap || 'gap-x-10'} ${
                        (link as any).megaCols === 2 ? 'grid-cols-2' :
                        (link as any).megaCols === 3 ? 'grid-cols-3' :
                        (link as any).megaCols === 4 ? 'grid-cols-4' :
                        'grid-cols-6'
                      }`}>
                        {(link as any).columns.map((col: any) => (
                          <div key={col.title}>
                            <h4 className="text-[#050A1E] font-serif font-bold text-lg mb-4 border-b megaMenuDivider border-b pb-2 whitespace-nowrap">{col.title}</h4>
                            <ul className="space-y-3">
                              {col.links.map((sub: any) => (
                                <li key={sub.name}>
                                  <Link href={sub.href} className="text-[13px] font-bold text-gray-900 hover:text-icon-on-light transition-colors block leading-tight whitespace-nowrap hover:bg-gray-100 py-1.5 px-2 -ml-2 rounded">
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
                  <ul className="megaMenu absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 min-w-[280px] translate-y-4 group-hover:translate-y-0 transition-all duration-400 z-[var(--z-mega-menu)]">
                    {link.submenu.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="flex items-center px-8 py-3 text-[14px] font-bold text-gray-700 hover:bg-[#6B2B08] hover:text-white transition-all duration-200 uppercase tracking-widest border-b border-gray-50 last:border-0"
                        >
                          {sub.name}
                          {(sub as any).beta && (
                            <span className="ml-2 bg-[#6B2B08] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-icon-on-light transition-colors">
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
              className="bg-[#050A1E] hover:bg-[#6B2B08] text-white px-4 py-2 md:px-6 md:py-2.5 rounded shadow-md hover:shadow-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-sm flex items-center gap-2"
            >
              <FaHeart className="text-xs md:text-sm animate-pulse" />
              <span>
                DONATE
              </span>
            </Link>
            {/* Mobile Toggler */}
            <button
              className="xl:hidden bg-white text-[#050A1E] p-2 md:p-3 rounded-lg shadow-md border border-gray-100 hover:bg-[#6B2B08] hover:text-white transition-all duration-300"
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
        className={`fixed top-0 left-0 w-full bg-[#050A1E] z-[var(--z-header)] shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 block ${isHeaderSticky ? "translate-y-0" : "-translate-y-full"}`}
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
            <span className="xl:hidden text-[11px] sm:text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">
                <span className="block md:hidden tracking-wider">Kashmir HCRF</span>
                <span className="hidden md:block">Kashmir Hamadan Craft Revival Foundation</span>
              </span>
          </Link>
          <ul className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.name} className={`relative group py-4`}>
                <button className="font-bold text-[15px] uppercase tracking-wider text-white group-hover:text-icon-on-light transition-colors duration-300">
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
                    className={`megaMenu absolute top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 z-[var(--z-mega-menu)] ${(link as any).megaAlign === 'right' ? 'right-0' : (link as any).megaAlign === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} ${(link as any).megaExtraClass || ''}`}
                    style={{ width: 'max-content', minWidth: (link as any).megaWidth || 'auto', maxWidth: '90vw' }}
                  >
                    <div className={`py-12 ${(link as any).megaPadding || 'px-14'}`}>
                      <div className={`grid gap-y-6 ${(link as any).megaGap || 'gap-x-10'} ${
                        (link as any).megaCols === 2 ? 'grid-cols-2' :
                        (link as any).megaCols === 3 ? 'grid-cols-3' :
                        (link as any).megaCols === 4 ? 'grid-cols-4' :
                        'grid-cols-6'
                      }`}>
                        {(link as any).columns.map((col: any) => (
                          <div key={col.title}>
                            <h4 className="text-[#050A1E] font-serif font-bold text-lg mb-4 border-b megaMenuDivider border-b pb-2 whitespace-nowrap">{col.title}</h4>
                            <ul className="space-y-3">
                              {col.links.map((sub: any) => (
                                <li key={sub.name}>
                                  <Link href={sub.href} className="text-[13px] font-medium text-gray-700 hover:text-icon-on-light transition-colors block leading-tight whitespace-nowrap">
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
                  <ul className="megaMenu absolute left-0 top-full invisible group-hover:visible opacity-0 group-hover:opacity-100 min-w-[240px] translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    {link.submenu.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="flex items-center px-6 py-2.5 text-[14px] font-bold text-gray-700 hover:bg-[#6B2B08] hover:text-white transition-all duration-200 uppercase tracking-widest border-b border-gray-50 last:border-0"
                        >
                          {sub.name}
                          {(sub as any).beta && (
                            <span className="ml-2 bg-[#6B2B08] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider group-hover:bg-white group-hover:text-icon-on-light transition-colors">
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
            <Link
              href="/about/donations"
              className="bg-[#6B2B08] hover:bg-white hover:text-[#050A1E] text-white px-3 py-1.5 md:px-5 md:py-2 rounded shadow-md transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs flex items-center gap-2"
            >
              <FaHeart className="text-[10px] md:text-xs" /> DONATE
            </Link>
            {/* Mobile Toggler - Sticky */}
            <button
              className="xl:hidden bg-[#6B2B08] text-white p-2 md:p-3 rounded-lg shadow-md border border-white/10 hover:bg-white hover:text-icon-on-light transition-all duration-300"
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
      <FocusTrap active={isMobileMenuOpen}>
      <div
        className={`fixed inset-0 bg-[#050A1E]/95 z-[var(--z-drawer-backdrop)] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
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
              className="bg-[#6B2B08] text-white p-2 rounded-full hover:rotate-90 transition-transform shadow-lg"
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
                    <span className="font-bold text-[#050A1E]">
                      {user.name}
                    </span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl bg-[#6B2B08] text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#050A1E] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Go to Profile
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl border-2 border-[#050A1E] text-[#050A1E] font-black uppercase tracking-widest text-xs hover:bg-[#050A1E] hover:text-white transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center py-3 rounded-xl bg-[#6B2B08] text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#050A1E] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile DONATE CTA */}
          <div className="px-6 pt-4">
            <Link
              href="/about/donations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-center items-center gap-2 py-3 rounded-xl bg-[#6B2B08] text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-[#050A1E] transition-all duration-300 w-full"
            >
              <FaHeart className="text-xs" /> DONATE NOW
            </Link>
          </div>

          <ul className="p-4 space-y-2">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="border-b border-gray-100 last:border-0"
              >
                <button
                  className="flex justify-between items-center w-full py-4 text-[#050A1E] font-bold uppercase text-[15px]"
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
                  className={`transition-all duration-300 overflow-hidden ${openSubmenu === link.name ? "opacity-100 pb-4" : "opacity-0"}`} style={{ maxHeight: openSubmenu === link.name ? "2000px" : "0px" }}
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
                                  className="text-[13px] text-gray-800 font-bold hover:text-icon-on-light hover:bg-gray-100 flex items-center leading-tight py-2 px-3 -ml-3 rounded-lg transition-colors"
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
                            className="text-[14px] text-gray-500 font-medium hover:text-icon-on-light flex items-center"
                          >
                            {sub.name}
                            {(sub as any).beta && (
                              <span className="ml-2 bg-[#6B2B08] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
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
            <div className="flex justify-center space-x-6 text-xl text-[#050A1E]">
              <a
                href="https://x.com/artisanvoice"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
              >
                <FaTwitter className="fill-current" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61567325408681"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
              >
                <FaFacebook className="fill-current" />
              </a>
              <a
                href="https://www.linkedin.com/company/105864580/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
              >
                <FaLinkedin className="fill-current" />
              </a>
              <a
                href="https://www.instagram.com/kashmirhcrf/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-current hover:text-icon-on-light hover:-translate-y-[2px] inline-block transition-all duration-300"
              >
                <FaInstagram className="fill-current" />
              </a>
            </div>
          </div>
        </div>
      </div>
      </FocusTrap>
    </header>
  );
}



