"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Publications checkout is deprecated; redirect back to the catalog
    router.replace("/publications");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium text-sm">Redirecting to publications...</p>
    </div>
  );
}
