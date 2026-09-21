"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaSpinner, FaBookOpen, FaUsers, FaArrowRight, FaClock, FaTimesCircle } from 'react-icons/fa';
import api from '@/lib/api';

export default function WorkspaceDashboard({ params }: { params: any }) {
  const [publication, setPublication] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    Promise.resolve(params).then((p: any) => {
      setId(p.id);
      
      // Fetch publication and chapters in parallel
      Promise.all([
        api.get(`/publications/${p.id}`),
        api.get(`/publications/${p.id}/chapters`)
      ])
      .then(([pubRes, chRes]) => {
        setPublication(pubRes.data);
        setChapters(chRes.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) return <div className="p-12 flex justify-center"><FaSpinner className="animate-spin text-teal-600 text-2xl" /></div>;

  const totalChapters = chapters.length;
  const approvedChapters = chapters.filter((c: any) => c.status === 'APPROVED' || c.status === 'PUBLISHED').length;
  const reviewChapters = chapters.filter((c: any) => c.status === 'REVIEW' || c.status === 'EDITOR_REVIEW').length;
  const draftChapters = totalChapters - approvedChapters - reviewChapters;

  // Derive TOC Status
  const isTOCApproved = publication?.features?.tableOfContentsStatus === 'APPROVED' || (totalChapters > 0 && approvedChapters === totalChapters);
  const isMetadataComplete = !!(publication?.title && publication?.slug && publication?.publicationType);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Publication Dashboard</h2>
          <p className="text-xs text-gray-500 mt-1">Editorial status overview and pipeline metrics.</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2">
          <FaBookOpen className="text-teal-600" size={14} />
          <h3 className="text-sm font-black text-gray-900">Editorial Pipeline Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Metadata</span>
              {isMetadataComplete ? (
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold"><FaCheckCircle /> Complete</div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600 text-xs font-bold"><FaTimesCircle /> Incomplete</div>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Table of Contents</span>
              {isTOCApproved ? (
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold"><FaCheckCircle /> Approved</div>
              ) : (
                <span className="text-xs font-black text-gray-900">{totalChapters} Chapters (Draft)</span>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Chapter Drafts</span>
              <span className="text-xs font-black text-gray-900">{draftChapters}</span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Approved Chapters</span>
              <span className="text-xs font-black text-gray-900">{approvedChapters}</span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Peer Review</span>
              <span className="text-xs font-bold text-stone-400 italic">Not yet integrated</span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">References Checked</span>
              <span className="text-xs font-bold text-stone-400 italic">Not yet integrated</span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Figures Approved</span>
              <span className="text-xs font-bold text-stone-400 italic">Not yet integrated</span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-gray-700">Copyediting</span>
              <span className="text-xs font-bold text-stone-400 italic">Not yet integrated</span>
            </div>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href={`/dashboard/business/publications/${id}/workspace/toc`} className="group bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:border-teal-400 transition-all flex flex-col items-start justify-between">
          <div>
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-teal-600">
              <FaBookOpen size={16} />
            </div>
            <h3 className="text-sm font-black text-gray-900 mb-1">Architecture & TOC</h3>
            <p className="text-[11px] text-gray-500 mb-4">Manage the structural outline and chapter assignments.</p>
          </div>
          <span className="flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
            Open Editor <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform"/>
          </span>
        </Link>
        
        <Link href={`/dashboard/business/publications/${id}/workspace/review`} className="group bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:border-purple-400 transition-all flex flex-col items-start justify-between">
          <div>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-600">
              <FaUsers size={16} />
            </div>
            <h3 className="text-sm font-black text-gray-900 mb-1">Peer Review Workflow</h3>
            <p className="text-[11px] text-gray-500 mb-4">Assign reviewers, manage scoring, and track editorial decisions.</p>
          </div>
          <span className="flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
            Open Review Board <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform"/>
          </span>
        </Link>
      </div>
    </div>
  );
}
