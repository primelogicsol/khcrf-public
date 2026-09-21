"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "@/lib/api";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  FaSpinner,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUser,
  FaTools,
  FaWarehouse,
  FaFileAlt,
  FaStore,
  FaFileSignature,
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
  referralCode: string;
}

export default function PublicCCSIIntakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResume = searchParams.get("resume") === "true";
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commerceEnabled, setCommerceEnabled] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [referralStatus, setReferralStatus] = useState<"pending" | "submitted">(
    "pending",
  );

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isWarning: false,
    onConfirm: () => {},
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const params = useParams();
  const slug = params.slug as string;
  // Map URL category to select value
  const categoryMap: Record<string, string> = {
    artisan: "Individual Artisan",
    cooperative: "Cooperative / Institution",
    business: "Registered Business",
    institution: "Training Unit / Craft Body",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger, // Added trigger for manual validation
    getValues,
    formState: { errors, isValid },
  } = useForm<CCSIFormData>({
    mode: "onChange",
    defaultValues: {
      applicantCategory: "",
      fullName: "",
      businessName: "",
      fatherName: "",
      gender: "",
      primaryContact: "",
      alternateContact: "",
      email: "",
      village: "",
      district: "",
      clusterName: "",
      primaryCraft: "",
      secondaryCraft: "",
      yearsExperience: 0,
      familyLineage: false,
      giAssociation: "",
      monthlyCapacity: "",
      capacityUnit: "",
      numberOfWorkers: 0,
      workshopAddress: "",
      workshopSeparate: false,
      geoCaptured: true,
      rawMaterials: "",
      toolsUsed: "",
      salesChannels: [],
      isCommerceInterested: false,
      digitalTools: [],
      digitalPaymentsReady: false,
      commerceConsent: false,
      consentDeclared: false,
      referralCode: searchParams.get("referralCode") || "",
    },
  });

  const watchCommerceInterest = watch("isCommerceInterested");
  const watchPrimaryCraft = watch("primaryCraft");
  const watchReferralCode = watch("referralCode");

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
      setValue("secondaryCraft", "");
    } else {
      setSubCategories([]);
      setValue("secondaryCraft", "");
    }
  }, [watchPrimaryCraft, setValue]);

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [typedName, setTypedName] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isResume && !initialFetchDone) {
        try {
          const res = await api.get("/ccsi/my-profile");
          if (res.data) {
            // Pre-fill form using reset for reliability
            const urlCode = searchParams.get("referralCode");
            reset({
              ...getValues(),
              ...res.data,
              referralCode: urlCode || res.data.referralCode || "",
              isCommerceInterested: true, // Force true when resuming via "Activate"
            });
            // If they are resuming, jump to step 6 (finalize)
            setCurrentStep(6);
          }
        } catch (error) {
          console.error("Failed to fetch resume profile", error);
        } finally {
          setInitialFetchDone(true);
        }
      }
    };
    fetchProfileData();
  }, [isResume, initialFetchDone, setValue]);

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
        signature: signatureData,
        signatureTimestamp: new Date().toISOString(),
        isProfileCompleted: isResume || !data.isCommerceInterested,
      };

      let createdId = "";
      if (isResume) {
        // Send slug if required by backend, since we use PUT /ccsi/resume
        const res = await api.put(`/ccsi/resume`, { ...payload, slug });
        createdId =
          res.data?.applicationCode ||
          `CCSI-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
      } else {
        const res = await api.post(`/legislative/public/${slug}/ccsi`, payload);
        createdId =
          res.data?.applicationCode ||
          `CCSI-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
      }
      setSubmittedId(createdId);
      setIsSuccess(true);
      window.scrollTo(0, 0);
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
  const [loadingOffice, setLoadingOffice] = useState(true);

  useEffect(() => {
    const fetchOffice = async () => {
      if (!slug) return;
      try {
        const res = await api.get(`/legislative/public/${slug}`);
        setOfficeData(res.data);
        if (res.data?.district) {
          setValue("district", res.data.district);
        }
      } catch (err) {
        console.error("Failed to fetch office details", err);
      } finally {
        setLoadingOffice(false);
      }
    };
    fetchOffice();
  }, [slug, setValue]);

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
      // Identity Validation specific for Step 1
      if (currentStep === 1 && !isResume) {
        setIsSubmitting(true);
        try {
          // If slug is empty string, we use general intake logic
          const endpoint = slug
            ? `/legislative/public/${slug}/ccsi/validate`
            : `/legislative/public/ccsi/validate`;
          await api.post(endpoint, {
            primaryContact: getValues("primaryContact"),
            email: getValues("email"),
          });
        } catch (error: any) {
          console.error("Validation Error", error);
          setModal({
            isOpen: true,
            title: "Existing Registration Found",
            message:
              error.response?.data?.message ||
              "This contact information is already registered.",
            isWarning: true,
            onConfirm: closeModal,
          });
          setIsSubmitting(false);
          return; // Stop step progression
        }
        setIsSubmitting(false);
      }

      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  if (loadingOffice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner data-ui-icon  className="animate-spin  text-4xl" />
      </div>
    );
  }

  // --- Render Steps ---

  const formSteps = [
    { id: 1, title: "Identity", icon: FaUser },
    { id: 2, title: "Craft", icon: FaTools },
    { id: 3, title: "Workshop", icon: FaWarehouse },
    { id: 4, title: "Docs", icon: FaFileAlt },
    { id: 5, title: "Sales", icon: FaStore },
    { id: 6, title: "Finalize", icon: FaFileSignature },
  ];

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fadeIn font-sans">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FaCheckCircle data-ui-icon  className="text-4xl " />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                ✅ Registration Successfully Submitted
              </h2>
              <p className="text-white/90 font-medium max-w-lg mx-auto">
                Thank you for completing the{" "}
                {officeData?.constituency
                  ? `${officeData.constituency} Constituency`
                  : "Constituency"}{" "}
                Craft & Stakeholder Intake. Your profile has been recorded in
                the official registry.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Process Timeline */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-6">
                🔄 What Happens Next
              </h3>
              <div className="space-y-4 font-medium text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟢</span> Application Received
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟢</span> Initial Data Validation
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟡</span> Desk Review (In Progress)
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <span className="text-xl grayscale">⚪</span> Field
                  Verification (If Required)
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <span className="text-xl grayscale">⚪</span> Registry
                  Confirmation
                </div>
                {watchCommerceInterest && (
                  <div
                    className={`flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 font-bold ${
                      watchReferralCode
                        ? "text-brand-primary"
                        : "text-amber-600"
                    }`}
                  >
                    <span className="text-xl">
                      {watchReferralCode ? "✅" : "🔒"}
                    </span>
                    Commerce Activation –{" "}
                    {watchReferralCode
                      ? "Referral Applied"
                      : "Awaiting Referral Code"}
                  </div>
                )}
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📄 Application Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Tracking Code
                  </p>
                  <p className="font-bold text-gray-900">{submittedId}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Applicant Name
                  </p>
                  <p className="font-bold text-gray-900">
                    {getValues("fullName")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Primary Craft
                  </p>
                  <p className="font-bold text-gray-900">
                    {getValues("primaryCraft")}{" "}
                    {getValues("secondaryCraft")
                      ? `(${getValues("secondaryCraft")})`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    District
                  </p>
                  <p className="font-bold text-gray-900">
                    {getValues("district") || "Pending Allocation"}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2 pt-2">
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Commerce Status
                  </p>
                  <p
                    className={`font-bold flex items-center gap-2 ${
                      watchCommerceInterest
                        ? watchReferralCode
                          ? "text-brand-primary"
                          : "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    {watchCommerceInterest
                      ? watchReferralCode
                        ? "Active: Referral Applied – Pending Office Activation"
                        : "Pending – Referral Required"
                      : "Not Requested"}
                  </p>
                </div>
              </div>
            </div>

            {/* Final Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-100">
              <button
                onClick={() => router.push("/profile")}
                className="px-8 py-3 bg-white border-2 border-brand-primary text-brand-primary font-bold rounded-xl shadow-sm hover:bg-brand-primary/5 transition-all text-center"
              >
                View My Application Status
              </button>
              <button
                onClick={() => router.push(`/legislative-office/${slug}`)}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-center"
              >
                Return to Constituency Desk
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-10 animate-fadeIn font-sans">
      {/* Header */}
      <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {officeData?.constituency
              ? `${officeData.constituency} Craft Stakeholder Intake`
              : "Constituency Stakeholder Intake"}
          </h2>
          <p className="text-white/90 font-medium">
            Register your craft profile with the Hamadan Craft Revival Foundation - Kashmir
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        {/* Progress Bar */}
        <div className="mb-12 relative px-4">
          <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
          <div
            className="hidden md:block absolute top-7 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
          ></div>

          <div className="flex justify-between relative z-10">
            {formSteps.map((s, i) => {
              const Icon = s.icon;
              const isActive = currentStep >= s.id;
              const isCompleted = currentStep > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center group cursor-default"
                  style={{ width: `${100 / formSteps.length}%` }}
                >
                  <div
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full md:rounded-2xl flex items-center justify-center border-4 transition-all duration-300 transform ${
                      isActive
                        ? "bg-white border-brand-primary text-icon-on-light shadow-lg scale-110"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <Icon
                        className={
                          isActive ? "text-sm md:text-xl" : "text-sm md:text-lg"
                        }
                      />
                    )}
                  </div>
                  <span
                    className={`hidden md:block mt-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 text-center ${
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
      </div>

      <div className="p-8">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("Form Validation Errors:", errors);
            alert(
              "Submission blocked. Please check all steps for errors: " +
                Object.keys(errors).join(", "),
            );
          })}
          className="space-y-8 min-h-[400px]"
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
                  {
                    value: "Registered Business",
                    label: "Registered Business",
                  },
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
                      setValue("alternateContact", val, {
                        shouldValidate: true,
                      });
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
                  label="Any GI User Authorization Number"
                  {...register("giAssociation")}
                  placeholder="Enter GI User Authorization Number"
                />
                <div className="flex flex-col sm:flex-row gap-4 md:col-span-2 lg:col-span-1">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Max Monthly Capacity *
                    </label>
                    <input
                      type="number"
                      {...register("monthlyCapacity", { required: "Required" })}
                      placeholder="Enter Max Monthly Capacity"
                      className={`w-full px-4 py-2 rounded-lg border text-gray-900 border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all ${errors.monthlyCapacity ? "border-red-500" : ""}`}
                    />
                    {errors.monthlyCapacity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.monthlyCapacity.message as string}
                      </p>
                    )}
                  </div>
                  <div className="sm:w-1/3 min-w-[140px]">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      {...register("capacityUnit")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary outline-none"
                    >
                      <option value="Units / Pieces">Units / Pieces</option>
                      <option value="Sets">Sets</option>
                      <option value="Sq. Feet">Sq. Feet</option>
                      <option value="Sq. Meters">Sq. Meters</option>
                      <option value="Units">Units</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="Pairs">Pairs</option>
                      <option value="Panels">Panels</option>
                    </select>
                  </div>
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
                  onChange={(f) =>
                    f && handleDocumentUpload("docArtisanCard", f)
                  }
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
                  onChange={(f) =>
                    f && handleDocumentUpload("docInstitution", f)
                  }
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
            {/* Step 6: Application Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📄 Application Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Applicant Name
                  </p>
                  <p className="font-bold text-gray-900">
                    {watch("fullName") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Primary Contact
                  </p>
                  <p className="font-bold text-gray-900">
                    {watch("primaryContact") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Primary Craft
                  </p>
                  <p className="font-bold text-gray-900">
                    {watch("primaryCraft") || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    District
                  </p>
                  <p className="font-bold text-gray-900">
                    {watch("district") || "Pending Allocation"}
                  </p>
                </div>
                <div className="col-span-1 md:col-span-2 pt-2 border-t border-gray-100">
                  <p className="text-gray-500 uppercase tracking-wider text-xs font-bold mb-1">
                    Commerce Status
                  </p>
                  <p
                    className={`font-bold flex items-center gap-2 ${
                      watchCommerceInterest
                        ? watchReferralCode
                          ? "text-brand-primary"
                          : "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    {watchCommerceInterest ? (
                      watchReferralCode ? (
                        <>
                          <FaCheckCircle /> Active: Referral Applied (
                          {watchReferralCode})
                        </>
                      ) : (
                        <>
                          <FaExclamationTriangle /> Pending – Referral Required
                        </>
                      )
                    ) : (
                      "Not Requested"
                    )}
                  </p>
                </div>
              </div>
            </div>
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
                  <label className="flex items-start gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      {...register("consentDeclared", {
                        required: "Declaration consent is required",
                      })}
                      className="mt-1 w-5 h-5 text-brand-primary rounded"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      I confirm that this information has been submitted with
                      the applicant’s knowledge and consent. I also understand
                      that registration approval does not guarantee Digital
                      Commerce activation.
                    </span>
                  </label>
                  {errors.consentDeclared && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.consentDeclared.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Commerce Toggle */}
            <div
              className={`p-6 rounded-xl border bg-gray-50 ${errors.isCommerceInterested ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    {...register("isCommerceInterested", {
                      required:
                        "Please indicate if the applicant is interested in Digital Commerce.",
                    })}
                    className="w-6 h-6 text-brand-primary rounded focus:ring-brand-primary"
                  />
                </div>
                <div className="flex-1">
                  <span className="block text-lg font-bold text-gray-900 flex items-center gap-2">
                    Applicant interested in Digital Commerce?{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-sm text-gray-500 block mt-1">
                    Enable this to express interest. A referral code is required
                    to complete your commerce profile later.
                  </span>
                  {errors.isCommerceInterested && (
                    <p className="text-red-500 text-sm font-bold mt-2">
                      {errors.isCommerceInterested.message as string}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {watchCommerceInterest && !isResume && (
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 mt-4 space-y-4">
                <p className="text-amber-800 text-sm font-bold flex items-center gap-2">
                  <FaExclamationTriangle className="text-lg" /> Digital Commerce
                  Activation Info
                </p>
                <div className="text-amber-700 text-sm space-y-3">
                  <p>
                    Your Part A registry submission will be accepted and
                    processed upon review.
                  </p>
                  <p>
                    Digital Commerce activation is a separate step and requires
                    an official referral code issued by the concerned public
                    representative or authorized constituency office.
                  </p>
                  <p>
                    Applicants who have indicated interest in Digital Commerce
                    may request a referral code after initial desk review.
                  </p>
                  <p className="font-semibold">
                    Registry approval does not depend on Digital Commerce
                    activation.
                  </p>
                </div>
              </div>
            )}

            {watchCommerceInterest && isResume && (
              <div className="space-y-8 animate-fadeIn mt-6 border-t border-gray-100 pt-6">
                {/* Referral Code Required on Resume */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]"></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Constituency Referral Code *
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please enter the referral code provided by your local
                    constituency office to activate your Commerce Profile.
                  </p>
                  <Input
                    {...register("referralCode", {
                      required:
                        "Referral code is required for commerce activation",
                    })}
                    placeholder="e.g. CC-XYZ-123"
                  />
                  {errors.referralCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.referralCode.message}
                    </p>
                  )}
                </div>

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
                className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                  isSubmitting
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
      </div>
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
