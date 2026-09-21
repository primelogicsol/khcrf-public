"use client";

import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";

interface Props {
  platformName: string;
  className: string;
}

export default function PlatformUpgradeButton({ platformName, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    
    // Log details as requested
    console.log("Upgrade Notification Request:", {
      email,
      platformName,
      timestamp: new Date().toISOString(),
      source: "ecosystem_visit_website_modal"
    });

    setIsSubmitted(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
      setError("");
    }, 300);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        <span>VISIT WEBSITE</span>
        <FaExternalLinkAlt className="text-[10px]" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            
            {isSubmitted ? (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div data-ui-icon className="w-16 h-16 bg-brand-primary/10  rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-brand-dark mb-4">Thank you.</h3>
                <p className="text-gray-600 leading-relaxed">
                  We will notify you when {platformName} becomes available.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-8 w-full py-4 rounded-xl bg-gray-100 text-brand-dark font-black tracking-wider text-sm uppercase hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-2xl font-black text-brand-dark mb-4 pr-8">
                  {platformName} Upgrade In Progress
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">
                  This platform is currently being upgraded as part of the KHCRF integrated ecosystem. Submit your email to be notified when access becomes available.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your email address"
                      className={`w-full px-5 py-4 rounded-xl border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary'} bg-gray-50 focus:bg-white outline-none transition-all placeholder:text-gray-400`}
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-700 font-black tracking-wider text-[12px] uppercase hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl bg-brand-primary text-white font-black tracking-wider text-[12px] uppercase hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30"
                    >
                      Notify Me
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
