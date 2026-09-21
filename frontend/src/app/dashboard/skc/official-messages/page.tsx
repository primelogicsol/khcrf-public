"use client";

import React, { useState } from "react";
import { FaEnvelopeOpenText, FaPlus, FaDownload, FaEye } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";

import OverviewTab from "./components/OverviewTab";
import InvitationsTab from "./components/InvitationsTab";
import SubmissionsTab from "./components/SubmissionsTab";
import ReviewQueueTab from "./components/ReviewQueueTab";
import ScheduledTab from "./components/ScheduledTab";
import PublishedTab from "./components/PublishedTab";
import ArchivedTab from "./components/ArchivedTab";
import SettingsTab from "./components/SettingsTab";
import AccessRequestsTab from "./components/AccessRequestsTab";

const TABS = [
  "Overview", "Invitations", "Access Requests", "Submissions", "Review Queue", 
  "Scheduled", "Published", "Archived", "Settings"
];

export default function OfficialMessagesModule() {
  const [activeTab, setActiveTab] = useState("Overview");

  const handleExport = async () => {
    try {
      const res = await api.get('/api/skc/admin/official-messages/messages');
      if (res.data?.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "skc_official_messages_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to export records.");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Overview": return <OverviewTab setActiveTab={setActiveTab} />;
      case "Invitations": return <InvitationsTab />;
      case "Access Requests": return <AccessRequestsTab />;
      case "Submissions": return <SubmissionsTab />;
      case "Review Queue": return <ReviewQueueTab />;
      case "Scheduled": return <ScheduledTab />;
      case "Published": return <PublishedTab />;
      case "Archived": return <ArchivedTab />;
      case "Settings": return <SettingsTab />;
      default: return <OverviewTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
            <FaEnvelopeOpenText data-ui-icon  className="" /> Official Messages
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            Manage dignitary invitations, institutional submissions, contributor verification, editorial review, publication and archival records for the State of Kashmir Crafts Assessment 2026–2027 Assessment.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/skc/official-messages/create-invitation" className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <FaPlus /> Create Invitation
          </Link>
          <Link href="/dashboard/skc/official-messages/add-manual" className="px-4 py-2 bg-white text-icon-on-light border-2 border-brand-primary/20 text-sm font-bold rounded-xl hover:bg-brand-primary/5 transition-all flex items-center gap-2">
            <FaPlus /> Add Manual
          </Link>
          <button onClick={handleExport} className="px-4 py-2 bg-white text-gray-600 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
            <FaDownload /> Export
          </button>
          <Link href="/state-of-kashmir-crafts/official-messages" target="_blank" className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <FaEye /> Preview Public
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex overflow-x-auto hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab 
                ? "bg-brand-primary/10 text-brand-primary" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {renderTab()}
      </div>
    </div>
  );
}
