"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../common/Input";
import { careerApi } from "@/lib/api";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  FaSpinner,
  FaPaperPlane,
  FaCloudUploadAlt,
  FaFilePdf,
} from "react-icons/fa";

const applicationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  linkedinProfile: z.string().url("Invalid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().min(1, "Resume is required"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobId?: string; // Optional: if provided, applies to specific job; otherwise general talent pool
  jobTitle?: string;
  onSuccess?: () => void;
}

export default function ApplicationForm({
  jobId,
  jobTitle,
  onSuccess,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
  });

  const { uploadFile, isUploading, error: uploadError } = useFileUpload();
  const [success, setSuccess] = useState(false);
  const resumeUrl = watch("resumeUrl");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file);
      setValue("resumeUrl", url, { shouldValidate: true });
    } catch (error) {
      console.error("Resume upload failed", error);
    }
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      await careerApi.submitApplication({
        ...data,
        jobId,
      });
      setSuccess(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Application submission failed:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <FaPaperPlane />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Application Received!
        </h3>
        <p className="text-gray-600">
          Thanks for applying to {jobTitle || "our Talent Pool"}. We've received
          your details and will get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          {...register("fullName")}
          error={errors.fullName?.message}
          placeholder="John Doe"
        />
        <Input
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
        <Input
          label="Phone Number"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+1 (123) 456-7890"
        />
        <Input
          label="LinkedIn URL (Optional)"
          {...register("linkedinProfile")}
          error={errors.linkedinProfile?.message}
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <Input
        label="Portfolio URL (Optional)"
        {...register("portfolioUrl")}
        error={errors.portfolioUrl?.message}
        placeholder="https://yourportfolio.com"
      />

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Resume / CV (PDF)
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-colors ${
            errors.resumeUrl
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-brand-primary"
          }`}
        >
          {resumeUrl ? (
            <div className="flex items-center gap-3 text-green-600 font-medium">
              <FaFilePdf className="text-2xl" />
              <span>Resume Uploaded</span>
              <button
                type="button"
                onClick={() => setValue("resumeUrl", "")}
                className="text-xs text-red-500 hover:text-red-700 underline ml-2"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              {isUploading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaSpinner className="animate-spin" /> Uploading...
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-3xl text-gray-400" />
                  <div className="text-center relative">
                    <p className="text-sm font-bold text-gray-700">
                      Click to upload Resume
                    </p>
                    <p className="text-xs text-gray-500">PDF (max 5MB)</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {uploadError && (
          <p className="text-red-500 text-xs mt-2">{uploadError}</p>
        )}
        {errors.resumeUrl && (
          <p className="text-red-500 text-xs mt-2">
            {errors.resumeUrl.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Cover Letter (Optional)
        </label>
        <textarea
          {...register("coverLetter")}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary h-32 p-3 border"
          placeholder="Tell us why you're a great fit..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full py-3 bg-brand-primary text-white rounded-lg font-bold text-lg hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <FaPaperPlane />
        )}
        Submit Application
      </button>
    </form>
  );
}
