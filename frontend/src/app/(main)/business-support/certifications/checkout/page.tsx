"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import { certifications } from "@/data/certifications";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import RazorpayCheckout from "@/components/payment/RazorpayCheckout";

// Define the payment schema
const paymentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type PaymentFormInputs = z.infer<typeof paymentSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Use router for redirection
  const id = searchParams.get("id");

  // State for certificate data
  const [cert, setCert] = useState<any>(null); // Using any temporarily to match mixed types, or import Certification interface
  const [loadingCert, setLoadingCert] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const { user } = useAuth();

  // Effect to load certificate data
  useEffect(() => {
    const loadCertificate = async () => {
      if (!id) {
        setLoadingCert(false);
        return;
      }

      // 1. Try finding in hardcoded list
      const localCert = certifications.find((c) => c.id === id);
      if (localCert) {
        setCert(localCert);
        setLoadingCert(false);
        return;
      }

      // 2. If not found, try fetching from API
      try {
        const { data } = await api.get(`/certificate-packages/${id}`);
        if (data) {
          // Map API data to Certification interface
          setCert({
            id: data.id,
            type: "General", // Default type
            name: data.name,
            description: data.description,
            initialCost: data.price,
            annualFee: 0,
            requirements: Array.isArray(data.features) ? data.features : [],
            imagePath: "", // No image for API packages yet
            level: data.validity || "Standard",
          });
        }
      } catch (error) {
        console.error("Failed to load certificate package", error);
      } finally {
        setLoadingCert(false);
      }
    };

    loadCertificate();
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentSchema),
  });

  useEffect(() => {
    const checkBusinessProfile = async () => {
      if (!id) return;
      try {
        console.log("Checking business profile for user...");
        const { data: listings } = await api.get("/listing/my-listings");

        if (listings && listings.length > 0) {
          // Profile exists, pre-fill form
          const profile = listings[0];
          const fullName = profile.fullName || "";
          const [first, ...last] = fullName.split(" ");

          setValue("firstName", first || "");
          setValue("lastName", last.join(" ") || "User");
          setValue("email", profile.email || "");
          setValue("phone", profile.phone || "");
          setCheckingProfile(false);
          return;
        }

        // If no listing, check for evaluations
        console.log("No listing found. Checking for evaluations...");
        const { data: evaluations } = await api.get(
          "/evaluation/my-evaluation",
        );

        if (evaluations && evaluations.length > 0) {
          console.log("Evaluation found. Bypassing onboarding.");
          // Evaluation exists, use Auth user details
          if (user) {
            const fullName = user.name || "";
            const [first, ...last] = fullName.split(" ");
            setValue("firstName", first || "");
            setValue("lastName", last.join(" ") || "User");
            setValue("email", user.email || "");
          }
          setCheckingProfile(false);
          return;
        }

        // If neither exists, redirect
        console.log("No profile or evaluation found. Redirecting...");
        const returnUrl = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        router.push(
          `/business-support/certifications/onboarding?returnUrl=${returnUrl}`,
        );
      } catch (err) {
        console.error("Failed to check profile/evaluation:", err);
        const returnUrl = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        router.push(`/login?returnUrl=${returnUrl}`);
      }
    };

    checkBusinessProfile();
  }, [id, router, setValue, user]);

  // Watch values to update Razorpay prefill data dynamically
  const formValues = watch();

  if (!id) {
    return (
      <div className="text-center py-20 text-gray-500">No package selected</div>
    );
  }

  if (loadingCert) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-gray-500 font-medium">
          Loading package details...
        </span>
      </div>
    );
  }

  if (checkingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-gray-500 font-medium">
          Verifying Business Profile...
        </span>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="text-center py-20 text-gray-500">
        Certification package not found
      </div>
    );
  }

  if (isSuccess && cert) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in-up">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FaCheckCircle data-ui-icon  className="text-5xl " />
        </div>
        <h1 className="text-4xl font-black text-brand-dark mb-4">
          Enrollment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          You have successfully enrolled in <strong>{cert.name}</strong>. A
          confirmation email has been sent to you.
        </p>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-brand-dark/5 mb-10 text-left max-w-lg mx-auto">
          <h4 className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4">
            Transaction Details
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-900 font-bold">Plan</span>
              <span>{cert.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900 font-bold">Amount Paid</span>
              <span>₹{cert.initialCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900 font-bold">Reference</span>
              <span className="text-xs font-mono bg-gray-100 py-1 px-2 rounded">
                TRANS-{Date.now()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/business-support/certifications/packages"
            className="bg-brand-dark text-white py-4 px-10 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-primary transition-all shadow-xl shadow-brand-dark/20 hover:shadow-brand-primary/20 hover:-translate-y-0.5"
          >
            Return to Packages
          </Link>
        </div>
      </div>
    );
  }

  // Default Render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
      <div className="mb-8">
        <Link
          href={`/business-support/certifications/packages`}
          className="inline-flex items-center text-gray-500 hover:text-brand-dark transition-colors font-bold uppercase tracking-wider text-xs"
        >
          <FaArrowLeft className="mr-2" /> Back to Packages
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
        {/* Order Summary */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-2xl shadow-brand-dark/5 sticky top-32">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-brand-dark">Summary</h2>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                <FaLock size={10} /> Secure Checkout
              </div>
            </div>

            <div className="flex gap-6 mb-8">
              <div className="w-24 h-24 relative shadow-lg rounded-xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                {/* Use image from path if valid, or fallback */}
                {cert?.imagePath ? (
                  <Image
                    src={`/assets/images/craft_cover/${cert.imagePath}`}
                    alt={cert.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-brand-secondary text-2xl font-bold">
                    {cert?.type.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-dark leading-tight mb-2">
                  {cert?.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {cert?.type} Certification
                </p>
                <div className="inline-block bg-brand-secondary/10 text-brand-secondary text-[10px] font-black uppercase px-2 py-1 rounded">
                  {cert?.level || "Standard"}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Initial Cost</span>
                <span className="font-bold">
                  ₹{cert?.initialCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Annual Fee</span>
                <span className="font-bold">
                  ₹{cert?.annualFee.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black text-brand-dark pt-6 border-t border-gray-100">
              <span>Total Due</span>
              <span className="text-brand-primary">
                ₹{cert?.initialCost.toLocaleString()}
              </span>
            </div>

            <div className="mt-8 bg-brand-dark/5 p-5 rounded-xl flex gap-4">
              <div className="bg-white p-2 rounded-full h-fit shadow-sm text-brand-dark">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark text-sm mb-1">
                  Secure Transaction
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your payment is processed securely via Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-brand-dark/10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none" />

            <div className="mb-10 relative z-10">
              <span data-editorial-accent-text className=" font-black uppercase tracking-widest text-[10px] mb-2 block">
                Final Step
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-brand-dark mb-4">
                Billing Details
              </h2>
              <p className="text-gray-500">
                Enter your contact information to proceed to payment.
              </p>
            </div>

            {/* We use the RazorpayCheckout component but trigger it via form submission */}
            <RazorpayCheckout
              amount={cert.initialCost}
              currency="INR"
              name="Kashmir Handicrafts Certification"
              description={`${cert.type} Certification - ${cert.name}`}
              prefill={{
                name: `${getValues("firstName")} ${getValues("lastName")}`,
                email: getValues("email"),
                contact: getValues("phone"),
              }}
              notes={{
                certType: cert.type,
                certName: cert.name,
                firstName: getValues("firstName"),
                lastName: getValues("lastName"),
                email: getValues("email"),
                phone: getValues("phone"),
              }}
              onSuccess={() => setIsSuccess(true)}
              onFailure={(error) =>
                alert(`Payment Failed: ${error.description || "Unknown error"}`)
              }
              renderButton={(triggerPayment, isLoading) => (
                <form
                  onSubmit={handleSubmit(() => triggerPayment())}
                  className="space-y-6 relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                      className="bg-gray-50 focus:bg-white"
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                      className="bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    className="bg-gray-50 focus:bg-white"
                  />

                  <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    type="tel"
                    {...register("phone")}
                    error={errors.phone?.message}
                    className="bg-gray-50 focus:bg-white"
                  />

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-primary transition-all duration-300 shadow-xl shadow-brand-dark/20 hover:shadow-brand-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-1"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCreditCard /> Proceed to Payment
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      You will be redirected to Razorpay to complete your
                      purchase.
                    </p>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main>
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
              <span className="text-gray-500 font-medium">
                Loading checkout...
              </span>
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </main>
    </div>
  );
}
