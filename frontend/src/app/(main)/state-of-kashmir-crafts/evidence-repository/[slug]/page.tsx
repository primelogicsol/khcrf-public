"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaFileAlt, FaDownload, FaLock, FaCheckCircle, FaUserShield, FaCalendarAlt, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

export default function EvidenceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [evidence, setEvidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/skc/evidence/public/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
           setEvidence(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center py-40 font-bold text-gray-500">Retrieving secure record...</div>;
  if (!evidence) return <div className="text-center py-40 font-bold text-red-500">Record not found or access restricted.</div>;

  return (
    <main className="w-full bg-gray-50 min-h-screen pt-32 pb-20">
       <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/state-of-kashmir-crafts/evidence-repository#search-section" className="inline-flex items-center gap-2 text-icon-on-light font-bold hover:underline mb-8">
             <FaArrowLeft /> Back to Repository Search
          </Link>

          <div className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
             
             {/* Header */}
             <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-xs font-black tracking-widest uppercase bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-md">{evidence.evidenceType}</span>
                   <span className="text-xs font-bold text-gray-400">Ref: {evidence.referenceNumber}</span>
                   {evidence.isReferencedInFinal && (
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                         <FaCheckCircle /> Cited in Final Report
                      </span>
                   )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-brand-dark mb-4 leading-tight">{evidence.title}</h1>
                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-500">
                   {evidence.category && <span><FaFileAlt className="inline mr-2 text-gray-400"/>{evidence.category}</span>}
                   {evidence.district && <span><FaMapMarkerAlt className="inline mr-2 text-gray-400"/>{evidence.district}</span>}
                   {evidence.publicationDate && <span><FaCalendarAlt className="inline mr-2 text-gray-400"/>{new Date(evidence.publicationDate).toLocaleDateString()}</span>}
                </div>
             </div>

             {/* Content */}
             <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                   
                   <div>
                      <h3 className="text-xl font-black text-brand-dark mb-4">Abstract / Description</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{evidence.description}</p>
                   </div>

                   {evidence.provenance && (
                      <div>
                         <h3 className="text-xl font-black text-brand-dark mb-4">Provenance</h3>
                         <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl text-gray-700 text-sm leading-relaxed">
                            {evidence.provenance}
                         </div>
                      </div>
                   )}

                   {evidence.relevance && (
                      <div>
                         <h3 className="text-xl font-black text-brand-dark mb-4">Assessment Relevance</h3>
                         <p className="text-gray-700 leading-relaxed">{evidence.relevance}</p>
                      </div>
                   )}

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                   <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-bold text-brand-dark mb-4 border-b border-gray-200 pb-2">Attribution</h4>
                      <ul className="space-y-3 text-sm">
                         <li><span className="text-gray-500 block text-xs">Contributor</span> <span className="font-medium text-gray-800">{evidence.contributorName || 'Redacted / Withheld'}</span></li>
                         <li><span className="text-gray-500 block text-xs">Organization</span> <span className="font-medium text-gray-800">{evidence.organization || 'Independent'}</span></li>
                         {evidence.craftSector && <li><span className="text-gray-500 block text-xs">Craft Sector</span> <span className="font-medium text-gray-800">{evidence.craftSector}</span></li>}
                      </ul>
                   </div>

                   <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                      <h4 className="font-bold text-brand-dark mb-4 border-b border-gray-200 pb-2">Verification Status</h4>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-800 mb-2">
                         <FaUserShield className="text-green-600 text-lg" /> Authenticated & Approved
                      </div>
                      <p className="text-xs text-gray-500">This record has passed technical review and is authorized for public inclusion in the 2026 repository.</p>
                   </div>

                   {evidence.fileUrl ? (
                      <a href={evidence.fileUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-3 p-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition shadow-md">
                         <FaDownload /> Download Original File
                      </a>
                   ) : (
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 text-center">
                         <FaLock className="text-gray-400 text-3xl mx-auto mb-2" />
                         <span className="block text-sm font-bold text-gray-600">File Access Restricted</span>
                         <span className="block text-xs text-gray-500 mt-1">This record contains metadata only. The original attachment is protected or was not provided for public distribution.</span>
                      </div>
                   )}
                </div>
             </div>
             
          </div>
       </div>
    </main>
  );
}
