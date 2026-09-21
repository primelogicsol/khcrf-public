"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

export default function HealthPage() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setBackendStatus(res.data))
      .catch((err) =>
        setBackendStatus({ status: "Error", message: err.message }),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-brand-dark">
          System Health
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Frontend</span>
            <span className="text-green-600 font-bold uppercase tracking-tight">
              Running
            </span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Backend</span>
            {loading ? (
              <span className="text-gray-400">Checking...</span>
            ) : (
              <span
                className={`font-bold uppercase tracking-tight ${backendStatus?.status === "OK" ? "text-green-600" : "text-red-600"}`}
              >
                {backendStatus?.status || "Unknown"}
              </span>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Backend Details
            </h3>
            <pre className="text-xs overflow-auto text-brand-dark">
              {JSON.stringify(backendStatus, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
