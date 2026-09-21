"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Reader Content has been renamed to Content Studio.
 * This redirect ensures any bookmarks or old links still work.
 */
export default function ReaderContentRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/business/publications/content-studio");
  }, [router]);
  return null;
}
