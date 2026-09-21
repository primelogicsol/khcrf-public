"use client";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaFileAlt,
  FaFileUpload,
  FaSpinner,
  FaUsers,
  FaStore,
  FaCheckCircle,
} from "react-icons/fa";

export default function CCSIDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profilesRes] = await Promise.all([
          api.get("/ccsi/dashboard"),
          api.get("/ccsi/profiles?limit=5"),
        ]);
        setStats(statsRes.data);
        setProfiles(profilesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch CCSI data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            Verified
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            Submitted
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            Reviewing
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner data-ui-icon  className="animate-spin text-3xl " />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-stone-900">
            CCSI Desk
          </h1>
          <p className="text-stone-600 mt-2">
            Constituency Craft & Stakeholder Intake System
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/legislative-dashboard/ccsi/intake"
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            <FaFileAlt /> Add Stakeholder
          </Link>
          <Link
            href="/legislative-dashboard/ccsi/bulk"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <FaFileUpload /> Bulk Upload
          </Link>
        </div>
      </div>

      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase">
              Total Registered
            </h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaUsers />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.registry?.totalRegistered || 0}
          </p>
          <div className="mt-2 text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded">
            Verified: {stats?.registry?.verifiedProfiles || 0}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase">
              Commerce Interested
            </h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <FaStore />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.registry?.commerceInterested || 0}
          </p>
          <div className="mt-2 text-xs text-purple-600 font-bold bg-purple-50 inline-block px-2 py-1 rounded">
            Target: Digital & Export
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase">
              Women-Led Units
            </h3>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <FaChartLine />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.economic?.womenLedUnits || 0}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Key Economic Indicator
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase">
              Eligible for Forward
            </h3>
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <FaCheckCircle />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.commerceFunnel?.eligible || 0}
          </p>
          <div className="mt-2 text-xs text-amber-600 font-bold bg-amber-50 inline-block px-2 py-1 rounded">
            Pending Audit: {stats?.commerceFunnel?.auditCompleted || 0}
          </div>
        </div>
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Craft Composition */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Craft Composition
          </h3>
          <div className="space-y-4 mb-6">
            {stats?.subCraftComposition &&
            stats.subCraftComposition.length > 0 ? (
              stats.subCraftComposition.map((craft: any) => (
                <div key={craft.name}>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{craft.name}</span>
                    <span>{craft.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary"
                      style={{
                        width: `${(craft.count / (stats?.registry?.totalRegistered || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Recent Registrations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 rounded-tl-lg">Name</th>
                  <th className="p-3">Craft</th>
                  <th className="p-3">Village</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {profiles.length > 0 ? (
                  profiles.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-900">
                        <div className="font-bold text-brand-dark text-xs border-b border-gray-100 pb-1 mb-1 font-mono">
                          {p.applicationCode || p.id.slice(0, 8).toUpperCase()}
                        </div>
                        {p.fullName}
                        <div className="text-xs text-gray-500">
                          {p.primaryContact}
                        </div>
                      </td>
                      <td className="p-3">{p.primaryCraft}</td>
                      <td className="p-3">{p.village}</td>
                      <td className="p-3">{getStatusBadge(p.status)}</td>
                      <td className="p-3 text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No profiles found. Start by adding a stakeholder.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/legislative-dashboard/ccsi/list"
              className="text-brand-primary font-bold hover:underline text-sm"
            >
              View All Profiles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
