"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const INTEL_ENGINES = [
  {
    id: 'cgis',
    category: 'VERIFY',
    title: 'Verify a GI Product',
    engine: 'CGIS',
    panelHeader: 'VERIFICATION · CRAFTLORE CGIS',
    description: 'Check product credentials against GI verification records.',
    block1Label: 'USE THIS WHEN',
    block1Items: [
      'A product claims GI status',
      'You need credential verification',
      'Buyer documentation needs checking'
    ],
    block2Label: 'DATA DOMAIN',
    block2Items: [
      'GI Registry',
      'Product DNA',
      'Producer Status',
      'Authenticity Credentials'
    ],
    engineFullName: 'Craftlore CGIS',
    ctaText: 'Launch Intelligence Tool',
    externalLink: 'https://craftlore.org/cgis'
  },
  {
    id: 'cktre',
    category: 'TRADE',
    title: 'Trade Integrity & Risk',
    engine: 'CKTRE',
    panelHeader: 'TRADE INTELLIGENCE · CRAFTLORE CKTRE',
    description: 'Examine verified trade entities and buyer-protection intelligence.',
    block1Label: 'VERIFIED ENTITIES',
    block1Items: [
      'Authorized Producers',
      'Certified Exporters',
      'Verified Retailers'
    ],
    block2Label: 'BUYER PROTECTION',
    block2Items: [
      'Trade Risk Records',
      'Entity Status',
      'Compliance History'
    ],
    engineFullName: 'Craftlore CKTRE',
    ctaText: 'Open Trade Intelligence',
    externalLink: 'https://craftlore.org/cktre'
  },
  {
    id: 'cais_appraisal',
    category: 'VALUE',
    title: 'Product Appraisal',
    engine: 'CAIS',
    panelHeader: 'APPRAISAL · CRAFTLORE CAIS',
    description: 'Estimate indicative value using material, labour, craftsmanship and provenance inputs.',
    block1Label: 'USE THIS WHEN',
    block1Items: [
      'Estimating indicative craft value',
      'Comparing material/labour inputs',
      'Assessing craftsmanship',
      'Evaluating provenance'
    ],
    block2Label: 'DATA DOMAIN',
    block2Items: [
      'Material',
      'Labour',
      'Technique',
      'Provenance',
      'Workmanship'
    ],
    engineFullName: 'Craftlore CAIS',
    ctaText: 'Launch Product Appraisal',
    externalLink: 'https://craftlore.org/cais/appraisal'
  },
  {
    id: 'cais_market',
    category: 'VALUE',
    title: 'Market Rate Intelligence',
    engine: 'CAIS',
    panelHeader: 'MARKET INTELLIGENCE · CRAFTLORE CAIS',
    description: 'Explore market-rate intelligence and fair-value benchmarks across craft categories.',
    block1Label: 'SIGNALS',
    block1Items: [
      'Market rate benchmarks',
      'Fair value distribution',
      'Craft category trends',
      'Comparable product data'
    ],
    block2Label: 'COVERAGE',
    block2Items: [
      'Pashmina Textiles',
      'Kashmir Carpets',
      'Papier-Mâché'
    ],
    engineFullName: 'Craftlore CAIS',
    ctaText: 'Launch Market Intelligence',
    externalLink: 'https://craftlore.org/cais/market'
  },
  {
    id: 'clee',
    category: 'SUSTAINABILITY',
    title: 'Sustainability Assessment',
    engine: 'CLEE',
    panelHeader: 'LIFECYCLE INTELLIGENCE · CRAFTLORE CLEE',
    description: 'Evaluate material footprints, lifecycle impacts and production-related sustainability factors.',
    block1Label: 'ASSESSMENT DOMAINS',
    block1Items: [
      'Materials Sourcing',
      'Lifecycle Span',
      'Production Impact',
      'Environmental Factors'
    ],
    block2Label: 'REPORTS',
    block2Items: [
      'Carbon footprint estimate',
      'Dye toxicity ratings',
      'Water usage models'
    ],
    engineFullName: 'Craftlore CLEE',
    ctaText: 'Run Sustainability Assessment',
    externalLink: 'https://craftlore.org/clee'
  },
  {
    id: 'cseme',
    category: 'ECONOMY',
    title: 'Kashmir Craft Economy',
    engine: 'CSEME',
    panelHeader: 'MACRO INTELLIGENCE · CRAFTLORE CSEME',
    description: 'Macro-economic indicators mapping the scale and health of Kashmir craft sectors.',
    block1Label: 'KASHMIR CRAFT ECONOMY',
    block1Items: [
      'Production Value',
      'Export Value',
      'Productivity Indices'
    ],
    block2Label: 'SECTOR METRICS',
    block2Items: [
      'Supply Stability',
      'Production Windows',
      'HS Code Tracking'
    ],
    engineFullName: 'Craftlore CSEME',
    ctaText: 'Open Economic Intelligence',
    externalLink: 'https://craftlore.org/cseme'
  }
];

function IntelligenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool');

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeEngine, setActiveEngine] = useState(INTEL_ENGINES[0].id);

  // Initialize from URL on mount
  useEffect(() => {
    if (toolParam) {
      const engine = INTEL_ENGINES.find(e => e.id === toolParam);
      if (engine) {
        setActiveEngine(engine.id);
        setActiveFilter(engine.category);
      }
    }
  }, [toolParam]);

  const handleEngineSelect = (id: string) => {
    setActiveEngine(id);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tool', id);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const filters = ['ALL', 'VERIFY', 'VALUE', 'TRADE', 'SUSTAINABILITY', 'ECONOMY'];

  const displayedEngines = activeFilter === 'ALL' 
    ? INTEL_ENGINES 
    : INTEL_ENGINES.filter(e => e.category === activeFilter);

  const currentTool = INTEL_ENGINES.find(e => e.id === activeEngine) || INTEL_ENGINES[0];

  return (
    <>
      <div className="kc-intel-header-row">
        <div>
          <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
            CRAFT INTELLIGENCE
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Craft Intelligence Tools</h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Specialized verification, appraisal, market, sustainability, trade and economic intelligence engines provided through Craftlore.
          </p>
        </div>
        
        <div className="text-left lg:text-right">
          <div className="text-brand-dark font-black font-serif text-2xl mb-1">6 Intelligence Engines</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Verification · Value · Risk · Sustainability · Economy
          </div>
        </div>
      </div>

      <div className="kc-intel-filters">
        {filters.map(f => (
          <button
            key={f}
            className="kc-intel-filter-btn"
            data-active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="kc-intel-command-center">
        
        {/* MOBILE SELECTOR */}
        <div className="kc-intel-rail-mobile">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Select Intelligence Tool</label>
          <select 
            className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-bold text-brand-dark"
            value={activeEngine}
            onChange={(e) => handleEngineSelect(e.target.value)}
          >
            {displayedEngines.map(engine => (
              <option key={engine.id} value={engine.id}>{engine.title} — {engine.engine}</option>
            ))}
          </select>
        </div>

        {/* DESKTOP RAIL */}
        <div className="kc-intel-rail">
          {displayedEngines.map(engine => (
            <div 
              key={engine.id} 
              className="kc-intel-rail-item"
              data-active={activeEngine === engine.id}
              onClick={() => handleEngineSelect(engine.id)}
            >
              <div className="kc-intel-rail-cat">{engine.category}</div>
              <div className="kc-intel-rail-title">{engine.title}</div>
              <div className="kc-intel-rail-engine">{engine.engine}</div>
            </div>
          ))}
        </div>

        {/* ACTIVE PANEL */}
        <div className="kc-intel-panel">
          <div className="kc-intel-panel-header">
            <div className="kc-intel-panel-cat">{currentTool.panelHeader}</div>
            <div className="kc-intel-panel-title">{currentTool.title}</div>
            <div className="kc-intel-panel-desc">{currentTool.description}</div>
          </div>

          <div className="kc-intel-data-grid">
            <div className="kc-intel-data-block">
              <div className="kc-intel-data-label">{currentTool.block1Label}</div>
              <div className="kc-intel-data-list">
                {currentTool.block1Items.map((item, i) => (
                  <div key={i} className="kc-intel-data-item">{item}</div>
                ))}
              </div>
            </div>

            <div className="kc-intel-data-block">
              <div className="kc-intel-data-label">{currentTool.block2Label}</div>
              <div className="kc-intel-data-list">
                {currentTool.block2Items.map((item, i) => (
                  <div key={i} className="kc-intel-data-item">{item}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="kc-intel-footer">
            <div className="kc-intel-attribution">
              <div className="kc-intel-attr-label">EXTERNAL INTELLIGENCE ENGINE</div>
              <div className="kc-intel-attr-value">{currentTool.engineFullName}</div>
              <div className="kc-intel-attr-desc">Opens on craftlore.org</div>
            </div>
            
            <a 
              href={currentTool.externalLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="kc-intel-cta"
            >
              {currentTool.ctaText} <span>↗</span>
            </a>
          </div>
        </div>

      </div>
    </>
  );
}

export default function IntelligenceCommandCenter() {
  return (
    <section className="kc-intel-section">
      <Suspense fallback={<div>Loading...</div>}>
        <IntelligenceContent />
      </Suspense>
    </section>
  );
}