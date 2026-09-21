"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaDownload, FaEye, FaPlus, FaEdit, FaTrash, FaCloudUploadAlt, FaHistory, FaChevronLeft,
  FaFilePdf, FaCheckCircle, FaSpinner, FaTimes, FaSave, FaExclamationTriangle, FaSearch
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

interface ResourceVersion {
  id: string;
  version: string;
  status: string;
  fileUrl: string;
  originalFilename: string;
  publicFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  checksum: string;
  createdBy: string;
  notes: string;
  publishedAt: string;
  createdAt?: string;
}

interface Resource {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  category: string;
  documentType: string;
  version: string;
  status: string;
  language: string;
  fileUrl: string;
  storageKey?: string;
  originalFilename?: string;
  publicFilename?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  checksum?: string;
  publicationDate?: string;
  effectiveDate?: string;
  expiryDate?: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  versions?: ResourceVersion[];
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'Registration', 'Verification', 'Benefits', 'Offline Forms', 'Privacy', 
  'Evidence', 'Hearings', 'Validation', 'Methodology', 'Recognition'
];

const STATUSES = ['DRAFT', 'UNDER_REVIEW', 'SCHEDULED', 'ACTIVE', 'SUPERSEDED', 'ARCHIVED', 'WITHDRAWN'];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ks', label: 'Kashmiri' }
];

export default function DownloadCenterManagementPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Edit/Create state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Partial<Resource>>({});
  const [uploading, setUploading] = useState(false);
  
  // History viewing state
  const [selectedHistoryResource, setSelectedHistoryResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      if (selectedStatus !== 'all') queryParams.append('status', selectedStatus);
      if (search.trim()) queryParams.append('search', search.trim());

      const res = await fetch(`/api/backend/skc/stakeholder-registry/resources/admin/all?${queryParams.toString()}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch resources');
      
      const json = await res.json();
      if ((json.success || json.status === 'success') && json.data) {
        setResources(json.data);
      } else {
        throw new Error(json.message || 'Unknown error');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not load registry resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are allowed.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds maximum 5MB limit.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/backend/skc/stakeholder-registry/resources/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) throw new Error('File upload failed');
      const json = await res.json();
      
      if (json.success && json.data) {
        setEditingResource(prev => ({
          ...prev,
          fileUrl: json.data.fileUrl,
          storageKey: json.data.storageKey,
          originalFilename: json.data.originalFilename,
          mimeType: json.data.mimeType,
          fileSizeBytes: json.data.fileSizeBytes,
          checksum: json.data.checksum,
        }));
        toast.success('Document uploaded successfully.');
      } else {
        throw new Error(json.message || 'Unknown upload response');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Submit Save/Edit Resource
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    // Validation
    if (!editingResource.title || !editingResource.slug || !editingResource.shortDescription || !editingResource.category || !editingResource.documentType || !editingResource.version || !editingResource.fileUrl) {
      toast.error('Please fill in all required fields and upload a PDF.');
      return;
    }

    try {
      const isEdit = !!editingResource.id;
      const url = isEdit 
        ? `/api/backend/skc/stakeholder-registry/resources/admin/update/${editingResource.id}`
        : `/api/backend/skc/stakeholder-registry/resources/admin/create`;
      
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingResource),
        credentials: 'include'
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Save operation failed');
      }

      toast.success(isEdit ? 'Resource updated successfully.' : 'Resource created successfully.');
      setIsModalOpen(false);
      setEditingResource({});
      fetchResources();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save resource.');
    }
  };

  // Archive Resource Handler
  const handleArchiveResource = async (id: string) => {
    if (!confirm('Are you sure you want to archive this resource? It will be hidden from the public view.')) return;
    try {
      const res = await fetch(`/api/backend/skc/stakeholder-registry/resources/admin/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to archive resource');
      
      toast.success('Resource archived.');
      fetchResources();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not archive.');
    }
  };

  // Helpers for Metrics
  const totalViews = resources.reduce((acc, r) => acc + r.viewCount, 0);
  const totalDownloads = resources.reduce((acc, r) => acc + r.downloadCount, 0);
  const activeCount = resources.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-gray-800">
      <Toaster position="top-right" />
      
      {/* Top Navigation Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Link href="/dashboard/skc" className="hover:text-brand-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/skc/stakeholders" className="hover:text-brand-primary">Stakeholder Registry</Link>
            <span>/</span>
            <span className="text-brand-primary">Download Center</span>
          </div>
          <h1 className="text-3xl font-black text-brand-dark flex items-center gap-3">
            <FaFilePdf data-ui-icon  className=" text-2xl" /> Download Center Registry
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish and manage official PDF guidelines, offline forms, checklists, and legal disclosures dynamically.
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingResource({
              title: '',
              slug: '',
              shortDescription: '',
              longDescription: '',
              category: 'Registration',
              documentType: 'Guidelines',
              version: '1.0.0',
              status: 'DRAFT',
              language: 'en',
              displayOrder: 0,
              isFeatured: false,
              isPublic: true,
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition text-sm flex items-center gap-2 cursor-pointer shadow-md"
        >
          <FaPlus /> Create Resource
        </button>
      </div>

      {/* Analytics Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div data-ui-icon className="p-4 bg-brand-primary/10 rounded-xl  text-2xl">
            <FaFilePdf />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase">Active Documents</div>
            <div className="text-2xl font-black text-brand-dark">{activeCount}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500 text-2xl">
            <FaEye />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase">Total Previews/Views</div>
            <div className="text-2xl font-black text-brand-dark">{totalViews}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-xl text-green-500 text-2xl">
            <FaDownload />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase">Total Downloads</div>
            <div className="text-2xl font-black text-brand-dark">{totalDownloads}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500 text-2xl">
            <FaHistory />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase">Last Published Version</div>
            <div className="text-md font-black text-brand-dark">
              {resources.length > 0 ? `${resources[0].title} v${resources[0].version}` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Search Resource</label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description or slug..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm cursor-pointer shadow-sm"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Main List Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
            <div className="font-bold">Fetching resources registry...</div>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <FaExclamationTriangle className="text-4xl mx-auto mb-3 text-amber-500" />
            <div className="font-bold text-lg">No resources registered yet</div>
            <p className="text-sm mt-1">Get started by creating a new document guidelines or form above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4">Resource Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Stats (Views/DLs)</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((res) => {
                  const sizeKB = res.fileSizeBytes ? `${(res.fileSizeBytes / 1024).toFixed(1)} KB` : 'N/A';
                  
                  // Helper color for status badges
                  let statusBadgeColor = 'bg-gray-100 text-gray-800';
                  if (res.status === 'ACTIVE') statusBadgeColor = 'bg-green-100 text-green-800';
                  else if (res.status === 'UNDER_REVIEW') statusBadgeColor = 'bg-amber-100 text-amber-800';
                  else if (res.status === 'SCHEDULED') statusBadgeColor = 'bg-blue-100 text-blue-800';
                  else if (res.status === 'SUPERSEDED') statusBadgeColor = 'bg-orange-100 text-orange-800';
                  else if (res.status === 'ARCHIVED' || res.status === 'WITHDRAWN') statusBadgeColor = 'bg-red-100 text-red-800';

                  return (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <FaFilePdf data-ui-icon  className="text-2xl  mt-0.5 shrink-0" />
                          <div>
                            <div className="font-bold text-brand-dark">{res.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                              <span>Slug: {res.slug}</span>
                              <span>•</span>
                              <span>{sizeKB}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-600">{res.category}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-dark rounded text-xs font-bold">
                          v{res.version}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${statusBadgeColor}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><FaEye className="text-gray-300" /> {res.viewCount}</span>
                          <span className="flex items-center gap-1"><FaDownload className="text-gray-300" /> {res.downloadCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-xs">
                        {res.updatedAt ? new Date(res.updatedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedHistoryResource(res);
                            }}
                            title="Version History"
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
                          >
                            <FaHistory />
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingResource({ ...res });
                              setIsModalOpen(true);
                            }}
                            title="Edit Resource"
                            className="p-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-icon-on-light rounded-lg transition"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleArchiveResource(res.id)}
                            disabled={res.status === 'ARCHIVED'}
                            title="Archive Resource"
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <FaTrash />
                          </button>

                          <a
                            href={`/state-of-kashmir-crafts/documents/${res.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Preview Public Appearance"
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition flex items-center justify-center"
                          >
                            <FaEye />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resource Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
                {editingResource.id ? <FaEdit /> : <FaPlus />} {editingResource.id ? 'Edit Resource' : 'Create Registry Resource'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingResource({});
                }}
                className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveResource} className="flex-grow p-6 overflow-y-auto space-y-6">
              
              {/* Document Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={editingResource.title || ''}
                    onChange={e => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                      setEditingResource(prev => ({
                        ...prev,
                        title,
                        slug: prev.id ? prev.slug : slug // Only auto-fill slug for new records
                      }));
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
                    placeholder="e.g. Registry Guidelines 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">URL Slug *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingResource.id}
                    value={editingResource.slug || ''}
                    onChange={e => setEditingResource(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="e.g. registry-guidelines-2026"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Short Description *</label>
                <input
                  type="text"
                  required
                  value={editingResource.shortDescription || ''}
                  onChange={e => setEditingResource(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
                  placeholder="Concise overview card description..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Long Description (Optional)</label>
                <textarea
                  value={editingResource.longDescription || ''}
                  onChange={e => setEditingResource(prev => ({ ...prev, longDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
                  placeholder="Detailed context showing on document info page..."
                />
              </div>

              {/* Categorization & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category *</label>
                  <select
                    value={editingResource.category || 'Registration'}
                    onChange={e => setEditingResource(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Document Type *</label>
                  <input
                    type="text"
                    required
                    value={editingResource.documentType || 'Guidelines'}
                    onChange={e => setEditingResource(prev => ({ ...prev, documentType: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
                    placeholder="e.g. Guidelines, Checklist, Form"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Version *</label>
                  <input
                    type="text"
                    required
                    value={editingResource.version || '1.0.0'}
                    onChange={e => setEditingResource(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-800"
                    placeholder="e.g. 1.0.0"
                  />
                </div>
              </div>

              {/* Status and Visibility Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Workflow Status *</label>
                  <select
                    value={editingResource.status || 'DRAFT'}
                    onChange={e => setEditingResource(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Language *</label>
                  <select
                    value={editingResource.language || 'en'}
                    onChange={e => setEditingResource(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
                  >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Order</label>
                  <input
                    type="number"
                    value={editingResource.displayOrder || 0}
                    onChange={e => setEditingResource(prev => ({ ...prev, displayOrder: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Version History Notes */}
              {editingResource.id && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Version Change Notes</label>
                  <input
                    type="text"
                    name="versionNotes"
                    onChange={e => setEditingResource(prev => ({ ...prev, versionNotes: e.target.value } as any))}
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-sm focus:outline-none bg-amber-50/20 text-gray-800"
                    placeholder="Describe what changed in this version update..."
                  />
                </div>
              )}

              {/* Upload Panel */}
              <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-center gap-3">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                
                <FaCloudUploadAlt className="text-4xl text-gray-400" />
                
                <div>
                  <label
                    htmlFor="pdf-upload"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-sm cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition text-brand-dark inline-block"
                  >
                    {uploading ? 'Uploading...' : 'Choose PDF Document'}
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">PDF file format only (Max 5MB)</p>
                </div>

                {editingResource.fileUrl && (
                  <div className="w-full bg-white border border-green-200 p-3 rounded-xl flex items-center justify-between text-xs text-green-700">
                    <span className="flex items-center gap-2"><FaCheckCircle /> Document attached: <strong>{editingResource.originalFilename}</strong></span>
                    {editingResource.fileSizeBytes && <span className="font-bold">({(editingResource.fileSizeBytes / 1024).toFixed(1)} KB)</span>}
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!editingResource.isFeatured}
                    onChange={e => setEditingResource(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                  Featured Document
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!editingResource.isPublic}
                    onChange={e => setEditingResource(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                  Visible Publicly
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingResource({});
                  }}
                  className="px-5 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <FaSave /> Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Version History Drawer/Modal */}
      {selectedHistoryResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
                <FaHistory /> Version History: {selectedHistoryResource.title}
              </h2>
              <button
                onClick={() => setSelectedHistoryResource(null)}
                className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {selectedHistoryResource.versions && selectedHistoryResource.versions.length > 0 ? (
                selectedHistoryResource.versions.map((ver) => (
                  <div key={ver.id} className="border border-gray-200 p-4 rounded-2xl flex flex-col gap-2 relative bg-gray-50/50">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 bg-brand-primary text-white text-xs font-bold rounded-md">
                        v{ver.version}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(ver.publishedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">Original file:</span> <span className="font-mono text-gray-700">{ver.originalFilename}</span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">Checksum (SHA256):</span> <span className="font-mono bg-white px-2 py-0.5 border border-gray-100 rounded text-[10px] break-all">{ver.checksum || 'N/A'}</span>
                    </div>

                    <div className="text-xs text-gray-500 italic mt-1 bg-white border border-gray-100 p-2 rounded-xl">
                      &ldquo;{ver.notes || 'No change notes provided.'}&rdquo;
                    </div>
                    
                    <div className="text-[10px] text-gray-400 mt-1">
                      Uploaded by: <span className="font-semibold">{ver.createdBy}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 italic">
                  No historical versions cataloged for this resource.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedHistoryResource(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
