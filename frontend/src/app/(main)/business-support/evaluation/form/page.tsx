import type { Metadata } from "next";
import EvaluationFormClient from "./EvaluationFormClient";

export const metadata: Metadata = {
    title: "Performance Evaluation | KHCRF",
    description: "Readiness Assessment for Artisans, Businesses, and Institutions",
};

export default function EvaluationFormPage() {
    return <EvaluationFormClient />;
}
