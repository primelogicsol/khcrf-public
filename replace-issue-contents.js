const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

const regex = /export const IssueContents = \(\{ highlights \}: \{ highlights: string\[\] \}\) => \{[\s\S]*?<\/section>\s*\);\s*\};/;

const replacement = export const IssueContents = ({ highlights }: { highlights: string[] }) => {
    if (!highlights || highlights.length === 0) return null;
    
    // Clean up any stray symbols
    const cleanHighlights = highlights.map(h => h.replace(/[\\+"]/g, '').trim());

    // Parse stats
    let stories = '', artisans = '', crafts = '';
    cleanHighlights.forEach(h => {
      const text = h.toUpperCase();
      if (text.includes('STORIES')) stories = text.replace(/[^0-9]/g, '');
      if (text.includes('ARTISANS')) artisans = text.replace(/[^0-9]/g, '');
      if (text.includes('CRAFTS')) crafts = text.replace(/[^0-9]/g, '');
    });

    const introText = (stories && artisans && crafts) 
      ? \\ stories documenting \ master artisans across \ living craft traditions.\
      : \Exploring Kashmir's living craft heritage through \ key perspectives.\;

    return (
      <section id="contents" className="bg-[#FAF8F3] py-20 border-t border-gray-200/60">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <h3 className="text-[11px] tracking-[0.3em] text-gray-900 uppercase font-bold mb-6">INSIDE THIS ISSUE</h3>
            <p className="text-gray-900 font-serif text-xl md:text-2xl leading-relaxed max-w-2xl">
              {introText}
            </p>
          </div>
  
          <div className="flex flex-col border-t border-gray-200/50">
            {cleanHighlights.map((highlight: string, idx: number) => {
              const num = (idx + 1).toString().padStart(2, '0');
              const label = highlight.replace(/[^A-Za-z\\s]/g, '').trim().toUpperCase();
              return (
                <div key={idx} className="border-b border-gray-200/50 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 transition-colors hover:bg-gray-50/50">
                  <div className="flex items-center gap-6 shrink-0 w-32 sm:w-40">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-[#B8860B] uppercase font-bold flex-1">{label || 'SECTION'}</span>
                    <span className="text-lg font-serif text-gray-400 italic opacity-60">{num}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-serif text-gray-900 tracking-wide">
                    {highlight}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };;

content = content.replace(regex, replacement);
fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Replaced IssueContents');
