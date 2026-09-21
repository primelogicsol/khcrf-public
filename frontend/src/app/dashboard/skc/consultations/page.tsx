'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaComments, FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,
  FaExclamationTriangle, FaDownload, FaMapMarkerAlt, FaCalendar,
  FaHammer, FaEye, FaCheckCircle, FaUserTie
} from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

interface ConsultationRecord {
  id: string;
  title?: string;
  participantName?: string;
  participantType?: string;
  craft?: string;
  district?: string;
  status?: string;
  type?: string;
  date?: string;
  venue?: string;
  summary?: string;
  outcomes?: string;
  facilitator?: string;
  attendeeCount?: number;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

export default function ConsultationsPage() {
  const [records, setRecords] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterCraft, setFilterCraft] = useState('');
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selected, setSelected] = useState<ConsultationRecord | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try dedicated SKC consultation endpoint first, fallback to shared consultation
      try {
        const res = await api.get('/api/skc/consultations');
        setRecords(normalizeArray<ConsultationRecord>(res.data));
      } catch {
        const res = await api.get('/api/consultation');
        const raw = normalizeArray<any>(res.data);
        // Map generic consultation shape to our interface
        setRecords(raw.map((r: any) => ({
          id: r.id,
          title: r.title || r.consultationId || `Consultation ${r.id?.slice(0, 6)}`,
          participantName: r.participantProfile?.name || r.name || 'Unknown',
          participantType: r.participantProfile?.type || r.participantType,
          craft: r.participantProfile?.craftType || r.craft,
          district: r.participantProfile?.district || r.district,
          status: r.status || 'SUBMITTED',
          type: r.type || 'FIELD',
          date: r.createdAt,
          createdAt: r.createdAt,
        })));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation record?')) return;
    try {
      await api.delete(`/api/skc/consultations/${id}`);
      fetchRecords();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (r.title || '').toLowerCase().includes(q) ||
      (r.participantName || '').toLowerCase().includes(q) ||
      (r.district || '').toLowerCase().includes(q) ||
      (r.craft || '').toLowerCase().includes(q) ||
      (r.facilitator || '').toLowerCase().includes(q) ||
      (r.summary || '').toLowerCase().includes(q);
    const matchType = !filterType || r.type === filterType;
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchDistrict = !filterDistrict || r.district === filterDistrict;
    const matchCraft = !filterCraft || r.craft === filterCraft;
    return matchSearch && matchType && matchStatus && matchDistrict && matchCraft;
  });

  const uniqueTypes = Array.from(new Set(records.map(r => r.type).filter(Boolean)));
  const uniqueDistricts = Array.from(new Set(records.map(r => r.district).filter(Boolean)));
  const uniqueCrafts = Array.from(new Set(records.map(r => r.craft).filter(Boolean)));
  const verifiedCount = records.filter(r => r.status === 'VERIFIED').length;
  const submittedCount = records.filter(r => r.status === 'SUBMITTED').length;
  const uniqueDistrictCount = uniqueDistricts.length;

  const handleExport = () => {
    const headers = ['Title', 'Participant', 'Type', 'Craft', 'District', 'Status', 'Date', 'Facilitator', 'Attendees'];
    const rows = filtered.map(r => [r.title || '', r.participantName || '', r.type || '', r.craft || '', r.district || '', r.status || '', r.date ? new Date(r.date).toLocaleDateString() : '', r.facilitator || '', r.attendeeCount ?? '']);
    exportToCsv(`skc-consultations-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    logExportAudit('Consultations', 'CSV', filtered.length);
  };

  if (view === 'FORM') {
    return (
      <ConsultationForm
        record={selected}
        onCancel={() => { setView('LIST'); setSelected(null); }}
        onSave={() => { setView('LIST'); setSelected(null); fetchRecords(); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaComments data-ui-icon  className="" /> Consultations Registry
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 — Consultation Sessions & Field Records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} disabled={filtered.length === 0} className="px-4 py-2 bg-white text-gray-700 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50">
            <FaDownload /> Export CSV
          </button>
          <button onClick={() => { setSelected(null); setView('FORM'); }} className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition text-sm flex items-center gap-2 shadow-sm">
            <FaPlus /> New Consultation
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading consultations</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Sessions</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : records.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Verified</div>
          <div className="text-3xl font-black text-green-600">{loading ? '-' : verifiedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pending Review</div>
          <div className="text-3xl font-black text-amber-600">{loading ? '-' : submittedCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Districts Covered</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : uniqueDistrictCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by title, participant, district, craft, or facilitator…" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Types</option>
            <option value="FIELD">Field Consultation</option>
            <option value="VIRTUAL">Virtual Session</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="FOCUS_GROUP">Focus Group</option>
            {uniqueTypes.filter(t => !['FIELD', 'VIRTUAL', 'WORKSHOP', 'FOCUS_GROUP'].includes(t!)).map(t => <option key={t} value={t!}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="VERIFIED">Verified</option>
            <option value="FLAGGED">Flagged</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Districts</option>
            {uniqueDistricts.map(d => <option key={d} value={d!}>{d}</option>)}
          </select>
          <select value={filterCraft} onChange={e => setFilterCraft(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
            <option value="">All Crafts</option>
            {uniqueCrafts.map(c => <option key={c} value={c!}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs font-black text-gray-500 uppercase tracking-wider">
                <th className="p-4">Consultation</th>
                <th className="p-4">Participant</th>
                <th className="p-4">Location & Craft</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-bold"><FaSpinner className="animate-spin inline mr-2" />Loading consultations…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center">
                  <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">{records.length === 0 ? 'No consultation records yet. Click "New Consultation" to get started.' : 'No records match the current filters.'}</p>
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-brand-primary/5 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 max-w-[200px] truncate" title={r.title}>{r.title || '—'}</div>
                    {r.summary && <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">{r.summary}</div>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-gray-800"><FaUserTie data-ui-icon  className=" text-xs" /> {r.participantName || '—'}</div>
                    {r.participantType && <div className="text-[10px] uppercase font-bold text-gray-500 mt-1 px-1.5 py-0.5 bg-gray-100 rounded inline-block">{r.participantType}</div>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700"><FaMapMarkerAlt className="text-gray-400 text-[10px]" /> {r.district || '—'}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><FaHammer className="text-gray-400 text-[10px]" /> {r.craft || '—'}</div>
                  </td>
                  <td className="p-4">
                    {r.type ? (
                      <span className="text-[10px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20 uppercase">{r.type.replace(/_/g, ' ')}</span>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="p-4 text-gray-600 text-xs">
                    {r.date ? (
                      <div className="flex items-center gap-1"><FaCalendar className="text-gray-400 text-[10px]" /> {new Date(r.date).toLocaleDateString()}</div>
                    ) : '—'}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      r.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-200' :
                      r.status === 'FLAGGED' ? 'bg-red-50 text-red-700 border-red-200' :
                      r.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>{r.status || 'SUBMITTED'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelected(r); setView('FORM'); }} className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition" title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 font-bold">
          Showing {filtered.length} of {records.length} consultation records
        </div>
      </div>
    </div>
  );
}

function ConsultationForm({ record, onCancel, onSave }: { record: ConsultationRecord | null; onCancel: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: record?.title || '',
    participantName: record?.participantName || '',
    participantType: record?.participantType || '',
    craft: record?.craft || '',
    district: record?.district || '',
    type: record?.type || 'FIELD',
    status: record?.status || 'SUBMITTED',
    date: record?.date ? new Date(record.date).toISOString().slice(0, 16) : '',
    venue: record?.venue || '',
    facilitator: record?.facilitator || '',
    attendeeCount: record?.attendeeCount ?? 1,
    summary: record?.summary || '',
    outcomes: record?.outcomes || '',
    notes: record?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (record?.id) {
        await api.put(`/api/skc/consultations/${record.id}`, formData);
      } else {
        await api.post('/api/skc/consultations', formData);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save consultation: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200 transition">← Back</button>
        <h2 className="text-2xl font-black text-brand-dark">{record ? 'Edit Consultation' : 'New Consultation Session'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Session Title *</label>
          <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Pashmina Weavers Community Consultation" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Participant Name</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.participantName} onChange={e => setFormData({ ...formData, participantName: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Participant Type</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.participantType} onChange={e => setFormData({ ...formData, participantType: e.target.value })}>
              <option value="">Select type</option>
              <option value="Artisan">Artisan</option>
              <option value="Trader">Trader / Exporter</option>
              <option value="Government">Government Official</option>
              <option value="NGO">NGO / Civil Society</option>
              <option value="Academic">Academic / Researcher</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Craft</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Pashmina" value={formData.craft} onChange={e => setFormData({ ...formData, craft: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">District</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Srinagar" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Consultation Type</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
              <option value="FIELD">Field Consultation</option>
              <option value="VIRTUAL">Virtual Session</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="FOCUS_GROUP">Focus Group</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="SUBMITTED">Submitted</option>
              <option value="VERIFIED">Verified</option>
              <option value="FLAGGED">Flagged</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Date & Time</label>
            <input type="datetime-local" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Attendee Count</label>
            <input type="number" min={1} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.attendeeCount} onChange={e => setFormData({ ...formData, attendeeCount: parseInt(e.target.value) || 1 })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Venue / Platform</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Location or meeting link" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Facilitator</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Lead facilitator name" value={formData.facilitator} onChange={e => setFormData({ ...formData, facilitator: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Summary</label>
          <textarea rows={3} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Brief summary of the consultation session" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Key Outcomes</label>
          <textarea rows={2} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Main findings and action items" value={formData.outcomes} onChange={e => setFormData({ ...formData, outcomes: e.target.value })} />
        </div>
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Internal Notes</label>
          <textarea rows={2} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary resize-y" placeholder="Any additional notes for internal use" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : record ? 'Update Consultation' : 'Create Consultation'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
