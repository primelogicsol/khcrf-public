'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaImage, FaVideo, FaVolumeUp, FaFilePdf, FaFileArchive, FaCube, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

interface MediaListProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
}

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'IMAGE': return <FaImage />;
    case 'VIDEO': return <FaVideo />;
    case 'AUDIO': return <FaVolumeUp />;
    case 'DOCUMENT': return <FaFilePdf />;
    case 'ARCHIVE': return <FaFileArchive />;
    case 'CAD':
    case 'MODEL_3D': return <FaCube />;
    default: return <FaImage />;
  }
};

export function MediaList({ onEdit, onCreate }: MediaListProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mediaType, setMediaType] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const typeParam = mediaType ? `&mediaType=${mediaType}` : '';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_BASE_URL}/api/media?take=100${typeParam}${searchParam}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setMedia(data.data || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [mediaType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft delete this media asset?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchMedia();
      } else {
        alert('Failed to delete media');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-serif text-[#3E2723]">Media Library</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Universal Asset Management</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-[#3E2723] text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2"
        >
          <FaUpload /> Upload New
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border border-gray-300 px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by filename, title, caption..." 
            className="flex-1 outline-none text-sm text-[#3E2723]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <select 
          value={mediaType} 
          onChange={e => setMediaType(e.target.value)}
          className="border border-gray-300 px-3 py-2 text-sm text-[#3E2723] outline-none"
        >
          <option value="">All Types</option>
          <option value="IMAGE">Images</option>
          <option value="VIDEO">Videos</option>
          <option value="AUDIO">Audio</option>
          <option value="DOCUMENT">Documents</option>
          <option value="ARCHIVE">Archives</option>
          <option value="CAD">CAD</option>
          <option value="MODEL_3D">3D Models</option>
        </select>
        <button onClick={fetchMedia} className="bg-gray-100 text-gray-700 px-6 text-xs font-bold uppercase tracking-widest border border-gray-300">
          Filter
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm uppercase tracking-widest font-bold">
          Loading Media...
        </div>
      ) : media.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300">
          <p className="text-gray-500 font-serif text-lg mb-2">No media found.</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Upload a new asset to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map(asset => (
            <div key={asset.id} className="border border-gray-200 shadow-sm relative group overflow-hidden bg-gray-50 flex flex-col">
              <div className="aspect-square flex items-center justify-center bg-gray-200 overflow-hidden relative">
                {asset.mediaType === 'IMAGE' && (asset.thumbnailUrl || asset.publicUrl) ? (
                  <img src={asset.thumbnailUrl || asset.publicUrl} alt={asset.altText || asset.fileName} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-4xl text-gray-400">
                    {getMediaIcon(asset.mediaType)}
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                  {asset.mediaType}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="font-bold text-[#3E2723] text-xs truncate" title={asset.title || asset.fileName}>
                  {asset.title || asset.fileName}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-1 truncate">
                  {asset.storageProvider}
                </div>
                <div className="mt-3 flex justify-between items-center">
                   <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold border border-gray-200 px-1 rounded">
                     {asset.license || 'All Rights Reserved'}
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => onEdit(asset.id)} className="text-blue-600 hover:text-blue-800" title="Edit Metadata"><FaEdit /></button>
                     <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-800" title="Soft Delete"><FaTrash /></button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
