"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import GrantDetailsView, { GrantApplication } from "@/components/grant/GrantDetailsView";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

export default function GrantDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params?.id as string;

    const [grant, setGrant] = useState<GrantApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchGrant = async () => {
        try {
            const res = await api.get(`/grant/${id}`);
            setGrant(res.data);
        } catch (err: any) {
            console.error(err);
            showToast("Failed to load grant details.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchGrant();
    }, [id]);

    const handleStatusUpdate = async (status: string) => {
        if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
        setUpdating(true);
        try {
            await api.put(`/grant/${id}/status`, { status });
            showToast(`Status updated to ${status}`, "success");
            fetchGrant(); // Refresh data
        } catch (error) {
            console.error("Failed to update status", error);
            showToast("Failed to update status.", "error");
        } finally {
            setUpdating(false);
        }
    };

    const AdminActions = () => (
        <div className="flex gap-2">
            <button
                onClick={() => handleStatusUpdate("APPROVED")}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <FaCheckCircle /> Approve
            </button>
            <button
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={updating}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <FaTimesCircle /> Reject
            </button>
            <button
                onClick={() => handleStatusUpdate("UNDER_REVIEW")}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <FaClock /> Review
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (!grant) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-lg mb-4">Grant application not found.</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <GrantDetailsView
            grant={grant}
            onBack={() => router.back()}
            title="Admin: Grant Review"
            extraHeaderContent={<AdminActions />}
        />
    );
}
