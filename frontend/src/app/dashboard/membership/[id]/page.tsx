"use client";

import { useState, useEffect } from "react";
import { FaUser, FaIdCard, FaHistory, FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Input from "@/components/common/Input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function MemberDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        adminApi.getMember(id)
            .then((res: any) => setData(res.data?.data ?? res.data))
            .catch((err: any) => setError(err.response?.data?.message || "Unable to load member record."))
            .finally(() => setLoading(false));
    }, [id]);

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2 flex items-center gap-2 mt-8 first:mt-0">
            <Icon className="text-icon-on-light text-sm" /> {title}
        </h3>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <FaSpinner data-ui-icon  className="animate-spin  text-3xl" />
        </div>
    );

    if (error || !data) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <FaExclamationCircle className="text-red-400 text-3xl" />
            <p className="text-gray-500 font-medium">{error || "Member record not found."}</p>
            <Link href="/dashboard/membership" className="text-brand-primary font-bold hover:underline text-sm">← Back to Members</Link>
        </div>
    );

    const name = data.name || data.fullName || "—";
    const email = data.email || "—";
    const phone = data.phone || "—";
    const address = data.address || "—";
    const membershipType = data.membershipType || data.type || "—";
    const status = data.status || "—";
    const joinedAt = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : data.joined || "—";
    const history: any[] = data.history || [];

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/membership" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaArrowLeft className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                        <p className="text-sm text-gray-500">Member ID #{id}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status === 'APPROVED' || status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {status}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                        <div data-ui-icon className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4  text-3xl font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                        <p className="text-brand-secondary font-medium">{membershipType} Member</p>

                        <div className="mt-6 space-y-4 text-left">
                            <div className="flex items-center text-gray-600 text-sm">
                                <FaEnvelope className="mr-3 text-gray-400" /> {email}
                            </div>
                            {phone !== "—" && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <FaPhone className="mr-3 text-gray-400" /> {phone}
                                </div>
                            )}
                            {address !== "—" && (
                                <div className="flex items-center text-gray-600 text-sm">
                                    <FaMapMarkerAlt className="mr-3 text-gray-400" /> {address}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <SectionHeader icon={FaUser} title="Personal Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Full Name" value={name} disabled />
                            <Input label="Join Date" value={joinedAt} disabled />
                        </div>

                        <SectionHeader icon={FaIdCard} title="Membership Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Membership Type" value={membershipType} disabled />
                            <Input label="Status" value={status} disabled />
                        </div>

                        {history.length > 0 && (
                            <>
                                <SectionHeader icon={FaHistory} title="Activity History" />
                                <div className="space-y-4">
                                    {history.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div data-editorial-accent-bg className="w-2 h-2 mt-2 rounded-full  mr-4 shrink-0"></div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{item.action}</p>
                                                <p className="text-xs text-gray-500">{item.detail}</p>
                                            </div>
                                            <span className="ml-auto text-xs font-medium text-gray-400">{item.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
