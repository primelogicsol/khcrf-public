"use client";


import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { FaMoneyBillWave, FaSpinner, FaCircleCheck, FaCircleXmark, FaClock, FaEye } from "react-icons/fa6";

interface Grant {
    id: string;
    applicantName: string;
    grantTypes: string[]; // or string if parsing isn't auto, but backend sends json
    grantAmount: string;
    status: string;
    createdAt: string;
}

export default function MyGrantsPage() {
    const [grants, setGrants] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGrants = async () => {
            try {
                const res = await api.get('/grant/my-grants');
                setGrants(res.data);
            } catch (err: any) {
                console.error(err);
                setError("Failed to load grant applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchGrants();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FaCircleCheck /> Approved</span>;
            case "REJECTED":
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FaCircleXmark /> Rejected</span>;
            case "UNDER_REVIEW":
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FaClock /> Under Review</span>;
            default:
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><FaClock /> Pending</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><FaSpinner data-ui-icon  className="animate-spin text-3xl " /></div>;

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center ">
                    <FaMoneyBillWave size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Grant Applications</h1>
                    <p className="text-sm text-gray-500">Track the status of your funding requests</p>
                </div>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
            ) : grants.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-600">No grant applications found</h3>
                    <p className="text-gray-500 mb-6">You haven&apos;t applied for any grants yet.</p>
                    <Link href="/business-support/grants/apply" className="px-6 py-2 bg-brand-secondary text-white rounded-lg font-bold hover:bg-brand-dark transition-colors shadow-sm">
                        Apply for a Grant
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Application Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grant Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {grants.map((grant) => (
                                    <tr key={grant.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{grant.applicantName}</p>
                                            <p className="text-xs text-gray-500">ID: {grant.id.substring(0, 8)}...</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(grant.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(grant.grantTypes) && grant.grantTypes.slice(0, 1).map((type, i) => (
                                                    <span key={i} className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                                        {type}
                                                    </span>
                                                ))}
                                                {Array.isArray(grant.grantTypes) && grant.grantTypes.length > 1 && (
                                                    <span className="text-xs font-medium text-gray-400">+{grant.grantTypes.length - 1} more</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-700 font-bold">
                                            {grant.grantAmount}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(grant.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/profile/grants/${grant.id}`}
                                                className="flex items-center gap-2 text-sm font-bold text-icon-on-light hover:text-brand-dark transition-colors"
                                            >
                                                <FaEye /> View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
