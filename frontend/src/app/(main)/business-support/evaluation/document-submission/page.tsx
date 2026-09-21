import type { Metadata } from "next";
import DocumentSubmissionClient from "./DocumentSubmissionClient";

export const metadata: Metadata = {
    title: "Document Submission | KHCRF",
    description: "Submit documents for verification to KHCRF.",
};

export default function DocumentSubmissionPage() {
    return <DocumentSubmissionClient />;
}
