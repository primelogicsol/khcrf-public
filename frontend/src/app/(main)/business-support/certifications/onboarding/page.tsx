import { Suspense } from "react";
import BusinessOnboardingClient from "./BusinessOnboardingClient";

export default function BusinessOnboardingPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]">Loading...</div>}>
            <BusinessOnboardingClient />
        </Suspense>
    );
}
