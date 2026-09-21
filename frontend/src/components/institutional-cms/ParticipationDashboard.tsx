'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { 
  FaUserPlus, 
  FaBookOpen, 
  FaHandsHelping, 
  FaArchive, 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaEye, 
  FaDownload, 
  FaFileAlt, 
  FaExternalLinkAlt 
} from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

interface MediaAsset {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  publicUrl: string;
  fileName: string;
  sizeBytes?: number;
  mimeType?: string;
}

interface SubmissionItem {
  id: string;
  submissionNumber: string;
  status: string;
  createdAt: string;
  title?: string;
  nomineeName?: string;
  name?: string;
  craft?: string;
  type?: string;
  areasOfExpertise?: string;
  yearsOfPractice?: number;
  district?: string;
  nominatorInfo?: string;
  contactInfo?: string;
  contributor?: string;
  notes?: string;
  story?: string;
  source?: string;
  identityVerification?: string;
  portfolio?: string;
  reasonForJoining?: string;
  approximateDate?: string;
  location?: string;
  owner?: string;
  copyright?: string;
  usagePermission?: string;
  description?: string;
  mediaAssets?: MediaAsset[];
}

export function ParticipationDashboard() {
  const [activeTab, setActiveTab] = useState<'nominations' | 'stories' | 'contributors' | 'documentation'>('nominations');
  const [data, setData] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<SubmissionItem | null>(null);

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (tab === 'nominations') endpoint = '/api/participation/nominate';
      if (tab === 'stories') endpoint = '/api/participation/story';
      if (tab === 'contributors') endpoint = '/api/participation/contributor';
      if (tab === 'documentation') endpoint = '/api/participation/documentation';

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(activeTab);
    setSelectedItem(null);
  }, [activeTab]);

  const handleReview = async (id: string, newStatus: string) => {
    let endpoint = '';
    if (activeTab === 'nominations') endpoint = `/api/participation/nominate/${id}`;
    if (activeTab === 'stories') endpoint = `/api/participation/story/${id}`;
    if (activeTab === 'contributors') endpoint = `/api/participation/contributor/${id}`;
    if (activeTab === 'documentation') endpoint = `/api/participation/documentation/${id}`;

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem({ ...selectedItem, status: newStatus });
        }
        fetchData(activeTab); // refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const filteredData = data
    .filter(d => statusFilter === 'ALL' || d.status === statusFilter)
    .filter(d => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const num = (d.submissionNumber || '').toLowerCase();
      const primary = (d.title || d.nomineeName || d.name || '').toLowerCase();
      const craftVal = (d.craft || d.type || '').toLowerCase();
      return num.includes(q) || primary.includes(q) || craftVal.includes(q);
    });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#3E2723]">Institutional Participation & Intake</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-1">Review public submissions and verify knowledge</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-6 pt-4 gap-6">
        <button 
          onClick={() => setActiveTab('nominations')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'nominations' ? 'border-b-2 border-brand-primary text-icon-on-light' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaUserPlus /> Artisan Nominations
        </button>
        <button 
          onClick={() => setActiveTab('stories')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'stories' ? 'border-b-2 border-brand-primary text-icon-on-light' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaBookOpen /> Story Submissions
        </button>
        <button 
          onClick={() => setActiveTab('contributors')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'contributors' ? 'border-b-2 border-brand-primary text-icon-on-light' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaHandsHelping /> Contributors
        </button>
        <button 
          onClick={() => setActiveTab('documentation')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'documentation' ? 'border-b-2 border-brand-primary text-icon-on-light' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaArchive /> Support Documentation
        </button>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <div className="flex justify-between mb-6">
          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name, or Craft..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select 
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted (New)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm font-bold uppercase tracking-widest">Loading queue...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm font-bold uppercase tracking-widest">No records found in this queue.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Primary Info</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {filteredData.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{item.submissionNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#3E2723]">
                        {item.title || item.nomineeName || item.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate w-48">
                        {item.craft || item.type || item.areasOfExpertise || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                         item.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                         item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                         item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                         'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 text-gray-500 hover:text-brand-primary bg-white border border-gray-200 shadow-sm rounded transition-colors" 
                        title="Preview"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleReview(item.id, 'APPROVED')}
                        className="p-1.5 text-green-600 hover:text-white hover:bg-green-600 bg-white border border-green-200 shadow-sm rounded transition-colors" title="Approve">
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleReview(item.id, 'REJECTED')}
                        className="p-1.5 text-red-600 hover:text-white hover:bg-red-600 bg-white border border-red-200 shadow-sm rounded transition-colors" title="Reject">
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">{selectedItem.submissionNumber}</span>
                <h3 className="text-xl font-serif text-[#3E2723]">{selectedItem.title || selectedItem.nomineeName || selectedItem.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-100 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Submission Date</span>
                  <span className="font-semibold text-gray-700">{new Date(selectedItem.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Status</span>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                    selectedItem.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                    selectedItem.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    selectedItem.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedItem.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Nomination Fields */}
              {activeTab === 'nominations' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Craft Category</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.craft}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Years of Practice</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.yearsOfPractice} Years</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">District / Location</span>
                    <span className="text-sm text-gray-800">{selectedItem.district || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Nominator Details</span>
                    <span className="text-sm text-gray-800">{selectedItem.nominatorInfo || 'N/A'} ({selectedItem.contactInfo})</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Nomination Notes</span>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">{selectedItem.notes || 'No description provided.'}</p>
                  </div>
                </div>
              )}

              {/* Story Fields */}
              {activeTab === 'stories' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Author</span>
                      <span className="text-sm font-semibold text-gray-800">{(selectedItem as any).contributor}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact / Source</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.source}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Pitch & Synopsis</span>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">{selectedItem.story}</p>
                  </div>
                  {selectedItem.notes && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Internal Notes</span>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">{selectedItem.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contributor Fields */}
              {activeTab === 'contributors' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Expertise Areas</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.areasOfExpertise}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity Email</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.identityVerification}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Portfolio Link</span>
                    <a href={selectedItem.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-center gap-1.5 text-blue-600 hover:underline">
                      {selectedItem.portfolio} <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Motivation Statement</span>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">{selectedItem.reasonForJoining || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* Support Documentation Fields */}
              {activeTab === 'documentation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Material Type</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.type}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Approx Date / Era</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedItem.approximateDate || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Location Found</span>
                      <span className="text-sm text-gray-800">{selectedItem.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Owner / Institution</span>
                      <span className="text-sm text-gray-800">{selectedItem.owner || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Copyright Status</span>
                      <span className="text-sm text-gray-800">{selectedItem.copyright || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Usage Permission</span>
                      <span className="text-sm text-gray-800">{selectedItem.usagePermission || 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Context Description</span>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap leading-relaxed">{selectedItem.description}</p>
                  </div>
                </div>
              )}

              {/* Media Assets (Uploaded Files) */}
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Uploaded Artifacts & Media</span>
                {(!selectedItem.mediaAssets || selectedItem.mediaAssets.length === 0) ? (
                  <div className="text-xs text-gray-400 italic">No files were uploaded with this submission.</div>
                ) : (
                  <div className="space-y-3">
                    {selectedItem.mediaAssets.map((asset: MediaAsset) => (
                      <div key={asset.id} className="border border-gray-200 rounded p-3 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {asset.mediaType === 'IMAGE' ? (
                            <img src={asset.publicUrl} alt={asset.fileName} className="w-12 h-12 rounded object-cover border border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 border border-gray-300 text-gray-500 rounded flex items-center justify-center text-lg flex-shrink-0">
                              <FaFileAlt />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block text-sm text-[#3E2723] font-bold truncate">{asset.fileName}</span>
                            <span className="block text-[10px] uppercase text-gray-400 font-mono tracking-wider">{asset.mediaType} • {formatBytes(asset.sizeBytes || 0)}</span>
                          </div>
                        </div>
                        <a 
                          href={asset.publicUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-xs uppercase tracking-widest font-bold text-blue-600 hover:text-blue-800 transition-colors bg-white px-3 py-1.5 border border-blue-500/20 shadow-sm rounded-sm"
                        >
                          <FaDownload /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-gray-700"
              >
                Close Details
              </button>
              
              <div className="space-x-3">
                <button 
                  onClick={() => handleReview(selectedItem.id, 'REJECTED')}
                  disabled={selectedItem.status === 'REJECTED'}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-sm"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleReview(selectedItem.id, 'APPROVED')}
                  disabled={selectedItem.status === 'APPROVED'}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-sm"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
