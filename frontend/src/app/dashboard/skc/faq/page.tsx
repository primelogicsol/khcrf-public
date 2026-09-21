'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaQuestionCircle, FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,
  FaExclamationTriangle, FaDownload, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  status?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selected, setSelected] = useState<FaqItem | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/skc/faq');
      setFaqs(normalizeArray<FaqItem>(res.data));
    } catch (err: any) {
      // Graceful fallback: faq endpoint may not exist yet
      setFaqs([]);
      if (!err.message?.includes('404')) {
        setError(err.message || 'Failed to fetch FAQs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/api/skc/faq/${id}`);
      fetchFaqs();
    } catch (err: any) {
      alert('Failed to delete FAQ: ' + err.message);
    }
  };

  const filtered = faqs.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      (f.category || '').toLowerCase().includes(q);
    const matchCat = !filterCategory || f.category === filterCategory;
    const matchStatus = !filterStatus || f.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const uniqueCategories = Array.from(new Set(faqs.map(f => f.category).filter(Boolean)));
  const publishedCount = faqs.filter(f => f.status === 'PUBLISHED').length;

  const handleExport = () => {
    const headers = ['Question', 'Answer', 'Category', 'Status', 'Sort Order'];
    const rows = filtered.map(f => [f.question, f.answer, f.category || '', f.status || '', f.sortOrder ?? '']);
    exportToCsv(`skc-faq-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    logExportAudit('FAQ', 'CSV', filtered.length);
  };

  if (view === 'FORM') {
    return (
      <FaqForm
        faq={selected}
        onCancel={() => { setView('LIST'); setSelected(null); }}
        onSave={() => { setView('LIST'); setSelected(null); fetchFaqs(); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaQuestionCircle data-ui-icon  className="" /> FAQ Management
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 — Frequently Asked Questions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <FaDownload /> Export CSV
          </button>
          <button
            onClick={() => { setSelected(null); setView('FORM'); }}
            className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm"
          >
            <FaPlus /> Add FAQ
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading FAQs</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total FAQs</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : faqs.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Published</div>
          <div className="text-3xl font-black text-green-600">{loading ? '-' : publishedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</div>
          <div className="text-3xl font-black text-gray-900">{loading ? '-' : uniqueCategories.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Filtered</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : filtered.length}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions, answers, or categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Categories</option>
            {uniqueCategories.map(c => <option key={c} value={c!}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* FAQ Accordion List */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 font-bold">
          <FaSpinner className="animate-spin inline mr-2" />Loading FAQs…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 font-bold">
          {faqs.length === 0 ? 'No FAQs created yet. Click "Add FAQ" to get started.' : 'No FAQs match the current filters.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(faq => (
            <div key={faq.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{faq.question}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {faq.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20 uppercase">
                          {faq.category}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${faq.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : faq.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {faq.status || 'DRAFT'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(faq); setView('FORM'); }}
                    className="p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition text-xs"
                    title="Edit"
                  ><FaEdit /></button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(faq.id); }}
                    className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition text-xs"
                    title="Delete"
                  ><FaTrash /></button>
                  {expandedId === faq.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                </div>
              </button>
              {expandedId === faq.id && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-700 leading-relaxed pt-3 whitespace-pre-wrap">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqForm({ faq, onCancel, onSave }: { faq: FaqItem | null; onCancel: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || '',
    status: faq?.status || 'DRAFT',
    sortOrder: faq?.sortOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (faq?.id) {
        await api.put(`/api/skc/faq/${faq.id}`, formData);
      } else {
        await api.post('/api/skc/faq', formData);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save FAQ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200 transition">← Back</button>
        <h2 className="text-2xl font-black text-brand-dark">{faq ? 'Edit FAQ' : 'Add FAQ'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Question *</label>
          <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Enter the frequently asked question" value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} />
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Answer *</label>
          <textarea required rows={6} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Provide a detailed, helpful answer" value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Category</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. General, Process" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Sort Order</label>
            <input type="number" min={0} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : faq ? 'Update FAQ' : 'Create FAQ'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
