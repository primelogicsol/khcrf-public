'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft, FaUpload } from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

interface MediaEditorProps {
  mediaId?: string | null;
  onBack: () => void;
  onSaved: () => void;
}

export function MediaEditor({ mediaId, onBack, onSaved }: MediaEditorProps) {
  const [formData, setFormData] = useState<any>({
    fileName: '',
    publicUrl: '',
    thumbnailUrl: '',
    title: '',
    caption: '',
    altText: '',
    credit: '',
    photographer: '',
    copyrightOwner: '',
    license: 'All Rights Reserved',
    attribution: '',
    sourceReference: '',
    mediaType: 'IMAGE',
    storageProvider: 'CLOUDINARY',
    storageKey: '',
    mimeType: '',
    sensitivityClassification: 'NONE'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mediaId) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/media/${mediaId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            fileName: data.fileName || '',
            publicUrl: data.publicUrl || '',
            thumbnailUrl: data.thumbnailUrl || '',
            title: data.title || '',
            caption: data.caption || '',
            altText: data.altText || '',
            credit: data.credit || '',
            photographer: data.photographer || '',
            copyrightOwner: data.copyrightOwner || '',
            license: data.license || 'All Rights Reserved',
            attribution: data.attribution || '',
            sourceReference: data.sourceReference || '',
            mediaType: data.mediaType || 'IMAGE',
            storageProvider: data.storageProvider || 'CLOUDINARY',
            storageKey: data.storageKey || '',
            mimeType: data.mimeType || '',
            sensitivityClassification: data.sensitivityClassification || 'NONE'
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load media data');
          setLoading(false);
        });
    }
  }, [mediaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mediaId ? `${API_BASE_URL}/api/media/${mediaId}` : `${API_BASE_URL}/api/media`;
      const method = mediaId ? 'PATCH' : 'POST';

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
        throw new Error(errorData.error || 'Failed to save media asset');
      }

      onSaved();
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && mediaId) {
    return <div className="p-10 text-center text-sm font-bold uppercase tracking-widest text-gray-500">Loading Editor...</div>;
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <button onClick={onBack} className="text-gray-600 hover:text-[#3E2723] flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
          <FaArrowLeft /> Back to List
        </button>
        <h2 className="text-lg font-serif text-[#3E2723]">
          {mediaId ? 'Edit Media Metadata' : 'Register New Media'}
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
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Public URL (Direct File Link)</label>
            <input type="text" name="publicUrl" value={formData.publicUrl} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" required />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Original Filename</label>
            <input type="text" name="fileName" value={formData.fileName} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Display Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Alt Text (Accessibility)</label>
            <input type="text" name="altText" value={formData.altText} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Extended Caption / Description</label>
          <textarea name="caption" value={formData.caption} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none h-24" />
        </div>

        <h3 className="text-sm font-bold border-b border-gray-200 pb-2 text-[#3E2723] uppercase tracking-widest">Attribution & Rights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Photographer / Creator</label>
            <input type="text" name="photographer" value={formData.photographer} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Copyright Owner</label>
            <input type="text" name="copyrightOwner" value={formData.copyrightOwner} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">License Type</label>
            <select name="license" value={formData.license} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="All Rights Reserved">All Rights Reserved</option>
              <option value="CC BY">CC BY (Attribution)</option>
              <option value="CC BY-SA">CC BY-SA (ShareAlike)</option>
              <option value="CC BY-NC">CC BY-NC (NonCommercial)</option>
              <option value="Public Domain">Public Domain</option>
            </select>
          </div>
        </div>

        <h3 className="text-sm font-bold border-b border-gray-200 pb-2 text-[#3E2723] uppercase tracking-widest mt-6">System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Media Type</label>
            <select name="mediaType" value={formData.mediaType} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="DOCUMENT">Document / PDF</option>
              <option value="ARCHIVE">ZIP / Archive</option>
              <option value="CAD">CAD</option>
              <option value="MODEL_3D">3D Model</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Storage Provider</label>
            <select name="storageProvider" value={formData.storageProvider} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="CLOUDINARY">Cloudinary</option>
              <option value="AWS_S3">AWS S3</option>
              <option value="LOCAL">Local</option>
              <option value="EXTERNAL">External URL</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Storage Key (ID)</label>
            <input type="text" name="storageKey" value={formData.storageKey} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Sensitivity</label>
            <select name="sensitivityClassification" value={formData.sensitivityClassification} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none">
              <option value="NONE">None</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="RESTRICTED">Restricted</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3E2723] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Media Metadata'}
          </button>
        </div>
      </form>
    </div>
  );
}
