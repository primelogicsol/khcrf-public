"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api";
import {
  FaSearch,
  FaLandmark,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaBullhorn,
  FaCheckCircle,
  FaChevronRight,
  FaShareAlt,
  FaFileSignature,
  FaHandshake,
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { legislativeOfficeHeroFallback } from "@/config/heroFallbacks";

const kashmirDistricts = [
  "Anantnag",
  "Bandipora",
  "Baramulla",
  "Budgam",
  "Ganderbal",
  "Kulgam",
  "Kupwara",
  "Pulwama",
  "Shopian",
  "Srinagar"
];

const kashmirConstituenciesByDistrict: Record<string, string[]> = {
  Kupwara: ["Karnah", "Trehgam", "Kupwara", "Lolab", "Handwara", "Langate"],
  Baramulla: ["Sopore", "Rafiabad", "Uri", "Baramulla", "Gulmarg", "Wagoora-Kreeri", "Pattan"],
  Bandipora: ["Sonawari", "Bandipora", "Gurez (ST)"],
  Ganderbal: ["Kangan (ST)", "Ganderbal"],
  Srinagar: ["Hazratbal", "Khanyar", "Habba Kadal", "Lal Chowk", "Chanapora", "Zadibal", "Eidgah", "Central Shalteng"],
  Budgam: ["Budgam", "Beerwah", "Khansahib", "Charar-i-Sharief", "Chadoora"],
  Pulwama: ["Pampore", "Tral", "Pulwama", "Rajpora"],
  Shopian: ["Zainapora", "Shopian"],
  Kulgam: ["D. H. Pora", "Kulgam", "Devsar"],
  Anantnag: ["Dooru", "Kokernag (ST)", "Anantnag West", "Anantnag", "Srigufwara-Bijbehara", "Shangus-Anantnag East", "Pahalgam"]
};

const kashmirParties = [
  "JK National Conference",
  "JK Peoples Democratic Party",
  "Indian National Congress",
  "Bharatiya Janata Party",
  "JK Peoples Conference",
  "Apni Party",
  "CPI(M)",
  "Awami Ittehad Party",
  "Independent"
];

export default function LegislativeDirectoryClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [offices, setOffices] = useState<any[]>([]);
  const [filteredOffices, setFilteredOffices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Filter States
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const availableConstituencies = selectedDistrict
    ? kashmirConstituenciesByDistrict[selectedDistrict] || []
    : Object.values(kashmirConstituenciesByDistrict).flat();

  useEffect(() => {
    fetchOffices();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = offices.filter((o) => {
      const matchesSearch =
        o.representativeName.toLowerCase().includes(lower) ||
        o.constituency.toLowerCase().includes(lower);

      const matchesParty = !selectedParty || o.party === selectedParty;
      const matchesConstituency =
        !selectedConstituency || o.constituency === selectedConstituency;
      const matchesDistrict =
        !selectedDistrict || o.district === selectedDistrict;

      return (
        matchesSearch && matchesParty && matchesConstituency && matchesDistrict
      );
    });
    setFilteredOffices(filtered);
  }, [
    searchTerm,
    offices,
    selectedParty,
    selectedConstituency,
    selectedDistrict,
  ]);

  const fetchOffices = async () => {
    try {
      const { data } = await api.get("/legislative/public/list");
      if (Array.isArray(data)) {
        setOffices(data);
      } else if (data && Array.isArray(data.data)) {
        setOffices(data.data);
      } else {
        setOffices([]);
      }
    } catch (error) {
      console.error("Failed to fetch offices", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Legislative Office - KHCRF",
      text: "Check out the Legislative Office updates on KHCRF.",
      url: window.location.origin + "/research/lobbying/explore",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto">
      <UniversalEditorialHero
        pageKey="legislative-office"
        fallbackConfig={legislativeOfficeHeroFallback as any}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-xl border border-white/40 flex flex-col gap-8"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-playfair font-black text-brand-dark flex items-center gap-3">
                <span data-ui-icon className="p-3 bg-brand-primary/10 rounded-xl ">
                  <FaBullhorn />
                </span>
                Legislative Constituencies Artisan Desk
              </h2>
              <p className="text-gray-500 text-sm mt-2 ml-14">
                Find verified updates, summaries, and notices from your
                constituency.
              </p>
            </div>

            {/* Search Input - Modern Pill */}
            <div className="md:w-96 w-full relative group z-20">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-md group-hover:bg-brand-primary/10 transition-all"></div>
              <FaSearch data-ui-icon  className="absolute left-5 top-1/2 -translate-y-1/2 /50 group-hover:text-brand-primary transition-colors z-30" />
              <input
                type="text"
                placeholder="Search representatives..."
                className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-gray-100 focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all shadow-sm font-medium text-gray-700 placeholder:text-gray-400 relative z-30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Area */}
          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <FaFilter /> Filter Directory
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-2">
                  Party
                </label>
                <div className="relative">
                  <select
                    value={selectedParty}
                    onChange={(e) => setSelectedParty(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 appearance-none bg-white rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all cursor-pointer font-medium text-gray-700"
                  >
                    <option value="">All Parties</option>
                    {kashmirParties.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 text-xs pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-2">
                  Constituency
                </label>
                <div className="relative">
                  <select
                    value={selectedConstituency}
                    onChange={(e) => setSelectedConstituency(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 appearance-none bg-white rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all cursor-pointer font-medium text-gray-700"
                  >
                    <option value="">All Constituencies</option>
                    {availableConstituencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 text-xs pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 ml-2">
                  District
                </label>
                <div className="relative">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedConstituency(""); // Reset constituency when district changes
                    }}
                    className="w-full pl-4 pr-10 py-3 appearance-none bg-white rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all cursor-pointer font-medium text-gray-700"
                  >
                    <option value="">All Districts</option>
                    {kashmirDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-300 text-xs pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedParty("");
                    setSelectedConstituency("");
                    setSelectedDistrict("");
                  }}
                  disabled={
                    !selectedParty &&
                    !selectedConstituency &&
                    !selectedDistrict &&
                    !searchTerm
                  }
                  className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    selectedParty ||
                    selectedConstituency ||
                    selectedDistrict ||
                    searchTerm
                      ? "bg-gray-900 text-white shadow-lg hover:bg-black hover:-translate-y-1"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedParty ||
                  selectedConstituency ||
                  selectedDistrict ||
                  searchTerm ? (
                    <FaTimes />
                  ) : (
                    <FaFilter />
                  )}
                  {selectedParty ||
                  selectedConstituency ||
                  selectedDistrict ||
                  searchTerm
                    ? "Reset Filters"
                    : "No Filters Active"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white h-72 rounded-3xl animate-pulse shadow-sm"
                ></div>
              ))
          ) : filteredOffices.length > 0 ? (
            filteredOffices.map((office) => (
              <Link
                key={office.id}
                href={`/legislative-office/${office.username}`}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden relative"
              >
                {/* Decorative Header */}
                <div className="h-24 bg-linear-to-r from-brand-primary/10 to-blue-50 relative">
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
                      <FaCheckCircle className="text-green-600" /> Verified
                    </span>
                  </div>
                </div>

                <div className="px-6 flex flex-col flex-1 relative">
                  {/* Profile Image (Overlapping) */}
                  <div className="-mt-12 mb-4 self-start">
                    {office.officeImageUrl ? (
                      <img
                        src={office.officeImageUrl}
                        alt={office.representativeName}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div data-ui-icon className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center  text-3xl group-hover:scale-105 transition-transform duration-300 bg-linear-to-br from-gray-50 to-gray-100">
                        <FaLandmark />
                      </div>
                    )}
                  </div>

                  {/* Representative Info */}
                  <div className="mb-6">
                    <h3 className="text-xl font-black font-playfair text-gray-900 mb-2 group-hover:text-brand-primary transition-colors leading-tight">
                      {office.representativeName}
                    </h3>
                    <p data-editorial-accent-text className=" font-bold text-sm uppercase tracking-wide mb-1">
                      {office.designation}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                        {office.party}
                      </span>
                      {office.termStart && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                          Since {new Date(office.termStart).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location & Stats Divider */}
                  <div className="border-t border-gray-50 -mx-6 mb-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Constituency
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <FaMapMarkerAlt data-ui-icon  className="/70" />
                        {office.constituency}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 ml-5">
                        {office.district}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Updates
                      </span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <FaBullhorn data-ui-icon  className="/70" />
                        {office._count.posts} Verified Posts
                      </div>
                    </div>
                  </div>

                  {/* Contact Preview (if available) */}
                  {(office.officialEmail || office.contactNumber) && (
                    <div className="mb-4 pt-4 border-t border-gray-50">
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {office.officialEmail && (
                          <span
                            className="flex items-center gap-1.5"
                            title="Official Email Available"
                          >
                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs">
                              <FaBullhorn />
                            </span>
                            <span className="truncate max-w-[120px]">
                              Email
                            </span>
                          </span>
                        )}
                        {office.contactNumber && (
                          <span
                            className="flex items-center gap-1.5"
                            title="Office Phone Available"
                          >
                            <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs">
                              <FaBullhorn />
                            </span>
                            <span className="truncate">Phone</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="mt-auto pb-6">
                    <div className="w-full py-3 bg-gray-50 text-brand-dark font-bold rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-hover:shadow-brand-primary/25">
                      Visit Office Portal <FaChevronRight className="text-xs" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <section className="mt-8 mb-12 bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100">
                <div className="max-w-5xl mx-auto">
                  <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
                    Empty Status
                  </span>
                  <h2 className="text-3xl md:text-4xl font-playfair font-black text-gray-900 mb-6">
                    No Public Updates Available Yet
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="text-gray-600 mb-8 text-base md:text-lg max-w-md">
                        This space is reserved for <strong>official updates and statements</strong> from elected representatives regarding artisan communities. Currently, no verified posts have been published.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          onClick={handleShare}
                          className="px-5 py-2.5 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm hover:shadow-orange-500/20 flex items-center gap-2 text-sm"
                        >
                          Invite Representative <FaShareAlt />
                        </button>
                        <Link
                          href="/research/lobbying/register"
                          className="px-5 py-2.5 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all shadow-sm inline-block text-sm"
                        >
                          Register / Login to Post
                        </Link>
                      </div>
                    </div>
                    
                    <div className="relative">
                      {/* Abstract background blur */}
                      <div className="absolute -inset-4 bg-brand-primary/5 rounded-full filter blur-3xl opacity-50"></div>
                      <div className="relative grid grid-cols-2 gap-3 h-full">
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center">
                          <FaLandmark className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-2" />
                          <p className="font-bold text-gray-800 text-sm">Policy Clarity</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center">
                          <FaFileSignature className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-2" />
                          <p className="font-bold text-gray-800 text-sm">Documentation</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center">
                          <FaBullhorn className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-2" />
                          <p className="font-bold text-gray-800 text-sm">Verified Updates</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center">
                          <FaHandshake className="text-2xl text-gray-400 group-hover:text-brand-primary transition-colors mx-auto mb-2" />
                          <p className="font-bold text-gray-800 text-sm">Coordination</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-20 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-6">
                    <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-xs mb-1">
                      Powered by KHCRF
                    </span>
                    <h3 className="text-2xl font-playfair font-black text-gray-900 mb-2">
                      Kashmir Hamadan Craft Revival Foundation
                    </h3>
                    <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                      A civic transparency and craft-sector communication desk created to connect elected representatives, artisan communities, researchers, and citizens through verified constituency-level updates.
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-100 my-6"></div>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">What This Is</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        The Kashmir Legislative Office Updates desk is a verified public communication system for legislative offices working on Kashmir’s handicraft sector, artisan welfare, craft protection, and constituency-level development concerns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">Why It Exists</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Many artisan issues remain undocumented, scattered, or invisible to the public. This desk helps create a transparent record of what is being raised, reviewed, coordinated, and communicated at the constituency level.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">Who Benefits</h4>
                      <ul className="text-gray-600 text-xs space-y-1">
                        <li>• Artisans and craft workers</li>
                        <li>• Elected representatives</li>
                        <li>• Researchers and policy teams</li>
                        <li>• Citizens and local communities</li>
                        <li>• Government departments</li>
                        <li>• Craft-sector organizations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">Expected Outcomes</h4>
                      <ul className="text-gray-600 text-xs space-y-1">
                        <li>• Better public visibility</li>
                        <li>• Stronger documentation</li>
                        <li>• Improved coordination</li>
                        <li>• Verified constituency updates</li>
                        <li>• More informed policy conversations</li>
                        <li>• Greater accountability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
