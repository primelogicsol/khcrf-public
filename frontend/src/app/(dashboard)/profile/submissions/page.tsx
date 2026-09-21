"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaSpinner, FaCircleCheck, FaCircleExclamation, FaClock } from "react-icons/fa6";
import { FaFileAlt, FaDownload } from "react-icons/fa";
import Link from "next/link";

interface Listing {
    id: string;
    type: string;
    status: string;
    createdAt: string;
}

interface MediaAsset {
    id: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
    publicUrl: string;
    fileName: string;
    sizeBytes?: number;
    mimeType?: string;
}

interface ParticipationSubmission {
    id: string;
    submissionNumber: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
    mediaAssets?: MediaAsset[];
}

export default function SubmissionsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [participationSubmissions, setParticipationSubmissions] = useState<ParticipationSubmission[]>([]);
    const [activeSubTab, setActiveSubTab] = useState<'validations' | 'participation'>('validations');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<ParticipationSubmission | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeSubTab === 'validations') {
                const response = await api.get('/listing/my-listings');
                setListings(response.data);
            } else {
                const response = await api.get('/participation/my-submissions');
                setParticipationSubmissions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch submissions data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSubTab]);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-playfair font-bold text-stone-900">My Submissions</h1>
                    <p className="text-stone-600 mt-2">Track the status of your validations and historical contributions.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/business-support/evaluation/document-submission" className="bg-[#3E2723] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#D4AF37] hover:text-[#3E2723] transition-colors shadow-md flex items-center gap-2">
                        <FaFileAlt /> Validation Intake
                    </Link>
                    <Link href="/master-artisans/participate" className="bg-stone-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-stone-800 transition-colors shadow-md flex items-center gap-2">
                        Participate Suite
                    </Link>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-gray-200 gap-6 mt-4">
                <button
                    onClick={() => setActiveSubTab('validations')}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest ${activeSubTab === 'validations' ? 'border-b-2 border-[#3E2723] text-[#3E2723]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Document Validations
                </button>
                <button
                    onClick={() => setActiveSubTab('participation')}
                    className={`pb-3 text-sm font-bold uppercase tracking-widest ${activeSubTab === 'participation' ? 'border-b-2 border-[#3E2723] text-[#3E2723]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Archival & Participation Intake
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-3xl text-stone-600" /></div>
            ) : activeSubTab === 'validations' ? (
                listings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FaFileAlt className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-2">No Validations Yet</h3>
                        <p className="text-stone-500 mb-6 max-w-md mx-auto">You haven&apos;t submitted any documentation for validation yet. Complete the form to start getting verified.</p>
                        <Link href="/business-support/evaluation/document-submission" className="px-6 py-3 bg-stone-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
                            Start Validation
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Submitted On</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Type</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Application ID</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 text-stone-700">
                                                {new Date(listing.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-stone-900 capitalize">
                                                {listing.type.toLowerCase()}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 font-mono text-xs">
                                                {listing.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {listing.status === 'APPROVED' ? <FaCircleCheck className="text-green-500" /> :
                                                        listing.status === 'REJECTED' ? <FaCircleExclamation className="text-red-500" /> :
                                                            <FaClock className="text-blue-500" />}
                                                    <span className="text-stone-700 capitalize">{listing.status.toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/profile/submissions/${listing.id}`} className="inline-block px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:text-[#3E2723] hover:border-[#3E2723] hover:bg-[#3E2723]/5 transition-all">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            ) : (
                participationSubmissions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FaFileAlt className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-2">No Submissions Found</h3>
                        <p className="text-stone-500 mb-6 max-w-md mx-auto">We couldn&apos;t find any historical submissions matching your profile email. Participate in our archival initiatives to contribute.</p>
                        <Link href="/master-artisans/participate" className="px-6 py-3 bg-stone-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
                            Explore Intake Pathways
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Submitted On</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Intake Type</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Title / Nominee</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Tracking ID</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {participationSubmissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 text-stone-700">
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-stone-500">
                                                {sub.type}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-stone-900">
                                                {sub.title}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 font-mono text-xs">
                                                {sub.submissionNumber}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {sub.status === 'APPROVED' ? <FaCircleCheck className="text-green-500" /> :
                                                        sub.status === 'REJECTED' ? <FaCircleExclamation className="text-red-500" /> :
                                                            <FaClock className="text-blue-500" />}
                                                    <span className="text-stone-700 capitalize">{sub.status.toLowerCase().replace('_', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setSelectedItem(sub)}
                                                    className="inline-block px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:text-[#3E2723] hover:border-[#3E2723] hover:bg-[#3E2723]/5 transition-all"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}

            {/* Submissions Detail Preview Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-stone-200">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <div>
                                <span className="text-[10px] font-bold tracking-widest text-stone-400 font-mono uppercase">{selectedItem.submissionNumber}</span>
                                <h3 className="text-lg font-bold text-stone-900">{selectedItem.title}</h3>
                            </div>
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="text-stone-400 hover:text-stone-600 text-2xl p-1"
                            >
                                &times;
                              </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-100 text-xs">
                                <div>
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400">Intake Type</span>
                                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{selectedItem.type}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400">Review Status</span>
                                    <span className="font-semibold text-stone-800 text-sm mt-0.5 block capitalize">{selectedItem.status.toLowerCase().replace('_', ' ')}</span>
                                </div>
                            </div>

                            {/* Media Assets */}
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Submitted Artifacts</span>
                                {(!selectedItem.mediaAssets || selectedItem.mediaAssets.length === 0) ? (
                                    <div className="text-sm text-stone-400 italic">No files attached to this submission.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedItem.mediaAssets.map((asset: MediaAsset) => (
                                            <div key={asset.id} className="border border-stone-200 rounded-lg p-3 bg-stone-50 flex items-center justify-between">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {asset.mediaType === 'IMAGE' ? (
                                                        <img src={asset.publicUrl} alt={asset.fileName} className="w-12 h-12 rounded object-cover border border-stone-200 flex-shrink-0" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-stone-200 border border-stone-300 text-stone-500 rounded flex items-center justify-center text-lg flex-shrink-0">
                                                            <FaFileAlt />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <span className="block text-sm text-stone-900 font-bold truncate">{asset.fileName}</span>
                                                        <span className="block text-[10px] uppercase text-stone-400 font-mono tracking-wider">{asset.mediaType} • {formatBytes(asset.sizeBytes || 0)}</span>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={asset.publicUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-3 py-1.5 rounded shadow-sm"
                                                >
                                                    <FaDownload /> View
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-stone-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
