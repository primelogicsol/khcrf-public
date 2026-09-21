const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

const startIndex = content.indexOf('export const IssueCoverHero = ({ issue }: { issue: any }) => {');
const nextExportIndex = content.indexOf('export const EditorialNav = () => {');

if (startIndex !== -1 && nextExportIndex !== -1) {
  const newHero = `export const IssueCoverHero = ({ issue }: { issue: any }) => {
  // Extract values with fallbacks
  const masthead = issue.publicationMasthead || 'KHCRF PRESS';
  const eyebrow = issue.heroEyebrow || issue.edition || null;
  const kicker = issue.heroKicker || null;
  const footerLine = issue.heroFooterLine || null;
  
  const coverImage = issue.coverImage || issue.coverImageUrl;

  return (
    <section className="relative w-full bg-[#050505] min-h-[min(100vh,900px)] flex flex-col justify-center overflow-hidden border-b border-white/10 pt-20 md:pt-0">
      
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#000000] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 lg:py-24 flex flex-col lg:grid lg:grid-cols-[minmax(320px,0.8fr)_minmax(400px,1.2fr)] gap-16 lg:gap-20 items-center">
        
        {/* LEFT EDITORIAL COLUMN */}
        <div className="w-full flex flex-col order-2 lg:order-1 animate-fade-in-up z-20">
          
          {/* Top Metadata */}
          <div className="flex flex-col gap-5 mb-10 md:mb-12">
            <div className="flex items-center gap-4 flex-wrap">
              {issue.issueNumber && (
                <div className="border border-white/20 text-[#F6F2EC] text-[10px] md:text-xs uppercase tracking-[0.25em] font-medium px-4 py-1.5 rounded-sm bg-white/5">
                  Issue {issue.issueNumber}
                </div>
              )}
              {masthead && (
                <span className="text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-white/50 font-light">
                  {masthead}
                </span>
              )}
            </div>

            {(issue.edition || eyebrow) && (
              <div className="text-[#F6F2EC] text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] flex items-center gap-4 flex-wrap">
                {issue.edition && <span>{issue.edition}</span>}
                {issue.edition && eyebrow && issue.edition !== eyebrow && <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#F6F2EC]/50 to-transparent"></div>}
                {eyebrow && issue.edition !== eyebrow && <span>{eyebrow}</span>}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-6 md:space-y-8 max-w-xl">
            {kicker && (
              <p className="text-xl md:text-2xl font-serif italic text-white/80 leading-snug">
                {kicker}
              </p>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-serif text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-[1.1] tracking-tight">
              {issue.title}
            </h1>

            {issue.shortDescription && (
              <div className="border-l-[2px] border-[#B8860B]/50 pl-5 py-2 mt-8">
                <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-md">
                  {issue.shortDescription}
                </p>
              </div>
            )}
          </div>

          {/* Footer Line */}
          {footerLine && (
            <div className="mt-12 pt-8 border-t border-white/10 max-w-md">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                {footerLine}
              </p>
            </div>
          )}
          
        </div>

        {/* RIGHT MAGAZINE COVER */}
        <div className="w-full relative order-1 lg:order-2 flex items-center justify-center lg:justify-end animate-fade-in-up delay-100 z-10">
          <div className="relative w-full max-w-[460px] xl:max-w-[540px] aspect-[3/4] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5">
            {coverImage ? (
              <Image 
                src={coverImage}
                alt={issue.coverImageAltText || issue.coverImageAlt || \`Cover of \${masthead || 'Magazine'}\`}
                fill
                className="object-cover object-center"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <span className="text-gray-700 font-serif tracking-[0.2em] text-sm uppercase">Cover Missing</span>
              </div>
            )}
            
            {/* Magazine spine/lighting effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/0 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
};

`;
  
  const newContent = content.substring(0, startIndex) + newHero + content.substring(nextExportIndex);
  fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', newContent);
  console.log('Successfully replaced IssueCoverHero component.');
} else {
  console.log('Could not find the component boundaries.');
}
