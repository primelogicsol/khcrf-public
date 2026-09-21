"use client";

import { useState } from "react";
import CounterfeitStats from "@/components/lobby/CounterfeitStats";
import CounterfeitList from "@/components/lobby/CounterfeitList";
import ReportCounterfeitForm from "@/components/lobby/ReportCounterfeitForm";
import CounterfeitTips from "@/components/lobby/CounterfeitTips";

const CounterfeitMainContent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div>
      {/* Tabs Row */}
      <div className="flex flex-wrap border-b border-slate-200 mb-8 text-sm font-bold text-slate-600">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-3 mr-2 transition-colors ${
            activeTab === "dashboard"
              ? "text-[#050A1E] border-b-2 border-[#050A1E]"
              : "hover:text-[#050A1E]"
          }`}
        >
          Latest Counterfeit Alerts
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-3 mr-2 transition-colors ${
            activeTab === "report"
              ? "text-[#050A1E] border-b-2 border-[#050A1E]"
              : "hover:text-[#050A1E]"
          }`}
        >
          Report Counterfeit Products
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`px-4 py-3 transition-colors ${
            activeTab === "tips"
              ? "text-[#050A1E] border-b-2 border-[#050A1E]"
              : "hover:text-[#050A1E]"
          }`}
        >
          Tips to Identify Fake Goods
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <CounterfeitStats />
            <CounterfeitList />
          </div>
        )}

        {activeTab === "report" && (
          <div className="animate-in fade-in duration-300">
            <ReportCounterfeitForm />
          </div>
        )}

        {activeTab === "tips" && (
          <div className="animate-in fade-in duration-300">
            <CounterfeitTips />
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterfeitMainContent;
