"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUsers, FaUserPlus, FaFileAlt, FaHistory, FaSpinner,
  FaExclamationCircle, FaSearch, FaCheck, FaTimes, FaChevronDown,
  FaCheckCircle, FaClock, FaTimesCircle
} from 'react-icons/fa';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string }> = {
  ACCEPT: { label: 'Accept', color: 'bg-emerald-100 text-emerald-700' },
  MINOR_REVISION: { label: 'Minor Revision', color: 'bg-amber-100 text-amber-700' },
  MAJOR_REVISION: { label: 'Major Revision', color: 'bg-orange-100 text-orange-700' },
  REJECT: { label: 'Reject', color: 'bg-red-100 text-red-700' },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <FaClock className="text-amber-400" size={10} />,
  IN_PROGRESS: <FaSpinner className="text-blue-400" size={10} />,
  COMPLETED: <FaCheckCircle className="text-emerald-500" size={10} />,
  DECLINED: <FaTimesCircle className="text-red-400" size={10} />,
};

function AuditLogDrawer({ publicationId, onClose }: { publicationId: string; onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/publications/${publicationId}/audit-log`)
      .then(res => setLogs(res.data?.data ?? []))
      .catch(() => toast.error('Failed to load audit log'))
      .finally(() => setLoading(false));
  }, [publicationId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <FaHistory size={12} className="text-purple-500" /> Editorial Decision Log
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400">
            <FaTimes size={12} />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <FaSpinner className="animate-spin text-purple-500 text-xl" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No audit events recorded yet.</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {logs.map((log: any) => (
              <div key={log.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{log.action.replace(/_/g, ' ')}</p>
                    {log.chapter && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Ch. {log.chapter.order}: {log.chapter.title}
                      </p>
                    )}
                    {log.details && <p className="text-[10px] text-gray-400 mt-1 italic">{log.details}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[9px] text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    {log.user && <p className="text-[9px] text-purple-600 font-bold mt-0.5">{log.user.name}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignReviewerModal({
  chapterId, onClose, onAssigned
}: { chapterId: string; onClose: () => void; onAssigned: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PRIMARY_REVIEWER');
  const [blindType, setBlindType] = useState('OPEN');
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users').then(res => {
      const data = res.data?.data ?? res.data;
      setUsers(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const filtered = email.length > 1
    ? users.filter(u => u.name?.toLowerCase().includes(email.toLowerCase()) || u.email?.toLowerCase().includes(email.toLowerCase()))
    : [];

  const handleAssign = async (userId: string) => {
    setSaving(true);
    try {
      await api.post(`/publications/chapters/${chapterId}/reviews`, { reviewerId: userId, role, blindType });
      toast.success('Reviewer assigned successfully');
      onAssigned();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to assign reviewer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-black text-gray-900 mb-4">Assign Reviewer</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Search user</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Name or email…"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-purple-400"
            />
            {filtered.length > 0 && (
              <div className="mt-1 border border-stone-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                {filtered.slice(0, 8).map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleAssign(u.id)}
                    disabled={saving}
                    className="w-full text-left px-3 py-2.5 text-xs hover:bg-purple-50 border-b border-stone-100 last:border-0 flex items-center justify-between"
                  >
                    <span>
                      <span className="font-bold text-gray-900">{u.name}</span>
                      <span className="text-gray-400 ml-2">{u.email}</span>
                    </span>
                    <span className="text-[9px] text-purple-500 font-bold">{u.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full text-xs border border-stone-200 rounded-lg px-2 py-2 focus:outline-none">
                <option value="PRIMARY_REVIEWER">Primary Reviewer</option>
                <option value="SECONDARY_REVIEWER">Secondary Reviewer</option>
                <option value="SUBJECT_EXPERT">Subject Expert</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Review Type</label>
              <select value={blindType} onChange={e => setBlindType(e.target.value)} className="w-full text-xs border border-stone-200 rounded-lg px-2 py-2 focus:outline-none">
                <option value="OPEN">Open Review</option>
                <option value="SINGLE_BLIND">Single Blind</option>
                <option value="DOUBLE_BLIND">Double Blind</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 border border-stone-200 text-xs font-bold text-gray-500 rounded-lg hover:bg-stone-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewWorkspace({ params }: { params: any }) {
  const [publicationId, setPublicationId] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [assigningChapterId, setAssigningChapterId] = useState<string | null>(null);

  const fetchReviews = useCallback((pubId: string) => {
    setLoading(true);
    api.get(`/publications/${pubId}/reviews`)
      .then(res => setChapters(res.data?.data ?? []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load review data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Promise.resolve(params).then((p: any) => {
      setPublicationId(p.id);
      fetchReviews(p.id);
    });
  }, [params, fetchReviews]);

  const filteredChapters = chapters.filter(ch =>
    !search ||
    ch.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="animate-spin text-purple-500 text-3xl" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-3">
      <FaExclamationCircle className="text-red-400 text-2xl" />
      <p className="text-gray-400 text-sm">{error}</p>
    </div>
  );

  return (
    <>
      {showAuditLog && publicationId && (
        <AuditLogDrawer publicationId={publicationId} onClose={() => setShowAuditLog(false)} />
      )}
      {assigningChapterId && (
        <AssignReviewerModal
          chapterId={assigningChapterId}
          onClose={() => setAssigningChapterId(null)}
          onAssigned={() => fetchReviews(publicationId)}
        />
      )}

      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">Peer Review & Editorial Workflow</h2>
            <p className="text-xs text-gray-500 mt-1">
              Assign reviewers, track chapter-level scores, and record final editorial decisions.
            </p>
          </div>
          <button
            onClick={() => setShowAuditLog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-700 shadow-sm shadow-purple-600/20"
          >
            <FaFileAlt size={11} /> View Decision Log
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {chapters.length} Chapter{chapters.length !== 1 ? 's' : ''} under review
            </span>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={10} />
              <input
                type="text"
                placeholder="Search chapters…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs w-56 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-stone-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
            <div className="col-span-4">Chapter</div>
            <div className="col-span-3">Reviewers Assigned</div>
            <div className="col-span-2 text-center">Avg Score</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Assign</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-stone-100">
            {filteredChapters.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                {search ? `No chapters matching "${search}"` : 'No chapters available for review.'}
              </div>
            ) : filteredChapters.map(ch => {
              const dominantStatus = ch.reviews.some((r: any) => r.status === 'COMPLETED')
                ? 'COMPLETED'
                : ch.reviews.some((r: any) => r.status === 'IN_PROGRESS')
                ? 'IN_PROGRESS'
                : ch.reviews.length > 0 ? 'PENDING' : 'UNASSIGNED';

              return (
                <div key={ch.chapterId} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-stone-50/50 transition-colors">
                  <div className="col-span-4 pr-4">
                    <span className="text-[9px] font-black text-stone-400 mb-0.5 block">Chapter {ch.order}</span>
                    <p className="text-xs font-bold text-gray-900 leading-tight">{ch.title}</p>
                  </div>

                  <div className="col-span-3 flex -space-x-2 items-center">
                    {ch.reviews.length === 0 ? (
                      <span className="text-[10px] text-stone-300 italic">Unassigned</span>
                    ) : (
                      ch.reviews.slice(0, 3).map((r: any) => {
                        const initials = (r.reviewer?.name || '??').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                        const colors = ['bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700', 'bg-teal-100 text-teal-700'];
                        const colorIdx = ch.reviews.indexOf(r) % colors.length;
                        return (
                          <div
                            key={r.reviewId}
                            className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black ${colors[colorIdx]}`}
                            title={`${r.reviewer?.name || 'Reviewer'} (${r.role.replace(/_/g, ' ')})`}
                          >
                            {initials}
                          </div>
                        );
                      })
                    )}
                    {ch.reviews.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[9px] font-black text-stone-500">
                        +{ch.reviews.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    {ch.avgScore !== null ? (
                      <div className="text-center">
                        <span className="text-xs font-black text-emerald-600">{ch.avgScore}</span>
                        <span className="text-[10px] text-gray-400">/10</span>
                        <p className="text-[8px] text-gray-400 mt-0.5">{ch.reviews.length} reviewer{ch.reviews.length !== 1 ? 's' : ''}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-stone-300 italic">Pending</span>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    {ch.reviews.length > 0 && ch.reviews[0].recommendation ? (
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${RECOMMENDATION_LABELS[ch.reviews[0].recommendation]?.color || 'bg-stone-100 text-stone-500'}`}>
                        {RECOMMENDATION_LABELS[ch.reviews[0].recommendation]?.label || ch.reviews[0].recommendation}
                      </span>
                    ) : (
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 ${
                        dominantStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                        dominantStatus === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                        dominantStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        'bg-stone-100 text-stone-400'
                      }`}>
                        {STATUS_ICONS[dominantStatus] || null}
                        {dominantStatus.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => setAssigningChapterId(ch.chapterId)}
                      className="p-2 text-stone-400 hover:text-purple-600 bg-white border border-stone-200 rounded shadow-sm transition-colors"
                      title="Assign Reviewer"
                    >
                      <FaUserPlus size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
