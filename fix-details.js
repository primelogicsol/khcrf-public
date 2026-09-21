const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

const startDetails = content.indexOf('export const IssuePublicationDetails = ({ issue }: { issue: any }) => {');
const endDetails = content.indexOf('export const IssueMembershipAccess = ({ issue, accessState }: { issue: any, accessState: string | null }) => {');

if (startDetails !== -1 && endDetails !== -1) {
  const newDetails = `export const IssuePublicationDetails = ({ issue }: { issue: any }) => {
    const yearStr = issue.edition ? (issue.edition.match(/\\d{4}/)?.[0] || '2025') : '2025';

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
                 <span className={\`w-2 h-2 rounded-full \${issue.visibility === 'PUBLIC' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}\`}></span>
                 {issue.visibility === 'PUBLIC' ? 'Public' : 'Members Only'}
               </div>
            </div>
            
          </div>
          
        </div>
      </section>
    );
  };
  
`;
  content = content.substring(0, startDetails) + newDetails + content.substring(endDetails);
  fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
  console.log('Fixed IssuePublicationDetails.');
} else {
  console.log('Could not find IssuePublicationDetails bounds.');
}
