"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUpload, FaGlobe, FaFilePdf, FaBookOpen, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaLock, FaClock, FaHistory,
  FaCheck, FaTimes
} from 'react-icons/fa';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-stone-100 text-stone-600',
  IN_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
  PUBLISHED: 'bg-teal-100 text-teal-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function GateItem({ pass, label, detail }: { pass: boolean; label: string; detail?: string }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${pass ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
      <div className={`mt-0.5 shrink-0 ${pass ? 'text-emerald-500' : 'text-red-400'}`}>
        {pass ? <FaCheck size={10} /> : <FaTimes size={10} />}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-wider ${pass ? 'text-emerald-700' : 'text-red-600'}`}>{label}</p>
        {detail && <p className="text-[9px] text-gray-500 mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

export default function PublishWorkspace({ params }: { params: any }) {
  const [publicationId, setPublicationId] = useState('');
  const [pub, setPub] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [releaseHistory, setReleaseHistory] = useState<any[]>([]);

  const loadData = useCallback((id: string) => {
    setLoading(true);
    Promise.all([
      api.get(`/publications/${id}`),
      api.get(`/publications/${id}/chapters`)
    ]).then(([pubRes, chapRes]) => {
      const pubData = pubRes.data?.data ?? pubRes.data;
      const chapData = chapRes.data?.data ?? chapRes.data;
      setPub(pubData);
      setChapters(Array.isArray(chapData) ? chapData : []);

      const meta = typeof pubData?.metadata === 'string'
        ? JSON.parse(pubData.metadata || '{}')
        : (pubData?.metadata || {});
      setReleaseHistory(Array.isArray(meta.releaseHistory) ? meta.releaseHistory : []);
    }).catch(() => toast.error('Failed to load publication data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Promise.resolve(params).then((p: any) => {
      setPublicationId(p.id);
      loadData(p.id);
    });
  }, [params, loadData]);

  // Compute gate checks client-side (mirrors backend logic)
  const gates = pub ? [
    {
      pass: !!pub.slug && pub.slug.trim() !== '',
      label: 'URL Slug',
      detail: pub.slug ? `/${pub.slug}` : 'Missing — set in Metadata tab'
    },
    {
      pass: !!pub.accessType,
      label: 'Access Tier',
      detail: pub.accessType || 'Missing — set in Metadata tab'
    },
    {
      pass: chapters.length > 0,
      label: 'Chapters present',
      detail: `${chapters.length} chapter${chapters.length !== 1 ? 's' : ''} in TOC`
    },
    {
      pass: chapters.length > 0 && chapters.every(ch => ch.hasManuscriptContent),
      label: 'All chapters have content',
      detail: chapters.filter(ch => !ch.hasManuscriptContent).length > 0
        ? `${chapters.filter(ch => !ch.hasManuscriptContent).length} chapter(s) still empty`
        : 'All chapters contain manuscript pages'
    },
    {
      pass: pub.publishedStatus === 'APPROVED' || pub.publishedStatus === 'PUBLISHED' || pub.publishedStatus === 'SCHEDULED',
      label: 'Editorial approval',
      detail: pub.publishedStatus === 'APPROVED' || pub.publishedStatus === 'PUBLISHED'
        ? 'Approved for release'
        : 'Pending approval below'
    },
  ] : [];

  const allGatesPass = gates.every(g => g.pass);
  const canApprove = pub && ['DRAFT', 'IN_REVIEW'].includes(pub.publishedStatus);
  const canPublish = pub && ['APPROVED', 'SCHEDULED'].includes(pub.publishedStatus) && allGatesPass;
  const isPublished = pub?.publishedStatus === 'PUBLISHED';

  const handleApprove = async () => {
    setApproving(true);
    try {
      await api.patch(`/publications/${publicationId}/approve`, {
        approval_notes: approvalNotes || 'All validation checks passed. Approved for public release.',
        publication_version: 'v1.0',
        readiness_score: Math.round((gates.filter(g => g.pass).length / gates.length) * 100)
      });
      toast.success('Publication approved for release');
      loadData(publicationId);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Approval failed');
    } finally {
      setApproving(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('This will make the publication publicly accessible. Proceed?')) return;
    setPublishing(true);
    try {
      await api.patch(`/publications/${publicationId}/publish`, {
        publication_version: 'v1.0',
        access_tier: pub.accessType,
        visibility: pub.isPublic ? 'Public' : 'Private'
      });
      toast.success('Publication is now live!');
      loadData(publicationId);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-teal-500 text-3xl" />
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Publication Release</h2>
          <p className="text-xs text-gray-500 mt-1">Manage approval gates, access tiers, and release this publication.</p>
        </div>
        {pub?.publishedStatus && (
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${STATUS_COLORS[pub.publishedStatus] || 'bg-stone-100 text-stone-500'}`}>
            {pub.publishedStatus.replace('_', ' ')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Gate Checklist */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <FaLock size={12} className="text-stone-400" /> Release Gate Checklist
          </h3>
          <div className="space-y-2">
            {gates.map((gate, i) => (
              <GateItem key={i} pass={gate.pass} label={gate.label} detail={gate.detail} />
            ))}
          </div>
          {allGatesPass && !isPublished && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" size={14} />
              <p className="text-[11px] font-bold text-emerald-700">All gates pass — ready to publish</p>
            </div>
          )}
          {isPublished && (
            <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2">
              <FaGlobe className="text-teal-500" size={14} />
              <p className="text-[11px] font-bold text-teal-700">This publication is live and publicly accessible</p>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          {/* Approve */}
          {!isPublished && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                  <FaCheckCircle size={14} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Editorial Approval</h3>
                  <p className="text-[10px] text-gray-400">Mark as approved for public release</p>
                </div>
              </div>
              <textarea
                value={approvalNotes}
                onChange={e => setApprovalNotes(e.target.value)}
                placeholder="Approval notes (optional)…"
                rows={2}
                disabled={!canApprove}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg mb-3 focus:outline-none focus:border-amber-400 resize-none disabled:bg-stone-50 disabled:text-stone-400"
              />
              <button
                onClick={handleApprove}
                disabled={!canApprove || approving}
                className="w-full py-2.5 bg-amber-500 text-white text-[11px] font-black rounded-xl hover:bg-amber-600 transition-all disabled:bg-stone-100 disabled:text-stone-400 flex items-center justify-center gap-2"
              >
                {approving ? <FaSpinner className="animate-spin" size={12} /> : <FaCheckCircle size={12} />}
                {canApprove ? 'Approve Publication' : pub?.publishedStatus === 'APPROVED' ? 'Already Approved' : `Status: ${pub?.publishedStatus}`}
              </button>
            </div>
          )}

          {/* Publish */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-50 rounded-xl flex items-center justify-center">
                <FaBookOpen size={14} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Publish to Web Reader</h3>
                <p className="text-[10px] text-gray-400">Make live on the Open Knowledge Reader</p>
              </div>
            </div>
            <button
              onClick={handlePublish}
              disabled={!canPublish || publishing || isPublished}
              className="w-full py-2.5 bg-teal-600 text-white text-[11px] font-black rounded-xl hover:bg-teal-700 transition-all disabled:bg-stone-100 disabled:text-stone-400 flex items-center justify-center gap-2"
            >
              {publishing ? <FaSpinner className="animate-spin" size={12} /> : <FaUpload size={12} />}
              {isPublished ? 'Already Published' : canPublish ? 'Publish Now' : 'Complete gates above first'}
            </button>
          </div>

          {/* PDF */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm opacity-60">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                <FaFilePdf size={14} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">PDF Distribution</h3>
                <p className="text-[10px] text-gray-400">Export print-ready PDF (coming soon)</p>
              </div>
            </div>
            <button disabled className="w-full py-2 bg-stone-100 text-stone-400 text-[10px] font-bold rounded-lg">
              Generate PDF
            </button>
          </div>
        </div>
      </div>

      {/* Release History */}
      {releaseHistory.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2">
            <FaHistory size={11} className="text-stone-400" />
            <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-wider">Release History</h3>
          </div>
          <div className="divide-y divide-stone-100">
            {[...releaseHistory].reverse().map((event: any, i: number) => (
              <div key={i} className="px-6 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-gray-900">{event.action}</p>
                  {event.notes && <p className="text-[10px] text-gray-400 mt-0.5 italic">{event.notes}</p>}
                  {event.version && <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded mt-1 inline-block">{event.version}</span>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] text-gray-400">{new Date(event.at).toLocaleDateString()}</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-0.5">{event.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
