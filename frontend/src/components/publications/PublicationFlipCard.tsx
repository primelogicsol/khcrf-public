"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import { CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import HCRFPressCoverTemplateV1 from "./HCRFPressCoverTemplateV1";

interface PublicationFlipCardProps {
  title: string;
  subtitle?: string;
  imagePath?: string;
  link: string;
  description?: string;
  price?: number;
  category: string;
  isComingSoon?: boolean;
  canonical?: CanonicalPublicationPresentation;
}

export default function PublicationFlipCard({
  title,
  subtitle,
  imagePath,
  link,
  description,
  price,
  category,
  isComingSoon = false,
  canonical,
}: PublicationFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col h-full group">
      {/* Category Label */}
      <div className="mb-4">
        <h5 data-editorial-accent-text className="text-[11px] font-black  uppercase tracking-[0.2em] leading-tight">
          {canonical?.publicationType || category}
        </h5>
      </div>

      {/* Cover Image rendering via the Master Template Component */}
      <Link href={isComingSoon ? "#" : link} className="block relative w-full mb-5 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)]">
        <HCRFPressCoverTemplateV1 
          publicationType={canonical?.publicationType || category}
          title={title}
          subtitle={subtitle}
          year={canonical?.publicationYear || "2026"}
          publicationCode={canonical?.publicationCode}
          edition={canonical?.edition}
          isComingSoon={isComingSoon}
        />
      </Link>

      {/* Title */}
      <Link href={isComingSoon ? "#" : link}>
        <h4 className="text-brand-dark font-bold text-[17px] leading-snug mb-2 line-clamp-3 group-hover:text-brand-primary transition-colors">
          {title}
        </h4>
        {subtitle && !isComingSoon && (
          <p className="text-stone-600 text-sm leading-snug mb-3 line-clamp-2">
            {subtitle}
          </p>
        )}
      </Link>

      {/* Metadata Line */}
      <div className="mb-4">
        <p className="text-stone-500 text-[13px] font-medium">
          {isComingSoon ? subtitle : `${canonical?.series || category} • ${canonical?.publicationYear || "2026"}`}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={isComingSoon ? "#" : link}
        className={`mt-auto inline-flex items-center text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${
          isComingSoon
            ? "text-stone-400 cursor-not-allowed"
            : "text-brand-secondary group-hover:text-brand-primary"
        }`}
      >
        {isComingSoon ? "Coming Soon" : "View Publication"}
      </Link>
    </div>
  );
}
