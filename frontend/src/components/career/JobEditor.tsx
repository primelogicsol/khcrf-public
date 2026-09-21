import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../common/Input";
import Select from "../common/Select";
import dynamic from "next/dynamic";
import { careerApi } from "@/lib/api";
import { FaSpinner, FaSave } from "react-icons/fa";

const RichTextEditor = dynamic(() => import("../common/RichTextEditor"), {
  ssr: false,
});

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  salaryRange: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED", "DRAFT"]),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.string().min(1, "Responsibilities are required"), // We'll parse this to array on submit
  requirements: z.string().min(1, "Requirements are required"), // We'll parse this to array on submit
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobEditorProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function JobEditor({
  initialData,
  onSuccess,
  onCancel,
}: JobEditorProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: "OPEN",
      ...initialData,
      responsibilities: initialData?.responsibilities
        ? initialData.responsibilities.join("\n")
        : "",
      requirements: initialData?.requirements
        ? initialData.requirements.join("\n")
        : "",
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      const formattedData = {
        ...data,
        responsibilities: data.responsibilities
          .split("\n")
          .filter((line) => line.trim()),
        requirements: data.requirements
          .split("\n")
          .filter((line) => line.trim()),
        slug: data.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
        jobCode: `JOB-${Date.now()}`, // Simple generation, backend can handle unique constraint or better logic
      };

      if (initialData?.id) {
        await careerApi.updateJob(initialData.id, formattedData);
      } else {
        await careerApi.createJob(formattedData);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Job Title"
          {...register("title")}
          error={errors.title?.message}
          placeholder="e.g. Senior Frontend Engineer"
        />
        <Input
          label="Department"
          {...register("department")}
          error={errors.department?.message}
          placeholder="e.g. Engineering"
        />
        <Input
          label="Location"
          {...register("location")}
          error={errors.location?.message}
          placeholder="e.g. Remote, Srinagar"
        />
        <Input
          label="Employment Type"
          {...register("type")}
          error={errors.type?.message}
          placeholder="e.g. Full-time, Contract"
        />
        <Input
          label="Salary Range"
          {...register("salaryRange")}
          error={errors.salaryRange?.message}
          placeholder="e.g. $80k - $100k"
        />
        <Select
          label="Status"
          options={[
            { value: "OPEN", label: "Open" },
            { value: "CLOSED", label: "Closed" },
            { value: "DRAFT", label: "Draft" },
          ]}
          {...register("status")}
          error={errors.status?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Job description..."
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsibilities (One per line)
          </label>
          <textarea
            {...register("responsibilities")}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary h-32 p-2 border"
            placeholder="- Development\n- Testing\n..."
          />
          {errors.responsibilities && (
            <p className="text-red-500 text-xs mt-1">
              {errors.responsibilities.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements (One per line)
          </label>
          <textarea
            {...register("requirements")}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary h-32 p-2 border"
            placeholder="- 3+ years React\n- TypeScript..."
          />
          {errors.requirements && (
            <p className="text-red-500 text-xs mt-1">
              {errors.requirements.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
          Save Job
        </button>
      </div>
    </form>
  );
}
