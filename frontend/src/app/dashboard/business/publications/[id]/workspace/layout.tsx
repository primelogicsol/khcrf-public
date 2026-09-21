"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBook, FaList, FaPen, FaUpload, FaUsers, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '@/lib/api';

export default function WorkspaceLayout({ children, params }: { children: React.ReactNode, params: any }) {
  const pathname = usePathname();
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We need to unwrap params since it's a promise in Next 15, but we can do it with React.use() if needed.
  // Assuming params.id is available or unwrapped
  const [id, setId] = useState<string>('');

  useEffect(() => {
    // Basic unwrap hack
    Promise.resolve(params).then((p: any) => {
      setId(p.id);
      api.get(`/publications/${p.id}`)
         .then(res => setPublication(res.data))
         .catch(err => console.error(err))
         .finally(() => setLoading(false));
    });
  }, [params]);

  const tabs = [
    { id: 'metadata', label: 'Metadata', icon: FaBook, href: `/dashboard/business/publications/${id}/workspace/metadata` },
    { id: 'toc', label: 'Table of Contents', icon: FaList, href: `/dashboard/business/publications/${id}/workspace/toc` },
    { id: 'manuscript', label: 'Manuscript', icon: FaPen, href: `/dashboard/business/publications/${id}/workspace/manuscript` },
    { id: 'review', label: 'Peer Review', icon: FaUsers, href: `/dashboard/business/publications/${id}/workspace/review` },
    { id: 'publish', label: 'Publishing', icon: FaUpload, href: `/dashboard/business/publications/${id}/workspace/publish` },
  ];

  if (loading) return <div className="p-8 flex justify-center"><FaSpinner className="animate-spin text-teal-600 text-2xl" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col -m-6 md:-m-12" style={{ height: "calc(100vh - 5rem)" }}>
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/business/publications" className="p-2 text-stone-400 hover:text-brand-primary bg-stone-50 rounded-xl">
            <FaArrowLeft size={12} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">{publication?.publicationType || 'PUBLICATION'}</span>
              <h1 className="text-lg font-black text-gray-900 tracking-tight">{publication?.title || 'Editorial Workspace'}</h1>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Publication Pipeline</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-56 bg-white border-r border-stone-200 flex flex-col shrink-0">
          <div className="p-4 space-y-1">
            {tabs.map(tab => {
              const active = pathname.includes(`/workspace/${tab.id}`);
              return (
                <Link key={tab.id} href={tab.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-teal-50 text-teal-700 font-bold' : 'text-gray-500 hover:bg-stone-50 hover:text-gray-900'}`}>
                  <tab.icon size={12} className={active ? 'text-teal-600' : 'text-gray-400'} />
                  <span className="text-[11px]">{tab.label}</span>
                  {active && <div className="ml-auto w-1 h-4 bg-teal-600 rounded-full" />}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-stone-50 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
