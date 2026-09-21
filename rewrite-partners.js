const fs = require('fs');
const content = fs.readFileSync('frontend/src/config/ecosystemPartners.ts', 'utf8');

// We need to parse the array, but it's exported as a JS module.
// Let's execute it to get the array.
const jsCode = content.replace('export const ECOSYSTEM_PARTNERS =', 'module.exports =');
fs.writeFileSync('temp_partners.js', jsCode);
const partners = require('./temp_partners.js');

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

let specializedCount = 0;

const normalized = partners.map(p => {
    let collection = "internal-module";
    let entityType = "service";
    
    if (TOP_LEVEL_ECOSYSTEMS.includes(p.orgName)) {
        collection = "core-ecosystem";
        entityType = "organization";
    } else {
        // Let's pick 16 to be "specialized-enterprise"
        if (specializedCount < 16) {
            collection = "specialized-enterprise";
            entityType = "enterprise";
            specializedCount++;
        } else {
            if (p.orgName.includes('Engine') || p.orgName.includes('CKTRE') || p.orgName.includes('CLIE') || p.orgName.includes('CGIS')) {
                entityType = "engine";
            } else if (p.orgName.includes('Platform') || p.orgName.includes('AVA')) {
                entityType = "platform";
            } else {
                entityType = "program";
            }
        }
    }
    return { ...p, collection, entityType };
});

// Add missing "De Koshur Crafts"
if (!normalized.find(p => p.orgName === "De Koshur Crafts")) {
    normalized.unshift({
        id: "KHCRF-PTR-000000",
        orgName: "De Koshur Crafts",
        status: "ACTIVE",
        country: "India",
        collaborationType: ["Commerce", "Ecosystem"],
        collaborationAreas: ["Innovation and Technology", "Artisan Welfare"],
        projectDescription: "De Koshur Crafts is the core commercial ecosystem for authentic Kashmir crafts.",
        collection: "core-ecosystem",
        entityType: "organization"
    });
}

const outCode = 'export const ECOSYSTEM_PARTNERS = ' + JSON.stringify(normalized, null, 2) + ';';
fs.writeFileSync('frontend/src/config/ecosystemPartners.ts', outCode, 'utf8');
