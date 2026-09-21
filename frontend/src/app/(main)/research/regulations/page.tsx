
import type { Metadata } from "next";
import RegulationsClient from "./RegulationsClient";

export const metadata: Metadata = {
    title: "Kashmir Craft Regulations | KHCRF",
    description: "Regulations governing the Kashmir Handicrafts Industry, including GI Certification, IPR Protection, and Anti-Counterfeiting laws.",
};

export default function RegulationsPage() {
    return <RegulationsClient />;
}
