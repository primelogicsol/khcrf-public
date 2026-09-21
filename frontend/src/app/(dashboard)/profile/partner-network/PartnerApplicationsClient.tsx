"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { FaEye, FaHandshake, FaGlobe, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";

interface PartnerApplication {
    id: string;
    orgName: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    collaborationAreas: string[];
}

export default function PartnerApplicationsClient() {
    const [applications, setApplications] = useState<PartnerApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/partner/my-applications");
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch my applications", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><FaCheckCircle /> Approved</span>;
            case "REJECTED":
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200"><FaClock /> Pending Review</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Partner Applications</h1>
                    <p className="text-gray-500">Track the status of your partnership requests</p>
                </div>
                <Link
                    href="/about/partner-network/join"
                    className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all transform hover:-translate-y-1"
                >
                    <FaHandshake className="mr-2" /> New Application
                </Link>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-3xl mx-auto mb-6">
                        <FaHandshake />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't submitted any partnership applications yet. Join our network to collaborate on impactful projects.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-primary/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{app.orgName}</h3>
                                        <span className="text-xs text-gray-400 font-mono">#{app.id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        Submitted on {format(new Date(app.createdAt), "MMMM d, yyyy")}
                                    </p>
                                </div>
                                <div>
                                    {getStatusBadge(app.status)}
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><FaGlobe /> Areas of Interest</p>
                                <div className="flex flex-wrap gap-2">
                                    {(app.collaborationAreas as string[]).map((area, i) => (
                                        <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 font-medium shadow-sm">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
