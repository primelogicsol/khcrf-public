import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Helpers ---
export const getEditorialContent = (text: string) => {
  if (!text) return { firstPara: '', restParas: [], pullQuote: '' };
  
  let paras = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  
  if (paras.length <= 1) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    paras = [];
    let current = '';
    sentences.forEach((s, i) => {
      current += (current ? ' ' : '') + s.trim();
      if (i === 0 || i % 2 === 1 || i === sentences.length - 1) {
        paras.push(current);
        current = '';
      }
    });
    if (current) paras.push(current);
  }

  const firstPara = paras[0] || '';
  const restParas = paras.slice(1);
  
  let pullQuote = '';
  const allSentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const specificQuote = allSentences.find(s => s.toLowerCase().includes('workshops have served'));
  if (specificQuote) pullQuote = specificQuote.trim();
  else if (allSentences.length > 2) pullQuote = allSentences[Math.floor(allSentences.length / 2)].trim();
  
  return { firstPara, restParas, pullQuote };
};

// --- Components ---

export const IssueCoverHero = ({ issue }: { issue: any }) => {
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
                alt={issue.coverImageAltText || issue.coverImageAlt || `Cover of ${masthead || 'Magazine'}`}
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

export const EditorialNav = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 hidden md:block transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-center gap-20">
        <a href="#overview" className="text-[10px] font-sans tracking-[0.25em] text-gray-400 uppercase hover:text-[#F6F2EC] transition-colors relative after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2px] after:bg-[#F6F2EC] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Overview</a>
        <a href="#contents" className="text-[10px] font-sans tracking-[0.25em] text-gray-400 uppercase hover:text-[#F6F2EC] transition-colors relative after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2px] after:bg-[#F6F2EC] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Contents</a>
        <a href="#publication" className="text-[10px] font-sans tracking-[0.25em] text-gray-400 uppercase hover:text-[#F6F2EC] transition-colors relative after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2px] after:bg-[#F6F2EC] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Publication</a>
        <a href="#membership" className="text-[10px] font-sans tracking-[0.25em] text-gray-400 uppercase hover:text-[#F6F2EC] transition-colors relative after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[2px] after:bg-[#F6F2EC] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">Membership</a>
      </div>
    </div>
  );
};

export const IssueOverview = ({ issue }: { issue: any }) => {
  if (!issue.issueOverview) return null;
  
  const { firstPara, restParas, pullQuote } = getEditorialContent(issue.issueOverview);
  const firstLetter = firstPara.charAt(0);
  const remainingFirstPara = firstPara.slice(1);
  
  return (
    <section id="overview" className="bg-[#FAF8F3] py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-gray-300 font-serif tracking-[0.3em] text-[10px] mb-12 overflow-hidden whitespace-nowrap text-center opacity-70">
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        
        <div className="text-center mb-16">
          <h3 className="text-[11px] tracking-[0.3em] text-gray-900 uppercase font-bold mb-8">About This Issue</h3>
          <div className="w-12 h-[1px] bg-[#B8860B] mx-auto"></div>
        </div>

        <div className="font-serif text-gray-800 text-left">
          {firstPara && (
            <p className="text-xl md:text-2xl leading-[1.8] mb-12 text-gray-900">
              <span className="float-left text-7xl md:text-[6rem] leading-[0.8] pr-5 pt-3 font-serif text-[#B8860B]">
                {firstLetter}
              </span>
              {remainingFirstPara}
            </p>
          )}

          {restParas.map((para: string, idx: number) => {
            const showPullQuote = idx === Math.floor(restParas.length / 2) && pullQuote;
            return (
              <React.Fragment key={idx}>
                {showPullQuote && (
                  <blockquote className="my-16 border-l-2 border-[#B8860B] pl-8 py-2 max-w-[90%] mx-auto">
                    <p className="text-2xl md:text-3xl font-serif italic text-gray-900 leading-[1.4]">
                      "{pullQuote}"
                    </p>
                  </blockquote>
                )}
                <p className="text-lg leading-[2.2] mb-8 text-gray-700">
                  {para}
                </p>
              </React.Fragment>
            );
          })}
        </div>
        
        <div className="mt-16 text-right">
          <p className="font-serif italic text-gray-500 text-lg">— Editorial Note</p>
        </div>

        <div className="text-gray-300 font-serif tracking-[0.3em] text-[10px] mt-24 overflow-hidden whitespace-nowrap text-center opacity-70">
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        
      </div>
    </section>
  );
};

export const IssueCoverStory = ({ issue }: { issue: any }) => {
  if (!issue.coverStory && !issue.coverStoryTitle) return null;
  
  return (
    <section className="bg-[#050505] text-white py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#F6F2EC]/50"></div>
            <h3 className="text-[10px] tracking-[0.4em] text-[#F6F2EC] uppercase font-light">Featured Article</h3>
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#F6F2EC]/50"></div>
          </div>
          
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.25em] mb-6">Cover Story</p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 leading-[1.1] mb-12 max-w-2xl mx-auto drop-shadow-lg">
            {issue.coverStoryTitle || issue.coverStory}
          </h2>
          
          <div className="flex items-center justify-center gap-8 text-[10px] font-sans text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-2"><svg className="w-3 h-3 text-[#F6F2EC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>2 Min Read</span>
            <span className="w-1 h-1 bg-[#F6F2EC]/50 rounded-full"></span>
            <span className="flex items-center gap-2"><svg className="w-3 h-3 text-[#F6F2EC]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>Editorial Team</span>
            <span className="w-1 h-1 bg-[#F6F2EC]/50 rounded-full"></span>
            <span>{issue.edition || 'Spring 2026'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export const IssueContents = ({ highlights }: { highlights: string[] }) => {
    if (!highlights || highlights.length === 0) return null;
    
    // Clean up any stray symbols (e.g. `+` or `"`)
    const cleanHighlights = highlights.map(h => h.replace(/[\+"]/g, '').trim());

    // Parse stats
    let stories = '', artisans = '', crafts = '';
    cleanHighlights.forEach(h => {
      const text = h.toUpperCase();
      if (text.includes('STORIES')) stories = text.replace(/[^0-9]/g, '');
      if (text.includes('ARTISANS')) artisans = text.replace(/[^0-9]/g, '');
      if (text.includes('CRAFTS')) crafts = text.replace(/[^0-9]/g, '');
    });

    const introText = (stories && artisans && crafts) 
      ? `${stories} stories documenting ${artisans} master artisans across ${crafts} living craft traditions.`
      : `Exploring Kashmir's living craft heritage through ${cleanHighlights.length} key perspectives.`;

    return (
      <section id="contents" className="bg-[#FAF8F3] py-20 border-t border-gray-200/60">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          
          <div className="mb-12">
            <h3 className="text-[11px] tracking-[0.3em] text-gray-900 uppercase font-bold mb-6">Inside This Issue</h3>
            <p className="text-gray-900 font-serif text-xl md:text-2xl leading-relaxed max-w-2xl">
              {introText}
            </p>
          </div>
  
          <div className="flex flex-col border-t border-gray-200/50">
            {cleanHighlights.map((highlight: string, idx: number) => {
              const num = (idx + 1).toString().padStart(2, '0');
              const label = highlight.replace(/[^A-Za-z\s]/g, '').trim().toUpperCase();
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
  };

  export const IssuePublicationDetails = ({ issue }: { issue: any }) => {
    const yearStr = issue.edition ? (issue.edition.match(/\d{4}/)?.[0] || '2025') : '2025';

    return (
      <section id="publication" className="bg-[#050505] py-24 md:py-32 text-white border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F6F2EC]/5 to-transparent pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="text-center mb-20">
            <h3 className="text-[10px] tracking-[0.3em] text-[#F6F2EC] uppercase font-bold mb-4">Publication Details</h3>
            <p className="text-3xl font-serif italic text-white/50">Colophon</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-16 gap-x-8 text-xs font-sans text-gray-300">
            
            <div className="col-span-2 md:col-span-5 text-center border-b border-white/10 pb-12 mb-4">
               <div className="text-[9px] tracking-[0.3em] text-[#F6F2EC] uppercase mb-4">Publication</div>
               <div className="text-2xl md:text-4xl font-serif text-white uppercase tracking-[0.15em] drop-shadow-md">{issue.publicationMasthead || 'KHCRF Magazine'}</div>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6">
               <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Edition</div>
               <div className="text-sm font-medium text-white">{issue.edition || 'N/A'}</div>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6">
               <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Issue Number</div>
               <div className="text-sm font-medium text-white">{issue.issueNumber || 'N/A'}</div>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6">
               <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Year</div>
               <div className="text-sm font-medium text-white">{yearStr}</div>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6">
               <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Language</div>
               <div className="text-sm font-medium text-white">English</div>
            </div>
            
            <div className="flex flex-col border-l border-white/10 pl-6">
               <div className="text-[9px] tracking-[0.3em] text-white/40 uppercase mb-2">Access</div>
               <div className="text-sm font-medium text-white flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${issue.visibility === 'PUBLIC' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`}></span>
                 {issue.visibility === 'PUBLIC' ? 'Public' : 'Members Only'}
               </div>
            </div>
            
          </div>
          
        </div>
      </section>
    );
  };
  
export const IssueMembershipAccess = ({ issue, accessState }: { issue: any, accessState: string | null }) => {
  const isPublic = issue.visibility === 'PUBLIC';

  const benefits = (
    <div className="mt-16 pt-12 border-t border-white/10 text-left max-w-md mx-auto">
      <h4 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-8 font-light text-center">Membership Benefits</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
        <div className="flex items-center gap-4 group"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F6F2EC]/10 text-[#F6F2EC] text-xs border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] group-hover:text-black transition-colors">✔</span> <span className="text-sm text-gray-300 font-light">Read online</span></div>
        {issue.downloadable && (
            <div className="flex items-center gap-4 group"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F6F2EC]/10 text-[#F6F2EC] text-xs border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] group-hover:text-black transition-colors">✔</span> <span className="text-sm text-gray-300 font-light">Download PDF</span></div>
          )}
        <div className="flex items-center gap-4 group"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F6F2EC]/10 text-[#F6F2EC] text-xs border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] group-hover:text-black transition-colors">✔</span> <span className="text-sm text-gray-300 font-light">Exclusive archive</span></div>
        <div className="flex items-center gap-4 group"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F6F2EC]/10 text-[#F6F2EC] text-xs border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] group-hover:text-black transition-colors">✔</span> <span className="text-sm text-gray-300 font-light">Quarterly magazine</span></div>
      </div>
    </div>
  );

  if (isPublic) {
    return (
      <section id="membership" className="bg-[#050505] py-24 md:py-32 text-white border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F2EC]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-[11px] font-sans tracking-[0.3em] text-gray-500 uppercase mb-12">Membership Access</h2>
          
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-10 md:p-16 shadow-[0_0_50px_rgba(212,175,55,0.05)] transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="mb-8">
              <span className="inline-flex items-center gap-3 text-emerald-400 font-sans tracking-[0.2em] text-[10px] font-bold uppercase bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PUBLIC
              </span>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-serif mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 leading-tight">
              This issue is available to the public.
            </h3>
            
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              You may now read the full digital edition online.
            </p>
            
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <Link href={`/master-artisans/issues/${issue.slug}/read`} className="group relative px-8 py-4 bg-[#F6F2EC] text-black text-[11px] font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                <span className="relative z-10">Open Digital Edition</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              </Link>
            </div>
            
            {benefits}
          </div>
        </div>
      </section>
    );
  }

  const renderContent = () => {
    switch (accessState) {
      case 'ADMIN_AUTHORIZED':
        return (
          <>
            <div className="mb-6">
              <span className="text-[#B8860B] font-sans tracking-[0.2em] text-xs font-bold uppercase">● ADMINISTRATIVE ACCESS</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              You are viewing this issue with administrative privileges.
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              As an administrator, you have full preview access regardless of your personal membership status.
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href={`/master-artisans/issues/${issue.slug}/read`} className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">
                Preview Issue Reader
              </Link>
              {issue.downloadable && (
                <button className="px-8 py-4 border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase hover:border-white transition-colors">
                  Download PDF
                </button>
              )}
            </div>
          </>
        );

      case 'APPROVED':
        return (
          <>
            <div className="mb-6">
              <span className="text-emerald-500 font-sans tracking-[0.2em] text-xs font-bold uppercase">● APPROVED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Your membership is active.
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              You may now access this issue.
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href={`/master-artisans/issues/${issue.slug}/read`} className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">
                Read Magazine
              </Link>
              {issue.downloadable && (
                <button className="px-8 py-4 border border-white/20 text-white text-[11px] font-bold tracking-widest uppercase hover:border-white transition-colors">
                  Download PDF
                </button>
              )}
            </div>
          </>
        );

      case 'UNDER_REVIEW':
      case 'SUBMITTED':
      case 'PENDING':
        return (
          <>
            <div className="mb-6">
              <span className="text-amber-500 font-sans tracking-[0.2em] text-xs font-bold uppercase">● UNDER REVIEW</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Application Under Review
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Your membership application is currently being reviewed by KHCRF administrators. Magazine access will be enabled upon approval.
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href="/dashboard/membership" className="px-8 py-4 border border-white text-white text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                View Status
              </Link>
            </div>
          </>
        );

      case 'REGISTERED_NO_APPLICATION':
        return (
          <>
            <div className="mb-6">
              <span className="text-[#B8860B] font-sans tracking-[0.2em] text-xs font-bold uppercase">● APPLICATION REQUIRED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Application Required
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Your KHCRF account is active, but no membership application has been submitted. Apply to request access.
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href={`/about/memberships?returnTo=${encodeURIComponent(`/master-artisans/issues/${issue.slug}`)}`} className="px-8 py-4 bg-[#B8860B] text-white text-[11px] font-bold tracking-widest uppercase hover:bg-[#996515] transition-colors">
                Apply for Membership
              </Link>
              <Link href="/about/memberships" className="text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
                Information
              </Link>
            </div>
          </>
        );

      case 'UNAUTHENTICATED':
        return (
          <>
            <div className="mb-6">
              <span className="text-gray-400 font-sans tracking-[0.2em] text-xs font-bold uppercase">● ACCOUNT REQUIRED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Join KHCRF to access this issue.
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Create an KHCRF account to begin your membership application and access members-only publications.
            </p>
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <Link href={`/register?redirect=${encodeURIComponent(`/master-artisans/issues/${issue.slug}`)}`} className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">
                  Create Account
                </Link>
                <Link href={`/login?redirect=${encodeURIComponent(`/master-artisans/issues/${issue.slug}`)}`} className="text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </div>
          </>
        );

      case 'REJECTED':
        return (
          <>
            <div className="mb-6">
              <span className="text-red-500 font-sans tracking-[0.2em] text-xs font-bold uppercase">● NOT APPROVED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Application Not Approved
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Your previous membership application was not approved. Review your status or submit a new application if eligible.
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <Link href="/dashboard/membership" className="px-8 py-4 border border-white text-white text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                View Status
              </Link>
            </div>
          </>
        );

      case 'EXPIRED':
        return (
          <>
            <div className="mb-6">
              <span className="text-red-500 font-sans tracking-[0.2em] text-xs font-bold uppercase">● EXPIRED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Membership Expired
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Renew your membership to regain access to this issue and other resources.
            </p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <Link href="/dashboard/membership" className="px-8 py-4 bg-white text-black text-[11px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors">
                Renew Membership
              </Link>
            </div>
          </>
        );

      case null:
          return (
            <div className="flex justify-center items-center py-12">
              <span className="inline-block w-8 h-8 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
            </div>
          );
        case 'SUSPENDED':
        default:
        return (
          <>
            <div className="mb-6">
              <span className="text-red-500 font-sans tracking-[0.2em] text-xs font-bold uppercase">● SUSPENDED</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 text-white leading-tight">
              Access Temporarily Unavailable
            </h3>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto text-base leading-relaxed">
              Your membership is currently suspended. Member-only magazines, downloads, and research resources will remain unavailable until your account is reviewed or reinstated.
            </p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <Link href="/dashboard/membership" className="px-8 py-4 border border-gray-500 text-white text-[11px] font-bold tracking-widest uppercase hover:border-white transition-colors">
                Request Review
              </Link>
              <Link href="/contact" className="text-[11px] font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <section id="membership" className="bg-[#050505] py-24 md:py-32 text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#F6F2EC]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 className="text-[11px] font-sans tracking-[0.3em] text-gray-500 uppercase mb-12">Membership Access</h2>
        
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-10 md:p-16 shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
          {renderContent()}
          {benefits}
        </div>
      </div>
    </section>
  );
};

