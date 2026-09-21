import { PARTICIPANT_CATEGORIES, INDIVIDUAL_CATEGORIES, INSTITUTIONAL_CATEGORIES } from './participant-categories';

export const PREVIEW_PARTICIPANTS: Record<string, any> = {
  "Artisan / Weaver": {
    name: "Abdul Rashid Dar",
    organization: "Independent Kani Weaver",
    district: "Srinagar",
    craftSector: "Kani Weaving",
    email: "artisan.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Manufacturer": {
    name: "Imran Ahmad Khan",
    organization: "Kashmir Heritage Manufacturing",
    district: "Srinagar",
    craftSector: "Wood Carving",
    email: "manufacturer.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Exporter": {
    name: "Sameer Bashir",
    organization: "Valley Craft Exports",
    district: "Budgam",
    craftSector: "Pashmina",
    email: "exporter.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Retailer": {
    name: "Nida Farooq",
    organization: "Srinagar Craft House",
    district: "Srinagar",
    craftSector: "Mixed Crafts",
    email: "retailer.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Online Seller": {
    name: "Aamir Shah",
    organization: "Kashmir Artisan Marketplace",
    district: "Srinagar",
    craftSector: "Apparel & Textiles",
    email: "online.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Student": {
    name: "Mahira Yousuf",
    organization: "University of Kashmir",
    district: "Srinagar",
    craftSector: "Design Studies",
    email: "student.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Researcher": {
    name: "Dr. Sara Qadri",
    organization: "Independent Craft Researcher",
    district: "Srinagar",
    craftSector: "Textile History",
    email: "researcher.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Political Party Representative": {
    name: "Tariq Hussain",
    organization: "Public Policy Cell",
    district: "Srinagar",
    craftSector: "Public Policy",
    email: "political.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Citizen": {
    name: "Shabir Ahmad",
    organization: "Srinagar Resident",
    district: "Srinagar",
    craftSector: "General Consumer",
    email: "citizen.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Youth Participant": {
    name: "Zoya Rashid",
    organization: "Youth Craft Forum",
    district: "Anantnag",
    craftSector: "Modern Crafts",
    email: "youth.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Women Entrepreneur": {
    name: "Rukhsana Jan",
    organization: "Zoon Women Crafts",
    district: "Srinagar",
    craftSector: "Crewel Embroidery",
    email: "women.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Media Professional": {
    name: "Irfan Malik",
    organization: "Kashmir Cultural Desk",
    district: "Srinagar",
    craftSector: "Journalism",
    email: "media.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Tourism Stakeholder": {
    name: "Farah Bhat",
    organization: "Heritage Tourism Network",
    district: "Srinagar",
    craftSector: "Tourism",
    email: "tourism.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Diaspora Member": {
    name: "Aisha Khan",
    organization: "Kashmiri Diaspora, Virginia",
    district: "International",
    craftSector: "Cultural Ambassador",
    email: "diaspora.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "International Buyer / Collector": {
    name: "Michael Harris",
    organization: "Private Collector, United States",
    district: "International",
    craftSector: "Antique Carpets",
    email: "internationalbuyer.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "International Researcher": {
    name: "Dr. Elena Rossi",
    organization: "Cultural Heritage Researcher",
    district: "International",
    craftSector: "Global Supply Chains",
    email: "intresearcher.preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  },
  "Cooperative / Producer Group": {
    name: "Kashmir Weavers Cooperative",
    organization: "Kashmir Weavers Cooperative",
    district: "Srinagar",
    craftSector: "Carpet Weaving",
    email: "coop.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "Financial Institution": {
    name: "J&K Craft Finance Initiative",
    organization: "J&K Craft Finance Initiative",
    district: "Srinagar",
    craftSector: "Financial Services",
    email: "finance.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "University / Academic Institution": {
    name: "University of Kashmir",
    organization: "University of Kashmir",
    district: "Srinagar",
    craftSector: "Academic Research",
    email: "university.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "Government Department": {
    name: "Department of Handicrafts and Handloom",
    organization: "Department of Handicrafts and Handloom",
    district: "Srinagar",
    craftSector: "Administration",
    email: "govt.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "Civil Society Organization": {
    name: "Kashmir Craft Rights Forum",
    organization: "Kashmir Craft Rights Forum",
    district: "Srinagar",
    craftSector: "Civil Rights",
    email: "cso.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "Heritage Organization": {
    name: "Centre for Kashmir Material Heritage",
    organization: "Centre for Kashmir Material Heritage",
    district: "Srinagar",
    craftSector: "Heritage Preservation",
    email: "heritage.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "International Organization / Development Agency": {
    name: "Global Heritage Development Agency",
    organization: "Global Heritage Development Agency",
    district: "International",
    craftSector: "Global Development",
    email: "agency.preview@khcrf.test",
    registrationType: "INSTITUTION"
  },
  "International Museum / Cultural Institution": {
    name: "International Museum of Textile Arts",
    organization: "International Museum of Textile Arts",
    district: "International",
    craftSector: "Museum Curating",
    email: "museum.preview@khcrf.test",
    registrationType: "INSTITUTION"
  }
};

export const PREVIEW_SCENARIOS = [
  {
    id: "public_visitor",
    name: "Public Visitor",
    category: "",
    status: "NOT_REGISTERED",
    modes: []
  },
  {
    id: "new_unregistered",
    name: "New Unregistered User",
    category: "",
    status: "NOT_REGISTERED",
    modes: []
  },
  {
    id: "pending_artisan",
    name: "Pending Artisan",
    category: "Artisan / Weaver",
    status: "PENDING",
    modes: ["Online Survey", "Field Consultation"]
  },
  {
    id: "approved_artisan",
    name: "Approved Artisan",
    category: "Artisan / Weaver",
    status: "APPROVED",
    modes: ["Online Survey", "Field Consultation"]
  },
  {
    id: "approved_exporter",
    name: "Approved Exporter",
    category: "Exporter",
    status: "APPROVED",
    modes: ["Online Survey", "Written Submission"]
  },
  {
    id: "approved_university",
    name: "Approved University",
    category: "University / Academic Institution",
    status: "APPROVED",
    modes: ["Expert Review", "Validation Review", "Written Submission"]
  },
  {
    id: "revision_required_manufacturer",
    name: "Revision-Required Manufacturer",
    category: "Manufacturer",
    status: "REVISION_REQUIRED",
    modes: ["Online Survey"]
  },
  {
    id: "rejected_organization",
    name: "Rejected Organization",
    category: "Civil Society Organization",
    status: "REJECTED",
    modes: []
  },
  {
    id: "suspended_researcher",
    name: "Suspended Researcher",
    category: "Researcher",
    status: "SUSPENDED",
    modes: ["Online Survey", "Expert Review"]
  },
  {
    id: "approved_international_buyer",
    name: "Approved International Buyer",
    category: "International Buyer / Collector",
    status: "APPROVED",
    modes: ["Online Survey", "Field Consultation"]
  },
  {
    id: "all_modes",
    name: "All Participation Modes",
    category: "Artisan / Weaver",
    status: "APPROVED",
    modes: ["Online Survey", "Field Consultation", "Public Hearing", "Validation Review", "Expert Review", "Written Submission"]
  },
  {
    id: "no_modes",
    name: "No Participation Modes",
    category: "Artisan / Weaver",
    status: "APPROVED",
    modes: []
  }
];

export const getSyntheticData = (category: string) => {
  return PREVIEW_PARTICIPANTS[category] || {
    name: "Synthetic Participant",
    organization: "Synthetic Org",
    district: "Unspecified",
    craftSector: "Unspecified",
    email: "preview@khcrf.test",
    registrationType: "INDIVIDUAL"
  };
};
