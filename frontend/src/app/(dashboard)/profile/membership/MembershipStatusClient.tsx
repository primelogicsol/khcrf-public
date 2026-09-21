"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaIdCard, FaCheckCircle, FaExclamationCircle, FaCrown } from 'react-icons/fa';
import api from '@/lib/api';

interface Member {
    id: string;
    membershipType: string;
    status: string;
    fullName: string;
    createdAt: string;
}

export default function MembershipStatusClient() {
    const [membership, setMembership] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const { data } = await api.get('/membership/my-membership');
                setMembership(data);
            } catch (error) {
                console.error("Failed to fetch membership:", error);
                // 404 is expected if not found, so just set null
                setMembership(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMembership();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!membership) {
        return (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaIdCard data-ui-icon  className="text-4xl " />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Become a Member</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Join the Hamadan Craft Revival Foundation - Kashmir community to access exclusive benefits, support artisans, and contribute to the heritage of Kashmir.
                </p>
                <Link
                    href="/about/memberships/join"
                    className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all transform hover:-translate-y-1"
                >
                    Apply for Membership Now
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-bl-[100px] pointer-events-none" />

            <div className="p-8 md:p-10 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 bg-brand-dark text-white rounded-2xl flex items-center justify-center text-4xl shadow-lg shrink-0">
                        <FaCrown />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">{membership.membershipType} Member</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${membership.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    membership.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'}`}>
                                {membership.status}
                            </span>
                        </div>

                        <p className="text-gray-500 mb-6">Member since {new Date(membership.createdAt).toLocaleDateString()}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Member Name</p>
                                <p className="font-semibold text-gray-800">{membership.fullName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Membership ID</p>
                                <p className="font-mono text-gray-800">{membership.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>

                        {membership.status === 'PENDING' && (
                            <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                                <FaExclamationCircle className="text-blue-500 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">Application Under Review</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your membership application is currently being reviewed by our team. We will notify you once the status changes.
                                    </p>
                                </div>
                            </div>
                        )}

                        {membership.status === 'APPROVED' && (
                            <div className="mt-8 bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3 items-start">
                                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-green-900 text-sm">Active Membership</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your membership is active. You can now access all member benefits.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
