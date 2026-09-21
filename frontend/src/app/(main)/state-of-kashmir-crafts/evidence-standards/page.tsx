import { Metadata } from "next";
import EvidenceStandardsClient from "./EvidenceStandardsClient";

export const metadata: Metadata = {
  title: "Evidence Standards | State of Kashmir Crafts | KHCRF",
  description: "Official standards and requirements for acceptable evidence submission for the State of Kashmir Crafts assessment.",
};

export default function EvidenceStandardsPage() {
  return <EvidenceStandardsClient />;
}
