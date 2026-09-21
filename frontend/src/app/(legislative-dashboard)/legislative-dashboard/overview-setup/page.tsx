import { redirect } from "next/navigation";

export default function OverviewSetupPage() {
  // The Overview Setup is a tab inside the Legislative Profile edit modal.
  // We redirect users to the main dashboard so they can access the modal directly.
  redirect("/legislative-dashboard?tab=overview");
}
