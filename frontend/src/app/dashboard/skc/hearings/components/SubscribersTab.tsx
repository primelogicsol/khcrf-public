"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaPauseCircle, FaEnvelopeOpenText } from "react-icons/fa";

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/backend/skc/admin/hearings/subscribers");
      setSubscribers(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change this subscriber's status to ${newStatus}?`)) return;
    try {
      await api.put(`/api/backend/skc/admin/hearings/subscribers/${id}/status`, { status: newStatus });
      fetchSubscribers();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle/> Active</span>;
      case "PENDING_VERIFICATION": return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1"><FaEnvelopeOpenText/> Pending</span>;
      case "PAUSED": return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold flex items-center gap-1"><FaPauseCircle/> Paused</span>;
      case "UNSUBSCRIBED": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle/> Unsubscribed</span>;
      case "SUPPRESSED": return <span className="px-2 py-1 bg-red-900 text-white rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle/> Suppressed</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            <FaFilter /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error}</div>
      ) : subscribers.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
          <p className="text-gray-500">Wait for public users to subscribe to hearing notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscriber Details</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Interests</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((sub: any) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{sub.fullName}</div>
                    <div className="text-sm text-gray-500">{sub.email}</div>
                    {sub.stakeholderCategory && (
                      <div className="text-xs text-gray-400 mt-1">{sub.stakeholderCategory}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-600">
                      <strong>Districts:</strong> {sub.districtsOfInterest?.join(", ") || "None"} <br/>
                      <strong>Crafts:</strong> {sub.craftsOfInterest?.join(", ") || "None"} <br/>
                      <strong>Topics:</strong> {sub.topicsOfInterest?.join(", ") || "None"}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    <div><strong>Joined:</strong> {new Date(sub.createdAt).toLocaleDateString()}</div>
                    {sub.verifiedAt && <div><strong>Verified:</strong> {new Date(sub.verifiedAt).toLocaleDateString()}</div>}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(sub.status)}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {sub.status === "ACTIVE" ? (
                      <button 
                        onClick={() => updateStatus(sub.id, "PAUSED")}
                        className="px-3 py-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md text-xs font-bold"
                      >
                        Pause
                      </button>
                    ) : sub.status === "PAUSED" ? (
                      <button 
                        onClick={() => updateStatus(sub.id, "ACTIVE")}
                        className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-xs font-bold"
                      >
                        Activate
                      </button>
                    ) : null}
                    
                    {sub.status !== "SUPPRESSED" && (
                      <button 
                        onClick={() => updateStatus(sub.id, "SUPPRESSED")}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-xs font-bold"
                      >
                        Suppress
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
