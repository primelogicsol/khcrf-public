"use client";

import { useState, useEffect } from "react";
import { FaArrowLeft, FaHandHoldingHeart, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaPrint, FaSpinner, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function DonationDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [donation, setDonation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        adminApi.getDonation(id)
            .then((res: any) => setDonation(res.data?.data ?? res.data))
            .catch((err: any) => setError(err.response?.data?.message || "Unable to load donation record."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <FaSpinner data-ui-icon  className="animate-spin  text-3xl" />
        </div>
    );

    if (error || !donation) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <FaExclamationCircle className="text-red-400 text-3xl" />
            <p className="text-gray-500 font-medium">{error || "Donation record not found."}</p>
            <Link href="/dashboard/donations" className="text-brand-primary font-bold hover:underline text-sm">← Back to Donations</Link>
        </div>
    );

    const donorName = donation.donor?.name || donation.donorName || "—";
    const donorEmail = donation.donor?.email || donation.email || "—";
    const amount = donation.amount ?? 0;
    const currency = donation.currency || "INR";
    const status = donation.status || "—";
    const transactionId = donation.razorpayPaymentId || donation.transactionId || donation.id;
    const createdAt = donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : "—";
    const poolName = donation.donationIntent?.name || donation.pool || "General Fund";
    
    // Additional data mapping
    const allocations = donation.allocations || [];
    const receipts = donation.receipts || [];
    const refunds = donation.refunds || [];
    const metadata = donation.metadata || {};

    const fmtINR = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
    const fmtDate = (d: string) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/donations" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaArrowLeft className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Donation Record</h1>
                        <p className="text-sm text-gray-500">Transaction ID: <span className="font-mono">{transactionId}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${status === 'CAPTURED' || status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {status === 'CAPTURED' || status === 'Success' ? <FaCheckCircle /> : <FaExclamationCircle />} {status}
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-md" onClick={() => window.print()}>
                        <FaPrint /> Print Receipt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Transaction Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Amount Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Donation Amount</p>
                                <div className="text-5xl font-black text-brand-primary">
                                    {currency === "INR" ? "₹" : "$"}{Number(amount).toLocaleString()}
                                </div>
                                <p className="text-gray-600 font-medium mt-2 flex items-center gap-2">
                                    <FaCalendarAlt className="text-gray-400" /> {createdAt}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact / Pool Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaHandHoldingHeart data-ui-icon  className="" /> Impact Allocation
                        </h3>
                        
                        {allocations.length > 0 ? (
                            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                                {allocations.map((a: any) => (
                                    <div key={a.id} className="flex justify-between items-center px-4 py-3 text-sm bg-white hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-700 font-medium">{a.category?.name ?? "Unallocated"}</span>
                                        <span className="font-black text-brand-primary">{fmtINR(a.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                                <p className="text-gray-600 text-sm mb-1">This donation has been allocated to:</p>
                                <p className="text-xl font-bold text-brand-primary">{poolName}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Receipts & Refunds */}
                    {(receipts.length > 0 || refunds.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {receipts.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <FaFileInvoiceDollar className="text-emerald-500" /> Receipts
                                    </h3>
                                    <div className="space-y-3">
                                        {receipts.map((r: any) => (
                                            <div key={r.id} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-black text-emerald-800 font-mono">{r.receiptNumber}</p>
                                                    <p className="text-xs text-emerald-600 mt-1">{fmtDate(r.createdAt)}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">{r.status}</span>
                                                    {r.receiptUrl && <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 bg-white p-1.5 rounded-md shadow-sm"><FaExternalLinkAlt size={11} /></a>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {refunds.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <FaInfoCircle className="text-purple-500" /> Refunds
                                    </h3>
                                    <div className="space-y-3">
                                        {refunds.map((r: any) => (
                                            <div key={r.id} className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-black text-purple-800">{fmtINR(r.amount)}</p>
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">{r.status}</span>
                                                </div>
                                                <p className="text-xs text-purple-600 font-mono">{r.razorpayRefundId}</p>
                                                {r.reason && <p className="text-xs text-gray-500 mt-1.5">Reason: {r.reason}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Donor Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
                            <div data-ui-icon className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center  text-3xl font-bold mb-3">
                                <FaUser />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">{donorName}</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Email Address</p>
                                <div className="flex items-center gap-2 text-gray-800 text-sm font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                    <FaEnvelope className="text-gray-400" /> {donorEmail}
                                </div>
                            </div>
                            {donation.donor?.phone && (
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Phone Number</p>
                                    <div className="flex items-center gap-2 text-gray-800 text-sm font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <FaPhone className="text-gray-400" /> {donation.donor.phone}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Metadata Section */}
                    {Object.keys(metadata).length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <FaInfoCircle className="text-gray-400" /> Raw Metadata
                            </h3>
                            <pre className="p-4 bg-gray-950 text-gray-300 font-mono text-xs rounded-xl overflow-x-auto max-h-60 leading-relaxed shadow-inner">
                                {JSON.stringify(metadata, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
