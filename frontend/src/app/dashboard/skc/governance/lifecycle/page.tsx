'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { normalizeArray } from '@/lib/normalize';
import {
  FaCheckCircle, FaSpinner, FaCircle, FaCalendarAlt, FaEdit, FaTrash, 
  FaPlus, FaArrowUp, FaArrowDown, FaHistory, FaEye, FaEyeSlash, 
  FaInfoCircle, FaCog, FaUserShield, FaSave, FaTimes, FaExchangeAlt
} from 'react-icons/fa';

interface LifecycleStage {
  id: string;
  assessmentCycleId: string;
  key: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'DELAYED' | 'CANCELLED';
  order: number;
  weight: number;
  startDate?: string;
  targetEndDate?: string;
  completedDate?: string;
  progressPercent: number;
  publicVisible: boolean;
  linkedRoute?: string;
  statusMode: 'MANUAL' | 'DATE_DRIVEN' | 'WORKFLOW_DRIVEN';
  updatedAt: string;
  updatedBy?: string;
}

interface AuditLog {
  id: string;
  stageId: string;
  stageKey: string;
  previousStatus: string;
  newStatus: string;
  updatedBy: string;
  timestamp: string;
  reason?: string;
  publicVisible: boolean;
}

export default function LifecycleManagementPage() {
  const [stages, setStages] = useState<LifecycleStage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [selectedStage, setSelectedStage] = useState<LifecycleStage | null>(null);
  
  // FORM STATES
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    description: '',
    status: 'NOT_STARTED',
    statusMode: 'MANUAL',
    startDate: '',
    targetEndDate: '',
    completedDate: '',
    progressPercent: 0,
    weight: 10,
    publicVisible: true,
    linkedRoute: '',
    reason: ''
  });

  // Load lifecycle and audit logs on mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lifecycleRes, auditRes] = await Promise.all([
        api.get('/api/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle'),
        api.get('/api/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle/audit-history')
      ]);

      if (lifecycleRes.data?.success) {
        setStages(normalizeArray<LifecycleStage>(lifecycleRes.data.data.stages));
      }
      if (auditRes.data?.success) {
        setAuditLogs(normalizeArray<AuditLog>(auditRes.data.data));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to load assessment lifecycle dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Set form data for edit or new
  const handleOpenForm = (stage?: LifecycleStage) => {
    if (stage) {
      setSelectedStage(stage);
      setFormData({
        key: stage.key,
        title: stage.title,
        description: stage.description || '',
        status: stage.status,
        statusMode: stage.statusMode,
        startDate: stage.startDate ? new Date(stage.startDate).toISOString().substring(0, 10) : '',
        targetEndDate: stage.targetEndDate ? new Date(stage.targetEndDate).toISOString().substring(0, 10) : '',
        completedDate: stage.completedDate ? new Date(stage.completedDate).toISOString().substring(0, 10) : '',
        progressPercent: stage.progressPercent || 0,
        weight: stage.weight || 10,
        publicVisible: stage.publicVisible,
        linkedRoute: stage.linkedRoute || '',
        reason: ''
      });
    } else {
      setSelectedStage(null);
      setFormData({
        key: '',
        title: '',
        description: '',
        status: 'NOT_STARTED',
        statusMode: 'MANUAL',
        startDate: '',
        targetEndDate: '',
        completedDate: '',
        progressPercent: 0,
        weight: 10,
        publicVisible: true,
        linkedRoute: '',
        reason: 'Adding new stage'
      });
    }
    setView('FORM');
  };

  // Submit form payload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload: any = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        statusMode: formData.statusMode,
        startDate: formData.startDate || null,
        targetEndDate: formData.targetEndDate || null,
        completedDate: formData.completedDate || null,
        progressPercent: Number(formData.progressPercent),
        weight: Number(formData.weight),
        publicVisible: formData.publicVisible,
        linkedRoute: formData.linkedRoute || null,
        reason: formData.reason
      };

      if (selectedStage) {
        // Update Stage
        await api.patch(`/api/admin/skc/lifecycle/${selectedStage.id}`, payload);
      } else {
        // Create New Stage
        payload.key = formData.key;
        payload.order = stages.length + 1;
        await api.post('/api/admin/skc/assessment-cycles/2026/lifecycle', payload);
      }

      setView('LIST');
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Failed to save lifecycle stage.');
      setLoading(false);
    }
  };

  // Delete stage
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lifecycle stage? This will remove the stage and record the deletion in the audit logs.')) return;
    try {
      setLoading(true);
      await api.delete(`/api/admin/skc/lifecycle/${id}`);
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Failed to delete lifecycle stage.');
      setLoading(false);
    }
  };

  // Reorder stages
  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const newStages = [...stages];
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newStages.length) return;
    
    // Swap orders
    const temp = newStages[currentIndex].order;
    newStages[currentIndex].order = newStages[targetIndex].order;
    newStages[targetIndex].order = temp;

    try {
      setLoading(true);
      const orders = newStages.map(s => ({ id: s.id, order: s.order }));
      await api.post('/api/admin/skc/lifecycle/reorder', { orders });
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'Failed to update reorder sequence.');
      setLoading(false);
    }
  };

  // Render status icons
  const renderStatusIndicator = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-100 px-2.5 py-1 rounded-[10px] text-xs uppercase">
            <FaCheckCircle className="text-sm" /> Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center gap-1.5 text-yellow-700 font-bold bg-yellow-100 px-2.5 py-1 rounded-[10px] text-xs uppercase animate-pulse">
            <FaSpinner className="text-sm animate-spin" /> In Progress
          </span>
        );
      case 'DELAYED':
        return (
          <span className="flex items-center gap-1.5 text-red-700 font-bold bg-red-100 px-2.5 py-1 rounded-[10px] text-xs uppercase">
            <FaCircle className="text-xs text-red-500" /> Delayed
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-100 px-2.5 py-1 rounded-[10px] text-xs uppercase">
            <FaCircle className="text-xs text-blue-500" /> Paused
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 text-gray-500 font-bold bg-gray-100 px-2.5 py-1 rounded-[10px] text-xs uppercase line-through">
            <FaCircle className="text-xs text-gray-400" /> Cancelled
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="flex items-center gap-1.5 text-purple-700 font-bold bg-purple-100 px-2.5 py-1 rounded-[10px] text-xs uppercase">
            <FaCircle className="text-xs text-purple-500" /> Upcoming
          </span>
        );
      case 'NOT_STARTED':
      default:
        return (
          <span className="flex items-center gap-1.5 text-gray-600 font-bold bg-gray-200 px-2.5 py-1 rounded-[10px] text-xs uppercase">
            <FaCircle className="text-xs text-gray-400" /> Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 p-6 text-gray-800 bg-gray-50/50 min-h-screen">
      
      {/* Title Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <span data-editorial-accent-text className="text-[10px] font-black uppercase tracking-widest  flex items-center gap-1">
            <FaUserShield /> Governance Dashboard
          </span>
          <h1 className="text-3xl font-black text-brand-dark mt-1">Assessment Lifecycle</h1>
          <p className="text-gray-500 text-sm font-semibold mt-1">
            Manage assessment cycles, tracking modes, date schedules, and publish updates across all public-facing modules.
          </p>
        </div>
        {view === 'LIST' && (
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-5 py-3 bg-[#6B2A08] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition shadow-sm"
          >
            <FaPlus /> Add New Stage
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
          <FaInfoCircle /> {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-[#6B2A08]" />
        </div>
      )}

      {!loading && view === 'LIST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Stages Management Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-brand-dark flex items-center gap-2">
                  <FaCog data-ui-icon  className="" /> Active Lifecycle Stages (Cycle 2026)
                </h3>
                <span className="text-xs text-gray-500 font-semibold">{stages.length} Stages Managed</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-xs font-black text-gray-700 uppercase tracking-wider">
                      <th className="p-4 w-12 text-center">Order</th>
                      <th className="p-4">Stage Title</th>
                      <th className="p-4">Mode</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Progress</th>
                      <th className="p-4 text-center">Weight</th>
                      <th className="p-4 text-center">Visibility</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stages.map((stage, idx) => (
                      <tr key={stage.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleReorder(idx, 'UP')}
                              className={`text-gray-400 hover:text-brand-secondary transition disabled:opacity-20`}
                            >
                              <FaArrowUp className="text-[10px]" />
                            </button>
                            <span className="font-black text-gray-800">{stage.order}</span>
                            <button
                              disabled={idx === stages.length - 1}
                              onClick={() => handleReorder(idx, 'DOWN')}
                              className={`text-gray-400 hover:text-brand-secondary transition disabled:opacity-20`}
                            >
                              <FaArrowDown className="text-[10px]" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-[200px] truncate">
                            <div className="font-bold text-gray-900 text-sm">{stage.title}</div>
                            <div className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{stage.description}</div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-xs uppercase text-gray-500">
                          {stage.statusMode === 'DATE_DRIVEN' && 'Date Driven'}
                          {stage.statusMode === 'WORKFLOW_DRIVEN' && 'Workflow'}
                          {stage.statusMode === 'MANUAL' && 'Manual'}
                        </td>
                        <td className="p-4">
                          {renderStatusIndicator(stage.status)}
                        </td>
                        <td className="p-4 text-center font-bold text-brand-dark">
                          {stage.progressPercent}%
                        </td>
                        <td className="p-4 text-center font-bold text-gray-600">
                          {stage.weight}
                        </td>
                        <td className="p-4 text-center">
                          {stage.publicVisible ? (
                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">
                              <FaEye /> Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">
                              <FaEyeSlash /> Hidden
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleOpenForm(stage)}
                              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:text-brand-secondary hover:border-brand-secondary/40 transition bg-white"
                              title="Edit Stage"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(stage.id)}
                              className="p-2 border border-gray-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition bg-white"
                              title="Delete Stage"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Audit History Logs Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <FaHistory data-ui-icon  className="" />
                <h3 className="font-bold text-brand-dark">Audit Logs & History</h3>
              </div>
              <div className="p-6 flex-grow overflow-y-auto max-h-[600px] space-y-6">
                {auditLogs.length === 0 ? (
                  <p className="text-gray-400 text-sm font-semibold text-center py-8">No status override logs recorded.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="border-l-2 border-[var(--card-left-accent)]/20 pl-4 py-1 space-y-1 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-gray-900">{log.stageKey.toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {new Date(log.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-[10px] text-gray-500 mt-1">
                        <span className="line-through">{log.previousStatus}</span>
                        <FaExchangeAlt className="text-gray-400" />
                        <span className="text-[#6B2A08] font-black">{log.newStatus}</span>
                      </div>
                      <p className="text-gray-600 italic font-medium mt-1">"{log.reason || 'Manual override'}"</p>
                      <div className="text-[9px] text-gray-400 font-semibold mt-1">
                        By {log.updatedBy}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {!loading && view === 'FORM' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              <FaCog data-ui-icon  className="" />
              {selectedStage ? `Edit Phase: ${selectedStage.title}` : 'Add New Lifecycle Stage'}
            </h3>
            <button
              onClick={() => setView('LIST')}
              className="text-gray-400 hover:text-brand-dark transition"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {!selectedStage && (
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-2">Stage Key identifier (unique)</label>
                  <input
                    type="text"
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    placeholder="e.g. governance_framework"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Stage Public Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Governance Framework"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Status Mode</label>
                <select
                  value={formData.statusMode}
                  onChange={(e) => setFormData({ ...formData, statusMode: e.target.value })}
                  className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-bold text-gray-700"
                >
                  <option value="MANUAL">Manual (Admin controlled)</option>
                  <option value="DATE_DRIVEN">Date Driven (Calculated from Dates)</option>
                  <option value="WORKFLOW_DRIVEN">Workflow Driven (Calculated from database activity)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Manual Status (If Manual mode)</label>
                <select
                  disabled={formData.statusMode !== 'MANUAL'}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-bold text-gray-700 disabled:opacity-40"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PAUSED">Paused</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Completion Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Milestone Weight (Importance)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Linked Public Route Action</label>
                <input
                  type="text"
                  value={formData.linkedRoute}
                  onChange={(e) => setFormData({ ...formData, linkedRoute: e.target.value })}
                  placeholder="/state-of-kashmir-crafts/participate"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Planned Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Target End Date</label>
                <input
                  type="date"
                  value={formData.targetEndDate}
                  onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Actual Completion Date</label>
                <input
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
                />
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.publicVisible}
                    onChange={(e) => setFormData({ ...formData, publicVisible: e.target.checked })}
                    className="w-4.5 h-4.5 border-gray-300 rounded focus:ring-brand-secondary text-[#6B2A08]"
                  />
                  <span className="text-xs font-black uppercase text-gray-500">Publish Visibly to Public Pages</span>
                </label>
              </div>

            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-2">Stage Public Explanation / Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a public explanation of what is achieved in this phase..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-gray-500 mb-2">Reason / Note for Status Update (Audit Trail)</label>
              <textarea
                required
                rows={2}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Reason: e.g. Pre-launch stages verified and finalized by the secretariat..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-semibold"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setView('LIST')}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#6B2A08] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-brand-secondary transition shadow-sm"
              >
                <FaSave /> Save Lifecycle Stage
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
