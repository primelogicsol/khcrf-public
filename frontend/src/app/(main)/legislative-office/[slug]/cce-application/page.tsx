"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  FaAward,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaArrowUp,
  FaFileUpload,
  FaSpinner,
  FaExclamationTriangle,
  FaIdCard,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import FileChoosing from "@/components/common/FileChoosing";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { uploadFile } from "@/lib/cloudinary";

interface CceFormData {
  // Section 1
  stakeholderCategory: string;
  entityName: string;
  ccsiRegistrationId: string;
  referralCode: string;
  craftCategory: string;
  clusterName: string;
  phone: string;
  email: string;
  address: string;

  // Section 2
  awardCategory: string;

  // Section 3
  yearsExperience: number;
  productionScale: string;
  teamSize?: number;
  marketsServed: string[];
  giStatus: boolean;
  giAuthorizedNumber?: string;
  giSupportingDoc?: string;

  // Section 4
  meritStatement: string;

  // Section 5
  productImages?: string[];
  certifications?: string[];
  giDocumentation?: string[];
  exportRecords?: string[];
  mediaCoverage?: string[];
  testimonials?: string[];
  complianceDocs?: string[];

  // Section 6
  complianceAccurate: boolean;
  meritBasedAck: boolean;
  noSponsorshipImpact: boolean;
  publicDisplayConsent: boolean;
  signature: string;

  // Section 7
  communityImpact: {
    employment: string;
    training: string;
    empowerment: string;
  };
  sustainability: {
    ecoFriendly: string;
    materialTransparency: string;
    wasteReduction: string;
  };
}

export default function CceApplicationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingCCSI, setIsVerifyingCCSI] = useState(false);
  const [ccsiVerified, setCcsiVerified] = useState(false);
  const [office, setOffice] = useState<any>(null);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    isWarning: false,
    onConfirm: () => {},
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CceFormData>({
    mode: "onChange",
    defaultValues: {
      marketsServed: [],
      giStatus: false,
      complianceAccurate: false,
      meritBasedAck: false,
      noSponsorshipImpact: false,
      publicDisplayConsent: false,
      communityImpact: {
        employment: "",
        training: "",
        empowerment: "",
      },
      sustainability: {
        ecoFriendly: "",
        materialTransparency: "",
        wasteReduction: "",
      },
    },
  });

  const ccsiId = watch("ccsiRegistrationId");

  useEffect(() => {
    if (slug) {
      api.get(`/legislative/public/${slug}`).then((res) => {
        setOffice(res.data);
        if (res.data?.referralCode) {
          setValue("referralCode", res.data.referralCode);
        }
      });
    }
  }, [slug, setValue]);

  const verifyCCSI = async () => {
    if (!ccsiId) return;
    setIsVerifyingCCSI(true);
    try {
      const { data } = await api.get(`/ccsi/verify/${ccsiId}`);
      if (
        data.status === "VERIFIED" ||
        data.status === "JURISDICTION_APPROVED"
      ) {
        setCcsiVerified(true);
        setValue("entityName", data.fullName || data.businessName);
        setValue("email", data.email || "");
        setValue("phone", data.primaryContact || "");
        setValue("address", data.village || "");
      } else {
        setCcsiVerified(false);
        setModal({
          isOpen: true,
          title: "Verification Pending",
          message:
            "Your CCSI Profile is not yet fully verified. Only verified stakeholders can apply.",
          isWarning: true,
          onConfirm: closeModal,
        });
      }
    } catch (error) {
      setCcsiVerified(false);
      setModal({
        isOpen: true,
        title: "Invalid ID",
        message: "Could not find a verified CCSI profile with this ID.",
        isWarning: true,
        onConfirm: closeModal,
      });
    } finally {
      setIsVerifyingCCSI(false);
    }
  };

  const onSubmit = async (data: CceFormData) => {
    if (!ccsiVerified) {
      setModal({
        isOpen: true,
        title: "CCSI Verification Required",
        message: "Please verify your CCSI Registration ID before submitting.",
        isWarning: true,
        onConfirm: closeModal,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        legislativeOfficeId: office?.id,
      };
      const res = await api.post("/cce/apply", payload);
      setModal({
        isOpen: true,
        title: "Application Submitted!",
        message: `Your application has been received. Reference Number: ${res.data.referenceNumber}`,
        isWarning: false,
        onConfirm: () => router.push(`/legislative-office/${slug}`),
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: "Submission Error",
        message: error.response?.data?.error || "Failed to submit application.",
        isWarning: true,
        onConfirm: closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (field: string, file: File) => {
    try {
      const url = await uploadFile(file);
      const current = watch(field as any) || [];
      if (Array.isArray(current)) {
        setValue(field as any, [...current, url]);
      } else {
        setValue(field as any, url);
      }
    } catch (error) {
      alert("File upload failed");
    }
  };

  const nextStep = async () => {
    let fields: any[] = [];
    if (currentStep === 1) {
      fields = [
        "stakeholderCategory",
        "entityName",
        "ccsiRegistrationId",
        "craftCategory",
        "phone",
        "email",
        "address",
      ];
      if (!ccsiVerified) {
        verifyCCSI();
        return;
      }
    }
    if (currentStep === 2) fields = ["awardCategory"];
    if (currentStep === 3)
      fields = ["yearsExperience", "productionScale", "marketsServed"];
    if (currentStep === 4) fields = ["meritStatement"];

    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-brand-primary p-8 md:p-12 text-white relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-yellow-300">
                <FaAward className="text-3xl" />
                <span className="font-bold uppercase tracking-widest text-sm">
                  Award Application
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black font-playfair leading-tight mb-2">
                CCE Program Application
              </h1>
              <p data-editorial-accent-text className="-light font-medium uppercase tracking-wide text-xs">
                Constituency Craft Excellence Program
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          {/* Stepper */}
          <div className="px-8 md:px-12 py-6 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentStep >= step ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" : "bg-gray-200 text-gray-400"}`}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">
              <span>Info</span>
              <span>Category</span>
              <span>Metrics</span>
              <span>Merit</span>
              <span>Evidence</span>
              <span>Final</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 md:p-12 space-y-8"
          >
            {/* STEP 1: Applicant Info */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <FaIdCard className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">
                      CCSI Verification Required
                    </h3>
                    <p className="text-xs text-blue-700">
                      Enter your CCSI Registration ID to auto-fill details and
                      confirm eligibility.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">
                      CCSI Registration ID (Mandatory)
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...register("ccsiRegistrationId", {
                          required: "Required",
                        })}
                        placeholder="e.g. CCSI-123456"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={verifyCCSI}
                        disabled={isVerifyingCCSI}
                        className="px-6 bg-brand-primary text-white font-bold rounded-xl disabled:bg-gray-300"
                      >
                        {isVerifyingCCSI ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                    {ccsiVerified && (
                      <p className="text-green-600 text-[10px] font-bold uppercase flex items-center gap-1">
                        <FaCheckCircle /> Verified CCSI Registry Profile
                      </p>
                    )}
                  </div>

                  <Select
                    label="Stakeholder Category"
                    {...register("stakeholderCategory", {
                      required: "Required",
                    })}
                    options={[
                      { value: "Artisan", label: "Artisan" },
                      {
                        value: "Cooperative / SHG",
                        label: "Cooperative / SHG",
                      },
                      { value: "Business Entity", label: "Business Entity" },
                      { value: "Institution", label: "Institution" },
                    ]}
                    error={errors.stakeholderCategory?.message}
                  />

                  <Input
                    label="Full Name / Entity Name"
                    {...register("entityName", { required: "Required" })}
                    error={errors.entityName?.message}
                  />
                  <Input
                    label="Constituency Referral Code"
                    {...register("referralCode")}
                    disabled
                  />
                  <Input
                    label="Craft Category"
                    {...register("craftCategory", { required: "Required" })}
                    error={errors.craftCategory?.message}
                  />
                  <Input
                    label="Cluster Name / Location"
                    {...register("clusterName")}
                  />
                  <Input
                    label="Phone"
                    {...register("phone", { required: "Required" })}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Email"
                    {...register("email", { required: "Required" })}
                    error={errors.email?.message}
                  />
                  <Input
                    label="Address"
                    {...register("address", { required: "Required" })}
                    error={errors.address?.message}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Award Category */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6">
                    Select Your Award Category
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        id: "Craft Excellence Award",
                        title: "Craft Excellence Award",
                        desc: "For exceptional hand-crafted quality and skill.",
                      },
                      {
                        id: "GI Integrity & Authenticity Award",
                        title: "GI Integrity & Authenticity Award",
                        desc: "For dedication to genuine GI standards.",
                      },
                      {
                        id: "Innovation in Craft Award",
                        title: "Innovation in Craft Award",
                        desc: "For design, process or digital innovation.",
                      },
                      {
                        id: "Women Leadership in Craft Award",
                        title: "Women Leadership in Craft Award",
                        desc: "For empowering women in the craft sector.",
                      },
                      {
                        id: "Export & Market Readiness Award",
                        title: "Export & Market Readiness Award",
                        desc: "For outstanding market-linked growth.",
                      },
                    ].map((cat) => (
                      <label
                        key={cat.id}
                        className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all ${watch("awardCategory") === cat.id ? "border-brand-primary bg-brand-primary/5" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              {...register("awardCategory", {
                                required: "Required",
                              })}
                              value={cat.id}
                              className="w-5 h-5 text-brand-primary"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {cat.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {cat.desc}
                              </p>
                            </div>
                          </div>
                          <FaAward data-ui-icon 
                            className={`text-2xl transition-all ${watch("awardCategory") === cat.id ? " scale-110" : "text-gray-200"}`}
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.awardCategory && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.awardCategory.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Performance Metrics */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-bold font-playfair text-gray-900 border-b border-gray-100 pb-4">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Years of Active Practice"
                    type="number"
                    {...register("yearsExperience", { required: "Required" })}
                    error={errors.yearsExperience?.message}
                  />
                  <Select
                    label="Production Scale"
                    {...register("productionScale", { required: "Required" })}
                    options={[
                      { value: "Small", label: "Small" },
                      { value: "Medium", label: "Medium" },
                      { value: "Large", label: "Large" },
                    ]}
                    error={errors.productionScale?.message}
                  />
                  <Input
                    label="Number of Team Members"
                    type="number"
                    {...register("teamSize")}
                  />

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">
                      Markets Served
                    </label>
                    <div className="flex gap-4">
                      {["Local", "National", "International"].map((m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 cursor-pointer font-medium text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            value={m}
                            {...register("marketsServed")}
                            className="w-4 h-4 rounded text-brand-primary"
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("giStatus")}
                        className="w-5 h-5 rounded text-brand-primary"
                      />
                      <span className="font-bold text-gray-900">
                        Do you hold a GI Authorized User status?
                      </span>
                    </label>
                    {watch("giStatus") && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideDown">
                        <Input
                          label="GI Authorized User Number"
                          {...register("giAuthorizedNumber")}
                        />
                        <FileChoosing
                          label="GI Doc Upload"
                          onChange={(f) =>
                            f && handleFileUpload("giSupportingDoc", f)
                          }
                          previewUrl={watch("giSupportingDoc")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Merit Statement */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaAward data-ui-icon  className="" /> Merit Statement
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Describe why you believe you qualify for this award (500–800
                    words). Focus on quality standards, innovation, integrity,
                    community contribution, and sustainability practices.
                  </p>
                </div>
                <textarea
                  {...register("meritStatement", {
                    required: "Required",
                    minLength: { value: 500, message: "Min 500 words" },
                  })}
                  rows={15}
                  placeholder="Type your merit statement here..."
                  className="w-full text-gray-900 p-6 rounded-2xl border border-gray-300 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all leading-relaxed"
                />
                {errors.meritStatement && (
                  <p className="text-red-500 text-xs">
                    {errors.meritStatement.message}
                  </p>
                )}
              </div>
            )}

            {/* STEP 5: Evidence Upload */}
            {currentStep === 5 && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-bold font-playfair text-gray-900">
                  Supporting Evidence
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FileChoosing
                    label="Product Images"
                    onChange={(f) => f && handleFileUpload("productImages", f)}
                    previewUrl={watch("productImages")?.[0]}
                  />
                  <FileChoosing
                    label="Certification Docs"
                    onChange={(f) => f && handleFileUpload("certifications", f)}
                  />
                  <FileChoosing
                    label="GI Documentation"
                    onChange={(f) =>
                      f && handleFileUpload("giDocumentation", f)
                    }
                  />
                  <FileChoosing
                    label="Export Records"
                    onChange={(f) => f && handleFileUpload("exportRecords", f)}
                  />
                  <FileChoosing
                    label="Media Coverage"
                    onChange={(f) => f && handleFileUpload("mediaCoverage", f)}
                  />
                  <FileChoosing
                    label="Testimonials"
                    onChange={(f) => f && handleFileUpload("testimonials", f)}
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Finalize */}
            {currentStep === 6 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 border-b border-gray-100 pb-4">
                    Compliance Declaration
                  </h3>
                  {[
                    {
                      id: "complianceAccurate",
                      label:
                        "I confirm that all submitted information is accurate.",
                    },
                    {
                      id: "meritBasedAck",
                      label:
                        "I understand that selection is merit-based and not guaranteed.",
                    },
                    {
                      id: "noSponsorshipImpact",
                      label:
                        "I acknowledge that sponsorship does not influence evaluation.",
                    },
                    {
                      id: "publicDisplayConsent",
                      label:
                        "I consent to public display of award profile if selected.",
                    },
                  ].map((chk) => (
                    <label
                      key={chk.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        {...register(chk.id as any, { required: true })}
                        className="w-5 h-5 rounded text-brand-primary mt-0.5"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {chk.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="p-8 bg-gray-900 rounded-3xl text-white">
                  <h4 className="font-bold text-yellow-400 uppercase tracking-widest text-xs mb-4">
                    Final Submission
                  </h4>
                  <div className="space-y-6">
                    <Input
                      label="Digital Signature (Type Full Name)"
                      {...register("signature", { required: "Required" })}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-brand-dark transition-all flex items-center justify-center gap-3 text-lg"
                    >
                      {isSubmitting ? (
                        <FaSpinner className="animate-spin text-2xl" />
                      ) : (
                        <>
                          <FaCheckCircle /> Submit Award Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:border-gray-900 hover:text-gray-900 transition-all flex items-center gap-2"
                >
                  <FaArrowLeft /> Back
                </button>
              )}
              {currentStep < 6 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-all flex items-center gap-2 group"
                >
                  Continue{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
