"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            const timer = setTimeout(() => setShow(false), 300); // Wait for animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle Escape Key & Focus Trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!show) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden
            ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`relative w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all duration-300
                ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 id="modal-title" className="text-lg font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
