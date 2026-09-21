"use client";

import React, { useState } from 'react';

const EVIDENCE_ROWS = [
  {
    id: 'identity',
    title: 'GI / PRODUCT IDENTITY',
    desc: 'Check applicable GI identification',
    content: 'Establish what GI applies to this craft and whether the product is explicitly claiming GI status.'
  },
  {
    id: 'qr',
    title: 'QR / VERIFICATION CODE',
    desc: 'Verify where a product system exists',
    content: 'Use an available product code or QR verification mechanism to check the product against the relevant verification record.'
  },
  {
    id: 'producer',
    title: 'PRODUCER / ARTISAN',
    desc: 'Check maker and authorization evidence',
    content: 'Ensure the maker is verifiable and check if they are formally registered as an Authorized User.'
  },
  {
    id: 'docs',
    title: 'SUPPORTING DOCUMENTATION',
    desc: 'Review certificates / provenance',
    content: 'Request testing certificates, GI tags, or detailed provenance documents tracing the product back to Kashmir.'
  }
];

export default function KnowledgeIntoAction() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [activeEvidence, setActiveEvidence] = useState(EVIDENCE_ROWS[1].id); // QR selected by default

  const activeEvidenceData = EVIDENCE_ROWS.find(e => e.id === activeEvidence) || EVIDENCE_ROWS[1];

  const getPanelClass = (targetTab: string) => {
    if (!activeTab) return '';
    return activeTab === targetTab ? 'kc-action-panel-active' : 'kc-action-panel-dimmed';
  };

  return (
    <section className="kc-action-section">
      
      {/* HEADER */}
      <div className="kc-action-header text-center">
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">
          KNOWLEDGE INTO ACTION
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">
          Protect Authentic Craft
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Turn knowledge into action. Learn what evidence to look for, verify GI-linked product claims, participate in community protection, and review documented trade-risk information.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {['IDENTIFY', 'VERIFY', 'PARTICIPATE', 'PROTECT'].map(tab => (
            <button
              key={tab}
              className="kc-action-control"
              data-active={activeTab === tab}
              onClick={() => setActiveTab(prev => prev === tab ? null : tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 60/40 LAYOUT */}
      <div className="kc-action-layout">
        
        {/* LEFT PANEL (IDENTIFY / VERIFY) */}
        <div className={`kc-action-left ${activeTab === 'IDENTIFY' || activeTab === 'VERIFY' ? 'kc-action-panel-active' : (activeTab ? 'kc-action-panel-dimmed' : '')}`}>
          <div className="kc-action-label kc-action-label-dark">VERIFY BEFORE YOU BUY</div>
          <div className="kc-action-title kc-action-title-dark">How to Identify Authentic<br/>GI Products</div>

          <div className="mb-6 flex-grow">
            {EVIDENCE_ROWS.map(row => (
              <div 
                key={row.id} 
                className="kc-evidence-row"
                data-active={activeEvidence === row.id}
                onClick={() => setActiveEvidence(row.id)}
              >
                <div className="kc-evidence-title">{row.title}</div>
                <div className="kc-evidence-desc">{row.desc}</div>
              </div>
            ))}
          </div>

          <div className="kc-evidence-viewer">
            {activeEvidenceData.content}
          </div>

          <div className="kc-action-buttons">
            <a href="https://www.craftlore.org/cgis/craft_gi_system/about-gi" target="_blank" rel="noopener noreferrer" className="kc-action-btn kc-action-btn-secondary group">
              Learn About GI <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
            </a>
            <a href="https://www.craftlore.org/cgis/craft_gi_system/verify-product" target="_blank" rel="noopener noreferrer" className="kc-action-btn kc-action-btn-primary group">
              Verify Product <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
            </a>
          </div>
        </div>

        {/* RIGHT PANELS */}
        <div className="kc-action-right">
          
          {/* HERO PROGRAM (PARTICIPATE) */}
          <div className={`kc-action-hero ${getPanelClass('PARTICIPATE')}`}>
            <div className="kc-action-label kc-action-label-light">COMMUNITY PROTECTION</div>
            <div className="kc-action-title kc-action-title-light !mb-8">Become a Craftlore Hero</div>
            
            <div className="kc-hero-flow">
              <div className="kc-hero-step">
                <div className="kc-hero-step-title">REPORT</div>
                <div className="kc-hero-step-desc">Submit documented evidence</div>
              </div>
              <div className="kc-hero-arrow">↓</div>
              
              <div className="kc-hero-step">
                <div className="kc-hero-step-title">REVIEW</div>
                <div className="kc-hero-step-desc">Investigation &amp; verification</div>
              </div>
              <div className="kc-hero-arrow">↓</div>
              
              <div className="kc-hero-step">
                <div className="kc-hero-step-title">ACTION</div>
                <div className="kc-hero-step-desc">Corrective / risk action where warranted</div>
              </div>
              <div className="kc-hero-arrow">↓</div>
              
              <div className="kc-hero-step">
                <div className="kc-hero-step-title">RECOGNITION</div>
                <div className="kc-hero-step-desc">Validated contribution may receive Hero status</div>
              </div>
            </div>

            <div className="mt-auto">
              <a href="https://www.craftlore.org/cgis/craft_gi_system/hero-program" target="_blank" rel="noopener noreferrer" className="kc-action-btn kc-action-btn-gold group">
                Become a GI Hero <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
              </a>
              <div className="mt-4">
                <a href="https://www.craftlore.org/cgis/craft_gi_system/hero-program" target="_blank" rel="noopener noreferrer" className="kc-hero-link">
                  Already recognized? Claim Hero Profile ↗
                </a>
              </div>
            </div>
          </div>

          {/* TRADE RISK REGISTRY (PROTECT) */}
          <div className={`kc-action-trade ${getPanelClass('PROTECT')}`}>
            <div className="kc-action-label kc-action-label-dark">TRADE PROTECTION</div>
            <div className="kc-action-title kc-action-title-dark !mb-4">Trade Risk Registry</div>
            
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Review documented entity-risk information and verified violation records available through Craftlore's trade-integrity system.
            </p>

            <div className="mt-auto">
              <a href="https://www.craftlore.org/cktre/trade-risk-registry" target="_blank" rel="noopener noreferrer" className="kc-action-btn kc-action-btn-primary group">
                Open Registry <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
              </a>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4">Craftlore CKTRE</div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM INTELLIGENCE STRIP */}
      <div className="kc-bottom-strip">
        <div className="kc-strip-header">INTELLIGENCE BEHIND THE PROTECTION WORKFLOW</div>
        
        <div className="kc-strip-grid">
          <div className="kc-strip-col">
            <div className="kc-strip-title">Verification Sources</div>
            <div className="kc-strip-desc">Regulatory, registry, business and supporting evidence sources</div>
          </div>
          <div className="kc-strip-col">
            <div className="kc-strip-title">Monitoring Systems</div>
            <div className="kc-strip-desc font-bold text-brand-dark">CGIS · CLEE · CSEME · CRVAS</div>
          </div>
          <div className="kc-strip-col">
            <div className="kc-strip-title">Independent Decisions</div>
            <div className="kc-strip-desc">Structured intelligence designed to support informed decisions</div>
          </div>
        </div>

        <div className="kc-strip-footer">
          <a href="https://www.craftlore.org/cgis" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-dark flex items-center gap-1 transition-colors group">
            Explore the Verification System <span className="text-base leading-none transform transition-transform group-hover:-translate-y-[2px] group-hover:translate-x-[2px]">↗</span>
          </a>
        </div>
      </div>

    </section>
  );
}