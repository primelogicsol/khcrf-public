const fs = require('fs');

let c = fs.readFileSync('src/components/business/EvaluateFarmLink.tsx', 'utf8');

const injectionContent = `
            {/* 1. AFTER KHCRF VERIFICATION */}
            <ScrollReveal delay={200}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 border-b border-gray-200 pb-4">
                AFTER KHCRF VERIFICATION
              </h3>
              <p className="text-gray-600 text-sm md:text-base font-light leading-relaxed mb-6">
                Once KHCRF completes independent verification, the verified findings are securely shared with Craftlore. Craftlore uses those findings to calculate your verified Performance Trust Score, determine your rank within the relevant entity category, and strengthen your discoverability across its trade-intelligence ecosystem.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Verified PTS</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Evidence-backed performance score calculated by Craftlore.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Category Ranking</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Ranked separately among Artisans, Businesses, or Institutions.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#050A1E] text-sm mb-2">Greater Discoverability</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">Helps buyers, partners and institutions identify verified entities with stronger trust signals.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* 2. CRAFTLORE RECOGNITION TIERS */}
            <ScrollReveal delay={300}>
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] relative overflow-hidden">
                <h3 className="text-xs font-bold text-[#6B2B08] uppercase tracking-[0.25em] mb-4">
                  CRAFTLORE RECOGNITION TIERS
                </h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
                  Gold, Silver and Bronze are Craftlore administrative recognition tiers for qualifying verified entities. They are separate from KHCRF verification and are not automatically awarded by score alone.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-[#050A1E] text-xs uppercase tracking-wider mb-2">GOLD</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Highest portfolio recognition for selected qualifying entities.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-[#050A1E] text-xs uppercase tracking-wider mb-2">SILVER</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Strong verified standing with enhanced portfolio visibility.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-[#050A1E] text-xs uppercase tracking-wider mb-2">BRONZE</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">Recognized verified standing within Craftlore’s portfolio system.</p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs italic mb-6">
                  Recognition can strengthen profile visibility, buyer confidence and placement within Craftlore Top Portfolios.
                </p>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    KHCRF verifies independently. Craftlore calculates PTS, ranking and recognition.
                  </p>
                </div>
              </div>
            </ScrollReveal>`;

const injectionTarget = `              </div>\n            </ScrollReveal>\n\n            \n          </div>\n        </div>\n      </div>\n    </section>\n  );\n}`;

const replacement = `              </div>\n            </ScrollReveal>\n\n${injectionContent}\n          </div>\n        </div>\n      </div>\n    </section>\n  );\n}`;

if (c.includes(injectionTarget)) {
  c = c.replace(injectionTarget, replacement);
  fs.writeFileSync('src/components/business/EvaluateFarmLink.tsx', c, 'utf8');
  console.log("Success");
} else {
  console.log("Target not found!");
}
