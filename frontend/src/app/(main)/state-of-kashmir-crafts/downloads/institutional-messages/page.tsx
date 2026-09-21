"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { FaArrowLeft, FaFileAlt, FaInfoCircle, FaDownload } from "react-icons/fa";



export default function InstitutionalMessagesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingtemplates, setLoadingtemplates] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {
        const items = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'TEMPLATES').map((d: any) => ({
          ...d.metadata,
          title: d.title,
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          id: d.id,
          icon: d.metadata.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
        }));
        setTemplates(items);
        setLoadingtemplates(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-brand-secondary hover:text-brand-primary font-bold transition mb-8">
          <FaArrowLeft /> Back to Official Messages
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm mb-8">
          <div className="mb-10 text-center border-b border-gray-100 pb-10">
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Institutional Messages Collection</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Templates and published messages from universities, institutes, trade bodies, and sector organizations.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex gap-4 items-start mb-12">
            <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-800 mb-1">Status: Open for Submission</h3>
              <p className="text-sm text-blue-700">
                The collection is currently gathering institutional messages. You may download a template below to prepare your submission.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-black text-brand-dark mb-6">Available Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {templates.map((tpl: any, idx: number) => (
                <div key={idx} className="border border-gray-200 p-6 rounded-2xl flex flex-col hover:border-brand-primary transition">
                  <FaFileAlt data-ui-icon  className="text-3xl  mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{tpl.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 flex-grow">{tpl.desc}</p>
                  <button className="w-full px-4 py-2 bg-gray-50 text-brand-dark font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm">
                    <FaDownload /> Download
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Required Metadata for Submission</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <li>Institution Name</li>
                <li>Representative Name</li>
                <li>Designation</li>
                <li>Date</li>
                <li>Message Text</li>
                <li>PDF Upload</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-brand-dark mb-6">Published Items</h2>
            <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
              No published institutional messages available in this collection yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
