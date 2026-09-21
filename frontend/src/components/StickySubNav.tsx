"use client";

import { useState, useEffect, ReactNode } from "react";

interface NavItem {
    id: string;
    label: string;
    icon?: React.ElementType;
}

interface StickySubNavProps {
    items: NavItem[];
}

export default function StickySubNav({ items }: StickySubNavProps) {
    const [activeId, setActiveId] = useState(items[0]?.id || "");
    const [isSticky, setIsSticky] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // Tailwind xl breakpoint is 1280px
            setIsMobile(window.innerWidth < 1280);
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Sticky logic - threshold can be adjusted
            setIsSticky(window.scrollY > 400);

            // Active section detection
            // Mobile offset: ~100px, Desktop offset: ~250px
            const currentOffset = isMobile ? 140 : 250;
            const scrollPosition = window.scrollY + currentOffset;

            for (const item of items) {
                const element = document.getElementById(item.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveId(item.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [items, isMobile]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Dynamic offset based on screen size
            // Desktop: Global Header (~100px) + Sticky Nav (~60px) + Breathing room (~20px) = 180px
            // Mobile: Sticky Nav (~60px) + Breathing room (~10px) = 70px (No global sticky header)
            const offset = isMobile ? 140 : 180;

            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveId(id); // Optimistic update
        }
    };

    return (
        <div
            className={`sticky z-40 transition-all duration-300 font-roboto ${
                // Mobile: top-0 (no sticky header), Desktop: top-100px (below sticky header)
                "top-[64px] xl:top-[100px]"
                } ${isSticky
                    ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-gray-100/50 translate-y-0 opacity-100"
                    : "bg-transparent py-4 translate-y-0 opacity-100"
                }`}
        >
            <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center space-x-2 md:space-x-4 whitespace-nowrap min-w-max md:justify-center">
                    {items.map((item) => {
                        const isActive = activeId === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`
                                    relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 shrink-0
                                    ${isActive
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105"
                                        : "bg-gray-100/50 text-gray-600 hover:bg-gray-100 hover:text-brand-dark"
                                    }
                                `}
                            >
                                {Icon && <Icon className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`} />}
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
