import type { Metadata } from "next";
import MagazineIssueDetailClient from "./MagazineIssueDetailClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  return <MagazineIssueDetailClient />;
}
