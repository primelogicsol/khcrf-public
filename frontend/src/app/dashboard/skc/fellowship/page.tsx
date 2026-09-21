'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaGraduationCap, FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,
  FaExclamationTriangle, FaDownload, FaMapMarkerAlt, FaCalendar,
  FaUserCheck, FaHammer
} from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

interface FellowshipRecord {
  id: string;
  name: string;
  fellowshipType?: string;
  craft?: string;
  district?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  organization?: string;
  email?: string;
  phone?: string;
  description?: string;
  stipend?: number;
  mentor?: string;
  outcomes?: string;
  createdAt?: string;
}

export default function FellowshipPage() {
  const [fellows, setFellows] = useState<FellowshipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selected, setSelected] = useState<FellowshipRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const fetchFellows = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/skc/fellowship');
      setFellows(normalizeArray<FellowshipRecord>(res.data));
    } catch (err: any) {
      setFellows([]);
      if (!err.message?.includes('404')) {
        setError(err.message || 'Failed to fetch fellowship data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFellows(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fellowship record?')) return;
    try {
      await api.delete(`/api/skc/fellowship/${id}`);
      fetchFellows();
    } catch (err: any) {
      alert('Failed to delete record: ' + err.message);
    }
  };

  const tabFiltered = fellows.filter(f => {
    if (activeTab === 'active') return f.status === 'ACTIVE';
    if (activeTab === 'completed') return f.status === 'COMPLETED';
    return true;
  });

  const filtered = tabFiltered.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      f.name.toLowerCase().includes(q) ||
      (f.craft || '').toLowerCase().includes(q) ||
      (f.district || '').toLowerCase().includes(q) ||
      (f.organization || '').toLowerCase().includes(q) ||
      (f.mentor || '').toLowerCase().includes(q);
    const matchType = !filterType || f.fellowshipType === filterType;
    const matchStatus = !filterStatus || f.status === filterStatus;
    const matchDistrict = !filterDistrict || f.district === filterDistrict;
    return matchSearch && matchType && matchStatus && matchDistrict;
  });

  const uniqueTypes = Array.from(new Set(fellows.map(f => f.fellowshipType).filter(Boolean)));
  const uniqueDistricts = Array.from(new Set(fellows.map(f => f.district).filter(Boolean)));
  const activeCount = fellows.filter(f => f.status === 'ACTIVE').length;
  const completedCount = fellows.filter(f => f.status === 'COMPLETED').length;
  const uniqueCrafts = new Set(fellows.map(f => f.craft).filter(Boolean)).size;

  const handleExport = () => {
    const headers = ['Name', 'Fellowship Type', 'Craft', 'District', 'Organization', 'Status', 'Start Date', 'End Date', 'Mentor'];
    const rows = filtered.map(f => [f.name, f.fellowshipType || '', f.craft || '', f.district || '', f.organization || '', f.status || '', f.startDate || '', f.endDate || '', f.mentor || '']);
    exportToCsv(`skc-fellowship-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    logExportAudit('Fellowship', 'CSV', filtered.length);
  };

  if (view === 'FORM') {
    return (
      <FellowshipForm
        fellow={selected}
        onCancel={() => { setView('LIST'); setSelected(null); }}
        onSave={() => { setView('LIST'); setSelected(null); fetchFellows(); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaGraduationCap data-ui-icon  className="" /> Fellowship Management
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 — Craft Fellowship & Residency Programs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} disabled={filtered.length === 0} className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50">
            <FaDownload /> Export CSV
          </button>
          <button onClick={() => { setSelected(null); setView('FORM'); }} className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm">
            <FaPlus /> Add Fellow
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading fellowship data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Fellows</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : fellows.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Active Programs</div>
          <div className="text-3xl font-black text-green-600">{loading ? '-' : activeCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Completed</div>
          <div className="text-3xl font-black text-gray-900">{loading ? '-' : completedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Crafts Covered</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : uniqueCrafts}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-1">
        {[
          { key: 'all', label: `All (${fellows.length})` },
          { key: 'active', label: `Active (${activeCount})` },
          { key: 'completed', label: `Completed (${completedCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition ${activeTab === tab.key ? 'bg-white border border-b-white border-gray-200 text-brand-primary -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, craft, district, organization, or mentor…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Types</option>
            {uniqueTypes.map(t => <option key={t} value={t!}>{t}</option>)}
          </select>
          <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Districts</option>
            {uniqueDistricts.map(d => <option key={d} value={d!}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="DRAFT">Draft</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">Fellow</th>
                <th className="p-4">Craft & Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold"><FaSpinner className="animate-spin inline mr-2" />Loading fellowship records…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                  {fellows.length === 0 ? 'No fellowship records yet. Click "Add Fellow" to get started.' : 'No records match the current filters.'}
                </td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className="hover:bg-brand-primary/5 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2"><FaUserCheck data-ui-icon  className="" /> {f.name}</div>
                    {f.organization && <div className="text-xs text-gray-500 mt-1">{f.organization}</div>}
                    {f.email && <div className="text-[10px] text-gray-400">{f.email}</div>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700"><FaHammer className="text-gray-400 text-xs" /> {f.craft || '—'}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><FaMapMarkerAlt className="text-gray-400 text-[10px]" /> {f.district || '—'}</div>
                  </td>
                  <td className="p-4">
                    {f.fellowshipType ? (
                      <span className="text-[10px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20 uppercase">{f.fellowshipType}</span>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="p-4 text-gray-600 text-xs">
                    {f.startDate && (
                      <div className="flex items-center gap-1"><FaCalendar className="text-gray-400 text-[10px]" /> {new Date(f.startDate).toLocaleDateString()}</div>
                    )}
                    {f.endDate && (
                      <div className="text-gray-400 mt-0.5">→ {new Date(f.endDate).toLocaleDateString()}</div>
                    )}
                    {!f.startDate && '—'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${f.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : f.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' : f.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {f.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelected(f); setView('FORM'); }} className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(f.id)} className="p-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition" title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 font-bold">
          Showing {filtered.length} of {fellows.length} fellowship records
        </div>
      </div>
    </div>
  );
}

function FellowshipForm({ fellow, onCancel, onSave }: { fellow: FellowshipRecord | null; onCancel: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: fellow?.name || '',
    fellowshipType: fellow?.fellowshipType || 'RESEARCH',
    craft: fellow?.craft || '',
    district: fellow?.district || '',
    status: fellow?.status || 'DRAFT',
    startDate: fellow?.startDate ? new Date(fellow.startDate).toISOString().slice(0, 10) : '',
    endDate: fellow?.endDate ? new Date(fellow.endDate).toISOString().slice(0, 10) : '',
    organization: fellow?.organization || '',
    email: fellow?.email || '',
    phone: fellow?.phone || '',
    mentor: fellow?.mentor || '',
    description: fellow?.description || '',
    outcomes: fellow?.outcomes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (fellow?.id) {
        await api.put(`/api/skc/fellowship/${fellow.id}`, formData);
      } else {
        await api.post('/api/skc/fellowship', formData);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200 transition">← Back</button>
        <h2 className="text-2xl font-black text-brand-dark">{fellow ? 'Edit Fellowship Record' : 'Add Fellowship Record'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Fellow Name *</label>
          <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Fellowship Type</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.fellowshipType} onChange={e => setFormData({ ...formData, fellowshipType: e.target.value })}>
              <option value="RESEARCH">Research Fellowship</option>
              <option value="ARTISAN">Artisan Residency</option>
              <option value="POLICY">Policy Fellowship</option>
              <option value="DOCUMENTATION">Documentation Fellow</option>
              <option value="MENTORSHIP">Mentorship Program</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Craft Specialization</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Pashmina Weaving" value={formData.craft} onChange={e => setFormData({ ...formData, craft: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">District</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Srinagar" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Start Date</label>
            <input type="date" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">End Date</label>
            <input type="date" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Host Organization</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Mentor</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Mentor name" value={formData.mentor} onChange={e => setFormData({ ...formData, mentor: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Email</label>
            <input type="email" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Phone</label>
            <input type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Description</label>
          <textarea rows={3} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Fellowship objectives and scope" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Outcomes</label>
          <textarea rows={2} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Key deliverables or achieved outcomes" value={formData.outcomes} onChange={e => setFormData({ ...formData, outcomes: e.target.value })} />
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : fellow ? 'Update Record' : 'Add Fellow'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
