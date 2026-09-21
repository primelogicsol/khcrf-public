import type { Metadata } from "next";
import MagazineIssueReadClient from "./MagazineIssueReadClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  return <MagazineIssueReadClient />;
}
