export interface Certification {
    id: string;
    type: 'Fair Trade' | 'Organic' | 'Environmental' | 'Social' | 'Sustainability' | 'Quality';
    name: string;
    description?: string;
    initialCost: number;
    annualFee: number;
    requirements: string[];
    // properties for compatibility with checkout UI
    imagePath?: string;
    level?: string;
}

export const certifications: Certification[] = [
    {
        id: "fair-trade",
        type: 'Fair Trade',
        name: 'FLO International / SA8000 / ETI Base Code',
        initialCost: 400000,
        annualFee: 200000,
        requirements: ['Fair wages documentation', 'Working conditions compliance', 'Environmental standards'],
        imagePath: "1.png",
        level: "International"
    },
    {
        id: "organic",
        type: 'Organic',
        name: 'GOTS / OEKO-TEX / OCS',
        initialCost: 350000,
        annualFee: 150000,
        requirements: ['Organic material verification', 'Chemical testing', 'Process certification'],
        imagePath: "3.png",
        level: "Standard"
    },
    {
        id: "environmental",
        type: 'Environmental',
        name: 'ISO 14001 / SAN / FSC',
        initialCost: 450000,
        annualFee: 225000,
        requirements: ['Environmental management system', 'Impact assessment', 'Compliance monitoring'],
        imagePath: "4.png",
        level: "Advanced"
    },
    {
        id: "social",
        type: 'Social',
        name: 'SA8000 / Fair for Life',
        initialCost: 350000,
        annualFee: 175000,
        requirements: ['Labor standards compliance', 'Health and safety measures', 'Management systems'],
        imagePath: "5.png",
        level: "Compliance"
    },
    {
        id: "sustainability",
        type: 'Sustainability',
        name: 'Higg Index / RWS / RCS / GRS',
        initialCost: 622500,
        annualFee: 166000,
        requirements: ['Chain of custody', 'Sustainable sourcing', 'Material tracking'],
        imagePath: "6.png",
        level: "Premium"
    },
    {
        id: "quality",
        type: 'Quality',
        name: 'Handloom Mark / Woolmark',
        initialCost: 13000,
        annualFee: 6500,
        requirements: ['Process documentation', 'Artisan verification', 'Quality standards'],
        imagePath: "2.png",
        level: "Essential"
    }
];
