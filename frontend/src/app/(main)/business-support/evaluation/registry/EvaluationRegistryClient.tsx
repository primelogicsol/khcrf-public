"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaChevronDown, FaChevronUp, FaFilter, FaBuilding, FaUser, FaCheckCircle, FaLeaf, FaHands, FaGlobe, FaUniversity } from "react-icons/fa";
import Image from "next/image";

// Dummy Data for Evaluation Registry
const EVALUATION_DATA = [
    {
        id: "EVAL-2024-001",
        name: "Kashmir Loom Heritage",
        type: "Business",
        location: "Srinagar, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Locally Sourced",
            craftingProcess: "Traditional Handcrafted"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Fair Wage Practice",
            "Sustainable Methods",
            "GI Tagged Products"
        ],
        status: "Gold Tier",
        description: "A leading exporter of authentic Pashmina shawls, committed to preserving traditional weaving techniques and supporting local artisan communities."
    },
    {
        id: "EVAL-2024-002",
        name: "Abdul Rahman & Sons",
        type: "Artisan",
        location: "Budgam, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Imported",
            craftingProcess: "Partial Machine"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Traditional Training",
            "Safe Workplace"
        ],
        status: "Silver Tier",
        description: "Master artisan family specializing in Kani shawl weaving for over three generations. Known for intricate floral designs and natural dyeing adoption."
    },
    {
        id: "EVAL-2024-099",
        name: "Craft Design Institute",
        type: "Institution",
        location: "Srinagar, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Mixed Sources",
            craftingProcess: "Design & Training"
        },
        verifiedItems: [
            "Curriculum Certified",
            "Master Trainers",
            "Heritage Preservation"
        ],
        status: "Gold Tier",
        description: "A premier design institute focused on modernizing traditional crafts while preserving their cultural essence. Provides training and design intervention."
    },
    {
        id: "EVAL-2023-089",
        name: "Himalayan WoodWorks",
        type: "Business",
        location: "Anantnag, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Locally Sourced",
            craftingProcess: "Traditional Handcrafted"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Fair Wage Practice",
            "Sustainable Methods",
            "Waste Management"
        ],
        status: "Gold Tier",
        description: "Premier walnut wood carving unit producing high-end furniture and decor. Certified for sustainable wood sourcing and artisan welfare."
    },
    {
        id: "EVAL-2024-015",
        name: "Zoya Akhtar",
        type: "Artisan",
        location: "Sopore, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Locally Sourced",
            craftingProcess: "Traditional Handcrafted"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Women Empowered",
            "Traditional Training"
        ],
        status: "Bronze Tier",
        description: "Specialized in Sozni embroidery on fine silk. Operates a women-led self-help group training young girls in traditional needlework."
    },
    {
        id: "EVAL-2023-102",
        name: "Royal Carpet Manufactory",
        type: "Business",
        location: "Baramulla, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Locally Sourced",
            craftingProcess: "Traditional Handcrafted"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Fair Wage Practice",
            "ISO Certified",
            "Export Compliant"
        ],
        status: "Gold Tier",
        description: "Manufacturers of exquisite hand-knotted silk carpets. Recognized for reviving ancient Persian designs and using organic vegetable dyes."
    },
    {
        id: "EVAL-2024-045",
        name: "Gulzar Ahmed",
        type: "Artisan",
        location: "Pampore, Kashmir",
        logo: "",
        qualityAuth: {
            materialSource: "Locally Sourced",
            craftingProcess: "Traditional Handcrafted"
        },
        verifiedItems: [
            "Child Labor Prohibited",
            "Traditional Training",
            "Eco-friendly Kiln"
        ],
        status: "Silver Tier",
        description: "Expert potter keeping the glazed pottery tradition alive. Produces functional and decorative clayware using locally sourced clay."
    }
];

const FILTER_TYPES = ["All", "Business", "Artisan", "Institution"];

export default function EvaluationRegistryClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredData = EVALUATION_DATA.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || item.type === selectedType;
        return matchesSearch && matchesType;
    });

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case "Gold Tier": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Silver Tier": return "bg-gray-100 text-gray-700 border-gray-200";
            case "Bronze Tier": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                </div>

                <div className="relative w-full md:w-auto min-w-[200px]">
                    <div className="relative">
                        <FaFilter data-ui-icon  className="absolute left-4 top-1/2 transform -translate-y-1/2 " />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
                        >
                            {FILTER_TYPES.map(type => (
                                <option key={type} value={type}>{type === "All" ? "All Types" : type}</option>
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
                        <p className="text-gray-500 text-lg">No records found matching your criteria.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredData.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 border ${expandedId === item.id ? "shadow-lg border-brand-primary/30" : "shadow-sm border-gray-100 hover:border-brand-primary/50"
                                    }`}
                            >
                                {/* Header - Always Visible */}
                                <div
                                    onClick={() => toggleExpand(item.id)}
                                    className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                                >
                                    <div className="flex items-center gap-6 flex-1">
                                        {/* Logo Placeholder */}
                                        <div className="shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300">
                                            {item.logo ? <Image src={item.logo} alt={item.name} width={64} height={64} className="rounded-xl" /> : (
                                                item.type === 'Business' ? <FaBuilding className="text-2xl" /> :
                                                    item.type === 'Institution' ? <FaUniversity className="text-2xl" /> :
                                                        <FaUser className="text-2xl" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold text-gray-900 truncate">{item.name}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getTierColor(item.status)}`}>
                                                    <FaCheckCircle className="text-xs" />
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="font-medium text-brand-dark">{item.id}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1"><FaGlobe className="text-xs" /> {item.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <div className="hidden md:block text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status</p>
                                            <p className="text-sm font-semibold text-green-600 flex items-center gap-1 justify-end">
                                                Evaluated & Verified <FaCheckCircle />
                                            </p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${expandedId === item.id ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                            {expandedId === item.id ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {expandedId === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                                        >
                                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="md:col-span-2 space-y-6">
                                                    <div>
                                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">About Entity</h4>
                                                        <p className="text-gray-700 leading-relaxed">{item.description}</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                                            <div className="flex items-center gap-3 mb-2 text-brand-secondary">
                                                                <FaLeaf />
                                                                <h4 className="font-bold text-sm">Material Source</h4>
                                                            </div>
                                                            <p className="text-gray-900 font-medium pl-7">{item.qualityAuth.materialSource}</p>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                                            <div className="flex items-center gap-3 mb-2 text-brand-secondary">
                                                                <FaHands />
                                                                <h4 className="font-bold text-sm">Crafting Process</h4>
                                                            </div>
                                                            <p className="text-gray-900 font-medium pl-7">{item.qualityAuth.craftingProcess}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2 border-b pb-2">Verified Compliance</h4>
                                                    <ul className="space-y-3">
                                                        {item.verifiedItems.map((vItem, index) => (
                                                            <li key={index} className="flex items-start gap-3">
                                                                <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                                                                <span className="text-sm font-medium text-gray-700">{vItem}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
