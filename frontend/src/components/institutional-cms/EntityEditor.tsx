'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

interface EntityEditorProps {
  entityId?: string | null;
  entityType?: string;
  onBack: () => void;
  onSaved: () => void;
}

export function EntityEditor({ entityId, entityType, onBack, onSaved }: EntityEditorProps) {
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    summary: '',
    entityType: entityType || 'CRAFT',
    lifecycle: 'DRAFT',
    visibility: 'INTERNAL',
    verificationStatus: 'UNVERIFIED',
    sensitivity: 'NONE',
    isDemo: false,
    isSeedData: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entityId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/knowledge/${entityId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            summary: data.summary || '',
            entityType: data.entityType || 'CRAFT',
            lifecycle: data.lifecycle || 'DRAFT',
            visibility: data.visibility || 'INTERNAL',
            verificationStatus: data.verificationStatus || 'UNVERIFIED',
            sensitivity: data.sensitivity || 'NONE',
            isDemo: !!data.isDemo,
            isSeedData: !!data.isSeedData
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load entity data');
          setLoading(false);
        });
    }
  }, [entityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = entityId 
        ? `${API_BASE_URL}/api/knowledge/${entityId}`
        : `${API_BASE_URL}/api/knowledge`;
        
      const method = entityId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save entity');
      }

      onSaved();
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && entityId) {
    return <div className="p-10 text-center text-sm font-bold uppercase tracking-widest text-gray-500">Loading Editor...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-600 hover:text-[#3E2723] flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
          <FaArrowLeft /> Back to List
        </button>
        <h2 className="text-lg font-serif text-[#3E2723]">
          {entityId ? 'Edit Entity' : 'Create New Entity'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 text-sm border border-red-200 font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none h-32"
          />
        </div>

        <div className="flex gap-6 pt-2 pb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <input
              type="checkbox"
              name="isDemo"
              checked={formData.isDemo}
              onChange={handleChange}
              className="accent-[#3E2723]"
            />
            Demonstration Record
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <input
              type="checkbox"
              name="isSeedData"
              checked={formData.isSeedData}
              onChange={handleChange}
              className="accent-[#3E2723]"
            />
            Seeded Initial Data
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Entity Type</label>
            <select name="entityType" value={formData.entityType} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="CRAFT">Craft</option>
              <option value="MATERIAL">Material</option>
              <option value="TOOL">Tool</option>
              <option value="TECHNIQUE">Technique</option>
              <option value="MOTIF">Motif</option>
              <option value="PRODUCT">Product</option>
              <option value="GLOSSARY_TERM">Glossary Term</option>
              <option value="ARTISAN">Master Artisan / Person</option>
              <option value="STUDIO">Studio / Workshop</option>
              <option value="COLLECTION">Collection / Heritage</option>
              <option value="RESEARCH_PUBLICATION">Publication</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Lifecycle Status</label>
            <select name="lifecycle" value={formData.lifecycle} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Visibility</label>
            <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="PUBLIC">Public</option>
              <option value="INTERNAL">Internal</option>
              <option value="RESTRICTED">Restricted</option>
              <option value="ARCHIVE_ONLY">Archive Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Verification</label>
            <select name="verificationStatus" value={formData.verificationStatus} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="UNVERIFIED">Unverified</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="PARTIALLY_VERIFIED">Partially Verified</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3E2723] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Entity'}
          </button>
        </div>
      </form>
    </div>
  );
}
