"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { FaArrowLeft, FaRobot, FaSpinner, FaTimesCircle, FaCode, FaNetworkWired } from "react-icons/fa";

interface Publication {
  id: string;
  title: string;
  author: string;
  slug: string;
  relatedCrafts?: string;
  relatedPolicies?: string;
  relatedPubs?: string;
  seoDescription?: string;
}

export default function AICitationPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [pub, setPub] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      api.get(`/publications/${resolvedId}`)
        .then(res => setPub(res.data))
        .catch(() => setPub(null))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <FaSpinner className="animate-spin text-teal-500 text-3xl" />
    </div>
  );

  if (!pub) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
      <FaTimesCircle className="text-red-400 text-4xl mb-4" />
      <p className="text-lg font-bold text-gray-700">Publication not found</p>
      <button onClick={() => router.back()} className="mt-4 text-sm text-teal-600 font-bold hover:underline">← Go Back</button>
    </div>
  );

  const authors = pub.author ? pub.author.split(",").map(a => a.trim()) : ["Unknown Author"];
  
  const entities = [];
  if (pub.relatedCrafts) entities.push(...pub.relatedCrafts.split(",").map(s => s.trim()));
  if (pub.relatedPolicies) entities.push(...pub.relatedPolicies.split(",").map(s => s.trim()));
  if (pub.relatedPubs) entities.push(...pub.relatedPubs.split(",").map(s => s.trim()));
  
  const uniqueEntities = Array.from(new Set(entities.filter(Boolean)));

  const payload = {
    title: pub.title || "Untitled",
    authors: authors,
    authority_score: 91, // Simulated authority score
    citation_target: `https://khcrf.org/publications/${pub.slug}`,
    knowledge_entities: uniqueEntities.length > 0 ? uniqueEntities : ["Heritage Craft", "Authentication"],
    context_snippet: pub.seoDescription || "A study on heritage craft documentation and preservation."
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/business/publications/add?edit=${id}`} className="text-stone-400 hover:text-stone-700 transition-colors">
              <FaArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-stone-900">AI Citation & RAG Target</h1>
              <p className="text-sm text-stone-500">Preview the JSON payload provided to LLMs and semantic search indexers.</p>
            </div>
          </div>
        </div>

        {/* Payload Display */}
        <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl border border-stone-800">
          <div className="bg-stone-950 px-6 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3 text-stone-400 text-xs font-bold font-mono">
              <FaRobot className="text-teal-400" /> application/json
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm font-mono leading-relaxed text-teal-50">
              <code dangerouslySetInnerHTML={{
                __html: JSON.stringify(payload, null, 2)
                  .replace(/"(.*?)":/g, '<span class="text-blue-300">"$1"</span>:')
                  .replace(/: "(.*?)"/g, ': <span class="text-amber-300">"$1"</span>')
                  .replace(/: (\d+)/g, ': <span class="text-purple-300">$1</span>')
                  .replace(/\[/g, '<span class="text-stone-400">[</span>')
                  .replace(/\]/g, '<span class="text-stone-400">]</span>')
                  .replace(/\{/g, '<span class="text-stone-400">{</span>')
                  .replace(/\}/g, '<span class="text-stone-400">}</span>')
              }} />
            </pre>
          </div>
        </div>

        {/* Explanation blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stone-800 font-bold border-b border-stone-100 pb-2">
              <FaCode className="text-blue-500" /> Vector Database Indexing
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              When this publication is published, its context snippet and entities are embedded into the Foundation's vector database. LLM assistants use this payload to retrieve precise facts and generate verifiable citations in user queries.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stone-800 font-bold border-b border-stone-100 pb-2">
              <FaNetworkWired className="text-amber-500" /> Knowledge Graph Linkage
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              The <strong>knowledge_entities</strong> array allows the publication to automatically surface in relationship queries (e.g., "Show me all research linked to Pashmina"). The authority score weights the importance of the citation in the final generation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
