export interface Job {
    id: string;
    slug: string;
    jobCode: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salaryRange: string;
    applicantsCount: number;
    status: 'Open' | 'Closed';
    description: string;
    responsibilities: string[];
    requirements: string[];
    postedDate: string;
}

export const jobs: Job[] = [
    {
        id: "1",
        slug: "quality-assurance-engineer",
        jobCode: "CL-2025-015",
        title: "Quality Assurance Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        salaryRange: "$80,000 - $110,000",
        applicantsCount: 0,
        status: "Open",
        description: "<p>Join our engineering team as a Quality Assurance Engineer to ensure our platform delivers reliable, bug-free experiences. You will design test strategies, write automated tests, and work closely with developers to maintain high quality standards.</p>",
        responsibilities: [
            "Design and execute test plans for new features and releases",
            "Write automated tests (unit, integration, end-to-end)",
            "Perform manual testing for complex user flows",
            "Identify, document, and track bugs and issues",
            "Collaborate with developers on test coverage and quality",
            "Implement CI/CD quality gates and monitoring",
            "Advocate for quality best practices across the team"
        ],
        requirements: [
            "3+ years of QA or test automation experience",
            "Strong knowledge of testing methodologies and best practices",
            "Experience with test automation tools (Selenium, Cypress, Playwright)",
            "Programming skills in JavaScript, TypeScript, or Python",
            "Understanding of web technologies and APIs",
            "Attention to detail and analytical mindset",
            "Experience with Agile development processes"
        ],
        postedDate: "2025-01-05"
    },
    {
        id: "2",
        slug: "blockchain-developer",
        jobCode: "CL-2025-011",
        title: "Blockchain Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        salaryRange: "$130,000 - $180,000",
        applicantsCount: 0,
        status: "Open",
        description: "<p>Join our team as a Blockchain Developer to build decentralized solutions for craft authentication and provenance tracking. You will work with smart contracts, NFTs, and blockchain networks to create immutable records of authenticity.</p>",
        responsibilities: [
            "Develop and maintain smart contracts on Ethereum/Polygon",
            "Integrate blockchain solutions with our web platform",
            "Research and implement new blockchain technologies",
            "Ensure security and optimization of smart contracts"
        ],
        requirements: [
            "Strong command of Solidity and Web3.js",
            "Experience with NFT standards (ERC-721, ERC-1155)",
            "Understanding of decentralized storage (IPFS)",
            "Background in cryptography and security"
        ],
        postedDate: "2025-01-02"
    },
    {
        id: "3",
        slug: "community-engagement-specialist",
        jobCode: "CL-2025-012",
        title: "Community Engagement Specialist",
        department: "Operations",
        location: "Remote",
        type: "Part-time",
        salaryRange: "$40,000 - $60,000",
        applicantsCount: 12,
        status: "Open",
        description: "<p>We are looking for a Community Engagement Specialist to nurture our growing community of artisans and supporters.</p>",
        responsibilities: [
            "Manage social media channels and community forums",
            "Organize virtual and in-person events",
            "Respond to community inquiries and feedback",
            "Create engaging content for community updates"
        ],
        requirements: [
            "Experience in community management or social media",
            "Excellent communication and interpersonal skills",
            "Passion for craft heritage and artisan empowerment",
            "Ability to work independently and remotely"
        ],
        postedDate: "2025-01-03"
    },
    {
        id: "4",
        slug: "content-writer",
        jobCode: "CL-2025-013",
        title: "Content Writer",
        department: "Marketing",
        location: "Remote",
        type: "Contract",
        salaryRange: "$30/hr - $50/hr",
        applicantsCount: 5,
        status: "Open",
        description: "<p>We need a talented Content Writer to tell the stories of our artisans and the impact of our work.</p>",
        responsibilities: [
            "Write blog posts, case studies, and newsletters",
            "Interview artisans and craft leaders",
            "Collaborate with the design team on visual storytelling",
            "Edit and proofread content for clarity and tone"
        ],
        requirements: [
            "Proven experience as a content writer or copywriter",
            "Strong portfolio of published work",
            "Excellent storytelling and writing skills",
            "Knowledge of SEO best practices"
        ],
        postedDate: "2025-01-04"
    },
    {
        id: "5",
        slug: "community-manager",
        jobCode: "CL-2024-089",
        title: "Community Manager",
        department: "Operations",
        location: "On-site (Srinagar)",
        type: "Full-time",
        salaryRange: "$50,000 - $70,000",
        applicantsCount: 45,
        status: "Closed",
        description: "<p>Help us build and nurture our community of artisans in Kashmir. This role requires someone based in Srinagar who can work closely with artisan clusters, provide training, and serve as the bridge between our platform and the makers.</p>",
        responsibilities: [
            "Onboard new artisan groups",
            "Conduct training workshops",
            "Facilitate feedback loops"
        ],
        requirements: [
            "Local networking skills",
            "Fluency in Kashmiri and English",
            "Project management experience"
        ],
        postedDate: "2024-11-15"
    }
];
