import { Metadata } from "next";
import GrantFormClient from "./GrantFormClient";

export const metadata: Metadata = {
    title: "Apply for a Grant - KHCRF Business Support",
    description: "Apply for various business support grants offered by KHCRF to empower artisans and preserve Kashmiri craft heritage.",
};

export default function GrantApplicationPage() {
    return (
        <main className="bg-gray-50 min-h-screen py-12 md:py-20 px-4">
            <GrantFormClient />
        </main>
    );
}
