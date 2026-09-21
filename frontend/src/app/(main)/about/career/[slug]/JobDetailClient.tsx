"use client";

import React from "react";
import { Job } from "@/types/career";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import ApplicationForm from "@/components/career/ApplicationForm";

export default function JobDetailClient({ job }: { job: Job }) {
  return (
    <main className="bg-gray-50 min-h-screen font-sans text-gray-800 pb-24">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-10 py-6">
          <Link
            href="/about/career"
            className="inline-flex items-center text-gray-500 hover:text-brand-primary font-bold text-sm mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Careers
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-brand-primary font-bold uppercase tracking-wider text-xs bg-brand-primary/5 px-2 py-1 rounded border border-brand-primary/10">
                  {job.department}
                </span>
                <span
                  className={`font-bold uppercase tracking-wider text-xs px-2 py-1 rounded border flex items-center gap-1 ${
                    job.status === "OPEN" || job.status === "Open"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-gray-50 text-gray-600 border-gray-100"
                  }`}
                >
                  <span
                    className={`w-3 h-3 m-1 rounded-full ${job.status === "OPEN" || job.status === "Open" ? "bg-green-500" : "bg-gray-500"}`}
                  ></span>
                  {job.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {job.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8 text-gray-500 font-medium text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" /> {job.type}
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" /> {job.salaryRange}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" /> Posted{" "}
                {new Date(job.postedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                About the Role
              </h2>
              <div
                className="prose prose-lg text-gray-600 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Key Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-600 text-lg"
                    >
                      <FaCheckCircle data-ui-icon  className="mt-1.5  shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Requirements
                </h2>
                <ul className="space-y-4">
                  {job.requirements.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-600 text-lg"
                    >
                      <FaCheckCircle data-ui-icon  className="mt-1.5  shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column: Application Form (Sticky) */}
          <div className="lg:col-span-1">
            <div className="static lg:sticky lg:top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">
                  Apply for this Position
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Please fill out the form below to submit your application.
                </p>
              </div>

              <div className="p-8">
                <ApplicationForm
                  jobId={job.id}
                  jobTitle={job.title}
                  onSuccess={() => window.scrollTo(0, 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
