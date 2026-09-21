"use client";

import React, { useState } from 'react';

const EVIDENCE_STEPS = [
  {
    id: '01',
    title: 'Identify',
    description: 'Determine the specific craft category and the material identity of the product in question.'
  },
  {
    id: '02',
    title: 'GI Status',
    description: 'Confirm whether the craft tradition itself has formal Geographical Indication (GI) protection.'
  },
  {
    id: '03',
    title: 'Producer',
    description: 'Check whether the maker or producer is an Authorized User under the relevant GI system. A GI-protected craft name alone does not establish that every seller or producer is authorized.'
  },
  {
    id: '04',
    title: 'Product',
    description: 'Verify the evidence that connects the individual product to the authorized producer and origin.'
  }
];

export default function GiEvidenceStepper() {
  const [activeStep, setActiveStep] = useState('01');
  const activeData = EVIDENCE_STEPS.find(s => s.id === activeStep) || EVIDENCE_STEPS[0];

  return (
    <div className="bg-[#071025] rounded-3xl p-8 border border-white/10 text-white mt-8">
      <h4 className="text-xl font-bold font-serif mb-6">Verify With Evidence</h4>
      
      <div className="flex justify-between items-center mb-6 relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/10 -z-10 -translate-y-1/2"></div>
        
        {EVIDENCE_STEPS.map(step => (
          <button
            key={step.id}
            className={`flex flex-col items-center gap-2 outline-none group bg-[#071025] px-2 ${activeStep === step.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep === step.id ? 'bg-[#a9783c] border-[#a9783c] text-white' : 'bg-[#071025] border-white/20 text-white'}`}>
              {step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeStep === step.id ? 'text-[#a9783c]' : 'text-white'}`}>
              {step.title}
            </span>
          </button>
        ))}
      </div>

      <div className="h-[80px] bg-white/5 border border-white/10 rounded-xl p-4 transition-all">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-1">
          {activeData.title}
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          {activeData.description}
        </p>
      </div>
    </div>
  );
}