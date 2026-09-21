"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import BookCreationForm from "@/components/common/BookCreationForm";
import { FaSpinner } from "react-icons/fa";

/**
 * @deprecated This creation form route has been replaced by the PublicationForm inside Publications Hub.
 * Redirecting immediately to /dashboard/business/publications/add
 */
export default function UserBookCreationPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/business/publications/add");
    }, [router]);

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><FaSpinner data-ui-icon  className="animate-spin text-3xl " /></div>}>
            <BookCreationForm isAdmin={false} redirectUrl="/profile/publications" />
        </Suspense>
    );
}
