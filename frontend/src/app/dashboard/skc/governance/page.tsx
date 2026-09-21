'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaGavel, FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,
  FaExclamationTriangle, FaCheckCircle, FaDownload, FaUsers
} from 'react-icons/fa';
import { exportToCsv, logExportAudit } from '@/lib/skc/exportUtils';

interface AdvisoryMember {
  id: string;
  name: string;
  designation?: string;
  organization?: string;
  role?: string;
  status?: string;
  district?: string;
  expertise?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

export default function GovernancePage() {
  const [members, setMembers] = useState<AdvisoryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selected, setSelected] = useState<AdvisoryMember | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'overview'>('members');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/skc/advisory');
      setMembers(normalizeArray<AdvisoryMember>(res.data));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch governance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this advisory member?')) return;
    try {
      await api.delete(`/api/skc/advisory/${id}`);
      fetchMembers();
    } catch (err: any) {
      alert('Failed to remove member: ' + err.message);
    }
  };

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (m.name || '').toLowerCase().includes(q) ||
      (m.organization || '').toLowerCase().includes(q) ||
      (m.designation || '').toLowerCase().includes(q) ||
      (m.district || '').toLowerCase().includes(q);
    const matchRole = !filterRole || m.role === filterRole;
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const uniqueRoles = Array.from(new Set(members.map(m => m.role).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(members.map(m => m.status).filter(Boolean)));
  const activeCount = members.filter(m => m.status === 'ACTIVE').length;
  const uniqueOrgs = new Set(members.map(m => m.organization).filter(Boolean)).size;

  const handleExport = () => {
    const headers = ['Name', 'Designation', 'Organization', 'Role', 'District', 'Status', 'Email'];
    const rows = filtered.map(m => [m.name, m.designation || '', m.organization || '', m.role || '', m.district || '', m.status || '', m.email || '']);
    exportToCsv(`skc-governance-${new Date().toISOString().split('T')[0]}.csv`, [headers, ...rows]);
    logExportAudit('Governance', 'CSV', filtered.length);
  };

  if (view === 'FORM') {
    return (
      <GovernanceForm
        member={selected}
        onCancel={() => { setView('LIST'); setSelected(null); }}
        onSave={() => { setView('LIST'); setSelected(null); fetchMembers(); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaGavel data-ui-icon  className="" /> Governance Framework
          </h1>
          <p className="text-gray-600 font-medium mt-1">State of Kashmir Crafts Assessment 2026–2027 — Advisory Council & Oversight</p>
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
            <FaPlus /> Add Member
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 text-red-700">
          <FaExclamationTriangle />
          <div>
            <p className="font-bold">Error loading governance data</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Members</div>
          <div className="text-3xl font-black text-brand-primary">{loading ? '-' : members.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Active Members</div>
          <div className="text-3xl font-black text-green-600">{loading ? '-' : activeCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Organizations</div>
          <div className="text-3xl font-black text-gray-900">{loading ? '-' : uniqueOrgs}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Roles Defined</div>
          <div className="text-3xl font-black text-brand-secondary">{loading ? '-' : uniqueRoles.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-1">
        {(['members', 'overview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold capitalize rounded-t-lg transition ${activeTab === tab ? 'bg-white border border-b-white border-gray-200 text-brand-primary -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'members' ? 'Advisory Members' : 'Governance Overview'}
          </button>
        ))}
      </div>

      {activeTab === 'members' && (
        <>
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, organization, district…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
                <option value="">All Roles</option>
                {uniqueRoles.map(r => <option key={r} value={r!}>{r}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 p-2.5 rounded-lg outline-none focus:border-brand-primary">
                <option value="">All Statuses</option>
                {uniqueStatuses.map(s => <option key={s} value={s!}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Member</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold"><FaSpinner className="animate-spin inline mr-2" />Loading members…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                      {members.length === 0 ? 'No advisory members registered yet. Click "Add Member" to get started.' : 'No members match the current filters.'}
                    </td></tr>
                  ) : filtered.map(m => (
                    <tr key={m.id} className="hover:bg-brand-primary/5 transition">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.designation || '—'}</div>
                        {m.email && <div className="text-[10px] text-gray-400">{m.email}</div>}
                      </td>
                      <td className="p-4 text-gray-700 font-medium">{m.organization || '—'}</td>
                      <td className="p-4">
                        {m.role ? (
                          <span className="text-[10px] font-bold px-2 py-1 bg-brand-primary/10 text-brand-secondary rounded border border-brand-primary/20 uppercase tracking-wide">
                            {m.role}
                          </span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{m.district || '—'}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${m.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : m.status === 'INACTIVE' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {m.status || 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelected(m); setView('FORM'); }}
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition"
                            title="Edit"
                          ><FaEdit /></button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition"
                            title="Delete"
                          ><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500 font-bold">
              Showing {filtered.length} of {members.length} advisory members
            </div>
          </div>
        </>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2"><FaUsers data-ui-icon  className="" /> Governance Structure</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaCheckCircle className="text-green-500 flex-shrink-0" /> <span><strong>Advisory Council</strong> — Expert members guiding the SKC 2026 assessment framework</span></li>
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaCheckCircle className="text-green-500 flex-shrink-0" /> <span><strong>Oversight Panel</strong> — Independent review of evidence integrity and findings</span></li>
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaCheckCircle className="text-green-500 flex-shrink-0" /> <span><strong>Technical Committee</strong> — Methodology and data quality governance</span></li>
              <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><FaCheckCircle className="text-green-500 flex-shrink-0" /> <span><strong>Stakeholder Forum</strong> — Community representation and craft sector liaisons</span></li>
            </ul>
          </div>
          <div className="bg-brand-dark p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-bl-full" />
            <h3 className="font-black text-white text-lg mb-4 relative z-10 flex items-center gap-2"><FaGavel data-ui-icon  className="" /> Governance Mandate</h3>
            <p className="text-gray-300 text-sm leading-relaxed relative z-10 mb-4">
              The SKC 2026 Governance Framework ensures transparency, accountability, and evidence-based decision-making for Kashmir's craft sector development policy.
            </p>
            <div className="space-y-2 relative z-10">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-xs font-bold text-white">Total Advisory Members</div>
                <div className="text-2xl font-black text-brand-secondary mt-1">{members.length}</div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-xs font-bold text-white">Active Members</div>
                <div className="text-2xl font-black text-green-400 mt-1">{activeCount}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GovernanceForm({ member, onCancel, onSave }: { member: AdvisoryMember | null; onCancel: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    designation: member?.designation || '',
    organization: member?.organization || '',
    role: member?.role || 'ADVISOR',
    status: member?.status || 'ACTIVE',
    district: member?.district || '',
    expertise: member?.expertise || '',
    email: member?.email || '',
    phone: member?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (member?.id) {
        await api.put(`/api/skc/advisory/${member.id}`, formData);
      } else {
        await api.post('/api/skc/advisory', formData);
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
        <h2 className="text-2xl font-black text-brand-dark">{member ? 'Edit Advisory Member' : 'Add Advisory Member'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block font-bold mb-1 text-sm text-gray-700">Full Name *</label>
          <input required type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Designation</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Professor" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Organization</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. University of Kashmir" value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Role</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="ADVISOR">Advisor</option>
              <option value="CHAIR">Chairperson</option>
              <option value="MEMBER">Member</option>
              <option value="OBSERVER">Observer</option>
              <option value="TECHNICAL">Technical Expert</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Status</label>
            <select className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">District</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Srinagar" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} />
          </div>
          <div>
            <label className="block font-bold mb-1 text-sm text-gray-700">Area of Expertise</label>
            <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. Textile Economics" value={formData.expertise} onChange={e => setFormData({ ...formData, expertise: e.target.value })} />
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
        <div className="flex gap-3 pt-2">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-dark transition disabled:opacity-60">
            {saving ? 'Saving…' : member ? 'Update Member' : 'Add Member'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
