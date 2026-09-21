"use client";

import React, { useEffect, useState } from "react";
import {
  FaCertificate,
  FaSpinner,
  FaDownload,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "@/lib/api";
import Link from "next/link";

interface Certification {
  id: string;
  name: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  adminCertificateUrl?: string;
}

export default function UserCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get("/payment/my-certifications");
        setCertifications(response.data);
      } catch (error) {
        console.error("Failed to fetch my certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            My Certifications
          </h1>
          <p className="text-gray-500">
            View and manage your acquired certifications.
          </p>
        </div>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FaCertificate className="text-4xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Certifications Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Gain recognition for your craft by obtaining official
            certifications.
          </p>
          <Link
            href="/business-support/certifications"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-brand-primary hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/25"
          >
            Browse Certifications
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${statusColors[cert.status.toLowerCase()] || "bg-gray-100 text-gray-500"}`}
                >
                  <FaCertificate />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {cert.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      Ordered: {new Date(cert.createdAt).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="uppercase tracking-wider text-xs font-bold">
                      {cert.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-400">
                    ID: {cert.id} | Ref: {cert.razorpayPaymentId || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {["SUCCESS", "DELIVERED", "COMPLETED"].includes(
                  cert.status.toUpperCase(),
                ) ? (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-brand-secondary bg-brand-secondary/5 hover:bg-brand-secondary/10 rounded-lg transition-colors font-semibold text-sm">
                      <FaDownload /> Invoice
                    </button>
                    {cert.adminCertificateUrl && (
                      <a
                        href={cert.adminCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-semibold text-sm"
                      >
                        <FaCertificate /> Certificate
                      </a>
                    )}
                  </div>
                ) : ["PENDING", "FAILED"].includes(
                    cert.status.toUpperCase(),
                  ) ? (
                  <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg text-sm font-medium">
                    <FaExclamationCircle /> Payment Pending/Failed
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium">
                    <FaSpinner className="animate-spin" /> In Progress
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
