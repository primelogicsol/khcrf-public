import { Metadata } from "next";
import ReportsArchiveClient from "./ReportsArchiveClient";

export const metadata: Metadata = {
  title: "Reports Archive & Trends Dashboard | State of Kashmir Crafts | KHCRF",
  description: "Explore annual State of Kashmir Crafts reports, compare trends across years, track recommendations, and analyze changes in Kashmir's handicraft ecosystem.",
};

export default function ReportsArchivePage() {
  return <ReportsArchiveClient />;
}
