
import type { Metadata } from "next";
import PolicyClient from "./PolicyClient";

export const metadata: Metadata = {
    title: "Kashmir Craft Policy Insights | KHCRF",
    description: "In-depth analysis of the policy landscape shaping the Kashmiri handicraft sector, including artisan welfare, GI certification, and export promotion.",
};

export default function PolicyInsightsPage() {
    return <PolicyClient />;
}
