'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaChartPie, FaLink, FaImage, FaBook, FaLanguage } from 'react-icons/fa';
import Link from 'next/link';

const API_BASE_URL = getBaseUrlNoApi();

export function KnowledgeHealthDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health/knowledge`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load health metrics');
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-10 text-center text-gray-500 uppercase tracking-widest font-bold text-xs">
        <FaHeartbeat data-ui-icon  className="animate-pulse  text-3xl mx-auto mb-4" />
        Evaluating Knowledge Graph Integrity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 shadow-sm rounded-sm p-10 text-center text-red-600">
        <FaExclamationTriangle className="text-3xl mx-auto mb-4" />
        <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Error Loading Metrics</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data || !data.metrics) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-10 text-center text-gray-500">
        <p>No knowledge entities found in the graph.</p>
      </div>
    );
  }

  const { metrics, records } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-serif text-[#3E2723] flex items-center gap-2">
              <FaHeartbeat data-ui-icon  className="" /> Knowledge Health Dashboard
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Data Completeness & Quality Scoring</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-serif text-[#3E2723]">{metrics.averageHealthScore}<span className="text-lg text-gray-400">/100</span></div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Average Institutional Health</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-[#3E2723] mb-1">{metrics.totalEntities}</div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Total Entities</p>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{metrics.verifiedPercentage}%</div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Verified Records</p>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">{records.entitiesNeedingReview.length}</div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Need Review</p>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{metrics.missingSources}</div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Missing Sources</p>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723] mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
          <FaChartPie className="text-gray-400" /> Graph Blind Spots
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="border-l-4 border-amber-400 bg-amber-50/50 p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-amber-800 mb-1">
              <FaBook /> <span className="font-bold text-lg">{metrics.missingSummaries}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Missing Summary</span>
          </div>
          
          <div className="border-l-4 border-blue-400 bg-blue-50/50 p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <FaLink /> <span className="font-bold text-lg">{metrics.missingRelationships}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-700">Orphaned (No Links)</span>
          </div>
          
          <div className="border-l-4 border-purple-400 bg-purple-50/50 p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-purple-800 mb-1">
              <FaImage /> <span className="font-bold text-lg">{metrics.missingMedia}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-purple-700">Missing Media</span>
          </div>
          
          <div className="border-l-4 border-emerald-400 bg-emerald-50/50 p-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-800 mb-1">
              <FaLanguage /> <span className="font-bold text-lg">{metrics.missingTranslations}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700">No Transliterations</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-700 mb-4 border-b border-red-100 pb-2">
              Critical Attention Needed (Bottom 10)
            </h3>
            <div className="space-y-2">
              {records.lowHealthRecords.map((r: any) => (
                <Link key={r.id} href={`/dashboard/institutional-cms/entities/${r.id}`} className="flex justify-between items-center p-3 border border-red-100 hover:border-red-300 bg-red-50/30 transition-colors group">
                  <div>
                    <div className="text-sm font-bold text-[#3E2723] group-hover:text-red-700">{r.title || 'Untitled'}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-500">{r.entityType}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Score: {r.healthScore}</span>
                    <span className="text-xs text-gray-400">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-4 border-b border-green-100 pb-2">
              Institutional Gold Standard (Top 10)
            </h3>
            <div className="space-y-2">
              {records.topHealthyRecords.map((r: any) => (
                <Link key={r.id} href={`/dashboard/institutional-cms/entities/${r.id}`} className="flex justify-between items-center p-3 border border-green-100 hover:border-green-300 bg-green-50/30 transition-colors group">
                  <div>
                    <div className="text-sm font-bold text-[#3E2723] group-hover:text-green-700">{r.title}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-500">{r.entityType}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Score: {r.healthScore}</span>
                    <span className="text-xs text-gray-400">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
