import React from 'react';
import Link from 'next/link';

export default function EvidenceAndTrust() {
  return (
    <section className="kc-trust-section">
      <div className="kc-trust-header">
        <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Built on Evidence</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Every KHCRF knowledge record is supported by documented sources, structured review, transparent methodology and an open correction process.
        </p>
      </div>

      <div className="kc-trust-layout">
        
        {/* LEFT FEATURE */}
        <div className="kc-trust-feature">
          <div className="kc-trust-feature-label">KHCRF EVIDENCE STANDARD</div>
          <div className="text-3xl font-serif font-bold mb-2">How knowledge becomes publishable</div>

          <div className="kc-trust-chain">
            <span>Source</span>
            <span className="kc-trust-chain-arrow">→</span>
            <span>Verification</span>
            <span className="kc-trust-chain-arrow">→</span>
            <span>Editorial Review</span>
            <span className="kc-trust-chain-arrow">→</span>
            <span>Methodology Check</span>
            <span className="kc-trust-chain-arrow">→</span>
            <span>Publication</span>
            <span className="kc-trust-chain-arrow">→</span>
            <span>Periodic Review</span>
          </div>

          <div className="kc-trust-fact-block">
            <div className="kc-trust-fact-label">Source Hierarchy</div>
            <div className="kc-trust-fact-desc">Official records · institutional data · field documentation · peer-reviewed research · verified primary evidence</div>
          </div>

          <div className="kc-trust-fact-block">
            <div className="kc-trust-fact-label">Review Requirement</div>
            <div className="kc-trust-fact-desc">Claims must be attributable and reviewable.</div>
          </div>

          <div className="kc-trust-fact-block mb-10">
            <div className="kc-trust-fact-label">Correction Policy</div>
            <div className="kc-trust-fact-desc">Published records remain open to documented corrections.</div>
          </div>

          <Link href="/knowledge/kashmir-crafts/methodology" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#fff] hover:text-brand-primary transition-colors group outline-none">
            Read Evidence Standard <span className="text-lg leading-none transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="kc-trust-sidebar">
          
          <Link href="/knowledge/kashmir-crafts/evidence" className="kc-trust-card outline-none group">
            <div className="kc-trust-card-title">SOURCES & REFERENCES</div>
            <div className="kc-trust-card-desc">See the evidence supporting KHCRF craft records.</div>
            <div className="kc-trust-cta">
              Browse Sources <span>→</span>
            </div>
          </Link>

          <Link href="/knowledge/kashmir-crafts/editorial-review" className="kc-trust-card outline-none group">
            <div className="kc-trust-card-title">EDITORIAL & FACT REVIEW</div>
            <div className="kc-trust-card-desc">Understand how evidence is checked, normalized and approved before publication.</div>
            <div className="kc-trust-cta">
              Review Methodology <span>→</span>
            </div>
          </Link>

          <Link href="/knowledge/kashmir-crafts/submit-evidence" className="kc-trust-card kc-trust-card-action outline-none group">
            <div className="kc-trust-card-title text-brand-primary">SUBMIT EVIDENCE OR CORRECTION</div>
            <div className="kc-trust-card-desc">Provide a source, challenge a claim, or propose a documented correction.</div>
            <div className="kc-trust-cta">
              Submit Evidence <span>→</span>
            </div>
          </Link>

        </div>
      </div>

      <div className="kc-trust-status-strip">
        <div className="kc-trust-status-item lg:w-1/5">
          <div className="kc-trust-status-label">KNOWLEDGE STATUS</div>
        </div>
        
        <div className="kc-trust-status-item">
          <div className="kc-trust-status-label">Methodology Version</div>
          <div className="kc-trust-status-value">v1.0</div>
        </div>

        <div className="kc-trust-status-item">
          <div className="kc-trust-status-label">Evidence Standard</div>
          <div className="kc-trust-status-value text-green-700">Active</div>
        </div>

        <div className="kc-trust-status-item">
          <div className="kc-trust-status-label">Review Cycle</div>
          <div className="kc-trust-status-value">Ongoing</div>
        </div>

        <div className="kc-trust-status-item">
          <div className="kc-trust-status-label">Last Platform Review</div>
          <div className="kc-trust-status-value">September 2026</div>
        </div>

        <div className="kc-trust-status-item">
          <div className="kc-trust-status-label">Corrections</div>
          <div className="kc-trust-status-value text-brand-primary">Open</div>
        </div>
      </div>

    </section>
  );
}