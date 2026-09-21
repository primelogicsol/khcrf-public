"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FaHandHoldingHeart, FaCalendarAlt, FaRupeeSign, FaTag } from 'react-icons/fa';
import Link from 'next/link';

interface Donation {
    id: string;
    amount: number;
    donationType: string; // Frequency
    pool: string; // Cause
    status: string;
    createdAt: string;
    paymentMethod: string;
}

export default function DonationHistoryClient() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const { data } = await api.get('/donation/my-donations');
            setDonations(data);
        } catch (error) {
            console.error("Failed to fetch donations:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaHandHoldingHeart className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Donations Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    You haven't made any donations yet. Your support helps artisans thrive.
                </p>
                <Link
                    href="/about/donations"
                    className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all"
                >
                    Make a Donation
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaHandHoldingHeart data-ui-icon  className="" /> Donation History
                </h2>
            </div>
            <div className="divide-y divide-gray-100">
                {donations.map((donation) => (
                    <div key={donation.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <FaRupeeSign data-ui-icon  className=" text-lg" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">₹{donation.amount}</h4>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaTag className="text-xs" /> {donation.pool || "General"}
                                </p>
                                <p className="text-xs text-brand-secondary font-medium mt-0.5">
                                    {donation.donationType || "One-time"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    <FaCalendarAlt /> {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${donation.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {donation.status}
                            </span>
                            {/* <button className="text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors">
                                View Receipt
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
