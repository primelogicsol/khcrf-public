import { Metadata } from "next";
import AboutAssessmentClient from "./AboutAssessmentClient";

export const metadata: Metadata = {
  title: "About the Assessment | State of Kashmir Crafts | KHCRF",
  description:
    "Learn how State of Kashmir Crafts creates an annual public-interest assessment of Kashmir's handicraft ecosystem through participation, evidence, consultation, validation, and expert review.",
  openGraph: {
    title: "About the Assessment | State of Kashmir Crafts | KHCRF",
    description:
      "Learn how State of Kashmir Crafts creates an annual public-interest assessment of Kashmir's handicraft ecosystem through participation, evidence, consultation, validation, and expert review.",
    type: "website",
    url: "/state-of-kashmir-crafts/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Assessment | State of Kashmir Crafts | KHCRF",
    description:
      "Learn how State of Kashmir Crafts creates an annual public-interest assessment of Kashmir's handicraft ecosystem through participation, evidence, consultation, validation, and expert review.",
  },
  alternates: {
    canonical: "/state-of-kashmir-crafts/about",
  },
};

export default function AboutAssessmentPage() {
  return <AboutAssessmentClient />;
}
