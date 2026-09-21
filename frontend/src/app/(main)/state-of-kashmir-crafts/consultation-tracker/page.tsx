import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';
import { Metadata } from "next";
import ConsultationTrackerClient from "./ConsultationTrackerClient";

export const metadata: Metadata = {
  title: "Consultation Tracker | State of Kashmir Crafts | KHCRF",
  description: "Track stakeholder participation, consultations, district coverage, institutional engagement, evidence collection, and report development for the State of Kashmir Crafts assessment.",
};

export default function ConsultationTrackerPage() {
  return (
    <ConsultationTrackerClient districts={KASHMIR_DISTRICT_NAMES} />
  );
}
