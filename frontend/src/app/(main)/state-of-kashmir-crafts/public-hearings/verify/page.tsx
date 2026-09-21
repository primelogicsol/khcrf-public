"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

export default function VerifySubscriptionPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post(`/api/skc/hearings/subscribe/verify/${token}`);
        if (res.data?.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(res.data?.error || "Verification failed. The link may have expired.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.response?.data?.error || "Unable to verify subscription. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-20 px-4">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-xl text-center border border-gray-100">
        {status === "verifying" && (
          <>
            <FaSpinner data-ui-icon  className="text-5xl  animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-black text-brand-dark mb-4">Verifying Subscription...</h1>
            <p className="text-gray-600 font-medium">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-brand-dark mb-4">Subscription Verified!</h1>
            <p className="text-gray-600 font-medium mb-8">
              Your email address has been confirmed. You will now receive notifications when public hearings matching your interests are announced.
            </p>
            <Link 
              href="/state-of-kashmir-crafts/public-hearings"
              className="inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition"
            >
              Return to Public Hearings
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-brand-dark mb-4">Verification Failed</h1>
            <p className="text-gray-600 font-medium mb-8">{errorMsg}</p>
            <Link 
              href="/state-of-kashmir-crafts/public-hearings"
              className="inline-block px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition"
            >
              Return to Public Hearings
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
