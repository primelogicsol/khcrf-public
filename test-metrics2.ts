import { ECOSYSTEM_PARTNERS } from './frontend/src/config/ecosystemPartners';
const TOP_LEVEL_ECOSYSTEMS = [
  "Craftlore",
  "De Koshur Crafts",
  "Kashmir ArtStay",
  "Kashmir EcoWatch",
  "Dr. Kumar Foundation USA",
  "Prime Logic Solutions USA",
  "Purple Soul USA",
  "Team Collab",
];
const found = ECOSYSTEM_PARTNERS.filter(p => TOP_LEVEL_ECOSYSTEMS.includes(p.orgName)).map(p => p.orgName);
console.log('Found:', found);
const missing = TOP_LEVEL_ECOSYSTEMS.filter(e => !found.includes(e));
console.log('Missing:', missing);
