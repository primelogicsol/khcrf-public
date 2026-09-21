"use client";

import { useState } from "react";
import { FaUser, FaCertificate, FaFileUpload, FaCreditCard, FaCheck } from "react-icons/fa";
import FileChoosing from "@/components/common/FileChoosing";

export default function AccreditationForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const steps = [
        { id: 1, title: "Personal Info", icon: FaUser },
        { id: 2, title: "Certification", icon: FaCertificate },
        { id: 3, title: "Documentation", icon: FaFileUpload },
        { id: 4, title: "Payment", icon: FaCreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden font-manrope">
            {/* Progress Bar */}
            <div className="bg-gray-50 p-6 border-b border-gray-100">
                <div className="flex justify-between relative">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 z-0 transform -translate-y-1/2"></div>

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id
                                ? "bg-brand-primary border-brand-primary text-white"
                                : "bg-white border-gray-300 text-gray-400"
                                }`}>
                                {step > s.id ? <FaCheck /> : <s.icon />}
                            </div>
                            <span className={`text-xs mt-2 font-bold uppercase tracking-wider ${step >= s.id ? "text-brand-primary" : "text-gray-400"
                                }`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Steps */}
            <div className="p-8 md:p-12">
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Full Name" className="p-4 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 placeholder-gray-500" />
                            <input type="email" placeholder="Email Address" className="p-4 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 placeholder-gray-500" />
                            <input type="tel" placeholder="Phone Number" className="p-4 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 placeholder-gray-500" />
                            <input type="text" placeholder="Address" className="p-4 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 placeholder-gray-500" />
                            <div className="md:col-span-2">
                                <label className="block text-gray-800 font-bold mb-3">Entity Type</label>
                                <div className="flex gap-4">
                                    {["Artisan", "Business", "Institution"].map(type => (
                                        <label key={type} className="flex-1 cursor-pointer">
                                            <input type="radio" name="entityType" className="peer sr-only" />
                                            <div className="p-4 text-center rounded-lg border-2 border-gray-200 peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 peer-checked:text-brand-dark peer-checked:font-bold hover:bg-gray-50 transition-all text-gray-700 font-medium">
                                                {type}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Certification Details</h3>
                        <div className="space-y-4">
                            <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-brand-primary rounded accent-brand-secondary" />
                                <span className="ml-3 font-bold text-gray-800">GI Certification</span>
                            </label>
                            <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-brand-primary rounded accent-brand-secondary" />
                                <span className="ml-3 font-bold text-gray-800">Fair Trade Certification</span>
                            </label>
                            <label className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                                <input type="checkbox" className="w-5 h-5 text-brand-primary rounded accent-brand-secondary" />
                                <span className="ml-3 font-bold text-gray-800">ISO 9001 (Quality Management)</span>
                            </label>
                            <div className="mt-4">
                                <label className="block text-gray-800 font-bold mb-2">Years of Operation</label>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none text-gray-900" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in-up">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Upload Documents</h3>
                        <div className="space-y-6">
                            <FileChoosing
                                label="Registration Certificate"
                                subLabel="Upload your official registration document"
                                accept=".pdf,.jpg,.png"
                            />
                            <FileChoosing
                                label="Proof of Address"
                                subLabel="Upload a valid address proof"
                                accept=".pdf,.jpg,.png"
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in-up text-center">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Processing Fee</h3>
                        <p className="text-gray-600 mb-8">
                            A nominal processing fee of <span className="font-bold text-black">₹500</span> is required to process your accreditation application.
                        </p>
                        <button className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all w-full md:w-auto">
                            Pay & Submit Application
                        </button>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                    <button
                        onClick={handlePrev}
                        disabled={step === 1}
                        className={`px-6 py-2 rounded-lg font-bold transition-colors ${step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                        Back
                    </button>
                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-all"
                        >
                            Next Step
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
