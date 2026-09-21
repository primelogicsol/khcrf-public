'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,
  FaExclamationTriangle, FaDownload, FaFilePdf, FaImage,
  FaFileVideo, FaFileAlt, FaGlobe, FaEye
} from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

const MediaIcon = FaImage;

interface MediaItem {
  id: string;
  title: string;
  type?: string;
  category?: string;
  status?: string;
  url?: string;
  description?: string;
  tags?: string[];
  fileSize?: number;
  mimeType?: string;
  altText?: string;
  caption?: string;
  credit?: string;
  publishedAt?: string;
  createdAt?: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView] = useState<'LIST' | 'FORM' | 'GRID'>('GRID');
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/skc/media');
      setItems(normalizeArray<MediaItem>(res.data));
    } catch (err: any) {
      setItems([]);
      if (!err.message?.includes('404')) {
        setError(err.message || 'Failed to fetch media');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    try {
      await api.delete(`/api/skc/media/${id}`);
      fetchMedia();
    } catch (err: any) {
      alert('Failed to delete media: ' + err.message);
    }
  };

  const filtered = items.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      m.title.toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      (m.caption || '').toLowerCase().includes(q);
    const matchType = !filterType || m.type === filterType;
    const matchCat = !filterCategory || m.category === filterCategory;
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchType && matchCat && matchStatus;
  });

  const uniqueTypes = Array.from(new Set(items.map(m => m.type).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(items.map(m => m.category).filter(Boolean)));
  const publishedCount = items.filter(m => m.status === 'PUBLISHED').length;

  const getTypeIcon = (type?: string) => {
    if (!type) return <FaFileAlt className="text-gray-400" />;
    if (type.includes('image') || type === 'IMAGE') return <FaImage className="text-blue-500" />;
    if (type.includes('video') || type === 'VIDEO') return <FaFileVideo className="text-purple-500" />;
    if (type.includes('pdf') || type === 'DOCUMENT') return <FaFilePdf className="text-red-500" />;
    return <FaGlobe className="text-green-500" />;
  };

  const handleExport = () => {
    const headers = ['Title', 'Type', 'Category', 'Status', 'URL', 'Caption', 'Credit', 'Published At'];
    const rows = filtered.map(m => [m.title, m.type || '', m.category || '', m.status || '', m.url || '', m.caption || '', m.credit || '', m.publishedAt || '']);
    exportToCsv(`skc-media-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    logExportAudit('Media', 'CSV', filtered.length);
  };

  if (view === 'FORM') {
    return (
      <MediaForm
        item={selected}
        onCancel={() => { setView('GRID'); setSelected(null); }}
        onSave={() => { setView('GRID'); setSelected(null); fetchMedia(); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <MediaIcon data-ui-icon  className="" /> Media Management
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 — Media Library & Assets</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            <button onClick={() => setView('GRID')} className={`px-3 py-1.5 rounded text-xs font-bold transition ${view === 'GRID' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Grid</button>
            <button onClick={() => setView('LIST')} className={`px-3 py-1.5 rounded text-xs font-bold transition ${view === 'LIST' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>List</button>
          </div>
          <button onClick={handleExport} disabled={filtered.length === 0} className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50">
            <FaDownload /> Export
          </button>
          <button onClick={() => { setSelected(null); setView('FORM'); }} className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm">
            <FaPlus /> Add Media
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading media</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Items</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : items.length}</div>
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
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Media Types</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : uniqueTypes.length}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by title, description, category, or caption…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Types</option>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
            <option value="LINK">Web Link</option>
            {uniqueTypes.filter(t => !['IMAGE', 'VIDEO', 'DOCUMENT', 'LINK'].includes(t!)).map(t => <option key={t} value={t!}>{t}</option>)}
          </select>
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

      {/* Content */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 font-bold">
          <FaSpinner className="animate-spin inline mr-2" />Loading media library…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
          <MediaIcon className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">{items.length === 0 ? 'No media items yet. Click "Add Media" to upload the first item.' : 'No items match the current filters.'}</p>
        </div>
      ) : view === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition group">
              {/* Thumbnail */}
              <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                {m.url && (m.type === 'IMAGE' || (m.mimeType || '').includes('image')) ? (
                  <img src={m.url} alt={m.altText || m.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="text-5xl opacity-50">{getTypeIcon(m.type)}</div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                  {m.url && (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/90 text-gray-700 rounded-lg shadow text-xs hover:bg-brand-primary hover:text-white transition">
                      <FaEye />
                    </a>
                  )}
                  <button onClick={() => { setSelected(m); setView('FORM'); }} className="p-1.5 bg-white/90 text-blue-600 rounded-lg shadow text-xs hover:bg-blue-600 hover:text-white transition"><FaEdit /></button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-white/90 text-red-600 rounded-lg shadow text-xs hover:bg-red-600 hover:text-white transition"><FaTrash /></button>
                </div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-900 text-sm truncate">{m.title}</div>
                {m.caption && <div className="text-xs text-gray-500 mt-1 truncate">{m.caption}</div>}
                <div className="flex items-center gap-2 mt-2">
                  {m.category && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded uppercase">{m.category}</span>}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${m.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : m.status === 'ARCHIVED' ? 'bg-gray-200 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>{m.status || 'DRAFT'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Media Item</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-brand-primary/5 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{getTypeIcon(m.type)}</div>
                        <div>
                          <div className="font-bold text-gray-900">{m.title}</div>
                          {m.caption && <div className="text-xs text-gray-500">{m.caption}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{m.type || '—'}</td>
                    <td className="p-4 text-gray-600">{m.category || '—'}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${m.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : m.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{m.status || 'DRAFT'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {m.url && <a href={m.url} target="_blank" rel="noopener noreferrer" className="p-2 text-icon-on-light hover:text-white hover:bg-brand-primary border border-brand-primary/20 rounded-lg transition" title="View"><FaEye /></a>}
                        <button onClick={() => { setSelected(m); setView('FORM'); }} className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition" title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition" title="Delete"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 font-bold">
            Showing {filtered.length} of {items.length} media items
          </div>
        </div>
      )}
    </div>
  );
}

function MediaForm({ item, onCancel, onSave }: { item: MediaItem | null; onCancel: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    type: item?.type || 'IMAGE',
    category: item?.category || '',
    status: item?.status || 'DRAFT',
    url: item?.url || '',
    description: item?.description || '',
    altText: item?.altText || '',
    caption: item?.caption || '',
    credit: item?.credit || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (item?.id) {
        await api.put(`/api/skc/media/${item.id}`, formData);
      } else {
        await api.post('/api/skc/media', formData);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save media: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200 transition">← Back</button>
        <h2 className="text-2xl font-black text-brand-dark">{item ? 'Edit Media Item' : 'Add Media Item'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Title *</label>
          <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Type</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="DOCUMENT">Document</option>
              <option value="LINK">Web Link</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Category</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Crafts, Events" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">URL / Source</label>
          <input type="url" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="https://…" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Description</label>
          <textarea rows={3} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Alt Text</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Accessibility description" value={formData.altText} onChange={e => setFormData({ ...formData, altText: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Credit / Attribution</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Photographer or source" value={formData.credit} onChange={e => setFormData({ ...formData, credit: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Caption</label>
          <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Short display caption" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} />
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : item ? 'Update Media' : 'Add Media'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
