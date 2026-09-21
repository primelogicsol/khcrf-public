import { Metadata } from "next";
import ApprenticeshipFormClient from "./ApprenticeshipFormClient";

export const metadata: Metadata = {
    title: "Apply for KHCRF Apprenticeship | Hamadan Craft Revival Foundation - Kashmir",
    description: "Join the KHCRF Apprenticeship Program to preserve Kashmir's craft heritage.",
};

export default function ApprenticeshipApplicationPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 md:py-24 px-4">
            <ApprenticeshipFormClient />
        </main>
    );
}
