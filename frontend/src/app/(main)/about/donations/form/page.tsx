"use client";

import { useState } from "react";
import Link from 'next/link';
import { FaCreditCard, FaUser, FaEnvelope, FaRupeeSign, FaArrowLeft } from "react-icons/fa";
import SubmissionSuccess from "@/components/common/SubmissionSuccess";

const amounts = [500, 1000, 2000, 5000];

export default function DonationFormPage() {
    const [amount, setAmount] = useState<number | string>(1000);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [referenceId, setReferenceId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Integrate with Razorpay/Stripe here
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setReferenceId("DON-" + Date.now().toString().slice(-6));
        setIsSuccess(true);
        setLoading(false);
        window.scrollTo(0, 0);
    };

    if (isSuccess) {
        return (
            <SubmissionSuccess
                title="Donation Initiated"
                message="Thank you for your generous support. Your donation process has been initiated successfully."
                referenceNumber={referenceId}
                timeline={[
                    { label: "Donation Initiated", status: "completed" },
                    { label: "Payment Processing", status: "completed" }, // Mocking completed state
                    { label: "Receipt Generation", status: "upcoming" }
                ]}
                summary={[
                    { label: "Donation Amount", value: `₹${amount}` },
                    { label: "Donor Name", value: formData.name },
                    { label: "Email", value: formData.email }
                ]}
                primaryAction={{
                    label: "Return to Donations",
                    href: "/about/donations"
                }}
            />
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-6">
                    <Link href="/about/donations" className="inline-flex items-center text-gray-500 hover:text-brand-primary font-bold text-sm transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to Donations
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
                    {/* Sidebar */}
                    <div className="bg-brand-dark text-white p-12 lg:col-span-1">
                        <h2 className="text-3xl font-black mb-6">Empower Tradition</h2>
                        <p className="text-gray-400 mb-8 font-medium">Your donation fuels the revival of Kashmir's iconic crafts.</p>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center font-bold">1</div>
                                <span className="font-bold">Choose Amount</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-primary/30 rounded-full flex items-center justify-center font-bold">2</div>
                                <span className="text-gray-400">Details</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-brand-primary/30 rounded-full flex items-center justify-center font-bold">3</div>
                                <span className="text-gray-400">Secure Payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-12 lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase mb-4 tracking-widest">Select Donation Amount</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {amounts.map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmount(amt)}
                                            className={`py-3 px-4 rounded-xl font-bold border-2 transition ${amount === amt ? "border-brand-primary bg-brand-primary/10 text-brand-primary" : "border-gray-100 hover:border-gray-200"}`}
                                        >
                                            ₹{amt}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        placeholder="Other Amount"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition font-bold"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <div className="relative group">
                                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-icon-on-light" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary transition"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-icon-on-light" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary transition"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-primary hover:bg-brand-secondary text-white py-5 rounded-xl font-black uppercase tracking-widest transition shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : <><FaCreditCard /><span>Donate ₹{amount}</span></>}
                            </button>

                            <p className="text-xs text-gray-400 text-center">
                                Secure 256-bit SSL encrypted payment. Total donation amount goes to Hamadan Craft Revival Foundation - Kashmir.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
