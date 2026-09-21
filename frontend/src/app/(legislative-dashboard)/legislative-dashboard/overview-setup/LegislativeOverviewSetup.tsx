"use client";

import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";

const PREDEFINED_METRICS = [
  {
    title: "Active Cases",
    icon: "FaShieldAlt",
    color: "from-red-500 to-rose-600",
  },
  {
    title: "Under Investigation",
    icon: "FaTag",
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Compliance Review",
    icon: "FaBalanceScale",
    color: "from-brand-primary to-brand-dark",
  },
  {
    title: "High-Risk Cases",
    icon: "FaFlag",
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "Cases Acknowledged",
    icon: "FaCheckCircle",
    color: "from-brand-primary to-brand-dark",
  },
  {
    title: "Formal Comms",
    icon: "FaFileAlt",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Referred Authorities",
    icon: "FaBullhorn",
    color: "from-red-500 to-rose-600",
  },
  {
    title: "Engagement Sessions",
    icon: "FaUsers",
    color: "from-amber-400 to-orange-500",
  },
];

const PREDEFINED_CRAFTS = [
  { name: "Pashmina", color: "bg-purple-500" },
  { name: "Carpet", color: "bg-red-500" },
  { name: "Wood Carving", color: "bg-amber-500" },
  { name: "Papier Mache", color: "bg-blue-500" },
  { name: "Crewel/Chainstitch", color: "bg-emerald-500" },
  { name: "Walnut Wood", color: "bg-amber-700" },
  { name: "Kani Shawl", color: "bg-rose-500" },
  { name: "Khatamband", color: "bg-stone-500" },
  { name: "Silverware", color: "bg-slate-400" },
  { name: "Copperware", color: "bg-orange-600" },
  { name: "Willow Wicker", color: "bg-yellow-600" },
  { name: "Namda", color: "bg-cyan-600" },
  { name: "Gabba", color: "bg-indigo-500" },
  { name: "Other", color: "bg-gray-500" },
];

const PREDEFINED_INDICATORS = [
  { label: "Women-Led Units" },
  { label: "Export Ready" },
  { label: "Co-operatives" },
  { label: "Est. Employment" },
  { label: "Registered Artisans" },
  { label: "GI Authorized Users" },
  { label: "Annual Turnover (Est)" },
  { label: "Active Clusters" },
];

export default function LegislativeOverviewSetup({
  register,
  watch,
  setValue,
}: any) {
  const config = watch("overviewConfig") || {};

  const updateImpactStat = (statName: string, field: string, value: any) => {
    setValue(`overviewConfig.impactStats.${statName}.${field}`, value, {
      shouldDirty: true,
    });
  };

  const addCraft = () => {
    const current = config.craftComposition || [];
    setValue("overviewConfig.craftComposition", [
      ...current,
      { ...PREDEFINED_CRAFTS[0], count: 0 },
    ]);
  };

  const removeCraft = (index: number) => {
    const current = [...(config.craftComposition || [])];
    current.splice(index, 1);
    setValue("overviewConfig.craftComposition", current);
  };

  const updateCraft = (index: number, field: string, value: any) => {
    const current = [...(config.craftComposition || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("overviewConfig.craftComposition", current);
  };

  const addIndicator = () => {
    const current = config.economicIndicators || [];
    setValue("overviewConfig.economicIndicators", [
      ...current,
      { ...PREDEFINED_INDICATORS[0], value: "" },
    ]);
  };

  const removeIndicator = (index: number) => {
    const current = [...(config.economicIndicators || [])];
    current.splice(index, 1);
    setValue("overviewConfig.economicIndicators", current);
  };

  const updateIndicator = (index: number, field: string, value: any) => {
    const current = [...(config.economicIndicators || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("overviewConfig.economicIndicators", current);
  };

  const addCaseStat = () => {
    const current = config.caseStatus || [];
    setValue("overviewConfig.caseStatus", [
      ...current,
      {
        ...PREDEFINED_METRICS[0],
        value: "",
      },
    ]);
  };

  const removeCaseStat = (index: number) => {
    const current = [...(config.caseStatus || [])];
    current.splice(index, 1);
    setValue("overviewConfig.caseStatus", current);
  };

  const updateCaseStat = (index: number, field: string, value: any) => {
    const current = [...(config.caseStatus || [])];
    current[index] = { ...current[index], [field]: value };
    setValue("overviewConfig.caseStatus", current);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Impact Stats Section */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          4-Metric Impact Overview
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          If 'Auto-Fill' is enabled, values are calculated from verified CCSI
          Profile registrations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: "totalStakeholders", label: "Total CCSI Stakeholders" },
            { id: "verifiedProfiles", label: "Verified Profiles" },
            { id: "underEvaluation", label: "Under Evaluation" },
            { id: "commerceInterest", label: "Commerce Interest" },
          ].map((stat) => {
            const statData = config.impactStats?.[stat.id] || {
              isAuto: true,
              value: 0,
            };
            return (
              <div
                key={stat.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">{stat.label}</span>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary cursor-pointer"
                      checked={statData.isAuto}
                      onChange={(e) =>
                        updateImpactStat(stat.id, "isAuto", e.target.checked)
                      }
                    />
                    Auto-Fill
                  </label>
                </div>
                {!statData.isAuto && (
                  <Input
                    label="Manual Value"
                    type="number"
                    value={statData.value}
                    onChange={(e) =>
                      updateImpactStat(stat.id, "value", Number(e.target.value))
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Office Message */}
      <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
        <h3 className="text-lg font-bold text-amber-900 mb-4">
          Office Message / Quote
        </h3>
        <Textarea
          label="Message displayed on the public Overview tab"
          {...register("overviewConfig.officeMessage")}
          placeholder="Committed to supporting our artisans..."
          className="h-28"
        />
      </div>

      {/* Craft Composition */}
      <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Craft Composition (Progress Bars)
          </h3>
          <button
            type="button"
            onClick={addCraft}
            className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            <FaPlus /> Add Craft
          </button>
        </div>
        <div className="space-y-3">
          {(config.craftComposition || []).map((craft: any, i: number) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-3 items-end bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex-1 w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Craft Name
                </label>
                <select
                  value={craft.name}
                  onChange={(e) => {
                    const selected = PREDEFINED_CRAFTS.find(
                      (c) => c.name === e.target.value,
                    );
                    if (selected) {
                      const current = [...(config.craftComposition || [])];
                      current[i] = { ...current[i], ...selected };
                      setValue("overviewConfig.craftComposition", current);
                    }
                  }}
                  className="w-full rounded-lg border-gray-300 text-sm h-11"
                >
                  {PREDEFINED_CRAFTS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-32">
                <Input
                  label="Count"
                  type="number"
                  value={craft.count}
                  onChange={(e) =>
                    updateCraft(i, "count", Number(e.target.value))
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeCraft(i)}
                className="mb-2 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          {(!config.craftComposition ||
            config.craftComposition.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-4">
              No crafts added. Click above to add.
            </p>
          )}
        </div>
      </div>

      {/* Economic Indicators */}
      <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Economic Indicators
          </h3>
          <button
            type="button"
            onClick={addIndicator}
            className="text-sm px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-1"
          >
            <FaPlus /> Add Indicator
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(config.economicIndicators || []).map((ind: any, i: number) => (
            <div
              key={i}
              className="flex gap-2 items-end bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex-1 w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Indicator Label
                </label>
                <select
                  value={ind.label}
                  onChange={(e) => {
                    const selected = PREDEFINED_INDICATORS.find(
                      (i) => i.label === e.target.value,
                    );
                    if (selected) {
                      const current = [...(config.economicIndicators || [])];
                      current[i] = { ...current[i], ...selected };
                      setValue("overviewConfig.economicIndicators", current);
                    }
                  }}
                  className="w-full rounded-lg border-gray-300 text-sm h-11"
                >
                  {PREDEFINED_INDICATORS.map((indicator) => (
                    <option key={indicator.label} value={indicator.label}>
                      {indicator.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/3 md:w-32">
                <Input
                  label="Value"
                  value={ind.value}
                  onChange={(e) => updateIndicator(i, "value", e.target.value)}
                  placeholder="e.g. 32%"
                />
              </div>
              <button
                type="button"
                onClick={() => removeIndicator(i)}
                className="mb-2 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        {(!config.economicIndicators ||
          config.economicIndicators.length === 0) && (
          <p className="text-sm text-gray-400 text-center py-4">
            No indicators added.
          </p>
        )}
      </div>

      {/* Case & Audit Status */}
      <div className="bg-purple-50/30 p-6 rounded-xl border border-purple-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Case & Audit Status Metrics
          </h3>
          <button
            type="button"
            onClick={addCaseStat}
            className="text-sm px-3 py-1.5 bg-purple-100 text-purple-800 font-bold rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <FaPlus /> Add Metric
          </button>
        </div>
        <div className="space-y-3">
          {(config.caseStatus || []).map((cs: any, i: number) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-3 items-end bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="flex-1 w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Metric Type
                </label>
                <select
                  value={cs.title}
                  onChange={(e) => {
                    const selected = PREDEFINED_METRICS.find(
                      (m) => m.title === e.target.value,
                    );
                    if (selected) {
                      const current = [...(config.caseStatus || [])];
                      current[i] = { ...current[i], ...selected };
                      setValue("overviewConfig.caseStatus", current);
                    }
                  }}
                  className="w-full rounded-lg border-gray-300 text-sm h-11"
                >
                  {PREDEFINED_METRICS.map((m) => (
                    <option key={m.title} value={m.title}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-32">
                <Input
                  label="Value"
                  value={cs.value}
                  onChange={(e) => updateCaseStat(i, "value", e.target.value)}
                  placeholder="e.g. 3,245"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCaseStat(i)}
                className="mb-2 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          {(!config.caseStatus || config.caseStatus.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-4">
              No metrics added.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
