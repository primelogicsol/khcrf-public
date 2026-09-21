"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";

const baseSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    registerType: z.enum(["Artisan", "Business", "Institution"] as const),
    sustainablePractices: z.boolean().optional(),
    sustainableDescription: z.string().optional(),
    fairTrade: z.boolean().optional(),
    fairTradeDoc: z.boolean().optional(), // Checking if doc uploaded not implemented, just boolean for now

    // Artisan
    craftSpecialty: z.string().optional(),
    craftExperience: z.string().optional(),

    // Business
    businessName: z.string().optional(),
    businessType: z.string().optional(),

    // Institution
    instituteName: z.string().optional(),
    instituteMission: z.string().optional(),
});

// Refinement to ensure type-specific fields are filled could be added here, 
// but for simplicity/flexibility I'll rely on UI required fields or specific schema checks if needed.
// For now, base schema with standard validations is sufficient for this "Migration" task 
// which focuses on Success UI and structure.

type BusinessRegistrationData = z.infer<typeof baseSchema>;

export default function BusinessRegistrationForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<BusinessRegistrationData>({
        resolver: zodResolver(baseSchema),
        defaultValues: {
            registerType: undefined
        }
    });

    const registerType = watch("registerType");
    const formData = watch();
    const showSustainableDesc = watch("sustainablePractices");

    const onSubmit = async (data: BusinessRegistrationData) => {
        console.log("Submitting Form Data:", data);
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    if (isSubmitted) {
        return (
            <SubmissionSuccess
                title="Registration Application Submitted"
                message="Thank you for registering with Hamadan Craft Revival Foundation - Kashmir. Your application is under review."
                referenceNumber={"REG-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000)}
                timeline={[
                    { label: "Application Submitted", status: "completed" },
                    { label: "Document Verification", status: "upcoming" },
                    { label: "Compliance Check", status: "upcoming" },
                    { label: "Registration Approval", status: "upcoming" }
                ]}
                summary={[
                    { label: "Name", value: formData.fullName },
                    { label: "Email", value: formData.email },
                    { label: "Type", value: formData.registerType },
                    { label: "Date", value: new Date().toLocaleDateString() }
                ]}
                primaryAction={{
                    label: "Return to Home",
                    href: "/"
                }}
            />
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 font-manrope">
            {/* General Information */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">General Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                        <input
                            type="text"
                            {...register("fullName")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none text-gray-900"
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none text-gray-900"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Contact Number</label>
                        <input
                            type="tel"
                            {...register("phone")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none text-gray-900"
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Address</label>
                        <input
                            type="text"
                            {...register("address")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/50 outline-none text-gray-900"
                            placeholder="Enter address"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Registration Type</label>
                    <div className="flex flex-wrap gap-4">
                        {["Artisan", "Business", "Institution"].map((type) => (
                            <label key={type} className={`cursor-pointer px-6 py-3 rounded-lg border transition-all font-medium ${registerType === type ? "bg-brand-primary text-white border-brand-primary shadow-md" : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300"}`}>
                                <input
                                    type="radio"
                                    value={type}
                                    {...register("registerType")}
                                    className="hidden"
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    {errors.registerType && <p className="text-red-500 text-xs mt-2">{errors.registerType.message}</p>}
                </div>
            </div>

            {/* Artisan Section */}
            {registerType === "Artisan" && (
                <div className="mb-8 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-[#229bd4] mb-6 border-b pb-2">Artisan Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Craft Specialty</label>
                            <input type="text" {...register("craftSpecialty")} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Pashmina, Wood Carving" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                            <input type="number" {...register("craftExperience")} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 20" />
                        </div>
                    </div>
                </div>
            )}

            {/* Business Section */}
            {registerType === "Business" && (
                <div className="mb-8 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-[#229bd4] mb-6 border-b pb-2">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                            <input type="text" {...register("businessName")} className="w-full px-4 py-2 border rounded-lg" placeholder="Company Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                            <select {...register("businessType")} className="w-full px-4 py-2 border rounded-lg">
                                <option value="">Select Type</option>
                                <option value="Sole Proprietorship">Sole Proprietorship</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Private Limited">Private Limited</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Institution Section */}
            {registerType === "Institution" && (
                <div className="mb-8 animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-[#229bd4] mb-6 border-b pb-2">Institution Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Institution Name</label>
                            <input type="text" {...register("instituteName")} className="w-full px-4 py-2 border rounded-lg" placeholder="Institute Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mission</label>
                            <textarea {...register("instituteMission")} className="w-full px-4 py-2 border rounded-lg" placeholder="Brief mission statement"></textarea>
                        </div>
                    </div>
                </div>
            )}

            {/* Quality Assurance (Simplified for MVP) */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Quality & Authenticity</h3>

                <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" {...register("sustainablePractices")} className="w-5 h-5 text-brand-primary rounded" />
                        <span className="text-gray-700">We implement sustainable practices</span>
                    </label>

                    {showSustainableDesc && (
                        <textarea {...register("sustainableDescription")} className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Describe your sustainable practices..."></textarea>
                    )}

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" {...register("fairTrade")} className="w-5 h-5 text-brand-primary rounded" />
                        <span className="text-gray-700">Fair Trade Certified</span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-secondary transition-colors text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Processing..." : "Submit Registration"}
            </button>
        </form>
    );
}
