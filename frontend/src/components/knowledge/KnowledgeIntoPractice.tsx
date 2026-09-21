"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const PRESERVATION_DATA = {
  textiles: {
    id: 'textiles',
    label: 'TEXTILES',
    store: 'Humidity-controlled, dry storage with appropriate airflow.',
    clean: 'Use material-appropriate dry cleaning methods; avoid aggressive liquids.',
    handle: 'Avoid unnecessary friction and contamination.',
    inspect: 'Monitor for moisture, insects, discoloration and fibre stress.',
    alerts: [
      'DO NOT WASH WITHOUT MATERIAL-SPECIFIC GUIDANCE',
      'DO NOT STORE LONG-TERM IN NON-BREATHABLE PLASTIC',
      'DO NOT EXPOSE TO DIRECT SUNLIGHT'
    ]
  },
  carpets: {
    id: 'carpets',
    label: 'CARPETS',
    store: 'Roll around a core; never fold. Keep elevated and dry.',
    clean: 'Professional specialist washing only. No chemical dry cleaning.',
    handle: 'Rotate periodically to ensure even wear.',
    inspect: 'Check foundation tension, fringes, and moth activity.',
    alerts: [
      'DO NOT FOLD LONG-TERM',
      'DO NOT USE ROTARY BEATER BRUSHES',
      'DO NOT APPLY CHEMICAL STAIN REMOVERS'
    ]
  },
  wood: {
    id: 'wood',
    label: 'WOOD',
    store: 'Maintain stable humidity (45-55%) and temperature.',
    clean: 'Dust with soft dry cloth. Wax only if traditionally finished.',
    handle: 'Support carved elements and avoid pressure on projecting details.',
    inspect: 'Check cracking, movement, pests, finish deterioration and moisture.',
    alerts: [
      'DO NOT PLACE NEAR HEAT SOURCES',
      'DO NOT APPLY COMMERCIAL SPRAY POLISH',
      'DO NOT EXPOSE TO EXTREME HUMIDITY SWINGS'
    ]
  },
  papier_mache: {
    id: 'papier_mache',
    label: 'PAPIER-MÂCHÉ',
    store: 'Keep in moderate temperature away from direct light.',
    clean: 'Soft dry brush only. Never use moisture.',
    handle: 'Support from underneath. Prevent impact to edges.',
    inspect: 'Look for lacquer crazing, chipping, or pigment fading.',
    alerts: [
      'DO NOT USE WET CLOTHS FOR CLEANING',
      'DO NOT EXPOSE TO ABRASIVE SURFACES',
      'DO NOT ATTEMPT UNTRAINED RESTORATION'
    ]
  },
  metalwork: {
    id: 'metalwork',
    label: 'METALWORK',
    store: 'Dry environment to prevent oxidation.',
    clean: 'Use designated gentle polish; avoid abrasive pads.',
    handle: 'Use cotton gloves if preserving high-polish copper/silver.',
    inspect: 'Watch for active corrosion or verdigris buildup.',
    alerts: [
      'DO NOT USE HARSH ACIDS',
      'DO NOT SCRUB ENGRAVED SURFACES',
      'DO NOT LEAVE MOISTURE IN CREVICES'
    ]
  }
};

const LEARNING_MODULES = [
  {
    id: 'pashmina',
    title: 'Understanding Pashmina',
    desc: 'Fibre origin, material characteristics, traditional processing, production and authenticity.',
    tags: ['FIBRE', 'PROCESS', 'GI', 'AUTHENTICITY'],
    relatedCare: 'textiles',
    link: 'https://craftlore.org/clie/pashmina-fundamentals'
  },
  {
    id: 'kani',
    title: 'Kani Weaving Fundamentals',
    desc: 'Understand Talim, coded design, loom preparation, Kani construction and the relationship between technique and authenticity.',
    tags: ['TALIM', 'TECHNIQUE', 'CONSTRUCTION', 'AUTHENTICITY'],
    relatedCare: 'textiles',
    link: 'https://craftlore.org/clie/kani-weaving'
  },
  {
    id: 'gi',
    title: 'Introduction to Kashmir GI',
    desc: 'Understand geographic protection, authorized users, provenance and product-level authenticity in the Kashmir context.',
    tags: ['PROTECTION', 'AUTHORIZATION', 'CLAIMS'],
    relatedCare: null,
    link: 'https://craftlore.org/clie/gi-introduction'
  },
  {
    id: 'authenticity',
    title: 'Authenticity & Provenance',
    desc: 'Examine product history, maker evidence, production chains, and the verification methods used to establish authenticity.',
    tags: ['EVIDENCE', 'MAKER', 'PRODUCT HISTORY'],
    relatedCare: null,
    link: 'https://craftlore.org/clie/authenticity-provenance'
  }
];

function KnowledgePracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const learningParam = searchParams.get('learning');
  const careParam = searchParams.get('care');

  const [activeLearningId, setActiveLearningId] = useState(LEARNING_MODULES[0].id);
  const [activeCareId, setActiveCareId] = useState(PRESERVATION_DATA.textiles.id);

  useEffect(() => {
    if (learningParam) {
      setActiveLearningId(learningParam);
    }
    if (careParam) {
      setActiveCareId(careParam);
    }
  }, [learningParam, careParam]);

  const handleLearningSelect = (id: string) => {
    setActiveLearningId(id);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('learning', id);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleCareSelect = (id: string) => {
    setActiveCareId(id);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('care', id);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const activeLearning = LEARNING_MODULES.find(m => m.id === activeLearningId) || LEARNING_MODULES[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentCare = (PRESERVATION_DATA as any)[activeCareId] || PRESERVATION_DATA['textiles'];

  return (
    <div className="kc-practice-layout">
      
      {/* LEARNING PATHWAYS */}
      <div className="kc-practice-learning">
        <div className="kc-practice-label">LEARNING PATHWAYS</div>
        
        <div className="kc-learning-featured">
          <div className="text-2xl font-bold font-serif mb-4">{activeLearning.title}</div>
          <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-6">
            {activeLearning.desc}
          </p>
          <div className="kc-learning-tags">
            {activeLearning.tags.map(tag => (
              <span key={tag} className="kc-learning-tag">{tag}</span>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <a 
              href={activeLearning.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-black uppercase tracking-widest text-[#fff] hover:text-[#a9783c] flex items-center gap-2 transition-colors w-fit group"
            >
              Begin Learning <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
            </a>
            
            {activeLearning.relatedCare && (
              <button 
                onClick={() => handleCareSelect(activeLearning.relatedCare!)}
                className="text-[10px] font-bold text-white/50 hover:text-white/80 text-left transition-colors"
              >
                Related Preservation: <span className="capitalize">{activeLearning.relatedCare.replace('_', '-')}</span> →
              </button>
            )}
          </div>
        </div>

        <div className="kc-learning-secondary">
          {LEARNING_MODULES.filter(m => m.id !== activeLearningId).map(module => (
            <div 
              key={module.id}
              onClick={() => handleLearningSelect(module.id)}
              className="kc-learning-row outline-none group"
            >
              <div>
                <div className="text-sm font-bold text-brand-dark">{module.title}</div>
                <div className="kc-learning-meta">{module.tags.join(' · ')}</div>
              </div>
              <div className="text-brand-primary font-bold transition-transform group-hover:translate-x-1">→</div>
            </div>
          ))}
        </div>

        <div className="kc-learning-platform">
          <span>Learning Platform · Craftlore CLIE</span>
          <a href="https://craftlore.org/clie" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-dark transition-colors font-bold flex items-center gap-1 group">
            Explore Modules <span className="text-base leading-none transform transition-transform group-hover:-translate-y-[2px] group-hover:translate-x-[2px]">↗</span>
          </a>
        </div>

      </div>

      {/* PRESERVATION INTELLIGENCE */}
      <div className="kc-practice-preservation">
        <div className="px-6 pt-6">
          <div className="kc-practice-label !mb-0">PRESERVATION INTELLIGENCE</div>
        </div>
        
        <div className="kc-preservation-nav">
          {Object.values(PRESERVATION_DATA).map(cat => (
            <button 
              key={cat.id}
              className="kc-preservation-tab"
              data-active={activeCareId === cat.id}
              onClick={() => handleCareSelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="kc-preservation-content">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">
            Selected: {currentCare.label}
          </div>

          <div className="kc-preservation-block">
            <div className="kc-preservation-term">STORE</div>
            <div className="kc-preservation-desc">{currentCare.store}</div>
          </div>

          <div className="kc-preservation-block">
            <div className="kc-preservation-term">CLEAN</div>
            <div className="kc-preservation-desc">{currentCare.clean}</div>
          </div>

          <div className="kc-preservation-block">
            <div className="kc-preservation-term">HANDLE</div>
            <div className="kc-preservation-desc">{currentCare.handle}</div>
          </div>

          <div className="kc-preservation-block">
            <div className="kc-preservation-term">INSPECT</div>
            <div className="kc-preservation-desc">{currentCare.inspect}</div>
          </div>

          <Link href={`/knowledge/kashmir-crafts/care/${currentCare.id.replace('_', '-')}`} className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mt-8 block hover:text-brand-dark transition-colors group">
            View Complete Care Guide <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="kc-preservation-alert">
          <div className="kc-alert-title">PRESERVATION ALERT: WHAT NOT TO DO</div>
          <div className="kc-alert-list">
            {currentCare.alerts.map((alert: string, i: number) => (
              <div key={i} className="kc-alert-item">{alert}</div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function KnowledgeIntoPractice() {
  return (
    <section className="kc-practice-section">
      <div className="kc-practice-header">
        <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
          KNOWLEDGE INTO PRACTICE
        </span>
        <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Learn the Craft. Preserve the Craft.</h2>
        <p className="text-gray-500 text-lg">
          Build an understanding of materials, techniques, authenticity and provenance—and use that knowledge to protect Kashmir crafts for generations.
        </p>
      </div>

      <Suspense fallback={<div className="h-[500px]"></div>}>
        <KnowledgePracticeContent />
      </Suspense>
    </section>
  );
}