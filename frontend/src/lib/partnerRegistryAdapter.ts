export interface GlobalReachMetrics {
  ecosystemCount: number | null;
  sisterOrgCount: number | null;
  approvedPartnerCount: number | null;
}

// Maps any legal-entity orgName to its canonical ecosystem brand name.
// When multiple legal entities share a brand (e.g. DKC USA + India),
// they resolve to the same brand — counted once in Collection A.
const ECOSYSTEM_BRAND: Record<string, string> = {
  "De Koshur Crafts USA":          "De Koshur Crafts",
  "De Koshur Crafts India":        "De Koshur Crafts",
  "Kashmir ArtStay":               "Kashmir ArtStay",
  "Kashmir ArtStay Global USA":    "Kashmir ArtStay",
  "Craftlore":                     "Craftlore",
  "Kashmir EcoWatch":              "Kashmir EcoWatch",
  "Dr. Kumar Foundation USA":      "Dr. Kumar Foundation USA",
  "Prime Logic Solutions USA":     "Prime Logic Solutions USA",
  "Purple Soul USA":               "Purple Soul USA",
  "Team Collab":                   "Team Collab",
};

export const getEcosystemBrand = (name: string) => {
  if (name.includes("ArtStay") || name.includes("Arstay")) return "Kashmir ArtStay";
  if (name.includes("DKC") || name.includes("De Koshur Crafts")) return "De Koshur Crafts";
  if (
    name.includes("Craftlore") || 
    name.includes("CKTRE") || 
    name.includes("CGIS") || 
    name.includes("CLIE") || 
    name.includes("CAIS") || 
    name.includes("CSEME") || 
    name.includes("CRVAS") ||
    name === "Craft Guru" ||
    name === "Craft Digital Passport"
  ) return "Craftlore";
  if (name.includes("EcoWatch") || name.includes("KEW")) return "Kashmir EcoWatch";
  if (name.includes("Prime Logic")) return "Prime Logic Solutions USA";
  if (name.includes("Purple Soul")) return "Purple Soul USA";
  if (name.includes("Kumar Foundation") || name.includes("DKF")) return "Dr. Kumar Foundation USA";

  return ECOSYSTEM_BRAND[name] ?? name;
};

export function computeGlobalReachMetrics(partners: any[]): GlobalReachMetrics {
  if (!partners || !Array.isArray(partners)) {
    return { ecosystemCount: null, sisterOrgCount: null, approvedPartnerCount: null };
  }

  // Count every public ACTIVE registry record assigned to that collection
  // No deduplication by parent organization.
  const ecosystemCount = partners.filter(p => p.collection === "core-ecosystem" || p.collection === "internal-module").length;
  const sisterOrgCount = partners.filter(p => p.collection === "specialized-enterprise").length;
  const approvedPartnerCount = partners.filter(p => p.collection === "institutional-alliance").length;

  return {
    ecosystemCount,
    sisterOrgCount,
    approvedPartnerCount,
  };
}
