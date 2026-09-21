
import type { Metadata } from "next";
import GovernanceClient from "./GovernanceClient";

export const metadata: Metadata = {
    title: "Handicrafts Governance | KHCRF",
    description: "Governance framework for the Kashmir Handicrafts Industry, establishing oversight, capacity building, quality control, and artisan support.",
};

export default function GovernancePage() {
    return <GovernanceClient />;
}
