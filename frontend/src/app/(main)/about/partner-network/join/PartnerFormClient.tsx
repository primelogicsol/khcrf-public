"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import api from "@/lib/api";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  FaBuilding,
  FaHandshake,
  FaFileContract,
  FaFileUpload,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import FileChoosing from "@/components/common/FileChoosing";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// --- Validation Schemas ---

const partnerSchema = z.object({
  // Step 1: Organization Info
  orgName: z.string().min(2, "Organization name is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required"),

  // Step 2: Collaboration Areas
  collaborationAreas: z
    .array(z.string())
    .min(1, "Please select at least one area"),
  otherArea: z.string().optional(),

  // Step 3: Proposal
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  expectedOutcomes: z.string().optional(),

  // Step 4: Collaboration Type
  collaborationType: z
    .array(z.string())
    .min(1, "Please select at least one type"),
  otherCollaboration: z.string().optional(),

  // Step 5: Documents
  supportingDoc: z.string().min(1, "Supporting document is required"),

  // Step 6: Terms
  agreeTerms: z
    .literal(true)
    .refine((val) => val === true, { message: "You must agree to the terms" }),
  futureComm: z.boolean().optional(),
});

type FormData = z.infer<typeof partnerSchema>;

const steps = [
  { id: 1, title: "Organization Info", icon: FaBuilding },
  { id: 2, title: "Collaboration Areas", icon: FaGlobe },
  { id: 3, title: "Proposal", icon: FaLightbulb },
  { id: 4, title: "Type", icon: FaHandshake },
  { id: 5, title: "Documents", icon: FaFileUpload },
  { id: 6, title: "Terms", icon: FaFileContract },
];

const COLLABORATION_AREAS = [
  "Artisan Welfare & Trade Enablemen",
  "Sustainable Livelihoods",
  "Ethical Market Access",
  "Global Market Connectivity",
  "Craft Documentation & Preservation",
  "Digital Infrastructure",
  "Fair Practices & Compliance",
  "Research & Knowledge Building",
  "Evidence-Based Strategy",
  "Authenticity & Anti-Counterfeit Systems",
];

const COLLABORATION_TYPES = [
  "Financial Support",
  "Research and Development",
  "Joint Programs and Events",
  "Product or Service Development",
  "Policy Advocacy",
  "Technical Assistance and Capacity Building",
  "Market Access and Distribution Support",
  "Digital Systems and Infrastructure",
  "Advisory and Strategic Guidance",
  "Pilot Projects and Proofs of Concept",
  "Product Photography",
  "Campaigning",
];

export default function PartnerFormClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { uploadFile, isUploading: isFileUploading } = useFileUpload();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      collaborationAreas: [],
      collaborationType: [],
      agreeTerms: undefined, // Must be explicitly checked
    },
    mode: "onChange",
  });

  const formValues = watch();

  const nextStep = async () => {
    let valid = false;
    if (step === 1)
      valid = await trigger([
        "orgName",
        "website",
        "contactName",
        "email",
        "phone",
        "country",
      ]);
    if (step === 2) valid = await trigger(["collaborationAreas"]);
    if (step === 3)
      valid = await trigger([
        "projectTitle",
        "projectDescription",
        "expectedOutcomes",
      ]); // Optional fields generally, but good to trigger if rules added
    if (step === 4) valid = await trigger(["collaborationType"]);
    if (step === 5) valid = true; // Documents are optional in this implementation

    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/partner", data);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Partnership Application Error:", error);
      if (error.response && error.response.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      // Ideally handle error state here
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (
    field: "collaborationAreas" | "collaborationType",
    value: string,
  ) => {
    const current = formValues[field] || [];
    const newSelection = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setValue(field, newSelection, { shouldValidate: true });
  };

  if (isSuccess) {
    return (
      <SubmissionSuccess
        title="Partnership Application Received"
        message="Thank you for your interest in partnering with KHCRF. We have received your proposal and will review it shortly."
        referenceNumber={`PARTNER-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`}
        timeline={[
          { label: "Application Received", status: "completed" },
          { label: "Internal Review", status: "upcoming" },
          { label: "Discussion Phase", status: "upcoming" },
          { label: "Partnership Agreement", status: "upcoming" },
          { label: "Onboarding", status: "upcoming" },
        ]}
        summary={[
          { label: "Organization", value: formValues.orgName || "N/A" },
          { label: "Contact Person", value: formValues.contactName || "N/A" },
          { label: "Country", value: formValues.country || "N/A" },
          {
            label: "Key Areas",
            value:
              formValues.collaborationAreas?.slice(0, 2).join(", ") +
                (formValues.collaborationAreas &&
                formValues.collaborationAreas.length > 2
                  ? "..."
                  : "") || "N/A",
          },
        ]}
        primaryAction={{
          label: "Return to Partner Network Page",
          href: "/about/partner-network",
        }}
        secondaryAction={{
          label: "View Collaboration Registry",
          href: "/about/partner-network/registry",
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Partner Network Application
          </h2>
          <p className="text-white/90 font-medium">
            Join us in our mission to preserve and promote traditional crafts
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        {/* Progress Bar */}
        <div className="mb-12 relative px-4">
          <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
          <div
            className="hidden md:block absolute top-7 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 5) * 100}%` }}
          ></div>

          <div className="flex justify-between relative z-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCompleted = step > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center group cursor-default w-1/6"
                >
                  <div
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full md:rounded-2xl flex items-center justify-center border-4 transition-all duration-300 transform ${
                      isActive
                        ? "bg-white border-brand-primary text-icon-on-light shadow-lg scale-110"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="text-green-500 text-xs md:text-base" />
                    ) : (
                      <Icon
                        className={
                          isActive
                            ? "text-xs md:text-lg"
                            : "text-xs md:text-base"
                        }
                      />
                    )}
                  </div>
                  <span
                    className={`hidden md:block mt-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 text-center ${
                      isActive
                        ? "text-editorial-accent translate-y-0 opacity-100"
                        : "text-gray-400 translate-y-1 opacity-70"
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
          {step === 1 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Organization Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Organization Name"
                  placeholder="Org Name"
                  {...register("orgName")}
                  error={errors.orgName?.message}
                />
                <Input
                  label="Website"
                  placeholder="https://example.com"
                  {...register("website")}
                  error={errors.website?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Name"
                  placeholder="Full Name"
                  {...register("contactName")}
                  error={errors.contactName?.message}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="email@org.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="number"
                  placeholder="+1 234 567 890"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    {...register("country")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="India">India</option>
                    <option value="UK">UK</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Areas of Collaboration
              </h3>
              <p className="text-gray-600 mb-4">
                Select the areas you are interested in collaborating on:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLLABORATION_AREAS.map((area) => (
                  <label
                    key={area}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formValues.collaborationAreas?.includes(area)
                        ? "border-brand-primary bg-brand-primary/5 shadow-md"
                        : "border-gray-100 hover:border-brand-primary/30"
                    }`}
                    onClick={() => toggleSelection("collaborationAreas", area)}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                        formValues.collaborationAreas?.includes(area)
                          ? "bg-brand-primary border-brand-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {formValues.collaborationAreas?.includes(area) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={`font-semibold ${formValues.collaborationAreas?.includes(area) ? "text-brand-primary" : "text-gray-600"}`}
                    >
                      {area}
                    </span>
                  </label>
                ))}
              </div>
              {errors.collaborationAreas && (
                <p className="text-red-500 text-sm font-bold">
                  {errors.collaborationAreas.message}
                </p>
              )}

              <div className="mt-4">
                <Input
                  label="Other (Please Specify)"
                  placeholder="e.g. Marketing, Distribution"
                  {...register("otherArea")}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Collaboration Proposal
              </h3>
              <Input
                label="Project Title"
                placeholder="Title of your proposed project"
                {...register("projectTitle")}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  {...register("projectDescription")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="Describe the scope and goals..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Expected Outcomes
                </label>
                <textarea
                  {...register("expectedOutcomes")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500"
                  placeholder="What do you hope to achieve?"
                ></textarea>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Collaboration Type
              </h3>
              <p className="text-gray-600 mb-4">
                How would you like to collaborate with us?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLLABORATION_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formValues.collaborationType?.includes(type)
                        ? "border-brand-primary bg-brand-primary/5 shadow-md"
                        : "border-gray-100 hover:border-brand-primary/30"
                    }`}
                    onClick={() => toggleSelection("collaborationType", type)}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                        formValues.collaborationType?.includes(type)
                          ? "bg-brand-primary border-brand-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {formValues.collaborationType?.includes(type) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span
                      className={`font-semibold ${formValues.collaborationType?.includes(type) ? "text-brand-primary" : "text-gray-600"}`}
                    >
                      {type}
                    </span>
                  </label>
                ))}
              </div>
              {errors.collaborationType && (
                <p className="text-red-500 text-sm font-bold">
                  {errors.collaborationType.message}
                </p>
              )}

              <div className="mt-4">
                <Input
                  label="Other (Please Specify)"
                  placeholder="Specific collaboration type"
                  {...register("otherCollaboration")}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Supporting Documents
              </h3>
              <p className="text-gray-600">
                Upload any supporting documents (Optional)
              </p>

              <FileChoosing
                label="Supporting Documents"
                subLabel="Click to upload or drag and drop (PDF only)"
                accept=".pdf"
                onChange={async (file: File | null) => {
                  if (file) {
                    try {
                      const url = await uploadFile(file);
                      if (url) {
                        setValue("supportingDoc", url);
                      }
                    } catch (err) {
                      console.error("Upload failed", err);
                      alert("File upload failed. Please try again.");
                    }
                  } else {
                    setValue("supportingDoc", "");
                  }
                }}
              />
              {isFileUploading && (
                <p className="text-sm text-brand-primary animate-pulse">
                  Uploading document...
                </p>
              )}
              {formValues.supportingDoc && !isFileUploading && (
                <p className="text-sm text-green-600 font-bold flex items-center gap-2">
                  <FaCheck /> Document Uploaded
                </p>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Terms of Collaboration
              </h3>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm text-gray-700 h-48 overflow-y-auto mb-6">
                <p className="mb-4">
                  <strong>1. Partnership Agreement:</strong> By submitting this
                  form, you acknowledge interest in partnering with KHCRF.
                </p>
                <p className="mb-4">
                  <strong>2. Confidentiality:</strong> All shared information
                  will be treated with strict confidentiality.
                </p>
                <p className="mb-4">
                  <strong>3. Compliance:</strong> Partners must adhere to KHCRF's
                  ethical standards and compliance policies.
                </p>
                <p>
                  <strong>4. Approval:</strong> Submission does not guarantee
                  partnership. All applications are subject to review by the
                  KHCRF board.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                    {...register("agreeTerms")}
                  />
                  <span className="text-gray-800 font-medium">
                    I agree to the terms and conditions *
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm font-bold ml-8">
                    {errors.agreeTerms.message}
                  </p>
                )}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                    {...register("futureComm")}
                  />
                  <span className="text-gray-800">
                    I agree to receive updates and future communications
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                step === 1
                  ? "text-gray-300 cursor-not-allowed hidden"
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
              }`}
            >
              <FaArrowLeft className="mr-2" /> Previous Step
            </button>
            <button
              type={step === 6 ? "submit" : "button"}
              onClick={step === 6 ? undefined : nextStep}
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : step === 6 ? (
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
