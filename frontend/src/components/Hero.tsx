"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";

import { cmsApi } from "@/lib/api";

const DEFAULT_SLIDERS = [
  {
    title: "Kashmir's First Craft Policy Advocates",
    text: "Building a sustainable future for Kashmiri crafts through strategic policy advocacy",
    bg: "/assets/images/banner-backgrounds/advocacy-banner.jpg",
    btnText: "Discover More",
    btnLink: "/research/advocacy",
  },
  {
    title: "Leading In-Depth Craft Policy Analysis",
    text: "We Don't Just Advocate—We Lead with Research and Detailed Analysis to Preserve Kashmir's Craft Heritage",
    bg: "/assets/images/banner-backgrounds/analysis-banner.jpg",
    btnText: "Discover More",
    btnLink: "/research/industry",
  },
  {
    title: "Our e-Publications Have Global Reach",
    text: "Connecting Kashmir's Craft Insights with the World",
    bg: "/assets/images/banner-backgrounds/magazine-spaced-banner.jpg",
    btnText: "Discover More",
    btnLink: "/publications/ebook",
  },
];

import { useHeroOverlay } from "@/components/layout/HeroOverlayProvider";
const Hero = () => {
  const overlayContext = useHeroOverlay();
  useEffect(() => {
    if (overlayContext?.setOverlay) {
      overlayContext.setOverlay(true);
    }
    return () => {
      if (overlayContext?.setOverlay) {
        overlayContext.setOverlay(false);
      }
    };
  }, [overlayContext?.setOverlay]);

  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDERS);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("hero-carousel");
        if (data && data.content && data.content.length > 0) {
          setSlides(data.content);
        }
      } catch (error: unknown) {
        // If 404, we just use defaults, so it's not a critical error
        if (axios.isAxiosError(error) && error.response?.status !== 404) {
          console.warn("Failed to fetch hero carousel, using defaults", error);
        }
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full aspect-video md:aspect-auto md:h-[850px] overflow-hidden group font-manrope">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Background with Ken Burns Effect */}
          <div className="absolute inset-0 w-full h-full bg-black">
            <Image
              src={slide.bg}
              alt={slide.title}
              fill
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              className={`object-cover transition-transform duration-10000 ease-linear ${index === current ? "scale-110" : "scale-100"}`}
            />
            {/* Lighter overlay for better visibility */}
            <div className="absolute inset-0 bg-linear-to-r from-black/50 to-black/20" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 pt-[var(--header-height,140px)] flex flex-col justify-center items-start z-20">
            {/* Glassmorphism Content Box - Darker tint for better contrast */}
            <div
              className={`p-4 md:p-12 rounded-3xl backdrop-blur-md bg-black/30 border border-white/10 shadow-2xl max-w-3xl transition-all duration-1000 transform ${index === current ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
            >
              <span className="hidden md:inline-block px-4 py-1.5 bg-white/20 text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-full mb-4 md:mb-6 border border-brand-primary/30">
                Policy Think Tank
              </span>
              <h2 className="text-xl sm:text-2xl md:text-7xl font-black mb-3 md:mb-6 text-white leading-[1.1] tracking-tight text-left">
                {slide.title}
              </h2>
              <p className="hidden md:block text-base md:text-xl mb-8 md:mb-10 text-gray-200 leading-relaxed font-medium text-left">
                {slide.text}
              </p>
              <div className="flex flex-row gap-2 md:gap-4 mt-1 md:mt-2 w-full sm:w-auto">
                <Link
                  href={slide.btnLink}
                  className="bg-brand-primary hover:bg-white hover:text-brand-primary text-white px-4 md:px-10 py-2 md:py-4 rounded-xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] md:text-[13px] shadow-[0_10px_30px_-10px_rgba(223,83,17,0.5)] active:scale-95 text-center flex-1 md:flex-none justify-center flex items-center"
                >
                  {slide.btnText}
                </Link>
                <Link
                  href="/about/mission"
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-4 md:px-10 py-2 md:py-4 rounded-xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] md:text-[13px] border border-white/20 active:scale-95 text-center flex-1 md:flex-none justify-center flex items-center"
                >
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls - Optimized for Mobile */}
      <div className="absolute right-2 bottom-2 md:right-10 md:bottom-24 z-30 flex space-x-2 md:space-x-4">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="w-8 h-8 md:w-14 md:h-14 bg-white/10 hover:bg-brand-primary rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all duration-300 active:scale-90 group/btn"
        >
          <FaArrowLeft className="text-xs md:text-base group-hover/btn:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="w-8 h-8 md:w-14 md:h-14 bg-white/10 hover:bg-brand-primary rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 transition-all duration-300 active:scale-90 group/btn"
        >
          <FaArrowRight className="text-xs md:text-base group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Pagination Indicators - Vertical on Desktop, Hidden on Mobile */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col space-y-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`group relative h-12 flex items-center transition-all duration-500`}
          >
            <span
              className={`w-1 transition-all duration-500 rounded-full ${i === current ? "h-12 bg-brand-primary" : "h-4 bg-white/30 group-hover:bg-white/60"}`}
            />
            <span
              className={`ml-4 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-500 ${i === current ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
            >
              0{i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Pagination - Horizontal Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-8 z-30 flex md:hidden space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 m-1 rounded-full transition-all duration-300 ${i === current ? "bg-brand-primary w-4" : "bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator - Desktop Only */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
        <div className="w-1 h-12 rounded-full bg-linear-to-b from-brand-primary to-transparent opacity-50" />
      </div>
    </section>
  );
};

export default Hero;
