"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaShareAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaCopy, FaCheck } from "react-icons/fa";
import Modal from "./Modal";

interface ShareCTAProps {
    title?: string;
    text?: string;
    url?: string;
    buttonLabel?: string;
}

export default function ShareCTA({
    title = "Share this page",
    text = "Check this out!",
    url,
    buttonLabel = "Share Page"
}: ShareCTAProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareUrl(url || window.location.href);
        }
    }, [url]);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        {
            name: "Facebook",
            icon: <FaFacebookF />,
            color: "bg-[#1877F2]",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "Twitter",
            icon: <FaTwitter />,
            color: "bg-[#1DA1F2]",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        },
        {
            name: "LinkedIn",
            icon: <FaLinkedinIn />,
            color: "bg-[#0A66C2]",
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp />,
            color: "bg-[#25D366]",
            href: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`
        }
    ];

    return (
        <>
            <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-primary font-black uppercase tracking-wider rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
            >
                <span className="relative z-10">{buttonLabel}</span>
                <motion.span
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <FaShareAlt className="relative z-10" />
                </motion.span>

                {/* Button Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent w-[200%] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
            </motion.button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={title}>
                <div className="space-y-6">
                    <p className="text-gray-600">Share this content with your network.</p>

                    {/* Social Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center gap-2 group`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md transition-transform transform group-hover:scale-110 ${link.color}`}>
                                    {link.icon}
                                </div>
                                <span className="text-xs font-medium text-gray-500">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="relative">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 bg-transparent border-none text-sm text-gray-600 focus:ring-0 truncate"
                            />
                            <button
                                onClick={handleCopy}
                                className={`p-2 rounded-md transition-all ${copied ? "bg-green-100 text-green-600" : "bg-white text-gray-500 hover:text-brand-primary shadow-sm"}`}
                            >
                                {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
