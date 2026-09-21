"use client";
import React, { useState } from 'react';

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ entities: any[], taxonomies: any[], totalCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || query.length < 2) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();
      setResults(data as { entities: any[], taxonomies: any[], totalCount: number });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Global Search Engine</h1>
      
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities, crafts, artisans, taxonomies..."
          className="flex-1 p-4 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-8 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && (
        <div className="space-y-8">
          <p className="text-gray-500">Found {results.totalCount} results for "{query}"</p>
          
          {results.entities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b pb-2 mb-4">Knowledge Entities</h2>
              <div className="grid gap-4">
                {results.entities.map(ent => (
                  <div key={ent.id} className="p-4 bg-white rounded shadow-sm border hover:border-blue-300">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-blue-600">{ent.title}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full uppercase font-mono text-gray-600">{ent.entityType}</span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">{ent.summary}</p>
                    <div className="mt-4 flex gap-2">
                      <a href={`/dashboard/knowledge/${ent.id}`} className="text-sm text-blue-500 hover:underline">View Details</a>
                      <a href={`/dashboard/graph/${ent.id}`} className="text-sm text-purple-500 hover:underline">View Graph</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.taxonomies.length > 0 && (
            <div>
              <h2 className="text-xl font-bold border-b pb-2 mb-4">Taxonomies</h2>
              <div className="grid gap-4">
                {results.taxonomies.map(tax => (
                  <div key={tax.id} className="p-4 bg-white rounded shadow-sm border">
                    <h3 className="text-lg font-bold">{tax.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{tax.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {results.totalCount === 0 && (
            <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
              No results found for your query. Try different keywords.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
