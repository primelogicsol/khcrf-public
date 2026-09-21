import { Metadata } from "next";
import CurrentAssessmentClient from "./CurrentAssessmentClient";

export const metadata: Metadata = {
  title: "State of Kashmir Crafts Assessment 2026–2027 | KHCRF",
  description:
    "State of Kashmir Crafts Assessment 2026–2027 is a comprehensive public consultation and documentation initiative by Hamadan Craft Revival Foundation to assess Kashmir’s handicraft sector through stakeholder participation, evidence, field consultations, and public reporting.",
};

export default function CurrentAssessment2026Page() {
  return (
    <CurrentAssessmentClient />
  );
}
