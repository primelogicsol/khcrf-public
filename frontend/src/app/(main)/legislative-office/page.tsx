import { Metadata } from "next";
import LegislativeDirectoryClient from "./LegislativeDirectoryClient";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Kashmir Legislative Office Updates | KHCRF",
    description: "Verified updates and official notices from elected representatives championing Kashmir's handicraft sector.",
};

export default function LegislativeDirectoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center animate-pulse text-gray-400">Loading directory...</div>}>
            <LegislativeDirectoryClient />
        </Suspense>
    );
}
