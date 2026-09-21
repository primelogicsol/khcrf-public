"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCertificate, FaPlus, FaSpinner, FaArrowRight } from "react-icons/fa";
import api from "@/lib/api";

interface AccreditationApplication {
  id: string;
  businessName: string;
  status: string;
  badges: string[];
  createdAt: string;
  adminCertificateUrl?: string;
}

export default function MyAccreditationsPage() {
  const [applications, setApplications] = useState<AccreditationApplication[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/accreditation/my-applications");
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch accreditation applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            My Accreditations
          </h1>
          <p className="text-gray-500">
            Track your business accreditation requests.
          </p>
        </div>
        <Link
          href="/business-support/accreditation/apply"
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-secondary transition-all"
        >
          <FaPlus /> Apply New
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <FaCertificate className="text-4xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Applications Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            You haven't applied for any accreditations yet. Get your business
            certified to unlock more benefits.
          </p>
          <Link
            href="/business-support/accreditation/apply"
            className="inline-flex items-center gap-2 text-icon-on-light font-bold hover:underline"
          >
            Start Application <FaArrowRight />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-6 font-bold">Business Name</th>
                  <th className="p-6 font-bold">Badges</th>
                  <th className="p-6 font-bold">Date</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6 font-bold text-gray-900">
                      {app.businessName}
                    </td>
                    <td className="p-6 text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {app.badges.slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {b}
                          </span>
                        ))}
                        {app.badges.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            +{app.badges.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-gray-600 font-medium">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <Link
                          href={`/profile/accreditations/${app.id}`}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                        >
                          View Details
                        </Link>
                        {app.adminCertificateUrl && (
                          <a
                            href={app.adminCertificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-all shadow-sm flex items-center gap-2"
                            title="Download Certificate"
                          >
                            <FaCertificate /> Download
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
