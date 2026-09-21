'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { LifecycleBadge, VisibilityBadge, VerificationBadge } from './EntityStatusBadge';

const API_BASE_URL = getBaseUrlNoApi();

interface EntityListProps {
  entityType?: string;
  title: string;
  apiEndpoint?: string;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export function EntityList({ entityType, title, apiEndpoint = '/api/knowledge', onEdit, onCreate }: EntityListProps) {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEntities = async () => {
    setLoading(true);
    try {
      // If entityType is not provided, fetch all
      const typeParam = entityType ? `&entityType=${entityType}` : '';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const separator = apiEndpoint.includes('?') ? '&' : '?';
      const res = await fetch(`${API_BASE_URL}${apiEndpoint}${separator}take=100${typeParam}${searchParam}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEntities(data.data || data); // handle standard response or generic response
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [entityType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEntities();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft delete this entity?')) return;
    try {
      const endpointBase = apiEndpoint.split('?')[0];
      const res = await fetch(`${API_BASE_URL}${endpointBase}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchEntities();
      } else {
        alert('Failed to delete entity');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-serif text-[#3E2723]">{title}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Manage knowledge records</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-[#3E2723] text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2"
        >
          <FaPlus /> Create New
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border border-gray-300 px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by title, slug, or metadata..." 
            className="flex-1 outline-none text-sm text-[#3E2723]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>
        <button onClick={fetchEntities} className="bg-gray-100 text-gray-700 px-6 text-xs font-bold uppercase tracking-widest border border-gray-300">
          Filter
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm uppercase tracking-widest font-bold">
          Loading Data...
        </div>
      ) : entities.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300">
          <p className="text-gray-500 font-serif text-lg mb-2">No records found.</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Adjust filters or create a new entity.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="py-3 px-4 font-bold">Title & Slug</th>
                {!entityType && <th className="py-3 px-4 font-bold">Type</th>}
                <th className="py-3 px-4 font-bold">Lifecycle</th>
                <th className="py-3 px-4 font-bold">Verification</th>
                <th className="py-3 px-4 font-bold">Visibility</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entities.map(entity => (
                <tr key={entity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-[#3E2723] text-sm">{entity.title}</div>
                      {entity.isDemo && (
                        <span className="bg-purple-100 text-purple-800 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Demo</span>
                      )}
                      {entity.isSeedData && (
                        <span className="bg-orange-100 text-orange-800 text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Seed</span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1">{entity.slug}</div>
                  </td>
                  {!entityType && (
                    <td className="py-4 px-4 text-xs font-bold text-gray-700">
                      {entity.entityType}
                    </td>
                  )}
                  <td className="py-4 px-4">
                    <LifecycleBadge status={entity.lifecycle} />
                  </td>
                  <td className="py-4 px-4">
                    <VerificationBadge status={entity.verificationStatus} />
                  </td>
                  <td className="py-4 px-4">
                    <VisibilityBadge status={entity.visibility} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button onClick={() => onEdit(entity.id)} className="text-blue-600 hover:text-blue-800 mr-4 text-sm" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(entity.id)} className="text-red-600 hover:text-red-800 text-sm" title="Soft Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
