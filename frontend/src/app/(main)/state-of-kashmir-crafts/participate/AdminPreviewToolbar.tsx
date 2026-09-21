import React, { useState } from 'react';
import { FaTools, FaUserSecret, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { PREVIEW_SCENARIOS } from '@/lib/skc/preview-data';
import { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';

const MODES = [
  "Online Survey",
  "Field Consultation",
  "Public Hearing",
  "Validation Review",
  "Expert Review",
  "Written Submission"
];

export default function AdminPreviewToolbar({
  isActive,
  onActivatePreview,
  onExitPreview,
  onPreviewCategory,
  onPreviewStatus,
  onPreviewModes,
  onImpersonate,
  currentCategory,
  currentStatus,
  currentModes,
  impersonatedUser,
}: {
  isActive: boolean;
  onActivatePreview: () => void;
  onExitPreview: () => void;
  onPreviewCategory: (cat: string) => void;
  onPreviewStatus: (status: string) => void;
  onPreviewModes: (modes: string[]) => void;
  onImpersonate: (userData: any) => void;
  currentCategory: string;
  currentStatus: string;
  currentModes: string[];
  impersonatedUser: any | null;
}) {
  const [expanded, setExpanded] = useState(false);
  
  if (!isActive && !expanded) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button 
          onClick={() => { setExpanded(true); onActivatePreview(); }}
          className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 hover:bg-black transition"
        >
          <FaTools /> Admin Preview
        </button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-orange-500/50 text-white p-2 z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 text-orange-400">
            <FaExclamationTriangle /> ADMIN PREVIEW
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className="text-gray-300 truncate max-w-[200px]">
            {impersonatedUser ? `Impersonating: ${impersonatedUser.name}` : (currentCategory || "Public Landing")}
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className={
            currentStatus === 'APPROVED' ? 'text-emerald-400' :
            currentStatus === 'PENDING' ? 'text-blue-400' :
            currentStatus === 'REJECTED' || currentStatus === 'SUSPENDED' ? 'text-red-400' :
            'text-amber-400'
          }>
            {impersonatedUser ? impersonatedUser.status : currentStatus.replace('_', ' ')}
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className="text-gray-400">
            {currentModes.length} Mode{currentModes.length !== 1 ? 's' : ''}
          </div>
          <div className="flex-grow"></div>
          <div className="flex gap-2">
            <button 
              onClick={() => setExpanded(true)}
              className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded transition flex items-center gap-2"
            >
              <FaTools /> Expand Controls
            </button>
            <button 
              onClick={() => onExitPreview()}
              className="px-4 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-200 rounded transition flex items-center gap-2"
            >
              <FaTimes /> Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toggleMode = (mode: string) => {
    if (currentModes.includes(mode)) {
      onPreviewModes(currentModes.filter(m => m !== mode));
    } else {
      onPreviewModes([...currentModes, mode]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 p-4 z-[9999] shadow-2xl overflow-y-auto max-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaTools className="text-orange-500 text-xl" />
            <h3 className="font-black text-lg">ADMIN PREVIEW MODE</h3>
            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-500/50">READ ONLY</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setExpanded(false)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold">Minimize</button>
            <button onClick={() => { setExpanded(false); onExitPreview(); }} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs font-bold flex items-center gap-1"><FaTimes /> Exit Preview</button>
          </div>
        </div>

        {impersonatedUser ? (
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Currently Impersonating</p>
              <div className="flex items-center gap-3">
                <FaUserSecret className="text-2xl text-blue-400" />
                <div>
                  <h4 className="font-bold text-lg text-white">{impersonatedUser.name || 'Participant'}</h4>
                  <p className="text-xs text-gray-400">{impersonatedUser.referenceNumber}</p>
                </div>
              </div>
            </div>
            <button onClick={() => onImpersonate(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-bold transition">
              Stop Impersonating
            </button>
          </div>
        ) : (
          
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-4 bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-4">
            <label className="text-xs text-orange-400 font-bold uppercase tracking-wider whitespace-nowrap"><FaExclamationTriangle className="inline mr-1" /> Scenario Preset:</label>
            <select 
              className="w-full bg-gray-900 border border-gray-600 text-white rounded p-1.5 text-sm focus:outline-none focus:border-orange-500"
              onChange={(e) => {
                const scenario = PREVIEW_SCENARIOS.find(s => s.id === e.target.value);
                if (scenario) {
                  onPreviewCategory(scenario.category);
                  onPreviewStatus(scenario.status);
                  onPreviewModes(scenario.modes);
                  onImpersonate(null);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Select a testing scenario --</option>
              {PREVIEW_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Preview Category</label>
              <select 
                value={currentCategory} 
                onChange={e => onPreviewCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Public Landing --</option>
                {PARTICIPANT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Registration Status</label>
              <select 
                value={currentStatus} 
                onChange={e => onPreviewStatus(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="NOT_REGISTERED">Not Registered</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REVISION_REQUIRED">Revision Required</option>
                <option value="REJECTED">Rejected</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Participation Modes</label>
              <div className="bg-gray-800 border border-gray-700 p-2 rounded max-h-32 overflow-y-auto space-y-1">
                {MODES.map(mode => (
                  <label key={mode} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={currentModes.includes(mode)}
                      onChange={() => toggleMode(mode)}
                      className="accent-orange-500 rounded"
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Preview Actual Participant</label>
              <button 
                onClick={() => onImpersonate({ name: 'FAYAZ AHMAD KHAN', referenceNumber: 'SKC-STK-000008', status: 'APPROVED', categoryLabel: 'Artisan / Weaver', registrationType: 'INDIVIDUAL', approvedParticipationModes: ["Online Survey", "Validation Review", "Field Consultation"] })}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm flex items-center justify-center gap-2 transition"
              >
                <FaUserSecret /> FAYAZ AHMAD KHAN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
