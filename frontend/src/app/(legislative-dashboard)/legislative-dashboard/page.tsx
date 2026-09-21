import { Suspense } from "react";
import LegislativeProfileClient from "./LegislativeProfileClient";

export default function LegislativeProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Loading dashboard...
        </div>
      }
    >
      <LegislativeProfileClient />
    </Suspense>
  );
}
