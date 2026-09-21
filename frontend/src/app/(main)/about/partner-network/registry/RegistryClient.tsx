"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaBuilding,
  FaCheckCircle,
  
  FaHistory,
} from "react-icons/fa";
import Image from "next/image";
import { getEcosystemBrand } from "@/lib/partnerRegistryAdapter";
import { partnerApi } from "@/lib/api";


const COLLABORATION_AREAS = [
  "Artisan Welfare",
  "Academic & Applied Research",
  "Cultural Preservation",
  "Policy & Advocacy",
  "Sustainability & Ethical Trade",
  "Innovation & Technology",
  "CSR & Philanthropy",
  "Community Development",
  "Education & Skills",
  "Environmental Sustainability",
  "Climate Resilience",
  "Natural Resource Management",
  "Research & Evidence",
  "GIS & Spatial Intelligence",
  "Digital Infrastructure",
  "Data & Analytics",
  "Technical Assistance",
  "Institutional Capacity Building",
  "Programme Coordination",
  "Collaboration Infrastructure",
  "Monitoring & Evaluation"
];

const ECOSYSTEMS = [
  "Craftlore",
  "De Koshur Crafts",
  "Kashmir ArtStay",
  "Kashmir EcoWatch",
  "Dr. Kumar Foundation USA",
  "Prime Logic Solutions USA",
  "Purple Soul USA",
  "Team Collab",
];

const COLLECTIONS = [
  { value: "core-ecosystem", label: "Integrated Ecosystem" },
  { value: "specialized-enterprise", label: "Specialized Enterprises" },
  { value: "institutional-alliance", label: "Strategic & Institutional Alliances" }
];

export default function RegistryClient({ initialCollection = "All" }: { initialCollection?: string }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading filters...</div>}>
      <RegistryClientInner initialCollection={initialCollection} />
    </Suspense>
  );
}

function RegistryClientInner({ initialCollection = "All" }: { initialCollection?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const queryCol = searchParams.get("collection");
  
  const [selectedCollection, setSelectedCollection] = useState(() => {
    const col = queryCol || initialCollection;
    const isValid = COLLECTIONS.some(c => c.value === col);
    return isValid ? col : "All";
  });

  useEffect(() => {
    if (queryCol) {
      const isValid = COLLECTIONS.some(c => c.value === queryCol);
      setSelectedCollection(isValid ? queryCol : "All");
    }
  }, [queryCol]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedEcosystem, setSelectedEcosystem] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await partnerApi.getPublic().catch(() => null);
      const actualPartners = data && Array.isArray(data) ? data : (data && Array.isArray(data?.data) ? data.data : (data && Array.isArray(data?.data?.data) ? data.data.data : []));
      setPartners(actualPartners);
    } catch (error) {
      console.error("Failed to load registry:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = partners.filter((item) => {
    if (!item) return false;
    const idString = item.id || item.referenceId || item.displayId || "";
    const nameString = item.orgName || item.name || "";
    const matchesSearch =
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea =
      selectedArea === "All" ||
      (Array.isArray(item.collaborationAreas) &&
        item.collaborationAreas.includes(selectedArea));

    const matchesEcosystem = selectedEcosystem === "All" || getEcosystemBrand(nameString) === selectedEcosystem;
    const matchesCollection = selectedCollection === "All" || item.collection === selectedCollection;

    return matchesSearch && matchesArea && matchesEcosystem && matchesCollection;
  });

  const PARENT_IDS = ["KHCRF-PTR-000000", "KHCRF-PTR-000001", "KHCRF-PTR-000009", "KHCRF-PTR-000010", "KHCRF-PTR-000011", "KHCRF-PTR-000012", "KHCRF-PTR-000032", "KHCRF-PTR-000033"];

  const visibleEcosystems = new Set(filteredData.map(item => getEcosystemBrand(item.orgName || item.name || "")));
  const visibleIds = new Set(filteredData.map(item => item.id || item.referenceId || item.displayId));

  partners.forEach(item => {
    const id = item.id || item.referenceId || item.displayId;
    if (PARENT_IDS.includes(id) && !visibleIds.has(id)) {
      const brand = getEcosystemBrand(item.orgName || item.name || "");
      if (visibleEcosystems.has(brand)) {
        filteredData.push(item);
        visibleIds.add(id);
      }
    }
  });

  const sortedFilteredData = [...filteredData].sort((a: { orgName?: string, name?: string, id?: string, referenceId?: string, displayId?: string }, b: { orgName?: string, name?: string, id?: string, referenceId?: string, displayId?: string }) => {
    const brandA = (a.orgName || a.name || "");
    const brandB = (b.orgName || b.name || "");

    const ecoA = getEcosystemBrand(brandA);
    const ecoB = getEcosystemBrand(brandB);

    if (ecoA !== ecoB) return ecoA.localeCompare(ecoB);

    const isParentA = PARENT_IDS.includes(a.id || a.referenceId || a.displayId);
    const isParentB = PARENT_IDS.includes(b.id || b.referenceId || b.displayId);

    if (isParentA && !isParentB) return -1;
    if (!isParentA && isParentB) return 1;

    return brandA.localeCompare(brandB);
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-transparent text-[#008235] border-0";
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200 px-3 py-1";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FaCheckCircle className="text-[#008235] bg-white rounded-full" />;
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

  const baseForAreaCounts = partners.filter(p => {
    const isStatusOk = p.status === "ACTIVE" || p.status === "APPROVED";
    const nameString = p.orgName || p.name || "";
    const matchesEco = selectedEcosystem === "All" || getEcosystemBrand(nameString) === selectedEcosystem;
    const matchesCol = selectedCollection === "All" || p.collection === selectedCollection;
    return isStatusOk && matchesEco && matchesCol;
  });

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
            <FaFilter data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Collections</option>
              {COLLECTIONS.map((col) => (
                <option key={col.value} value={col.value}>
                  {col.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative w-full md:w-auto min-w-[200px] lg:min-w-[250px]">
          <div className="relative">
            <FaBuilding data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-secondary" />
            <select
              value={selectedEcosystem}
              onChange={(e) => setSelectedEcosystem(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Ecosystems</option>
              {ECOSYSTEMS.map((eco) => (
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
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Collaboration Areas</option>
              {COLLABORATION_AREAS.map((area) => {
                const count = baseForAreaCounts.filter(p => Array.isArray(p.collaborationAreas) && p.collaborationAreas.includes(area)).length;
                return (
                  <option key={area} value={area}>
                    {area} ({count})
                  </option>
                );
              })}
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
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-hcrf-brown-700 text-white border-hcrf-brown-800">
                            PARENT ECOSYSTEM
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}
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
