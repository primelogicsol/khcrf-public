export const CERTIFICATION_QUESTIONS = [
    {
        id: 'provenanceTraceability',
        section: 'Section 1: Provenance & Traceability',
        question: 'Do you bear transparent records of your material sourcing and supply chain?',
        options: [
            { value: 1, label: 'No records maintained' },
            { value: 1, label: 'Informal notes only' },
            { value: 1, label: 'Basic invoices filed physically' },
            { value: 2, label: 'Digital records of all suppliers' },
            { value: 5, label: 'Full blockchain/digital traceability from source to shelf' },
        ],
    },
    {
        id: 'qualitySystems',
        section: 'Section 2: Quality Control Systems',
        question: 'Is there a formal quality control process documented for your production?',
        options: [
            { value: 1, label: 'No formal process' },
            { value: 1, label: 'Ad-hoc checks by artisans' },
            { value: 1, label: 'Final product inspection only' },
            { value: 2, label: 'Documented checks at key production stages' },
            { value: 5, label: 'ISO/Standardized QMS with independent audits' },
        ],
    },
    {
        id: 'environmentalCompliance',
        section: 'Section 3: Environmental Compliance',
        question: 'Does your production adhere to environmental protection standards?',
        options: [
            { value: 1, label: 'Ad-hoc checks by artisans' },
            { value: 1, label: 'Basic waste disposal only' },
            { value: 1, label: 'Compliant with local municipal rules' },
            { value: 2, label: 'Active waste reduction and recycling programs' },
            { value: 5, label: 'Zero-discharge / Organic Certified process' },
        ],
    },
    {
        id: 'operationalStandardization',
        section: 'Section 4: Operational Standardization',
        question: 'Are your operating procedures (SOPs) standardized and documented?',
        options: [
            { value: 1, label: 'Procedures are verbal/informal' },
            { value: 1, label: 'Some written guidelines exist' },
            { value: 1, label: 'Key processes are documented' },
            { value: 2, label: 'Comprehensive SOP manual available to staff' },
            { value: 5, label: 'Regularly updated SOPs with staff training logs' },
        ]
    },
    {
        id: 'socialCompliance',
        section: 'Section 5: Social Compliance & Safety',
        question: 'Do you meet labor safety and fair wage standards?',
        options: [
            { value: 1, label: 'No specific policies' },
            { value: 1, label: 'Minimum legal wage paid' },
            { value: 1, label: 'Basic safety gear provided' },
            { value: 2, label: 'Health insurance and strict safety protocols' },
            { value: 5, label: 'SA8000/Fair Trade certified working conditions' },
        ]
    }
];
