const fs = require('fs');

const content = `"use client";

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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePartnerNetworkCollections } from "@/hooks/usePartnerNetworkCollections";
import { getEcosystemBrand } from "@/lib/partnerRegistryAdapter";

export default function RegistryClient() {
  const searchParams = useSearchParams();
  const selectedCollection = searchParams.get("collection");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedEcosystem, setSelectedEcosystem] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { allPartners, loading, error, counts } = usePartnerNetworkCollections();

  // 1. Apply collection filter
  const collectionFiltered = allPartners.filter((item: any) => {
    if (!item) return false;
    return !selectedCollection || item.collection === selectedCollection || (selectedCollection === "core-ecosystem" && item.collection === "internal-module");
  });

  // 2. Derive ecosystems for dropdown
  const derivedEcosystems = Array.from(
    new Set(allPartners.map((item: any) => getEcosystemBrand(item.orgName || item.name || "")))
  ).sort();

  // 3. Apply ecosystem & search filters
  const ecosystemFiltered = collectionFiltered.filter((item: any) => {
    const nameString = item.orgName || item.name || "";
    const idString = item.id || item.referenceId || item.displayId || "";

    const matchesSearch =
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEcosystem =
      selectedEcosystem === "All" ||
      getEcosystemBrand(nameString) === selectedEcosystem;

    return matchesSearch && matchesEcosystem;
  });

  // 4. Derive collaboration types
  const derivedTypesSet = new Set<string>();
  ecosystemFiltered.forEach((item: any) => {
    const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    typesArray.forEach((type: string) => derivedTypesSet.add(type));
  });
  const derivedTypes = Array.from(derivedTypesSet).sort();

  // Reset selectedType if no longer valid
  useEffect(() => {
    if (selectedType !== "All" && !derivedTypes.includes(selectedType)) {
      setSelectedType("All");
    }
  }, [selectedCollection, selectedEcosystem, derivedTypes, selectedType]);

  // 5. Final filtering
  const filteredData = ecosystemFiltered.filter((item: any) => {
    const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    return selectedType === "All" || typesArray.includes(selectedType);
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "REVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <FaCheckCircle />;
      case "PENDING":
        return <FaClock />;
      case "REVIEW":
        return <FaHistory />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading registry...</div>;
  }

  if (error) {
    return <p role="alert">The registry could not be loaded. Please refresh to try again.</p>;
  }

  // Group and sort data for rendering
  const groupedData = Array.from(
    filteredData.reduce((map: Map<string, any[]>, item: any) => {
      const brand = getEcosystemBrand(item.orgName || item.name || "");
      if (!map.has(brand)) map.set(brand, []);
      map.get(brand)!.push(item);
      return map;
    }, new Map<string, any[]>())
  ).sort((a: any, b: any) => {
    return a[0].localeCompare(b[0]);
  });

  return (
    <div className="space-y-8">
      <nav aria-label="Registry collections" className="flex flex-wrap gap-3">
        {[
          { value: null, label: "All Records", count: allPartners.length },
          { value: "core-ecosystem", label: "Core Ecosystem", count: counts.coreEcosystem },
          { value: "specialized-enterprise", label: "Specialized Enterprises", count: counts.specializedEnterprises },
          { value: "institutional-alliance", label: "Institutional Alliances", count: counts.institutionalAlliances },
        ].map(({ value, label, count }) => (
          <Link
            key={value || "all"}
            href={value ? \`/about/partner-network/registry?collection=\${value}\` : "/about/partner-network/registry"}
            aria-current={selectedCollection === value ? "page" : undefined}
            className={\`rounded-xl border px-4 py-2 text-sm font-semibold \${
              (selectedCollection === value || (value === null && !selectedCollection))
                ? "bg-brand-primary text-white"
                : "bg-white text-gray-700 border-gray-200"
            }\`}
          >
            {label} <span className="opacity-70 ml-1">({count})</span>
          </Link>
        ))}
      </nav>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto min-w-[200px] lg:min-w-[250px]">
            <div className="relative">
              <FaFilter data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
              <select
                value={selectedEcosystem}
                onChange={(e) => setSelectedEcosystem(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
              >
                <option value="All">All Ecosystems ({allPartners.length})</option>
                {derivedEcosystems.map((eco: any) => (
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
              <FaFilter data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
                >
                  <option value="All">All Collaboration Types</option>
                  {derivedTypes.map((type: any) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Registry List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No records found matching your criteria.</p>
          </div>
        ) : (
          groupedData.map(([brand, items]: any) => {
            const sortedItems = [...items].sort((a: any, b: any) => {
              const isParentA = (a.orgName || a.name || "") === brand;
              const isParentB = (b.orgName || b.name || "") === brand;
              if (isParentA && !isParentB) return -1;
              if (!isParentA && isParentB) return 1;
              return (a.orgName || a.name || "").localeCompare(b.orgName || b.name || "");
            });

            const parentInList = sortedItems.some(i => (i.orgName || i.name || "") === brand);

            return (
              <div key={brand} className="mb-12">
                {/* Ecosystem Context Header */}
                <div className="border-b-2 border-brand-primary pb-3 mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                  <h2 className="text-2xl font-serif text-brand-dark flex items-center gap-3">
                    {brand}
                    {!parentInList && (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-200/50 px-2 py-1 rounded tracking-widest uppercase">
                        PARENT CONTEXT
                      </span>
                    )}
                  </h2>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{sortedItems.length} record{sortedItems.length !== 1 ? 's' : ''} in view</span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {sortedItems.map((item: any, index: number) => {
                      if (!item) return null;
                      const isParent = (item.orgName || item.name || "") === brand;
                      const safeKey = item.id || item.referenceId || item.displayId || \`fallback-\${brand}-\${index}\`;
                      
                      return (
                        <motion.div
                          key={safeKey}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={\`bg-white rounded-2xl overflow-hidden transition-all duration-300 border \${
                            expandedId === safeKey
                              ? "shadow-lg border-brand-primary/30"
                              : "shadow-sm border-gray-100 hover:border-brand-primary/50"
                          }\`}
                        >
                          {/* Header - Always Visible */}
                          <div
                            onClick={() => toggleExpand(safeKey)}
                            className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                          >
                            <div className="flex items-center gap-6 flex-1 min-w-0">
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
                                  {isParent && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                      PARENT ECOSYSTEM
                                    </span>
                                  )}
                                  <span
                                    className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border \${getStatusColor(item.status)}\`}
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
                                className={\`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer \${expandedId === safeKey ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"}\`}
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
                                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                        {item.projectDescription || item.engagementDescription || "Detailed engagement parameters are currently under secure review."}
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
                                      <p className="text-gray-700 mb-4 font-medium">
                                        To connect with <strong className="text-gray-900">{item.orgName || item.name}</strong>,<br />
                                        get KHCRF membership.
                                      </p>
                                      <Link
                                        href="/about/memberships"
                                        className="inline-block px-6 py-2 bg-brand-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-dark transition-colors"
                                      >
                                        Get Membership
                                      </Link>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div>
                                      <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                        Status
                                      </h4>
                                      <p className="font-semibold text-brand-primary uppercase">
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
\`;

fs.writeFileSync('frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx', content);
