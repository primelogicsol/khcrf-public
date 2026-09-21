"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import {
  FaUser,
  FaHammer,
  FaHandHoldingUsd,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaShieldAlt,
  FaFileUpload,
  FaFileSignature,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import FileChoosing from "@/components/common/FileChoosing";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// --- Validation Schema ---

const grantSchema = z.object({
  // Section 1: Applicant Information
  applicantName: z.string().min(2, "Applicant Full Name is required"),
  organizationName: z.string().optional(),
  applicantType: z.enum([
    "Individual Artisan",
    "Craft-Based Enterprise",
    "Cooperative / SHG",
    "Family-Owned Craft Business",
    "Other",
  ]),
  otherApplicantType: z.string().optional(),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  email: z.string().email("Invalid email address"),
  village: z.string().min(2, "Village / Locality is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State / UT is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal Code is required"),

  // Section 2: Craft & Business Details
  primaryCraft: z.string().min(2, "Primary Craft Practiced is required"),
  experienceYears: z.string().min(1, "Years of Experience is required"),
  artisansInvolved: z.enum(["1–5", "6–10", "11–25", "25+"]),
  businessStage: z.enum([
    "Home-Based",
    "Small Workshop",
    "Registered Enterprise",
    "Cooperative Model",
  ]),
  certificationStatus: z.enum(["Yes", "No", "Applied / In Process"]),

  // Section 3: Grant Information
  grantTypes: z.array(z.string()).min(1, "Select at least one grant type"),
  grantAmount: z.string().min(1, "Grant Amount is required"),
  grantPurpose: z.array(z.string()).min(1, "Select at least one purpose"),

  // Section 4: Project Description
  briefDescription: z
    .string()
    .min(50, "Brief description must be at least 50 chars")
    .max(1000),
  projectDescription: z
    .string()
    .min(100, "Project description must be at least 100 chars")
    .max(2000),
  livelihoodImpact: z.string().min(20, "Please describe the impact"),
  heritageContribution: z.string().min(20, "Please describe the contribution"),

  // Section 5: Budget Overview
  budgetTools: z.string().optional(),
  budgetMaterials: z.string().optional(),
  budgetLabor: z.string().optional(),
  budgetMarketing: z.string().optional(),
  budgetOther: z.string().optional(),
  timeline: z.enum(["3 Months", "6 Months", "12 Months"]),

  // Section 6: Support & Compliance
  previousGrants: z.enum(["Yes", "No"]),
  previousGrantDetails: z.string().optional(),
  progressUpdates: z.enum(["Yes", "No"]),

  // Section 7: Document Uploads
  // Client-side mock validation
  uploadIdentity: z.boolean().refine((val) => val === true, {
    message: "Identity proof is required",
  }),
  uploadBusiness: z.boolean().refine((val) => val === true, {
    message: "Business proof is required",
  }),
  uploadPhotos: z.boolean().refine((val) => val === true, {
    message: "Photos are required",
  }),

  // Section 8: Declaration
  confirmTruth: z.boolean().refine((val) => val === true, {
    message: "You must declare the information is true",
  }),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to the terms" }),
  consentEvaluation: z.boolean().refine((val) => val === true, {
    message: "You must consent to evaluation",
  }),
  signatureName: z.string().min(2, "Signature Name is required"),
  date: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof grantSchema>;

const steps = [
  { id: 1, title: "Applicant", icon: FaUser },
  { id: 2, title: "Craft", icon: FaHammer },
  { id: 3, title: "Grant Info", icon: FaHandHoldingUsd },
  { id: 4, title: "Project", icon: FaProjectDiagram },
  { id: 5, title: "Budget", icon: FaMoneyBillWave },
  { id: 6, title: "Support", icon: FaShieldAlt },
  { id: 7, title: "Uploads", icon: FaFileUpload },
  { id: 8, title: "Declaration", icon: FaFileSignature },
];

const APPLICANT_TYPES = [
  "Individual Artisan",
  "Craft-Based Enterprise",
  "Cooperative / SHG",
  "Family-Owned Craft Business",
  "Other",
];
const ARTISAN_RANGES = ["1–5", "6–10", "11–25", "25+"];
const BUSINESS_STAGES = [
  "Home-Based",
  "Small Workshop",
  "Registered Enterprise",
  "Cooperative Model",
];
const CERTIFICATION_STATUS = ["Yes", "No", "Applied / In Process"];
const GRANT_TYPES = [
  "Cultural Preservation Grant",
  "Sustainability Grant",
  "Innovation Grant",
  "Technology Support Grant",
  "Market Expansion Grant",
  "Artisan Empowerment Grant",
  "Community Development Grant",
];
const GRANT_PURPOSES = [
  "Equipment / Tools",
  "Raw Material Procurement",
  "Product Development",
  "Skill Upgradation / Training",
  "Digital / Technology Adoption",
  "Marketing & Market Expansion",
  "Sustainability / Eco-friendly Practices",
];
const TIMELINES = ["3 Months", "6 Months", "12 Months"];

export default function GrantFormClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${currentPath}`);
    }
  }, [isLoading, user, router]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(grantSchema),
    defaultValues: {
      grantTypes: [],
      grantPurpose: [],
      confirmTruth: undefined,
      agreeTerms: undefined,
      consentEvaluation: undefined,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const nextStep = async () => {
    let valid = false;
    const fieldsToValidate: any[] = [];

    if (step === 1)
      fieldsToValidate.push(
        "applicantName",
        "applicantType",
        "contactNumber",
        "email",
        "village",
        "district",
        "state",
        "country",
        "postalCode",
      );
    if (step === 2)
      fieldsToValidate.push(
        "primaryCraft",
        "experienceYears",
        "artisansInvolved",
        "businessStage",
        "certificationStatus",
      );
    if (step === 3)
      fieldsToValidate.push("grantTypes", "grantAmount", "grantPurpose");
    if (step === 4)
      fieldsToValidate.push(
        "briefDescription",
        "projectDescription",
        "livelihoodImpact",
        "heritageContribution",
      );
    if (step === 5) fieldsToValidate.push("timeline");
    if (step === 6) fieldsToValidate.push("previousGrants", "progressUpdates");
    if (step === 7) valid = true;
    if (step === 8) valid = true; // Submit handles final validation

    if (fieldsToValidate.length > 0) {
      valid = await trigger(fieldsToValidate);
    } else if (step === 7) {
      valid = true;
    }

    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/grant/submit", data);
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
      showToast("Grant application submitted successfully!", "success");
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      if (error.response?.status === 401) {
        const currentPath = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${currentPath}`);
        return;
      }
      showToast(
        "Failed to submit grant application. Please try again.",
        "error",
      );
    }
  };

  const toggleSelection = (
    field: "grantTypes" | "grantPurpose",
    value: string,
  ) => {
    const current = formValues[field] || [];
    const newSelection = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setValue(field, newSelection, { shouldValidate: true });
    setValue(field, newSelection, { shouldValidate: true });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <SubmissionSuccess
        title="Grant Application Received"
        message="Your grant application has been successfully submitted and is being processed."
        referenceNumber={
          "GRANT-" +
          new Date().getFullYear() +
          "-" +
          Math.floor(Math.random() * 10000)
        }
        timeline={[
          { label: "Application Received", status: "completed" },
          { label: "Initial Screening", status: "upcoming" },
          { label: "Evaluation Committee", status: "upcoming" },
          { label: "Final Decision", status: "upcoming" },
          { label: "Disbursement", status: "upcoming" },
        ]}
        summary={[
          { label: "Applicant Name", value: watch("applicantName") || "N/A" },
          {
            label: "Grant Type",
            value: watch("grantTypes")?.[0] || "Multiple",
          },
          { label: "Amount Requested", value: watch("grantAmount") || "N/A" },
          { label: "Date", value: new Date().toLocaleDateString() },
        ]}
        primaryAction={{
          label: "Return to Grants Overview",
          href: "/business-support/grants",
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-brand-secondary p-8 text-center relative overflow-hidden">
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Business Support Grant Application
          </h2>
          <p className="text-white/90 font-medium">
            Empowering artisans to innovate, expand, and preserve.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        {/* Progress Bar */}
        <div className="mb-12 relative px-2">
          <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
          <div
            className="hidden md:block absolute top-6 left-0 h-1 bg-brand-secondary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 7) * 100}%` }}
          ></div>

          <div className="flex justify-between relative z-10">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCompleted = step > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center group cursor-default w-[12%]"
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 transform ${
                      isActive
                        ? "bg-white border-brand-secondary text-icon-on-light shadow-lg scale-110"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="text-green-500 text-[10px]" />
                    ) : (
                      <Icon
                        className={
                          isActive
                            ? "text-[10px] md:text-sm"
                            : "text-[10px] md:text-xs"
                        }
                      />
                    )}
                  </div>
                  <span
                    className={`hidden md:block mt-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 text-center ${
                      isActive ? "text-editorial-accent" : "text-gray-300"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 min-h-[400px]"
        >
          {/* Section 1: Applicant Information */}
          {step === 1 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 1: Applicant Information
              </h3>
              <Input
                label="Applicant Full Name (Primary Contact)"
                placeholder="Enter full name"
                {...register("applicantName")}
                error={errors.applicantName?.message}
              />
              <Input
                label="Organization / Business Name (If applicable)"
                placeholder="Business Name"
                {...register("organizationName")}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Type of Applicant
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {APPLICANT_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:border-brand-secondary/50"
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("applicantType")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {type === "Other" ? "Other (please specify)" : type}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.applicantType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.applicantType.message}
                  </p>
                )}
                {formValues.applicantType === "Other" && (
                  <Input
                    label="Specify Other Type"
                    className="mt-2"
                    {...register("otherApplicantType")}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Number"
                  type="number"
                  placeholder="+1234567890"
                  {...register("contactNumber")}
                  error={errors.contactNumber?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <h4 className="font-bold text-gray-700 pt-4">Complete Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Village / Locality"
                  {...register("village")}
                  error={errors.village?.message}
                />
                <Input
                  label="District"
                  {...register("district")}
                  error={errors.district?.message}
                />
                <Input
                  label="State / UT"
                  {...register("state")}
                  error={errors.state?.message}
                />
                <Input
                  label="Country"
                  {...register("country")}
                  error={errors.country?.message}
                />
                <Input
                  label="Postal Code"
                  {...register("postalCode")}
                  error={errors.postalCode?.message}
                />
              </div>
            </div>
          )}

          {/* Section 2: Craft & Business Details */}
          {step === 2 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 2: Craft & Business Details
              </h3>
              <Input
                label="Primary Craft Practiced"
                placeholder="e.g., Pashmina, Wood Carving"
                {...register("primaryCraft")}
                error={errors.primaryCraft?.message}
              />
              <Input
                label="Years of Experience in Craft / Business"
                type="number"
                {...register("experienceYears")}
                error={errors.experienceYears?.message}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Number of Artisans / Workers Involved
                </label>
                <div className="flex flex-wrap gap-4">
                  {ARTISAN_RANGES.map((range) => (
                    <label
                      key={range}
                      className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={range}
                        {...register("artisansInvolved")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {range}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.artisansInvolved && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.artisansInvolved.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Current Business Stage
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BUSINESS_STAGES.map((stage) => (
                    <label
                      key={stage}
                      className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={stage}
                        {...register("businessStage")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {stage}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.businessStage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.businessStage.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Do you hold any Craft Certification or GI-related
                  documentation?
                </label>
                <div className="flex gap-6">
                  {CERTIFICATION_STATUS.map((status) => (
                    <label
                      key={status}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={status}
                        {...register("certificationStatus")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.certificationStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.certificationStatus.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 3: Grant Information */}
          {step === 3 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 3: Grant Information
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Grant Type Applying For
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GRANT_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formValues.grantTypes?.includes(type) ? "border-brand-secondary bg-brand-secondary/5" : "border-gray-300 hover:border-gray-400 bg-white"}`}
                      onClick={() => toggleSelection("grantTypes", type)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formValues.grantTypes?.includes(type) ? "bg-brand-secondary border-brand-secondary" : "border-gray-400"}`}
                      >
                        {formValues.grantTypes?.includes(type) && (
                          <FaCheck className="text-white text-[10px]" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold ${formValues.grantTypes?.includes(type) ? "text-brand-secondary" : "text-gray-700"}`}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.grantTypes && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grantTypes.message}
                  </p>
                )}
              </div>

              <Input
                label="Grant Amount Requested"
                placeholder="Approximate range or exact amount"
                {...register("grantAmount")}
                error={errors.grantAmount?.message}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Purpose of the Grant (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GRANT_PURPOSES.map((purpose) => (
                    <label
                      key={purpose}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formValues.grantPurpose?.includes(purpose) ? "border-brand-secondary bg-brand-secondary/5" : "border-gray-300 hover:border-gray-400 bg-white"}`}
                      onClick={() => toggleSelection("grantPurpose", purpose)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formValues.grantPurpose?.includes(purpose) ? "bg-brand-secondary border-brand-secondary" : "border-gray-400"}`}
                      >
                        {formValues.grantPurpose?.includes(purpose) && (
                          <FaCheck className="text-white text-[10px]" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold ${formValues.grantPurpose?.includes(purpose) ? "text-brand-secondary" : "text-gray-700"}`}
                      >
                        {purpose}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.grantPurpose && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grantPurpose.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Project Description */}
          {step === 4 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 4: Project Description
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Brief Description of Your Business or Craft Practice
                </label>
                <p className="text-xs text-gray-500 mb-2">100–200 words</p>
                <textarea
                  {...register("briefDescription")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                  rows={4}
                ></textarea>
                {errors.briefDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.briefDescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Describe the Project for Which You Are Seeking the Grant
                </label>
                <p className="text-xs text-gray-500 mb-2">200–300 words</p>
                <textarea
                  {...register("projectDescription")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                  rows={6}
                ></textarea>
                {errors.projectDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.projectDescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  How will this grant improve your livelihood or business
                  sustainability?
                </label>
                <textarea
                  {...register("livelihoodImpact")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                  rows={4}
                ></textarea>
                {errors.livelihoodImpact && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.livelihoodImpact.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  How does your work contribute to preserving Kashmiri craft
                  heritage?
                </label>
                <textarea
                  {...register("heritageContribution")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                  rows={4}
                ></textarea>
                {errors.heritageContribution && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.heritageContribution.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 5: Budget Overview */}
          {step === 5 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 5: Budget Overview
              </h3>

              <h4 className="font-bold text-gray-700">
                Estimated Budget Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Tools / Equipment"
                  placeholder="Estimate cost"
                  {...register("budgetTools")}
                />
                <Input
                  label="Materials"
                  placeholder="Estimate cost"
                  {...register("budgetMaterials")}
                />
                <Input
                  label="Labor / Training"
                  placeholder="Estimate cost"
                  {...register("budgetLabor")}
                />
                <Input
                  label="Marketing / Outreach"
                  placeholder="Estimate cost"
                  {...register("budgetMarketing")}
                />
                <Input
                  label="Other Costs"
                  placeholder="Estimate cost"
                  {...register("budgetOther")}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Expected Timeline for Project Completion
                </label>
                <div className="flex gap-6">
                  {TIMELINES.map((time) => (
                    <label
                      key={time}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={time}
                        {...register("timeline")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {time}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.timeline && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.timeline.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 6: Support & Compliance */}
          {step === 6 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 6: Support & Compliance
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Have you received any grants or financial assistance earlier?
                </label>
                <div className="flex gap-6 mb-3">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={opt}
                        {...register("previousGrants")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.previousGrants && (
                  <p className="text-red-500 text-xs">
                    {errors.previousGrants.message}
                  </p>
                )}
                {formValues.previousGrants === "Yes" && (
                  <Input
                    label="Please mention source and year"
                    {...register("previousGrantDetails")}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Are you willing to share basic progress updates if selected?
                </label>
                <div className="flex gap-6">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={opt}
                        {...register("progressUpdates")}
                        className="text-brand-secondary focus:ring-brand-secondary accent-brand-secondary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.progressUpdates && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.progressUpdates.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 7: Document Uploads */}
          {step === 7 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 7: Document Uploads
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileChoosing
                  label="Identity Proof"
                  subLabel="Upload Aadhaar, Voter ID, etc."
                  accept=".jpg,.png,.pdf"
                  onChange={(file) =>
                    setValue("uploadIdentity", !!file, { shouldValidate: true })
                  }
                  error={errors.uploadIdentity?.message}
                />
                <FileChoosing
                  label="Craft / Business Proof"
                  subLabel="Upload registration certificate if available"
                  accept=".jpg,.png,.pdf"
                  onChange={(file) =>
                    setValue("uploadBusiness", !!file, { shouldValidate: true })
                  }
                />
                <FileChoosing
                  label="Photographs of Craft"
                  subLabel="Upload high-quality images of your work"
                  accept=".jpg,.png,.jpeg"
                  onChange={(file) =>
                    setValue("uploadPhotos", !!file, { shouldValidate: true })
                  }
                />
                <FileChoosing
                  label="Supporting Documents"
                  subLabel="Any additional docs (awards, news clippings)"
                  accept=".pdf"
                  onChange={(file) => {}} // Optional, logic can be added later
                />
              </div>
            </div>
          )}

          {/* Section 8: Declaration */}
          {step === 8 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Section 8: Declaration
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-[var(--card-left-accent)] pl-4">
                "I declare that the information provided above is true and
                accurate to the best of my knowledge. I understand that
                submission of this application does not guarantee grant approval
                and that the decision of the Hamdan Craft Revival Foundation
                will be final."
              </p>

              <div className="space-y-4 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    {...register("confirmTruth")}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I declare the information provided is true
                  </span>
                </label>
                {errors.confirmTruth && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmTruth.message}
                  </p>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    {...register("agreeTerms")}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I agree to the terms and conditions
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs">
                    {errors.agreeTerms.message}
                  </p>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    {...register("consentEvaluation")}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I consent to the use of submitted information for evaluation
                    purposes
                  </span>
                </label>
                {errors.consentEvaluation && (
                  <p className="text-red-500 text-xs">
                    {errors.consentEvaluation.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                <Input
                  label="Applicant Signature (Typed Name) *"
                  placeholder="Type full name"
                  {...register("signatureName")}
                  error={errors.signatureName?.message}
                />
                <Input
                  label="Date *"
                  type="date"
                  {...register("date")}
                  error={errors.date?.message}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                step === 1
                  ? "text-gray-300 cursor-not-allowed hidden"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-secondary"
              }`}
              disabled={step === 1}
            >
              <FaArrowLeft className="mr-2" />{" "}
              {step === 1 ? "Back" : "Previous Step"}
            </button>
            <button
              type={step === 8 ? "submit" : "button"}
              onClick={step === 8 ? undefined : nextStep}
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-brand-secondary text-white rounded-xl font-bold shadow-lg shadow-brand-secondary/20 hover:bg-brand-dark hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : step === 8 ? (
                <>
                  Submit Application <FaCheck className="ml-2" />
                </>
              ) : (
                <>
                  Next Step <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
