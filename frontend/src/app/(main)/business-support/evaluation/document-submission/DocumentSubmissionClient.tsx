"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import { useRouter, usePathname } from "next/navigation";
import { FaChevronRight, FaChevronLeft, FaCheck } from "react-icons/fa6";
import Input from "@/components/common/Input";
import api from "@/lib/api";
import { useFileUpload } from "@/hooks/useFileUpload";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// --- Zod Schema Definition ---
const schema = z
  .object({
    // General Info
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    password: z.string().optional(),
    registerType: z.enum(["Artisan", "Business", "Institution"]),

    // Artisan Specific
    craftSpecialty: z.string().optional(),
    craftSkill: z.enum(["Expert", "Advanced", "Beginner"]).optional(),
    craftExperience: z.string().optional(),
    craftAward: z.string().optional(),
    marketArtisan: z.enum(["Local", "National", "International"]).optional(),
    craftCatalog: z.string().optional(),

    // Business Specific
    businessName: z.string().optional(),
    businessEmail: z
      .string()
      .email("Invalid business email")
      .optional()
      .or(z.literal("")),
    businessAddress: z.string().optional(),
    businessYear: z.string().optional(),
    businessType: z.string().optional(),
    businessLink: z.string().optional(),
    businessSold: z.string().optional(),
    marketBusiness: z.enum(["Local", "National", "International"]).optional(),
    businessEmployee: z.string().optional(),
    businessLicense: z.string().optional(),

    // Institution Specific
    instituteName: z.string().optional(),
    instituteEmail: z
      .string()
      .email("Invalid institution email")
      .optional()
      .or(z.literal("")),
    instituteAddress: z.string().optional(),
    instituteRep: z.string().optional(),
    repPost: z.string().optional(),
    instituteType: z.string().optional(),
    instituteLink: z.string().optional(),
    instituteMission: z.string().optional(),

    // Quality & Authenticity
    triditionalTraining: z.boolean().optional(),
    materialSource: z.string().optional(),
    craftingProcess: z.string().optional(),
    sustainablePractices: z.boolean().optional(),
    sustainablePracticesDescription: z.string().optional(),
    fairWage: z.boolean().optional(),
    genderSupport: z.boolean().optional(),
    femalePercentage: z.string().optional(),
    workplaceStandards: z.boolean().optional(),
    workplaceStandardsDescription: z.string().optional(),
    childLaborPolicy: z.boolean().optional(),

    // Certifications
    fairTradeCertification: z.boolean().optional(),
    fairTradeDocument: z.string().optional(),
    giCertification: z.boolean().optional(),
    giCertificationNumber: z.string().optional(),
    giCertificationDocument: z.string().optional(),
    blockchainCertification: z.boolean().optional(),
    blockchainCertificationDocument: z.string().optional(),

    // Consents
    qualityReviewConsent: z.enum(["yes", "no"]).optional(),
    profileDisplayConsent: z.enum(["yes", "no"]).optional(),
    complianceAcknowledgement: z.enum(["yes", "no"]).optional(),
  })
  .superRefine((data, ctx) => {
    // Conditional Validation based on Registration Type
    if (data.registerType === "Artisan") {
      if (!data.craftSpecialty)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Craft Specialty is required",
          path: ["craftSpecialty"],
        });
      if (!data.craftExperience)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Years of Experience is required",
          path: ["craftExperience"],
        });
    }
    if (data.registerType === "Business") {
      if (!data.businessName)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business Name is required",
          path: ["businessName"],
        });
    }
    if (data.registerType === "Institution") {
      if (!data.instituteName)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Institution Name is required",
          path: ["instituteName"],
        });
    }

    // Conditional Validation for dependent fields
    if (data.sustainablePractices && !data.sustainablePracticesDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Description is required if sustainable practices are selected",
        path: ["sustainablePracticesDescription"],
      });
    }
    if (data.genderSupport && !data.femalePercentage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percentage is required if gender support is selected",
        path: ["femalePercentage"],
      });
    }
    if (data.fairTradeCertification && !data.fairTradeDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certificate link is required",
        path: ["fairTradeDocument"],
      });
    }
    if (data.giCertification && !data.giCertificationDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "GI Document is required",
        path: ["giCertificationDocument"],
      });
    }
    if (data.registerType === "Artisan" && !data.craftCatalog) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Craft Catalog is required",
        path: ["craftCatalog"],
      });
    }
  });

type FormData = z.infer<typeof schema>;

const STEPS = [
  {
    title: "General Information",
    fields: ["fullName", "email", "phone", "address", "registerType"],
  },
  { title: "Profile Details", fields: [] }, // Dynamic fields based on type
  {
    title: "Quality Assurance",
    fields: [
      "materialSource",
      "craftingProcess",
      "sustainablePractices",
      "fairWage",
    ],
  },
  {
    title: "Certifications & Consent",
    fields: [
      "fairTradeCertification",
      "giCertification",
      "qualityReviewConsent",
    ],
  },
];

// Helper Component for File Upload
const FileUploadField = ({
  label,
  value,
  onChange,
  error,
  isUploading,
  accept,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  isUploading: boolean;
  accept?: string;
}) => {
  const { uploadFile, isUploading: isHookUploading } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (accept) {
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        const allowedExtensions = accept
          .split(",")
          .map((ext) => ext.trim().toLowerCase());

        if (!allowedExtensions.includes(fileExtension)) {
          alert(`Invalid file type. Please upload ${accept} files.`);
          e.target.value = "";
          return;
        }
      }

      try {
        const url = await uploadFile(file);
        onChange(url);
      } catch (err) {
        // Error handled by hook or global toast ideally
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>
      {!value ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isHookUploading || isUploading}
            className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
          />
          {isHookUploading && (
            <div data-ui-icon className="absolute right-4 top-3  animate-spin">
              <FaSpinner />
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-700 hover:underline truncate max-w-[80%] flex items-center gap-2"
          >
            <FaCheck /> Document Uploaded
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function DocumentSubmissionClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Watch fields for conditional rendering
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const registerType = watch("registerType");
  const sustainablePractices = watch("sustainablePractices");
  const genderSupport = watch("genderSupport");
  const workplaceStandards = watch("workplaceStandards");
  const fairTradeCertification = watch("fairTradeCertification");
  const giCertification = watch("giCertification");
  const blockchainCertification = watch("blockchainCertification");

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];

    if (currentStep === 0) {
      fieldsToValidate = [
        "fullName",
        "email",
        "phone",
        "address",
        "registerType",
      ];
    } else if (currentStep === 1) {
      if (registerType === "Artisan")
        fieldsToValidate = ["craftSpecialty", "craftExperience"];
      if (registerType === "Business") fieldsToValidate = ["businessName"];
      if (registerType === "Institution") fieldsToValidate = ["instituteName"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "sustainablePracticesDescription",
        "femalePercentage",
      ]; // Add conditional ones
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    } else {
      router.back();
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await api.post("/listing/create", data);

      if (response.status === 201) {
        setIsSubmitted(true);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error("Submission failed", error);
      if (error.response && error.response.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      alert("Failed to submit documentation. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <SubmissionSuccess
        title="Submission Successful"
        message="Your documentation has been submitted successfully. Our team will review your application and contact you shortly."
        referenceNumber={`DOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`}
        timeline={[
          { label: "Submission", status: "completed" },
          { label: "Technical Review", status: "upcoming" },
          { label: "Verification", status: "upcoming" },
          { label: "Approval", status: "upcoming" },
        ]}
        summary={[
          { label: "Full Name", value: watch("fullName") },
          { label: "Email", value: watch("email") },
          { label: "Type", value: watch("registerType") },
        ]}
        primaryAction={{
          label: "Return to Home",
          href: "/",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-roboto">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-8 text-white relative overflow-hidden">
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">
              Validate Your Claim
            </h1>
            <p className="text-stone-400">
              Step {currentStep + 1} of {STEPS.length}:{" "}
              {STEPS[currentStep].title}
            </p>
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-stone-800">
            <div
              className="h-full bg-brand-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
          {/* STEP 1: General Information */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-brand-primary border-b pb-2 mb-6">
                General Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />
                <Input
                  label="Email"
                  placeholder="Enter email"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <Input
                  label="Phone"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <Input
                  label="Address"
                  placeholder="Enter address"
                  {...register("address")}
                  error={errors.address?.message}
                />
              </div>

              <div className="pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Registration Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Artisan", "Business", "Institution"].map((type) => (
                    <label
                      key={type}
                      className={`cursor-pointer border-2 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-all ${registerType === type ? "border-brand-primary bg-brand-primary/5" : "border-gray-200"}`}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("registerType")}
                        className="w-5 h-5 text-brand-primary"
                      />
                      <span className="font-bold text-stone-700">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.registerType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.registerType.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Profile Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-brand-primary border-b pb-2 mb-6">
                {registerType} Details
              </h3>

              {registerType === "Artisan" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Craft Specialty"
                      placeholder="E.g. Pashmina, Carpet"
                      {...register("craftSpecialty")}
                      error={errors.craftSpecialty?.message}
                    />
                    <Input
                      label="Years of Experience"
                      type="number"
                      placeholder="Years"
                      {...register("craftExperience")}
                      error={errors.craftExperience?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Skill Level
                    </label>
                    <div className="flex gap-6 flex-wrap">
                      {["Expert", "Advanced", "Beginner"].map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={level}
                            {...register("craftSkill")}
                            className="text-brand-primary"
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>
                  <FileUploadField
                    label="Craft Catalog (Upload)"
                    value={watch("craftCatalog")}
                    onChange={(url) =>
                      setValue("craftCatalog", url, { shouldValidate: true })
                    }
                    error={errors.craftCatalog?.message}
                    isUploading={false}
                    accept=".pdf"
                  />
                </div>
              )}

              {registerType === "Business" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Business Name"
                      placeholder="Business Name"
                      {...register("businessName")}
                      error={errors.businessName?.message}
                    />
                    <Input
                      label="Items Selling"
                      placeholder="Products list"
                      {...register("businessSold")}
                      error={errors.businessSold?.message}
                    />
                  </div>
                </div>
              )}

              {registerType === "Institution" && (
                <div className="space-y-4">
                  <Input
                    label="Institution Name"
                    placeholder="Institution Name"
                    {...register("instituteName")}
                    error={errors.instituteName?.message}
                  />
                </div>
              )}

              {!registerType && (
                <p className="text-stone-500 italic">
                  Please go back and select a registration type.
                </p>
              )}
            </div>
          )}

          {/* STEP 3: Quality Assurance */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-brand-primary border-b pb-2 mb-6">
                Quality & Authenticity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Material Source
                  </label>
                  <select
                    {...register("materialSource")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="">Select source</option>
                    <option value="local">Locally sourced</option>
                    <option value="imported">Imported</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Crafting Process
                  </label>
                  <select
                    {...register("craftingProcess")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="">Select process</option>
                    <option value="traditional">Traditional Handcrafted</option>
                    <option value="partial_machine">Partial Machine</option>
                    <option value="full_machine">Full Machine</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("sustainablePractices")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I implement environmentally sustainable practices
                  </span>
                </label>
                {sustainablePractices && (
                  <div className="pl-8 animate-slideDown">
                    <textarea
                      {...register("sustainablePracticesDescription")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all h-24"
                      placeholder="Describe your practices..."
                    ></textarea>
                    {errors.sustainablePracticesDescription && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sustainablePracticesDescription.message}
                      </p>
                    )}
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("fairWage")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I ensure fair wages for all artisans and workers
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("genderSupport")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I support gender equality and inclusivity
                  </span>
                </label>
                {genderSupport && (
                  <div className="pl-8 flex items-center gap-4 animate-slideDown">
                    <label className="text-sm font-bold text-gray-700">
                      Female Workforce %:
                    </label>
                    <div className="w-24">
                      <Input
                        type="number"
                        label=""
                        placeholder="%"
                        {...register("femalePercentage")}
                        error={errors.femalePercentage?.message}
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("workplaceStandards")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I uphold safe and ethical workplace standards
                  </span>
                </label>
                {workplaceStandards && (
                  <div className="pl-8 animate-slideDown">
                    <textarea
                      {...register("workplaceStandardsDescription")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all h-24"
                      placeholder="Describe standards..."
                    ></textarea>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("childLaborPolicy")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I don't engage child labor
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("triditionalTraining")}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="text-stone-700 font-medium">
                    I preserve and practice traditional training methods
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Certifications */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-brand-primary border-b pb-2 mb-6">
                Certifications & Consent
              </h3>

              <div className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      {...register("fairTradeCertification")}
                      className="w-5 h-5 text-brand-primary rounded"
                    />
                    <span className="font-bold text-stone-900">
                      Fair Trade Certification
                    </span>
                  </label>
                  {fairTradeCertification && (
                    <div className="pl-8">
                      <FileUploadField
                        label="Upload Certificate"
                        value={watch("fairTradeDocument")}
                        onChange={(url) =>
                          setValue("fairTradeDocument", url, {
                            shouldValidate: true,
                          })
                        }
                        error={errors.fairTradeDocument?.message}
                        isUploading={false}
                        accept=".pdf"
                      />
                    </div>
                  )}
                </div>

                <div className="border p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      {...register("giCertification")}
                      className="w-5 h-5 text-brand-primary rounded"
                    />
                    <span className="font-bold text-stone-900">
                      GI Certification
                    </span>
                  </label>
                  {giCertification && (
                    <div className="pl-8 space-y-3">
                      <Input
                        label="GI User Authorization Number"
                        placeholder="Number"
                        {...register("giCertificationNumber")}
                      />
                      <FileUploadField
                        label="Upload GI Document"
                        value={watch("giCertificationDocument")}
                        onChange={(url) =>
                          setValue("giCertificationDocument", url, {
                            shouldValidate: true,
                          })
                        }
                        error={errors.giCertificationDocument?.message}
                        isUploading={false}
                        accept=".pdf"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h4 className="font-bold text-stone-900">
                    Consent Declarations
                  </h4>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-stone-700">
                      Would you agree to periodic quality reviews by Craftlore?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("qualityReviewConsent")}
                        />{" "}
                        Yes
                      </label>
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("qualityReviewConsent")}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-stone-700">
                      Do you permit Craftlore to display your profile?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("profileDisplayConsent")}
                        />{" "}
                        Yes
                      </label>
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("profileDisplayConsent")}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-stone-700">
                      Do you acknowledge compliance with KHCRF policies?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="yes"
                          {...register("complianceAcknowledgement")}
                        />{" "}
                        Yes
                      </label>
                      <label className="flex gap-2">
                        <input
                          type="radio"
                          value="no"
                          {...register("complianceAcknowledgement")}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              <FaChevronLeft /> {currentStep === 0 ? "Back" : "Previous"}
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-1"
              >
                Next Step <FaChevronRight />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-10 rounded hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Submit Application <FaCheck />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
