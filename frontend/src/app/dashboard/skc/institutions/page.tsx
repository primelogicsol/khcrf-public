'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import { FaPlus, FaEdit, FaTrash, FaInbox, FaCheckCircle, FaTimesCircle, FaEye, FaBuilding } from 'react-icons/fa';

// ── Status badge colours ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  SUBMITTED:    'bg-amber-100 text-amber-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  VERIFIED:     'bg-indigo-100 text-indigo-800',
  APPROVED:     'bg-green-100 text-green-800',
  REJECTED:     'bg-red-100 text-red-800',
  WITHDRAWN:    'bg-gray-100 text-gray-800',
  ACTIVE:       'bg-green-100 text-green-800',
  INACTIVE:     'bg-gray-100 text-gray-800',
  DRAFT:        'bg-yellow-100 text-yellow-800',
};

// ── Tab type ──────────────────────────────────────────────────────────────────
type Tab = 'REGISTRATIONS' | 'VERIFIED';

export default function InstitutionsCMS() {
  const [tab, setTab] = useState<Tab>('REGISTRATIONS');

  // ── Registration queue ─────────────────────────────────────────────────────
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  const fetchRegistrations = async () => {
    try {
      setRegLoading(true);
      const res = await api.get('/skc/institutions/registrations');
      setRegistrations(normalizeArray(res.data));
    } catch (err: any) {
      setRegError(err.response?.data?.error || err.message || 'Failed to fetch registrations');
    } finally {
      setRegLoading(false);
    }
  };

  const updateRegStatus = async (id: string, status: string, notes?: string) => {
    try {
      await api.put(`/skc/institutions/registrations/${id}`, { status, reviewerNotes: notes });
      fetchRegistrations();
      setSelectedReg(null);
    } catch (err: any) {
      alert('Failed to update: ' + (err.response?.data?.error || err.message));
    }
  };

  // ── Verified institutions ──────────────────────────────────────────────────
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instView, setInstView] = useState<'LIST' | 'EDIT' | 'CREATE'>('LIST');
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/skc/institutions');
      setInstitutions(normalizeArray(res.data));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchInstitutions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this institution?')) return;
    try {
      await api.delete(`/skc/institutions/${id}`);
      fetchInstitutions();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  // ── Registration detail modal ──────────────────────────────────────────────
  if (selectedReg) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button onClick={() => setSelectedReg(null)} className="mb-4 text-sm text-gray-500 hover:text-gray-700">← Back to queue</button>
        <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">{selectedReg.institutionName}</h2>
              <p className="text-sm text-gray-500">{selectedReg.referenceNumber} · Submitted {new Date(selectedReg.submittedAt).toLocaleDateString()}</p>
              {selectedReg.participationScope && (
                <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-bold rounded-full ${
                  selectedReg.participationScope === 'KHCRF' ? 'bg-purple-100 text-purple-800' :
                  selectedReg.participationScope === 'SKC'  ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedReg.participationScope === 'KHCRF' ? 'KHCRF Only' : selectedReg.participationScope === 'SKC' ? 'SKC Only' : 'KHCRF + SKC'}
                </span>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[selectedReg.status] || 'bg-gray-100 text-gray-800'}`}>{selectedReg.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            {[
              ['Category', selectedReg.category],
              ['Country', selectedReg.country || '—'],
              ['State / Province', selectedReg.stateProvince || '—'],
              ['District / City', selectedReg.districtCity || '—'],
              ['Representative', selectedReg.representativeName],
              ['Designation', selectedReg.designation],
              ['Email', selectedReg.email],
              ['Phone', selectedReg.phone],
              ['Website', selectedReg.website || 'N/A'],
              ['Directory Consent', selectedReg.publicDirectoryConsent ? 'Yes' : 'No'],
              ['Comms Consent', selectedReg.communicationsConsent ? 'Yes' : 'No'],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="text-gray-800 font-medium">{val}</p>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Participation Types</p>
            <div className="flex flex-wrap gap-2">
              {(selectedReg.participationTypes || []).map((t: string) => (
                <span key={t} className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">{t}</span>
              ))}
            </div>
          </div>
          {(selectedReg.areasOfExpertise || []).length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Areas of Expertise</p>
              <div className="flex flex-wrap gap-2">
                {(selectedReg.areasOfExpertise || []).map((t: string) => (
                  <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {selectedReg.profile && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Institutional Profile</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedReg.profile}</p>
            </div>
          )}
          {selectedReg.proposedContribution && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Proposed Contribution</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedReg.proposedContribution}</p>
            </div>
          )}
          {selectedReg.status === 'SUBMITTED' || selectedReg.status === 'UNDER_REVIEW' ? (
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => updateRegStatus(selectedReg.id, 'UNDER_REVIEW')} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">Mark Under Review</button>
              <button onClick={() => updateRegStatus(selectedReg.id, 'APPROVED')} className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 flex items-center gap-1"><FaCheckCircle /> Approve</button>
              <button onClick={() => updateRegStatus(selectedReg.id, 'REJECTED')} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 flex items-center gap-1"><FaTimesCircle /> Reject</button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ── EDIT/CREATE institution form ───────────────────────────────────────────
  if (instView !== 'LIST') {
    return (
      <InstitutionForm
        institution={selectedInstitution}
        onCancel={() => { setInstView('LIST'); setSelectedInstitution(null); }}
        onSave={() => { setInstView('LIST'); setSelectedInstitution(null); fetchInstitutions(); }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Participating Institutions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage registration queue and verified institution directory.</p>
        </div>
        {tab === 'VERIFIED' && (
          <button onClick={() => { setSelectedInstitution(null); setInstView('CREATE'); }} className="bg-brand-primary text-white px-4 py-2 rounded font-bold flex items-center gap-2">
            <FaPlus /> Add Institution
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('REGISTRATIONS')}
          className={`px-5 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${tab === 'REGISTRATIONS' ? 'border-brand-primary text-icon-on-light' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <FaInbox /> Registration Queue
          {registrations.filter(r => r.status === 'SUBMITTED').length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{registrations.filter(r => r.status === 'SUBMITTED').length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('VERIFIED')}
          className={`px-5 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${tab === 'VERIFIED' ? 'border-brand-primary text-icon-on-light' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <FaBuilding /> Verified Directory ({institutions.length})
        </button>
      </div>

      {/* ── REGISTRATIONS TAB ─────────────────────────────────────────────── */}
      {tab === 'REGISTRATIONS' && (
        <>
          {regLoading && <p className="text-gray-500">Loading registrations...</p>}
          {regError && <p className="text-red-600">{regError}</p>}
          {!regLoading && !regError && registrations.length === 0 && (
            <div className="bg-gray-50 p-12 rounded-xl border border-dashed border-gray-300 text-center">
              <FaInbox className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No institution registrations yet.</p>
              <p className="text-sm text-gray-400">Registrations from the public form will appear here.</p>
            </div>
          )}
          {!regLoading && registrations.length > 0 && (
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-700">Reference</th>
                    <th className="p-4 font-bold text-gray-700">Institution</th>
                    <th className="p-4 font-bold text-gray-700">Category</th>
                    <th className="p-4 font-bold text-gray-700">Representative</th>
                    <th className="p-4 font-bold text-gray-700">Location</th>
                    <th className="p-4 font-bold text-gray-700">Status</th>
                    <th className="p-4 font-bold text-gray-700">Submitted</th>
                    <th className="p-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-600">
                        {reg.referenceNumber}
                        {reg.participationScope && (
                          <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded ${
                            reg.participationScope === 'KHCRF' ? 'bg-purple-100 text-purple-700' :
                            reg.participationScope === 'SKC'  ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>{reg.participationScope}</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{reg.institutionName}</td>
                      <td className="p-4 text-gray-600">{reg.category}</td>
                      <td className="p-4 text-gray-600">{reg.representativeName}<br/><span className="text-xs text-gray-400">{reg.designation}</span></td>
                      <td className="p-4 text-gray-600">{reg.districtCity || reg.country || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[reg.status] || 'bg-gray-100 text-gray-800'}`}>{reg.status}</span>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">{new Date(reg.submittedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => setSelectedReg(reg)} className="text-icon-on-light hover:text-brand-secondary flex items-center gap-1 text-xs font-bold">
                          <FaEye /> Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── VERIFIED DIRECTORY TAB ────────────────────────────────────────── */}
      {tab === 'VERIFIED' && (
        <>
          {loading && <p>Loading institutions...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && institutions.length === 0 && (
            <div className="bg-gray-50 p-12 rounded-xl border border-dashed border-gray-300 text-center">
              <FaBuilding className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No verified institutions yet.</p>
            </div>
          )}
          {!loading && institutions.length > 0 && (
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-700">Name</th>
                    <th className="p-4 font-bold text-gray-700">Type</th>
                    <th className="p-4 font-bold text-gray-700">District</th>
                    <th className="p-4 font-bold text-gray-700">Status</th>
                    <th className="p-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst: any) => (
                    <tr key={inst.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4 font-medium">{inst.name}</td>
                      <td className="p-4 text-gray-600">{inst.type}</td>
                      <td className="p-4 text-gray-600">{inst.district || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[inst.status] || 'bg-gray-100 text-gray-800'}`}>{inst.status}</span>
                      </td>
                      <td className="p-4 flex gap-3">
                        <button onClick={() => { setSelectedInstitution(inst); setInstView('EDIT'); }} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                        <button onClick={() => handleDelete(inst.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InstitutionForm({ institution, onCancel, onSave }: { institution: any, onCancel: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: institution?.type || 'University',
    status: institution?.status || 'ACTIVE',
    district: institution?.district || '',
    contactPerson: institution?.contactPerson || '',
    email: institution?.email || '',
    participationType: institution?.participationType || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (institution?.id) {
        await api.put(`/skc/institutions/${institution.id}`, formData);
      } else {
        await api.post('/skc/institutions', formData);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl bg-white rounded-xl shadow border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold mb-6">{institution ? 'Edit Institution' : 'Add Institution'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Institution Name *</label>
          <input required type="text" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Type *</label>
            <select required className="w-full border border-gray-300 p-2 rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="University">University / Academic</option>
              <option value="Trade Body">Trade Body / Association</option>
              <option value="Govt Dept">Government Department</option>
              <option value="NGO">NGO / Civil Society</option>
              <option value="Cooperative">Cooperative / Producer Group</option>
              <option value="Research">Research Institution</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">Status</label>
            <select className="w-full border border-gray-300 p-2 rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">District</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" placeholder="e.g. Srinagar" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
          </div>
          <div>
            <label className="block font-bold mb-1">Participation Type</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" placeholder="e.g. Evidence, Consultation" value={formData.participationType} onChange={e => setFormData({...formData, participationType: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Contact Person</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
          </div>
          <div>
            <label className="block font-bold mb-1">Email</label>
            <input type="email" className="w-full border border-gray-300 p-2 rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button disabled={saving} type="submit" className="bg-brand-primary text-white px-6 py-2 rounded-lg font-bold">
            {saving ? 'Saving...' : 'Save Institution'}
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-200 px-6 py-2 rounded-lg font-bold">Cancel</button>
        </div>
      </form>
    </div>
  );
}
