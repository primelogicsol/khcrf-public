export interface StudioMedia {
  catalogueImage?: {
    src: string;
    alt: string;
    subject?: string;
    craft?: string;
    activity?: string;
    location?: string;
    rightsStatus?: string;
  };
  heroImage?: {
    src: string;
    alt: string;
  };
  posterImage?: { src: string; alt: string; };
  previewFrame?: { src: string; alt: string; };
}

export interface StudioEntity {
  id: string;
  slug: string;
  studioType: 'WORKSHOP' | 'DOCUMENTARY_FILM' | 'VIDEO_INTERVIEW' | 'ORAL_HISTORY' | 'CRAFT_DEMONSTRATION';
  title: string;
  subtitle?: string;
  description: string;
  
  media: StudioMedia;
  mediaStatus: 'COMPLETE' | 'MEDIA_CONTENT_INCOMPLETE';
  
  duration?: string;
  language?: string;
  location?: string;
  recordedYear?: string;
  transcriptAvailable?: boolean;
  
  artisanIds?: string[];
  craftIds?: string[];
  districtIds?: string[];
  workshopIds?: string[];
  relatedPublications?: string[];
  relatedStudioRecords?: string[];
  knowledge_ids?: string[];
  
  publicOverview: {
    synopsis: string;
    premise?: string;
    craft?: string;
    subject?: string;
    theme?: string;
  };
  contextModules: {
    title: string;
    image?: string;
    content: string;
  }[];
  contentPreview: {
    order?: string;
    title: string;
    durationOrStep?: string;
    publicSummary: string;
  }[];
  
  publicVisibility: 'PUBLIC' | 'UNLISTED';
  accessStatus: 'READY' | 'PROCESSING' | 'LOCKED';
  requiredEntitlement: string;
}

const BASE_WEAVE = "https://images.unsplash.com/photo-1605814571933-255d64b18cb6?q=80&w=1600&auto=format&fit=crop";
const BASE_COPPER = "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1600&auto=format&fit=crop";
const BASE_WOOD = "https://images.unsplash.com/photo-1621252179027-9d7e52b2fbd2?q=80&w=1600&auto=format&fit=crop";
const BASE_PAPIER = "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=1600&auto=format&fit=crop";
const BASE_AUDIO = "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1600&auto=format&fit=crop";
const BASE_PORTRAIT = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop";
const BASE_ARCH = "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?q=80&w=1600&auto=format&fit=crop";
const BASE_CARPET = "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1600&auto=format&fit=crop";

export const StudioRegistry: StudioEntity[] = [
  // ==========================================
  // WORKSHOPS (6)
  // ==========================================
  {
    id: "KHCRF-WK-2026-001", slug: "kani-weavers-of-kanihama", studioType: "WORKSHOP",
    title: "The Kani Weavers of Kanihama", subtitle: "A living production environment",
    description: "A living Kani workshop community viewed through its masters, looms, apprentices, working rhythms and systems of collective textile knowledge.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/masters_of_kani_1787192090096.jpg",
        alt: "Wide environmental view of multiple Kani weavers actively working at their wooden looms in Kanihama.",
        subject: "Kani Workshop Environment", craft: "Kani Weaving", activity: "Communal Weaving", location: "Kanihama, Budgam", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/masters_of_kani_1787192090096.jpg", alt: "Cinematic wide shot of the Kanihama Kani workshop floor." }
    },
    location: "BUDGAM", recordedYear: "2026",
    relatedPublications: ["masters-of-kani", "the-living-loom"], relatedStudioRecords: ["the-last-kani-masters", "reading-the-talim"],
    publicOverview: { synopsis: "Comprehensive documentation of the Kanihama weaving cluster.", premise: "A workshop is more than a room; it is an institution of knowledge transmission.", craft: "Kani Weaving", subject: "Workshop Documentation", theme: "Production Ecosystem" },
    contextModules: [ { title: "The Environment", content: "The physical and social organization of the weaving space." } ],
    contentPreview: [ { title: "People", publicSummary: "The master, the weavers, and the apprentices." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-WK-2026-002", slug: "copper-workshops-downtown", studioType: "WORKSHOP",
    title: "The Copper Workshops of Downtown Srinagar", subtitle: "Rhythm of the hammers",
    description: "Inside the historic workshop environment where copper is shaped, hammered, engraved and transmitted from experienced practitioners to younger hands.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_cop_2.jpg",
        alt: "Environmental documentary photograph of a historic copper workshop with multiple artisans actively shaping and engraving vessels.",
        subject: "Downtown Copper Workshops", craft: "Copperware", activity: "Vessel shaping and engraving", location: "Downtown Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_cop_2.jpg", alt: "Wide view of copper artisans in a dimly lit downtown workshop." }
    },
    location: "SRINAGAR", recordedYear: "2026",
    relatedPublications: ["the-copper-masters"], relatedStudioRecords: ["a-life-in-copper", "hammering-a-copper-form"],
    publicOverview: { synopsis: "An immersive documentation of the contiguous copper workshops of old Srinagar.", premise: "Copper working is a communal choreography of heat, force, and extreme precision.", craft: "Copperware", subject: "Downtown Production", theme: "Urban Craft Ecosystems" },
    contextModules: [ { title: "The Quarter", content: "Historically specialized neighbourhoods that dictate the rhythm of the craft." } ],
    contentPreview: [ { title: "The Forge", publicSummary: "Heating and preparing raw copper." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-WK-2026-003", slug: "walnut-woodcarver-workshop", studioType: "WORKSHOP",
    title: "The Walnut Woodcarvers' Workshop", subtitle: "Grain, layout and relief",
    description: "A documentary record of wood selection, carving tools, motif preparation, relief work and the judgment accumulated through decades of practice.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_wood_2.jpg",
        alt: "Environmental shot of a woodcarving bench covered in chisels and mallets, with a master artisan working on a large walnut panel.",
        subject: "Woodcarving Atelier", craft: "Walnut Woodcarving", activity: "Panel Carving", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_wood_2.jpg", alt: "Wide shot of a woodcarving workshop showing timber storage and active carving benches." }
    },
    location: "SRINAGAR", recordedYear: "2026",
    relatedPublications: ["walnut-wood-crafters"], relatedStudioRecords: ["carving-the-walnut-motif"],
    publicOverview: { synopsis: "An analysis of the specialized space where raw walnut timber is transformed.", premise: "The organization of a carver's tool wall is an index of their accumulated knowledge.", craft: "Walnut Woodcarving", subject: "Carving Atelier", theme: "Spatial Organization" },
    contextModules: [ { title: "The Timber", content: "Seasoning and storage of mature walnut wood." } ],
    contentPreview: [ { title: "Tool Selection", publicSummary: "Hundreds of specialized chisels." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-WK-2026-004", slug: "papier-mache-atelier", studioType: "WORKSHOP",
    title: "The Papier-Mâché Atelier", subtitle: "Surface and ornament",
    description: "The interconnected world of object preparation, naqashi, pigments, ornament, finishing and the specialist practitioners behind the painted surface.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_pap_2.jpg",
        alt: "A papier-mâché workshop interior showing both sakhtsazi object preparation and naqashi painting stations.",
        subject: "Papier-Mâché Workshop", craft: "Papier-Mâché", activity: "Painting and Preparation", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_pap_2.jpg", alt: "Cinematic wide shot of the naqashi painting room filled with natural light." }
    },
    location: "SRINAGAR", recordedYear: "2026",
    relatedPublications: ["papier-mache-the-painted-masters"], relatedStudioRecords: ["the-naqashs-brush"],
    publicOverview: { synopsis: "Documentation of the bifurcated papier-mâché process.", premise: "A single object requires two entirely distinct artisanal environments.", craft: "Papier-Mâché", subject: "Specialized Ateliers", theme: "Division of Labor" },
    contextModules: [ { title: "Pigments", content: "Preparation of traditional organic colours." } ],
    contentPreview: [ { title: "Naqashi", publicSummary: "The painting atelier." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-WK-2026-005", slug: "inside-khatamband-workshop", studioType: "WORKSHOP",
    title: "Inside a Khatamband Workshop", subtitle: "Geometry and alignment",
    description: "Geometry, component preparation, precision cutting and assembly inside a workshop preserving one of Kashmir's most sophisticated architectural crafts.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/masters_of_khatamband_1787192106568.jpg",
        alt: "Environmental workshop photography of artisans cutting and dry-fitting geometric wooden Khatamband ceiling components.",
        subject: "Khatamband Assembly Workshop", craft: "Khatamband", activity: "Component cutting and assembly", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/masters_of_khatamband_1787192106568.jpg", alt: "Cinematic view of the Khatamband geometric layout floor." }
    },
    location: "SRINAGAR", recordedYear: "2026",
    relatedPublications: ["architectural-woodwork-heritage"], relatedStudioRecords: ["assembling-khatamband"],
    publicOverview: { synopsis: "Recording the meticulous process of interlocking polygonal wooden pieces.", premise: "Architectural integrity relies on mathematical precision.", craft: "Khatamband", subject: "Architectural Craft", theme: "Geometry and Mathematics" },
    contextModules: [ { title: "The Geometry", content: "Classical geometric principles guiding the polygonal cuts." } ],
    contentPreview: [ { title: "The Assemblers", publicSummary: "Interlocking the ceiling segments." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-WK-2026-006", slug: "carpet-weavers-floor", studioType: "WORKSHOP",
    title: "The Carpet Weavers' Floor", subtitle: "The architecture of the knot",
    description: "A working environment where design, colour, knotting, loom discipline and collective labour converge in the making of a Kashmiri carpet.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/carpet_weavers_floor_1787204542203.jpg",
        alt: "A large communal carpet loom with multiple weavers sitting shoulder-to-shoulder knotting a dense silk carpet.",
        subject: "Carpet Weaving Floor", craft: "Carpet Weaving", activity: "Communal Knotting", location: "Bandipora", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/carpet_weavers_floor_1787204542203.jpg", alt: "Wide shot of an active carpet weaving floor showing the immense scale of the loom." }
    },
    location: "BANDIPORA", recordedYear: "2026",
    relatedPublications: ["master-and-apprentice"], relatedStudioRecords: ["tying-the-carpet-knot"],
    publicOverview: { synopsis: "An environmental documentation of the carpet weaving floor.", premise: "Large-scale carpet weaving is an exercise in synchronized human effort.", craft: "Carpet Weaving", subject: "Communal Loom", theme: "Collective Production" },
    contextModules: [ { title: "The Master Caller", content: "Chanting the talim to coordinate multiple weavers." } ],
    contentPreview: [ { title: "The Floor", publicSummary: "Ergonomics and spatial layout of the weavers." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },

  // ==========================================
  // FILMS & INTERVIEWS (6)
  // ==========================================
  {
    id: "KHCRF-DF-2026-011", slug: "the-last-kani-masters", studioType: "DOCUMENTARY_FILM",
    title: "The Last Kani Masters", subtitle: "Memory, mastery and transmission",
    description: "A cinematic portrait of master Kani weavers, pattern intelligence, loom discipline and the uncertain future of specialist weaving knowledge.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/the-last-masters-clean.jpg",
        alt: "Cinematic frame showing an elderly Kani master at the loom, his face illuminated softly, holding a cluster of wooden tojis.",
        subject: "Master Kani Weaver", craft: "Kani Weaving", activity: "Documentary Subject Portrait", location: "Budgam", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/the-last-masters-clean.jpg", alt: "Wide dramatic portrait of the Kani master at his loom." }
    },
    duration: "28 MIN", language: "KASHMIRI", location: "BUDGAM", recordedYear: "2026",
    relatedPublications: ["masters-of-kani", "the-living-loom"], relatedStudioRecords: ["kani-weavers-of-kanihama", "reading-the-talim"],
    publicOverview: { synopsis: "The Last Kani Masters examines Kani weaving as a highly sophisticated knowledge system.", premise: "The heritage of Kani lies in the intelligence required to weave it.", craft: "Kani Weaving", subject: "Master Weavers", theme: "Transmission" },
    contextModules: [ { title: "The Craft", content: "Kani occupies a distinctive position within Kashmir’s textile heritage." } ],
    contentPreview: [ { order: "01", title: "The Master", durationOrStep: "04:36–11:20", publicSummary: "A life spent interpreting talim." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-DF-2026-012", slug: "hands-that-shape-the-valley", studioType: "DOCUMENTARY_FILM",
    title: "Hands That Shape the Valley", subtitle: "Cross-disciplinary mastery",
    description: "An exploration of embodied intelligence across walnut wood, copperware, papier-mâché, Khatamband and architectural craftsmanship.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/hands_that_shape_1787192077580.jpg",
        alt: "Powerful close cinematic frame of artisan hands actively carving walnut wood, emphasizing the physical connection between hand, tool, and material.",
        subject: "Artisan Hands", craft: "Multiple (Woodcarving depicted)", activity: "Active Craftsmanship", location: "Kashmir Valley", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/hands_that_shape_1787192077580.jpg", alt: "Cinematic montage shot of hands shaping material." }
    },
    duration: "45 MIN", language: "KASHMIRI & URDU", recordedYear: "2026",
    relatedPublications: ["master-and-apprentice"],
    publicOverview: { synopsis: "A wide-ranging documentary exploring the shared principles of mastery.", premise: "The medium changes, but the nature of mastery remains constant.", craft: "Multiple", subject: "Cross-Disciplinary Masters", theme: "Material Intelligence" },
    contextModules: [ { title: "Material Empathy", content: "How artisans learn to read wood, metal, and fiber." } ],
    contentPreview: [ { order: "04", title: "Synthesis", durationOrStep: "35:01–45:00", publicSummary: "The collective intelligence of the valley." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-DF-2026-013", slug: "who-will-inherit-the-craft", studioType: "DOCUMENTARY_FILM",
    title: "Who Will Inherit the Craft?", subtitle: "A synthesis of voices",
    description: "Masters, apprentices, women practitioners and young Kashmiris confront the question of who will inherit generations of craft knowledge.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/who_will_inherit_1787192060068.jpg",
        alt: "Documentary frame showing an elderly master and a young apprentice working together in a dimly lit workshop, illustrating intergenerational knowledge transfer.",
        subject: "Master and Apprentice", craft: "Cross-Disciplinary", activity: "Knowledge Transmission", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/who_will_inherit_1787192060068.jpg", alt: "Cinematic frame of a young apprentice observing a master." }
    },
    duration: "52 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["who-will-inherit-the-craft"],
    publicOverview: { synopsis: "A cinematic companion to the Quarterly Review issue.", premise: "The crisis of craft is primarily a crisis of transmission.", craft: "Cross-Disciplinary", subject: "Generational Succession", theme: "Apprenticeship" },
    contextModules: [ { title: "The Next Generation", content: "Understanding the economic realities driving youth away from heritage crafts." } ],
    contentPreview: [ { order: "01", title: "The Disappearing Apprentice", durationOrStep: "00:00–15:00", publicSummary: "Workshops without students." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-VI-2026-001", slug: "a-life-in-copper", studioType: "VIDEO_INTERVIEW",
    title: "A Life in Copper", subtitle: "Abdul Rashid's Testimony",
    description: "A master practitioner reflects on apprenticeship, tools, workshop culture, changing markets and a lifetime spent shaping metal by hand.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_cop_3.jpg",
        alt: "Environmental interview portrait of copper artisan Abdul Rashid seated in his active copper workshop, surrounded by specialized hammers and anvils.",
        subject: "Abdul Rashid", craft: "Copperware", activity: "Video Interview", location: "Downtown Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_cop_3.jpg", alt: "Wide environmental portrait of Abdul Rashid in his workshop." }
    },
    duration: "34 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["the-copper-masters"], relatedStudioRecords: ["copper-workshops-downtown"],
    publicOverview: { synopsis: "Abdul Rashid discusses his early training and the evolution of downtown Srinagar.", premise: "The oral history of a single master reveals the trajectory of an entire industry.", craft: "Copperware", subject: "Abdul Rashid", theme: "Economic Change" },
    contextModules: [ { title: "The Changing Market", content: "The shift from utilitarian vessels to luxury objects." } ],
    contentPreview: [ { order: "02", title: "The Golden Era", durationOrStep: "08:01–18:00", publicSummary: "Srinagar in the 1980s." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-VI-2026-002", slug: "the-weaver-remembers", studioType: "VIDEO_INTERVIEW",
    title: "The Weaver Remembers", subtitle: "Learning at the loom",
    description: "A long-form conversation about learning at the loom, changing textile production and the meaning of mastery across generations.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_pash_2.jpg",
        alt: "Environmental interview portrait of a senior textile practitioner seated directly beside their loom, emphasizing their lifelong physical connection to the equipment.",
        subject: "Senior Weaver", craft: "Pashmina", activity: "Video Interview", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_pash_2.jpg", alt: "Cinematic frame of the senior weaver speaking beside the loom." }
    },
    duration: "41 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["the-pashmina-heritage"], relatedStudioRecords: ["memory-of-the-loom"],
    publicOverview: { synopsis: "An in-depth interview with a veteran Pashmina weaver discussing tactile memory.", premise: "Mastery is physical memory encoded into the hands.", craft: "Pashmina", subject: "Senior Weaver", theme: "Embodied Knowledge" },
    contextModules: [ { title: "The Senses", content: "How touch and sound replace sight in identifying perfect tension." } ],
    contentPreview: [ { order: "02", title: "The Meaning of Mastery", durationOrStep: "10:01–25:00", publicSummary: "Defining true quality." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-VI-2026-003", slug: "the-master-carver", studioType: "VIDEO_INTERVIEW",
    title: "The Master Carver", subtitle: "Material judgment and motifs",
    description: "An experienced walnut wood artisan discusses material judgment, motifs, tools, mistakes, mastery and the responsibility of transmitting knowledge.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/master_carver_1787204550270.jpg",
        alt: "A senior walnut woodcarver works on an elaborate panel. A portrait of the individual. Face, hands, chisel, and carving all visible.",
        subject: "Master Carver", craft: "Walnut Woodcarving", activity: "Video Interview", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/master_carver_1787204550270.jpg", alt: "Cinematic frame of the carver among his life's work." }
    },
    duration: "36 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["walnut-wood-crafters"], relatedStudioRecords: ["walnut-woodcarver-workshop"],
    publicOverview: { synopsis: "A frank discussion with a master carver about the realities of working with wood.", premise: "Every piece of wood requires a different negotiation.", craft: "Walnut Woodcarving", subject: "Master Carver", theme: "Material Philosophy" },
    contextModules: [ { title: "The Mistakes", content: "How a master recovers from an unexpected flaw in the grain." } ],
    contentPreview: [ { order: "03", title: "Passing it On", durationOrStep: "24:01–36:00", publicSummary: "The weight of the legacy." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },

  // ==========================================
  // ORAL HISTORIES (6)
  // ==========================================
  {
    id: "KHCRF-OH-2026-001", slug: "memory-of-the-loom", studioType: "ORAL_HISTORY",
    title: "Memory of the Loom", subtitle: "A life in Pashmina",
    description: "Testimony from an experienced textile practitioner remembering apprenticeship, workshop life, production rhythms and changes across decades.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/the_living_loom_1787192071281.jpg",
        alt: "Intimate archival portrait of an elderly textile practitioner seated quietly beside their loom, conveying memory and longevity in the craft.",
        subject: "Elderly Textile Practitioner", craft: "Pashmina", activity: "Oral History Documentation", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/the_living_loom_1787192071281.jpg", alt: "Archival portrait format for oral history." }
    },
    duration: "32 MIN", language: "KASHMIRI", location: "SRINAGAR", recordedYear: "2026", transcriptAvailable: true,
    relatedPublications: ["the-pashmina-heritage"],
    publicOverview: { synopsis: "An extensive oral history recording detailing the mid-century pashmina trade.", premise: "Oral history captures the human reality behind the production statistics.", craft: "Pashmina", subject: "Workshop Memory", theme: "Continuity" },
    contextModules: [ { title: "The Era", content: "Srinagar in the 1970s and the structure of the traditional karkhana." } ],
    contentPreview: [ { order: "MEMORY II", title: "Learning the Craft", publicSummary: "Apprenticeship and discipline." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-OH-2026-002", slug: "when-downtown-was-a-workshop", studioType: "ORAL_HISTORY",
    title: "When Downtown Was a Workshop", subtitle: "The acoustics of the old city",
    description: "Memories of Srinagar's historic craft neighbourhoods when artisans, suppliers, traders and specialist workshops formed interconnected local economies.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/the_last_workshops_1787192123564.jpg",
        alt: "Atmospheric photograph of a historic craft lane in downtown Srinagar, showing the densely packed traditional working environments.",
        subject: "Old Srinagar Craft Neighbourhood", craft: "Urban History", activity: "Spatial Memory", location: "Downtown Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/the_last_workshops_1787192123564.jpg", alt: "Historic architecture of a craft neighbourhood." }
    },
    duration: "45 MIN", language: "KASHMIRI", location: "SRINAGAR", recordedYear: "2026", transcriptAvailable: true,
    relatedStudioRecords: ["copper-workshops-downtown"],
    publicOverview: { synopsis: "Testimonies capturing the historic urban fabric of Srinagar.", premise: "The city itself was the ultimate workshop.", craft: "Urban History", subject: "Old Srinagar", theme: "Spatial Heritage" },
    contextModules: [ { title: "Neighbourhoods", content: "The geography of craft in downtown Srinagar." } ],
    contentPreview: [ { order: "MEMORY III", title: "The Exodus", publicSummary: "The shifting of workshops to the periphery." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-OH-2026-003", slug: "learning-beside-the-master", studioType: "ORAL_HISTORY",
    title: "Learning Beside the Master", subtitle: "The pedagogy of craft",
    description: "First-person recollections of observation, discipline, correction and the long transition from apprentice to independent practitioner.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/master_and_apprentice_1787192131202.jpg",
        alt: "Archival portrait of a master and apprentice together in a workshop, with the learner visibly observing the master's technique.",
        subject: "Master and Apprentice", craft: "Multiple", activity: "Mentorship", location: "Kashmir", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/master_and_apprentice_1787192131202.jpg", alt: "Portrait of intergenerational learning." }
    },
    duration: "38 MIN", language: "KASHMIRI", recordedYear: "2026", transcriptAvailable: true,
    relatedPublications: ["master-and-apprentice"],
    publicOverview: { synopsis: "An intimate oral record of the psychological and physical journey of an apprentice.", premise: "Discipline is the precursor to creative freedom.", craft: "Multiple", subject: "Apprenticeship", theme: "Transmission" },
    contextModules: [ { title: "The Ustad", content: "The absolute authority of the master in traditional training." } ],
    contentPreview: [ { order: "MEMORY II", title: "Correction", publicSummary: "The physical memory of mistakes." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-OH-2026-004", slug: "women-who-carried-the-tradition", studioType: "ORAL_HISTORY",
    title: "Women Who Carried the Tradition", subtitle: "The invisible foundation",
    description: "Women's accounts of skills, motifs, finishing practices and household knowledge frequently absent from formal craft histories.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_pash_3.jpg",
        alt: "Archival portrait of a woman artisan actively spinning Pashmina fibre on a traditional wheel inside her home.",
        subject: "Woman Spinning Pashmina", craft: "Spinning", activity: "Domestic Craft Production", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_pash_3.jpg", alt: "Portrait of a female artisan working." }
    },
    duration: "42 MIN", language: "KASHMIRI", recordedYear: "2026", transcriptAvailable: true,
    relatedPublications: ["the-pashmina-heritage"],
    publicOverview: { synopsis: "A critical oral history project recording the voices of women who sustain major crafts.", premise: "The male-dominated workshop relies entirely on female-dominated domestic labor.", craft: "Spinning, Embroidery", subject: "Women Artisans", theme: "Hidden Labor" },
    contextModules: [ { title: "The Domestic Atelier", content: "How the home functions as a critical node in the supply chain." } ],
    contentPreview: [ { order: "MEMORY I", title: "Spinning the Wheel", publicSummary: "The rhythm of Pashmina spinning." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-OH-2026-005", slug: "sound-of-hammer-and-chisel", studioType: "ORAL_HISTORY",
    title: "The Sound of Hammer and Chisel", subtitle: "Acoustics of creation",
    description: "Memories of working environments defined by tools, rhythm, repetition and the shared culture of traditional workshops.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_cop_4.jpg",
        alt: "Close documentary archival image of hands using a hammer and chisel, capturing the physical impact that generates the workshop's acoustic signature.",
        subject: "Hands using hammer and chisel", craft: "Copper / Wood", activity: "Acoustic Memory Documentation", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_cop_4.jpg", alt: "Close up of tools reflecting the acoustic memory." }
    },
    duration: "29 MIN", language: "KASHMIRI", recordedYear: "2026", transcriptAvailable: true,
    relatedStudioRecords: ["copper-workshops-downtown"],
    publicOverview: { synopsis: "A specialized oral history focusing on the auditory memory of craftsmen.", premise: "The workshop has a distinct acoustic signature that artisans learn to read like a language.", craft: "Wood, Copper", subject: "Acoustic Memory", theme: "Sensory Heritage" },
    contextModules: [ { title: "The Symphony", content: "How a dozen artisans strike out of phase to maintain rhythm." } ],
    contentPreview: [ { order: "MEMORY II", title: "The Warning Sound", publicSummary: "Hearing a mistake before seeing it." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-OH-2026-006", slug: "before-the-workshop-fell-silent", studioType: "ORAL_HISTORY",
    title: "Before the Workshop Fell Silent", subtitle: "An elegy for the karkhana",
    description: "An artisan remembers a disappearing workshop community, the people who worked there and the knowledge that vanished as production declined.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/assets/images/studio/films/film_4.jpg",
        alt: "Quiet, poignant photograph of an ageing, partially inactive traditional workshop, with an elderly artisan seated among unused benches.",
        subject: "Ageing Workshop and Artisan", craft: "Multiple", activity: "Oral History of Decline", location: "Kashmir", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/assets/images/studio/films/film_4.jpg", alt: "Atmospheric shot of an empty workshop floor." }
    },
    duration: "47 MIN", language: "KASHMIRI", recordedYear: "2026", transcriptAvailable: true,
    relatedPublications: ["who-will-inherit-the-craft"],
    publicOverview: { synopsis: "A deeply moving reflection from a master witnessing the closure of historic workshops.", premise: "When a workshop closes, an entire social and intellectual ecosystem dissolves.", craft: "Cross-Disciplinary", subject: "Workshop Decline", theme: "Cultural Loss" },
    contextModules: [ { title: "The Empty Loom", content: "The physical reality of abandoned production spaces." } ],
    contentPreview: [ { order: "MEMORY III", title: "The Silence", publicSummary: "The aftermath of closure." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },

  // ==========================================
  // CRAFT DEMONSTRATIONS (6)
  // ==========================================
  {
    id: "KHCRF-CD-2026-001", slug: "reading-the-talim", studioType: "CRAFT_DEMONSTRATION",
    title: "Reading the Talim", subtitle: "The code of the loom",
    description: "A Kani practitioner demonstrates how coded design instructions are interpreted and translated into colour and movement at the loom.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/reading_talim_1787204503907.jpg",
        alt: "Extreme close-up technical demonstration of a Kani weaver holding a written talim script while selecting the corresponding coloured bobbin.",
        subject: "Talim Reading", craft: "Kani Weaving", activity: "Code Translation at the Loom", location: "Budgam", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/reading_talim_1787204503907.jpg", alt: "Macro shot of talim paper and weaving bobbins." }
    },
    duration: "14 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["masters-of-kani"], relatedStudioRecords: ["kani-weavers-of-kanihama"],
    publicOverview: { synopsis: "A highly focused, macro-lens demonstration of a master weaver reading talim shorthand.", premise: "The talim is an ancient binary code; the weaver is the processor.", craft: "Kani Weaving", subject: "Talim Reading", theme: "Pattern Geometry" },
    contextModules: [ { title: "The Code", content: "Understanding the symbolic language of Kani patterns." } ],
    contentPreview: [ { order: "STEP 02", title: "Bobbin Selection", durationOrStep: "03:01-06:30", publicSummary: "Matching colour to code." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-CD-2026-002", slug: "hammering-a-copper-form", studioType: "CRAFT_DEMONSTRATION",
    title: "Hammering a Copper Form", subtitle: "Force and flow",
    description: "A close documentary demonstration of preparation, controlled hammering, shaping, rotation and the judgment required to form copper by hand.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/hammering_copper_1787204511392.jpg",
        alt: "Technical close-up showing a specialized hammer striking a copper vessel, with the artisan's hand and the deformed metal dominating the frame.",
        subject: "Hammering Copper", craft: "Copperware", activity: "Vessel Raising", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/hammering_copper_1787204511392.jpg", alt: "Close technical shot of the hammer impact point." }
    },
    duration: "18 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["the-copper-masters"], relatedStudioRecords: ["copper-workshops-downtown"],
    publicOverview: { synopsis: "An uninterrupted technical demonstration showing a flat copper disc raised into a complex vessel.", premise: "Form is achieved not by force alone, but by rhythmic understanding of material stress.", craft: "Copperware", subject: "Vessel Raising", theme: "Material Manipulation" },
    contextModules: [ { title: "The Tools", content: "The specific anvils and hammers required for raising." } ],
    contentPreview: [ { order: "STEP 02", title: "Raising", durationOrStep: "04:01-12:00", publicSummary: "The primary hammer sequence." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-CD-2026-003", slug: "carving-the-walnut-motif", studioType: "CRAFT_DEMONSTRATION",
    title: "Carving the Walnut Motif", subtitle: "Revealing the relief",
    description: "From reading the grain and laying out the pattern to tool selection, relief development and surface refinement.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/carving_walnut_1787204517945.jpg",
        alt: "Macro technical photography of a chisel actively cutting into a recognizable walnut wood chinar leaf motif.",
        subject: "Carving Walnut Motif", craft: "Walnut Woodcarving", activity: "Deep Relief Carving", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/carving_walnut_1787204517945.jpg", alt: "Extreme close up of the wood shaving peeling away from the chisel." }
    },
    duration: "22 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["walnut-wood-crafters"], relatedStudioRecords: ["walnut-woodcarver-workshop"],
    publicOverview: { synopsis: "A master carver demonstrates the execution of a traditional chinar leaf motif in deep undercut relief.", premise: "The carver must think in three dimensions, removing what is not the leaf.", craft: "Walnut Woodcarving", subject: "Deep Relief Carving", theme: "Spatial Geometry" },
    contextModules: [ { title: "The Chisel", content: "Why hundreds of profiles are needed for a single panel." } ],
    contentPreview: [ { order: "STEP 03", title: "Detailing", durationOrStep: "12:01-18:00", publicSummary: "Modeling the leaf veins." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-CD-2026-004", slug: "the-naqashs-brush", studioType: "CRAFT_DEMONSTRATION",
    title: "The Naqash's Brush", subtitle: "Precision of the painter",
    description: "Papier-mâché decoration demonstrated through surface preparation, drawing, pigment control, brush technique, ornament and finishing.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/papier_mache_masters_1787192097858.jpg",
        alt: "Technical close-up of a fine cat-hair brush physically painting delicate naqashi ornament onto a prepared papier-mâché surface.",
        subject: "Naqashi Painting", craft: "Papier-Mâché", activity: "Surface Ornamentation", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/papier_mache_masters_1787192097858.jpg", alt: "Macro shot of pigment being applied by the tip of the brush." }
    },
    duration: "16 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["papier-mache-the-painted-masters"], relatedStudioRecords: ["papier-mache-atelier"],
    publicOverview: { synopsis: "A technical demonstration of fine naqashi painting on a prepared papier-mâché surface.", premise: "The finest lines are painted with brushes consisting of only a few hairs.", craft: "Papier-Mâché", subject: "Naqashi Painting", theme: "Surface Decoration" },
    contextModules: [ { title: "The Brush", content: "Traditional cat-hair brushes and their handling." } ],
    contentPreview: [ { order: "STEP 02", title: "The Outline", durationOrStep: "03:01-09:00", publicSummary: "Drawing the motif in gold." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-CD-2026-005", slug: "assembling-khatamband", studioType: "CRAFT_DEMONSTRATION",
    title: "Assembling Khatamband", subtitle: "Precision in joinery",
    description: "How geometric components are prepared, aligned and assembled into a coherent traditional wooden ceiling system.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/assembling_khatamband_1787204525143.jpg",
        alt: "Close documentary demonstration of hands fitting precision-cut geometric wooden Khatamband pieces together without nails.",
        subject: "Khatamband Assembly", craft: "Khatamband", activity: "Geometric Joinery", location: "Srinagar", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/assembling_khatamband_1787204525143.jpg", alt: "Close technical shot of the interlocking wood joints." }
    },
    duration: "19 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["architectural-woodwork-heritage"], relatedStudioRecords: ["inside-khatamband-workshop"],
    publicOverview: { synopsis: "A high-fidelity sequence showing how mathematically precise wooden polygons are friction-fit together.", premise: "The strength of Khatamband lies entirely in its perfect geometry.", craft: "Khatamband", subject: "Assembly Sequence", theme: "Joinery" },
    contextModules: [ { title: "The Grooves", content: "The invisible framework that holds the ceiling together." } ],
    contentPreview: [ { order: "STEP 02", title: "The Core Star", durationOrStep: "04:01-10:00", publicSummary: "Assembling the central motif." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  },
  {
    id: "KHCRF-CD-2026-006", slug: "tying-the-carpet-knot", studioType: "CRAFT_DEMONSTRATION",
    title: "Tying the Carpet Knot", subtitle: "The architecture of the floor",
    description: "A close study of loom setup, design reference, knot formation, colour sequencing, cutting and repetition within Kashmiri carpet weaving.",
    mediaStatus: 'COMPLETE',
    media: {
      catalogueImage: {
        src: "/images/generated/tying_carpet_knot_1787204531536.jpg",
        alt: "Extreme close-up of a carpet weaver's hands tying an asymmetrical knot on the warp threads of an active loom.",
        subject: "Tying the Knot", craft: "Carpet Weaving", activity: "Knotting and Cutting", location: "Bandipora", rightsStatus: "HCRF_OWNED"
      },
      heroImage: { src: "/images/generated/tying_carpet_knot_1787204531536.jpg", alt: "Macro shot of the hooked knife cutting the thread." }
    },
    duration: "12 MIN", language: "KASHMIRI", recordedYear: "2026",
    relatedPublications: ["master-and-apprentice"], relatedStudioRecords: ["carpet-weavers-floor"],
    publicOverview: { synopsis: "An extreme close-up demonstration of the asymmetrical knot used in Kashmiri carpets.", premise: "A single rug contains millions of these exact, repeatable movements.", craft: "Carpet Weaving", subject: "Knot Architecture", theme: "Repetitive Precision" },
    contextModules: [ { title: "The Knife", content: "The specialized hooked blade used to tie and cut in one fluid motion." } ],
    contentPreview: [ { order: "STEP 02", title: "The Loop", durationOrStep: "03:01-08:00", publicSummary: "Pulling the colour through." } ],
    publicVisibility: 'PUBLIC', accessStatus: 'READY', requiredEntitlement: 'MEMBER'
  }
];

export async function getPublicStudioCatalogue(filter?: string) {
  let results = StudioRegistry.filter(r => r.publicVisibility === 'PUBLIC');
  if (filter) {
    if (filter === 'Workshops') results = results.filter(r => r.studioType === 'WORKSHOP');
    if (filter === 'Films & Interviews') results = results.filter(r => r.studioType === 'DOCUMENTARY_FILM' || r.studioType === 'VIDEO_INTERVIEW');
    if (filter === 'Oral Histories') results = results.filter(r => r.studioType === 'ORAL_HISTORY');
    if (filter === 'Craft Demonstrations') results = results.filter(r => r.studioType === 'CRAFT_DEMONSTRATION');
  }
  return results;
}

export async function getStudioRecordBySlug(slug: string) {
  return StudioRegistry.find(r => r.slug === slug) || null;
}
