"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaSpinner, FaArrowLeft, FaCheck, FaXmark, FaCircleExclamation, FaFilePdf, FaUser, FaBuilding, FaBuildingColumns } from "react-icons/fa6";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Define interfaces based on backend controller structure
interface Listing {
    id: string;
    type: string; // 'ARTISAN' | 'BUSINESS' | 'INSTITUTION'
    status: string;
    createdAt: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    artisanProfile?: ArtisanProfile[];
    businessProfile?: BusinessProfile[];
    instituteProfile?: InstituteProfile[];
    compliance?: Compliance[];
}

interface ArtisanProfile {
    specialty: string;
    skillLevel: string;
    experienceYears: number;
    awards?: string;
    catalogUrl?: string;
}

interface BusinessProfile {
    name: string;
    type: string;
    foundedYear?: number;
    websiteUrl?: string;
    productsSold?: string;
    employeeCount?: number;
    licenseNumber?: string;
}

interface InstituteProfile {
    name: string;
    type: string;
    representative: string;
    repDesignation?: string;
    websiteUrl?: string;
    missionStatement?: string;
}

interface Compliance {
    materialSource: string;
    craftingProcess: string;
    isSustainable: boolean;
    sustainableDesc?: string;
    fairTradeCert?: string;
    giCert?: string;
    blockchainCert?: string;
}


export default function SubmissionPreviewClient() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchListing = async () => {
            try {
                // Fetch all valid listings and find the one matching ID
                const response = await api.get('/listing/my-listings');
                const found = response.data.find((l: any) => l.id === id);

                if (found) {
                    setListing(found);
                } else {
                    setError("Submission not found.");
                }
            } catch (err) {
                console.error("Failed to fetch submission details", err);
                setError("Failed to load submission details.");
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><FaSpinner data-ui-icon  className="animate-spin text-3xl " /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;
    if (!listing) return null;

    // Helper to get specific profile data
    // Prisma `include` often returns an array for 1:Many, or null/object for 1:1. 
    // Given the controller code `include: { artisanProfile: true }`, if it's 1:Many in schema (user can have many listings, listing has one profile), it might be an array or object.
    // Let's safely access the first item if array, or the object itself.
    const safelyGetProfile = (profileData: any) => {
        if (Array.isArray(profileData)) return profileData[0];
        return profileData;
    };

    const artisan = listing.artisanProfile ? safelyGetProfile(listing.artisanProfile) : null;
    const business = listing.businessProfile ? safelyGetProfile(listing.businessProfile) : null;
    const institution = listing.instituteProfile ? safelyGetProfile(listing.instituteProfile) : null;
    const compliance = listing.compliance ? safelyGetProfile(listing.compliance) : null;

    const renderDataRow = (label: string, value: string | number | undefined | null) => (
        <div className="py-3 border-b border-gray-50 last:border-0 grid grid-cols-1 md:grid-cols-3 gap-2">
            <span className="text-sm font-bold text-stone-500 uppercase tracking-wide">{label}</span>
            <span className="md:col-span-2 font-medium text-stone-900 break-all">{value || "—"}</span>
        </div>
    );

    const renderSectionHeader = (icon: any, title: string) => (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div data-ui-icon className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center  text-xl">
                {icon}
            </div>
            <h2 className="text-xl font-playfair font-bold text-stone-900">{title}</h2>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-brand-primary transition-colors mb-4">
                        <FaArrowLeft /> Back to Submissions
                    </button>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900">
                        {listing.type === 'ARTISAN' ? "Artisan Registration" :
                            listing.type === 'BUSINESS' ? "Business Registration" : "Institution Registration"}
                    </h1>
                    <p className="text-stone-500 mt-1">Application ID: <span className="font-mono text-stone-700">{listing.id}</span></p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-sm
                        ${listing.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            listing.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-blue-50 text-blue-600'}`}>
                        {listing.status}
                    </span>
                    <span className="text-sm text-stone-400 mt-2">Submitted: {new Date(listing.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Main Contact Info */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                {renderSectionHeader(<FaUser />, "Contact Information")}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                    {renderDataRow("Full Name", listing.fullName)}
                    {renderDataRow("Email", listing.email)}
                    {renderDataRow("Phone", listing.phone)}
                    {renderDataRow("Address", listing.address)}
                </div>
            </div>

            {/* Profile Details */}
            {listing.type === 'ARTISAN' && artisan && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    {renderSectionHeader(<FaUser />, "Artisan Profile")}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                        {renderDataRow("Specialty", artisan.specialty)}
                        {renderDataRow("Skill Level", artisan.skillLevel)}
                        {renderDataRow("Experience", `${artisan.experienceYears} Years`)}
                        {renderDataRow("Awards", artisan.awards)}
                        {renderDataRow("Portfolio/Catalog", artisan.catalogUrl && <a href={artisan.catalogUrl} target="_blank" rel="noreferrer" className="text-brand-primary underline break-all">View Catalog</a>)}
                    </div>
                </div>
            )}

            {listing.type === 'BUSINESS' && business && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    {renderSectionHeader(<FaBuilding />, "Business Details")}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                        {renderDataRow("Business Name", business.name)}
                        {renderDataRow("Business Type", business.type)}
                        {renderDataRow("Founded Year", business.foundedYear)}
                        {renderDataRow("Employees", business.employeeCount)}
                        {renderDataRow("License No.", business.licenseNumber)}
                        {renderDataRow("Website", business.websiteUrl && <a href={business.websiteUrl} target="_blank" rel="noreferrer" className="text-brand-primary underline break-all">{business.websiteUrl}</a>)}
                    </div>
                </div>
            )}

            {listing.type === 'INSTITUTION' && institution && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    {renderSectionHeader(<FaBuildingColumns />, "Institution Details")}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                        {renderDataRow("Institution Name", institution.name)}
                        {renderDataRow("Type", institution.type)}
                        {renderDataRow("Representative", institution.representative)}
                        {renderDataRow("Designation", institution.repDesignation)}
                        {renderDataRow("Website", institution.websiteUrl && <a href={institution.websiteUrl} target="_blank" rel="noreferrer" className="text-brand-primary underline break-all">{institution.websiteUrl}</a>)}
                        {renderDataRow("Mission", institution.missionStatement)}
                    </div>
                </div>
            )}

            {/* Compliance Info */}
            {compliance && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    {renderSectionHeader(<FaCheck />, "Compliance & Certification")}

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-stone-900 mb-2 border-b-2 border-brand-primary/20 inline-block pb-1">Sourcing & Processes</h4>
                            {renderDataRow("Material Source", compliance.materialSource)}
                            {renderDataRow("Crafting Process", compliance.craftingProcess)}
                            {renderDataRow("Sustainable Practices", compliance.isSustainable ? "Yes" : "No")}
                            {compliance.isSustainable && renderDataRow("Description", compliance.sustainableDesc)}
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 mb-2 border-b-2 border-brand-primary/20 inline-block pb-1">Certifications Requested</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div className={`p-4 rounded-lg border ${compliance.fairTradeCert ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                    <p className="font-bold text-sm">Fair Trade</p>
                                    <p className="text-xs mt-1">{compliance.fairTradeCert || "Not Requested"}</p>
                                </div>
                                <div className={`p-4 rounded-lg border ${compliance.giCert ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                    <p className="font-bold text-sm">GI Certification</p>
                                    <p className="text-xs mt-1">{compliance.giCert || "Not Requested"}</p>
                                </div>
                                <div className={`p-4 rounded-lg border ${compliance.blockchainCert ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                    <p className="font-bold text-sm">Blockchain</p>
                                    <p className="text-xs mt-1">{compliance.blockchainCert || "Not Requested"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
