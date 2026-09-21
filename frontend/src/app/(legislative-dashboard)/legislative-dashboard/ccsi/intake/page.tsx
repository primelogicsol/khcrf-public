"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaSpinner,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import SignaturePad from "@/components/common/SignaturePad";
import { uploadFile } from "@/lib/cloudinary";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import FileChoosing from "@/components/common/FileChoosing";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { categories } from "@/lib/categories";

// --- Form Data Type Definition ---
interface CCSIFormData {
  // Identity
  applicantCategory: string;
  fullName: string;
  businessName?: string;
  fatherName?: string;
  gender?: string;
  primaryContact: string;
  alternateContact?: string;
  email?: string;
  village: string;
  district?: string;
  clusterName?: string;

  // Craft
  primaryCraft: string;
  secondaryCraft?: string;
  yearsExperience?: number;
  familyLineage?: boolean;
  giAssociation?: string;
  monthlyCapacity: string;
  capacityUnit?: string;
  numberOfWorkers?: number;

  // Workshop
  workshopAddress: string;
  workshopSeparate?: boolean;
  geoCaptured?: boolean;
  rawMaterials?: string;
  toolsUsed?: string;

  // Docs
  docGovId?: string;
  docArtisanCard?: string;
  docGiCertificate?: string;
  docGst?: string;
  docUdyam?: string;
  docInstitution?: string;

  // Sales & Commerce
  salesChannels?: string[];
  isCommerceInterested?: boolean;

  // Commerce Details
  sellingOutsideDistrict?: boolean;
  bankAccountAvailable?: boolean;
  maintainsPricingRecords?: boolean;
  gstAvailable?: string;
  productionType?: string;
  productionLeadTime?: number;
  standardPackaging?: boolean;
  courierCapability?: boolean;
  digitalTools?: string[];
  digitalPaymentsReady?: boolean;
  commerceConsent?: boolean;

  // Final
  consentDeclared: boolean;
  signature?: string | null;
  signatureTimestamp?: string;
  officeId?: string;
}

export default function CCSIIntakePage() {
  const { user } = useAuth(); // potentially check role here again
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // Changed from 'step' to 'currentStep'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commerceEnabled, setCommerceEnabled] = useState(false);

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isWarning: false,
    onConfirm: () => {},
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger, // Added trigger for manual validation
    formState: { errors, isValid },
  } = useForm<CCSIFormData>({
    mode: "onChange",
    defaultValues: {
      salesChannels: [],
      digitalTools: [],
      geoCaptured: true, // Defaulting to true as per UI
    },
  });

  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        try {
          const { data } = await api.get(`/ccsi/profile/${profileId}`);
          // Map API data to form structure if needed, or just reset if keys match
          reset(data);
          setCommerceEnabled(data.isCommerceInterested);
        } catch (error) {
          console.error("Fetch Data Error", error);
        }
      };
      fetchProfile();
    }
  }, [profileId, reset]);

  const watchCommerceInterest = watch("isCommerceInterested");
  const watchPrimaryCraft = watch("primaryCraft");

  const [subCategories, setSubCategories] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (watchPrimaryCraft) {
      const category = categories.find((c) => c.name === watchPrimaryCraft);
      if (category) {
        setSubCategories(
          category.subcategories.map((sub) => ({
            value: sub.name,
            label: sub.name,
          })),
        );
      } else {
        setSubCategories([]);
      }
      // Only clear if transitioning to an incompatible primary craft,
      // but simpler to clear if it's changing (though user may complain if they edit)
      // Actually we should only clear if current secondary isn't in new subCategories.
    } else {
      setSubCategories([]);
    }
  }, [watchPrimaryCraft]);

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [typedName, setTypedName] = useState("");

  const onSubmit = async (data: any) => {
    if (!signatureData) {
      setModal({
        isOpen: true,
        title: "Signature Required",
        message: "Please provide your digital signature before submitting.",
        isWarning: true,
        onConfirm: closeModal,
      });
      return;
    }
    if (
      !typedName ||
      typedName.trim().toLowerCase() !== data.fullName.trim().toLowerCase()
    ) {
      setModal({
        isOpen: true,
        title: "Name Mismatch",
        message: "Typed name must match the Applicant Full Name exactly.",
        isWarning: true,
        onConfirm: closeModal,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        officeId: officeData?.id,
        signature: signatureData,
        signatureTimestamp: new Date().toISOString(),
      };

      if (profileId) {
        await api.put(`/ccsi/profile/${profileId}`, payload);
        setModal({
          isOpen: true,
          title: "Success",
          message: "Profile updated successfully!",
          isWarning: false,
          onConfirm: () => router.push("/legislative-dashboard/ccsi"),
        });
      } else {
        await api.post("/ccsi/profile", payload);
        setModal({
          isOpen: true,
          title: "Success",
          message: "Stakeholder profile submitted successfully!",
          isWarning: false,
          onConfirm: () => router.push("/legislative-dashboard/ccsi"),
        });
      }
    } catch (error: any) {
      console.error("Submission Error", error);
      setModal({
        isOpen: true,
        title: "Submission Error",
        message: error.response?.data?.message || "Failed to submit profile.",
        isWarning: true,
        onConfirm: closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (field: string, file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setModal({
        isOpen: true,
        title: "Invalid File Type",
        message: "Only Images (JPEG, PNG, GIF, WEBP) and PDFs are allowed.",
        isWarning: true,
        onConfirm: closeModal,
      });
      return;
    }

    try {
      const url = await uploadFile(file);
      setValue(field as any, url, { shouldValidate: true });
    } catch (e) {
      setModal({
        isOpen: true,
        title: "Upload Failed",
        message: "Failed to upload file. Please try again.",
        isWarning: true,
        onConfirm: closeModal,
      });
    }
  };

  const [officeData, setOfficeData] = useState<any>(null);

  useEffect(() => {
    const fetchOffice = async () => {
      try {
        const res = await api.get("/legislative/my-office");
        setOfficeData(res.data);
        if (res.data?.district) {
          setValue("district", res.data.district);
        }
      } catch (err) {
        console.error("Failed to fetch office details", err);
      }
    };
    fetchOffice();
  }, [setValue]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "applicantCategory",
          "fullName",
          "primaryContact",
          "email",
          "village",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "primaryCraft",
          "yearsExperience",
          "numberOfWorkers",
          "monthlyCapacity",
          "capacityUnit",
        ];
        break;
      case 3:
        fieldsToValidate = ["workshopAddress"];
        break;
      case 4:
        // Manual validaton for files
        const govId = watch("docGovId");
        const artisanCard = watch("docArtisanCard");
        const category = watch("applicantCategory");
        const gst = watch("docGst");

        if (!govId || !artisanCard) {
          setModal({
            isOpen: true,
            title: "Missing Documents",
            message:
              "Please upload mandatory documents: Govt ID and Artisan Card.",
            isWarning: true,
            onConfirm: closeModal,
          });
          return;
        }

        if (category === "Registered Business" && !gst) {
          setModal({
            isOpen: true,
            title: "GST Required",
            message:
              "GST Registration is mandatory for Registered Business applicants.",
            isWarning: true,
            onConfirm: closeModal,
          });
          return;
        }
        fieldsToValidate = []; // No react-hook-form validation needed for this step
        break;
      case 5:
        fieldsToValidate = []; // Sales channels optional? Or validate if needed.
        break;
      case 6:
        fieldsToValidate = ["consentDeclared"];
        if (watchCommerceInterest) {
          fieldsToValidate.push("commerceConsent");
        }
        break;
    }

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  // --- Render Steps ---

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-playfair text-stone-900">
          {profileId ? "Update Stakeholder Profile" : "Add New Stakeholder"}
        </h1>
        <div className="flex items-center gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`h-2 flex-1 rounded-full ${currentStep >= num ? "bg-brand-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-500 mt-2 uppercase tracking-wider">
          <span>Identity</span>
          <span>Craft</span>
          <span>Workshop</span>
          <span>Docs</span>
          <span>Sales</span>
          <span>Finalize</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all"
      >
        {/* --- STEP 1: Applicant Category & Basic Identity --- */}
        <div className={currentStep === 1 ? "block space-y-8" : "hidden"}>
          {/* 1. Applicant Category */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              1. Applicant Category
            </h3>
            <Select
              label="Category *"
              {...register("applicantCategory", { required: "Required" })}
              options={[
                { value: "", label: "Select..." },
                { value: "Individual Artisan", label: "Individual Artisan" },
                { value: "Family Workshop", label: "Family Workshop" },
                { value: "Registered Business", label: "Registered Business" },
                {
                  value: "Cooperative / Institution",
                  label: "Cooperative / Institution",
                },
                {
                  value: "Training Unit / Craft Body",
                  label: "Training Unit / Craft Body",
                },
              ]}
              error={errors.applicantCategory?.message as string}
            />
          </div>

          {/* 2. Basic Identity */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              2. Basic Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                {...register("fullName", { required: "Required" })}
                error={errors.fullName?.message as string}
              />
              <Input
                label="Business / Workshop Name"
                {...register("businessName")}
              />
              <Input
                label="Father’s / Guardian’s Name"
                {...register("fatherName")}
              />
              <Select
                label="Gender"
                {...register("gender")}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <Input
                label="Primary Contact Number *"
                {...register("primaryContact", {
                  required: "Required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Invalid Phone Number",
                  },
                  onChange: (e) => {
                    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    if (val.startsWith("91") && val.length > 10)
                      val = val.slice(2);
                    if (val.startsWith("0") && val.length > 10)
                      val = val.slice(1);
                    if (val.length > 10) val = val.slice(0, 10);
                    setValue("primaryContact", val, { shouldValidate: true });
                  },
                })}
                placeholder="10-digit mobile number"
                error={errors.primaryContact?.message as string}
              />
              <Input
                label="Alternate Contact"
                {...register("alternateContact", {
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Invalid Phone Number",
                  },
                  onChange: (e) => {
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.startsWith("91") && val.length > 10)
                      val = val.slice(2);
                    if (val.startsWith("0") && val.length > 10)
                      val = val.slice(1);
                    if (val.length > 10) val = val.slice(0, 10);
                    setValue("alternateContact", val, { shouldValidate: true });
                  },
                })}
                placeholder="10-digit mobile number"
                error={errors.alternateContact?.message as string}
              />
              <Input label="Email" type="email" {...register("email")} />
              <Input
                label="Village / Town *"
                {...register("village", { required: "Required" })}
                error={errors.village?.message as string}
              />
              <Input
                label="District"
                {...register("district")}
                disabled={!!officeData?.district}
                placeholder={
                  officeData?.district
                    ? `Locked: ${officeData.district}`
                    : "District Name"
                }
              />
              <Input label="Cluster Name" {...register("clusterName")} />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>

        {/* --- STEP 2: Craft Profile --- */}
        <div
          className={
            currentStep === 2 ? "block space-y-8 animate-slideDown" : "hidden"
          }
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              3. Craft Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Primary Craft Type *"
                {...register("primaryCraft", { required: "Required" })}
                options={[
                  { value: "", label: "Select Category..." },
                  ...categories.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                  })),
                  { value: "Other", label: "Other" },
                ]}
                error={errors.primaryCraft?.message as string}
              />
              <Select
                label="Secondary Craft / Sub-Category"
                {...register("secondaryCraft")}
                options={[
                  { value: "", label: "Select Sub-Category..." },
                  ...subCategories,
                  { value: "Other", label: "Other" },
                ]}
              />
              <Input
                label="Years of Experience"
                type="number"
                {...register("yearsExperience", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
                error={errors.yearsExperience?.message as string}
              />
              <div className="flex items-center mt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("familyLineage")}
                    className="w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    Family Lineage in Craft?
                  </span>
                </label>
              </div>
              <Input
                label="GI Product Association"
                {...register("giAssociation")}
                placeholder="Search GI... (e.g. Pashmina)"
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Approx. Monthly Capacity *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register("monthlyCapacity", { required: "Required" })}
                    placeholder="Qty"
                    className={`flex-1 w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all ${errors.monthlyCapacity ? "border-red-500" : ""}`}
                  />
                  <select
                    {...register("capacityUnit")}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    <option value="Pieces">Pieces</option>
                    <option value="Meters">Meters</option>
                    <option value="Kg">Kg</option>
                    <option value="Sets">Sets</option>
                  </select>
                </div>
                {errors.monthlyCapacity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.monthlyCapacity.message as string}
                  </p>
                )}
              </div>
              <Input
                label="Number of Workers"
                type="number"
                {...register("numberOfWorkers", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Min 0" },
                })}
                error={errors.numberOfWorkers?.message as string}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>

        {/* --- STEP 3: Workshop Details --- */}
        <div
          className={
            currentStep === 3 ? "block space-y-8 animate-slideDown" : "hidden"
          }
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              4. Workshop Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Workshop Address *
                </label>
                <textarea
                  {...register("workshopAddress", { required: "Required" })}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all ${errors.workshopAddress ? "border-red-500" : ""}`}
                />
                {errors.workshopAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.workshopAddress.message as string}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-2 cursor-pointer p-4 border rounded-xl">
                  <input
                    type="checkbox"
                    {...register("workshopSeparate")}
                    className="w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="font-semibold text-gray-700">
                    Workshop Separate from Residence?
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-4 border rounded-xl bg-gray-50">
                  <input
                    type="checkbox"
                    {...register("geoCaptured")}
                    disabled
                    checked
                    className="w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="font-semibold text-gray-500">
                    Capture Geo-Location (Auto on Mobile)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Raw Materials Used
                </label>
                <textarea
                  {...register("rawMaterials")}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tools / Machinery Used
                </label>
                <textarea
                  {...register("toolsUsed")}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>

        {/* --- STEP 4: Documentation --- */}
        <div
          className={
            currentStep === 4 ? "block space-y-8 animate-slideDown" : "hidden"
          }
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              5. Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileChoosing
                label="Govt ID / Aadhaar"
                accept="image/*,.pdf"
                onChange={(f) => f && handleDocumentUpload("docGovId", f)}
                previewUrl={watch("docGovId")}
              />
              <FileChoosing
                label="Artisan Card"
                accept="image/*,.pdf"
                onChange={(f) => f && handleDocumentUpload("docArtisanCard", f)}
                previewUrl={watch("docArtisanCard")}
              />
              <FileChoosing
                label="GI Certificate"
                accept="image/*,.pdf"
                onChange={(f) =>
                  f && handleDocumentUpload("docGiCertificate", f)
                }
                previewUrl={watch("docGiCertificate")}
              />
              <FileChoosing
                label="GST Registration"
                accept="image/*,.pdf"
                onChange={(f) => f && handleDocumentUpload("docGst", f)}
                previewUrl={watch("docGst")}
              />
              <FileChoosing
                label="Udyam Registration"
                accept="image/*,.pdf"
                onChange={(f) => f && handleDocumentUpload("docUdyam", f)}
                previewUrl={watch("docUdyam")}
              />
              <FileChoosing
                label="Institutional Reg."
                accept="image/*,.pdf"
                onChange={(f) => f && handleDocumentUpload("docInstitution", f)}
                previewUrl={watch("docInstitution")}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>

        {/* --- STEP 5: Sales Channels (Moved Consent/Commerce to Step 6) --- */}
        <div
          className={
            currentStep === 5 ? "block space-y-8 animate-slideDown" : "hidden"
          }
        >
          {/* 6. Sales Channels */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              6. Sales Channels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Local Market",
                "Middlemen",
                "Direct Buyers",
                "Exhibitions",
                "Online (Self)",
                "No Regular Channel",
              ].map((channel) => (
                <label
                  key={channel}
                  className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    value={channel}
                    {...register("salesChannels")}
                    className="w-4 h-4 text-brand-primary rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {channel}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
            >
              Next Step <FaArrowRight />
            </button>
          </div>
        </div>

        {/* --- STEP 6: Commerce & Finalize --- */}
        <div
          className={
            currentStep === 6 ? "block space-y-8 animate-slideDown" : "hidden"
          }
        >
          {/* Commerce Toggle */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("isCommerceInterested")}
                className="w-6 h-6 text-brand-primary rounded focus:ring-brand-primary"
              />
              <div>
                <span className="block text-lg font-bold text-gray-900">
                  Applicant interested in Digital Commerce?
                </span>
                <span className="text-sm text-gray-500">
                  Enable this to unlock detailed commerce profile fields.
                </span>
              </div>
            </label>
          </div>

          {watchCommerceInterest && (
            <div className="space-y-8 animate-fadeIn">
              {/* 2A */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                  Commerce Readiness
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      {...register("sellingOutsideDistrict")}
                    />{" "}
                    Selling Outside District
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      {...register("bankAccountAvailable")}
                    />{" "}
                    Bank Account Available
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg">
                    <input
                      type="checkbox"
                      {...register("maintainsPricingRecords")}
                    />{" "}
                    Maintains Pricing Records
                  </label>
                  <Select
                    label="GST Status"
                    {...register("gstAvailable")}
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                      { value: "Not Applicable", label: "Not Applicable" },
                    ]}
                  />
                </div>
              </div>

              {/* 2B */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                  Product Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Production Type
                    </label>
                    <div className="flex gap-4">
                      {["Made-to-Order", "Ready Stock", "Both"].map((t) => (
                        <label key={t} className="flex items-center gap-2">
                          <input
                            type="radio"
                            value={t}
                            {...register("productionType")}
                          />{" "}
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Lead Time (Days)"
                    type="number"
                    {...register("productionLeadTime")}
                  />
                  <div className="flex gap-4 pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("standardPackaging")}
                      />{" "}
                      Standard Packaging
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register("courierCapability")}
                      />{" "}
                      Courier Capability
                    </label>
                  </div>
                </div>
              </div>

              {/* 2C */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                  Digital Readiness
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    "Smartphone",
                    "WhatsApp",
                    "Email",
                    "Social Media",
                    "None",
                  ].map((tool) => (
                    <label
                      key={tool}
                      className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        value={tool}
                        {...register("digitalTools")}
                        className="w-4 h-4 text-brand-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {tool}
                      </span>
                    </label>
                  ))}
                </div>
                <label className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 max-w-md">
                  <input
                    type="checkbox"
                    {...register("digitalPaymentsReady")}
                  />{" "}
                  Comfortable with Digital Payments
                </label>
              </div>

              {/* 2E */}
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("commerceConsent", {
                      required: watchCommerceInterest
                        ? "Required for commerce"
                        : false,
                    })}
                    className="mt-1 w-5 h-5 text-brand-primary rounded"
                  />
                  <span className="font-bold text-gray-800 text-sm">
                    I understand commercial activation requires independent
                    verification and review.
                  </span>
                </label>
                {errors.commerceConsent && (
                  <p className="text-red-500 text-xs mt-2">Required.</p>
                )}
              </div>
            </div>
          )}

          {/* 7. Declaration & Signature */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              7. Declaration & Signature
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Digital Signature *
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <SignaturePad onChange={setSignatureData} />
                </div>
                {!signatureData && (
                  <p className="text-red-500 text-xs mt-1">
                    Signature is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Type Full Name to Confirm *
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder={`Type "${watch("fullName") || "your full name"}"`}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary outline-none"
                />
                <p className="text-gray-500 text-xs mt-1">
                  By typing your name and signing above, you confirm that this
                  information has been submitted with the applicant’s knowledge
                  and consent.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !signatureData || !typedName}
              className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                isSubmitting || !signatureData || !typedName
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-brand-primary text-white hover:bg-brand-dark"
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Profile <FaCheck />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        isWarning={modal.isWarning}
        confirmLabel={modal.isWarning ? "Understood" : "OK"}
      />
    </div>
  );
}
