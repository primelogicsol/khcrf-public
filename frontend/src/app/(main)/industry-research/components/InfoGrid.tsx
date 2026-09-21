"use client";

import { IconType } from "react-icons";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface GridItem {
    title: string;
    text: string;
    link?: string;
    icon?: IconType;
}

interface InfoGridProps {
    title: string;
    items: GridItem[];
    bgClass?: string;
}

export default function InfoGrid({ title, items, bgClass = "bg-[#f8f9fa]" }: InfoGridProps) {
    return (
        <section className={`py-16 md:py-24 ${bgClass} font-manrope`}>
            <div className="container mx-auto px-4 md:px-10">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">{title}</h2>
                    <div className="w-20 h-1 bg-brand-primary mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {items.map((item, index) => (
                        <div key={index} className="bg-white p-5 md:p-8 rounded-2xl shadow-[0_5px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300 border border-gray-100 group flex flex-col h-full">
                            {item.icon && (
                                <div data-ui-icon className="w-14 h-14 bg-brand-primary/5 rounded-xl flex items-center justify-center  text-2xl mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                                    <item.icon />
                                </div>
                            )}
                            <h3 className="text-xl font-black text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                                {item.link ? <Link href={item.link}>{item.title}</Link> : item.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm grow">
                                {item.text}
                            </p>
                            {item.link && (
                                <Link href={item.link} className="mt-6 flex items-center text-sm font-bold text-icon-on-light uppercase tracking-wider hover:underline">
                                    Learn More <FaArrowRight className="ml-2" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
