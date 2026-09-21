"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import { useHeroOverlay } from "@/components/layout/HeroOverlayProvider";

/**
 * CANONICAL KHCRF PUBLIC HERO
 * KHCRF Hero Master V1
 *
 * All KHCRF public-page hero experiences must use this engine
 * unless an explicitly documented architectural exception exists.
 *
 * Presentation is global.
 * Content and behavior remain page-aware through pageKey/configuration.
 */

import React, { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./UniversalEditorialHero.module.css";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

interface HeroSlide {
  id: string;
  internalName: string;
  eyebrow?: string;
  titleLineOne: string;
  titleConnector?: string;
  titleLineTwo: string;
  description: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  tertiaryLinkLabel?: string;
  tertiaryLinkUrl?: string;
  metadata?: any;
}

interface HeroConfig {
  id: string;
  pageKey: string;

  // Base configuration
  accentColor?: string; // Deprecated: defaults to KHCRF #6B2B08
  autoplayEnabled?: boolean;
  autoplayIntervalMs?: number;
  animationEnabled?: boolean;
  reducedMotionFallback?: boolean;
  navigationEnabled?: boolean;

  // Page-aware presentation configuration
  heroMode?: "static" | "carousel";
  heroHeight?: "immersive" | "standard" | "compact";
  desktopFocalPoint?: string;
  mobileFocalPoint?: string;
  overlayStrength?: "light" | "standard" | "strong";
  overlayDirection?: "left" | "center" | "right" | "balanced";
  floatingControlsEnabled?: boolean;
  ctaEnabled?: boolean;

  slides: HeroSlide[];
}

export default function UniversalEditorialHero({
  pageKey,
  fallbackConfig,
}: {
  pageKey: string;
  fallbackConfig?: HeroConfig;
}) {
  const [config, setConfig] = useState<HeroConfig | null>(fallbackConfig || null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
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
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const isPaused = isUserPaused || isHoverPaused;

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setActiveStageIndex(0);
    setVisibleItems(new Set());
    setIsUserPaused(false);
    setIsHoverPaused(false);

    const fetchHero = async () => {
      try {
const API_BASE_URL = getBaseUrlNoApi();
        const res = await fetch(`${API_BASE_URL}/api/hero/public/${pageKey}`);
        const json = await res.json();
        const payload =
          json.status === "success" && json.data ? json.data : json;

        if (cancelled) return;

        if (payload.success && !payload.empty) {
          setConfig(payload.data);
        } else if (fallbackConfig) {
          setConfig(fallbackConfig);
        } else {
          setConfig(null);
        }
      } catch (_err) {
        if (!cancelled) {
          setConfig(fallbackConfig || null);
        }
      }
    };

    fetchHero();
    return () => {
      cancelled = true;
    };
  }, [pageKey, fallbackConfig]);

  const isStaticMode = config?.heroMode === "static";
  const effectiveSlidesCount = isStaticMode ? 1 : config?.slides.length || 0;
  const animationsDisabled =
    prefersReducedMotion || config?.animationEnabled === false;
  const navigationEnabled = config?.navigationEnabled !== false;
  const safeActiveStageIndex = Math.min(
    activeStageIndex,
    Math.max(effectiveSlidesCount - 1, 0),
  );

  useEffect(() => {
    setActiveStageIndex((previous) => {
      if (effectiveSlidesCount <= 1) return 0;
      return Math.min(previous, effectiveSlidesCount - 1);
    });
  }, [effectiveSlidesCount]);

  useEffect(() => {
    if (
      !config ||
      isPaused ||
      effectiveSlidesCount <= 1 ||
      isStaticMode
    ) {
      return;
    }

    if (config.autoplayEnabled === false) return;
    if (prefersReducedMotion && config.reducedMotionFallback !== false) return;

    const intervalMs = config.autoplayIntervalMs || 6000;
    const interval = window.setInterval(() => {
      setActiveStageIndex((previous) =>
        (previous + 1) % effectiveSlidesCount,
      );
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [
    config,
    isPaused,
    prefersReducedMotion,
    effectiveSlidesCount,
    isStaticMode,
  ]);

  useEffect(() => {
    if (effectiveSlidesCount <= 1 || isStaticMode) return;

    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems((previous) => {
          const next = new Set(previous);
          entries.forEach((entry) => {
            const index = Number.parseInt(
              entry.target.getAttribute("data-idx") || "-1",
              10,
            );
            if (index === -1) return;
            if (entry.intersectionRatio >= 0.99) next.add(index);
            else next.delete(index);
          });
          return next;
        });
      },
      { root: container, threshold: 0.99 },
    );

    const items = container.querySelectorAll(".hero-nav-item-observe");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [effectiveSlidesCount, isStaticMode, config]);

  useEffect(() => {
    if (effectiveSlidesCount <= 1 || isStaticMode) return;

    const container = scrollRef.current;
    if (!container) return;

    const activeNode = container.querySelector(
      `[data-idx="${safeActiveStageIndex}"]`,
    ) as HTMLElement | null;

    if (activeNode) {
      const containerCenter = container.clientWidth / 2;
      const nodeCenter = activeNode.offsetLeft + activeNode.clientWidth / 2;
      const maxScroll = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      const targetScroll = Math.max(
        0,
        Math.min(nodeCenter - containerCenter, maxScroll),
      );

      container.scrollTo({
        left: targetScroll,
        behavior: animationsDisabled ? "auto" : "smooth",
      });
    }
  }, [
    safeActiveStageIndex,
    effectiveSlidesCount,
    isStaticMode,
    animationsDisabled,
  ]);

  if (!mounted || !config || config.slides.length === 0) {
    return <div className={styles.heroOuter}></div>;
  }

  if (
    isStaticMode &&
    config.slides.length > 1 &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn(
      `UniversalEditorialHero: heroMode="static" but ${config.slides.length} slides provided. Locking to slide 0.`,
    );
  }

  const currentSlide =
    config.slides[isStaticMode ? 0 : safeActiveStageIndex] || config.slides[0];

  const goToPrev = () => {
    if (isStaticMode) return;
    setActiveStageIndex((previous) =>
      previous === 0 ? effectiveSlidesCount - 1 : previous - 1,
    );
    setIsUserPaused(true);
  };

  const goToNext = () => {
    if (isStaticMode) return;
    setActiveStageIndex(
      (previous) => (previous + 1) % effectiveSlidesCount,
    );
    setIsUserPaused(true);
  };

  let pictureNode: React.ReactNode;
  const desktopUrl = currentSlide.metadata?.mediaUrlDesktop || (currentSlide as any).visualUrl;
  const hasImage = !!desktopUrl;
  const noMedia = currentSlide.metadata?.noMedia && !(currentSlide as any).visualUrl;

  if (hasImage && !noMedia) {
    const commonProps = {
      alt: currentSlide.metadata?.mediaAlt || (currentSlide as any).visualAltText || "Hero background",
      fill: true,
      priority: true,
      quality: 90,
    };

    const {
      props: { srcSet: desktopSrcSet, ...desktopRest },
    } = getImageProps({
      ...commonProps,
      src: desktopUrl,
    });

    let mobileSrcSet: string | undefined;
    if (currentSlide.metadata?.mediaUrlMobile) {
      const mobileImageProps = getImageProps({
        ...commonProps,
        src: currentSlide.metadata.mediaUrlMobile,
      });
      mobileSrcSet = mobileImageProps.props.srcSet;
    }

    const deskFocal =
      currentSlide.metadata?.desktopFocalPoint ||
      config.desktopFocalPoint ||
      "center center";
    const mobFocal =
      currentSlide.metadata?.mobileFocalPoint ||
      config.mobileFocalPoint ||
      deskFocal;

    pictureNode = (
      <picture className="absolute inset-0 block h-full w-full">
        {mobileSrcSet && (
          <source media="(max-width: 768px)" srcSet={mobileSrcSet} sizes="100vw" />
        )}
        <source media="(min-width: 769px)" srcSet={desktopSrcSet} sizes="100vw" />
        <img
          {...desktopRest}
          className={`h-full w-full object-cover ${styles.heroMedia}`}
          style={
            {
              "--hero-desktop-focal": deskFocal,
              "--hero-mobile-focal": mobFocal,
            } as React.CSSProperties
          }
        />
      </picture>
    );
  } else {
    pictureNode = <div className="absolute inset-0 bg-[#050A1E]"></div>;
  }

  const heightProfile = config.heroHeight || "standard";
  const overlayStrength = config.overlayStrength || "standard";
  const overlayDirection = config.overlayDirection || "left";

  const containerProps = {
    "data-hero-height": heightProfile,
    "data-overlay-strength": overlayStrength,
    "data-overlay-direction": overlayDirection,
    "data-hero-mode": config.heroMode || "carousel",
  };

  return (
    <div
      className={styles.heroOuter}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      {...containerProps}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={
              animationsDisabled
                ? { opacity: 1 }
                : { opacity: 0, scale: 1.05 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              animationsDisabled
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98 }
            }
            transition={{
              duration: animationsDisabled ? 0 : 1.2,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute inset-0"
          >
            {pictureNode}
            <div className={styles.heroOverlayBase}></div>
            <div className={styles.heroOverlayDirectional}></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.internalGrid}>
        <div className={styles.contentAreaWrapper}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={
                animationsDisabled
                  ? { opacity: 1 }
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                animationsDisabled
                  ? { opacity: 0 }
                  : { opacity: 0, y: -20 }
              }
              transition={{
                duration: animationsDisabled ? 0 : 0.6,
                ease: "easeOut",
              }}
              className={styles.contentArea}
            >
              {currentSlide.eyebrow && (
                <div className={styles.eyebrow}>
                  {currentSlide.eyebrow}
                </div>
              )}

              <h1 className={styles.headline}>
                <span className={styles.headlineLineOne}>
                  {currentSlide.titleLineOne}
                </span>
                {currentSlide.titleConnector && (
                  <span className={styles.titleConnector}>
                    {currentSlide.titleConnector}
                  </span>
                )}
                <span className={styles.headlineLineTwo}>
                  {currentSlide.titleLineTwo}
                </span>
              </h1>

              <p className={styles.description}>{currentSlide.description}</p>

              <div className={styles.buttonGroup}>
                {config.ctaEnabled !== false &&
                  currentSlide.primaryCtaLabel && (
                    <Link
                      href={currentSlide.primaryCtaUrl || "#"}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      {currentSlide.primaryCtaLabel} <ArrowRight />
                    </Link>
                  )}
                {config.ctaEnabled !== false &&
                  currentSlide.secondaryCtaLabel && (
                    <Link
                      href={currentSlide.secondaryCtaUrl || "#"}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      {currentSlide.secondaryCtaLabel}
                    </Link>
                  )}
                {config.ctaEnabled !== false &&
                  currentSlide.tertiaryLinkLabel &&
                  currentSlide.tertiaryLinkUrl && (
                    <Link
                      href={currentSlide.tertiaryLinkUrl}
                      className={`${styles.btn} ${styles.btnTertiaryLink}`}
                    >
                      {currentSlide.tertiaryLinkLabel}
                    </Link>
                  )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {navigationEnabled &&
          effectiveSlidesCount > 1 &&
          !isStaticMode && (
            <div className={styles.carouselNavWrapper}>
              <div className={styles.carouselNavScrollArea} ref={scrollRef}>
                <div className={styles.carouselNavTrack}>
                  <div className={styles.carouselNavLine}>
                    <div
                      className={styles.carouselNavLineFill}
                      style={{
                        width: `${(safeActiveStageIndex / (effectiveSlidesCount - 1 || 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {config.slides.map((slide, index) => {
                    const isPast = index < safeActiveStageIndex;
                    const isActive = index === safeActiveStageIndex;
                    let itemClass = `${styles.carouselNavItem} hero-nav-item-observe transition-opacity duration-300`;
                    if (!visibleItems.has(index) && visibleItems.size > 0) {
                      itemClass += " opacity-0 pointer-events-none";
                    }
                    if (isPast) itemClass += ` ${styles.navItemPast}`;
                    else if (isActive) itemClass += ` ${styles.navItemActive}`;
                    else itemClass += ` ${styles.navItemFuture}`;

                    return (
                      <button
                        key={`nav-item-${slide.id}`}
                        id={`hero-nav-item-${index}`}
                        data-idx={index}
                        className={itemClass}
                        onClick={() => {
                          setActiveStageIndex(index);
                          setIsUserPaused(true);
                        }}
                        aria-current={isActive ? "true" : undefined}
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        <div className={styles.carouselNavNode}></div>
                        <div className={styles.carouselNavLabel}>
                          {slide.eyebrow || slide.internalName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        {navigationEnabled &&
          effectiveSlidesCount > 1 &&
          !isStaticMode && (
            <div className={styles.mobileNavWrapper}>
              <div className={styles.mobileNavHeader}>
                <span className={styles.mobileNavCounter}>
                  {(safeActiveStageIndex + 1).toString().padStart(2, "0")} /{" "}
                  {effectiveSlidesCount.toString().padStart(2, "0")}
                </span>
                <span>{currentSlide.eyebrow || currentSlide.internalName}</span>
              </div>
              <div className={styles.mobileNavTrack}>
                <div
                  className={styles.mobileNavFill}
                  style={{
                    width: `${(safeActiveStageIndex / (effectiveSlidesCount - 1 || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

        {navigationEnabled &&
          config.floatingControlsEnabled !== false &&
          effectiveSlidesCount > 1 &&
          !isStaticMode && (
            <div className={styles.navControls}>
              <button
                onClick={goToPrev}
                className={styles.navBtn}
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setIsUserPaused((previous) => !previous)}
                className={`${styles.navBtn} ${isUserPaused ? styles.navBtnPaused : ""}`}
                aria-label={isUserPaused ? "Play" : "Pause"}
              >
                {isUserPaused ? <Play /> : <Pause />}
              </button>
              <button
                onClick={goToNext}
                className={styles.navBtn}
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
