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
    documentaryPremise: string;
    whyItMatters: string;
    examines: string[];
    keyThemes: string[];
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
  {
    "id": "KHCRF-WK-2026-001",
    "slug": "kani-weavers-of-kanihama",
    "studioType": "WORKSHOP",
    "title": "The Kani Weavers of Kanihama",
    "subtitle": "A living production environment",
    "description": "A living Kani workshop community viewed through its masters, looms, apprentices, working rhythms and systems of collective textile knowledge.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/masters_of_kani_1787192090096.jpg",
        "alt": "Wide environmental view of multiple Kani weavers actively working at their wooden looms in Kanihama.",
        "subject": "Kani Workshop Environment",
        "craft": "Kani Weaving",
        "activity": "Communal Weaving",
        "location": "Kanihama, Budgam",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/masters_of_kani_1787192090096.jpg",
        "alt": "Cinematic wide shot of the Kanihama Kani workshop floor."
      }
    },
    "location": "BUDGAM",
    "recordedYear": "2026",
    "relatedPublications": [
      "masters-of-kani",
      "the-living-loom"
    ],
    "relatedStudioRecords": [
      "the-last-kani-masters",
      "reading-the-talim"
    ],
    "publicOverview": {
      "synopsis": "The Kani Weavers of Kanihama documents a living weaving environment in which loom, pattern, artisan, material and apprenticeship function as parts of one interconnected system of knowledge. The record moves beyond the finished Kani textile to examine the production space itself, where experienced practitioners interpret designs, manipulate coloured Kanis, maintain rhythm and tension, and coordinate a demanding sequence of hand operations.\\n\\nKanihama matters not simply because Kani textiles emerge from its workshops, but because these working environments retain concentrations of specialist knowledge. Talim, colour sequencing, loom discipline and correction converge within the same space, making the workshop both a place of production and an informal institution of technical education.\\n\\nThe record also follows the human relationships through which this knowledge survives. Masters, experienced practitioners and younger learners occupy different positions within one working ecology, where observation, repetition and correction gradually turn instruction into embodied competence.",
      "documentaryPremise": "A workshop is more than a production space; it is an institution through which knowledge becomes practice and practice becomes inheritance.",
      "whyItMatters": "Kani can remain commercially visible while the deeper knowledge required to reproduce its most sophisticated forms becomes increasingly concentrated. Documenting the workshop allows KHCRF to preserve not only objects and techniques, but the relationships, working sequences and judgment that make those techniques possible.",
      "examines": [
        "Master weavers and working roles",
        "Talim interpretation",
        "Kani bobbins and colour sequencing",
        "Loom organization and discipline",
        "Apprenticeship and correction",
        "Workshop community and production ecology"
      ],
      "keyThemes": [
        "Kani Weaving",
        "Talim",
        "Mastery",
        "Workshop Community",
        "Apprenticeship",
        "Knowledge Transmission\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Kanihama",
        "content": "The craft geography surrounding one of Kashmir's best-known Kani weaving environments."
      },
      {
        "title": "Kani Weaving",
        "content": "The relationship between coded design, colour, Kanis and disciplined loom work."
      },
      {
        "title": "Talim",
        "content": "How design instructions enter the working process."
      },
      {
        "title": "Master Weavers",
        "content": "Resolve actual linked artisan records."
      },
      {
        "title": "Apprenticeship",
        "content": "How competence is developed through proximity, correction and repetition."
      },
      {
        "title": "Workshop Ecosystem",
        "content": "People, materials, tools and supporting production roles."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Workshop Environment",
        "publicSummary": "The physical organization of the Kanihama weaving space and the relationship between loom, tools, materials and practitioners."
      },
      {
        "order": "02",
        "title": "The People",
        "publicSummary": "Masters, experienced weavers, younger practitioners and other participants who sustain the production ecosystem."
      },
      {
        "order": "03",
        "title": "The Looms",
        "publicSummary": "The working structures around which Kani production is organized."
      },
      {
        "order": "04",
        "title": "Talim and Pattern",
        "publicSummary": "How coded pattern information is interpreted within actual weaving practice."
      },
      {
        "order": "05",
        "title": "Tools and Materials",
        "publicSummary": "The functional relationship between yarn, Kanis, warp and other working materials."
      },
      {
        "order": "06",
        "title": "Transmission",
        "publicSummary": "How knowledge moves between experienced practitioners and younger workers."
      },
      {
        "order": "07",
        "title": "Objects in Production",
        "publicSummary": "Selected works documenting stages of the weaving process."
      },
      {
        "order": "08",
        "title": "Related Documentation",
        "publicSummary": "Films, interviews, oral histories, demonstrations and publications linked to this workshop."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-WK-2026-002",
    "slug": "copper-workshops-downtown",
    "studioType": "WORKSHOP",
    "title": "The Copper Workshops of Downtown Srinagar",
    "subtitle": "Rhythm of the hammers",
    "description": "Inside the historic workshop environment where copper is shaped, hammered, engraved and transmitted from experienced practitioners to younger hands.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_cop_2.jpg",
        "alt": "Environmental documentary photograph of a historic copper workshop with multiple artisans actively shaping and engraving vessels.",
        "subject": "Downtown Copper Workshops",
        "craft": "Copperware",
        "activity": "Vessel shaping and engraving",
        "location": "Downtown Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_cop_2.jpg",
        "alt": "Wide view of copper artisans in a dimly lit downtown workshop."
      }
    },
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "relatedPublications": [
      "the-copper-masters"
    ],
    "relatedStudioRecords": [
      "a-life-in-copper",
      "hammering-a-copper-form"
    ],
    "publicOverview": {
      "synopsis": "The Copper Workshops of Downtown Srinagar enters the working spaces where copper is repeatedly shaped, hammered, engraved and refined into culturally recognizable objects. The record concentrates on the workshop rather than the finished vessel, revealing the relationship between material behaviour, hand tools, rhythm and accumulated artisan judgment.\\n\\nWithin these environments, production knowledge is distributed across people, tools and sequences of work. The artisan must understand how metal responds to pressure and repeated working, when form must be corrected, how ornament is laid out, and how experience reduces the distance between intention and execution.\\n\\nThe workshop also belongs to a larger urban craft ecology. Individual practitioners are connected to neighbourhood histories, specialist occupations, markets and generations of working memory that extend beyond the object on the bench.",
      "documentaryPremise": "The finished copper object carries within it the rhythm, judgment and memory of the workshop that produced it.",
      "whyItMatters": "A copper vessel can survive long after the production culture that formed it has disappeared. Recording the workshop preserves evidence of the processes, relationships and technical intelligence that the finished object alone cannot explain.",
      "examines": [
        "Copper as a working material",
        "Hammering and shaping",
        "Engraving and ornament",
        "Traditional hand tools",
        "Workshop organization",
        "Intergenerational transmission"
      ],
      "keyThemes": [
        "Copperware",
        "Srinagar",
        "Hammering",
        "Engraving",
        "Workshop Culture",
        "Transmission\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Copper as Material",
        "content": "Understanding the properties of copper."
      },
      {
        "title": "Hammer and Form",
        "content": "The relationship between striking and shape."
      },
      {
        "title": "Engraving and Ornament",
        "content": "The application of traditional motifs."
      },
      {
        "title": "Historic Workshop Geography",
        "content": "The legacy of downtown Srinagar."
      },
      {
        "title": "Master Artisans",
        "content": "The keepers of copper knowledge."
      },
      {
        "title": "Workshop Transmission",
        "content": "How metalworking is passed down."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Entering the Copper Workshop",
        "publicSummary": "First view of the environment."
      },
      {
        "order": "02",
        "title": "Metal and Material Preparation",
        "publicSummary": "Getting the copper ready for shaping."
      },
      {
        "order": "03",
        "title": "Hammering and Form",
        "publicSummary": "The primary shaping process."
      },
      {
        "order": "04",
        "title": "Engraving and Ornament",
        "publicSummary": "Detailing the copper surface."
      },
      {
        "order": "05",
        "title": "Tools of the Workshop",
        "publicSummary": "The specific instruments of the trade."
      },
      {
        "order": "06",
        "title": "Masters and Learners",
        "publicSummary": "Generational dynamics."
      },
      {
        "order": "07",
        "title": "Objects in Production",
        "publicSummary": "Works in progress."
      },
      {
        "order": "08",
        "title": "Related Copper Documentation",
        "publicSummary": "Linked records and files."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-WK-2026-003",
    "slug": "walnut-woodcarver-workshop",
    "studioType": "WORKSHOP",
    "title": "The Walnut Woodcarvers' Workshop",
    "subtitle": "Grain, layout and relief",
    "description": "A documentary record of wood selection, carving tools, motif preparation, relief work and the judgment accumulated through decades of practice.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_wood_2.jpg",
        "alt": "Environmental shot of a woodcarving bench covered in chisels and mallets, with a master artisan working on a large walnut panel.",
        "subject": "Woodcarving Atelier",
        "craft": "Walnut Woodcarving",
        "activity": "Panel Carving",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_wood_2.jpg",
        "alt": "Wide shot of a woodcarving workshop showing timber storage and active carving benches."
      }
    },
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "relatedPublications": [
      "walnut-wood-crafters"
    ],
    "relatedStudioRecords": [
      "carving-the-walnut-motif"
    ],
    "publicOverview": {
      "synopsis": "The Walnut Woodcarvers' Workshop documents the environment in which material knowledge, drawing, carving vocabulary, hand tools and long experience converge. It follows the craft before the object becomes finished, beginning with the artisan's judgment of walnut itself and continuing through layout, cutting, depth development and surface refinement.\\n\\nWalnut is not treated as a passive material. Grain, density, seasoning and structural variation continually influence what the artisan can do. Mastery therefore lies partly in recognizing how the wood will respond before a decisive cut is made.\\n\\nThe workshop becomes a visible archive of accumulated practice. Worn chisels, unfinished panels, completed motifs and repeated working routines reveal a craft culture in which standards are learned through sustained physical engagement.",
      "documentaryPremise": "The carving begins before the first cut, in the artisan's ability to understand the wood.",
      "whyItMatters": "Finished carving reveals artistic achievement but rarely explains the judgment behind it. Documenting the workshop captures the technical environment in which material understanding becomes craft mastery.",
      "examines": [
        "Walnut selection and grain",
        "Motif preparation",
        "Chisels and carving tools",
        "Relief and depth",
        "Master-level judgment",
        "Workshop learning"
      ],
      "keyThemes": [
        "Walnut Wood",
        "Material Intelligence",
        "Carving",
        "Motifs",
        "Tools",
        "Mastery\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Walnut as Material",
        "content": "The properties of Kashmiri walnut."
      },
      {
        "title": "Grain and Seasoning",
        "content": "Preparing the wood for the chisel."
      },
      {
        "title": "Carving Tools",
        "content": "The essential instruments of relief."
      },
      {
        "title": "Motif Vocabulary",
        "content": "The language of traditional pattern."
      },
      {
        "title": "Master Carvers",
        "content": "Those who possess advanced judgment."
      },
      {
        "title": "Workshop Learning",
        "content": "How carving is taught and learned."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Reading the Wood",
        "publicSummary": "Understanding the grain before cutting."
      },
      {
        "order": "02",
        "title": "Preparing the Surface",
        "publicSummary": "Initial smoothing and layout."
      },
      {
        "order": "03",
        "title": "Tools and Cutting Language",
        "publicSummary": "The vocabulary of the chisel."
      },
      {
        "order": "04",
        "title": "Developing the Motif",
        "publicSummary": "Bringing the pattern into view."
      },
      {
        "order": "05",
        "title": "Relief and Depth",
        "publicSummary": "Controlling three-dimensional space."
      },
      {
        "order": "06",
        "title": "The Master Carver",
        "publicSummary": "Focus on the primary practitioner."
      },
      {
        "order": "07",
        "title": "Workshop Transmission",
        "publicSummary": "Passing on the knowledge."
      },
      {
        "order": "08",
        "title": "Finished and Unfinished Works",
        "publicSummary": "The state of objects in the shop."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-WK-2026-004",
    "slug": "papier-mache-atelier",
    "studioType": "WORKSHOP",
    "title": "The Papier-Mâché Atelier",
    "subtitle": "Surface and ornament",
    "description": "The interconnected world of object preparation, naqashi, pigments, ornament, finishing and the specialist practitioners behind the painted surface.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_pap_2.jpg",
        "alt": "A papier-mâché workshop interior showing both sakhtsazi object preparation and naqashi painting stations.",
        "subject": "Papier-Mâché Workshop",
        "craft": "Papier-Mâché",
        "activity": "Painting and Preparation",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_pap_2.jpg",
        "alt": "Cinematic wide shot of the naqashi painting room filled with natural light."
      }
    },
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "relatedPublications": [
      "papier-mache-the-painted-masters"
    ],
    "relatedStudioRecords": [
      "the-naqashs-brush"
    ],
    "publicOverview": {
      "synopsis": "The Papier-Mâché Atelier documents the chain of specialist work through which prepared forms become painted, ornamented and finished objects. The record looks beyond the decorated surface to the sequence of decisions and skills required before that surface can exist.\\n\\nAt the center is naqashi, where drawing, composition, pigment, brush control and inherited decorative vocabulary meet. Yet painting is only one part of the atelier. Surface preparation, grounding, motif planning, finishing and material choices all contribute to the final result.\\n\\nThe atelier therefore operates as an interconnected knowledge environment. Different stages of production reveal how craftsmanship can be distributed among practitioners while still remaining part of one recognizable artistic tradition.",
      "documentaryPremise": "The painted surface is the visible end of a much longer chain of specialized knowledge.",
      "whyItMatters": "Papier-mâché is often encountered as decoration. Recording the atelier reveals the technical and intellectual structure behind that decoration and the practitioners whose expertise allows the tradition to remain coherent.",
      "examines": [
        "Object and surface preparation",
        "Naqashi",
        "Pigments and brush control",
        "Motif vocabulary",
        "Ornament and finishing",
        "Specialized atelier roles"
      ],
      "keyThemes": [
        "Papier-Mâché",
        "Naqashi",
        "Pigments",
        "Ornament",
        "Surface",
        "Atelier Practice\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Object Preparation",
        "content": "Forming the base object."
      },
      {
        "title": "Surface Ground",
        "content": "Creating the canvas for paint."
      },
      {
        "title": "Naqashi",
        "content": "The art of fine brushwork."
      },
      {
        "title": "Motif Systems",
        "content": "The decorative grammar."
      },
      {
        "title": "Pigment and Ornament",
        "content": "The use of colour and gold."
      },
      {
        "title": "Specialist Practitioners",
        "content": "The distinct roles in the atelier."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Preparing the Object",
        "publicSummary": "The initial pulp and molding."
      },
      {
        "order": "02",
        "title": "Preparing the Surface",
        "publicSummary": "Smoothing and priming."
      },
      {
        "order": "03",
        "title": "Drawing the Design",
        "publicSummary": "Laying out the pattern."
      },
      {
        "order": "04",
        "title": "The Naqash's Brush",
        "publicSummary": "The delicate work of painting."
      },
      {
        "order": "05",
        "title": "Pigment and Colour",
        "publicSummary": "Mixing and applying hues."
      },
      {
        "order": "06",
        "title": "Ornament and Finish",
        "publicSummary": "Final details and varnishing."
      },
      {
        "order": "07",
        "title": "The Atelier Community",
        "publicSummary": "The network of artisans."
      },
      {
        "order": "08",
        "title": "Objects at Different Stages",
        "publicSummary": "A view of the production pipeline."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-WK-2026-005",
    "slug": "inside-khatamband-workshop",
    "studioType": "WORKSHOP",
    "title": "Inside a Khatamband Workshop",
    "subtitle": "Geometry and alignment",
    "description": "Geometry, component preparation, precision cutting and assembly inside a workshop preserving one of Kashmir's most sophisticated architectural crafts.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/masters_of_khatamband_1787192106568.jpg",
        "alt": "Environmental workshop photography of artisans cutting and dry-fitting geometric wooden Khatamband ceiling components.",
        "subject": "Khatamband Assembly Workshop",
        "craft": "Khatamband",
        "activity": "Component cutting and assembly",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/masters_of_khatamband_1787192106568.jpg",
        "alt": "Cinematic view of the Khatamband geometric layout floor."
      }
    },
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "relatedPublications": [
      "architectural-woodwork-heritage"
    ],
    "relatedStudioRecords": [
      "assembling-khatamband"
    ],
    "publicOverview": {
      "synopsis": "Inside a Khatamband Workshop documents the precision environment where geometry, material preparation, modular thinking and hand assembly become architectural surface. The record follows the craft at the scale of both the individual component and the larger pattern it is intended to create.\\n\\nKhatamband depends upon disciplined repetition, but repetition alone is not sufficient. Components must be prepared consistently, relationships between geometric forms must remain controlled, and the artisan must understand how a small error can multiply across an entire ceiling.\\n\\nThe workshop therefore demonstrates a distinctive form of spatial intelligence. The practitioner must move continually between part and whole, seeing both the immediate piece in the hand and the architectural composition that has not yet been completed.",
      "documentaryPremise": "In Khatamband, architecture begins with the precision of the smallest component.",
      "whyItMatters": "The completed ceiling can obscure the extraordinary preparation required to produce it. Workshop documentation makes visible the geometry, component logic and hand judgment hidden within the finished architectural surface.",
      "examines": [
        "Geometric planning",
        "Wood preparation",
        "Component making",
        "Modular organization",
        "Assembly and alignment",
        "Master-level spatial judgment"
      ],
      "keyThemes": [
        "Khatamband",
        "Geometry",
        "Wood",
        "Modular Assembly",
        "Architecture",
        "Mastery\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Geometric Design",
        "content": "The mathematics of the pattern."
      },
      {
        "title": "Material Preparation",
        "content": "Getting the wood ready."
      },
      {
        "title": "Component Making",
        "content": "Cutting the exact shapes."
      },
      {
        "title": "Assembly Logic",
        "content": "How the pieces fit together."
      },
      {
        "title": "Architectural Context",
        "content": "The role of the ceiling."
      },
      {
        "title": "Master Practitioners",
        "content": "The keepers of the geometry."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Reading the Pattern",
        "publicSummary": "Understanding the geometric intent."
      },
      {
        "order": "02",
        "title": "Preparing the Wood",
        "publicSummary": "Selecting and milling the material."
      },
      {
        "order": "03",
        "title": "Cutting Components",
        "publicSummary": "The precise work of shaping pieces."
      },
      {
        "order": "04",
        "title": "Organizing Modules",
        "publicSummary": "Sorting the cut geometry."
      },
      {
        "order": "05",
        "title": "Assembly",
        "publicSummary": "The physical act of fitting."
      },
      {
        "order": "06",
        "title": "Expanding the Geometric Field",
        "publicSummary": "Growing the pattern outwards."
      },
      {
        "order": "07",
        "title": "Masters and Learners",
        "publicSummary": "The transmission of architectural logic."
      },
      {
        "order": "08",
        "title": "Architectural Application",
        "publicSummary": "The final installed context."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-WK-2026-006",
    "slug": "carpet-weavers-floor",
    "studioType": "WORKSHOP",
    "title": "The Carpet Weavers' Floor",
    "subtitle": "The architecture of the knot",
    "description": "A working environment where design, colour, knotting, loom discipline and collective labour converge in the making of a Kashmiri carpet.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/carpet_weavers_floor_1787204542203.jpg",
        "alt": "A large communal carpet loom with multiple weavers sitting shoulder-to-shoulder knotting a dense silk carpet.",
        "subject": "Carpet Weaving Floor",
        "craft": "Carpet Weaving",
        "activity": "Communal Knotting",
        "location": "Bandipora",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/carpet_weavers_floor_1787204542203.jpg",
        "alt": "Wide shot of an active carpet weaving floor showing the immense scale of the loom."
      }
    },
    "location": "BANDIPORA",
    "recordedYear": "2026",
    "relatedPublications": [
      "master-and-apprentice"
    ],
    "relatedStudioRecords": [
      "tying-the-carpet-knot"
    ],
    "publicOverview": {
      "synopsis": "The Carpet Weavers' Floor documents collective production around the vertical loom, where design, colour, knotting, cutting and repetition are coordinated across a shared working environment. It examines the carpet not simply as an object but as the accumulated result of thousands of small decisions made over time.\\n\\nThe loom organizes both labour and knowledge. Artisans interpret design references, maintain pattern continuity, control knot formation and coordinate colour while working within a tightly structured sequence.\\n\\nThe workshop floor is also a learning environment. Experienced workers establish standards through practice, while younger practitioners develop competence by observing the pace, discipline and technical decisions of those around them.",
      "documentaryPremise": "A carpet is made knot by knot, but the knowledge required to make it belongs to an entire working environment.",
      "whyItMatters": "A finished carpet conceals the collective labour and workshop intelligence behind it. Recording the weaving floor preserves the human organization, technical rhythm and transmission systems embedded in production.",
      "examines": [
        "The vertical loom",
        "Design interpretation",
        "Knotting",
        "Colour sequencing",
        "Collective production",
        "Workshop learning"
      ],
      "keyThemes": [
        "Carpet Weaving",
        "Loom",
        "Knotting",
        "Design",
        "Collective Labour",
        "Apprenticeship\n\n---\n\n# DOCUMENTARY FILMS"
      ]
    },
    "contextModules": [
      {
        "title": "The Carpet Loom",
        "content": "The structure that holds the work."
      },
      {
        "title": "Design Reference",
        "content": "Reading the pattern."
      },
      {
        "title": "Knotting Systems",
        "content": "The physical act of making."
      },
      {
        "title": "Colour Sequencing",
        "content": "Managing the palette."
      },
      {
        "title": "Collective Production",
        "content": "Working together on one piece."
      },
      {
        "title": "Workshop Learning",
        "content": "How the craft is absorbed."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Weaving Floor",
        "publicSummary": "The overall environment."
      },
      {
        "order": "02",
        "title": "Setting the Loom",
        "publicSummary": "Preparing the warp."
      },
      {
        "order": "03",
        "title": "Reading the Design",
        "publicSummary": "Consulting the talim."
      },
      {
        "order": "04",
        "title": "Knotting",
        "publicSummary": "The core action."
      },
      {
        "order": "05",
        "title": "Colour and Sequence",
        "publicSummary": "Changing threads."
      },
      {
        "order": "06",
        "title": "Cutting and Surface Control",
        "publicSummary": "Managing the pile."
      },
      {
        "order": "07",
        "title": "Working as a Team",
        "publicSummary": "Coordination across the loom."
      },
      {
        "order": "08",
        "title": "Transmission",
        "publicSummary": "Teaching the next generation."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-DF-2026-011",
    "slug": "the-last-kani-masters",
    "studioType": "DOCUMENTARY_FILM",
    "title": "The Last Kani Masters",
    "subtitle": "Memory, mastery and transmission",
    "description": "A cinematic portrait of master Kani weavers, pattern intelligence, loom discipline and the uncertain future of specialist weaving knowledge.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/the-last-masters-clean.jpg",
        "alt": "Cinematic frame showing an elderly Kani master at the loom, his face illuminated softly, holding a cluster of wooden tojis.",
        "subject": "Master Kani Weaver",
        "craft": "Kani Weaving",
        "activity": "Documentary Subject Portrait",
        "location": "Budgam",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/the-last-masters-clean.jpg",
        "alt": "Wide dramatic portrait of the Kani master at his loom."
      }
    },
    "duration": "28 MIN",
    "language": "KASHMIRI",
    "location": "BUDGAM",
    "recordedYear": "2026",
    "relatedPublications": [
      "masters-of-kani",
      "the-living-loom"
    ],
    "relatedStudioRecords": [
      "kani-weavers-of-kanihama",
      "reading-the-talim"
    ],
    "publicOverview": {
      "synopsis": "The Last Kani Masters is a cinematic portrait of practitioners whose working lives embody advanced Kani knowledge. Moving between loom, Talim, colour, hand movement and memory, the film asks what distinguishes master-level competence from routine production.\\n\\nThe documentary examines mastery as something accumulated over decades. Experienced practitioners do more than execute a pattern; they recognize errors, anticipate problems, interpret complex instructions and maintain standards that may be difficult to reproduce through abbreviated training.\\n\\nAt the center is the question of continuity. As specialist knowledge becomes concentrated among fewer experienced hands, the future of Kani depends not only on demand for the textile but on whether the knowledge behind it can still move effectively to another generation.",
      "documentaryPremise": "The last masters are not simply the oldest practitioners; they are living repositories of a system that must be transmitted to remain alive.",
      "whyItMatters": "The disappearance of a master can mean the disappearance of judgments, corrections and technical understanding that cannot easily be reconstructed afterward.",
      "examines": [
        "Master-level Kani knowledge",
        "Talim interpretation",
        "Loom discipline",
        "Pattern and memory",
        "Ageing practitioners",
        "Succession and apprenticeship"
      ],
      "keyThemes": [
        "Kani",
        "Master Artisans",
        "Talim",
        "Mastery",
        "Succession",
        "Transmission\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "The Craft",
        "content": "Kani occupies a distinctive position within Kashmir’s textile heritage."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Master",
        "durationOrStep": "04:36–11:20",
        "publicSummary": "A life spent interpreting talim."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-DF-2026-012",
    "slug": "hands-that-shape-the-valley",
    "studioType": "DOCUMENTARY_FILM",
    "title": "Hands That Shape the Valley",
    "subtitle": "Cross-disciplinary mastery",
    "description": "An exploration of embodied intelligence across walnut wood, copperware, papier-mâché, Khatamband and architectural craftsmanship.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/hands_that_shape_1787192077580.jpg",
        "alt": "Powerful close cinematic frame of artisan hands actively carving walnut wood, emphasizing the physical connection between hand, tool, and material.",
        "subject": "Artisan Hands",
        "craft": "Multiple (Woodcarving depicted)",
        "activity": "Active Craftsmanship",
        "location": "Kashmir Valley",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/hands_that_shape_1787192077580.jpg",
        "alt": "Cinematic montage shot of hands shaping material."
      }
    },
    "duration": "45 MIN",
    "language": "KASHMIRI & URDU",
    "recordedYear": "2026",
    "relatedPublications": [
      "master-and-apprentice"
    ],
    "publicOverview": {
      "synopsis": "Hands That Shape the Valley explores craftsmanship through the intelligence of the human hand. Moving across wood, metal, painted surfaces and architectural craft, the documentary looks at the physical judgments artisans make continuously while working.\\n\\nThe film is less concerned with finished objects than with the actions that precede them: cutting, striking, painting, fitting, measuring, correcting and responding to material resistance. These acts reveal a form of knowledge that is difficult to separate from touch and repetition.\\n\\nAcross different craft traditions, the documentary asks what becomes of hand-based expertise in an increasingly standardized and mechanized production environment, and what distinctions remain between reproducing a form and understanding how to create it.",
      "documentaryPremise": "Before craftsmanship becomes an object, it exists as judgment in the hand.",
      "whyItMatters": "Craft heritage is often documented through products. This film documents the embodied intelligence that makes those products possible.",
      "examines": [
        "Embodied knowledge",
        "Material response",
        "Tools and hand control",
        "Correction and judgment",
        "Mastery across crafts",
        "Handmade production in changing markets"
      ],
      "keyThemes": [
        "Embodied Knowledge",
        "Wood",
        "Metal",
        "Painting",
        "Architecture",
        "Mastery\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Material Empathy",
        "content": "How artisans learn to read wood, metal, and fiber."
      }
    ],
    "contentPreview": [
      {
        "order": "04",
        "title": "Synthesis",
        "durationOrStep": "35:01–45:00",
        "publicSummary": "The collective intelligence of the valley."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-DF-2026-013",
    "slug": "who-will-inherit-the-craft",
    "studioType": "DOCUMENTARY_FILM",
    "title": "Who Will Inherit the Craft?",
    "subtitle": "A synthesis of voices",
    "description": "Masters, apprentices, women practitioners and young Kashmiris confront the question of who will inherit generations of craft knowledge.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/who_will_inherit_1787192060068.jpg",
        "alt": "Documentary frame showing an elderly master and a young apprentice working together in a dimly lit workshop, illustrating intergenerational knowledge transfer.",
        "subject": "Master and Apprentice",
        "craft": "Cross-Disciplinary",
        "activity": "Knowledge Transmission",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/who_will_inherit_1787192060068.jpg",
        "alt": "Cinematic frame of a young apprentice observing a master."
      }
    },
    "duration": "52 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "who-will-inherit-the-craft"
    ],
    "publicOverview": {
      "synopsis": "Who Will Inherit the Craft? brings masters, younger practitioners, apprentices and other knowledge holders into a single generational question: who will carry Kashmir's advanced craft knowledge forward?\\n\\nThe documentary looks beyond the assumption that tradition reproduces itself naturally. Apprenticeship depends upon time, economic viability, social aspiration, access to masters and the willingness of younger people to remain within demanding production environments.\\n\\nThe film also examines forms of transmission that are less visible within formal workshop narratives, including knowledge preserved within families and by women practitioners. Inheritance emerges not as a symbolic idea but as a fragile human process that must continually be renewed.",
      "documentaryPremise": "Inheritance in craft is not possession of an object; it is possession of the knowledge required to make another.",
      "whyItMatters": "A craft may remain commercially present while losing the human systems that reproduce its deepest knowledge. Understanding succession is therefore central to understanding long-term craft survival.",
      "examines": [
        "Ageing masters",
        "Young practitioners",
        "Apprenticeship",
        "Women and informal transmission",
        "Economic viability",
        "Generational succession"
      ],
      "keyThemes": [
        "Inheritance",
        "Master Artisans",
        "Youth",
        "Apprenticeship",
        "Women",
        "Continuity\n\n---\n\n# VIDEO INTERVIEWS"
      ]
    },
    "contextModules": [
      {
        "title": "The Next Generation",
        "content": "Understanding the economic realities driving youth away from heritage crafts."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Disappearing Apprentice",
        "durationOrStep": "00:00–15:00",
        "publicSummary": "Workshops without students."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-VI-2026-001",
    "slug": "a-life-in-copper",
    "studioType": "VIDEO_INTERVIEW",
    "title": "A Life in Copper",
    "subtitle": "Abdul Rashid's Testimony",
    "description": "A master practitioner reflects on apprenticeship, tools, workshop culture, changing markets and a lifetime spent shaping metal by hand.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_cop_3.jpg",
        "alt": "Environmental interview portrait of copper artisan Abdul Rashid seated in his active copper workshop, surrounded by specialized hammers and anvils.",
        "subject": "Abdul Rashid",
        "craft": "Copperware",
        "activity": "Video Interview",
        "location": "Downtown Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_cop_3.jpg",
        "alt": "Wide environmental portrait of Abdul Rashid in his workshop."
      }
    },
    "duration": "34 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "the-copper-masters"
    ],
    "relatedStudioRecords": [
      "copper-workshops-downtown"
    ],
    "publicOverview": {
      "synopsis": "A Life in Copper is a long-form conversation centered on the working life of an experienced copper practitioner. Through personal recollection, the interview traces the movement from early learning and tool familiarity to independent practice, workshop responsibility and mature judgment.\\n\\nThe conversation uses one working life as a lens through which broader changes become visible. Tools, production expectations, markets, workshop relationships and the status of skilled handwork all shift over time, while certain technical disciplines remain remarkably persistent.\\n\\nThe interview also considers what it means for a practitioner to carry knowledge that has been formed through decades of repetition and what responsibility accompanies the possibility of transmitting that knowledge to others.",
      "documentaryPremise": "The history of a craft can sometimes be read through the working life of one practitioner.",
      "whyItMatters": "Personal testimony reveals how technical change is experienced from inside the workshop rather than only measured from outside it.",
      "examines": [
        "Early apprenticeship",
        "Tools and technique",
        "Workshop life",
        "Changes in production",
        "Markets and value",
        "Teaching and succession"
      ],
      "keyThemes": [
        "Copperware",
        "Biography",
        "Apprenticeship",
        "Workshop Life",
        "Change",
        "Transmission\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "The Artisan",
        "content": "The subject of the interview."
      },
      {
        "title": "Copper Craft",
        "content": "The material context."
      },
      {
        "title": "Workshop Life",
        "content": "The daily rhythm."
      },
      {
        "title": "Tools",
        "content": "The instruments of work."
      },
      {
        "title": "Changing Markets",
        "content": "The economic context."
      },
      {
        "title": "Transmission",
        "content": "Passing on the skill."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Entering the Craft",
        "publicSummary": "First steps into the workshop."
      },
      {
        "order": "02",
        "title": "Learning the Tools",
        "publicSummary": "Mastering the hammer."
      },
      {
        "order": "03",
        "title": "Becoming Independent",
        "publicSummary": "Starting out alone."
      },
      {
        "order": "04",
        "title": "Workshop Life",
        "publicSummary": "The daily grind."
      },
      {
        "order": "05",
        "title": "Changes in Production",
        "publicSummary": "How things evolved."
      },
      {
        "order": "06",
        "title": "What Should Survive",
        "publicSummary": "Hopes for the future."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-VI-2026-002",
    "slug": "the-weaver-remembers",
    "studioType": "VIDEO_INTERVIEW",
    "title": "The Weaver Remembers",
    "subtitle": "Learning at the loom",
    "description": "A long-form conversation about learning at the loom, changing textile production and the meaning of mastery across generations.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_pash_2.jpg",
        "alt": "Environmental interview portrait of a senior textile practitioner seated directly beside their loom, emphasizing their lifelong physical connection to the equipment.",
        "subject": "Senior Weaver",
        "craft": "Pashmina",
        "activity": "Video Interview",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_pash_2.jpg",
        "alt": "Cinematic frame of the senior weaver speaking beside the loom."
      }
    },
    "duration": "41 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "the-pashmina-heritage"
    ],
    "relatedStudioRecords": [
      "memory-of-the-loom"
    ],
    "publicOverview": {
      "synopsis": "The Weaver Remembers places textile history inside the recollections of an experienced practitioner. The conversation moves from early encounters with the loom to working discipline, material knowledge, production routines and changes witnessed over decades.\\n\\nMemory allows the record to reach beyond technical description. The speaker recalls the people, expectations and rhythms surrounding textile production, offering insight into how a workshop felt as well as how it functioned.\\n\\nThe interview also considers how changing markets, materials and occupational choices have altered the relationship between practitioners and the craft they inherited.",
      "documentaryPremise": "Memory preserves dimensions of craft history that objects alone cannot reveal.",
      "whyItMatters": "Technical documentation explains how a textile is made. Practitioner memory explains how a life becomes organized around making it.",
      "examines": [
        "Learning at the loom",
        "Working routines",
        "Material knowledge",
        "Workshop relationships",
        "Change over time",
        "Future generations"
      ],
      "keyThemes": [
        "Textile Memory",
        "Weaving",
        "Apprenticeship",
        "Workshop Life",
        "Change",
        "Continuity\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Speaker",
        "content": "The subject of the interview."
      },
      {
        "title": "Textile Practice",
        "content": "The material context."
      },
      {
        "title": "Learning",
        "content": "The early years."
      },
      {
        "title": "Workshop Memory",
        "content": "The lived experience."
      },
      {
        "title": "Changing Production",
        "content": "The shift in methods."
      },
      {
        "title": "Transmission",
        "content": "The act of teaching."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Early Years",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Learning the Loom",
        "publicSummary": "Mastering the machine."
      },
      {
        "order": "03",
        "title": "Daily Working Life",
        "publicSummary": "The rhythm of the day."
      },
      {
        "order": "04",
        "title": "Material and Technique",
        "publicSummary": "The specifics of the craft."
      },
      {
        "order": "05",
        "title": "Changes Over Time",
        "publicSummary": "The evolution of the workshop."
      },
      {
        "order": "06",
        "title": "Future Generations",
        "publicSummary": "Looking ahead."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-VI-2026-003",
    "slug": "the-master-carver",
    "studioType": "VIDEO_INTERVIEW",
    "title": "The Master Carver",
    "subtitle": "Material judgment and motifs",
    "description": "An experienced walnut wood artisan discusses material judgment, motifs, tools, mistakes, mastery and the responsibility of transmitting knowledge.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/master_carver_1787204550270.jpg",
        "alt": "A senior walnut woodcarver works on an elaborate panel. A portrait of the individual. Face, hands, chisel, and carving all visible.",
        "subject": "Master Carver",
        "craft": "Walnut Woodcarving",
        "activity": "Video Interview",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/master_carver_1787204550270.jpg",
        "alt": "Cinematic frame of the carver among his life's work."
      }
    },
    "duration": "36 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "walnut-wood-crafters"
    ],
    "relatedStudioRecords": [
      "walnut-woodcarver-workshop"
    ],
    "publicOverview": {
      "synopsis": "The Master Carver follows an experienced walnut wood artisan whose authority has developed through decades of material judgment, tool control and motif work. The interview explores how technical fluency gradually becomes mastery.\\n\\nThe conversation moves beyond technique into standards. The master reflects on mistakes, correction, patience and the difference between completing a carved surface and understanding why each cut must be made.\\n\\nA second concern is transmission. Mastery acquires wider significance when the practitioner becomes capable not only of producing exceptional work but of recognizing, explaining and correcting the work of others.",
      "documentaryPremise": "Mastery is measured not only by what one can make, but by what one understands well enough to transmit.",
      "whyItMatters": "The testimony provides access to the internal standards by which an experienced practitioner evaluates craft quality, knowledge that is rarely visible in finished objects alone.",
      "examines": [
        "Understanding walnut",
        "Tool control",
        "Motif development",
        "Mistakes and correction",
        "Standards of mastery",
        "Teaching younger artisans"
      ],
      "keyThemes": [
        "Walnut Wood",
        "Master Artisan",
        "Material Judgment",
        "Tools",
        "Motifs",
        "Transmission\n\n---\n\n# ORAL HISTORIES"
      ]
    },
    "contextModules": [
      {
        "title": "Master Artisan",
        "content": "The subject of the interview."
      },
      {
        "title": "Walnut Wood",
        "content": "The material context."
      },
      {
        "title": "Material Judgment",
        "content": "The critical eye."
      },
      {
        "title": "Motifs",
        "content": "The decorative language."
      },
      {
        "title": "Tools",
        "content": "The instruments."
      },
      {
        "title": "Teaching",
        "content": "The transmission."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "First Lessons",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Understanding Walnut",
        "publicSummary": "The material."
      },
      {
        "order": "03",
        "title": "Tools and Control",
        "publicSummary": "The instruments."
      },
      {
        "order": "04",
        "title": "Motif and Style",
        "publicSummary": "The design."
      },
      {
        "order": "05",
        "title": "Mistakes and Standards",
        "publicSummary": "The quality."
      },
      {
        "order": "06",
        "title": "Becoming a Master",
        "publicSummary": "The journey."
      },
      {
        "order": "07",
        "title": "Teaching Others",
        "publicSummary": "The legacy."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-001",
    "slug": "memory-of-the-loom",
    "studioType": "ORAL_HISTORY",
    "title": "Memory of the Loom",
    "subtitle": "A life in Pashmina",
    "description": "Testimony from an experienced textile practitioner remembering apprenticeship, workshop life, production rhythms and changes across decades.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/the_living_loom_1787192071281.jpg",
        "alt": "Intimate archival portrait of an elderly textile practitioner seated quietly beside their loom, conveying memory and longevity in the craft.",
        "subject": "Elderly Textile Practitioner",
        "craft": "Pashmina",
        "activity": "Oral History Documentation",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/the_living_loom_1787192071281.jpg",
        "alt": "Archival portrait format for oral history."
      }
    },
    "duration": "32 MIN",
    "language": "KASHMIRI",
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedPublications": [
      "the-pashmina-heritage"
    ],
    "publicOverview": {
      "synopsis": "Memory of the Loom preserves a first-person recollection of textile work, learning and everyday life around the loom. The oral history treats memory itself as a form of evidence, allowing the narrator to reconstruct experiences that may no longer be visible in contemporary production environments.\\n\\nThe record moves through apprenticeship, working routines, people, materials and changes witnessed across time. Technical memories sit alongside social ones: who worked nearby, how knowledge was corrected, how workdays were structured and how the meaning of craft changed.\\n\\nThe loom becomes both physical object and mnemonic anchor, connecting personal biography to a wider history of textile production.",
      "documentaryPremise": "The loom carries textile memory; the artisan carries the memory of life around the loom.",
      "whyItMatters": "Oral testimony preserves relationships, routines and sensory memories that cannot be recovered from surviving textiles alone.",
      "examines": [
        "First encounters with textile work",
        "Learning and correction",
        "Daily working life",
        "Workshop relationships",
        "Change across decades",
        "What remains in memory"
      ],
      "keyThemes": [
        "Oral History",
        "Textile Memory",
        "Loom",
        "Apprenticeship",
        "Working Life",
        "Change\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Narrator",
        "content": "The subject of the interview."
      },
      {
        "title": "Textile Tradition",
        "content": "The material context."
      },
      {
        "title": "Workshop Memory",
        "content": "The lived experience."
      },
      {
        "title": "Apprenticeship",
        "content": "The early years."
      },
      {
        "title": "Changing Production",
        "content": "The shift in methods."
      },
      {
        "title": "Place",
        "content": "The geography of the craft."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Memory I — First Encounters",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Memory II — Learning",
        "publicSummary": "Mastering the machine."
      },
      {
        "order": "03",
        "title": "Memory III — The Working Day",
        "publicSummary": "The rhythm of the day."
      },
      {
        "order": "04",
        "title": "Memory IV — People Around the Loom",
        "publicSummary": "The social world."
      },
      {
        "order": "05",
        "title": "Memory V — What Changed",
        "publicSummary": "The evolution of the workshop."
      },
      {
        "order": "06",
        "title": "Memory VI — What Remains",
        "publicSummary": "Looking ahead."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-002",
    "slug": "when-downtown-was-a-workshop",
    "studioType": "ORAL_HISTORY",
    "title": "When Downtown Was a Workshop",
    "subtitle": "The acoustics of the old city",
    "description": "Memories of Srinagar's historic craft neighbourhoods when artisans, suppliers, traders and specialist workshops formed interconnected local economies.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/the_last_workshops_1787192123564.jpg",
        "alt": "Atmospheric photograph of a historic craft lane in downtown Srinagar, showing the densely packed traditional working environments.",
        "subject": "Old Srinagar Craft Neighbourhood",
        "craft": "Urban History",
        "activity": "Spatial Memory",
        "location": "Downtown Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/the_last_workshops_1787192123564.jpg",
        "alt": "Historic architecture of a craft neighbourhood."
      }
    },
    "duration": "45 MIN",
    "language": "KASHMIRI",
    "location": "SRINAGAR",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedStudioRecords": [
      "copper-workshops-downtown"
    ],
    "publicOverview": {
      "synopsis": "When Downtown Was a Workshop reconstructs an urban craft landscape through memory. The oral history looks back to a period when workshops, suppliers, traders, makers and specialist occupations existed in close physical relationship across parts of Srinagar.\\n\\nRather than isolating one craft, the testimony follows the neighbourhood ecosystem itself: the movement of material, the sounds of work, the presence of apprentices and the relationships between different occupations.\\n\\nAs urban and economic conditions change, the narrator's memory becomes a record of a production geography that may no longer be visible in the same form.",
      "documentaryPremise": "Sometimes the history of craft belongs not to one artisan, but to an entire street.",
      "whyItMatters": "Craft preservation usually focuses on objects and individual practitioners. This record preserves the urban ecosystem that once connected them.",
      "examines": [
        "Craft neighbourhoods",
        "Workshop clusters",
        "Suppliers and traders",
        "Street-level production culture",
        "Urban change",
        "Disappearing craft geography"
      ],
      "keyThemes": [
        "Srinagar",
        "Urban Memory",
        "Workshops",
        "Craft Economy",
        "Place",
        "Change\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Downtown Srinagar",
        "content": "The historic centre."
      },
      {
        "title": "Workshop Clusters",
        "content": "The geography of production."
      },
      {
        "title": "Suppliers",
        "content": "The material chain."
      },
      {
        "title": "Markets",
        "content": "The trade."
      },
      {
        "title": "Neighbourhood Memory",
        "content": "The lived experience."
      },
      {
        "title": "Urban Change",
        "content": "The shifting city."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Street",
        "publicSummary": "The environment."
      },
      {
        "order": "02",
        "title": "The Workshops",
        "publicSummary": "The spaces of production."
      },
      {
        "order": "03",
        "title": "The People",
        "publicSummary": "The inhabitants."
      },
      {
        "order": "04",
        "title": "The Sounds",
        "publicSummary": "The auditory landscape."
      },
      {
        "order": "05",
        "title": "Trade and Movement",
        "publicSummary": "The flow of goods."
      },
      {
        "order": "06",
        "title": "What Disappeared",
        "publicSummary": "The lost elements."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-003",
    "slug": "learning-beside-the-master",
    "studioType": "ORAL_HISTORY",
    "title": "Learning Beside the Master",
    "subtitle": "The pedagogy of craft",
    "description": "First-person recollections of observation, discipline, correction and the long transition from apprentice to independent practitioner.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/master_and_apprentice_1787192131202.jpg",
        "alt": "Archival portrait of a master and apprentice together in a workshop, with the learner visibly observing the master's technique.",
        "subject": "Master and Apprentice",
        "craft": "Multiple",
        "activity": "Mentorship",
        "location": "Kashmir",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/master_and_apprentice_1787192131202.jpg",
        "alt": "Portrait of intergenerational learning."
      }
    },
    "duration": "38 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedPublications": [
      "master-and-apprentice"
    ],
    "publicOverview": {
      "synopsis": "Learning Beside the Master preserves first-person memories of apprenticeship as a lived experience. The narrator recalls the discipline of watching before doing, the difficulty of early mistakes and the gradual expansion of responsibility inside the workshop.\\n\\nTraditional learning emerges as a process of proximity. Much of what the apprentice absorbs is not delivered through formal explanation but through repeated exposure to the master's movements, corrections, standards and expectations.\\n\\nThe oral history also reflects on the emotional and social dimensions of this relationship, revealing apprenticeship as both technical education and entry into a working culture.",
      "documentaryPremise": "Before an apprentice learns how to work alone, they learn how to watch.",
      "whyItMatters": "Apprenticeship is often described abstractly. First-person testimony reveals what the process actually demands from both learner and master.",
      "examines": [
        "First days of apprenticeship",
        "Observation",
        "Tool familiarity",
        "Mistakes and correction",
        "Growing independence",
        "Relationship with the master"
      ],
      "keyThemes": [
        "Apprenticeship",
        "Mastery",
        "Observation",
        "Correction",
        "Workshop Culture",
        "Transmission\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Master",
        "content": "The teacher."
      },
      {
        "title": "Apprentice",
        "content": "The learner."
      },
      {
        "title": "Observation",
        "content": "The act of watching."
      },
      {
        "title": "Correction",
        "content": "The guidance."
      },
      {
        "title": "Repetition",
        "content": "The practice."
      },
      {
        "title": "Independence",
        "content": "The culmination."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "First Day",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Watching",
        "publicSummary": "Observation."
      },
      {
        "order": "03",
        "title": "First Tools",
        "publicSummary": "The instruments."
      },
      {
        "order": "04",
        "title": "Mistakes",
        "publicSummary": "The errors."
      },
      {
        "order": "05",
        "title": "Correction",
        "publicSummary": "The guidance."
      },
      {
        "order": "06",
        "title": "Working Alone",
        "publicSummary": "The culmination."
      },
      {
        "order": "07",
        "title": "Looking Back",
        "publicSummary": "Reflection."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-004",
    "slug": "women-who-carried-the-tradition",
    "studioType": "ORAL_HISTORY",
    "title": "Women Who Carried the Tradition",
    "subtitle": "The invisible foundation",
    "description": "Women's accounts of skills, motifs, finishing practices and household knowledge frequently absent from formal craft histories.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_pash_3.jpg",
        "alt": "Archival portrait of a woman artisan actively spinning Pashmina fibre on a traditional wheel inside her home.",
        "subject": "Woman Spinning Pashmina",
        "craft": "Spinning",
        "activity": "Domestic Craft Production",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_pash_3.jpg",
        "alt": "Portrait of a female artisan working."
      }
    },
    "duration": "42 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedPublications": [
      "the-pashmina-heritage"
    ],
    "publicOverview": {
      "synopsis": "Women Who Carried the Tradition documents forms of craft knowledge that have often remained less visible within formal histories of production. The oral history centers women's experiences of learning, practicing and transmitting textile, decorative or household-based skills.\\n\\nThe testimony examines how knowledge can persist outside recognized workshops, guild structures or public artisan identities. Techniques, motifs, material familiarity and quality standards may move through households and female networks even when institutional documentation overlooks them.\\n\\nThe record therefore expands the definition of who carries heritage and where transmission takes place.",
      "documentaryPremise": "Knowledge can remain invisible to institutions while remaining essential to tradition.",
      "whyItMatters": "Without women's testimony, important channels of technical and cultural transmission risk being omitted from the historical record.",
      "examines": [
        "Learning within households",
        "Women's craft labour",
        "Tools and materials",
        "Motifs and memory",
        "Recognition and invisibility",
        "Intergenerational teaching"
      ],
      "keyThemes": [
        "Women Artisans",
        "Invisible Knowledge",
        "Household Production",
        "Memory",
        "Transmission",
        "Recognition\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Women Practitioners",
        "content": "The uncredited makers."
      },
      {
        "title": "Spinning",
        "content": "The material."
      },
      {
        "title": "Embroidery",
        "content": "The craft."
      },
      {
        "title": "Household Knowledge",
        "content": "The context."
      },
      {
        "title": "Transmission",
        "content": "The passing down."
      },
      {
        "title": "Recognition",
        "content": "The institutional failure."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Learning at Home",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Women's Work",
        "publicSummary": "The labour."
      },
      {
        "order": "03",
        "title": "Tools and Materials",
        "publicSummary": "The instruments."
      },
      {
        "order": "04",
        "title": "Patterns and Memory",
        "publicSummary": "The design."
      },
      {
        "order": "05",
        "title": "Unrecognized Skill",
        "publicSummary": "The invisibility."
      },
      {
        "order": "06",
        "title": "Teaching the Next Generation",
        "publicSummary": "The legacy."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-005",
    "slug": "sound-of-hammer-and-chisel",
    "studioType": "ORAL_HISTORY",
    "title": "The Sound of Hammer and Chisel",
    "subtitle": "Acoustics of creation",
    "description": "Memories of working environments defined by tools, rhythm, repetition and the shared culture of traditional workshops.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_cop_4.jpg",
        "alt": "Close documentary archival image of hands using a hammer and chisel, capturing the physical impact that generates the workshop's acoustic signature.",
        "subject": "Hands using hammer and chisel",
        "craft": "Copper / Wood",
        "activity": "Acoustic Memory Documentation",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_cop_4.jpg",
        "alt": "Close up of tools reflecting the acoustic memory."
      }
    },
    "duration": "29 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedStudioRecords": [
      "copper-workshops-downtown"
    ],
    "publicOverview": {
      "synopsis": "The Sound of Hammer and Chisel reconstructs workshop life through remembered sound. The oral history begins with the acoustic environment of making: metal struck repeatedly, chisels entering wood, tools being sharpened and multiple practitioners working within earshot of one another.\\n\\nThese sounds were not incidental. Rhythm could communicate pace, experience and the presence of particular activities. For learners, sound became part of knowing what was happening even before they fully understood the process.\\n\\nAs traditional workshops contract or disappear, the remembered soundscape becomes evidence of a social and productive environment that is increasingly difficult to encounter.",
      "documentaryPremise": "A workshop can disappear physically while its rhythm survives in memory.",
      "whyItMatters": "The sensory history of craft is rarely preserved. Oral history allows sound, rhythm and atmosphere to enter the documentary archive.",
      "examines": [
        "Workshop soundscape",
        "Hammer and chisel",
        "Rhythm of production",
        "Learning through listening",
        "Collective working environments",
        "Silence after decline"
      ],
      "keyThemes": [
        "Sound Memory",
        "Tools",
        "Workshop Culture",
        "Rhythm",
        "Oral History",
        "Loss\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Workshop Sound",
        "content": "The auditory landscape."
      },
      {
        "title": "Tools",
        "content": "The instruments."
      },
      {
        "title": "Copper",
        "content": "The metal."
      },
      {
        "title": "Wood",
        "content": "The material."
      },
      {
        "title": "Rhythm",
        "content": "The pace."
      },
      {
        "title": "Collective Work",
        "content": "The community."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Morning in the Workshop",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Tools Beginning",
        "publicSummary": "The instruments."
      },
      {
        "order": "03",
        "title": "Rhythm of Work",
        "publicSummary": "The pace."
      },
      {
        "order": "04",
        "title": "Learning Through Sound",
        "publicSummary": "The guidance."
      },
      {
        "order": "05",
        "title": "Silence and Change",
        "publicSummary": "The culmination."
      },
      {
        "order": "06",
        "title": "What the Sound Meant",
        "publicSummary": "Reflection."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-OH-2026-006",
    "slug": "before-the-workshop-fell-silent",
    "studioType": "ORAL_HISTORY",
    "title": "Before the Workshop Fell Silent",
    "subtitle": "An elegy for the karkhana",
    "description": "An artisan remembers a disappearing workshop community, the people who worked there and the knowledge that vanished as production declined.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/assets/images/studio/films/film_4.jpg",
        "alt": "Quiet, poignant photograph of an ageing, partially inactive traditional workshop, with an elderly artisan seated among unused benches.",
        "subject": "Ageing Workshop and Artisan",
        "craft": "Multiple",
        "activity": "Oral History of Decline",
        "location": "Kashmir",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/assets/images/studio/films/film_4.jpg",
        "alt": "Atmospheric shot of an empty workshop floor."
      }
    },
    "duration": "47 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "transcriptAvailable": true,
    "relatedPublications": [
      "who-will-inherit-the-craft"
    ],
    "publicOverview": {
      "synopsis": "Before the Workshop Fell Silent records memories of a working environment during its decline. The narrator remembers a time when the workshop was filled with people, tools, conversation and regular production, then traces the gradual processes through which that activity diminished.\\n\\nThe record is not simply about closure. It examines what begins disappearing before a workshop physically shuts: apprentices stop arriving, specialist tasks become harder to sustain, tools fall out of regular use and experienced workers leave without replacement.\\n\\nThe testimony therefore captures the final stages of a living knowledge environment before it becomes primarily a memory.",
      "documentaryPremise": "The final years of a workshop can reveal as much about a craft as its years of prosperity.",
      "whyItMatters": "Documentation often begins after loss has already occurred. This oral history preserves the process of decline from the perspective of someone who experienced it.",
      "examines": [
        "Workshop life before decline",
        "Artisan community",
        "Reduced activity",
        "Loss of practitioners",
        "Succession failure",
        "Memory of what remains"
      ],
      "keyThemes": [
        "Workshop Decline",
        "Memory",
        "Artisan Community",
        "Succession",
        "Loss",
        "Documentation\n\n---\n\n# CRAFT DEMONSTRATIONS"
      ]
    },
    "contextModules": [
      {
        "title": "Workshop Decline",
        "content": "The end of an era."
      },
      {
        "title": "Artisan Community",
        "content": "The people."
      },
      {
        "title": "Economic Change",
        "content": "The finances."
      },
      {
        "title": "Tools Left Behind",
        "content": "The instruments."
      },
      {
        "title": "Succession",
        "content": "The failure of passing down."
      },
      {
        "title": "Memory",
        "content": "The recollection."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "When It Was Full",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "The People",
        "publicSummary": "The community."
      },
      {
        "order": "03",
        "title": "The Work",
        "publicSummary": "The labour."
      },
      {
        "order": "04",
        "title": "The First Departures",
        "publicSummary": "The shift."
      },
      {
        "order": "05",
        "title": "The Last Years",
        "publicSummary": "The end."
      },
      {
        "order": "06",
        "title": "What Remains",
        "publicSummary": "Reflection."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-001",
    "slug": "reading-the-talim",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "Reading the Talim",
    "subtitle": "The code of the loom",
    "description": "A Kani practitioner demonstrates how coded design instructions are interpreted and translated into colour and movement at the loom.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/reading_talim_1787204503907.jpg",
        "alt": "Extreme close-up technical demonstration of a Kani weaver holding a written talim script while selecting the corresponding coloured bobbin.",
        "subject": "Talim Reading",
        "craft": "Kani Weaving",
        "activity": "Code Translation at the Loom",
        "location": "Budgam",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/reading_talim_1787204503907.jpg",
        "alt": "Macro shot of talim paper and weaving bobbins."
      }
    },
    "duration": "14 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "masters-of-kani"
    ],
    "relatedStudioRecords": [
      "kani-weavers-of-kanihama"
    ],
    "publicOverview": {
      "synopsis": "Reading the Talim documents the moment at which coded design information becomes physical weaving action. The demonstration follows how a Kani practitioner reads the Talim, identifies the required colour and movement, selects the appropriate Kani and translates instruction into the developing textile.\\n\\nThe process reveals that Talim is not simply a pattern sheet. It operates as part of a larger system requiring familiarity with loom structure, colour sequencing, counting and the practical consequences of each instruction.\\n\\nBy concentrating on this translation process, the demonstration makes visible the intellectual work occurring before and during every movement of the artisan's hand.",
      "documentaryPremise": "The woven pattern begins as information before it becomes textile.",
      "whyItMatters": "Kani is frequently admired for visual complexity without explaining the information system behind that complexity. This demonstration connects design intelligence directly to weaving practice.",
      "examines": [
        "Talim notation",
        "Reading coded instruction",
        "Colour selection",
        "Kani bobbins",
        "Translation to loom movement",
        "Checking the developing pattern"
      ],
      "keyThemes": [
        "Kani",
        "Talim",
        "Pattern Intelligence",
        "Colour",
        "Loom Practice",
        "Technique\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Talim",
        "content": "The coded language."
      },
      {
        "title": "Kani Loom",
        "content": "The machine."
      },
      {
        "title": "Colour",
        "content": "The palette."
      },
      {
        "title": "Bobbins",
        "content": "The tools."
      },
      {
        "title": "Pattern",
        "content": "The design."
      },
      {
        "title": "Master Weaver",
        "content": "The practitioner."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "The Talim Sheet",
        "publicSummary": "The code."
      },
      {
        "order": "02",
        "title": "Reading the Code",
        "publicSummary": "The interpretation."
      },
      {
        "order": "03",
        "title": "Selecting the Kani",
        "publicSummary": "The tool."
      },
      {
        "order": "04",
        "title": "Translating Instruction",
        "publicSummary": "The action."
      },
      {
        "order": "05",
        "title": "Weaving the Sequence",
        "publicSummary": "The physical act."
      },
      {
        "order": "06",
        "title": "Checking the Pattern",
        "publicSummary": "The validation."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-002",
    "slug": "hammering-a-copper-form",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "Hammering a Copper Form",
    "subtitle": "Force and flow",
    "description": "A close documentary demonstration of preparation, controlled hammering, shaping, rotation and the judgment required to form copper by hand.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/hammering_copper_1787204511392.jpg",
        "alt": "Technical close-up showing a specialized hammer striking a copper vessel, with the artisan's hand and the deformed metal dominating the frame.",
        "subject": "Hammering Copper",
        "craft": "Copperware",
        "activity": "Vessel Raising",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/hammering_copper_1787204511392.jpg",
        "alt": "Close technical shot of the hammer impact point."
      }
    },
    "duration": "18 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "the-copper-masters"
    ],
    "relatedStudioRecords": [
      "copper-workshops-downtown"
    ],
    "publicOverview": {
      "synopsis": "Hammering a Copper Form documents how controlled force gradually transforms copper into a stable and balanced shape. The demonstration follows the relationship between hammer position, vessel rotation, strike intensity and continual visual judgment.\\n\\nThe artisan does not simply strike the metal repeatedly. Each blow contributes to a developing form, and the sequence must account for the way copper responds to pressure and accumulated working.\\n\\nThe demonstration therefore presents hammering as an act of controlled material intelligence rather than brute force.",
      "documentaryPremise": "Force becomes craftsmanship only when the artisan knows exactly where, how and how much to strike.",
      "whyItMatters": "The finished vessel can make shaping appear effortless. Close documentation reveals the constant micro-decisions required to control form through hand hammering.",
      "examines": [
        "Copper preparation",
        "Hammer selection",
        "Strike placement",
        "Vessel rotation",
        "Form correction",
        "Surface development"
      ],
      "keyThemes": [
        "Copperware",
        "Hammering",
        "Material Response",
        "Hand Control",
        "Form",
        "Technique\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Copper",
        "content": "The material."
      },
      {
        "title": "Hammer Types",
        "content": "The instruments."
      },
      {
        "title": "Metal Response",
        "content": "The physical change."
      },
      {
        "title": "Forming",
        "content": "The shaping."
      },
      {
        "title": "Rotation",
        "content": "The movement."
      },
      {
        "title": "Surface",
        "content": "The finish."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Material Preparation",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Initial Form",
        "publicSummary": "The early shape."
      },
      {
        "order": "03",
        "title": "Hammer Position",
        "publicSummary": "The grip."
      },
      {
        "order": "04",
        "title": "Controlled Striking",
        "publicSummary": "The action."
      },
      {
        "order": "05",
        "title": "Rotation",
        "publicSummary": "The movement."
      },
      {
        "order": "06",
        "title": "Checking Shape",
        "publicSummary": "The validation."
      },
      {
        "order": "07",
        "title": "Surface Refinement",
        "publicSummary": "The finish."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-003",
    "slug": "carving-the-walnut-motif",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "Carving the Walnut Motif",
    "subtitle": "Revealing the relief",
    "description": "From reading the grain and laying out the pattern to tool selection, relief development and surface refinement.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/carving_walnut_1787204517945.jpg",
        "alt": "Macro technical photography of a chisel actively cutting into a recognizable walnut wood chinar leaf motif.",
        "subject": "Carving Walnut Motif",
        "craft": "Walnut Woodcarving",
        "activity": "Deep Relief Carving",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/carving_walnut_1787204517945.jpg",
        "alt": "Extreme close up of the wood shaving peeling away from the chisel."
      }
    },
    "duration": "22 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "walnut-wood-crafters"
    ],
    "relatedStudioRecords": [
      "walnut-woodcarver-workshop"
    ],
    "publicOverview": {
      "synopsis": "Carving the Walnut Motif follows a walnut surface as it moves from prepared material to recognizable carved relief. The demonstration begins with the relationship between motif and grain, then follows tool selection, first cuts, depth development and refinement.\\n\\nEvery cut creates both possibility and risk. The artisan must anticipate how the wood will respond and how each intervention affects the larger composition.\\n\\nThe record therefore shows carving as a sequence of controlled decisions rather than simply the removal of material.",
      "documentaryPremise": "The motif emerges through decisions about line, grain, pressure and depth.",
      "whyItMatters": "Close technical documentation allows viewers to understand why advanced carving depends on material judgment as much as manual dexterity.",
      "examines": [
        "Walnut grain",
        "Motif layout",
        "Chisel selection",
        "First cuts",
        "Relief development",
        "Surface refinement"
      ],
      "keyThemes": [
        "Walnut Wood",
        "Carving",
        "Motif",
        "Grain",
        "Chisels",
        "Hand Skill\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Walnut Grain",
        "content": "The material."
      },
      {
        "title": "Motif Layout",
        "content": "The design."
      },
      {
        "title": "Chisels",
        "content": "The instruments."
      },
      {
        "title": "Relief",
        "content": "The depth."
      },
      {
        "title": "Depth",
        "content": "The carving."
      },
      {
        "title": "Finishing",
        "content": "The final touch."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Selecting the Surface",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Drawing the Motif",
        "publicSummary": "The layout."
      },
      {
        "order": "03",
        "title": "Choosing the Chisel",
        "publicSummary": "The tool."
      },
      {
        "order": "04",
        "title": "First Cut",
        "publicSummary": "The beginning."
      },
      {
        "order": "05",
        "title": "Establishing Depth",
        "publicSummary": "The carving."
      },
      {
        "order": "06",
        "title": "Refining the Relief",
        "publicSummary": "The detailing."
      },
      {
        "order": "07",
        "title": "Finishing",
        "publicSummary": "The final touch."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-004",
    "slug": "the-naqashs-brush",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "The Naqash's Brush",
    "subtitle": "Precision of the painter",
    "description": "Papier-mâché decoration demonstrated through surface preparation, drawing, pigment control, brush technique, ornament and finishing.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/papier_mache_masters_1787192097858.jpg",
        "alt": "Technical close-up of a fine cat-hair brush physically painting delicate naqashi ornament onto a prepared papier-mâché surface.",
        "subject": "Naqashi Painting",
        "craft": "Papier-Mâché",
        "activity": "Surface Ornamentation",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/papier_mache_masters_1787192097858.jpg",
        "alt": "Macro shot of pigment being applied by the tip of the brush."
      }
    },
    "duration": "16 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "papier-mache-the-painted-masters"
    ],
    "relatedStudioRecords": [
      "papier-mache-atelier"
    ],
    "publicOverview": {
      "synopsis": "The Naqash's Brush documents the controlled movement through which pigment and inherited decorative language are transferred onto a prepared papier-mâché surface. The demonstration concentrates on the point of contact between brush, hand and object.\\n\\nBefore the brush moves, the practitioner must understand composition, line, colour and the behaviour of the prepared surface. As detail accumulates, small changes in pressure and pigment load affect the clarity and rhythm of the ornament.\\n\\nThe record makes visible the relationship between technical control and artistic vocabulary that defines accomplished naqashi.",
      "documentaryPremise": "At the tip of the brush, inherited visual language becomes individual hand movement.",
      "whyItMatters": "The decorative surface is easy to admire and difficult to explain. Close documentation preserves the controlled actions through which that surface is created.",
      "examines": [
        "Prepared surface",
        "Design layout",
        "Pigment preparation",
        "Brush loading",
        "Primary ornament",
        "Fine detailing"
      ],
      "keyThemes": [
        "Naqashi",
        "Papier-Mâché",
        "Brushwork",
        "Pigments",
        "Ornament",
        "Technique\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Naqashi",
        "content": "The art."
      },
      {
        "title": "Prepared Surface",
        "content": "The canvas."
      },
      {
        "title": "Pigment",
        "content": "The colour."
      },
      {
        "title": "Brush",
        "content": "The instrument."
      },
      {
        "title": "Motif",
        "content": "The design."
      },
      {
        "title": "Finish",
        "content": "The final touch."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Preparing the Surface",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Drawing the Design",
        "publicSummary": "The layout."
      },
      {
        "order": "03",
        "title": "Preparing Colour",
        "publicSummary": "The mix."
      },
      {
        "order": "04",
        "title": "Loading the Brush",
        "publicSummary": "The tool."
      },
      {
        "order": "05",
        "title": "Primary Ornament",
        "publicSummary": "The carving."
      },
      {
        "order": "06",
        "title": "Fine Detail",
        "publicSummary": "The detailing."
      },
      {
        "order": "07",
        "title": "Finishing",
        "publicSummary": "The final touch."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-005",
    "slug": "assembling-khatamband",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "Assembling Khatamband",
    "subtitle": "Precision in joinery",
    "description": "How geometric components are prepared, aligned and assembled into a coherent traditional wooden ceiling system.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/assembling_khatamband_1787204525143.jpg",
        "alt": "Close documentary demonstration of hands fitting precision-cut geometric wooden Khatamband pieces together without nails.",
        "subject": "Khatamband Assembly",
        "craft": "Khatamband",
        "activity": "Geometric Joinery",
        "location": "Srinagar",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/assembling_khatamband_1787204525143.jpg",
        "alt": "Close technical shot of the interlocking wood joints."
      }
    },
    "duration": "19 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "architectural-woodwork-heritage"
    ],
    "relatedStudioRecords": [
      "inside-khatamband-workshop"
    ],
    "publicOverview": {
      "synopsis": "Assembling Khatamband documents the transition from individual wooden components to a coherent geometric field. The demonstration follows how prepared pieces are selected, aligned and fitted according to a larger pattern logic.\\n\\nPrecision is cumulative. A minor error in one component can affect alignment far beyond the immediate joint, requiring the artisan to maintain awareness of both local fit and overall geometry.\\n\\nThe process reveals why Khatamband is as much an exercise in spatial reasoning as it is in woodworking.",
      "documentaryPremise": "Complex architecture emerges from disciplined repetition of precisely understood parts.",
      "whyItMatters": "The completed ceiling hides the logic of assembly. This demonstration reveals how geometry is physically built through hand-prepared components.",
      "examines": [
        "Pattern geometry",
        "Component selection",
        "Edge preparation",
        "Alignment",
        "Joining",
        "Expansion of the geometric field"
      ],
      "keyThemes": [
        "Khatamband",
        "Geometry",
        "Joinery",
        "Wood",
        "Modular Assembly",
        "Architecture\n\n---"
      ]
    },
    "contextModules": [
      {
        "title": "Geometry",
        "content": "The mathematics."
      },
      {
        "title": "Components",
        "content": "The pieces."
      },
      {
        "title": "Measurement",
        "content": "The precision."
      },
      {
        "title": "Wood Preparation",
        "content": "The material."
      },
      {
        "title": "Joinery",
        "content": "The connection."
      },
      {
        "title": "Architectural Pattern",
        "content": "The final form."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Reading the Geometry",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Selecting Components",
        "publicSummary": "The pieces."
      },
      {
        "order": "03",
        "title": "Preparing Edges",
        "publicSummary": "The fitting."
      },
      {
        "order": "04",
        "title": "Beginning Assembly",
        "publicSummary": "The start."
      },
      {
        "order": "05",
        "title": "Maintaining Alignment",
        "publicSummary": "The precision."
      },
      {
        "order": "06",
        "title": "Extending the Pattern",
        "publicSummary": "The growth."
      },
      {
        "order": "07",
        "title": "Final Inspection",
        "publicSummary": "The check."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
  },
  {
    "id": "KHCRF-CD-2026-006",
    "slug": "tying-the-carpet-knot",
    "studioType": "CRAFT_DEMONSTRATION",
    "title": "Tying the Carpet Knot",
    "subtitle": "The architecture of the floor",
    "description": "A close study of loom setup, design reference, knot formation, colour sequencing, cutting and repetition within Kashmiri carpet weaving.",
    "mediaStatus": "COMPLETE",
    "media": {
      "catalogueImage": {
        "src": "/images/generated/tying_carpet_knot_1787204531536.jpg",
        "alt": "Extreme close-up of a carpet weaver's hands tying an asymmetrical knot on the warp threads of an active loom.",
        "subject": "Tying the Knot",
        "craft": "Carpet Weaving",
        "activity": "Knotting and Cutting",
        "location": "Bandipora",
        "rightsStatus": "HCRF_OWNED"
      },
      "heroImage": {
        "src": "/images/generated/tying_carpet_knot_1787204531536.jpg",
        "alt": "Macro shot of the hooked knife cutting the thread."
      }
    },
    "duration": "12 MIN",
    "language": "KASHMIRI",
    "recordedYear": "2026",
    "relatedPublications": [
      "master-and-apprentice"
    ],
    "relatedStudioRecords": [
      "carpet-weavers-floor"
    ],
    "publicOverview": {
      "synopsis": "Tying the Carpet Knot concentrates on the smallest repeated action from which a patterned carpet gradually emerges. The demonstration follows the weaver from design reference and yarn selection to positioning the warp, forming the knot, tightening, cutting and checking the developing row.\\n\\nA single knot appears simple in isolation, yet its accuracy matters only in relationship with thousands of other knots. Colour, placement and tension must remain consistent across the surface.\\n\\nThe record therefore connects minute hand movement to the much larger logic of patterned textile construction.",
      "documentaryPremise": "The carpet grows through thousands of small acts of controlled repetition.",
      "whyItMatters": "The finished carpet conceals the structure of its production. Close documentation reveals the fundamental technical action on which the larger object depends.",
      "examines": [
        "Design reference",
        "Yarn selection",
        "Warp positioning",
        "Knot formation",
        "Tightening and cutting",
        "Pattern continuity"
      ],
      "keyThemes": [
        "Carpet Weaving",
        "Knotting",
        "Warp",
        "Yarn",
        "Pattern",
        "Repetition"
      ]
    },
    "contextModules": [
      {
        "title": "Warp",
        "content": "The foundation."
      },
      {
        "title": "Yarn",
        "content": "The material."
      },
      {
        "title": "Knot Type",
        "content": "The technique."
      },
      {
        "title": "Design Reference",
        "content": "The talim."
      },
      {
        "title": "Colour Sequence",
        "content": "The palette."
      },
      {
        "title": "Cutting",
        "content": "The finish."
      }
    ],
    "contentPreview": [
      {
        "order": "01",
        "title": "Reading the Design",
        "publicSummary": "Beginnings."
      },
      {
        "order": "02",
        "title": "Selecting Yarn",
        "publicSummary": "The material."
      },
      {
        "order": "03",
        "title": "Positioning the Warp",
        "publicSummary": "The foundation."
      },
      {
        "order": "04",
        "title": "Forming the Knot",
        "publicSummary": "The action."
      },
      {
        "order": "05",
        "title": "Tightening",
        "publicSummary": "The precision."
      },
      {
        "order": "06",
        "title": "Cutting",
        "publicSummary": "The finish."
      },
      {
        "order": "07",
        "title": "Building the Row",
        "publicSummary": "The growth."
      },
      {
        "order": "08",
        "title": "Checking Pattern",
        "publicSummary": "The validation."
      }
    ],
    "publicVisibility": "PUBLIC",
    "accessStatus": "READY",
    "requiredEntitlement": "MEMBER"
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

