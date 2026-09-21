"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaClock, FaUsers, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function JobDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        adminApi.getJobApplication(id)
            .then((res: any) => setJob(res.data?.data ?? res.data))
            .catch((err: any) => setError(err.response?.data?.message || "Unable to load job application."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <FaSpinner data-ui-icon  className="animate-spin  text-3xl" />
        </div>
    );

    if (error || !job) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <FaExclamationCircle className="text-red-400 text-3xl" />
            <p className="text-gray-500 font-medium">{error || "Job record not found."}</p>
            <Link href="/dashboard/hr/jobs" className="text-brand-primary font-bold hover:underline text-sm">← Back to Jobs</Link>
        </div>
    );

    const title = job.title || job.jobTitle || job.position || "—";
    const department = job.department || "—";
    const location = job.location || "—";
    const type = job.type || job.employmentType || "—";
    const status = job.status || "Open";
    const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.postedDate || "—";
    const description = job.description || "No description available.";
    const requirements = job.requirements || "";
    const applicants = job.applicants || job._count?.applications || 0;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/hr/jobs" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaArrowLeft className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><FaBriefcase /> {department}</span>
                            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {location}</span>
                            <span className="flex items-center gap-1"><FaClock /> {type}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${status === 'Open' || status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {status}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Description</h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</div>

                        {requirements && (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 mt-8">Requirements</h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{requirements}</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column: Stats & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-brand-primary/5 rounded-2xl border border-brand-primary/10 p-6">
                        <h3 className="text-lg font-bold text-icon-on-light mb-4 flex items-center gap-2">
                            <FaUsers /> Applicants
                        </h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-black text-gray-800">{applicants}</span>
                            <span className="text-gray-500 font-medium">candidates applied</span>
                        </div>
                        <Link
                            href="/dashboard/hr/applications"
                            className="block w-full mt-6 py-3 bg-brand-primary text-white text-center rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl"
                        >
                            View Applications
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h4 className="font-bold text-gray-800 mb-2">Job Metadata</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Posted On</span>
                                <span className="font-medium text-gray-900">{postedDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Job ID</span>
                                <span className="font-medium text-gray-900">#{id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
