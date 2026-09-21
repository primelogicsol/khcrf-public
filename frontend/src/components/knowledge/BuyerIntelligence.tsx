"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function BuyerIntelligenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intentParam = searchParams.get('buyerIntent');

  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const [activeDecision, setActiveDecision] = useState<string | null>(null);

  useEffect(() => {
    if (intentParam) {
      setActiveIntent(intentParam);
    } else {
      setActiveIntent(null);
    }
  }, [intentParam]);

  const intents = [
    { id: 'authenticity', label: 'CHECK AUTHENTICITY' },
    { id: 'compare', label: 'COMPARE PRODUCTS' },
    { id: 'gi', label: 'UNDERSTAND GI' },
    { id: 'material', label: 'EVALUATE MATERIAL' },
    { id: 'workmanship', label: 'ASSESS WORKMANSHIP' }
  ];

  const toggleIntent = (id: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (activeIntent === id) {
      newParams.delete('buyerIntent');
    } else {
      newParams.set('buyerIntent', id);
    }
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const isDimmed = (tags: string[]) => {
    if (!activeIntent) return false;
    return !tags.includes(activeIntent);
  };

  const toggleDecision = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveDecision(prev => prev === id ? null : id);
  };

  return (
    <div className="kc-buyer-header-row">
      <div>
        <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
          BUYER DECISION INTELLIGENCE
        </span>
        <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Buyer Intelligence</h2>
        <p className="text-gray-500 text-lg max-w-xl">
          Independent guidance for evaluating material, workmanship, authenticity, GI claims and product representation before acquiring Kashmir crafts.
        </p>
      </div>
      
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-left lg:text-right">
          I NEED TO...
        </div>
        <div className="kc-buyer-intent-nav justify-start lg:justify-end">
          {intents.map(intent => (
            <button 
              key={intent.id}
              className="kc-intent-btn"
              data-active={activeIntent === intent.id}
              onClick={() => toggleIntent(intent.id)}
            >
              {intent.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyerIntelligenceCards() {
  const searchParams = useSearchParams();
  const intentParam = searchParams.get('buyerIntent');
  const activeIntent = intentParam || null;
  const [activeDecision, setActiveDecision] = useState<string | null>(null);

  const isDimmed = (tags: string[]) => {
    if (!activeIntent) return false;
    return !tags.includes(activeIntent);
  };

  const toggleDecision = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveDecision(prev => prev === id ? null : id);
  };

  return (
    <div className="kc-buyer-canvas">
      
      {/* PASHMINA ANCHOR */}
      <Link 
        href="/knowledge/kashmir-crafts/buying-guides/pashmina" 
        className="kc-buyer-card kc-buyer-feature outline-none group"
        data-dimmed={isDimmed(['authenticity', 'material', 'workmanship', 'gi'])}
      >
        <div className="kc-buyer-label flex items-center justify-between">
          <span>FEATURED BUYER INTELLIGENCE</span>
          <span className="kc-review-badge">KHCRF REVIEWED</span>
        </div>
        
        <div className="kc-buyer-title">How To Buy Genuine<br/>Kashmir Pashmina</div>
        <p className="text-white/70">5 things to establish before purchase</p>

        <div className="kc-decision-sequence" onClick={(e) => e.preventDefault()}>
          
          <div className="kc-decision-node" onClick={(e) => toggleDecision(e, '01')} data-active={activeDecision === '01'}>
            <div className="kc-decision-node-header">
              <span className="kc-decision-node-num">01</span>
              <span className="kc-decision-node-title">Material</span>
            </div>
            {activeDecision === '01' && (
              <div className="kc-decision-node-content">
                Establish what fibre is being represented, how it is described, and whether the product claim is consistent with the documented material.
              </div>
            )}
          </div>

          <div className="kc-decision-node" onClick={(e) => toggleDecision(e, '02')} data-active={activeDecision === '02'}>
            <div className="kc-decision-node-header">
              <span className="kc-decision-node-num">02</span>
              <span className="kc-decision-node-title">Method</span>
            </div>
            {activeDecision === '02' && (
              <div className="kc-decision-node-content">
                How was it spun, woven and finished? Machine production and hand production should never be represented as equivalent.
              </div>
            )}
          </div>

          <div className="kc-decision-node" onClick={(e) => toggleDecision(e, '03')} data-active={activeDecision === '03'}>
            <div className="kc-decision-node-header">
              <span className="kc-decision-node-num">03</span>
              <span className="kc-decision-node-title">Origin</span>
            </div>
            {activeDecision === '03' && (
              <div className="kc-decision-node-content">
                What evidence connects it to Kashmir? The geographical origin is as critical as the material itself.
              </div>
            )}
          </div>

          <div className="kc-decision-node" onClick={(e) => toggleDecision(e, '04')} data-active={activeDecision === '04'}>
            <div className="kc-decision-node-header">
              <span className="kc-decision-node-num">04</span>
              <span className="kc-decision-node-title">GI</span>
            </div>
            {activeDecision === '04' && (
              <div className="kc-decision-node-content">
                Does the claim involve valid GI credentials? Verify the registry.
              </div>
            )}
          </div>

          <div className="kc-decision-node" onClick={(e) => toggleDecision(e, '05')} data-active={activeDecision === '05'}>
            <div className="kc-decision-node-header">
              <span className="kc-decision-node-num">05</span>
              <span className="kc-decision-node-title">Provenance</span>
            </div>
            {activeDecision === '05' && (
              <div className="kc-decision-node-content">
                Can the maker or production chain be established?
              </div>
            )}
          </div>

        </div>

        <div className="kc-buyer-cta">
          Open Buyer Guide <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* COMPARISON 1 */}
      <Link 
        href="/knowledge/kashmir-crafts/compare/pashmina-vs-cashmere" 
        className="kc-buyer-card kc-buyer-comparison outline-none group"
        data-dimmed={isDimmed(['compare', 'material'])}
      >
        <div className="kc-buyer-label">COMPARISON</div>
        
        <div className="kc-vs-block">
          <div className="kc-vs-term">Pashmina</div>
          <div className="kc-vs-divider"><span>↕</span></div>
          <div className="kc-vs-term text-gray-400">Cashmere</div>
        </div>
        
        <div className="kc-vs-list">
          <span>Material identity</span>
          <span>Fibre terminology</span>
          <span>Product claims</span>
        </div>

        <div className="kc-buyer-cta">
          Compare <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* COMPARISON 2 */}
      <Link 
        href="/knowledge/kashmir-crafts/compare/kani-vs-printed-kani" 
        className="kc-buyer-card kc-buyer-comparison outline-none group"
        data-dimmed={isDimmed(['compare', 'workmanship'])}
      >
        <div className="kc-buyer-label">COMPARISON</div>
        
        <div className="kc-vs-block">
          <div className="kc-vs-term">Kani</div>
          <div className="kc-vs-divider"><span>↕</span></div>
          <div className="kc-vs-term text-gray-400">Printed Kani</div>
        </div>
        
        <div className="kc-vs-list">
          <span>Construction</span>
          <span>Technique</span>
          <span>Representation</span>
        </div>

        <div className="kc-buyer-cta">
          Compare <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* CARPETS */}
      <Link 
        href="/knowledge/kashmir-crafts/compare/hand-knotted-vs-machine-made-carpet" 
        className="kc-buyer-card kc-buyer-support outline-none group"
        data-dimmed={isDimmed(['workmanship', 'compare'])}
      >
        <div className="kc-buyer-label">CARPET INTELLIGENCE</div>
        <div className="text-xl font-bold font-serif text-brand-dark mb-6 leading-tight">
          Hand-Knotted<br/>vs Machine-Made
        </div>
        
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 flex flex-col gap-2 mb-8">
          <span>KNOT STRUCTURE</span>
          <span>BACK CONSTRUCTION</span>
          <span>MATERIAL</span>
          <span>FINISHING</span>
        </div>

        <div className="kc-buyer-cta">
          Inspect the Differences <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* PAPIER-MACHE */}
      <Link 
        href="/knowledge/kashmir-crafts/buying-guides/papier-mache-authenticity" 
        className="kc-buyer-card kc-buyer-support outline-none group"
        data-dimmed={isDimmed(['authenticity', 'workmanship'])}
      >
        <div className="kc-buyer-label flex items-center justify-between">
          <span>AUTHENTICITY GUIDE</span>
          <span className="kc-review-badge">KHCRF REVIEWED</span>
        </div>
        <div className="text-xl font-bold font-serif text-brand-dark mb-4">
          Kashmir Papier-Mâché
        </div>
        
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-4">
          SAKHTASAZI → SURFACE → NAQASHI → FINISHING
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Understand the production evidence that separates traditional workmanship from substitutes and misleading claims.
        </p>

        <div className="kc-buyer-cta">
          Check Authenticity Indicators <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      {/* GI GUIDE */}
      <Link 
        href="/knowledge/kashmir-crafts/gi-authenticity" 
        className="kc-buyer-card kc-buyer-gi outline-none group"
        data-dimmed={isDimmed(['gi', 'authenticity'])}
      >
        <div className="kc-buyer-label">BUYER PROTECTION</div>
        <div className="text-xl font-bold font-serif text-brand-dark mb-4">
          What Does GI Actually Tell You?
        </div>
        
        <div className="text-sm font-bold text-gray-700 flex flex-col gap-3 mb-6">
          <span className="flex items-center justify-between">Craft protected <span className="text-green-700">✓</span></span>
          <span className="flex items-center justify-between">Authorized producer <span className="text-red-700">≠</span></span>
          <span className="flex items-center justify-between">Individual product verified <span className="text-red-700">≠</span></span>
        </div>

        <div className="kc-buyer-cta mt-auto border-t border-brand-primary/10">
          Understand GI Claims <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

    </div>
  );
}

export default function BuyerIntelligence() {
  return (
    <section className="kc-buyer-intelligence">
      <Suspense fallback={<div className="h-20"></div>}>
        <BuyerIntelligenceContent />
      </Suspense>
      <Suspense fallback={<div className="h-[500px]"></div>}>
        <BuyerIntelligenceCards />
      </Suspense>
    </section>
  );
}