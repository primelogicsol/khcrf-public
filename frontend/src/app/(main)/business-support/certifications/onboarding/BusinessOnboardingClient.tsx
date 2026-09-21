"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaBuilding } from "react-icons/fa";
import Input from "@/components/common/Input";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  registerType: z.enum(["Artisan", "Business", "Institution"]),
  businessName: z.string().optional(),
  businessEmail: z.string().optional(),
  businessAddress: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BusinessOnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl =
    searchParams.get("returnUrl") || "/business-support/certifications";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      registerType: "Business",
    },
  });

  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${currentPath}`);
    }
  }, [isLoading, user, router]);

  const registerType = watch("registerType");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true);
    try {
      // Transform data to match listingController expectation
      const payload = {
        ...data,
        // Ensure business fields are populated if type is Business
        businessName: data.businessName || data.fullName, // Fallback
        businessEmail: data.businessEmail || data.email,
        businessAddress: data.businessAddress || data.address,
      };

      await api.post("/listing/create", payload);

      // Redirect back to checkout
      router.push(returnUrl);
    } catch (error: any) {
      console.error("Submission failed", error);
      if (error.response?.status === 401) {
        const currentPath = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${currentPath}`);
        return;
      }
      alert("Failed to save details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-roboto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-roboto">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-stone-900 p-8 text-white relative">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FaBuilding data-ui-icon  className="" />
            Business Registration
          </h1>
          <p className="text-stone-400 mt-2">
            Please provide your business details to proceed with the purchase.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 md:p-12 space-y-6"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contact Person Name"
                {...register("fullName")}
                error={errors.fullName?.message}
              />
              <Input
                label="Email Address"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label="Phone Number"
                {...register("phone")}
                error={errors.phone?.message}
              />
              <Input
                label="Address"
                {...register("address")}
                error={errors.address?.message}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2">
              Business Details
            </h3>

            <div className="flex gap-4 mb-4">
              {["Business", "Artisan", "Institution"].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer border rounded-lg p-3 flex items-center gap-2 hover:bg-gray-50 transition-all ${registerType === type ? "border-brand-primary bg-brand-primary/5" : "border-gray-200"}`}
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("registerType" as any)}
                    className="text-brand-primary"
                  />
                  <span className="font-medium text-stone-700">{type}</span>
                </label>
              ))}
            </div>

            {registerType === "Business" && (
              <div className="space-y-4 animate-fadeIn">
                <Input label="Business Name" {...register("businessName")} />
              </div>
            )}
            {/* Simplified for now, can add more fields if needed */}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-all shadow-lg disabled:opacity-70"
          >
            {submitting ? "Saving..." : "Save & Continue to Checkout"}{" "}
            <FaCheck />
          </button>
        </form>
      </div>
    </div>
  );
}
