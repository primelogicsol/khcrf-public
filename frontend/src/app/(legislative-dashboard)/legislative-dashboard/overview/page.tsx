"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import OverviewTab from "@/app/(main)/legislative-office/[slug]/components/OverviewTab";
import { FaLandmark } from "react-icons/fa";

export default function OverviewPage() {
  const [office, setOffice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOffice();
  }, []);

  const fetchOffice = async () => {
    try {
      const { data } = await api.get("/legislative/my-office");
      setOffice(data);
    } catch (error) {
      console.error("Fetch office error", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading overview data...
      </div>
    );
  }

  if (!office) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLandmark className="text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Office Found
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          You must register a legislative office first to view the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Impact Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time Constituency Craft Impact and Economic Indicators based on
            CCSI Registrations.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
        <OverviewTab office={office} overviewData={office.overviewData} />
      </div>
    </div>
  );
}
