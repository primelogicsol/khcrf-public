"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import GrantDetailsView, { GrantApplication } from "@/components/grant/GrantDetailsView";


export default function GrantPreviewClient({ id }: { id: string }) {
    const router = useRouter();
    const [grant, setGrant] = useState<GrantApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGrant = async () => {
            try {
                const res = await api.get(`/grant/my-grants`);
                const foundGrant = res.data?.find((g: any) => g.id === id);
                if (foundGrant) {
                    setGrant(foundGrant);
                } else {
                    setError("Grant application not found.");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load grant details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchGrant();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (error || !grant) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 text-lg mb-4">{error || "Grant application not found."}</p>
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
        />
    );
}
