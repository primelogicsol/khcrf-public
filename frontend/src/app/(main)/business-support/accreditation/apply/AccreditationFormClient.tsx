"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input"; // Helper we used before
import {
  FaUser,
  FaCertificate,
  FaFileUpload,
  FaCreditCard,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import CertificationCardLayout from "@/components/business-support/CertificationCardLayout";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import FileChoosing from "@/components/common/FileChoosing";
import api from "@/lib/api";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// --- Zod Schemas ---

const step1Schema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  emailAddress: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  businessAddress: z.string().min(1, "Address is required"),
});

const step2Schema = z.object({
  badges: z.array(z.string()).min(1, "Select at least one badge"),
});

const step3Schema = z.object({
  businessDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  productionMethods: z
    .string()
    .min(10, "Method description must be at least 10 characters"),
  documentation: z
    .array(z.string())
    .min(1, "Please upload at least one document"),
  otherDocumentation: z.string().optional(),
  // File upload validation is tricky on client-only mock, we'll simulate it or just require non-empty list if implementing real upload
  certification: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must certify the information is accurate",
    ),
});

// Combined Schema for final submission (though we validate per step usually)
// For simplicity in this wizard, we often validate per-step before moving 'step' state.

const BADGE_OPTIONS = [
  "Authentic Craftsmanship",
  "Ethical Trade and Fair Wages",
  "Sustainable Practices",
  "Cultural Preservation",
  "Innovative Craft Design",
  "Women Empowerment",
  "Innovation in Craft Technology",
  "Community Development",
  "Craft Research",
];

const DOC_OPTIONS = [
  "Product Catalog",
  "Financial Statements",
  "Sustainability Reports",
];

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema>;

export default function AccreditationFormClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${currentPath}`);
    }
  }, [isLoading, user, router]);

  // We can use a single giant form or per-step forms.
  // Single form is easier for state preservation.
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      badges: [],
      documentation: [],
      certification: false,
    },
  });

  const categories = watch("badges");
  const docs = watch("documentation") || [];

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger([
        "businessName",
        "contactPerson",
        "emailAddress",
        "phoneNumber",
        "businessAddress",
      ]);
    } else if (step === 2) {
      isValid = await trigger("badges");
    } else if (step === 3) {
      isValid = await trigger([
        "businessDescription",
        "productionMethods",
        "certification",
      ]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [existingApplication, setExistingApplication] = useState<any>(null);

  React.useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        const response = await api.get("/accreditation/my-applications");
        if (response.data && response.data.length > 0) {
          // Check the latest application status
          const latestApp = response.data[0];
          if (
            latestApp.status === "PENDING" ||
            latestApp.status === "APPROVED"
          ) {
            setExistingApplication(latestApp);
          }
        }
      } catch (error) {
        console.error("Error fetching existing applications:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkExistingApplication();
  }, []);

  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/accreditation/submit", data);
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Accreditation Submission Error:", error);
      if (error.response?.status === 401) {
        const currentPath = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${currentPath}`);
        return;
      }
      // Ideally show toast error here
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking
  if (checkingStatus || isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  // Show status view if active application exists
  if (existingApplication) {
    return (
      <SubmissionSuccess
        title={
          existingApplication.status === "APPROVED"
            ? "You are Accredited!"
            : "Application Under Review"
        }
        message={`You have an existing application with status: ${existingApplication.status}. You cannot submit a new one at this time.`}
        referenceNumber={existingApplication.id}
        timeline={[
          { label: "Application Received", status: "completed" },
          {
            label: "Document Verification",
            status:
              existingApplication.status === "APPROVED"
                ? "completed"
                : "current",
          },
          { label: "Site Audit", status: "upcoming" },
          {
            label: "Certification Grant",
            status:
              existingApplication.status === "APPROVED"
                ? "completed"
                : "upcoming",
          },
        ]}
        summary={[
          {
            label: "Business Name",
            value: existingApplication.businessName || "N/A",
          },
          { label: "Status", value: existingApplication.status },
        ]}
        primaryAction={{
          label: "View Application Details",
          href: `/profile/accreditations/${existingApplication.id}`,
        }}
        secondaryAction={{
          // Optional: if they want to go back to main dashboard
          label: "Return to Dashboard",
          href: "/business-support",
        }}
      />
    );
  }

  if (isSuccess) {
    return (
      <SubmissionSuccess
        title="Accreditation Application Submitted"
        message="Your application for accreditation has been received. Our team will verify your details."
        referenceNumber={"ACCR-" + String(Date.now()).slice(-6)}
        timeline={[
          { label: "Application Received", status: "completed" },
          { label: "Document Verification", status: "upcoming" },
          { label: "Site Audit", status: "upcoming" },
          { label: "Certification Grant", status: "upcoming" },
        ]}
        summary={[
          { label: "Business Name", value: watch("businessName") || "N/A" },
          { label: "Contact Person", value: watch("contactPerson") || "N/A" },
          { label: "Email", value: watch("emailAddress") },
          {
            label: "Badges Requested",
            value: String(watch("badges")?.length || 0),
          },
        ]}
        primaryAction={{
          label: "Return to Dashboard",
          href: "/business-support",
        }}
      />
    );
  }

  return (
    <CertificationCardLayout
      title="Accreditation Application"
      subtitle="Apply for KHCRF Recognition Badge"
      maxWidth="max-w-5xl"
    >
      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="absolute top-7 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-7 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {[1, 2, 3, 4].map((s, i) => {
            const titles = [
              "Business Info",
              "Badge Selection",
              "Supporting Docs",
              "Review & Pay",
            ];
            const icons = [FaUser, FaCertificate, FaFileUpload, FaCreditCard];
            const Icon = icons[i];
            const isActive = step >= s;
            const isCompleted = step > s;

            return (
              <div
                key={s}
                className="flex flex-col items-center group cursor-default"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 transform ${
                    isActive
                      ? "bg-white border-brand-primary text-icon-on-light shadow-lg scale-110"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <Icon className={isActive ? "text-xl" : "text-lg"} />
                  )}
                </div>
                <span
                  className={`mt-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                    isActive
                      ? "text-editorial-accent translate-y-0 opacity-100"
                      : "text-gray-400 translate-y-1 opacity-70"
                  }`}
                >
                  {titles[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[400px]">
        {/* --- Step 1: Business Information --- */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Business Details
              </h3>
              <p className="text-gray-500">
                Tell us about your organization to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Registered Business Name"
                placeholder="e.g. Kashmiri Looms Pvt Ltd"
                {...register("businessName")}
                error={errors.businessName?.message}
                className="bg-gray-50/50 focus:bg-white"
              />
              <Input
                label="Contact Person"
                placeholder="Full Legal Name"
                {...register("contactPerson")}
                error={errors.contactPerson?.message}
                className="bg-gray-50/50 focus:bg-white"
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="contact@business.com"
                {...register("emailAddress")}
                error={errors.emailAddress?.message}
                className="bg-gray-50/50 focus:bg-white"
              />
              <Input
                label="Phone Number"
                type="number"
                placeholder="+91"
                {...register("phoneNumber")}
                error={errors.phoneNumber?.message}
                className="bg-gray-50/50 focus:bg-white"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  className={`w-full p-4 rounded-xl border ${errors.businessAddress ? "border-red-500" : "border-gray-300"} bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none shadow-sm`}
                  rows={3}
                  placeholder="Enter complete registered address"
                  {...register("businessAddress")}
                ></textarea>
                {errors.businessAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessAddress.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Step 2: Badge Selection --- */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Choose Accreditation
              </h3>
              <p className="text-gray-500">
                Select the badges that align with your business practices. You
                can select multiple.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BADGE_OPTIONS.map((badge) => {
                const isSelected = categories?.includes(badge);
                return (
                  <label
                    key={badge}
                    className={`
                                        relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
                                        ${
                                          isSelected
                                            ? "border-brand-primary bg-brand-primary/5 shadow-brand-primary/10 shadow-lg scale-[1.02]"
                                            : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-md"
                                        }
                                    `}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}
                      >
                        {isSelected ? (
                          <FaCheck className="text-sm" />
                        ) : (
                          <FaCertificate />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        value={badge}
                        {...register("badges")}
                        className="hidden" // Hiding default checkbox for custom UI
                      />
                    </div>
                    <span
                      className={`font-bold text-lg leading-tight transition-colors ${isSelected ? "text-brand-secondary" : "text-gray-700"}`}
                    >
                      {badge}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.badges && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-headShake">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="font-bold text-sm">
                  {errors.badges.message}
                </span>
              </div>
            )}
          </div>
        )}

        {/* --- Step 3: Supporting Docs --- */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Documentation
              </h3>
              <p className="text-gray-500">
                Provide proof of your claims to expedite the verification
                process.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Business Activities
                  </label>
                  <textarea
                    {...register("businessDescription")}
                    rows={6}
                    className={`w-full p-4 rounded-xl border ${errors.businessDescription ? "border-red-500" : "border-gray-300"} bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none shadow-sm`}
                    placeholder="Briefly describe your main business activities, history, and mission..."
                  ></textarea>
                  {errors.businessDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Production Ethics
                  </label>
                  <textarea
                    {...register("productionMethods")}
                    rows={6}
                    className={`w-full p-4 rounded-xl border ${errors.productionMethods ? "border-red-500" : "border-gray-300"} bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none shadow-sm`}
                    placeholder="Explain your production methods, sourcing of materials, and labor practices..."
                  ></textarea>
                  {errors.productionMethods && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.productionMethods.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFileUpload data-ui-icon  className="" /> Required
                    Attachments
                  </h4>
                  <div className="space-y-3">
                    {DOC_OPTIONS.map((doc) => (
                      <label
                        key={doc}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-brand-primary/30 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={doc}
                          {...register("documentation")}
                          className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                        />
                        <span className="text-gray-700 font-medium">{doc}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Additional Documents"
                      placeholder="e.g. Award Certificates"
                      {...register("otherDocumentation")}
                      className="bg-white"
                    />
                  </div>
                </div>

                <FileChoosing
                  label="Upload Required Files"
                  subLabel="Drag & drop or click to browse (PDF only)"
                  accept=".pdf"
                  onChange={(file: File | null) => {
                    // Logic to handle file selection, e.g., setValue('documentation', ...)
                    // For now just mock visual feedback as this is a client-side mock
                  }}
                />
              </div>
            </div>

            <label className="flex items-start p-6 bg-brand-secondary/5 border border-brand-secondary/20 rounded-2xl cursor-pointer hover:bg-brand-secondary/10 transition-colors">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  {...register("certification")}
                  className="w-5 h-5 text-brand-secondary rounded border-gray-300 focus:ring-brand-secondary"
                />
              </div>
              <div className="ml-4">
                <span className="block text-sm font-bold text-gray-900">
                  Declaration of Truth
                </span>
                <span className="block text-sm text-gray-600 mt-1">
                  I hereby declare that the information provided is true and
                  accurate. I verify that our business practices align with KHCRF
                  standards.
                </span>
              </div>
            </label>
            {errors.certification && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-14">
                {errors.certification.message}
              </p>
            )}
          </div>
        )}

        {/* --- Step 4: Review & Payment --- */}
        {step === 4 && (
          <div className="animate-fade-in-up py-8">
            <div className="max-w-xl mx-auto text-center space-y-8">
              <div className="relative">
                
                <div className="relative w-28 h-28 bg-white border-8 border-gray-50 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <FaCreditCard data-ui-icon  className="text-5xl " />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  Review & Pay
                </h3>
                <p className="text-gray-500">
                  Securely complete your application.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-left space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-500 uppercase tracking-widest font-bold border-b border-gray-100 pb-2">
                  <span>Order Summary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-lg">
                    Accreditation Fee
                  </span>
                  <span className="font-bold text-gray-900 text-xl">
                    ₹500.00
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Badges Selected</span>
                  <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {categories?.length || 0}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="font-black text-gray-900 text-lg">
                    Total Payable
                  </span>
                  <span className="font-black text-brand-primary text-3xl">
                    ₹500
                  </span>
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-lg text-center">
                  SSL ES 256-bit Encrypted Payment
                </div>
              </div>

              <RazorpayCheckout
                amount={500}
                currency="INR"
                name="Accreditation Application"
                description="Application Fee"
                prefill={{
                  name: watch("contactPerson") || "",
                  email: watch("emailAddress") || "",
                  contact: watch("phoneNumber") || "",
                }}
                notes={{
                  businessName: watch("businessName"),
                  contactPerson: watch("contactPerson"),
                  email: watch("emailAddress"),
                  type: "ACCREDITATION_FEE",
                }}
                onSuccess={(data: any) => {
                  console.log("Payment Successful", data);
                  // Trigger the actual form submission
                  onSubmit(watch());
                }}
                onFailure={(error: any) =>
                  alert("Payment Failed. Please try again.")
                }
                renderButton={(
                  triggerPayment: () => void,
                  isLoading: boolean,
                ) => (
                  <button
                    type="button"
                    onClick={() => triggerPayment()}
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-brand-primary text-white text-xl font-bold py-5 rounded-2xl shadow-xl hover:bg-brand-primary/90 hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                  >
                    {isSubmitting || isLoading ? (
                      <>Processing Payment...</>
                    ) : (
                      <>
                        Complete Payment{" "}
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              />
            </div>
          </div>
        )}

        {/* --- Bottom Navigation --- */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-colors ${
              step === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <FaArrowLeft /> Back
          </button>

          {step < 4 && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                Step {step} of 4
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Continue <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </form>
    </CertificationCardLayout>
  );
}
