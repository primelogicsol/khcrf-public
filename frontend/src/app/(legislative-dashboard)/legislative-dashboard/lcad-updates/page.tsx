"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  FaSave,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaBullhorn,
  FaHandshake,
  FaTrash,
  FaPlus,
  FaLandmark,
} from "react-icons/fa";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function LCADUpdatesSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  interface LcadConfig {
    meetings: { title: string; type: string; date: string }[];
    policies: { title: string; type: string; date: string }[];
    notices: { title: string; type: string; date: string }[];
    clusterVisits: { location: string; detail: string; date: string }[];
  }

  const { register, handleSubmit, setValue, watch, reset } = useForm<{
    lcadUpdatesConfig: LcadConfig;
  }>({
    defaultValues: {
      lcadUpdatesConfig: {
        meetings: [],
        policies: [],
        notices: [],
        clusterVisits: [],
      },
    },
  });

  const config = watch("lcadUpdatesConfig") || {
    meetings: [],
    policies: [],
    notices: [],
    clusterVisits: [],
  };

  useEffect(() => {
    const fetchOffice = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const office = await userApi.getMyLegislativeOffice();
        if (office && office.lcadUpdatesConfig) {
          reset({ lcadUpdatesConfig: office.lcadUpdatesConfig });
        }
      } catch (err: any) {
        console.error("Error fetching office:", err);
        setError(err.message || "Failed to load LCAD configurations.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffice();
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage("");
      await userApi.updateMyLegislativeOffice({
        lcadUpdatesConfig: data.lcadUpdatesConfig,
      });
      setSuccessMessage("LCAD Updates configuration saved successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  const addMeeting = () => {
    setValue("lcadUpdatesConfig.meetings", [
      ...(config.meetings || []),
      { title: "", type: "", date: "" } as {
        title: string;
        type: string;
        date: string;
      },
    ]);
  };

  const updateMeeting = (index: number, field: string, value: any) => {
    const current = [...(config.meetings || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("lcadUpdatesConfig.meetings", current);
  };

  const removeMeeting = (index: number) => {
    const current = [...(config.meetings || [])];
    current.splice(index, 1);
    setValue("lcadUpdatesConfig.meetings", current);
  };

  const addPolicy = () => {
    setValue("lcadUpdatesConfig.policies", [
      ...(config.policies || []),
      { title: "", type: "", date: "" } as {
        title: string;
        type: string;
        date: string;
      },
    ]);
  };

  const updatePolicy = (index: number, field: string, value: any) => {
    const current = [...(config.policies || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("lcadUpdatesConfig.policies", current);
  };

  const removePolicy = (index: number) => {
    const current = [...(config.policies || [])];
    current.splice(index, 1);
    setValue("lcadUpdatesConfig.policies", current);
  };

  const addNotice = () => {
    setValue("lcadUpdatesConfig.notices", [
      ...(config.notices || []),
      { title: "", type: "", date: "" } as {
        title: string;
        type: string;
        date: string;
      },
    ]);
  };

  const updateNotice = (index: number, field: string, value: any) => {
    const current = [...(config.notices || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("lcadUpdatesConfig.notices", current);
  };

  const removeNotice = (index: number) => {
    const current = [...(config.notices || [])];
    current.splice(index, 1);
    setValue("lcadUpdatesConfig.notices", current);
  };

  const addVisit = () => {
    setValue("lcadUpdatesConfig.clusterVisits", [
      ...(config.clusterVisits || []),
      { location: "", detail: "", date: "" } as {
        location: string;
        detail: string;
        date: string;
      },
    ]);
  };

  const updateVisit = (index: number, field: string, value: any) => {
    const current = [...(config.clusterVisits || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("lcadUpdatesConfig.clusterVisits", current);
  };

  const removeVisit = (index: number) => {
    const current = [...(config.clusterVisits || [])];
    current.splice(index, 1);
    setValue("lcadUpdatesConfig.clusterVisits", current);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
      <div className="mb-8 p-6 bg-linear-to-r from-brand-primary to-brand-secondary rounded-2xl text-white shadow-xl shadow-brand-primary/20">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            <FaBullhorn className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-playfair">
              LCAD Updates Setup
            </h1>
            <p className="text-brand-light opacity-90 text-sm">
              Manage Meeting Alerts, Policy Statements, Notices, and Cluster
              Visits.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100 flex items-center gap-2">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Meeting Alerts */}
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FaHandshake className="text-blue-600 w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">
                Meeting Alerts
              </h3>
            </div>
            <button
              type="button"
              onClick={addMeeting}
              className="text-sm px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Alert
            </button>
          </div>
          <div className="space-y-3">
            {(config.meetings || []).map(
              (m: { title: string; type: string; date: string }, i: number) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex-1 w-full">
                    <Input
                      label="Meeting Title"
                      value={m.title}
                      onChange={(e) =>
                        updateMeeting(i, "title", e.target.value)
                      }
                      placeholder="e.g. Stakeholder Review"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Input
                      label="Type / Badge"
                      value={m.type}
                      onChange={(e) => updateMeeting(i, "type", e.target.value)}
                      placeholder="e.g. Virtual, Urgent"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={m.date}
                      onChange={(e) => updateMeeting(i, "date", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-gray-300 bg-gray-50/50 focus:border-brand-primary focus:ring-brand-primary transition-colors text-sm font-medium h-[46px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMeeting(i)}
                    className="mb-1 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0 h-[46px] flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ),
            )}
            {(!config.meetings || config.meetings.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                No meeting alerts configured.
              </p>
            )}
          </div>
        </div>

        {/* Policy Statements */}
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FaFileAlt className="text-emerald-600 w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">
                Policy Statements
              </h3>
            </div>
            <button
              type="button"
              onClick={addPolicy}
              className="text-sm px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Policy
            </button>
          </div>
          <div className="space-y-3">
            {(config.policies || []).map(
              (m: { title: string; type: string; date: string }, i: number) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex-1 w-full">
                    <Input
                      label="Policy Title"
                      value={m.title}
                      onChange={(e) => updatePolicy(i, "title", e.target.value)}
                      placeholder="e.g. Craft GI Protection Act"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Input
                      label="Type / Badge"
                      value={m.type}
                      onChange={(e) => updatePolicy(i, "type", e.target.value)}
                      placeholder="e.g. Draft Policy"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={m.date}
                      onChange={(e) => updatePolicy(i, "date", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-gray-300 bg-gray-50/50 focus:border-brand-primary focus:ring-brand-primary transition-colors text-sm font-medium h-[46px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePolicy(i)}
                    className="mb-1 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0 h-[46px] flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ),
            )}
            {(!config.policies || config.policies.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                No policy statements configured.
              </p>
            )}
          </div>
        </div>

        {/* Public Notices */}
        <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FaBullhorn className="text-amber-600 w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">
                Public Notices
              </h3>
            </div>
            <button
              type="button"
              onClick={addNotice}
              className="text-sm px-4 py-2 bg-amber-100 text-amber-800 font-bold rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Notice
            </button>
          </div>
          <div className="space-y-3">
            {(config.notices || []).map(
              (m: { title: string; type: string; date: string }, i: number) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex-1 w-full">
                    <Input
                      label="Notice Title"
                      value={m.title}
                      onChange={(e) => updateNotice(i, "title", e.target.value)}
                      placeholder="e.g. Counterfeit Trader Arrested"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Input
                      label="Type / Badge"
                      value={m.type}
                      onChange={(e) => updateNotice(i, "type", e.target.value)}
                      placeholder="e.g. Enforcement"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={m.date}
                      onChange={(e) => updateNotice(i, "date", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-gray-300 bg-gray-50/50 focus:border-brand-primary focus:ring-brand-primary transition-colors text-sm font-medium h-[46px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNotice(i)}
                    className="mb-1 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0 h-[46px] flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ),
            )}
            {(!config.notices || config.notices.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                No public notices configured.
              </p>
            )}
          </div>
        </div>

        {/* Cluster Visits */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-600 w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">
                Recent Cluster Visits
              </h3>
            </div>
            <button
              type="button"
              onClick={addVisit}
              className="text-sm px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Visit
            </button>
          </div>
          <div className="space-y-3">
            {(config.clusterVisits || []).map(
              (
                v: { location: string; detail: string; date: string },
                i: number,
              ) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-full md:w-1/3">
                    <Input
                      label="Location"
                      value={v.location}
                      onChange={(e) =>
                        updateVisit(i, "location", e.target.value)
                      }
                      placeholder="e.g. Srinagar Artisans Hub"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Input
                      label="Outcome / Detail"
                      value={v.detail}
                      onChange={(e) => updateVisit(i, "detail", e.target.value)}
                      placeholder="e.g. Evaluated working conditions."
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={v.date}
                      onChange={(e) => updateVisit(i, "date", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-gray-300 bg-gray-50/50 focus:border-brand-primary focus:ring-brand-primary transition-colors text-sm font-medium h-[46px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVisit(i)}
                    className="mb-1 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0 h-[46px] flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              ),
            )}
            {(!config.clusterVisits || config.clusterVisits.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">
                No cluster visits configured.
              </p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <FaSave /> Save Configurations
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
