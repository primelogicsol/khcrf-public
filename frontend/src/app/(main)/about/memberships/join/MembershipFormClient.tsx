"use client";
"use strict";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaCreditCard,
  FaCheck,
  FaArrowRight,
  FaArrowLeft,
  FaTools,
  FaUserGraduate,
  FaBriefcase,
  FaBuilding,
  FaCrown,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";
import api from "@/lib/api";
import RazorpayCheckout from "@/components/payment/RazorpayCheckout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validation Schema
const membershipSchema = z.object({
  // Step 1: Personal Profile
  fullName: z.string().min(2, "Full name is required"),
  preferredName: z.string().optional(),
  professionalTitle: z.string().optional(),
  professionalCategory: z.string().min(1, "Professional category is required"),
  organization: z.string().optional(),
  personalCountry: z.string().min(2, "Country is required"),
  ageGroup: z.string().optional(),
  gender: z.string().optional(),
  profilePhoto: z.any().optional(),
  shortBiography: z.string().max(300, "Maximum 300 characters").min(10, "Biography is required"),

  // Step 2: Contact & Communication
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  contactCountry: z.string().min(2, "Country is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  streetAddress: z.string().optional(),
  preferredCommunication: z.array(z.string()).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  linkedinProfile: z.string().optional(),
  website: z.string().optional(),
  timezone: z.string().optional(),

  // Step 3: Membership & Interests
  membershipType: z.string().min(1, "Please select a membership plan"),
  joiningReasons: z.array(z.string()).optional(),
  interestCrafts: z.array(z.string()).optional(),
  interestThemes: z.array(z.string()).optional(),
  participationInterests: z.array(z.string()).optional(),
  
  // Smart Conditional Fields
  // Artisan
  craftPracticed: z.string().optional(),
  yearsOfPractice: z.string().optional(),
  workshopLocation: z.string().optional(),
  giRegistered: z.string().optional(),
  craftCluster: z.string().optional(),
  // Student
  institution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.string().optional(),
  internshipInterest: z.string().optional(),
  researchInterest: z.string().optional(),
  // Professional
  areaOfExpertise: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  professionalAffiliations: z.string().optional(),
  advisoryInterest: z.string().optional(),
  // Corporate
  corporateName: z.string().optional(),
  csrFocusAreas: z.string().optional(),
  partnershipInterest: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  industrySector: z.string().optional(),
  // Patron
  areasOfSupport: z.string().optional(),
  recognitionPreference: z.string().optional(),
  strategicInterestAreas: z.string().optional(),

  // Step 4: Review & Membership Contribution
  directoryPreference: z.enum(["Public", "Members Only", "Private"]).optional(),
  commitmentMission: z.boolean().refine(val => val === true, "You must agree"),
  commitmentAccuracy: z.boolean().refine(val => val === true, "You must agree"),
  commitmentTerms: z.boolean().refine(val => val === true, "You must agree"),
  commitmentCommunication: z.boolean().refine(val => val === true, "You must agree"),
  optInDirectory: z.boolean().optional(),
  optInNewsletter: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.membershipType) {
    const mapping: Record<string, string> = {
      "artisan": "Artisan",
      "student": "Student",
      "individual": "Individual / Supporter",
      "professional": "Professional",
      "patron": "Patron / Supporter",
      "corporate": "Corporate"
    };
    if (mapping[data.membershipType] && mapping[data.membershipType] !== data.professionalCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["professionalCategory"],
        message: "Professional category must match the selected membership type",
      });
    }
  }
});

type FormData = z.infer<typeof membershipSchema> & {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

const steps = [
  { id: 1, title: "Personal Profile", icon: FaUser },
  { id: 2, title: "Contact Info", icon: FaEnvelope },
  { id: 3, title: "Interests", icon: FaIdCard },
  { id: 4, title: "Review", icon: FaCreditCard },
];

const membershipPlans = [
  { id: "artisan", title: "Artisan", price: "₹0", icon: FaTools, desc: "₹0 / year" },
  { id: "student", title: "Student", price: "₹0", icon: FaUserGraduate, desc: "₹0 / year" },
  { id: "individual", title: "Individual", price: "₹25", icon: FaUser, desc: "₹25 / year" },
  { id: "professional", title: "Professional", price: "₹100", icon: FaBriefcase, desc: "₹100 / year" },
  { id: "patron", title: "Patron", price: "₹1,000", icon: FaCrown, desc: "₹1,000 / year" },
  { id: "corporate", title: "Corporate", price: "₹5,000", icon: FaBuilding, desc: "₹5,000 / year" },
];

const professionalTitles = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof.", "Eng.", "Other"];
const professionalCategories = ["Artisan", "Student", "Individual / Supporter", "Professional", "Patron / Supporter", "Academic", "Researcher", "Designer", "Entrepreneur", "Collector", "NGO Professional", "Government", "Corporate", "Other"];
const ageGroups = ["Under 18", "18–25", "26–40", "41–60", "60+"];
const communicationMethods = ["Email", "Phone", "WhatsApp", "Newsletter"];
const languages = ["English", "Kashmiri", "Urdu", "Hindi", "Other"];
const joiningReasonsList = ["Support Artisan Livelihoods", "Heritage Preservation", "Research Access", "Professional Networking", "Workshops & Events", "Volunteer Opportunities", "Policy Engagement", "International Collaboration", "Cultural Advocacy", "Community Participation"];
const craftAreas = ["Pashmina", "Kani", "Carpets", "Papier-Mâché", "Wood Carving", "Crewel", "Namda", "Copperware", "Silverware"];
const themeAreas = ["Sustainability", "Authentication", "GI Protection", "Documentation", "Market Development", "Export Promotion", "Heritage Conservation", "Museum Studies", "Policy & Advocacy", "Artisan Welfare"];
const participationList = ["Workshops", "Conferences", "Research Projects", "Publications", "Volunteer Programs", "Mentorship", "Community Outreach", "Advisory Groups", "Training Programs"];

export default function MembershipFormClient() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingMembership, setExistingMembership] = useState<any | null>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("returnTo");
    if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
      setReturnTo(raw);
    }
  }, []);

  

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(membershipSchema),
    mode: "onChange",
    defaultValues: {
      preferredCommunication: [],
      languagesSpoken: [],
      joiningReasons: [],
      interestCrafts: [],
      interestThemes: [],
      participationInterests: [],
      directoryPreference: "Members Only",
    }
  });

  const formValues = watch();

  useEffect(() => {
    if (formValues.membershipType) {
      const mapping: Record<string, string> = {
        "artisan": "Artisan",
        "student": "Student",
        "individual": "Individual / Supporter",
        "professional": "Professional",
        "patron": "Patron / Supporter",
        "corporate": "Corporate"
      };
      const autoCategory = mapping[formValues.membershipType];
      if (autoCategory && formValues.professionalCategory !== autoCategory) {
        setValue("professionalCategory", autoCategory, { shouldValidate: true });
      }
    }
  }, [formValues.membershipType, formValues.professionalCategory, setValue]);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const { data } = await api.get("/membership/my-membership");
        if (data) setExistingMembership(data);
      } catch (error) {
        console.error("Failed to check membership:", error);
      } finally {
        setIsLoadingCheck(false);
      }
    };
    if (user) checkMembership();
    else setIsLoadingCheck(false);
  }, [user]);

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["fullName", "professionalCategory", "personalCountry", "shortBiography"]);
    if (step === 2) valid = await trigger(["email", "phone", "contactCountry"]);
    if (step === 3) valid = await trigger(["membershipType"]);

    if (valid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/membership", data);
      if (response.status === 201 || response.status === 200) {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      if (error.response?.status === 401) {
        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`/login?redirect=${currentPath}`);
        return;
      }
      const msg = error.response?.data?.message || "Failed to submit application. Please try again.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const MultiSelect = ({ name, options, label }: { name: any, options: string[], label: string }) => {
    const currentValues: string[] = watch(name) || [];
    const toggleValue = (val: string) => {
      if (currentValues.includes(val)) {
        setValue(name, currentValues.filter((v) => v !== val), { shouldValidate: true });
      } else {
        setValue(name, [...currentValues, val], { shouldValidate: true });
      }
    };
    return (
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">{label}</label>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => toggleValue(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentValues.includes(opt)
                  ? "bg-brand-primary text-white shadow-md border border-brand-primary"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-brand-primary/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading || (!isLoading && !user) || isLoadingCheck) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (existingMembership) {
    const appStatus = existingMembership.applicationStatus;
    const memStatus = existingMembership.membershipStatus;

    if (appStatus === 'APPROVED') {
      // Membership Phase
      if (memStatus === 'ACTIVE') {
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaIdCard className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">MEMBER ACCESS APPROVED</h2>
            <p className="text-green-700 font-bold tracking-widest uppercase mb-8">ACTIVE MEMBER</p>
            <div className="flex justify-center items-center gap-6">
              {returnTo ? <a href={returnTo} className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">Continue to Issue</a> : <Link href="/master-artisans/issues" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">Read Magazine</Link>}
            </div>
          </div>
        );
      } else if (memStatus === 'SUSPENDED') {
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Access</h2>
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">SUSPENDED</span>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Access Temporarily Unavailable</p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href="/contact" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-all">
                Request Review
              </Link>
              <Link href="/contact" className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                Support
              </Link>
            </div>
          </div>
        );
      } else if (memStatus === 'EXPIRED') {
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Expired</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Benefits resume immediately after renewal.</p>
            <Link href="/dashboard/membership" className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
              Renew Membership
            </Link>
          </div>
        );
      } else {
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Access</h2>
            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">{memStatus}</span>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Please contact support regarding your membership status.</p>
          </div>
        );
      }
    } else {
      // Application Phase
      if (appStatus === 'REJECTED') {
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Membership Application Declined</h2>
            <div className="bg-red-50 rounded-xl p-6 mb-8 text-left border border-red-100">
              <div className="mb-2">
                <span className="text-sm font-bold text-red-800 uppercase">Reason</span>
              </div>
              <p className="text-red-700">{existingMembership.rejectionReason || "Incomplete verification documents"}</p>
            </div>
            <button onClick={() => setExistingMembership(null)} className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
              Apply Again
            </button>
          </div>
        );
      } else {
        // UNDER_REVIEW, SUBMITTED
        return (
          <div className="w-full max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaIdCard className="text-4xl text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Already Exists</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You have already submitted a membership application. You cannot submit a new one while the current one is active.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase">Status</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  UNDER REVIEW
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase">Membership Type</span>
                <span className="font-bold text-gray-800">{existingMembership.membershipType}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase">Submitted</span>
                <span className="font-bold text-gray-800">{new Date(existingMembership.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase">Estimated Review</span>
                <span className="font-bold text-gray-800">5–10 Business Days</span>
              </div>
            </div>
            <Link href="/dashboard/membership" className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">
              View Application Status
            </Link>
          </div>
        );
      }
    }
  }

  return (
    <div className={`w-full max-w-5xl mx-auto ${!isSuccess ? "bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100" : ""}`}>
      {!isSuccess && (
        <div className="bg-brand-primary p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Join Hamadan Craft Revival Foundation - Kashmir</h2>
            <p className="text-white/90 font-medium">Become a part of the movement to revive Kashmir's heritage.</p>
          </div>
        </div>
      )}

      {isSuccess ? (
        <SubmissionSuccess
          title="Application Submitted Successfully"
          message="Thank you for joining the Hamadan Craft Revival Foundation - Kashmir."
          referenceNumber={"HCR-MEM-" + Math.floor(Math.random() * 10000)}
          timeline={[
            { label: "Application Submitted", status: "completed" },
            { label: "Payment Verification", status: "current" },
            { label: "Membership Activation", status: "upcoming" },
          ]}
          summary={[
            { label: "Member Name", value: formValues.fullName },
            { label: "Membership Category", value: membershipPlans.find((p) => p.id === formValues.membershipType)?.title || "Standard" },
            { label: "Membership Fee", value: membershipPlans.find((p) => p.id === formValues.membershipType)?.price || "₹0" },
            { label: "Email", value: formValues.email },
            { label: "Review Status", value: "Pending" },
            { label: "Expected Processing Time", value: "2-3 Business Days" },
            { label: "Membership Validity", value: "1 Year" }
          ]}
          primaryAction={{ 
            label: returnTo ? "View Membership Status" : "Go to Dashboard", 
            href: returnTo ? `/dashboard/membership?returnTo=${encodeURIComponent(returnTo)}` : "/profile" 
          }}
          downloadAction={{ label: "Download Application PDF", onClick: () => alert("Downloading PDF... (Mock)") }}
        />
      ) : (
        <div className="p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-12 relative">
            <div className="absolute top-7 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
            <div className="absolute top-7 left-0 h-1 bg-brand-primary/20 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            <div className="relative z-10 flex justify-between">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = step >= s.id;
                const isCompleted = step > s.id;
                return (
                  <div key={s.id} className="flex flex-col items-center group cursor-default">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 transform ${isActive ? "bg-white border-brand-primary text-icon-on-light shadow-lg scale-110" : "bg-white border-gray-200 text-gray-300"}`}>
                      {isCompleted ? <FaCheck className="text-green-500" /> : <Icon className={isActive ? "text-xl" : "text-lg"} />}
                    </div>
                    <span className={`mt-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? "text-editorial-accent translate-y-0 opacity-100" : "text-gray-400 translate-y-1 opacity-70"}`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 min-h-[400px]">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-pulse-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name *" placeholder="Enter your full name" {...register("fullName")} error={errors.fullName?.message} />
                  <Input label="Preferred Name" placeholder="e.g., John" {...register("preferredName")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Professional Title</label>
                    <select {...register("professionalTitle")} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-800">
                      <option value="">Select Title</option>
                      {professionalTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Professional Category *</label>
                    <select 
                      {...register("professionalCategory")} 
                      disabled={!!formValues.membershipType}
                      className={`w-full p-4 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-800 ${!!formValues.membershipType ? "bg-gray-100 opacity-80 cursor-not-allowed" : "bg-gray-50"}`}
                    >
                      <option value="">Select Category</option>
                      {professionalCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {!!formValues.membershipType && (
                      <p className="text-xs text-brand-secondary mt-2 font-medium">This category is linked to your selected membership type.</p>
                    )}
                    {errors.professionalCategory && <p className="text-red-500 text-xs mt-1">{errors.professionalCategory.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Organization / Institution" placeholder="Your organization" {...register("organization")} />
                  <Input label="Country *" placeholder="Country of Residence" {...register("personalCountry")} error={errors.personalCountry?.message} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Age Group</label>
                    <select {...register("ageGroup")} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-800">
                      <option value="">Select Age Group</option>
                      {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender (Optional)</label>
                    <select {...register("gender")} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/50 transition-all text-gray-800">
                      <option value="">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Biography * (max 300 chars)</label>
                  <textarea
                    {...register("shortBiography")}
                    maxLength={300}
                    placeholder="Tell us about yourself and your connection to crafts, heritage, culture, sustainability, research, education, design, or community development."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/50 min-h-[120px] text-gray-800 resize-none transition-all"
                  />
                  {errors.shortBiography && <p className="text-red-500 text-xs mt-1">{errors.shortBiography.message}</p>}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-pulse-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Email Address *" type="email" placeholder="john@example.com" {...register("email")} error={errors.email?.message} />
                  <Input label="Phone Number *" type="tel" placeholder="+91 98765 43210" {...register("phone")} error={errors.phone?.message} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Country *" placeholder="India" {...register("contactCountry")} error={errors.contactCountry?.message} />
                  <Input label="State / Province" placeholder="Jammu & Kashmir" {...register("state")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="City" placeholder="Srinagar" {...register("city")} />
                  <Input label="Postal Code" placeholder="190001" {...register("postalCode")} />
                </div>
                <Input label="Street Address" placeholder="#123, Example Street" {...register("streetAddress")} />
                
                <MultiSelect name="preferredCommunication" options={communicationMethods} label="Preferred Communication" />
                <MultiSelect name="languagesSpoken" options={languages} label="Languages Spoken" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/..." {...register("linkedinProfile")} />
                  <Input label="Website" placeholder="https://..." {...register("website")} />
                </div>
                <Input label="Timezone" placeholder="e.g. IST (UTC+5:30)" {...register("timezone")} />
                
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3 mt-6">
                  <div className="mt-0.5 text-blue-500">ℹ️</div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-blue-800 block mb-1">Privacy Message</span>
                    Your information is used solely for membership administration, communication, participation opportunities, and member services.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-8 animate-pulse-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Membership Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {membershipPlans.map((plan) => {
                      const PlanIcon = plan.icon;
                      const isSelected = formValues.membershipType === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setValue("membershipType", plan.id, { shouldValidate: true })}
                          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group ${
                            isSelected ? "border-brand-primary bg-brand-primary/5 shadow-brand-primary/10" : "border-gray-100 hover:border-brand-primary/50 bg-white"
                          }`}
                        >
                          <div className={`p-3 rounded-xl w-fit mb-4 transition-colors ${isSelected ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"}`}>
                            <PlanIcon className="text-xl" />
                          </div>
                          <h3 className={`text-lg font-bold mb-1 ${isSelected ? "text-brand-dark" : "text-gray-800"}`}>{plan.title}</h3>
                          <div className="text-xl font-black text-brand-primary mb-1">{plan.price}</div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">/ Year</p>
                          <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? "border-brand-primary bg-brand-primary text-white scale-100" : "border-gray-200 text-transparent scale-90"
                          }`}>
                            <FaCheck className="text-xs" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.membershipType && <div className="p-4 mt-4 bg-red-50 text-red-600 rounded-xl flex items-center font-medium animate-bounce">Please select a membership plan to continue.</div>}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <MultiSelect name="joiningReasons" options={joiningReasonsList} label="Why Are You Joining KHCRF?" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MultiSelect name="interestCrafts" options={craftAreas} label="Areas of Interest (Crafts)" />
                    <MultiSelect name="interestThemes" options={themeAreas} label="Areas of Interest (Themes)" />
                  </div>
                  <MultiSelect name="participationInterests" options={participationList} label="Participation Interests" />
                </div>

                {/* Smart Conditional Fields */}
                {formValues.membershipType === "artisan" && (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900">Artisan Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Craft Practiced" placeholder="e.g. Pashmina weaving" {...register("craftPracticed")} />
                      <Input label="Years of Practice" placeholder="e.g. 15" {...register("yearsOfPractice")} />
                      <Input label="Workshop Location" placeholder="e.g. Srinagar" {...register("workshopLocation")} />
                      <Input label="GI Registered?" placeholder="Yes / No" {...register("giRegistered")} />
                      <Input label="Craft Cluster" placeholder="Name of cluster" {...register("craftCluster")} />
                    </div>
                  </div>
                )}
                {formValues.membershipType === "student" && (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900">Student Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Institution" placeholder="e.g. University of Kashmir" {...register("institution")} />
                      <Input label="Field of Study" placeholder="e.g. Design" {...register("fieldOfStudy")} />
                      <Input label="Graduation Year" placeholder="e.g. 2025" {...register("graduationYear")} />
                      <Input label="Internship Interest" placeholder="e.g. Marketing" {...register("internshipInterest")} />
                      <Input label="Research Interest" placeholder="e.g. Heritage textiles" {...register("researchInterest")} />
                    </div>
                  </div>
                )}
                {formValues.membershipType === "professional" && (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900">Professional Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Area of Expertise" placeholder="e.g. Policy Advocacy" {...register("areaOfExpertise")} />
                      <Input label="Years of Experience" placeholder="e.g. 8" {...register("yearsOfExperience")} />
                      <Input label="Professional Affiliations" placeholder="e.g. ILO, Craft Council" {...register("professionalAffiliations")} />
                      <Input label="Advisory Interest" placeholder="e.g. Mentorship" {...register("advisoryInterest")} />
                    </div>
                  </div>
                )}
                {formValues.membershipType === "corporate" && (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900">Corporate Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Organization Name" placeholder="e.g. Acme Corp" {...register("corporateName")} />
                      <Input label="CSR Focus Areas" placeholder="e.g. Artisan welfare" {...register("csrFocusAreas")} />
                      <Input label="Industry Sector" placeholder="e.g. Retail" {...register("industrySector")} />
                      <Input label="Number of Employees" placeholder="e.g. 500+" {...register("numberOfEmployees")} />
                      <Input label="Partnership Interest" placeholder="e.g. Sponsoring events" {...register("partnershipInterest")} />
                    </div>
                  </div>
                )}
                {formValues.membershipType === "patron" && (
                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <h4 className="text-lg font-bold text-gray-900">Patron Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Areas of Support" placeholder="e.g. Exhibitions" {...register("areasOfSupport")} />
                      <Input label="Strategic Interest Areas" placeholder="e.g. Market Expansion" {...register("strategicInterestAreas")} />
                      <Input label="Recognition Preference" placeholder="e.g. Public, Anonymous" {...register("recognitionPreference")} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-8 animate-pulse-fade-in">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Review & Submit</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 relative z-10 mb-8">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Applicant Summary</p>
                      <p className="text-lg font-bold text-gray-800">{formValues.fullName}</p>
                      <p className="text-gray-600">{formValues.email}</p>
                      <p className="text-gray-600">{formValues.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Membership Plan</p>
                      <div className="flex items-center gap-3">
                        <div data-ui-icon className="p-2 rounded-lg bg-brand-primary/10 "><FaCrown /></div>
                        <div>
                          <p className="text-lg font-bold text-brand-primary capitalize">{membershipPlans.find(p => p.id === formValues.membershipType)?.title} Membership</p>
                          <p className="text-gray-900 font-bold">{membershipPlans.find(p => p.id === formValues.membershipType)?.price} / Year</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 relative z-10">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Directory Preference</h4>
                    <div className="flex gap-4">
                      {["Public", "Members Only", "Private"].map((pref) => (
                        <label key={pref} className={`px-4 py-2 border rounded-full cursor-pointer text-sm font-medium transition-all ${
                          formValues.directoryPreference === pref ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}>
                          <input type="radio" value={pref} {...register("directoryPreference")} className="hidden" />
                          {pref}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 mt-6 relative z-10">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Member Commitment</h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" {...register("commitmentMission")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700">I support the mission of KHCRF. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" {...register("commitmentAccuracy")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700">I confirm the information provided is accurate. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" {...register("commitmentTerms")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700">I agree to KHCRF membership terms. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" {...register("commitmentCommunication")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700">I consent to membership-related communication. <span className="text-red-500">*</span></span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer mt-4">
                        <input type="checkbox" {...register("optInDirectory")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700 font-medium">I would like to be listed in the member directory. (Optional)</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" {...register("optInNewsletter")} className="mt-1 w-4 h-4 text-brand-primary" />
                        <span className="text-sm text-gray-700 font-medium">I would like to receive newsletters and updates. (Optional)</span>
                      </label>
                      {(errors.commitmentMission || errors.commitmentAccuracy || errors.commitmentTerms || errors.commitmentCommunication) && (
                        <p className="text-xs text-red-500 mt-2">Please agree to all required commitments.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-gray-100 pt-8 mt-8">
                  <div className="text-left w-full md:w-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Validity: 1 Year</p>
                    <p className="text-sm text-gray-600">Secure Payment Gateway via Razorpay</p>
                  </div>

                  {parseInt(membershipPlans.find(p => p.id === formValues.membershipType)?.price.replace(/[^0-9]/g, "") || "0") === 0 ? (
                    <button type="button" onClick={() => onSubmit(formValues)} className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:bg-brand-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                      Submit Membership Application
                    </button>
                  ) : (
                    <RazorpayCheckout
                      amount={parseInt(membershipPlans.find(p => p.id === formValues.membershipType)?.price.replace(/[^0-9]/g, "") || "0")}
                      name={`KHCRF - ${membershipPlans.find(p => p.id === formValues.membershipType)?.title} Membership`}
                      description={`Membership Fee for 1 Year`}
                      prefill={{ name: formValues.fullName, email: formValues.email, contact: formValues.phone }}
                      notes={{ type: "MEMBERSHIP", membershipType: formValues.membershipType }}
                      className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:bg-brand-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                      buttonText="Proceed to Membership Contribution"
                      onSuccess={(paymentData) => {
                        onSubmit({ ...formValues, razorpayOrderId: paymentData.orderId, razorpayPaymentId: paymentData.paymentId });
                      }}
                      onFailure={(error) => {
                        console.error("Payment Failed", error);
                        alert("Payment failed. Please try again.");
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            {step < 4 && (
              <div className="flex justify-between pt-8 border-t border-gray-100">
                <button type="button" onClick={prevStep} disabled={step === 1} className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:text-brand-primary"}`}>
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <button type="button" onClick={nextStep} className="flex items-center px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark hover:shadow-xl transition-all transform hover:-translate-y-1">
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}


