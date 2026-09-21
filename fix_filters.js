const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Filter logic\s*const filteredHearings = useMemo\(\(\) => \{[\s\S]*?if \(selectedStatus !== 'ALL'\) \{[\s\S]*?\}\s*if \(selectedStakeholder !== 'ALL'\)/m;

const replacement = `// Filter logic
    const baseHearingsForStatusFacets = useMemo(() => {
      let result = [...hearings];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(h => 
          h.title?.toLowerCase().includes(q) || 
          h.venue?.toLowerCase().includes(q) || 
          h.shortSummary?.toLowerCase().includes(q) ||
          h.fullDescription?.toLowerCase().includes(q) ||
          h.district?.toLowerCase().includes(q) ||
          h.craftFocus?.toLowerCase().includes(q) ||
          h.panelChair?.toLowerCase().includes(q) ||
          h.agenda?.toLowerCase().includes(q) ||
          h.summary?.toLowerCase().includes(q) ||
          h.recommendations?.toLowerCase().includes(q) ||
          (h.topics && h.topics.some((t: string) => t.toLowerCase().includes(q))) ||
          (h.moderators && h.moderators.some((m: string) => m.toLowerCase().includes(q))) ||
          (h.speakers && h.speakers.some((s: string) => s.toLowerCase().includes(q)))
        );
      }

      if (selectedDistrict !== 'ALL') {
        result = result.filter(h => h.district === selectedDistrict);
      }

      if (selectedTopic !== 'ALL') {
        result = result.filter(h => {
          if (!h.topics || !Array.isArray(h.topics)) return false;
          return h.topics.includes(selectedTopic);
        });
      }

      if (selectedCraft !== 'ALL') {
        result = result.filter(h => {
          if (!h.craftFocus) return false;
          let crafts = Array.isArray(h.craftFocus) ? h.craftFocus : [h.craftFocus];
          // Core rule: Match specific craft OR if the hearing is cross-craft
          return crafts.includes(selectedCraft) || crafts.includes('ALL_CRAFTS') || crafts.includes('Cross-craft') || crafts.includes('All Crafts');
        });
      }

      if (selectedStakeholder !== 'ALL')`;

c = c.replace(regex, replacement);

const regex2 = /if \(activeTab === 'map'\) \{\s*result = result\.filter\(h => h\.district && h\.district !== 'ALL'\);\s*\}\s*return result;\s*\}, \[hearings, searchQuery, selectedDistrict, selectedTopic, selectedCraft, selectedStatus, selectedStakeholder, selectedParticipation, selectedDateRange, activeTab\]\);/m;

const replacement2 = `if (activeTab === 'map') {
        result = result.filter(h => h.district && h.district !== 'ALL');
      }
      return result;
    }, [hearings, searchQuery, selectedDistrict, selectedTopic, selectedCraft, selectedStakeholder, selectedParticipation, selectedDateRange, activeTab]);

    const filteredHearings = useMemo(() => {
      let result = [...baseHearingsForStatusFacets];
      if (selectedStatus !== 'ALL') {
        result = result.filter(h => {
          const s = selectedStatus.toUpperCase();
          if (s === 'LIVE / ONGOING') {
            return h.status === 'LIVE' || h.status === 'ONGOING';
          }
          if (s === 'UPCOMING') {
            return h.status === 'UPCOMING' || h.status === 'SCHEDULED' || h.status === 'REGISTRATION_OPEN';
          }
          if (s === 'SCHEDULED' || s === 'REGISTRATION OPEN') {
            return h.registrationStatus === 'OPEN';
          }
          return h.status === s;
        });
      }
      return result;
    }, [baseHearingsForStatusFacets, selectedStatus]);`;

c = c.replace(regex2, replacement2);

fs.writeFileSync(file, c);
console.log("Updated filteredHearings logic!");
