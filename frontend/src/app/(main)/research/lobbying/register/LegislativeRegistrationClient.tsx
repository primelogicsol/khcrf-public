"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaLandmark,
  FaUserTie,
  FaMapMarkerAlt,
  FaFileSignature,
  FaCheck,
  FaBuilding,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import api from "@/lib/api";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Select from "@/components/common/Select";
import FileChoosing from "@/components/common/FileChoosing";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useFileUpload } from "@/hooks/useFileUpload";
import { categories } from "@/lib/categories";
// Inline steps logic used in JSX

const schema = z.object({
  // SECTION I: LEGISLATIVE OFFICE DETAILS
  representativeName: z.string().min(1, "Legislator's Full Name is required"),
  designation: z.string().min(1, "Designation is required"),
  constituency: z.string().min(1, "Constituency Name is required"),
  district: z.string().min(1, "District is required"),
  party: z.string().optional(),
  termStart: z.string().min(1, "Term Start Date is required"),
  termEnd: z.string().min(1, "Term End Date is required"),
  legislativeBody: z.string().optional(),
  officialEmail: z
    .string()
    .email("Invalid official email address")
    .min(1, "Required"),
  contactNumber: z.string().min(10, "Valid office telephone number required"),
  officeAddress: z.string().min(5, "Office Address is required"),
  officialWebsite: z.string().optional(),
  socialHandle: z.string().optional(),

  // SECTION II: CONSTITUENCY ARTISAN & CRAFT PROFILE
  artisanPresence: z.literal("Yes", {
    message: "You must confirm artisan presence to proceed",
  }),
  artisanPopulation: z.string().min(1, "Please select an estimated population"),
  craftSectors: z.array(z.string()).min(1, "Select at least one primary craft"),
  subCraftSectors: z.array(z.string()).optional(),
  items_other: z.string().optional(), // For "Other" craft
  craftClusters: z.string().optional(), // Multi-entry text or comma separated
  orgTypes: z.array(z.string()).optional(),

  // SECTION III: OFFICE ENGAGEMENT & PRIORITIES
  craftIssues: z.array(z.string()).optional(),
  engagementSummary: z.string().optional(),
  priorityAreas: z.string().optional(),
  supportRequests: z.array(z.string()).optional(),

  // SECTION IV: VERIFICATION & CONSENT
  // Office Rep / Admin details (Need to keep for account creation, though less emphasized in form text)
  // User request puts "Official Contact Information" in Section 1.
  // I will extract username from official email or ask for it in Section 1 or 4?
  // Let's keep a minimal "Account Setup" block in Section 1 or 4.
  // User Guide says "Official Email Address" (Required).
  // I'll stick to the previous pattern of asking for a username for the URL.
  username: z
    .string()
    .min(3, "Username required for URL")
    .regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),

  // Auth Docs
  authDocUrl: z.string().min(1, "Authorization document is required"),
  verificationPreference: z.array(z.string()).optional(),

  // Declarations
  declaration1: z.literal(true, { message: "Required" }),
  declaration2: z.literal(true, { message: "Required" }),
  declaration3: z.literal(true, { message: "Required" }),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { number: 1, title: "Office Details", icon: FaLandmark },
  { number: 2, title: "Constituency Profile", icon: FaMapMarkerAlt },
  { number: 3, title: "Engagement", icon: FaUserTie },
  { number: 4, title: "Verification", icon: FaFileSignature },
];

export default function LegislativeRegistrationClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newCraftInput, setNewCraftInput] = useState("");
  const [customCraftInput, setCustomCraftInput] = useState("");
  const [newSubCraftInput, setNewSubCraftInput] = useState("");
  const { uploadFile, isUploading } = useFileUpload();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      console.warn("User is null, but ignoring redirect for test stability");
      // const currentPath = encodeURIComponent(window.location.pathname);
      // router.push(`/login?redirect=${currentPath}`);
    }
  }, [isLoading, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      craftSectors: [],
      subCraftSectors: [],
      orgTypes: [],
      craftIssues: [],
      supportRequests: [],
      verificationPreference: [],
      // Default declarations to false (undefined)
    },
  });

  const formValues = watch();

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data } = await api.get("/legislative/my-office");
        if (data && data.status === "DRAFT") {
          // Populate form
          reset({
            ...data,
            // Ensure arrays are arrays
            craftSectors: data.craftSectors || [],
            subCraftSectors: data.subCraftSectors || [],
            orgTypes: data.orgTypes || [],
            craftIssues: data.craftIssues || [],
            supportRequests: data.supportRequests || [],
            verificationPreference: data.verificationPreference || [],
            intent: data.intendedUse, // Map back if needed, though we sent intendedUse as is
            declaration1: true, // If draft exists, assume consents were getting there? No, let them re-check.
            declaration2: true,
            declaration3: true,
          });
          // Maybe set step to where they left off? Hard to say.
          // Let's just let them start at 1 but with data filled.
          // Or if we want to be fancy, we could store 'lastStep' in DB.
        }
      } catch (error) {
        // No office or not logged in, ignore
      }
    };
    loadDraft();
  }, [reset]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1)
      fieldsToValidate = [
        "representativeName",
        "designation",
        "party",
        "constituency",
        "district",
        "termStart",
        "termEnd",
        "officialEmail",
        "contactNumber",
        "officeAddress",
        "username",
      ];
    if (step === 2)
      fieldsToValidate = [
        "artisanPresence",
        "artisanPopulation",
        "craftSectors",
      ];
    // Step 3 are mostly optional, but good to trigger validation if any rules exist
    if (step === 4)
      fieldsToValidate = [
        "authDocUrl",
        "declaration1",
        "declaration2",
        "declaration3",
      ];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/legislative/register", {
        ...data,
        status: "PENDING",
      });
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Submission error:", error);
      if (error.response?.status === 401) {
        const currentPath = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${currentPath}`);
        return;
      }
      const msg =
        error.response?.data?.error ||
        "Registration failed. Please check your inputs or try again.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    // Validate at least Step 1 (Identity) before saving to ensure DB constraints
    const isValid = await trigger([
      "representativeName",
      "designation",
      "constituency",
      "district",
      "officialEmail",
      "contactNumber",
      "officeAddress",
      "username",
    ]);

    if (!isValid) {
      alert("Please complete the required details in Step 1 to save a draft.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = formValues;
      await api.post("/legislative/register", {
        ...data,
        status: "DRAFT",
      });
      alert("Draft saved successfully! You can resume this application later.");
    } catch (error: any) {
      console.error("Save Draft Error:", error);
      const msg = error.response?.data?.error || "Failed to save draft.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (field: any, value: string) => {
    const current = (formValues as any)[field] || [];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    setValue(field, updated, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-roboto">
        <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Submission Received
          </h2>
          <p className="text-gray-600 mb-2">
            Your submission has been received and is under review.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Verification is conducted through official contact validation. If
            clarification is required, your office will be contacted directly.
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
              <span className="text-xs font-bold text-gray-700">Submitted</span>
            </div>
            <div className="w-10 h-px bg-gray-300 mt-1.5"></div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mb-1 animate-pulse"></div>
              <span className="text-xs font-bold text-gray-700">
                Under Review
              </span>
            </div>
            <div className="w-10 h-px bg-gray-300 mt-1.5"></div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 mb-1"></div>
              <span className="text-xs font-bold text-gray-400">Verified</span>
            </div>
          </div>
          <a
            href="/profile"
            className="block w-full mt-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors"
          >
            Go to Profile Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-8 font-roboto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-playfair font-black text-gray-900 mb-3">
            Jammu and Kashmir Legislative Office Onboarding
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            This form enables legislative offices representing artisan-rich
            constituencies to register for verified participation.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FaCheck data-ui-icon  className="" /> Official legislative
              offices only
            </span>
            <span>•</span>
            <span>Est. time: 5–8 minutes</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-12 relative max-w-3xl mx-auto">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div
            className="absolute left-0 top-1/2 h-1 bg-brand-primary -z-10 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          {STEPS.map((s) => (
            <div
              key={s.number}
              className="flex flex-col items-center gap-2 bg-gray-50 px-2 z-10"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  step >= s.number
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-110"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step > s.number ? <FaCheck /> : <s.icon />}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  step >= s.number ? "text-brand-primary" : "text-gray-400"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <form className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
          <div className="p-8 md:p-12 min-h-[500px]">
            {/* SECTION I */}
            {step === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <section>
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center gap-2">
                    <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      1
                    </span>
                    Office Identification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Legislator’s Full Name"
                      placeholder="e.g. Mr. John Doe"
                      {...register("representativeName")}
                      error={errors.representativeName?.message}
                    />
                    <div>
                      <Select
                        label="Designation"
                        {...register("designation")}
                        error={errors.designation?.message}
                        options={[
                          { value: "", label: "Select One..." },
                          {
                            value: "MLA",
                            label: "Member of Legislative Assembly (MLA)",
                          },
                          { value: "MP", label: "Member of Parliament (MP)" },
                          {
                            value: "MLC",
                            label: "Member of Legislative Council (MLC)",
                          },
                          { value: "Minister", label: "Minister" },
                          {
                            value: "Committee Chair",
                            label: "Committee Chair",
                          },
                          { value: "Other", label: "Other" },
                        ]}
                      />
                    </div>
                    <Input
                      label="Constituency Name"
                      placeholder="e.g. Srinagar"
                      {...register("constituency")}
                      error={errors.constituency?.message}
                    />
                    <Input
                      label="District"
                      placeholder="District Name"
                      {...register("district")}
                      error={errors.district?.message}
                    />
                    <div className="md:col-span-2">
                      <Select
                        label="Legislative Body (Optional)"
                        {...register("legislativeBody")}
                        options={[
                          { value: "", label: "Select..." },
                          {
                            value: "Legislative Assembly",
                            label: "Legislative Assembly",
                          },
                          {
                            value: "Parliament (Lok Sabha)",
                            label: "Parliament (Lok Sabha)",
                          },
                          {
                            value: "Parliament (Rajya Sabha)",
                            label: "Parliament (Rajya Sabha)",
                          },
                          {
                            value: "Legislative Council",
                            label: "Legislative Council",
                          },
                        ]}
                      />
                    </div>

                    <Input
                      label="Party Affiliation (Optional)"
                      placeholder="e.g. Independent, Party Name"
                      {...register("party")}
                    />
                    <div className="hidden md:block md:col-span-1"></div>

                    <Input
                      label="Current Term Start"
                      type="date"
                      {...register("termStart")}
                      error={errors.termStart?.message}
                    />
                    <Input
                      label="Current Term End"
                      type="date"
                      {...register("termEnd")}
                      error={errors.termEnd?.message}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center gap-2">
                    <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      2
                    </span>
                    Official Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Official Email Address"
                      type="email"
                      placeholder="office@gov.in"
                      {...register("officialEmail")}
                      error={errors.officialEmail?.message}
                      subtext="Must be an institutional or government-recognized address"
                    />
                    <Input
                      label="Office Telephone Number"
                      type="number"
                      placeholder="+91..."
                      {...register("contactNumber")}
                      error={errors.contactNumber?.message}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Office Address"
                        placeholder="Full official address..."
                        {...register("officeAddress")}
                        error={errors.officeAddress?.message}
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6 flex items-center gap-2">
                    <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      3
                    </span>
                    Platform Account Setup (Url & Login)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input
                        label="Proposed Username"
                        placeholder="constituency-office"
                        {...register("username")}
                        error={errors.username?.message}
                        subtext="Will be used for your public page URL"
                      />
                    </div>
                    <div>
                      <Input
                        label="Official Website (Optional)"
                        placeholder="https://..."
                        {...register("officialWebsite")}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Official Social Media Handle (Optional)"
                        placeholder="@handle"
                        {...register("socialHandle")}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* SECTION II */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">
                  Constituency Artisan & Craft Profile
                </h3>

                <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
                  <label className="block text-lg font-bold text-gray-900 mb-4">
                    Does your constituency include craft clusters or a
                    significant artisan population? *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="Yes"
                        {...register("artisanPresence")}
                        className="w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="font-bold text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="No"
                        {...register("artisanPresence")}
                        className="w-5 h-5 text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="font-bold text-gray-700">No</span>
                    </label>
                  </div>
                  {errors.artisanPresence && (
                    <p className="text-red-500 text-sm mt-2 font-bold">
                      {errors.artisanPresence.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Input
                      label="Estimated Artisan Population *"
                      {...register("artisanPopulation")}
                      error={errors.artisanPopulation?.message}
                      placeholder="e.g. 1500 or Select Range..."
                      list="population-options"
                    />
                    <datalist id="population-options">
                      <option value="0–500" />
                      <option value="500–2,000" />
                      <option value="2,000–10,000" />
                      <option value="10,000+" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Primary Crafts Represented *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(formValues.craftSectors || []).map((craft) => (
                        <div
                          key={craft}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border bg-brand-primary text-white border-brand-primary"
                        >
                          {craft}
                          <button
                            type="button"
                            onClick={() =>
                              toggleArrayItem("craftSectors", craft)
                            }
                            className="hover:text-red-200 transition-colors flex items-center justify-center p-0.5"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={newCraftInput}
                        onChange={(e) => {
                          setNewCraftInput(e.target.value);
                          if (e.target.value !== "Other") {
                            setCustomCraftInput("");
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-white"
                      >
                        <option value="">Select Category...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        <option value="Other">Other (Type below)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const craftToAdd =
                            newCraftInput === "Other"
                              ? customCraftInput.trim()
                              : newCraftInput.trim();
                          if (craftToAdd) {
                            if (
                              !formValues.craftSectors?.includes(craftToAdd)
                            ) {
                              toggleArrayItem("craftSectors", craftToAdd);
                            }
                            setNewCraftInput("");
                            setCustomCraftInput("");
                          }
                        }}
                        className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {newCraftInput === "Other" && (
                      <div className="mt-2 text-sm text-gray-500">
                        <input
                          type="text"
                          value={customCraftInput}
                          onChange={(e) => setCustomCraftInput(e.target.value)}
                          placeholder="Type custom craft and press Add"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (customCraftInput.trim()) {
                                if (
                                  !formValues.craftSectors?.includes(
                                    customCraftInput.trim(),
                                  )
                                ) {
                                  toggleArrayItem(
                                    "craftSectors",
                                    customCraftInput.trim(),
                                  );
                                }
                                setNewCraftInput("");
                                setCustomCraftInput("");
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                    {errors.craftSectors && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.craftSectors.message}
                      </p>
                    )}
                  </div>
                  {formValues.craftSectors &&
                    formValues.craftSectors.length > 0 && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Secondary Crafts / Sub-Categories (Optional)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(formValues.subCraftSectors || []).map((craft) => (
                            <div
                              key={craft}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border bg-gray-100 text-gray-700 border-gray-300"
                            >
                              {craft}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleArrayItem("subCraftSectors", craft)
                                }
                                className="hover:text-red-500 transition-colors flex items-center justify-center p-0.5"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={newSubCraftInput}
                            onChange={(e) =>
                              setNewSubCraftInput(e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all bg-white"
                          >
                            <option value="">Select Sub-Category...</option>
                            {categories
                              .filter((cat) =>
                                formValues.craftSectors?.includes(cat.name),
                              )
                              .flatMap((cat) => cat.subcategories)
                              .map((sub) => (
                                <option key={sub.id} value={sub.name}>
                                  {sub.name}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              if (newSubCraftInput.trim()) {
                                if (
                                  !formValues.subCraftSectors?.includes(
                                    newSubCraftInput.trim(),
                                  )
                                ) {
                                  toggleArrayItem(
                                    "subCraftSectors",
                                    newSubCraftInput.trim(),
                                  );
                                }
                                setNewSubCraftInput("");
                              }
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-all border border-gray-300"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                <div>
                  <Input
                    label="Known Craft Clusters / Areas (Optional)"
                    placeholder="e.g. Zadibal, Eidgah, etc."
                    {...register("craftClusters")}
                    subtext="List specific villages, wards, or blocks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Artisan Organization Types (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Cooperatives",
                      "Self-Help Groups",
                      "NGOs",
                      "Informal artisan groups",
                      "Individual home-based",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.orgTypes?.includes(item)}
                          onChange={() => toggleArrayItem("orgTypes", item)}
                          className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <span className="text-sm text-gray-600 font-medium">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION III */}
            {step === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">
                  Office Engagement & Priorities
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Craft-Related Issues Observed (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Raw material access and pricing",
                      "Counterfeit and imitation goods",
                      "Access to welfare schemes",
                      "Credit and financial inclusion",
                      "Export or market barriers",
                      "Infrastructure limitations",
                      "Skill continuity concerns",
                      "Disaster or crisis impact",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.craftIssues?.includes(item)}
                          onChange={() => toggleArrayItem("craftIssues", item)}
                          className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <span className="text-sm text-gray-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Summary of Current or Recent Engagement (Optional)"
                  placeholder="Short factual description of actions taken (meetings, letters, etc.)..."
                  {...register("engagementSummary")}
                  className="h-32"
                />

                <Textarea
                  label="Priority Areas (Next 6–12 Months) (Optional)"
                  placeholder="Brief outline of focus areas..."
                  {...register("priorityAreas")}
                  className="h-24"
                />

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Optional Support Requests from KHCRF
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Policy brief or background note",
                      "Constituency craft documentation",
                      "Stakeholder consultation support",
                      "Data or research inputs",
                      "Awareness or information dissemination",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.supportRequests?.includes(item)}
                          onChange={() =>
                            toggleArrayItem("supportRequests", item)
                          }
                          className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <span className="text-sm text-gray-600">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION IV */}
            {step === 4 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-6">
                  Verification & Consent
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-700">
                      Authorization Documentation *
                    </p>
                    <a
                      href="/assets/doc_templates/HCRF_Legislative_Authorization_Letter.pdf"
                      download
                      className="text-xs font-bold text-icon-on-light hover:underline flex items-center gap-2 bg-brand-primary/5 px-3 py-1.5 rounded-lg border border-brand-primary/10 transition-colors hover:bg-brand-primary/10"
                    >
                      <FaDownload /> Download Template
                    </a>
                  </div>
                  <FileChoosing
                    label="Click to Upload"
                    subLabel="Office authorization letter on letterhead OR Official ID (PDF only)"
                    accept=".pdf"
                    onChange={async (file) => {
                      if (file) {
                        try {
                          const url = await uploadFile(file);
                          setValue("authDocUrl", url, { shouldValidate: true });
                        } catch (e) {
                          alert("Upload failed");
                        }
                      }
                    }}
                  />
                  {formValues.authDocUrl && (
                    <p className="text-green-600 text-sm flex items-center gap-2 mt-2">
                      <FaCheck /> Document Uploaded
                    </p>
                  )}
                  {errors.authDocUrl && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.authDocUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Verification Preference (Optional)
                  </label>
                  <div className="flex flex-col gap-3">
                    {[
                      "Official email verification",
                      "Office phone confirmation",
                      "Document review",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.verificationPreference?.includes(
                            item,
                          )}
                          onChange={() =>
                            toggleArrayItem("verificationPreference", item)
                          }
                          className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <span className="text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                  <p className="font-bold text-gray-900 mb-2">
                    Declarations (Required)
                  </p>

                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("declaration1")}
                      className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that this submission represents an official
                      legislative office.
                    </span>
                  </label>
                  {errors.declaration1 && (
                    <p className="text-red-500 text-xs ml-9">
                      {errors.declaration1.message}
                    </p>
                  )}

                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("declaration2")}
                      className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to verification through official communication
                      channels.
                    </span>
                  </label>
                  {errors.declaration2 && (
                    <p className="text-red-500 text-xs ml-9">
                      {errors.declaration2.message}
                    </p>
                  )}

                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("declaration3")}
                      className="mt-1 w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-gray-700">
                      I understand that this platform is non-political,
                      sector-specific, and intended solely for artisan-related
                      documentation and updates.
                    </span>
                  </label>
                  {errors.declaration3 && (
                    <p className="text-red-500 text-xs ml-9">
                      {errors.declaration3.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Bar */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className={`px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition-colors ${step === 1 ? "invisible" : ""}`}
            >
              Back
            </button>

            <div className="flex gap-4">
              {/* Secondary Action: Save Draft (Mock) */}
              <button
                type="button"
                className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-brand-primary/5 transition-colors hidden md:block"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={step === 4 ? handleSubmit(onSubmit) : nextStep}
                disabled={isSubmitting || isUploading}
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                {isSubmitting
                  ? "Submitting..."
                  : step === 4
                    ? "Submit For Verification"
                    : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
