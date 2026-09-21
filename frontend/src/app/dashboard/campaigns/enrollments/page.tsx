"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaFilter } from "react-icons/fa";

export default function CampaignEnrollmentsPage() {
  const [activeTab, setActiveTab] = useState("supporters");

  const tabs = [
    { id: "supporters", label: "Supporters & Pledges" },
    { id: "volunteers", label: "Volunteers" },
    { id: "schools", label: "Schools" },
    { id: "partners", label: "Partners" },
    { id: "ambassadors", label: "Ambassadors" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 font-playfair mb-2">Campaign Enrollments</h1>
          <p className="text-stone-500">Manage campaign participants, volunteers, schools, and partners.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="flex border-b border-stone-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold hover:bg-stone-200">
              <FaFilter /> Filter
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-bold">Name / Organization</th>
                <th className="p-4 font-bold">Campaign</th>
                <th className="p-4 font-bold">Date Submitted</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-stone-100">
              <tr>
                <td className="p-4">
                  <div className="font-bold text-stone-900">Jane Doe</div>
                  <div className="text-stone-500 text-xs">jane@example.com</div>
                </td>
                <td className="p-4">Cultural Pride & Heritage</td>
                <td className="p-4 text-stone-500">Today, 10:42 AM</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                    Pending Review
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded" title="Approve">
                      <FaCheckCircle size={18} />
                    </button>
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded" title="Reject">
                      <FaTimesCircle size={18} />
                    </button>
                    <button className="text-stone-500 hover:bg-stone-100 px-3 py-1 rounded text-xs font-bold">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-12 text-center text-stone-500 border border-dashed border-stone-200 rounded-lg mt-4">
            <p>Select an entry to review details and approve/reject the application.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
