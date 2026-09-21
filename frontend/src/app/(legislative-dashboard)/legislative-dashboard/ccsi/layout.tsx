"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

export default function CCSILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Basic protection: Ensure user is logged in.
    // Ideally check for COLLABORATOR_LOBBYING role or LegislativeOffice association here or in middleware.
    if (!isLoading && !user) {
      router.push("/login?redirect=/legislative-dashboard/ccsi");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50/50 pb-20">{children}</div>;
}
