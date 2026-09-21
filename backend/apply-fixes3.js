"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaHistory,
} from "react-icons/fa";
import Image from "next/image";
import { usePartnerNetworkCollections } from "@/hooks/usePartnerNetworkCollections";
import { getEcosystemBrand } from "@/lib/partnerRegistryAdapter";





export default function RegistryClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedEcosystem, setSelectedEcosystem] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { allPartners: partners, loading, error, counts } = usePartnerNetworkCollections();

  const filteredData = partners.filter((item) => {
    if (!item) return false;
    const idString = item.id || item.referenceId || item.displayId || "";
    const nameString = item.orgName || item.name || "";
    const matchesSearch =
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase());

    const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    const matchesType = selectedType === "All" || typesArray.includes(selectedType);

    const matchesEcosystem = selectedEcosystem === "All" || getEcosystemBrand(nameString) === selectedEcosystem;

    return matchesSearch && matchesType && matchesEcosystem;
  });

  
  const derivedEcosystems = Array.from(
    new Set(partners.map((item: any) => getEcosystemBrand(item.orgName || item.name || "")))
  ).sort() as string[];

  const derivedTypesSet = new Set<string>();
  partners.filter((item: any) => {
    if (!item) return false;
    const nameString = item.orgName || item.name || "";
    return selectedEcosystem === "All" || getEcosystemBrand(nameString) === selectedEcosystem;
  }).forEach((item: any) => {
    const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    typesArray.forEach((type: string) => derivedTypesSet.add(type));
  });
  const derivedTypes = Array.from(derivedTypesSet).sort();

  useEffect(() => {
    if (selectedType !== "All" && !derivedTypes.includes(selectedType)) {
      setSelectedType("All");
    }
  }, [selectedEcosystem, derivedTypes, selectedType]);

  const PARENT_IDS = ["#000000", "#000001", "#000009", "#000010", "#000011", "#000012", "#000032", "#000033"];

  // Sort filteredData
  const sortedFilteredData = [...filteredData].sort((a: any, b: any) => {
    const brandA = getEcosystemBrand(a.orgName || a.name || "");
    const brandB = getEcosystemBrand(b.orgName || b.name || "");
    
    if (brandA !== brandB) return brandA.localeCompare(brandB);

    const isParentA = PARENT_IDS.includes(a.id || a.referenceId || a.displayId);
    const isParentB = PARENT_IDS.includes(b.id || b.referenceId || b.displayId);

    if (isParentA && !isParentB) return -1;
    if (!isParentA && isParentB) return 1;

    return (a.orgName || a.name || "").localeCompare(b.orgName || b.name || "");
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return <FaCheckCircle />;
      case "COMPLETED":
        return <FaHistory />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading registry...</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>

        <div className="relative w-full md:w-auto min-w-[200px] lg:min-w-[250px]">
          <div className="relative">
            <FaBuilding data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
            <select
              value={selectedEcosystem}
              onChange={(e) => setSelectedEcosystem(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Ecosystems ({partners.length})</option>
              {derivedEcosystems.map((eco) => (
                <option key={eco} value={eco}>
                  {eco}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative w-full md:w-auto min-w-[200px] lg:min-w-[250px]">
          <div className="relative">
            <FaFilter data-ui-icon  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Collaboration Types ({partners.length})</option>
              {derivedTypes.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Registry List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No records found matching your criteria.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedFilteredData.map((item, index) => {
              if (!item) return null;
              const safeKey = item.id || item.referenceId || item.displayId || `fallback-${index}`;
              return (
              <motion.div
                key={safeKey}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${
                  expandedId === safeKey
                    ? "shadow-lg border-brand-primary/30"
                    : "shadow-sm border-gray-100 hover:border-brand-primary/50"
                }`}
              >
                {/* Header - Always Visible */}
                <div
                  onClick={() => toggleExpand(safeKey)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6 flex-1">
                    {/* Logo Placeholder */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 overflow-hidden relative">
                      {item.logoUrl ? (
                        <Image
                          src={item.logoUrl}
                          alt={item.orgName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaBuilding className="text-2xl" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                            {item.orgName || item.name}
                          </h3>
                          {PARENT_IDS.includes(item.id || item.referenceId || item.displayId) && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-100 text-gray-700 border-gray-200">
                              PARENT ECOSYSTEM
                            </span>
                          )}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-brand-dark">
                          #{(item.id || item.referenceId || item.displayId || "000000").slice(-6)}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{item.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                        Collaboration Type
                      </p>
                      <div className="flex flex-wrap justify-end gap-1">
                        {(Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : [])).map((type: string) => (
                          <span
                            key={type}
                            className="text-sm font-semibold text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${expandedId === safeKey ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"}`}
                      onClick={() => toggleExpand(safeKey)}
                    >
                      {expandedId === safeKey ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === safeKey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                    >
                      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              Engagement Description
                            </h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {item.projectDescription || item.engagementDescription ||
                                "No description available."}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              Areas of Collaboration
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(item.collaborationAreas) ? item.collaborationAreas : []).map((area: string) => (
                                <span
                                  key={area}
                                  className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-brand-dark shadow-sm"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              CONNECT
                            </h4>
                            <p className="text-gray-700 mb-4">
                              To connect with {item.orgName},<br />
                              get KHCRF membership.
                            </p>
                            <a
                              href="/about/memberships"
                              className="inline-block px-6 py-2 bg-brand-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-dark transition-colors"
                            >
                              Get Membership
                            </a>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                              Status
                            </h4>
                            <p className="font-semibold text-gray-900">
                              {item.status}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              Type
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : [])).map((type: string) => (
                                <span
                                  key={type}
                                  className="text-sm font-medium text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-1 rounded-md"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                              Reference ID
                            </h4>
                            <p className="font-mono text-sm text-gray-500">
                              {item.id || item.referenceId || item.displayId || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
