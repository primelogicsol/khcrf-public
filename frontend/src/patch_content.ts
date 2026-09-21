import fs from 'fs';
import { StudioRegistry } from './lib/services/canonicalStudio';

const textData = {
  "KHCRF-WK-2026-001": {
    "publicOverview": {
      "synopsis": "The Kani Weavers of Kanihama documents a living production community in which loom, pattern, artisan and apprenticeship remain parts of one interconnected knowledge system.\\n\\nRather than treating Kani only as a finished luxury textile, the record enters the environment where weaving knowledge is interpreted, practiced, corrected and transmitted between experienced practitioners and those learning beside them.",
      "documentaryPremise": "A workshop is more than a room; it is an institution through which knowledge becomes practice and practice becomes inheritance.",
      "themes": ["Kani Weaving", "Talim", "Loom Practice", "Apprenticeship", "Workshop Community", "Transmission"]
    },
    "contextModules": [
      { title: "Kanihama", description: "The craft geography surrounding one of Kashmir's best-known Kani weaving environments." },
      { title: "Kani Weaving", description: "The relationship between coded design, colour, Kanis and disciplined loom work." },
      { title: "Talim", description: "How design instructions enter the working process." },
      { title: "Master Weavers", description: "Resolve actual linked artisan records." },
      { title: "Apprenticeship", description: "How competence is developed through proximity, correction and repetition." },
      { title: "Workshop Ecosystem", description: "People, materials, tools and supporting production roles." }
    ],
    "contentPreview": [
      { title: "The Workshop Environment", publicSummary: "The physical organization of the Kanihama weaving space and the relationship between loom, tools, materials and practitioners." },
      { title: "The People", publicSummary: "Masters, experienced weavers, younger practitioners and other participants who sustain the production ecosystem." },
      { title: "The Looms", publicSummary: "The working structures around which Kani production is organized." },
      { title: "Talim and Pattern", publicSummary: "How coded pattern information is interpreted within actual weaving practice." },
      { title: "Tools and Materials", publicSummary: "The functional relationship between yarn, Kanis, warp and other working materials." },
      { title: "Transmission", publicSummary: "How knowledge moves between experienced practitioners and younger workers." },
      { title: "Objects in Production", publicSummary: "Selected works documenting stages of the weaving process." },
      { title: "Related Documentation", publicSummary: "Films, interviews, oral histories, demonstrations and publications linked to this workshop." }
    ]
  },
  "KHCRF-WK-2026-002": {
    "publicOverview": {
      "synopsis": "The Copper Workshops of Downtown Srinagar enters the working spaces where sheets and forms of metal become culturally recognizable objects through hammering, shaping, engraving and repeated hand judgment.\\n\\nThe record considers the workshop as both production space and repository of specialized knowledge, linking individual artisans to longer neighbourhood traditions.",
      "documentaryPremise": "The copper object carries the sound, rhythm and memory of the workshop that produced it.",
      "themes": ["Copperware", "Downtown Srinagar", "Hammering", "Engraving", "Workshop Culture", "Transmission"]
    },
    "contextModules": [
      { title: "Copper as Material", description: "Understanding the properties of copper." },
      { title: "Hammer and Form", description: "The relationship between striking and shape." },
      { title: "Engraving and Ornament", description: "The application of traditional motifs." },
      { title: "Historic Workshop Geography", description: "The legacy of downtown Srinagar." },
      { title: "Master Artisans", description: "The keepers of copper knowledge." },
      { title: "Workshop Transmission", description: "How metalworking is passed down." }
    ],
    "contentPreview": [
      { title: "Entering the Copper Workshop", publicSummary: "First view of the environment." },
      { title: "Metal and Material Preparation", publicSummary: "Getting the copper ready for shaping." },
      { title: "Hammering and Form", publicSummary: "The primary shaping process." },
      { title: "Engraving and Ornament", publicSummary: "Detailing the copper surface." },
      { title: "Tools of the Workshop", publicSummary: "The specific instruments of the trade." },
      { title: "Masters and Learners", publicSummary: "Generational dynamics." },
      { title: "Objects in Production", publicSummary: "Works in progress." },
      { title: "Related Copper Documentation", publicSummary: "Linked records and files." }
    ]
  },
  "KHCRF-WK-2026-003": {
    "publicOverview": {
      "synopsis": "The Walnut Woodcarvers' Workshop documents the environment in which material knowledge, drawing, carving vocabulary, hand tools and decades of accumulated judgment converge.\\n\\nIts focus is not simply the carved object, but the working system that allows an artisan to read walnut, anticipate its behaviour and gradually release pattern from the material.",
      "documentaryPremise": "The carving begins before the first cut, in the artisan's understanding of the wood.",
      "themes": ["Walnut Wood", "Material Judgment", "Carving", "Motifs", "Tools", "Mastery"]
    },
    "contextModules": [
      { title: "Walnut as Material", description: "The properties of Kashmiri walnut." },
      { title: "Grain and Seasoning", description: "Preparing the wood for the chisel." },
      { title: "Carving Tools", description: "The essential instruments of relief." },
      { title: "Motif Vocabulary", description: "The language of traditional pattern." },
      { title: "Master Carvers", description: "Those who possess advanced judgment." },
      { title: "Workshop Learning", description: "How carving is taught and learned." }
    ],
    "contentPreview": [
      { title: "Reading the Wood", publicSummary: "Understanding the grain before cutting." },
      { title: "Preparing the Surface", publicSummary: "Initial smoothing and layout." },
      { title: "Tools and Cutting Language", publicSummary: "The vocabulary of the chisel." },
      { title: "Developing the Motif", publicSummary: "Bringing the pattern into view." },
      { title: "Relief and Depth", publicSummary: "Controlling three-dimensional space." },
      { title: "The Master Carver", publicSummary: "Focus on the primary practitioner." },
      { title: "Workshop Transmission", publicSummary: "Passing on the knowledge." },
      { title: "Finished and Unfinished Works", publicSummary: "The state of objects in the shop." }
    ]
  },
  "KHCRF-WK-2026-004": {
    "publicOverview": {
      "synopsis": "The Papier-Mâché Atelier follows the chain of specialist work through which prepared forms become painted and finished objects.\\n\\nIt documents the relationship between surface preparation, drawing, naqashi, pigment, motif, ornament and finishing while placing individual practitioners inside the larger atelier system.",
      "documentaryPremise": "The painted surface is the visible end of a much longer chain of specialized knowledge.",
      "themes": ["Papier-Mâché", "Naqashi", "Surface", "Pigments", "Ornament", "Atelier Practice"]
    },
    "contextModules": [
      { title: "Object Preparation", description: "Forming the base object." },
      { title: "Surface Ground", description: "Creating the canvas for paint." },
      { title: "Naqashi", description: "The art of fine brushwork." },
      { title: "Motif Systems", description: "The decorative grammar." },
      { title: "Pigment and Ornament", description: "The use of colour and gold." },
      { title: "Specialist Practitioners", description: "The distinct roles in the atelier." }
    ],
    "contentPreview": [
      { title: "Preparing the Object", publicSummary: "The initial pulp and molding." },
      { title: "Preparing the Surface", publicSummary: "Smoothing and priming." },
      { title: "Drawing the Design", publicSummary: "Laying out the pattern." },
      { title: "The Naqash's Brush", publicSummary: "The delicate work of painting." },
      { title: "Pigment and Colour", publicSummary: "Mixing and applying hues." },
      { title: "Ornament and Finish", publicSummary: "Final details and varnishing." },
      { title: "The Atelier Community", publicSummary: "The network of artisans." },
      { title: "Objects at Different Stages", publicSummary: "A view of the production pipeline." }
    ]
  },
  "KHCRF-WK-2026-005": {
    "publicOverview": {
      "synopsis": "Inside a Khatamband Workshop documents the precision environment where geometry, wood preparation, modular thinking and hand assembly become architectural surface.\\n\\nThe record reveals how individual components are understood not as isolated pieces but as parts of a larger geometric system requiring exceptional visualization and consistency.",
      "documentaryPremise": "In Khatamband, architecture begins in the precision of the smallest component.",
      "themes": ["Khatamband", "Geometry", "Wood", "Modular Assembly", "Architecture", "Mastery"]
    },
    "contextModules": [
      { title: "Geometric Design", description: "The mathematics of the pattern." },
      { title: "Material Preparation", description: "Getting the wood ready." },
      { title: "Component Making", description: "Cutting the exact shapes." },
      { title: "Assembly Logic", description: "How the pieces fit together." },
      { title: "Architectural Context", description: "The role of the ceiling." },
      { title: "Master Practitioners", description: "The keepers of the geometry." }
    ],
    "contentPreview": [
      { title: "Reading the Pattern", publicSummary: "Understanding the geometric intent." },
      { title: "Preparing the Wood", publicSummary: "Selecting and milling the material." },
      { title: "Cutting Components", publicSummary: "The precise work of shaping pieces." },
      { title: "Organizing Modules", publicSummary: "Sorting the cut geometry." },
      { title: "Assembly", publicSummary: "The physical act of fitting." },
      { title: "Expanding the Geometric Field", publicSummary: "Growing the pattern outwards." },
      { title: "Masters and Learners", publicSummary: "The transmission of architectural logic." },
      { title: "Architectural Application", publicSummary: "The final installed context." }
    ]
  },
  "KHCRF-WK-2026-006": {
    "publicOverview": {
      "synopsis": "The Carpet Weavers' Floor documents collective production at the loom, where design reference, colour, knotting, rhythm and coordination become a shared working system.\\n\\nThe record examines the carpet workshop simultaneously as factory of hand production, place of learning and community of specialized labour.",
      "documentaryPremise": "A carpet is built knot by knot, but the knowledge required to make it belongs to an entire working environment.",
      "themes": ["Carpet Weaving", "Loom", "Knotting", "Design", "Collective Labour", "Apprenticeship"]
    },
    "contextModules": [
      { title: "The Carpet Loom", description: "The structure that holds the work." },
      { title: "Design Reference", description: "Reading the pattern." },
      { title: "Knotting Systems", description: "The physical act of making." },
      { title: "Colour Sequencing", description: "Managing the palette." },
      { title: "Collective Production", description: "Working together on one piece." },
      { title: "Workshop Learning", description: "How the craft is absorbed." }
    ],
    "contentPreview": [
      { title: "The Weaving Floor", publicSummary: "The overall environment." },
      { title: "Setting the Loom", publicSummary: "Preparing the warp." },
      { title: "Reading the Design", publicSummary: "Consulting the talim." },
      { title: "Knotting", publicSummary: "The core action." },
      { title: "Colour and Sequence", publicSummary: "Changing threads." },
      { title: "Cutting and Surface Control", publicSummary: "Managing the pile." },
      { title: "Working as a Team", publicSummary: "Coordination across the loom." },
      { title: "Transmission", publicSummary: "Teaching the next generation." }
    ]
  },
  "KHCRF-DF-2026-001": {
    "publicOverview": {
      "synopsis": "A cinematic portrait of practitioners carrying advanced Kani knowledge at a moment when the continuity of specialist weaving can no longer be assumed.\\n\\nThe film moves between loom, Talim, hand movement, memory and succession to ask what distinguishes master-level knowledge from ordinary production competence.",
      "documentaryPremise": "The last masters are not simply the oldest practitioners. They are living repositories of a system that must be transmitted to remain alive.",
      "themes": ["Mastery", "Kani", "Talim", "Ageing Practitioners", "Apprenticeship", "Continuity"]
    },
    "contextModules": [
      { title: "Kani Tradition", description: "The history of the craft." },
      { title: "Master Weavers", description: "The central figures." },
      { title: "Talim", description: "The coded language." },
      { title: "Kanihama", description: "The historic centre." },
      { title: "Succession", description: "The question of the future." },
      { title: "Related 'Masters of Kani'", description: "Linked documentation." }
    ],
    "contentPreview": [
      { title: "The Loom", publicSummary: "The machine and the space." },
      { title: "The Master", publicSummary: "Focus on the practitioner." },
      { title: "Reading Talim", publicSummary: "The interpretation of code." },
      { title: "Pattern and Memory", publicSummary: "How design is held." },
      { title: "Teaching the Next Hand", publicSummary: "The act of passing on." },
      { title: "What Comes After the Master?", publicSummary: "The open question." }
    ]
  },
  "KHCRF-DF-2026-002": {
    "publicOverview": {
      "synopsis": "Hands That Shape the Valley explores embodied intelligence across Kashmir's wood, metal, painted and architectural crafts.\\n\\nRather than organizing craftsmanship around product categories, the film follows the hand itself — cutting, striking, painting, fitting, correcting and judging material through accumulated experience.",
      "documentaryPremise": "Before craftsmanship becomes an object, it exists as judgment in the hand.",
      "themes": ["Embodied Knowledge", "Walnut Wood", "Copperware", "Papier-Mâché", "Khatamband", "Mastery Across Materials"]
    },
    "contextModules": [
      { title: "Embodied Knowledge", description: "The intelligence of the body." },
      { title: "Walnut Wood", description: "The nature of carving." },
      { title: "Copperware", description: "The nature of striking." },
      { title: "Papier-Mâché", description: "The nature of painting." },
      { title: "Khatamband", description: "The nature of fitting." },
      { title: "Mastery Across Materials", description: "The common threads." }
    ],
    "contentPreview": [
      { title: "The Intelligent Hand", publicSummary: "Introduction to physical skill." },
      { title: "Wood", publicSummary: "The carving hand." },
      { title: "Metal", publicSummary: "The striking hand." },
      { title: "Surface and Brush", publicSummary: "The painting hand." },
      { title: "Geometry", publicSummary: "The fitting hand." },
      { title: "Mastery", publicSummary: "The culmination of practice." },
      { title: "Handmade Futures", publicSummary: "What survives." }
    ]
  },
  "KHCRF-DF-2026-003": {
    "publicOverview": {
      "synopsis": "The documentary brings masters, learners, women practitioners and younger Kashmiris into the same generational question: who will carry advanced craft knowledge forward?\\n\\nIt looks beyond nostalgia to examine why apprenticeship succeeds or fails under changing economic and social conditions.",
      "documentaryPremise": "Inheritance in craft is not possession of an object. It is possession of the knowledge required to make another.",
      "themes": ["Ageing Masters", "Apprenticeship", "Youth", "Women Practitioners", "Economics", "Workshop Continuity"]
    },
    "contextModules": [
      { title: "Ageing Masters", description: "The current keepers of knowledge." },
      { title: "Apprenticeship", description: "The traditional system." },
      { title: "Youth", description: "The next generation." },
      { title: "Women Practitioners", description: "The hidden workers." },
      { title: "Economics", description: "The financial reality." },
      { title: "Workshop Continuity", description: "The future of the space." }
    ],
    "contentPreview": [
      { title: "The Master", publicSummary: "The perspective of experience." },
      { title: "The Learner", publicSummary: "The perspective of youth." },
      { title: "Leaving the Workshop", publicSummary: "Why practitioners quit." },
      { title: "Women and Invisible Knowledge", publicSummary: "The uncredited makers." },
      { title: "The Economics of Learning", publicSummary: "The cost of apprenticeship." },
      { title: "The Inheritance Question", publicSummary: "Who takes over?" }
    ]
  },
  "KHCRF-VI-2026-001": {
    "publicOverview": {
      "synopsis": "A long-form conversation with a copper practitioner reflecting on apprenticeship, tools, workshop discipline, changing markets and the meaning of mastery across a working lifetime.",
      "documentaryPremise": "The history of a craft can sometimes be read through the working life of one practitioner.",
      "themes": ["The Artisan", "Copper Craft", "Workshop Life", "Tools", "Changing Markets", "Transmission"]
    },
    "contextModules": [
      { title: "The Artisan", description: "The subject of the interview." },
      { title: "Copper Craft", description: "The material context." },
      { title: "Workshop Life", description: "The daily rhythm." },
      { title: "Tools", description: "The instruments of work." },
      { title: "Changing Markets", description: "The economic context." },
      { title: "Transmission", description: "Passing on the skill." }
    ],
    "contentPreview": [
      { title: "Entering the Craft", publicSummary: "First steps into the workshop." },
      { title: "Learning the Tools", publicSummary: "Mastering the hammer." },
      { title: "Becoming Independent", publicSummary: "Starting out alone." },
      { title: "Workshop Life", publicSummary: "The daily grind." },
      { title: "Changes in Production", publicSummary: "How things evolved." },
      { title: "What Should Survive", publicSummary: "Hopes for the future." }
    ]
  },
  "KHCRF-VI-2026-002": {
    "publicOverview": {
      "synopsis": "An experienced textile practitioner reflects on learning at the loom, the discipline of production, changing materials and the transformation of workshop life over decades.",
      "documentaryPremise": "Memory preserves dimensions of craft history that objects alone cannot reveal.",
      "themes": ["Speaker", "Textile Practice", "Learning", "Workshop Memory", "Changing Production", "Transmission"]
    },
    "contextModules": [
      { title: "Speaker", description: "The subject of the interview." },
      { title: "Textile Practice", description: "The material context." },
      { title: "Learning", description: "The early years." },
      { title: "Workshop Memory", description: "The lived experience." },
      { title: "Changing Production", description: "The shift in methods." },
      { title: "Transmission", description: "The act of teaching." }
    ],
    "contentPreview": [
      { title: "Early Years", publicSummary: "Beginnings." },
      { title: "Learning the Loom", publicSummary: "Mastering the machine." },
      { title: "Daily Working Life", publicSummary: "The rhythm of the day." },
      { title: "Material and Technique", publicSummary: "The specifics of the craft." },
      { title: "Changes Over Time", publicSummary: "The evolution of the workshop." },
      { title: "Future Generations", publicSummary: "Looking ahead." }
    ]
  },
  "KHCRF-VI-2026-003": {
    "publicOverview": {
      "synopsis": "The Master Carver follows an experienced walnut wood artisan whose authority has been built through decades of material judgment, tool control and motif development.\\n\\nThe conversation examines mistakes, standards, mastery and the responsibility carried by someone capable of teaching the next generation.",
      "documentaryPremise": "Mastery is measured not only by what one can make, but by what one understands well enough to transmit.",
      "themes": ["Master Artisan", "Walnut Wood", "Material Judgment", "Motifs", "Tools", "Teaching"]
    },
    "contextModules": [
      { title: "Master Artisan", description: "The subject of the interview." },
      { title: "Walnut Wood", description: "The material context." },
      { title: "Material Judgment", description: "The critical eye." },
      { title: "Motifs", description: "The decorative language." },
      { title: "Tools", description: "The instruments." },
      { title: "Teaching", description: "The transmission." }
    ],
    "contentPreview": [
      { title: "First Lessons", publicSummary: "Beginnings." },
      { title: "Understanding Walnut", publicSummary: "The material." },
      { title: "Tools and Control", publicSummary: "The instruments." },
      { title: "Motif and Style", publicSummary: "The design." },
      { title: "Mistakes and Standards", publicSummary: "The quality." },
      { title: "Becoming a Master", publicSummary: "The journey." },
      { title: "Teaching Others", publicSummary: "The legacy." }
    ]
  },
  "KHCRF-OH-2026-001": {
    "publicOverview": {
      "synopsis": "A first-person recollection of textile work, apprenticeship, workshop rhythm and the social world surrounding the loom across decades.",
      "documentaryPremise": "The loom carries textile memory; the artisan carries the memory of life around the loom.",
      "themes": ["Narrator", "Textile Tradition", "Workshop Memory", "Apprenticeship", "Changing Production", "Place"]
    },
    "contextModules": [
      { title: "Narrator", description: "The subject of the interview." },
      { title: "Textile Tradition", description: "The material context." },
      { title: "Workshop Memory", description: "The lived experience." },
      { title: "Apprenticeship", description: "The early years." },
      { title: "Changing Production", description: "The shift in methods." },
      { title: "Place", description: "The geography of the craft." }
    ],
    "contentPreview": [
      { title: "Memory I — First Encounters", publicSummary: "Beginnings." },
      { title: "Memory II — Learning", publicSummary: "Mastering the machine." },
      { title: "Memory III — The Working Day", publicSummary: "The rhythm of the day." },
      { title: "Memory IV — People Around the Loom", publicSummary: "The social world." },
      { title: "Memory V — What Changed", publicSummary: "The evolution of the workshop." },
      { title: "Memory VI — What Remains", publicSummary: "Looking ahead." }
    ]
  },
  "KHCRF-OH-2026-002": {
    "publicOverview": {
      "synopsis": "An oral history of Srinagar's craft neighbourhoods when workshops, suppliers, makers, traders and specialist occupations formed a dense urban production ecosystem.",
      "documentaryPremise": "Sometimes the history of craft belongs not to one artisan, but to an entire street.",
      "themes": ["Downtown Srinagar", "Workshop Clusters", "Suppliers", "Markets", "Neighbourhood Memory", "Urban Change"]
    },
    "contextModules": [
      { title: "Downtown Srinagar", description: "The historic centre." },
      { title: "Workshop Clusters", description: "The geography of production." },
      { title: "Suppliers", description: "The material chain." },
      { title: "Markets", description: "The trade." },
      { title: "Neighbourhood Memory", description: "The lived experience." },
      { title: "Urban Change", description: "The shifting city." }
    ],
    "contentPreview": [
      { title: "The Street", publicSummary: "The environment." },
      { title: "The Workshops", publicSummary: "The spaces of production." },
      { title: "The People", publicSummary: "The inhabitants." },
      { title: "The Sounds", publicSummary: "The auditory landscape." },
      { title: "Trade and Movement", publicSummary: "The flow of goods." },
      { title: "What Disappeared", publicSummary: "The lost elements." }
    ]
  },
  "KHCRF-OH-2026-003": {
    "publicOverview": {
      "synopsis": "First-person memories of apprenticeship reveal the discipline, correction, patience and emotional relationship underlying traditional learning.",
      "documentaryPremise": "Before an apprentice learns to work alone, they learn how to watch.",
      "themes": ["Master", "Apprentice", "Observation", "Correction", "Repetition", "Independence"]
    },
    "contextModules": [
      { title: "Master", description: "The teacher." },
      { title: "Apprentice", description: "The learner." },
      { title: "Observation", description: "The act of watching." },
      { title: "Correction", description: "The guidance." },
      { title: "Repetition", description: "The practice." },
      { title: "Independence", description: "The culmination." }
    ],
    "contentPreview": [
      { title: "First Day", publicSummary: "Beginnings." },
      { title: "Watching", publicSummary: "Observation." },
      { title: "First Tools", publicSummary: "The instruments." },
      { title: "Mistakes", publicSummary: "The errors." },
      { title: "Correction", publicSummary: "The guidance." },
      { title: "Working Alone", publicSummary: "The culmination." },
      { title: "Looking Back", publicSummary: "Reflection." }
    ]
  },
  "KHCRF-OH-2026-004": {
    "publicOverview": {
      "synopsis": "Women's accounts document forms of textile, decorative and household production knowledge frequently transmitted outside formal workshops and therefore often absent from institutional craft histories.",
      "documentaryPremise": "Knowledge can remain invisible to institutions while remaining essential to tradition.",
      "themes": ["Women Practitioners", "Spinning", "Embroidery", "Household Knowledge", "Transmission", "Recognition"]
    },
    "contextModules": [
      { title: "Women Practitioners", description: "The uncredited makers." },
      { title: "Spinning", description: "The material." },
      { title: "Embroidery", description: "The craft." },
      { title: "Household Knowledge", description: "The context." },
      { title: "Transmission", description: "The passing down." },
      { title: "Recognition", description: "The institutional failure." }
    ],
    "contentPreview": [
      { title: "Learning at Home", publicSummary: "Beginnings." },
      { title: "Women's Work", publicSummary: "The labour." },
      { title: "Tools and Materials", publicSummary: "The instruments." },
      { title: "Patterns and Memory", publicSummary: "The design." },
      { title: "Unrecognized Skill", publicSummary: "The invisibility." },
      { title: "Teaching the Next Generation", publicSummary: "The legacy." }
    ]
  },
  "KHCRF-OH-2026-005": {
    "publicOverview": {
      "synopsis": "This oral history reconstructs working environments through remembered sound — hammer against metal, chisel against wood, repeated rhythm and the collective acoustic life of the workshop.",
      "documentaryPremise": "A workshop can disappear physically while its rhythm survives in memory.",
      "themes": ["Workshop Sound", "Tools", "Copper", "Wood", "Rhythm", "Collective Work"]
    },
    "contextModules": [
      { title: "Workshop Sound", description: "The auditory landscape." },
      { title: "Tools", description: "The instruments." },
      { title: "Copper", description: "The metal." },
      { title: "Wood", description: "The material." },
      { title: "Rhythm", description: "The pace." },
      { title: "Collective Work", description: "The community." }
    ],
    "contentPreview": [
      { title: "Morning in the Workshop", publicSummary: "Beginnings." },
      { title: "Tools Beginning", publicSummary: "The instruments." },
      { title: "Rhythm of Work", publicSummary: "The pace." },
      { title: "Learning Through Sound", publicSummary: "The guidance." },
      { title: "Silence and Change", publicSummary: "The culmination." },
      { title: "What the Sound Meant", publicSummary: "Reflection." }
    ]
  },
  "KHCRF-OH-2026-006": {
    "publicOverview": {
      "synopsis": "An artisan remembers a declining workshop community, the practitioners who once filled it and the processes that disappeared as production contracted.",
      "documentaryPremise": "The final years of a workshop can reveal as much about a craft as its years of prosperity.",
      "themes": ["Workshop Decline", "Artisan Community", "Economic Change", "Tools Left Behind", "Succession", "Memory"]
    },
    "contextModules": [
      { title: "Workshop Decline", description: "The end of an era." },
      { title: "Artisan Community", description: "The people." },
      { title: "Economic Change", description: "The finances." },
      { title: "Tools Left Behind", description: "The instruments." },
      { title: "Succession", description: "The failure of passing down." },
      { title: "Memory", description: "The recollection." }
    ],
    "contentPreview": [
      { title: "When It Was Full", publicSummary: "Beginnings." },
      { title: "The People", publicSummary: "The community." },
      { title: "The Work", publicSummary: "The labour." },
      { title: "The First Departures", publicSummary: "The shift." },
      { title: "The Last Years", publicSummary: "The end." },
      { title: "What Remains", publicSummary: "Reflection." }
    ]
  },
  "KHCRF-CD-2026-001": {
    "publicOverview": {
      "synopsis": "A focused technical demonstration showing how coded Talim instructions are interpreted and translated into colour placement and movement on the Kani loom.",
      "documentaryPremise": "The woven pattern begins as information before it becomes textile.",
      "themes": ["Talim", "Kani Loom", "Colour", "Bobbins", "Pattern", "Master Weaver"]
    },
    "contextModules": [
      { title: "Talim", description: "The coded language." },
      { title: "Kani Loom", description: "The machine." },
      { title: "Colour", description: "The palette." },
      { title: "Bobbins", description: "The tools." },
      { title: "Pattern", description: "The design." },
      { title: "Master Weaver", description: "The practitioner." }
    ],
    "contentPreview": [
      { title: "The Talim Sheet", publicSummary: "The code." },
      { title: "Reading the Code", publicSummary: "The interpretation." },
      { title: "Selecting the Kani", publicSummary: "The tool." },
      { title: "Translating Instruction", publicSummary: "The action." },
      { title: "Weaving the Sequence", publicSummary: "The physical act." },
      { title: "Checking the Pattern", publicSummary: "The validation." }
    ]
  },
  "KHCRF-CD-2026-002": {
    "publicOverview": {
      "synopsis": "A close technical demonstration of how controlled hammering gradually shapes copper while maintaining proportion and surface integrity.",
      "documentaryPremise": "Force becomes craftsmanship only when the artisan knows exactly where, how and how much to strike.",
      "themes": ["Copper", "Hammer Types", "Metal Response", "Forming", "Rotation", "Surface"]
    },
    "contextModules": [
      { title: "Copper", description: "The material." },
      { title: "Hammer Types", description: "The instruments." },
      { title: "Metal Response", description: "The physical change." },
      { title: "Forming", description: "The shaping." },
      { title: "Rotation", description: "The movement." },
      { title: "Surface", description: "The finish." }
    ],
    "contentPreview": [
      { title: "Material Preparation", publicSummary: "Beginnings." },
      { title: "Initial Form", publicSummary: "The early shape." },
      { title: "Hammer Position", publicSummary: "The grip." },
      { title: "Controlled Striking", publicSummary: "The action." },
      { title: "Rotation", publicSummary: "The movement." },
      { title: "Checking Shape", publicSummary: "The validation." },
      { title: "Surface Refinement", publicSummary: "The finish." }
    ]
  },
  "KHCRF-CD-2026-003": {
    "publicOverview": {
      "synopsis": "A technical demonstration following a walnut surface from motif layout to the first cuts, relief development and refinement of detail.",
      "documentaryPremise": "The motif emerges through a sequence of decisions about line, depth, grain and pressure.",
      "themes": ["Walnut Grain", "Motif Layout", "Chisels", "Relief", "Depth", "Finishing"]
    },
    "contextModules": [
      { title: "Walnut Grain", description: "The material." },
      { title: "Motif Layout", description: "The design." },
      { title: "Chisels", description: "The instruments." },
      { title: "Relief", description: "The depth." },
      { title: "Depth", description: "The carving." },
      { title: "Finishing", description: "The final touch." }
    ],
    "contentPreview": [
      { title: "Selecting the Surface", publicSummary: "Beginnings." },
      { title: "Drawing the Motif", publicSummary: "The layout." },
      { title: "Choosing the Chisel", publicSummary: "The tool." },
      { title: "First Cut", publicSummary: "The beginning." },
      { title: "Establishing Depth", publicSummary: "The carving." },
      { title: "Refining the Relief", publicSummary: "The detailing." },
      { title: "Finishing", publicSummary: "The final touch." }
    ]
  },
  "KHCRF-CD-2026-004": {
    "publicOverview": {
      "synopsis": "A close demonstration of papier-mâché decoration showing the relationship between prepared surface, drawing, pigment, brush pressure and fine ornamental control.",
      "documentaryPremise": "At the tip of the brush, inherited visual language becomes individual hand movement.",
      "themes": ["Naqashi", "Prepared Surface", "Pigment", "Brush", "Motif", "Finish"]
    },
    "contextModules": [
      { title: "Naqashi", description: "The art." },
      { title: "Prepared Surface", description: "The canvas." },
      { title: "Pigment", description: "The colour." },
      { title: "Brush", description: "The instrument." },
      { title: "Motif", description: "The design." },
      { title: "Finish", description: "The final touch." }
    ],
    "contentPreview": [
      { title: "Preparing the Surface", publicSummary: "Beginnings." },
      { title: "Drawing the Design", publicSummary: "The layout." },
      { title: "Preparing Colour", publicSummary: "The mix." },
      { title: "Loading the Brush", publicSummary: "The tool." },
      { title: "Primary Ornament", publicSummary: "The carving." },
      { title: "Fine Detail", publicSummary: "The detailing." },
      { title: "Finishing", publicSummary: "The final touch." }
    ]
  },
  "KHCRF-CD-2026-005": {
    "publicOverview": {
      "synopsis": "A process demonstration showing how precisely prepared wooden modules are aligned and fitted into a larger geometric Khatamband composition.",
      "documentaryPremise": "Complex architecture emerges from the disciplined repetition of precisely understood parts.",
      "themes": ["Geometry", "Components", "Measurement", "Wood Preparation", "Joinery", "Architectural Pattern"]
    },
    "contextModules": [
      { title: "Geometry", description: "The mathematics." },
      { title: "Components", description: "The pieces." },
      { title: "Measurement", description: "The precision." },
      { title: "Wood Preparation", description: "The material." },
      { title: "Joinery", description: "The connection." },
      { title: "Architectural Pattern", description: "The final form." }
    ],
    "contentPreview": [
      { title: "Reading the Geometry", publicSummary: "Beginnings." },
      { title: "Selecting Components", publicSummary: "The pieces." },
      { title: "Preparing Edges", publicSummary: "The fitting." },
      { title: "Beginning Assembly", publicSummary: "The start." },
      { title: "Maintaining Alignment", publicSummary: "The precision." },
      { title: "Extending the Pattern", publicSummary: "The growth." },
      { title: "Final Inspection", publicSummary: "The check." }
    ]
  },
  "KHCRF-CD-2026-006": {
    "publicOverview": {
      "synopsis": "A close technical study of knot formation on a vertical carpet loom, connecting hand movement, warp structure, colour sequence and the developing patterned surface.",
      "documentaryPremise": "The carpet grows through thousands of tiny acts of controlled repetition.",
      "themes": ["Warp", "Yarn", "Knot Type", "Design Reference", "Colour Sequence", "Cutting"]
    },
    "contextModules": [
      { title: "Warp", description: "The foundation." },
      { title: "Yarn", description: "The material." },
      { title: "Knot Type", description: "The technique." },
      { title: "Design Reference", description: "The talim." },
      { title: "Colour Sequence", description: "The palette." },
      { title: "Cutting", description: "The finish." }
    ],
    "contentPreview": [
      { title: "Reading the Design", publicSummary: "Beginnings." },
      { title: "Selecting Yarn", publicSummary: "The material." },
      { title: "Positioning the Warp", publicSummary: "The foundation." },
      { title: "Forming the Knot", publicSummary: "The action." },
      { title: "Tightening", publicSummary: "The precision." },
      { title: "Cutting", publicSummary: "The finish." },
      { title: "Building the Row", publicSummary: "The growth." },
      { title: "Checking Pattern", publicSummary: "The validation." }
    ]
  }
};

const updatedRegistry = StudioRegistry.map(record => {
  if (textData[record.id]) {
    return {
      ...record,
      publicOverview: {
        ...record.publicOverview,
        synopsis: textData[record.id].publicOverview.synopsis,
        premise: textData[record.id].publicOverview.documentaryPremise,
        theme: textData[record.id].publicOverview.themes[0],
      },
      contextModules: textData[record.id].contextModules.map(m => ({
        title: m.title,
        content: m.description,
      })),
      contentPreview: textData[record.id].contentPreview.map((c, idx) => ({
        order: String(idx + 1).padStart(2, '0'),
        title: c.title,
        publicSummary: c.publicSummary
      })),
    };
  }
  return record;
});

// Since we cannot just write the JS object to TS file easily due to types and functions,
// we'll replace the StudioRegistry string in the file manually in python.
fs.writeFileSync('temp_registry.json', JSON.stringify(updatedRegistry, null, 2));
console.log("Wrote temp_registry.json");
