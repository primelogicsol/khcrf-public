'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaLink, FaSearch, FaTrash, FaPlus, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

const RELATIONSHIP_TYPES = [
  'RELATES_TO',
  'USES_MATERIAL',
  'USES_TOOL',
  'USES_TECHNIQUE',
  'PRACTICES_CRAFT',
  'MENTORS',
  'PART_OF',
  'CREATED_BY',
  'APPEARS_IN',
  'REFERENCES',
  'DERIVED_FROM',
  'LOCATED_IN',
  'CERTIFIED_BY',
  'VERIFIED_BY',
  'DOCUMENTED_IN'
];

function EntitySearchInput({ label, value, onChange }: { label: string, value: any, onChange: (val: any) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setSearching(true);
      const timer = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/knowledge?take=10&search=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            setResults(data.data || data);
            setSearching(false);
            setIsOpen(true);
          })
          .catch(e => {
            console.error(e);
            setSearching(false);
          });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">{label}</label>
      {value ? (
        <div className="flex items-center justify-between border border-gray-300 p-3 bg-gray-50">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#3E2723]">{value.title}</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400">{value.entityType}</span>
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-xs text-red-500 uppercase tracking-widest font-bold hover:underline">Change</button>
        </div>
      ) : (
        <div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type to search entities..." 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none"
            />
            {searching && <span className="absolute right-3 top-3 text-xs text-gray-400">...</span>}
          </div>
          {isOpen && results.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-xl max-h-60 overflow-y-auto">
              {results.map(r => (
                <div 
                  key={r.id} 
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    onChange(r);
                    setQuery('');
                    setIsOpen(false);
                  }}
                >
                  <span className="text-sm font-bold text-[#3E2723]">{r.title}</span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{r.entityType}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RelationshipBuilder() {
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [sourceEntity, setSourceEntity] = useState<any>(null);
  const [targetEntity, setTargetEntity] = useState<any>(null);
  const [relationshipType, setRelationshipType] = useState(RELATIONSHIP_TYPES[0]);
  const [verificationStatus, setVerificationStatus] = useState('UNVERIFIED');
  const [confidenceScore, setConfidenceScore] = useState('100');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const fetchRelationships = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/relationship?take=100`);
      if (res.ok) {
        const data = await res.json();
        setRelationships(data.data || data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceEntity || !targetEntity) {
      setError('Both source and target entities must be selected.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/relationship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sourceEntityId: sourceEntity.id,
          targetEntityId: targetEntity.id,
          relationshipType,
          verificationStatus,
          confidenceScore: parseInt(confidenceScore, 10),
          notes
        })
      });
      
      if (res.ok) {
        setIsEditing(false);
        setSourceEntity(null);
        setTargetEntity(null);
        setNotes('');
        setVerificationStatus('UNVERIFIED');
        setConfidenceScore('100');
        fetchRelationships();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to create relationship.');
      }
    } catch (e: any) {
      setError(e.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/relationship/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRelationships();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-serif text-[#3E2723] flex items-center gap-2">
            <FaLink data-ui-icon  className="" /> Visual Relationship Builder
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Entity Link Management</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#3E2723] text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2"
          >
            <FaPlus /> Create New Link
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleCreate} className="mb-10 bg-gray-50 border border-gray-200 p-6 rounded-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723] mb-4">Create New Relationship</h3>
          
          {error && <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start mb-6">
            <div className="col-span-3">
              <EntitySearchInput label="Source Entity" value={sourceEntity} onChange={setSourceEntity} />
            </div>
            
            <div className="col-span-1 flex justify-center pt-8 text-gray-400">
              <FaLink className="text-2xl" />
            </div>
            
            <div className="col-span-3">
              <EntitySearchInput label="Target Entity" value={targetEntity} onChange={setTargetEntity} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Relationship Type</label>
              <select 
                value={relationshipType} 
                onChange={e => setRelationshipType(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none"
              >
                {RELATIONSHIP_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Verification Status</label>
              <select 
                value={verificationStatus} 
                onChange={e => setVerificationStatus(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none"
              >
                <option value="UNVERIFIED">Unverified</option>
                <option value="PARTIALLY_VERIFIED">Partially Verified</option>
                <option value="VERIFIED">Verified</option>
                <option value="DISPUTED">Disputed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Confidence Score (0-100)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={confidenceScore} 
                onChange={e => setConfidenceScore(e.target.value)} 
                className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Internal Notes / Source Justification</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-300 p-3 text-sm focus:border-[#3E2723] outline-none h-20"
              placeholder="Explain why this relationship exists..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3E2723] text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-[#3E2723] transition flex items-center gap-2"
            >
              Save Link
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); setError(''); }}
              className="bg-gray-200 text-gray-700 px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && !isEditing ? (
        <div className="py-20 text-center text-gray-400 text-sm uppercase tracking-widest font-bold">
          Loading Relationships...
        </div>
      ) : relationships.length === 0 && !isEditing ? (
        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300">
          <p className="text-gray-500 font-serif text-lg mb-2">No relationships found.</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Create a new link to start building the graph.</p>
        </div>
      ) : (
        !isEditing && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="p-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Source Entity</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Relationship</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Target Entity</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</th>
                  <th className="p-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {relationships.map(rel => (
                  <tr key={rel.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-bold text-sm text-[#3E2723]">{rel.sourceEntity?.title || rel.sourceEntityId}</div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400">{rel.sourceEntity?.entityType || 'UNKNOWN'}</div>
                    </td>
                    <td className="p-3">
                      <div data-editorial-accent-text className="bg-brand-secondary/10  px-2 py-1 rounded border border-brand-secondary/20 inline-block text-[10px] font-bold uppercase tracking-widest">
                        {rel.relationshipType.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-sm text-[#3E2723]">{rel.targetEntity?.title || rel.targetEntityId}</div>
                      <div className="text-[9px] uppercase tracking-widest text-gray-400">{rel.targetEntity?.entityType || 'UNKNOWN'}</div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${rel.verificationStatus === 'VERIFIED' ? 'text-green-600' : 'text-amber-600'}`}>
                        {rel.verificationStatus === 'VERIFIED' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {rel.verificationStatus}
                      </div>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(rel.id)} className="text-red-500 hover:text-red-700 p-2" title="Delete Link">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
