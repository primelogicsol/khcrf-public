"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface ActionButton {
    label: string;
    href: string;
}

interface CommonCtaProps {
    badge?: {
        icon: React.ReactNode;
        text: string;
    };
    title: {
        firstPart: string;
        highlightedPart: string;
    };
    description: string;
    primaryAction: ActionButton;
    secondaryAction?: React.ReactNode;
    footerText?: {
        primary: string;
        secondary: string;
    };
}

export default function CommonCta({
    badge,
    title,
    description,
    primaryAction,
    secondaryAction,
    footerText
}: CommonCtaProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]); // Tilt up/down
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]); // Tilt left/right

    // Dynamic shine gradient moving opposite to mouse
    const bgX = useTransform(mouseX, [-0.5, 0.5], ["40%", "60%"]);
    const bgY = useTransform(mouseY, [-0.5, 0.5], ["30%", "70%"]);

    return (
        <section className="py-24 relative overflow-hidden perspective-1000">
            {/* Background with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary opacity-95"></div>
            <div className="absolute inset-0  opacity-10 mix-blend-overlay"></div>

            {/* Floating Orbs - Smoother Animation */}
            <motion.div
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 origin-center"
            />
            <motion.div
                animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-dark/20 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3 origin-center"
            />

            <div className="container mx-auto px-4 relative z-10 perspective-1000">
                <motion.div
                    ref={cardRef}
                    initial={{ opacity: 0, y: 50, rotateX: 15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 border border-white/20 shadow-2xl overflow-hidden relative group"
                >
                    {/* Dynamic Mouse Follow Shine */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none opacity-50 bg-gradient-radial from-white/30 to-transparent blur-2xl"
                        style={{
                            left: useMotionTemplate`calc(${bgX} - 200px)`,
                            top: useMotionTemplate`calc(${bgY} - 200px)`,
                            width: "400px",
                            height: "400px",
                            position: "absolute"
                        }}
                    />

                    {/* Glass Reflection Flash on entry */}
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        whileInView={{ x: "200%", opacity: 0.3 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20" style={{ transform: "translateZ(30px)" }}>
                        <div className="space-y-6">
                            {badge && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm"
                                >
                                    {badge.icon}
                                    <span>{badge.text}</span>
                                </motion.div>
                            )}

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-4xl md:text-5xl font-black text-white font-manrope leading-tight"
                            >
                                {title.firstPart} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 drop-shadow-md">{title.highlightedPart}</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.9 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-lg text-white/90 leading-relaxed max-w-xl"
                            >
                                {description}
                            </motion.p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-end items-center">
                            <Link href={primaryAction.href}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-primary font-black uppercase tracking-wider rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
                                >
                                    <span className="relative z-10">{primaryAction.label}</span>
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <FaArrowRight className="relative z-10" />
                                    </motion.span>

                                    {/* Button Shine */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent w-[200%] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
                                </motion.div>
                            </Link>

                            {secondaryAction}

                            {footerText && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 0.8 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-white/80 text-sm font-medium text-center sm:text-left"
                                >
                                    <p>{footerText.primary}</p>
                                    <p className="opacity-70">{footerText.secondary}</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
