export interface Publication {
    id: string;
    title: string;
    subtitle: string;
    author: string;
    published: string;
    category: string;
    price: number;
    pages: number;
    description: string;
    longDescription?: string;
    imagePath: string; // Filename in public/assets/images/craft_cover/
    slug: string;
    tableOfContents?: string[];
    // New Fields for Detail Page
    features?: string[];
    language?: string;
    formats?: string[];
    fileSize?: string;
    dimensions?: string; // For physical copies if needed, or strictly digital traits
    pdfPath?: string;
    isbn?: string;
    isbnStatus?: string;
    edition?: string;
    publisher?: string;
    docType?: string;
    publicationSeries?: string;
}

export const publications: Publication[] = [
    // Best Practices
    {
        id: "bp-001",
        title: "Modern Craftsmanship",
        subtitle: "Integrating Traditional Skills with Digital Tools",
        author: "Sarah Jenkins",
        published: "2024",
        category: "Best Practices",
        price: 29.99,
        pages: 245,
        description: "A comprehensive guide to merging artisanal techniques with modern technology.",
        longDescription: "In an era of rapid digital transformation, 'Modern Craftsmanship' serves as a vital bridge between heritage and innovation. This book explores how traditional artisans can leverage digital fabrication, AI design assistants, and online marketplaces without compromising the soul of their work. Featuring interviews with 50+ successful modern makers.",
        imagePath: "1.png",
        slug: "modern-craftsmanship",
        features: [
            "Learn how to integrate digital tools without losing artisanal soul",
            "Case studies from 50+ successful modern workshops",
            "Guide to sustainable sourcing in a global market",
            "Strategies for digital marketing and storytelling"
        ],
        language: "English",
        formats: ["PDF", "ePub", "Mobi"],
        fileSize: "15 MB",
        tableOfContents: [
            "The Digital Artisan's Toolkit",
            "Preserving Heritage in Code",
            "Sustainable Sourcing 2.0",
            "Global Markets for Local Makers",
            "Case Study: The Smart Loom"
        ]
    },
    {
        id: "bp-002",
        title: "Sustainable Standards",
        subtitle: "Global Frameworks for Ethical Production",
        author: "Dr. Robert Chen",
        published: "2023",
        category: "Best Practices",
        price: 34.99,
        pages: 180,
        description: "Best practices for maintaining sustainability in large-scale craft production.",
        imagePath: "2.png",
        slug: "sustainable-standards-2023",
        features: [
            "Comprehensive framework for ethical production",
            "Waste reduction protocols for large workshops",
            "Certification pathways explained",
            "Supply chain transparency guide"
        ],
        language: "English",
        formats: ["PDF"],
        fileSize: "12 MB",
        tableOfContents: [
            "Defining Ethical Production",
            "Supply Chain Transparency",
            "Waste Reduction Protocols",
            "Certification Pathways",
            "Measuring Impact"
        ]
    },
    {
        id: "bp-003",
        title: "The Workshop Operating System",
        subtitle: "Lean Management for Creative Studios",
        author: "Elena Rodriguez",
        published: "2024",
        category: "Best Practices",
        price: 39.99,
        pages: 310,
        description: "Optimizing workflow and efficiency in creative environments.",
        imagePath: "3.png",
        slug: "workshop-operating-system",
        tableOfContents: [
            "Lean Principles for Artists",
            "Inventory Management for makers",
            "Time Tracking vs. Creative Flow",
            "Scaling Without Losing Quality",
            "Team Culture in the Studio"
        ]
    },
    {
        id: "bp-004",
        title: "Digital Preservation",
        subtitle: "Archiving Intangible Heritage",
        author: "Hiroshi Tanaka",
        published: "2024",
        category: "Best Practices",
        price: 45.00,
        pages: 220,
        description: "Techniques for documenting and digitizing vanishing craft traditions.",
        imagePath: "4.png",
        slug: "digital-preservation-heritage",
        tableOfContents: [
            "The Urgency of Now",
            "3D Scanning Artifacts",
            "Recording Oral Histories",
            "VR Museums",
            "Legal Frameworks for Heritage"
        ]
    },
    {
        id: "bp-005",
        title: "Export Readiness",
        subtitle: "Taking Local Crafts Global",
        author: "Global Trade Board",
        published: "2023",
        category: "Best Practices",
        price: 19.99,
        pages: 150,
        description: "A step-by-step manual for artisans looking to enter international markets.",
        imagePath: "5.png",
        slug: "export-readiness-manual"
    },
    {
        id: "bp-006",
        title: "Safety in the Studio",
        subtitle: "Health and Hazardous Materials Guide",
        author: "Occupational Health Assoc.",
        published: "2024",
        category: "Best Practices",
        price: 24.99,
        pages: 195,
        description: "Essential safety protocols for ceramics, metalwork, and chemical handling.",
        imagePath: "6.png",
        slug: "studio-safety-guide"
    },


    // Case Studies
    {
        id: "cs-001",
        title: "Reviving Silk Routes",
        subtitle: "A Case Study of Central Asian Textiles",
        author: "UNESCO Heritage Team",
        published: "2023",
        category: "Case Studies",
        price: 49.99,
        pages: 310,
        description: "How a cooperative of weavers revitalized ancient patterns for the luxury market.",
        imagePath: "7.png",
        slug: "reviving-silk-routes",
        tableOfContents: [
            "Historical Context",
            "The Cooperative Model",
            "Design Adaptation",
            "Marketing to Paris & Milan",
            "Economic Impact Analysis"
        ]
    },
    {
        id: "cs-002",
        title: "Ceramics of Arita",
        subtitle: "400 Years of Porcelain Innovation",
        author: "Kenji Sato",
        published: "2024",
        category: "Case Studies",
        price: 55.00,
        pages: 280,
        description: "An in-depth look at how Arita ware has adapted to changing global tastes over four centuries.",
        imagePath: "8.png",
        slug: "ceramics-of-arita"
    },
    {
        id: "cs-003",
        title: "The Bamboo Architecture",
        subtitle: "Sustainable Building in Southeast Asia",
        author: "Li Wei",
        published: "2023",
        category: "Case Studies",
        price: 42.00,
        pages: 200,
        description: "Analyzing modern architectural marvels built entirely from treated bamboo.",
        imagePath: "9.png",
        slug: "bamboo-architecture"
    },
    {
        id: "cs-004",
        title: "Urban Blacksmithing",
        subtitle: "Forging in the City",
        author: "Brooklyn Metalworks",
        published: "2024",
        category: "Case Studies",
        price: 28.00,
        pages: 160,
        description: "Success stories of urban forges thriving in high-rent metropolitan areas.",
        imagePath: "10.png",
        slug: "urban-blacksmithing"
    },
    {
        id: "cs-005",
        title: "Nordic Glass",
        subtitle: "Light and Form",
        author: "Erik Johansen",
        published: "2022",
        category: "Case Studies",
        price: 60.00,
        pages: 350,
        description: "A visual journey through the studios of Sweden and Finland's master glassblowers.",
        imagePath: "11.png",
        slug: "nordic-glass"
    },
    {
        id: "cs-006",
        title: "Indigenous Weaving Collective",
        subtitle: "Community Empowerment",
        author: "Maria Gonzalez",
        published: "2024",
        category: "Case Studies",
        price: 32.50,
        pages: 190,
        description: "How a women-led collective in Oaxaca achieved financial independence through textiles.",
        imagePath: "12.png",
        slug: "indigenous-weaving-collective"
    },


    // Research Papers
    {
        id: "rp-001",
        title: "The Economic of Craft",
        subtitle: "Global Market Trends 2025",
        author: "World Craft Council",
        published: "2024",
        category: "Research Papers",
        price: 150.00,
        pages: 80,
        description: "Statistical analysis and projections for the handmade goods sector.",
        imagePath: "13.png",
        slug: "economics-of-craft-2025",
        tableOfContents: [
            "Executive Summary",
            "Regional Growth Charts",
            "Consumer Behavior Shifts",
            "The Rise of 'Slow Living'",
            "Investment Opportunities"
        ]
    },
    {
        id: "rp-002",
        title: "Material Science in Pottery",
        subtitle: "Thermal Dynamics of New Glazes",
        author: "Dr. A. P. Singh",
        published: "2023",
        category: "Research Papers",
        price: 89.00,
        pages: 120,
        description: "Technical research on eco-friendly, energy-efficient glazing techniques.",
        imagePath: "14.png",
        slug: "material-science-pottery"
    },
    {
        id: "rp-003",
        title: "Copyright and Culture",
        subtitle: "Protecting Traditional Knowledge",
        author: "Legal Aid International",
        published: "2024",
        category: "Research Papers",
        price: 110.00,
        pages: 160,
        description: "Legal frameworks for protecting indigenous designs from industrial appropriation.",
        imagePath: "15.png",
        slug: "copyright-culture-law"
    },
    {
        id: "rp-004",
        title: "Automation in Handlooms",
        subtitle: "Impact Assessment",
        author: "Textile Research Institute",
        published: "2023",
        category: "Research Papers",
        price: 75.00,
        pages: 95,
        description: "Assessing the socio-economic impact of semi-automated looms in rural India.",
        imagePath: "16.png",
        slug: "automation-handlooms-impact"
    },
    {
        id: "rp-005",
        title: "Consumer Psychology",
        subtitle: "Why We Buy Handmade",
        author: "Dr. Emily Blunt",
        published: "2024",
        category: "Research Papers",
        price: 99.00,
        pages: 140,
        description: "A psychological study on the value perception of artisanal goods vs. mass production.",
        imagePath: "17.png",
        slug: "consumer-psychology-handmade"
    },
    {
        id: "rp-006",
        title: "Sustainable Dyes",
        subtitle: "Chemical vs Natural Analysis",
        author: "Green Chem Labs",
        published: "2024",
        category: "Research Papers",
        price: 120.00,
        pages: 110,
        description: "Comparative study of colorfastness and environmental impact of natural dyes.",
        imagePath: "18.png",
        slug: "sustainable-dyes-analysis"
    },
];
