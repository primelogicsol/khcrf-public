"use client";

import React, { useState } from 'react';

const CRAFT_DATA = {
  pashmina: {
    name: 'Kashmir Pashmina',
    meta: 'Textile · Fibre-based · Hand production',
    processes: [
      { id: '01', title: 'RAW FIBRE', materialInput: 'Raw Pashmina fibre', transformation: 'Sorting and preparation', makerRole: 'Fibre specialist', tool: 'Hand tools', skill: 'Advanced', output: 'Sorted fibre', authenticity: 'High altitude origin', shortcut: 'Mechanized substitution' },
      { id: '02', title: 'SORTING & CLEANING', materialInput: 'Sorted fibre', transformation: 'De-hairing', makerRole: 'Specialist artisan', tool: 'Traditional combs', skill: 'High', output: 'Clean fibre', authenticity: 'Hand separated', shortcut: 'Chemical cleaning' },
      { id: '03', title: 'HAND SPINNING', materialInput: 'Clean fibre', transformation: 'Spinning', makerRole: 'Spinner (Puis)', tool: 'Yinder (Spinning wheel)', skill: 'Expert', output: 'Pashmina yarn', authenticity: 'Hand-spun structure', shortcut: 'Machine spun yarn' },
      { id: '04', title: 'YARN PREPARATION', materialInput: 'Pashmina yarn', transformation: 'Warping', makerRole: 'Warp maker', tool: 'Traditional pegs', skill: 'High', output: 'Loom warp', authenticity: 'Traditional warp', shortcut: 'N/A' },
      { id: '05', title: 'HAND WEAVING', materialInput: 'Prepared warp/weft', transformation: 'Weaving', makerRole: 'Weaver (Waza)', tool: 'Handloom', skill: 'Expert', output: 'Woven fabric', authenticity: 'Handwoven edge', shortcut: 'Power loom' },
    ],
    techniques: [
      { id: 't1', title: 'HAND SPINNING', desc: 'Fibre transformation', relatedStage: '03' },
      { id: 't2', title: 'HAND WEAVING', desc: 'Structural production', relatedStage: '05' },
      { id: 't3', title: 'SOZNI', desc: 'Surface embellishment', relatedStage: '06' },
    ],
    fingerprint: {
      labour: { label: 'High', fill: '90%' },
      material: { label: 'Core', fill: '100%' },
      skill: { label: 'High', fill: '90%' },
      depth: { label: 'Extensive', fill: '80%' },
      authenticity: { label: 'Significant', fill: '90%' }
    }
  },
  kani: {
    name: 'Kani Shawl',
    meta: 'Textile · Structural · Coded design',
    processes: [
      { id: '01', title: 'MATERIAL PREP', materialInput: 'Pashmina yarn', transformation: 'Dyeing', makerRole: 'Dyer', tool: 'Vats', skill: 'High', output: 'Colored yarn', authenticity: 'Dye quality', shortcut: 'Synthetic rapid dyes' },
      { id: '02', title: 'DESIGN CODING', materialInput: 'Pattern', transformation: 'Talim writing', makerRole: 'Talim Guru', tool: 'Pen/Paper', skill: 'Master', output: 'Talim code', authenticity: 'Traditional cipher', shortcut: 'Computer rendering' },
      { id: '03', title: 'LOOM SETUP', materialInput: 'Yarn', transformation: 'Warping', makerRole: 'Warp maker', tool: 'Handloom', skill: 'High', output: 'Ready loom', authenticity: 'Hand tensioned', shortcut: 'N/A' },
      { id: '04', title: 'KANI WEAVING', materialInput: 'Talim + Yarn', transformation: 'Twill tapestry weaving', makerRole: 'Kani Weaver', tool: 'Kanis (Wooden needles)', skill: 'Expert', output: 'Woven fabric', authenticity: 'No reverse floats', shortcut: 'Jacquard loom' },
    ],
    techniques: [
      { id: 't1', title: 'TALIM WRITING', desc: 'Design cryptography', relatedStage: '02' },
      { id: 't2', title: 'KANI WEAVING', desc: 'Tapestry construction', relatedStage: '04' },
    ],
    fingerprint: {
      labour: { label: 'Extreme', fill: '100%' },
      material: { label: 'Core', fill: '90%' },
      skill: { label: 'Master', fill: '100%' },
      depth: { label: 'Intensive', fill: '90%' },
      authenticity: { label: 'Critical', fill: '100%' }
    }
  },
  'papier-mache': {
    name: 'Kashmir Papier-Mâché',
    meta: 'Decorative · Paper-based · Hand painted',
    processes: [
      { id: '01', title: 'SAKHTASAZI', materialInput: 'Paper pulp, glue', transformation: 'Molding', makerRole: 'Sakhtasaz', tool: 'Molds', skill: 'High', output: 'Base structure', authenticity: 'Hand pounded', shortcut: 'Cardboard/Wood base' },
      { id: '02', title: 'SMOOTHING', materialInput: 'Base structure', transformation: 'Sanding/Coating', makerRole: 'Sakhtasaz', tool: 'Stone/Files', skill: 'Moderate', output: 'Smooth surface', authenticity: 'Natural gypsum', shortcut: 'Synthetic putty' },
      { id: '03', title: 'BASE COLOR', materialInput: 'Smooth object', transformation: 'Painting', makerRole: 'Naqash', tool: 'Brushes', skill: 'High', output: 'Colored base', authenticity: 'Natural pigments', shortcut: 'Spray paint' },
      { id: '04', title: 'NAQASHI', materialInput: 'Colored object', transformation: 'Detail painting', makerRole: 'Naqash', tool: 'Fine brushes', skill: 'Expert', output: 'Decorated object', authenticity: 'Freehand art', shortcut: 'Decals/Stencils' },
      { id: '05', title: 'VARNISHING', materialInput: 'Painted object', transformation: 'Sealing', makerRole: 'Finisher', tool: 'Brush', skill: 'Moderate', output: 'Finished craft', authenticity: 'Traditional lacquer', shortcut: 'Synthetic spray' },
    ],
    techniques: [
      { id: 't1', title: 'SAKHTASAZI', desc: 'Surface preparation', relatedStage: '01' },
      { id: 't2', title: 'NAQASHI', desc: 'Surface decoration', relatedStage: '04' },
    ],
    fingerprint: {
      labour: { label: 'High', fill: '80%' },
      material: { label: 'Important', fill: '70%' },
      skill: { label: 'Expert', fill: '90%' },
      depth: { label: 'Moderate', fill: '60%' },
      authenticity: { label: 'High', fill: '85%' }
    }
  },
  carpets: {
    name: 'Kashmir Carpets',
    meta: 'Textile · Floor Covering · Hand-Knotted',
    processes: [
      { id: '01', title: 'DESIGN & TALIM', materialInput: 'Pattern', transformation: 'Coded notation', makerRole: 'Talim writer', tool: 'Pen/Paper', skill: 'Master', output: 'Talim code', authenticity: 'Traditional cipher', shortcut: 'Computer printout' },
      { id: '02', title: 'YARN PREPARATION', materialInput: 'Silk or Wool', transformation: 'Dyeing', makerRole: 'Dyer', tool: 'Dye vats', skill: 'High', output: 'Colored yarn', authenticity: 'Natural/premium dyes', shortcut: 'Cheap synthetic' },
      { id: '03', title: 'LOOM SETUP', materialInput: 'Cotton/Silk warp', transformation: 'Warping', makerRole: 'Warp setter', tool: 'Carpet loom', skill: 'High', output: 'Tensioned loom', authenticity: 'Hand tensioned', shortcut: 'N/A' },
      { id: '04', title: 'HAND KNOTTING', materialInput: 'Colored yarn', transformation: 'Knot tying', makerRole: 'Weaver', tool: 'Khur (Knife)', skill: 'Expert', output: 'Woven carpet', authenticity: 'Symmetrical/Asymmetrical knot', shortcut: 'Tufting gun / Machine loom' },
      { id: '05', title: 'CLIPPING & FINISHING', materialInput: 'Knotted carpet', transformation: 'Shearing and washing', makerRole: 'Finisher', tool: 'Shears', skill: 'High', output: 'Finished carpet', authenticity: 'Hand sheared', shortcut: 'Chemical washing' }
    ],
    techniques: [
      { id: 't1', title: 'TALIM', desc: 'Design cryptography', relatedStage: '01' },
      { id: 't2', title: 'HAND KNOTTING', desc: 'Structural production', relatedStage: '04' }
    ],
    fingerprint: {
      labour: { label: 'Extreme', fill: '100%' },
      material: { label: 'Core', fill: '90%' },
      skill: { label: 'Expert', fill: '100%' },
      depth: { label: 'Extensive', fill: '90%' },
      authenticity: { label: 'Critical', fill: '100%' }
    }
  },
  walnut: {
    name: 'Walnut Wood Carving',
    meta: 'Woodcraft · Sculptural · Hand Carved',
    processes: [
      { id: '01', title: 'WOOD SELECTION', materialInput: 'Walnut timber (Juglans Regia)', transformation: 'Sourcing', makerRole: 'Selector', tool: 'Visual inspection', skill: 'High', output: 'Raw timber', authenticity: 'Kashmir Walnut', shortcut: 'Imported/Soft wood' },
      { id: '02', title: 'SEASONING', materialInput: 'Raw timber', transformation: 'Drying', makerRole: 'Seasoner', tool: 'Air/Kiln', skill: 'Moderate', output: 'Seasoned wood', authenticity: 'Natural air drying', shortcut: 'Flash kiln drying' },
      { id: '03', title: 'CUTTING & FORMING', materialInput: 'Seasoned wood', transformation: 'Shaping', makerRole: 'Carpenter', tool: 'Saws, planers', skill: 'High', output: 'Base structure', authenticity: 'Traditional joints', shortcut: 'CNC milling' },
      { id: '04', title: 'CARVING', materialInput: 'Base structure', transformation: 'Relief/Undercut carving', makerRole: 'Wood carver (Naqash)', tool: 'Chisels', skill: 'Expert', output: 'Carved object', authenticity: 'Hand carved depth', shortcut: 'Machine router/Laser' },
      { id: '05', title: 'DETAILING & FINISHING', materialInput: 'Carved object', transformation: 'Polishing', makerRole: 'Polisher', tool: 'Agate stone, wax', skill: 'Moderate', output: 'Finished craft', authenticity: 'Wax/oil finish', shortcut: 'Chemical varnish' }
    ],
    techniques: [
      { id: 't1', title: 'UNDERCUT CARVING', desc: 'Deep relief technique', relatedStage: '04' },
      { id: 't2', title: 'WAX POLISHING', desc: 'Natural finishing', relatedStage: '05' }
    ],
    fingerprint: {
      labour: { label: 'High', fill: '80%' },
      material: { label: 'Core', fill: '95%' },
      skill: { label: 'Expert', fill: '90%' },
      depth: { label: 'Moderate', fill: '70%' },
      authenticity: { label: 'High', fill: '85%' }
    }
  },
  copperware: {
    name: 'Kashmir Copperware',
    meta: 'Metalcraft · Forged · Engraved',
    processes: [
      { id: '01', title: 'MATERIAL PREPARATION', materialInput: 'Copper sheets', transformation: 'Cutting', makerRole: 'Metal worker', tool: 'Shears', skill: 'Moderate', output: 'Cut sheets', authenticity: 'Pure copper', shortcut: 'Plated alloys' },
      { id: '02', title: 'FORMING', materialInput: 'Cut sheets', transformation: 'Hammering/Spinning', makerRole: 'Coppersmith', tool: 'Hammers, Anvil', skill: 'High', output: 'Base vessel', authenticity: 'Hand hammered', shortcut: 'Machine pressed' },
      { id: '03', title: 'ENGRAVING', materialInput: 'Base vessel', transformation: 'Surface carving', makerRole: 'Naqash', tool: 'Chisels (Kandkari)', skill: 'Expert', output: 'Engraved vessel', authenticity: 'Hand engraving', shortcut: 'Stamping/Acid etching' },
      { id: '04', title: 'TINNING (KALAI)', materialInput: 'Engraved vessel', transformation: 'Coating (if culinary)', makerRole: 'Kalaiwala', tool: 'Heat, Tin', skill: 'High', output: 'Tinned vessel', authenticity: 'Hand tinned', shortcut: 'Electroplating' },
      { id: '05', title: 'FINISHING', materialInput: 'Vessel', transformation: 'Polishing', makerRole: 'Finisher', tool: 'Polishing cloth', skill: 'Moderate', output: 'Finished craft', authenticity: 'Hand polished', shortcut: 'Chemical dip' }
    ],
    techniques: [
      { id: 't1', title: 'FORMING', desc: 'Structural shaping', relatedStage: '02' },
      { id: 't2', title: 'KANDKARI', desc: 'Copper engraving', relatedStage: '03' },
      { id: 't3', title: 'KALAI', desc: 'Tin coating', relatedStage: '04' }
    ],
    fingerprint: {
      labour: { label: 'High', fill: '80%' },
      material: { label: 'Core', fill: '90%' },
      skill: { label: 'Expert', fill: '90%' },
      depth: { label: 'Moderate', fill: '60%' },
      authenticity: { label: 'High', fill: '85%' }
    }
  }
};

export default function ProcessAtlas() {
  const [selectedCraft, setSelectedCraft] = useState('pashmina');
  const [activeStage, setActiveStage] = useState('01');

  const craftIds = [
    { id: 'pashmina', label: 'PASHMINA' },
    { id: 'kani', label: 'KANI' },
    { id: 'carpets', label: 'CARPETS' },
    { id: 'papier-mache', label: 'PAPIER-MÂCHÉ' },
    { id: 'walnut', label: 'WALNUT' },
    { id: 'copperware', label: 'COPPERWARE' }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentData = (CRAFT_DATA as any)[selectedCraft];

  return (
    <section className="kc-process-atlas">
      
      <div className="kc-process-header">
        <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2" style={{ color: 'rgba(180,132,68,1)' }}>
          PROCESS INTELLIGENCE
        </span>
        <h2 className="text-3xl md:text-4xl font-black font-serif mb-4">How Kashmir Crafts Are Made</h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Follow material, skill and technique through every stage of production — from raw input to finished craft.
        </p>

        <div className="kc-process-switcher">
          {craftIds.map(c => (
            <div 
              key={c.id} 
              className="kc-process-tab" 
              data-active={selectedCraft === c.id}
              onClick={() => { setSelectedCraft(c.id); setActiveStage('01'); }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <div className="kc-process-layout">
        
        {!currentData ? (
          <div className="kc-process-spine" style={{ gridColumn: 'span 12', textAlign: 'center', padding: '64px' }}>
            <div className="text-xl font-serif text-white/50 mb-2">Process intelligence record in development</div>
            <div className="text-xs uppercase tracking-widest text-brand-primary">Data coming soon</div>
          </div>
        ) : (
          <>
            {/* SPINE */}
            <div className="kc-process-spine">
              <div className="kc-process-rail"></div>
              
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {currentData.processes.map((stage: any) => (
                <div 
                  key={stage.id}
                  className="kc-process-stage"
                  data-active={activeStage === stage.id}
                  onClick={() => setActiveStage(stage.id)}
                >
                  <div className="kc-process-node"></div>
                  
                  <div className="kc-process-stage-title">
                    <span style={{ color: 'rgba(180,132,68,1)' }}>{stage.id} /</span> {stage.title}
                  </div>

                  {activeStage === stage.id && (
                    <div className="kc-process-stage-content">
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Material Input</span>
                        <span className="kc-process-field-value">{stage.materialInput}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Transformation</span>
                        <span className="kc-process-field-value">{stage.transformation}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Maker Role</span>
                        <span className="kc-process-field-value text-brand-primary font-bold" style={{ color: 'rgba(180,132,68,1)' }}>{stage.makerRole}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Traditional Tool</span>
                        <span className="kc-process-field-value">{stage.tool}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Skill Requirement</span>
                        <span className="kc-process-field-value">{stage.skill}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Authenticity Signal</span>
                        <span className="kc-process-field-value">{stage.authenticity}</span>
                      </div>
                      <div className="kc-process-field">
                        <span className="kc-process-field-label">Common Shortcut</span>
                        <span className="kc-process-field-value" style={{ color: 'rgba(255,255,255,0.4)' }}>{stage.shortcut}</span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                          KHCRF REVIEWED
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(180,132,68,1)' }}>
                          Explore Stage ↗
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CONSOLE */}
            <div className="kc-process-console">
              
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">SELECTED CRAFT</div>
                <div className="text-2xl font-bold font-serif text-white mb-1">{currentData.name}</div>
                <div className="text-xs text-white/50">{currentData.meta}</div>
              </div>

              <div className="mb-10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">RELATED TECHNIQUES</div>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {currentData.techniques.map((tech: any) => (
                  <div key={tech.id} className="kc-technique-record" data-highlight={tech.relatedStage === activeStage}>
                    <div className="text-[10px] font-bold" style={{ color: 'rgba(180,132,68,1)' }}>{tech.id.replace('t', '0')}</div>
                    <div className="text-sm font-bold text-white mb-1">{tech.title}</div>
                    <div className="text-xs text-white/60 mb-2">{tech.desc}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 border-t border-white/10 pt-2">
                      Active at Stage {tech.relatedStage}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">PRODUCTION FINGERPRINT</div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  
                  <div className="kc-fingerprint-row">
                    <span className="kc-fingerprint-label">HAND LABOUR</span>
                    <div className="kc-fingerprint-bar"><div className="kc-fingerprint-fill" style={{ width: currentData.fingerprint.labour.fill }}></div></div>
                    <span className="kc-fingerprint-value">{currentData.fingerprint.labour.label}</span>
                  </div>
                  <div className="kc-fingerprint-row">
                    <span className="kc-fingerprint-label">MATERIAL ROLE</span>
                    <div className="kc-fingerprint-bar"><div className="kc-fingerprint-fill" style={{ width: currentData.fingerprint.material.fill }}></div></div>
                    <span className="kc-fingerprint-value">{currentData.fingerprint.material.label}</span>
                  </div>
                  <div className="kc-fingerprint-row">
                    <span className="kc-fingerprint-label">SKILL INTENSITY</span>
                    <div className="kc-fingerprint-bar"><div className="kc-fingerprint-fill" style={{ width: currentData.fingerprint.skill.fill }}></div></div>
                    <span className="kc-fingerprint-value">{currentData.fingerprint.skill.label}</span>
                  </div>
                  <div className="kc-fingerprint-row">
                    <span className="kc-fingerprint-label">PROCESS DEPTH</span>
                    <div className="kc-fingerprint-bar"><div className="kc-fingerprint-fill" style={{ width: currentData.fingerprint.depth.fill }}></div></div>
                    <span className="kc-fingerprint-value">{currentData.fingerprint.depth.label}</span>
                  </div>
                  <div className="kc-fingerprint-row">
                    <span className="kc-fingerprint-label">AUTHENTICITY</span>
                    <div className="kc-fingerprint-bar"><div className="kc-fingerprint-fill" style={{ width: currentData.fingerprint.authenticity.fill }}></div></div>
                    <span className="kc-fingerprint-value">{currentData.fingerprint.authenticity.label}</span>
                  </div>

                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </section>
  );
}