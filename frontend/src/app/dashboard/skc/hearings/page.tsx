'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaClock, FaUsers, FaGlobe, FaPaperPlane } from 'react-icons/fa';
import SubscribersTab from './components/SubscribersTab';

export default function HearingsCMS() {
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<'LIST' | 'EDIT' | 'CREATE'>('LIST');
  const [selectedHearing, setSelectedHearing] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'HEARINGS' | 'SUBSCRIBERS'>('HEARINGS');
  
  const [notifyHearingId, setNotifyHearingId] = useState<string | null>(null);
  const [notifyCount, setNotifyCount] = useState<number | null>(null);
  const [sendingNotify, setSendingNotify] = useState(false);

  const fetchHearings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/skc/hearings');
      setHearings(normalizeArray(res.data));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch hearings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHearings();
  }, []);

  const handleEdit = (hearing: any) => {
    setSelectedHearing(hearing);
    setView('EDIT');
  };

  const handleNotifyClick = async (hearing: any) => {
    if (hearing.status !== 'PUBLISHED' && hearing.status !== 'UPCOMING') {
      alert("Only PUBLISHED or UPCOMING hearings can send notifications.");
      return;
    }
    setNotifyHearingId(hearing.id);
    setNotifyCount(null);
    try {
      const res = await api.get(`/api/skc/hearings/${hearing.id}/subscribers/count`);
      if (res.data?.success) {
        setNotifyCount(res.data.data.count);
      }
    } catch (err: any) {
      alert("Failed to get subscriber count: " + err.message);
      setNotifyHearingId(null);
    }
  };

  const handleSendNotification = async () => {
    if (!notifyHearingId) return;
    if (!confirm(`Are you sure you want to send this notification to ${notifyCount} verified subscribers?`)) return;
    
    setSendingNotify(true);
    try {
      const res = await api.post(`/api/skc/hearings/${notifyHearingId}/notifications/send`);
      alert(res.data.message || 'Notifications sent successfully.');
      setNotifyHearingId(null);
    } catch (err: any) {
      alert('Failed to send notifications: ' + err.message);
    } finally {
      setSendingNotify(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hearing?')) return;
    try {
      await api.delete(`/api/skc/hearings/${id}`);
      fetchHearings();
    } catch (err: any) {
      alert('Failed to delete hearing: ' + err.message);
    }
  };

  if (view === 'CREATE' || view === 'EDIT') {
    return (
      <HearingForm 
        hearing={selectedHearing} 
        onCancel={() => { setView('LIST'); setSelectedHearing(null); }}
        onSave={() => { setView('LIST'); setSelectedHearing(null); fetchHearings(); }}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ONGOING': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PUBLISHED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Hearings Management</h1>
          <p className="text-gray-500 mt-2">Manage SKC public hearings, schedules, and notifications</p>
        </div>
        {activeTab === 'HEARINGS' && (
          <button 
            onClick={() => { setSelectedHearing(null); setView('CREATE'); }}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <FaPlus size={14} /> Create Hearing
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('HEARINGS')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'HEARINGS' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Hearings
        </button>
        <button 
          onClick={() => setActiveTab('SUBSCRIBERS')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'SUBSCRIBERS' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Notification Subscribers
        </button>
      </div>

      {activeTab === 'SUBSCRIBERS' ? (
        <SubscribersTab />
      ) : (
        <>
          {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && hearings.length === 0 && (
        <div className="bg-white border border-gray-200 p-12 rounded-xl text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <FaCalendarAlt className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No public hearings found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first public hearing. You can set the date, capacity, and manage registrations.</p>
          <button 
            onClick={() => { setSelectedHearing(null); setView('CREATE'); }}
            className="text-black bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Hearing
          </button>
        </div>
      )}

      {!loading && !error && hearings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hearing Details</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hearings.map((h: any) => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{h.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{h.shortSummary || h.slug}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400" size={12} />
                        {h.date ? new Date(h.date).toLocaleDateString() : 'TBD'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <FaClock className="text-gray-400" size={12} />
                        {h.time || 'TBD'} {h.timezone ? `(${h.timezone})` : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1.5">
                        <FaUsers className="text-gray-400" size={12} />
                        {h.capacity ? `${h.capacity} max` : 'Unlimited'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(h.status)}`}>
                        {h.status || 'UPCOMING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleNotifyClick(h)} 
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Send Notifications"
                        >
                          <FaPaperPlane size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(h)} 
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(h.id)} 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notify Modal */}
      {notifyHearingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Send Hearing Notification</h3>
            {notifyCount === null ? (
              <p className="text-gray-500">Calculating matching subscribers...</p>
            ) : (
              <>
                <p className="text-gray-700 mb-6">
                  There are <strong>{notifyCount}</strong> verified subscribers whose interests (district, craft, or topic) match this hearing.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setNotifyHearingId(null)}
                    disabled={sendingNotify}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSendNotification}
                    disabled={sendingNotify || notifyCount === 0}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {sendingNotify ? 'Sending...' : 'Send Now'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

        </>
      )}
    </div>
  );
}

function HearingForm({ hearing, onCancel, onSave }: { hearing: any, onCancel: () => void, onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: hearing?.title || '',
    slug: hearing?.slug || '',
    shortSummary: hearing?.shortSummary || '',
    description: hearing?.description || '',
    date: hearing?.date ? new Date(hearing.date).toISOString().split('T')[0] : '',
    time: hearing?.time || '',
    timezone: hearing?.timezone || 'IST',
    status: hearing?.status || 'UPCOMING',
    capacity: hearing?.capacity || '',
    registrationDeadline: hearing?.registrationDeadline ? new Date(hearing.registrationDeadline).toISOString().slice(0, 16) : '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Clean up empty fields that might cause DB issues
    const payload = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity.toString()) : null,
      date: formData.date ? new Date(formData.date).toISOString() : null,
      registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
    };

    try {
      if (hearing?.id) {
        await api.put(`/api/skc/hearings/${hearing.id}`, payload);
      } else {
        await api.post('/api/skc/hearings', payload);
      }
      onSave();
    } catch (err: any) {
      alert('Failed to save hearing: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSlugify = () => {
    if (formData.title && !formData.slug) {
      setFormData({
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <FaArrowLeft size={14} /> Back to Hearings
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {hearing ? 'Edit Public Hearing' : 'Create Public Hearing'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details for the SKC public hearing session.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* General Information */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaGlobe className="text-gray-400" /> General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  required 
                  type="text" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  value={formData.title} 
                  onBlur={handleSlugify}
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Annual Craftsmanship Review"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input 
                  required 
                  type="text" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})} 
                  placeholder="annual-craftsmanship-review"
                />
                <p className="text-xs text-gray-500 mt-1">The URL-friendly version of the title.</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary</label>
                <textarea 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none" 
                  rows={2}
                  value={formData.shortSummary} 
                  onChange={e => setFormData({...formData, shortSummary: e.target.value})}
                  placeholder="A brief overview of the hearing..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea 
                  className="w-full border border-gray-300 p-2.5 rounded-lg h-32 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-y" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed information about the agenda, speakers, etc."
                ></textarea>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Schedule & Setup */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> Schedule & Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  value={formData.time} 
                  onChange={e => setFormData({...formData, time: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white" 
                  value={formData.timezone} 
                  onChange={e => setFormData({...formData, timezone: e.target.value})}
                >
                  <option value="IST">IST (Indian Standard Time)</option>
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all bg-white" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  placeholder="e.g. 100"
                  value={formData.capacity} 
                  onChange={e => setFormData({...formData, capacity: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                <input 
                  type="datetime-local" 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" 
                  value={formData.registrationDeadline} 
                  onChange={e => setFormData({...formData, registrationDeadline: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 mt-8 pt-6">
            <button 
              disabled={saving} 
              type="submit" 
              className="bg-black hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : (hearing ? 'Update Hearing' : 'Create Hearing')}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-2.5 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
