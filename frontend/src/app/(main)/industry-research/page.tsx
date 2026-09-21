
import type { Metadata } from "next";
import IndustryResearchClient from "./IndustryResearchClient";

export const metadata: Metadata = {
    title: "Handicrafts Industry Research | KHCRF",
    description: "Comprehensive research on Kashmir's handicraft industry, establishing frameworks for sustainability, economic growth, and artisan welfare.",
};

export default function IndustryResearchPage() {
    return <IndustryResearchClient />;
}
