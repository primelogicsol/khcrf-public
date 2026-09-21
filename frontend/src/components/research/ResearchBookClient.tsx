"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookFlip, { BookPage } from "@/components/BookFlip";

// Define the shape of the topic data explicitly to ensure type safety
export interface ResearchTopic {
    id: string;
    title: string;
    subtitle: string;
    heroImage: string;
    description?: string;
    icon?: any;
    content: {
        category: string;
        tags: string[];
        richContent: React.ReactNode | React.ReactNode[];
    };
}

interface ResearchBookClientProps {
    topic: ResearchTopic | undefined;
    backLink: string;
}

export default function ResearchBookClient({ topic, backLink }: ResearchBookClientProps) {
    if (!topic) notFound();

    const { heroImage, title, subtitle, content } = topic;

    return (
        <div className="min-h-screen bg-[#2c2c2c] py-8 md:py-12 flex flex-col items-center justify-center font-serif relative">
            {/* Back Navigation - Absolute Top Left */}
            <div className="absolute top-8 left-8 z-50">
                <Link
                    href={backLink}
                    className="inline-flex items-center text-white/70 hover:text-white transition-colors font-medium font-sans text-sm tracking-wide uppercase"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </Link>
            </div>

            <BookFlip>
                {/* COVER PAGE */}
                <BookPage isCover={true}>
                    <div className="h-full flex flex-col justify-end text-stone-800">
                        <div className="absolute inset-0">
                            <Image
                                src={heroImage}
                                alt={title}
                                fill
                                className="object-cover opacity-20 sepia"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-[#fdfbf7]/90 via-[#fdfbf7]/60 to-[#fdfbf7]/90" />
                        </div>

                        <div className="relative z-10 text-center mb-20">
                            <span data-editorial-accent-text className="block font-sans text-sm font-bold tracking-[0.3em] uppercase  mb-6">{content.category}</span>
                            <h1 className="text-5xl md:text-6xl font-playfair font-black leading-tight mb-8 text-stone-900 drop-shadow-sm">
                                {title}
                            </h1>
                            <div className="w-16 h-1 bg-brand-primary mx-auto mb-8"></div>
                            <p className="text-xl font-playfair italic text-stone-600 max-w-md mx-auto">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </BookPage>

                {/* CONTENT PAGES */}
                {Array.isArray(content.richContent) ? (
                    content.richContent.map((pageContent, index) => (
                        <BookPage key={index} number={index + 1} title={title.substring(0, 20) + "..."}>
                            <div className="prose prose-stone prose-lg max-w-none prose-headings:font-playfair prose-headings:text-stone-900 prose-p:text-stone-800 prose-li:text-stone-800">
                                {/* Show tags on first content page only */}
                                {index === 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-300 pb-6">
                                        {content.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-stone-200/50 text-stone-600 text-[10px] font-sans font-bold tracking-wider uppercase rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {pageContent}
                            </div>
                        </BookPage>
                    ))
                ) : (
                    <BookPage number={1}><div className="prose prose-stone">{content.richContent}</div></BookPage>
                )}

                {/* BACK COVER */}
                <BookPage isCover={true}>
                    <div className="h-full flex items-center justify-center bg-[#fdfbf7]">
                        <span className="text-3xl text-stone-300">❦</span>
                    </div>
                </BookPage>
            </BookFlip>
        </div>
    );
}
