'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaLink, FaImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const API_BASE_URL = getBaseUrlNoApi();

const ENTITY_TYPES = ['CRAFT', 'MATERIAL', 'TOOL', 'TECHNIQUE', 'MOTIF', 'PRODUCT', 'GLOSSARY', 'ARTISAN', 'COLLECTION', 'HERITAGE_OBJECT', 'MEDIA', 'RESEARCH_PAPER'];

export function DiscoveryEngine() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const typeFilter = activeFilters.length > 0 ? `&entityTypes=${activeFilters.join(',')}` : '';
      const res = await fetch(`${API_BASE_URL}/api/search/discovery?q=${encodeURIComponent(query)}${typeFilter}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [query, activeFilters]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-xl font-serif text-[#3E2723] flex items-center gap-2 mb-2">
          <FaSearch data-ui-icon  className="" /> Institutional Discovery Engine
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Unified Knowledge & Heritage Search</p>
      </div>

      <div className="mb-6 flex gap-4 relative">
        <div className="flex-grow relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title, keywords, aliases, or slugs across the entire institution..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 text-sm focus:border-[#3E2723] outline-none rounded-sm"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-400 text-xs" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Filter by Entity Type</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ENTITY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold rounded-full transition-colors border ${
                activeFilters.includes(type) 
                  ? 'bg-brand-secondary text-white border-brand-secondary' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723]">Search Results</h3>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{total} matches found</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm uppercase tracking-widest font-bold border border-dashed border-gray-200 bg-gray-50">
            Searching Knowledge Graph...
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center text-gray-500 border border-dashed border-gray-200 bg-gray-50">
            <p className="font-serif text-lg mb-2">No results found.</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Try adjusting your keywords or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-sm hover:border-brand-secondary transition-all group flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md">
                {item.primaryImage && (
                  <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
                    <img src={item.primaryImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                      {item.entityType.replace(/_/g, ' ')}
                    </span>
                    {item.verificationStatus === 'VERIFIED' && (
                      <span className="text-green-600" title="Verified">
                        <FaCheckCircle className="text-xs" />
                      </span>
                    )}
                    {item.verificationStatus === 'UNVERIFIED' && (
                      <span className="text-amber-500" title="Unverified">
                        <FaExclamationTriangle className="text-xs" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-[#3E2723] mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.summary && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-grow">
                      {item.summary}
                    </p>
                  )}
                  <div className="pt-4 border-t border-gray-100 mt-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" title="Relationships">
                        <FaLink /> {item.relationshipCount || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Media Assets">
                        <FaImage /> {item.mediaAssets?.length || 0}
                      </span>
                    </div>
                    <Link href={`/dashboard/institutional-cms/entities/${item.id}`} className="text-brand-secondary hover:underline">
                      View Entity &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
