import React from "react";
import { Metadata } from "next";
import AdvocacyClient from "./AdvocacyClient";

export const metadata: Metadata = {
    title: "Artisan Advocacy | KHCRF",
    description:
        "Explore KHCRF's strategic advocacy initiatives for the Kashmir handicraft sector, covering counterfeit prevention, artisan rights, sustainability, market access, gender equity, and digital transformation.",
};

export default function AdvocacyPage() {
    return <AdvocacyClient />;
}
