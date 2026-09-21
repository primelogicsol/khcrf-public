"use client";

import React from "react";

interface PublicationKnowledgeGraphRefsProps {
  relatedCrafts?: string[] | string;
  relatedPolicies?: string[] | string;
}

export default function PublicationKnowledgeGraphRefs({
  relatedCrafts = [],
  relatedPolicies = [],
}: PublicationKnowledgeGraphRefsProps) {
  const crafts = Array.isArray(relatedCrafts) 
    ? relatedCrafts 
    : (relatedCrafts ? String(relatedCrafts).split(",").map((c) => c.trim()).filter(Boolean) : []);
  
  if (crafts.length === 0) crafts.push("Pashmina Spinning", "Kani Loom Weaving");

  const policies = Array.isArray(relatedPolicies) 
    ? relatedPolicies 
    : (relatedPolicies ? String(relatedPolicies).split(",").map((p) => p.trim()).filter(Boolean) : []);
    
  if (policies.length === 0) policies.push("GI Act 1999", "Kashmir Handicrafts Quality Control Act");

  const hasCrafts = crafts.length > 0;
  const hasPolicies = policies.length > 0;

  if (!hasCrafts && !hasPolicies) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
        Knowledge Graph References
      </h2>
      <div className="bg-white border border-stone-200/60 rounded-2xl p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 text-xs break-words">
        {hasCrafts && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">
              Related Craft Typologies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {crafts.map((craft, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-lg font-bold"
                >
                  {craft}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasPolicies && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">
              Linked Policy Standards
            </span>
            <div className="flex flex-wrap gap-1.5">
              {policies.map((policy, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-bold"
                >
                  {policy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
