"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import Input from "@/components/common/Input";

const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Contact Info" },
    { id: 3, title: "Membership" },
    { id: 4, title: "Payment" },
];

export default function MembershipForm() {
    const router = useRouter(); // Initialize router
    const [currentStep, setCurrentStep] = useState(1);
    // ... [existing state]

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back(); // Navigate back on first step
        }
    };

    // ... [handleChange]

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                {/* TODO: Add form steps content here */}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                    <button
                        onClick={handlePrev}
                        className="flex items-center px-6 py-3 rounded-lg font-bold transition-colors text-gray-600 hover:bg-gray-100"
                    >
                        <FaArrowLeft className="mr-2" /> {currentStep === 1 ? "Back" : "Previous"}
                    </button>

                    {currentStep < 4 && (
                        <button
                            onClick={handleNext}
                            className="flex items-center bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-secondary transition-colors shadow-md"
                        >
                            Next Step <FaArrowRight className="ml-2" />
                        </button>
                    )}
                </div>
            </div >
        </div >
    );
}
