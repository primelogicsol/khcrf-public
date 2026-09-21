"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { FaEye, FaUserGraduate, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";

interface ApprenticeshipApplication {
    id: string;
    fullName: string;
    apprenticeTrack: string | string[]; // Adapt based on backend response (it's JSON, likely array)
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
}

export default function ApprenticeshipApplicationsClient() {
    const [applications, setApplications] = useState<ApprenticeshipApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/apprenticeship/my-applications");
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "text-green-600 bg-green-50 border-green-200";
            case "REJECTED": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-yellow-600 bg-yellow-50 border-yellow-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <FaCheckCircle />;
            case "REJECTED": return <FaTimesCircle />;
            default: return <FaHourglassHalf />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Apprenticeship Applications</h1>
                    <p className="text-gray-500">Track the status of your apprenticeship submissions</p>
                </div>
                <Link href="/about/apprenticeship/apply" className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2">
                    <FaUserGraduate /> Apply New
                </Link>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaUserGraduate className="text-3xl text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't submitted any apprenticeship applications yet. Join our program to start your journey.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-gray-900">{app.fullName}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusColor(app.status)}`}>
                                            {getStatusIcon(app.status)} {app.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm flex items-center gap-2">
                                        <FaUserGraduate data-ui-icon  className="" />
                                        Tracks: {Array.isArray(app.apprenticeTrack) ? app.apprenticeTrack.join(", ") : app.apprenticeTrack}
                                    </p>
                                    <p className="text-gray-400 text-xs flex items-center gap-2">
                                        <FaCalendarAlt /> Submitted on {format(new Date(app.createdAt), "MMMM d, yyyy")}
                                    </p>
                                </div>

                                {app.status === "PENDING" && (
                                    <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                                        <p className="text-blue-800 text-sm font-medium">Under Review</p>
                                        <p className="text-blue-600 text-xs mt-1">Our team is currently evaluating your profile.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
