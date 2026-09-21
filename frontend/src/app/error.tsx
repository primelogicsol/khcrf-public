"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry or other APM
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mb-8 max-w-md text-gray-600">
        We've encountered an unexpected error. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
