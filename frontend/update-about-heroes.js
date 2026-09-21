const fs = require('fs');
const path = require('path');

const configMap = {
  'shared-principle': { key: 'shared-principle', fallback: 'aboutSharedPrincipleHeroFallback' },
  'mission': { key: 'mission', fallback: 'aboutMissionHeroFallback' },
  'leadership': { key: 'leadership', fallback: 'aboutLeadershipHeroFallback' },
  'compliance': { key: 'compliance', fallback: 'aboutComplianceHeroFallback' },
  'memberships': { key: 'memberships', fallback: 'aboutMembershipsHeroFallback' },
  'partner-network': { key: 'partner-network', fallback: 'aboutPartnerNetworkHeroFallback' },
  'apprenticeship': { key: 'apprenticeship', fallback: 'aboutApprenticeshipHeroFallback' },
  'career': { key: 'career', fallback: 'aboutCareerHeroFallback' },
  'hcrf-project': { key: 'hcrf-project', fallback: 'aboutHcrfProjectHeroFallback' },
  'donations': { key: 'donations', fallback: 'aboutDonationsHeroFallback' },
  'contact': { key: 'contact', fallback: 'aboutContactHeroFallback' },
};

Object.keys(configMap).forEach(file => {
  const fPath = path.join('C:\\Users\\Fayaz\\Sufipulseupdate2026\\HCRF 2026\\hcr_foundation_full_govind\\frontend\\src\\app\\(main)\\about', file, 'page.tsx');
  if (fs.existsSync(fPath)) {
    let content = fs.readFileSync(fPath, 'utf8');
    
    // add import if not there
    if (!content.includes(configMap[file].fallback)) {
      content = content.replace(
        /import UniversalEditorialHero from ["']@\/components\/hero\/UniversalEditorialHero["'];/,
        `import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";\nimport { ${configMap[file].fallback} } from "@/config/heroFallbacks";`
      );
    }
    
    // replace hero component
    content = content.replace(
      /<UniversalEditorialHero[\s\S]*?\}\} \/>/,
      `<UniversalEditorialHero pageKey="${configMap[file].key}" fallbackConfig={${configMap[file].fallback} as any} />`
    );
    
    // Ensure we removed pt-32 or pb-24 from <main>
    content = content.replace(/<main className="[^"]*">/, (match) => {
      let classes = match.match(/className="([^"]*)"/)[1];
      classes = classes.replace(/\bpt-32\b/g, '').replace(/\bpb-24\b/g, '').replace(/\s+/g, ' ').trim();
      return classes ? `<main className="${classes}">` : `<main>`;
    });

    fs.writeFileSync(fPath, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
