const fs = require('fs');

let c = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8');

if (!c.includes('useState')) {
  c = c.replace('import Link from "next/link";', 'import React, { useState } from "react";\nimport Link from "next/link";');
}
if (!c.includes('FaChevronDown')) {
  c = c.replace(/import \{.*?\} from "react-icons\/fa";/, 'import { FaCheckCircle, FaFileSignature, FaChartLine, FaShieldAlt, FaLock, FaChevronDown, FaChevronUp, FaAward } from "react-icons/fa";');
}

// Add state to component
if (!c.includes('const [openTier, setOpenTier]')) {
  c = c.replace(
    /export default function EvaluateFarmLink[^{]*\{/,
    `export default function EvaluateFarmLink({ buttonLink = "/business-support/evaluation" }: { buttonLink?: string }) {
  const [openTier, setOpenTier] = useState<string>('GOLD');`
  );
}

// Define the accordion replacement block
const oldTiersBlockStart = `{/* 2. CRAFTLORE RECOGNITION TIERS */}`;
const oldTiersBlockEnd = `</ScrollReveal>`;

const parts = c.split(oldTiersBlockStart);
if (parts.length > 1) {
  const endIdx = parts[1].indexOf('</ScrollReveal>') + '</ScrollReveal>'.length;
  const afterTiers = parts[1].substring(endIdx);

  const newTiersBlock = `{/* 2. CRAFTLORE RECOGNITION TIERS */}
            <ScrollReveal delay={300}>
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <h3 className="text-xs font-bold text-[#6B2B08] uppercase tracking-[0.25em] mb-4">
                  CRAFTLORE RECOGNITION TIERS
                </h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">
                  Gold, Silver and Bronze are Craftlore administrative recognition tiers for qualifying verified entities. They are separate from KHCRF verification and are not automatically awarded by score alone.
                </p>

                <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-wider">
                  How recognition works <br/>
                  <span className="font-normal text-gray-500">KHCRF verifies evidence &rarr; Craftlore evaluates trust and ranking &rarr; Craftlore may assign recognition tiers</span>
                </p>

                <div className="space-y-4 mb-6">
                  {/* GOLD */}
                  <div className={\`border rounded-2xl overflow-hidden transition-all duration-300 \${openTier === 'GOLD' ? 'border-amber-400/50 bg-amber-50/10 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}\`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'GOLD' ? '' : 'GOLD')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${openTier === 'GOLD' ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400'}\`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">GOLD</h4>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-100">Top Recognition</span>
                          </div>
                          <p className="text-gray-500 text-xs">Highest portfolio recognition for selected qualifying verified entities.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'GOLD' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={\`overflow-hidden transition-all duration-500 ease-in-out \${openTier === 'GOLD' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                      <div className="p-5 pt-0 border-t border-amber-100/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Premier administrative recognition within Craftlore’s portfolio system.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Active KHCRF registration, verified standing, good standing, and selection through Craftlore review.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Increased prominence in portfolio discovery and trust-led buyer evaluation.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Assigned manually, not automatically by raw score.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SILVER */}
                  <div className={\`border rounded-2xl overflow-hidden transition-all duration-300 \${openTier === 'SILVER' ? 'border-gray-400/50 bg-gray-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}\`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'SILVER' ? '' : 'SILVER')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${openTier === 'SILVER' ? 'bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-400'}\`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">SILVER</h4>
                            <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-widest border border-gray-200">Enhanced Visibility</span>
                          </div>
                          <p className="text-gray-500 text-xs">Strong verified standing with enhanced portfolio visibility.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'SILVER' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={\`overflow-hidden transition-all duration-500 ease-in-out \${openTier === 'SILVER' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                      <div className="p-5 pt-0 border-t border-gray-200/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">High-confidence recognition for verified entities with strong standing.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Verified and in good standing, meeting Craftlore review standards.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Improved presentation across portfolio and trade-intelligence surfaces.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Administrative recognition, separate from KHCRF findings.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BRONZE */}
                  <div className={\`border rounded-2xl overflow-hidden transition-all duration-300 \${openTier === 'BRONZE' ? 'border-orange-600/30 bg-orange-50/20 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}\`}>
                    <button 
                      onClick={() => setOpenTier(openTier === 'BRONZE' ? '' : 'BRONZE')}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center shrink-0 \${openTier === 'BRONZE' ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}\`}>
                          <FaAward className="text-lg" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-[#050A1E] text-sm uppercase tracking-wider">BRONZE</h4>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-orange-100">Verified Portfolio</span>
                          </div>
                          <p className="text-gray-500 text-xs">Recognized verified standing within Craftlore’s portfolio system.</p>
                        </div>
                      </div>
                      <div className="text-gray-400 ml-4">
                        {openTier === 'BRONZE' ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    <div className={\`overflow-hidden transition-all duration-500 ease-in-out \${openTier === 'BRONZE' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}>
                      <div className="p-5 pt-0 border-t border-orange-200/50 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meaning</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Entry-level recognition for verified entities meeting portfolio criteria.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Eligibility</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Verified status and qualifying standing under Craftlore rules.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visibility Benefit</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Foundational portfolio presence and stronger discoverability.</p>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Governance Note</span>
                            <p className="text-gray-700 text-xs leading-relaxed">Recognition is reviewed and assigned, not purely score-driven.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    KHCRF verifies independently. Craftlore calculates PTS, ranking and recognition.
                  </p>
                </div>
              </div>
            </ScrollReveal>`;

  
  // wait, earlier I used `afterBlocks`. Since I split by `oldTiersBlockStart`, it's not `afterBlocks`.
  c = parts[0] + newTiersBlock + afterTiers;
}

fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', c, 'utf8');
