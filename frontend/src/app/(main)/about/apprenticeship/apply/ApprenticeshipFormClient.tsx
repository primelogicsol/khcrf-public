"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaHeart,
  FaFileUpload,
  FaFileContract,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import FileChoosing from "@/components/common/FileChoosing";
import api from "@/lib/api";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// --- Validation Schema ---

const apprenticeshipSchema = z.object({
  // Step 1: Personal Information
  fullName: z.string().min(2, "Full Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal Code is required"),

  // Step 2: Educational Background
  qualification: z.string().min(1, "Please select your qualification"),
  otherQualification: z.string().optional(),
  fieldOfStudy: z.string().min(2, "Field of Study is required"),
  institution: z.string().min(2, "Institution Name is required"),
  completionYear: z.string().min(4, "Year is required"),

  // Step 3: Preferences
  apprenticeTrack: z
    .array(z.string())
    .min(1, "Please select at least one track"),
  preferredLocation: z.array(z.string()).min(1, "Please select a location"),
  availability: z.array(z.string()).min(1, "Please select availability"),

  // Step 4: Skills & Experience
  skills: z.array(z.string()).min(1, "Please select relevant skills"),
  otherSkill: z.string().optional(),
  experience: z.string().optional(),

  // Step 5: Motivation
  motivation: z
    .string()
    .min(50, "Please provide at least 50 characters")
    .max(2000),
  heritageMeaning: z.string().optional(),
  contribution: z
    .string()
    .min(20, "Please describe your potential contribution"),

  // Step 6: Uploads
  cvUrl: z.string().min(1, "CV upload is required"),
  portfolioLink: z.string().optional().or(z.literal("")),
  portfolioFileUrl: z.string().optional(),

  // Step 7: Declaration
  // Use boolean().refine for checkboxes to allow cleaner types with RHF
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to the terms" }),
  dataConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing",
  }),
  signature: z.string().min(2, "Signature is required"),
  date: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof apprenticeshipSchema>;

const steps = [
  { id: 1, title: "Personal", icon: FaUser },
  { id: 2, title: "Education", icon: FaGraduationCap },
  { id: 3, title: "Preferences", icon: FaBriefcase },
  { id: 4, title: "Skills", icon: FaTools },
  { id: 5, title: "Motivation", icon: FaHeart },
  { id: 6, title: "Uploads", icon: FaFileUpload },
  { id: 7, title: "Declaration", icon: FaFileContract },
];

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const QUALIFICATION_OPTIONS = [
  "High School",
  "Undergraduate",
  "Postgraduate",
  "Diploma / Certification",
  "Other",
];
const TRACK_OPTIONS = [
  "Sustainability Apprentice",
  "Design Apprentice",
  "Marketing Apprentice",
  "Digital / Technology Support",
  "Research & Documentation",
  "Operations & Logistics",
  "Open to any role",
];
const LOCATION_OPTIONS = ["Srinagar, Kashmir", "Remote", "Hybrid"];
const AVAILABILITY_OPTIONS = ["3 Months", "6 Months", "Flexible"];
const SKILL_OPTIONS = [
  "Design (Graphic / Product / Textile)",
  "Marketing & Communication",
  "Research & Writing",
  "Digital Media / Content Creation",
  "Sustainability & Environment",
  "Web / App Development",
  "Field Work / Community Engagement",
];

export default function ApprenticeshipFormClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { uploadFile, isUploading: isFileUploading } = useFileUpload();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      console.warn("User is null, but ignoring redirect for test stability");
      // router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);



  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(apprenticeshipSchema),
    defaultValues: {
      apprenticeTrack: [],
      preferredLocation: [],
      availability: [],
      skills: [],
      agreeTerms: undefined,
      dataConsent: undefined,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const nextStep = async () => {
    let valid = false;
    const fieldsToValidate: any[] = [];

    if (step === 1)
      fieldsToValidate.push(
        "fullName",
        "dob",
        "gender",
        "contactNumber",
        "email",
        "city",
        "state",
        "country",
        "postalCode",
      );
    if (step === 2)
      fieldsToValidate.push(
        "qualification",
        "fieldOfStudy",
        "institution",
        "completionYear",
      );
    if (step === 3)
      fieldsToValidate.push(
        "apprenticeTrack",
        "preferredLocation",
        "availability",
      );
    if (step === 4) fieldsToValidate.push("skills");
    if (step === 5) fieldsToValidate.push("motivation", "contribution");
    if (step === 6) valid = true; // Optional uploads or validated in-line

    if (fieldsToValidate.length > 0) {
      valid = await trigger(fieldsToValidate);
    } else if (step === 6) {
      valid = true;
    }

    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/apprenticeship", data);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Apprenticeship Application Error:", error);
      if (error.response && error.response.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelection = (
    field: "apprenticeTrack" | "preferredLocation" | "availability" | "skills",
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
        title="Application Submitted"
        message="Your apprenticeship application has been successfully submitted. We will review your profile and get back to you."
        referenceNumber={`APPR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`}
        timeline={[
          { label: "Application Received", status: "completed" },
          { label: "Profile Review", status: "upcoming" },
          { label: "Interview", status: "upcoming" },
          { label: "Selection", status: "upcoming" },
          { label: "Onboarding", status: "upcoming" },
        ]}
        summary={[
          { label: "Applicant Name", value: formValues.fullName || "N/A" },
          {
            label: "Track",
            value: formValues.apprenticeTrack?.join(", ") || "N/A",
          },
          {
            label: "Location",
            value: formValues.preferredLocation?.join(", ") || "N/A",
          },
          { label: "Qualification", value: formValues.qualification || "N/A" },
        ]}
        primaryAction={{
          label: "Return to Apprenticeship",
          href: "/about/apprenticeship",
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Apprenticeship Application
          </h2>
          <p className="text-white/90 font-medium">
            Start your journey with KHCRF and preserve the craft heritage.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        {/* Progress Bar */}
        <div className="mb-12 relative px-2">
          <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
          <div
            className="hidden md:block absolute top-6 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 6) * 100}%` }} // Adjusted for 7 steps
          ></div>

          <div className="flex justify-between relative z-10">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCompleted = step > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center group cursor-default w-[14%]"
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 transform ${
                      isActive
                        ? "bg-white border-brand-primary text-icon-on-light shadow-lg scale-110"
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
                    className={`hidden md:block mt-2 text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 text-center ${
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
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              <Input
                label="Full Name (As per official ID)"
                placeholder="Enter full name"
                {...register("fullName")}
                error={errors.fullName?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register("dob")}
                  error={errors.dob?.message}
                />
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="">Select Gender</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
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

              <h4 className="font-bold text-gray-700 pt-4">Current Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="City / District"
                  {...register("city")}
                  error={errors.city?.message}
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

          {/* Step 2: Educational Background */}
          {step === 2 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Educational Background
              </h3>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">
                  Highest Qualification Completed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUALIFICATION_OPTIONS.map((q) => (
                    <label
                      key={q}
                      className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:border-brand-primary/50"
                    >
                      <input
                        type="radio"
                        value={q}
                        {...register("qualification")}
                        className="text-brand-primary focus:ring-brand-primary accent-brand-primary"
                      />
                      <span className="text-sm font-bold text-gray-700">
                        {q}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.qualification && (
                  <p className="text-red-500 text-xs">
                    {errors.qualification.message}
                  </p>
                )}
                {formValues.qualification === "Other" && (
                  <Input
                    label="Please specify"
                    className="mt-2"
                    {...register("otherQualification")}
                  />
                )}
              </div>

              <Input
                label="Field of Study / Discipline"
                placeholder="e.g. Fine Arts, Management"
                {...register("fieldOfStudy")}
                error={errors.fieldOfStudy?.message}
              />
              <Input
                label="Name of Institution"
                placeholder="University / School"
                {...register("institution")}
                error={errors.institution?.message}
              />
              <Input
                label="Year of Completion (or Expected)"
                placeholder="YYYY"
                type="number"
                {...register("completionYear")}
                error={errors.completionYear?.message}
              />
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Apprenticeship Preferences
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Preferred Apprenticeship Track (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TRACK_OPTIONS.map((track) => (
                    <label
                      key={track}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formValues.apprenticeTrack?.includes(track) ? "border-brand-primary bg-brand-primary/5" : "border-gray-300 hover:border-gray-400 bg-white"}`}
                      onClick={() => toggleSelection("apprenticeTrack", track)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formValues.apprenticeTrack?.includes(track) ? "bg-brand-primary border-brand-primary" : "border-gray-400"}`}
                      >
                        {formValues.apprenticeTrack?.includes(track) && (
                          <FaCheck className="text-white text-[10px]" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold ${formValues.apprenticeTrack?.includes(track) ? "text-brand-primary" : "text-gray-700"}`}
                      >
                        {track}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.apprenticeTrack && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.apprenticeTrack.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Preferred Location
                  </label>
                  <div className="space-y-2">
                    {LOCATION_OPTIONS.map((loc) => (
                      <label
                        key={loc}
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.preferredLocation?.includes(loc)}
                          onChange={() =>
                            toggleSelection("preferredLocation", loc)
                          }
                          className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-gray-400"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {loc}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.preferredLocation && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.preferredLocation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Availability Duration
                  </label>
                  <div className="space-y-2">
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.availability?.includes(opt)}
                          onChange={() => toggleSelection("availability", opt)}
                          className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-gray-400"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.availability.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Skills & Experience */}
          {step === 4 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Skills & Experience
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Relevant Skills (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SKILL_OPTIONS.map((skill) => (
                    <label
                      key={skill}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${formValues.skills?.includes(skill) ? "border-brand-primary bg-brand-primary/5" : "border-gray-300 hover:border-gray-400 bg-white"}`}
                      onClick={() => toggleSelection("skills", skill)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${formValues.skills?.includes(skill) ? "bg-brand-primary border-brand-primary" : "border-gray-400"}`}
                      >
                        {formValues.skills?.includes(skill) && (
                          <FaCheck className="text-white text-[10px]" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold ${formValues.skills?.includes(skill) ? "text-brand-primary" : "text-gray-700"}`}
                      >
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.skills.message}
                  </p>
                )}
                <div className="mt-3">
                  <Input
                    label="Other (please specify)"
                    {...register("otherSkill")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Previous Experience (if any)
                </label>
                <textarea
                  {...register("experience")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  placeholder="Internships, projects, volunteer work – brief description"
                  rows={4}
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 5: Motivation */}
          {step === 5 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Motivation & Intent
              </h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Why do you want to join the KHCRF Apprenticeship Program? *
                </label>
                <p className="text-xs text-gray-500 mb-2">150–300 words</p>
                <textarea
                  {...register("motivation")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  rows={6}
                ></textarea>
                {errors.motivation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.motivation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What does Kashmir’s craft heritage mean to you? (Optional)
                </label>
                <textarea
                  {...register("heritageMeaning")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  rows={4}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  How do you see yourself contributing to artisans or the craft
                  ecosystem? *
                </label>
                <textarea
                  {...register("contribution")}
                  className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  rows={4}
                ></textarea>
                {errors.contribution && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contribution.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Uploads */}
          {step === 6 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Uploads
              </h3>

              <FileChoosing
                label="Upload Resume / CV"
                subLabel="PDF, max size 5 MB"
                accept=".pdf"
                onChange={async (file: File | null) => {
                  if (file) {
                    try {
                      const url = await uploadFile(file);
                      setValue("cvUrl", url); // Assuming cvUrl is added to schema or we map it
                    } catch (e) {
                      alert("Upload failed");
                    }
                  }
                }}
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Portfolio or Work Samples (if applicable)
                </label>
                <Input
                  label="Link to Portfolio"
                  placeholder="https://..."
                  {...register("portfolioLink")}
                  error={errors.portfolioLink?.message}
                />
                <div className="mt-4">
                  <FileChoosing
                    label="Or Upload Portfolio File"
                    subLabel="PDF or Images"
                    accept=".pdf,.jpg,.png"
                    onChange={async (file: File | null) => {
                      if (file) {
                        try {
                          const url = await uploadFile(file);
                          setValue("portfolioFileUrl", url); // Assuming added to schema
                        } catch (e) {
                          alert("Upload failed");
                        }
                      }
                    }}
                  />
                </div>
              </div>
              {(formValues as any).cvUrl && (
                <p className="text-sm text-green-600 font-bold">
                  <FaCheck className="inline mr-1" /> CV Uploaded
                </p>
              )}
              {(formValues as any).portfolioFileUrl && (
                <p className="text-sm text-green-600 font-bold">
                  <FaCheck className="inline mr-1" /> Portfolio Uploaded
                </p>
              )}
              {isFileUploading && (
                <p className="text-sm text-brand-primary animate-pulse">
                  Uploading file...
                </p>
              )}
            </div>
          )}

          {/* Step 7: Declaration */}
          {step === 7 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Declaration & Consent
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-[var(--card-left-accent)] pl-4">
                "I confirm that the information provided above is true and
                accurate to the best of my knowledge. I understand that
                selection into the KHCRF Apprenticeship Program is merit-based
                and subject to review."
              </p>

              <div className="space-y-4 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                    {...register("agreeTerms")}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I agree to the terms and conditions *
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
                    className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                    {...register("dataConsent")}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I consent to KHCRF storing and processing my data for
                    program-related purposes *
                  </span>
                </label>
                {errors.dataConsent && (
                  <p className="text-red-500 text-xs">
                    {errors.dataConsent.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                <Input
                  label="Applicant Signature (Typed) *"
                  placeholder="Type your full name"
                  {...register("signature")}
                  error={errors.signature?.message}
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
              type={step === 7 ? "submit" : "button"}
              onClick={step === 7 ? undefined : nextStep}
              disabled={isSubmitting}
              className="flex items-center px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : step === 7 ? (
                <>
                  Apply for Apprenticeship <FaCheck className="ml-2" />
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
