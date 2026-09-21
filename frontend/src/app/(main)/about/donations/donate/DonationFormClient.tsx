"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import {
  FaHandHoldingHeart,
  FaLayerGroup,
  FaUser,
  FaCreditCard,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaRupeeSign,
  FaTools,
  FaPaintBrush,
  FaCubes,
  FaPalette,
  FaWarehouse,
  FaLightbulb,
  FaCamera,
  FaVideo,
  FaBookOpen,
  FaBalanceScale,
  FaUniversity,
  FaQrcode,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { getPaymentErrorMessage } from "./utils/paymentErrors";

// --- Validation Schemas ---

const donationSchema = z
  .object({
    // Step 1: Donation Details
    amountType: z.enum(["preset", "custom"]),
    presetAmount: z.string().optional(),
    customAmount: z.string().optional(),
    donationType: z.string().min(1, "Please select a donation type"),

    // Step 2: Donation Pool
    pool: z.string().min(1, "Please select a donation pool"),

    // Step 3: Personal Info
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    streetAddress: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zip: z.string().min(5, "Zip code is required"),
    country: z.string().min(2, "Country is required"),
    donorType: z.enum(["INDIVIDUAL", "INSTITUTIONAL", "CORPORATE", "IN_KIND", "LEGACY"]),
    isAnonymous: z.boolean(),
    wantsReceipt: z.boolean(),
    recognitionConsent: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.amountType === "preset" && !data.presetAmount) return false;
      if (data.amountType === "custom" && !data.customAmount) return false;
      return true;
    },
    {
      message: "Please select or enter a donation amount",
      path: ["amountType"], // Attach error to amountType conceptually
    },
  );

type FormData = z.infer<typeof donationSchema>;

const steps = [
  { id: 1, title: "Donation Details", icon: FaHandHoldingHeart },
  { id: 2, title: "Donation Pool", icon: FaLayerGroup },
  { id: 3, title: "Personal Info", icon: FaUser },
  { id: 4, title: "Payment", icon: FaCreditCard },
];

// Donation Pools Data
const donationPools = [
  {
    category: "Tools (Essential)",
    icon: FaTools,
    items: ["Handlooms", "Powerlooms", "Spinning Wheels"],
  },
  {
    category: "Carpentry & Wood Carving",
    icon: FaCubes,
    items: ["Chisels (per set)", "Gouges", "Lathes"],
  },
  {
    category: "Papier-Mâché",
    icon: FaPalette,
    items: ["Molds", "Forms", "Drying Racks"],
  },
  {
    category: "Textile Eco Dyeing",
    icon: FaPaintBrush,
    items: ["Screen Frames", "Dye Trays", "Brushes"],
  },
  {
    category: "Enhanced Workshop Conditions",
    icon: FaWarehouse,
    items: [
      "Ventilation Systems (Exhausts)",
      "Lighting Systems (Solar)",
      "Waste Management Bins",
      "Ergonomic Furniture",
      "Fire Safety Equipment",
    ],
  },
  {
    category: "Craft Innovation Support",
    icon: FaLightbulb,
    items: [
      "Drawing Kits (basic)",
      "Professional Artist Kits",
      "Entry-Level DSLR",
      "Basic 3D Printers",
      "CAD Software Licenses",
    ],
  },
  {
    category: "Product Photography",
    icon: FaCamera,
    items: [
      "Entry-Level DSLR",
      "Professional DSLR/Mirrorless",
      "Smartphone Cameras",
      "Reflectors",
      "LED Lights",
      "Softboxes",
    ],
  },
  {
    category: "Documentaries & Storytelling",
    icon: FaVideo,
    items: [
      "Professional Video Cameras",
      "Lavalier Microphones",
      "Final Cut Pro (Mac)",
      "Tripods/Stabilizers",
    ],
  },
  {
    category: "Research & Development",
    icon: FaBookOpen,
    items: [
      "Design Libraries",
      "Manuals on Design",
      "Workshops for Artisans",
      "Hiring design researchers",
    ],
  },
  {
    category: "Policy Advocacy",
    icon: FaBalanceScale,
    items: [
      "Artisan Rights Advocacy",
      "Fair Trade Policies",
      "Craft Intellectual Property (GI)",
      "Lobbying for craft subsidies"
    ]
  }
];

export default function DonationFormClient({ lockedCategory }: { lockedCategory?: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [_donationIntentId, setDonationIntentId] = useState<string | null>(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"RAZORPAY" | "BANK_TRANSFER" | "UPI_STATIC_QR" | "CHEQUE" | "DEMAND_DRAFT">("RAZORPAY");
  const [utrNumberBank, setUtrNumberBank] = useState("");
  const [utrNumberUpi, setUtrNumberUpi] = useState("");
  const [originatingBank, setOriginatingBank] = useState("");
  const [instrumentNumber, setInstrumentNumber] = useState("");
  const [issuingBank, setIssuingBank] = useState("");
  const [offlineSuccessRef, setOfflineSuccessRef] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amountType: "preset",
      donationType: "oneTime",
      donorType: "INDIVIDUAL",
      isAnonymous: false,
      wantsReceipt: true,
      recognitionConsent: false,
      country: "India",
    },
    mode: "onChange",
  });

  const formValues = watch();

  const hasPrefilledRef = useState({ current: false })[0];

  // Autofill logged-in user info once without overriding subsequent donor edits
  useEffect(() => {
    if (!user || hasPrefilledRef.current) return;
    if (user.email) setValue("email", user.email);
    // user.name may be a full name — split into first/last
    if ((user as any).firstName) setValue("firstName", (user as any).firstName);
    else if (user.name) setValue("firstName", user.name.split(" ")[0] || "");
    if ((user as any).lastName) setValue("lastName", (user as any).lastName);
    else if (user.name) setValue("lastName", user.name.split(" ").slice(1).join(" ") || "");
    hasPrefilledRef.current = true;
  }, [user, setValue, hasPrefilledRef]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      const amountValid = await trigger([
        "amountType",
        "presetAmount",
        "customAmount",
        "donationType",
      ]);
      const currentAmountType = formValues.amountType;
      if (currentAmountType === "preset" && !formValues.presetAmount) {
        valid = false;
      } else if (currentAmountType === "custom" && !formValues.customAmount) {
        valid = false;
      } else {
        valid = amountValid;
      }
    }
    if (step === 2) valid = await trigger(["pool"]);
    if (step === 3)
      valid = await trigger([
        "firstName",
        "lastName",
        "email",
        "phone",
        "streetAddress",
        "city",
        "state",
        "zip",
        "country",
      ]);

    if (valid) {
      setPaymentErrorMessage(null); // Clear stale errors on step progression
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setPaymentErrorMessage(null); // Clear stale errors on step regression
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData, paymentData?: unknown) => {
    setIsSubmitting(true);
    try {
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: unknown) {
      console.error("Submission Error:", error);
      alert("Failed to confirm donation checkout. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfflineSubmit = async () => {
    // ── Frontend validation before hitting the API ──────────────────────
    if (selectedPaymentMethod === "BANK_TRANSFER") {
      if (!utrNumberBank || utrNumberBank.trim().length < 6) {
        setPaymentErrorMessage("Please enter a valid UTR / Bank Reference Number (minimum 6 characters).");
        return;
      }
    }
    if (selectedPaymentMethod === "UPI_STATIC_QR") {
      if (!utrNumberUpi || utrNumberUpi.trim().length < 6) {
        setPaymentErrorMessage("Please enter the UPI Transaction Reference / UTR Number (minimum 6 characters).");
        return;
      }
    }
    if (selectedPaymentMethod === "CHEQUE" || selectedPaymentMethod === "DEMAND_DRAFT") {
      if (!instrumentNumber || instrumentNumber.trim().length < 3) {
        setPaymentErrorMessage("Please enter the Cheque / DD instrument number.");
        return;
      }
      if (!issuingBank || issuingBank.trim().length < 2) {
        setPaymentErrorMessage("Please enter the name of the issuing bank.");
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentErrorMessage(null);

    // Track the created intent ID so we can cancel it if the submission fails
    let createdIntentId: string | null = null;

    try {
      // 1. Create Donation Intent
      const intentPayload = { ...checkoutData, paymentMethod: selectedPaymentMethod };
      const { data: intentData } = await api.post("/donation/intent", intentPayload);
      createdIntentId = intentData.donationIntentId ?? null;

      // 2. Submit Offline Payment Evidence
      const utrNumber = selectedPaymentMethod === "BANK_TRANSFER" ? utrNumberBank
                      : selectedPaymentMethod === "UPI_STATIC_QR" ? utrNumberUpi
                      : null;

      const offlinePayload = {
        donationIntentId: createdIntentId,
        paymentMethod: selectedPaymentMethod,
        amount: parseFloat(finalAmount || "0"),
        utrNumber,
        originatingBank: selectedPaymentMethod === "BANK_TRANSFER" ? originatingBank : null,
        instrumentNumber: (selectedPaymentMethod === "CHEQUE" || selectedPaymentMethod === "DEMAND_DRAFT") ? instrumentNumber : null,
        issuingBank: (selectedPaymentMethod === "CHEQUE" || selectedPaymentMethod === "DEMAND_DRAFT") ? issuingBank : null,
      };

      const { data: offlineData } = await api.post("/donation/offline-submit", offlinePayload);
      setOfflineSuccessRef(offlineData.referenceNumber);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error: unknown) {
      // ── Silently cancel the orphaned PENDING intent to keep DB clean ──
      if (createdIntentId) {
        api.delete(`/donation/intent/${createdIntentId}`).catch(() => { /* best-effort */ });
      }

      // ── Detect 409 duplicate reference and show specific guidance ──
      // Backend wraps error as { status, data: { code, message } }
      // Axios puts that body at error.response.data, so code is at .data.data.code
      const axiosErr = error as { response?: { status?: number; data?: { data?: { code?: string }; code?: string; message?: string } } };
      const httpStatus = axiosErr?.response?.status;
      const errCode    = axiosErr?.response?.data?.data?.code ?? axiosErr?.response?.data?.code;

      if (httpStatus === 409 && (errCode === "DUPLICATE_UTR" || errCode === "DUPLICATE_INSTRUMENT_NUMBER")) {
        const label = selectedPaymentMethod === "CHEQUE" || selectedPaymentMethod === "DEMAND_DRAFT"
          ? "instrument number"
          : "UTR / transaction reference";
        setPaymentErrorMessage(
          `This ${label} has already been submitted. Please check your entry — if you already submitted, ` +
          `your payment is being reviewed. If this is a new payment, please enter the correct reference number from your bank receipt.`
        );
      } else {
        console.error("Offline Submission Error:", error);
        const msg = getPaymentErrorMessage(error);
        setPaymentErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalAmount =
    formValues.amountType === "custom"
      ? formValues.customAmount
      : formValues.presetAmount;

  const donationPurposeMap = (poolItem: string): string => {
    const poolUpper = (poolItem || "").toUpperCase();
    if (poolUpper.includes("TOOL") || poolUpper.includes("CHISEL") || poolUpper.includes("GOUGE") || poolUpper.includes("LATHE") || poolUpper.includes("MOLD") || poolUpper.includes("FORM") || poolUpper.includes("RACK") || poolUpper.includes("FRAME") || poolUpper.includes("TRAY") || poolUpper.includes("BRUSH")) {
      return "Artisan tools";
    }
    if (poolUpper.includes("RESEARCH") || poolUpper.includes("DEVELOPMENT") || poolUpper.includes("LIBRARY") || poolUpper.includes("MANUAL") || poolUpper.includes("WORKSHOP FOR") || poolUpper.includes("EDUCATION") || poolUpper.includes("DRAWING") || poolUpper.includes("ARTIST") || poolUpper.includes("PRINTER") || poolUpper.includes("CAD")) {
      return "Craft education";
    }
    if (poolUpper.includes("ADVOCACY") || poolUpper.includes("LAW") || poolUpper.includes("POLICY") || poolUpper.includes("RIGHTS") || poolUpper.includes("INTELLECTUAL") || poolUpper.includes("LOBBY")) {
      return "Policy advocacy";
    }
    if (poolUpper.includes("PHOTOGRAPHY") || poolUpper.includes("CAMERA") || poolUpper.includes("DSLR") || poolUpper.includes("REFLECTOR") || poolUpper.includes("LIGHT") || poolUpper.includes("SOFTBOX") || poolUpper.includes("VIDEO") || poolUpper.includes("MICROPHONE") || poolUpper.includes("CLIP") || poolUpper.includes("STORY") || poolUpper.includes("DOCUMENTARY") || poolUpper.includes("FILM")) {
      return "Product photography";
    }
    if (poolUpper.includes("WORKSHOP") || poolUpper.includes("VENTILATION") || poolUpper.includes("EXHAUST") || poolUpper.includes("SOLAR") || poolUpper.includes("LIGHTING") || poolUpper.includes("BIN") || poolUpper.includes("FURNITURE") || poolUpper.includes("SAFETY")) {
      return "Workshop improvement";
    }
    return "Artisan tools";
  };

  const checkoutData = {
    amount: parseFloat(finalAmount || "0"),
    currency: "INR",
    donorType: formValues.donorType || "INDIVIDUAL",
    purpose: donationPurposeMap(formValues.pool || "Handlooms"),
    name: `${formValues.firstName} ${formValues.lastName}`,
    email: formValues.email,
    phone: formValues.phone,
    isAnonymous: !!formValues.isAnonymous,
    wantsReceipt: formValues.wantsReceipt !== false,
    recognitionConsent: !!formValues.recognitionConsent
  };

  if (isSuccess) {
    const isOffline = selectedPaymentMethod !== "RAZORPAY";
    return (
      <SubmissionSuccess
        title={isOffline ? "Payment Details Submitted" : "Donation Successful"}
        message={
          isOffline
            ? `Your payment details for ${formValues.pool} have been submitted for verification. Tax receipts are issued once funds are verified/cleared.`
            : `Thank you for your generous donation to support ${formValues.pool}.`
        }
        referenceNumber={offlineSuccessRef || _donationIntentId || `DONATION-${new Date().getFullYear()}`}
        timeline={
          isOffline
            ? [
                { label: "Details Submitted", status: "completed" },
                { label: "Admin Verification", status: "upcoming" },
                { label: "Payment Clearance", status: "upcoming" },
                { label: "Receipt Issuance", status: "upcoming" },
              ]
            : [
                { label: "Donation Received", status: "completed" },
                { label: "Payment Verified", status: "completed" },
                { label: "Donation Allocated", status: "completed" },
                { label: "Impact Report", status: "upcoming" },
              ]
        }
        summary={[
          {
            label: "Donor Name",
            value: `${formValues.firstName} ${formValues.lastName}`,
          },
          { label: "Amount", value: `₹${finalAmount}` },
          { label: "Payment Method", value: selectedPaymentMethod.replace(/_/g, " ") },
          { label: "Allocated Pool", value: formValues.pool || "General Fund" },
          { label: "Status", value: isOffline ? "AWAITING VERIFICATION" : "VERIFIED & CAPTURED" },
        ]}
        primaryAction={{
          label: "Return to Donations Page",
          href: "/about/donations",
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
            Hamadan Craft Revival Foundation - Kashmir Donation
          </h2>
          <p className="text-white/90 font-medium">
            Support traditional crafts and artisans
          </p>
        </div>
      </div>

      <div className="p-4 md:p-8 lg:p-12">
        {/* Progress Bar */}
        <div className="mb-12 relative px-4">
          <div className="hidden md:block absolute top-7 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
          <div
            className="hidden md:block absolute top-7 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          <div className="flex justify-between relative z-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCompleted = step > s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center group cursor-default w-1/4"
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

        <form
          onSubmit={handleSubmit((d) => onSubmit(d as FormData))}
          className="space-y-8 min-h-[400px]"
        >
          {step === 1 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  Select Donation Amount
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {["25", "50", "100", "250"].map((amt) => (
                    <label
                      key={amt}
                      className={`cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        formValues.amountType === "preset" &&
                        formValues.presetAmount === amt
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md"
                          : "border-gray-200 hover:border-brand-primary/50"
                      }`}
                      onClick={() => {
                        setValue("amountType", "preset");
                        setValue("presetAmount", amt);
                        setValue("customAmount", ""); // Clear custom
                      }}
                    >
                      <input
                        type="radio"
                        value={amt}
                        {...register("presetAmount")}
                        className="hidden"
                      />
                      <div className="text-xl font-black flex items-center gap-1">
                        <FaRupeeSign className="text-sm" />
                        {amt}
                      </div>
                      {formValues.amountType === "preset" &&
                        formValues.presetAmount === amt && (
                          <div data-ui-icon className="absolute top-2 right-2 ">
                            <FaCheck size={12} />
                          </div>
                        )}
                    </label>
                  ))}

                  <label
                    className={`cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      formValues.amountType === "custom"
                        ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md"
                        : "border-gray-200 hover:border-brand-primary/50"
                    }`}
                    onClick={() => {
                      setValue("amountType", "custom");
                      setValue("presetAmount", "");
                    }}
                  >
                    <span className="font-bold">Custom Amount</span>
                  </label>
                </div>
              </div>

              {formValues.amountType === "custom" && (
                <div className="max-w-md mx-auto animate-fade-in-up">
                  <Input
                    label="Enter Custom Amount (₹)"
                    type="number"
                    placeholder="Enter donation amount"
                    {...register("customAmount")}
                    error={errors.customAmount?.message}
                  />
                </div>
              )}

              {/* Error for amount if refine fails */}
              {errors.amountType && (
                <p className="text-red-500 text-center font-medium bg-red-50 p-2 rounded">
                  {errors.amountType.message}
                </p>
              )}

              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4">
                  Donation Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    {...register("donationType")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="oneTime">One-Time Donation</option>
                    <option value="monthly" disabled>Monthly Giving (Coming Soon)</option>
                    <option value="artisanSupport">Artisan Support Fund</option>
                    <option value="legacyGiving">
                      Legacy & Planned Giving
                    </option>
                    <option value="eventSponsorship">Event Sponsorship</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-sm mb-6 flex items-start gap-3">
                <FaLightbulb className="text-lg mt-0.5 shrink-0" />
                <p>
                  Choose where your donation will make the most impact. Please
                  select <strong>one</strong> specific item or cause from the
                  categories below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donationPools.map((category, idx) => {
                  if (lockedCategory && category.category !== lockedCategory) return null;
                  const CatIcon = category.icon;
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4 text-brand-secondary border-b border-gray-100 pb-3">
                        <CatIcon className="text-xl" />
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                          {category.category}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {category.items.map((item) => {
                          const isSelected = formValues.pool === item;
                          return (
                            <label
                              key={item}
                              className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
                                isSelected
                                  ? "bg-brand-primary/10 text-brand-primary font-bold"
                                  : "hover:bg-gray-50 text-gray-600"
                              }`}
                              onClick={() =>
                                setValue("pool", item, { shouldValidate: true })
                              }
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-brand-primary" : "border-gray-300"}`}
                              >
                                {isSelected && (
                                  <div data-editorial-accent-bg className="w-2.5 h-2.5 rounded-full " />
                                )}
                              </div>
                              <span className="text-sm">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.pool && (
                <div className="sticky bottom-4 mx-auto w-fit p-4 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center font-bold animate-bounce z-50">
                  Please select a donation pool option.
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-pulse-fade-in">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Your Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  error={errors.email?.message}
                />
                {/* Phone — +91 prefix fixed for India-only platform */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-stretch rounded-lg border border-gray-300 overflow-hidden focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                    <span
                      className="flex items-center px-3 bg-gray-100 text-gray-600 text-sm font-semibold border-r border-gray-300 select-none"
                      aria-hidden="true"
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      aria-label="Phone number (India +91)"
                      autoComplete="tel-national"
                      className="flex-1 px-4 py-3 bg-white text-gray-900 focus:outline-none placeholder:text-gray-400 text-sm"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1" role="alert">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">
                Address
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Street Address"
                  placeholder="Enter your street address"
                  {...register("streetAddress")}
                  error={errors.streetAddress?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="City"
                  placeholder="Enter your city"
                  {...register("city")}
                  error={errors.city?.message}
                />
                <Input
                  label="State/Province"
                  placeholder="Enter your state"
                  {...register("state")}
                  error={errors.state?.message}
                />
                <Input
                  label="Zip/Postal Code"
                  placeholder="Enter your PIN code"
                  {...register("zip")}
                  error={errors.zip?.message}
                />
                {/* Country locked to India for this platform */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    <span aria-hidden="true">🇮🇳</span>
                    <span className="font-medium">India</span>
                  </div>
                  <input type="hidden" value="India" {...register("country")} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">
                Donor Type & Consent
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Donor Type
                  </label>
                  <select
                    {...register("donorType")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="INSTITUTIONAL">Institutional</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="IN_KIND">In-kind</option>
                    <option value="LEGACY">Legacy Giving</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isAnonymous")}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-800">Donate Anonymously</span>
                    <p className="text-xs text-gray-500">Your name will not be publicly displayed on the donor recognition walls or logs.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("wantsReceipt")}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-800">Request a Tax Receipt</span>
                    <p className="text-xs text-gray-500">We will generate and issue an email receipt once payment is captured.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("recognitionConsent")}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-800">Consent for Donor Recognition</span>
                    <p className="text-xs text-gray-500">Allow KHCRF to recognize your support in public publications and logs.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-pulse-fade-in">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-secondary/5 rounded-bl-full -mr-10 -mt-10"></div>

                <h3 className="text-2xl font-bold text-gray-900 mb-8 relative z-10 flex items-center gap-2">
                  <FaCreditCard data-ui-icon  className="" /> Review
                  Donation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 relative z-10">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Donor Information
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formValues.firstName} {formValues.lastName}
                    </p>
                    <p className="text-gray-600">{formValues.email}</p>
                    <p className="text-gray-600">{formValues.phone}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formValues.streetAddress}, {formValues.city},{" "}
                      {formValues.country}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Donation Summary
                    </p>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-4xl font-black text-brand-primary flex items-start">
                        <span className="text-xl mt-1">₹</span>
                        {finalAmount}
                      </div>
                      <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full uppercase">
                        {formValues.donationType}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium flex items-center gap-2">
                      <FaLayerGroup data-ui-icon  className="" />
                      Supporting:{" "}
                      <span className="text-gray-900 font-bold">
                        {formValues.pool}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Select Contribution Method</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {[
                    { id: "RAZORPAY",      label: "Online (Razorpay)", icon: FaCreditCard },
                    { id: "BANK_TRANSFER", label: "Bank Transfer",      icon: FaUniversity },
                    { id: "UPI_STATIC_QR",label: "UPI QR Payment",     icon: FaQrcode },
                    { id: "CHEQUE",        label: "Cheque",             icon: FaFileInvoiceDollar },
                    { id: "DEMAND_DRAFT",  label: "Demand Draft",       icon: FaFileInvoiceDollar },
                  ].map((method) => {
                    const MethodIcon = method.icon;
                    const isSelected = selectedPaymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod(method.id as typeof selectedPaymentMethod);
                          setPaymentErrorMessage(null);
                        }}
                        className={`p-4 rounded-xl border-2 text-center flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-bold shadow-md"
                            : "border-gray-200 hover:border-brand-primary/40 text-gray-600"
                        }`}
                      >
                        <MethodIcon className="text-xl" />
                        <span className="text-xs font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Method Specific Panels */}
                {selectedPaymentMethod === "BANK_TRANSFER" && (
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 text-sm">Direct Bank Account Details (NEFT/RTGS/IMPS)</h5>
                    <div className="text-xs text-gray-600 space-y-1 bg-white p-4 rounded-xl border">
                      <p><strong>Account Name:</strong> HAMADAN CRAFT REVIVAL FOUNDATION</p>
                      <p><strong>Bank:</strong> JAMMU AND KASHMIR BANK LTD</p>
                      <p><strong>Branch:</strong> INTERNATIONAL BANKING DIV</p>
                      <p><strong>Account Number:</strong> 0440010100001057</p>
                      <p><strong>IFSC Code:</strong> JAKA0INTDIV</p>
                      <p><strong>MICR Code:</strong> 190051029</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <Input
                          label="UTR / Bank Reference Number *"
                          placeholder="Enter your UTR or bank reference number"
                          value={utrNumberBank}
                          onChange={(e) => setUtrNumberBank(e.target.value)}
                        />
                        {!utrNumberBank && <p className="text-xs text-amber-600 mt-1">⚠ Required — enter the UTR from your bank receipt</p>}
                      </div>
                      <Input
                        label="Originating Bank (Optional)"
                        placeholder="Enter your bank name"
                        value={originatingBank}
                        onChange={(e) => setOriginatingBank(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === "UPI_STATIC_QR" && (
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 text-sm">Scan QR Code or Use UPI ID</h5>
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-xl border">
                      <div className="shrink-0 bg-white p-2 rounded-xl border border-gray-200 shadow-xs">
                        <Image
                          src="/assets/images/donation_scan.png"
                          alt="Hamadan Craft Revival Foundation Official Donation QR Code"
                          width={140}
                          height={140}
                          className="rounded-lg object-contain"
                        />
                      </div>
                      <div className="text-xs text-gray-700 space-y-2 flex-1">
                        <p className="font-bold text-sm text-gray-900 border-b pb-2">Official KHCRF UPI Payment</p>
                        <p><strong>VPA / UPI ID:</strong> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-brand-primary font-bold">hcrf@jkbank</span></p>
                        <p><strong>Payee:</strong> Hamadan Craft Revival Foundation</p>
                        <p><strong>Bank:</strong> JAMMU AND KASHMIR BANK LTD</p>
                        <p><strong>Accepted Apps:</strong> BHIM UPI • Google Pay • PhonePe • Paytm • Any UPI-enabled Banking App</p>
                        <p className="text-gray-500 pt-1">After completing your payment, enter the UPI transaction reference number below to continue with verification.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                      <FaCheck className="text-emerald-600 shrink-0" />
                      <span><strong>Official KHCRF Donation Account:</strong> Payments submitted through UPI are verified before receipts are issued.</span>
                    </div>
                    <div className="pt-2">
                      <Input
                        label="UPI Transaction Reference / UTR Number *"
                        placeholder="Enter your UPI transaction ID"
                        value={utrNumberUpi}
                        onChange={(e) => setUtrNumberUpi(e.target.value)}
                      />
                      {!utrNumberUpi && <p className="text-xs text-amber-600 mt-1">⚠ Required — enter the reference number shown in your UPI app after payment</p>}
                    </div>
                  </div>
                )}

                {(selectedPaymentMethod === "CHEQUE" || selectedPaymentMethod === "DEMAND_DRAFT") && (
                  <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h5 className="font-bold text-gray-900 text-sm">
                      {selectedPaymentMethod === "CHEQUE" ? "Cheque" : "Demand Draft"} Details
                    </h5>
                    <p className="text-xs text-gray-500">
                      Please issue instrument payable to <strong>&quot;Hamadan Craft Revival Foundation&quot;</strong> payable at Srinagar.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label={`${selectedPaymentMethod === "CHEQUE" ? "Cheque" : "DD"} Number *`}
                          placeholder={
                            selectedPaymentMethod === "CHEQUE"
                              ? "Enter your cheque number"
                              : "Enter your demand draft number"
                          }
                          value={instrumentNumber}
                          onChange={(e) => setInstrumentNumber(e.target.value)}
                        />
                        {!instrumentNumber && <p className="text-xs text-amber-600 mt-1">⚠ Required</p>}
                      </div>
                      <div>
                        <Input
                          label="Issuing Bank *"
                          placeholder="Enter the issuing bank name"
                          value={issuingBank}
                          onChange={(e) => setIssuingBank(e.target.value)}
                        />
                        {!issuingBank && <p className="text-xs text-amber-600 mt-1">⚠ Required</p>}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs">
                      📮 After submitting, please courier/hand-deliver the instrument to KHCRF office, Srinagar, referencing your submission ID.
                    </div>
                  </div>
                )}
              </div>

              {paymentErrorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-3 animate-fade-in" role="alert">
                  <div className="shrink-0 font-bold">⚠️</div>
                  <div className="flex-1">
                    <p className="font-bold text-red-800">Payment Error</p>
                    <p>{paymentErrorMessage}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-end">
                {selectedPaymentMethod === "RAZORPAY" ? (
                  <RazorpayCheckout
                    amount={parseFloat(finalAmount || "0")}
                    currency="INR"
                    name="Hamadan Craft Revival Foundation - Kashmir Donation"
                    description={`Donation for ${formValues.pool}`}
                    prefill={{
                      name: `${formValues.firstName} ${formValues.lastName}`,
                      email: formValues.email,
                      contact: formValues.phone,
                    }}
                    createOrderUrl="/donation/intent"
                    createOrderData={{ ...checkoutData, paymentMethod: "RAZORPAY" }}
                    onInitiate={() => setPaymentErrorMessage(null)}
                    onSuccess={(data: Record<string, unknown>) => {
                      console.log("Payment Success:", data);
                      if (typeof data?.donationIntentId === "string") {
                        setDonationIntentId(data.donationIntentId);
                      }
                      setPaymentErrorMessage(null);
                      onSubmit(formValues, data);
                    }}
                    onFailure={(error: unknown) => {
                      const msg = getPaymentErrorMessage(error);
                      setPaymentErrorMessage(msg);
                    }}
                    renderButton={(
                      triggerPayment: () => void,
                      isLoading: boolean,
                    ) => (
                      <button
                        type="button"
                        onClick={() => triggerPayment()}
                        disabled={isSubmitting || isLoading}
                        className="w-full md:w-auto px-12 py-5 bg-linear-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting || isLoading ? (
                          <>Processing Payment...</>
                        ) : (
                          <>
                            Complete Donation <FaArrowRight />
                          </>
                        )}
                      </button>
                    )}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleOfflineSubmit}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-12 py-5 bg-linear-to-r from-brand-primary to-brand-secondary text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>Submitting Details...</>
                    ) : (
                      <>
                        Submit Payment Details <FaArrowRight />
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                  {selectedPaymentMethod === "RAZORPAY" ? (
                    <><FaCreditCard /> Secure Payment powered by Razorpay</>
                  ) : (
                    <><FaCheck /> Verification managed by KHCRF Audit Team</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                  step === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
                }`}
              >
                <FaArrowLeft className="mr-2" /> Previous Step
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Next Step <FaArrowRight className="ml-2" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
