import os

filepath = '../controllers/partnerController.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

new_func = '''
export const getPartnerStats = async (req: Request, res: Response) => {
    try {
        const partners = await prisma.partnerApplication.findMany({
            where: {
                status: { in: ['ACTIVE', 'APPROVED'] },
                publicVisibility: 'PUBLIC',
                countInGlobalReach: true,
                isTestRecord: false,
                globalReachCategory: { not: null }
            }
        });

        // Initialize counters based on globalStatistics keys mapped
        const counts: Record<string, number> = {
            governmentAgencies: 0,
            internationalNGOs: 0,
            corporatePartners: 0,
            tradeOrganizations: 0,
            culturalInstitutions: 0,
            technologyLeaders: 0,
            ethicalTradeOrganizations: 0,
            academicInstitutions: 0,
            policyThinkTanks: 0
        };

        const mapCatToKey: Record<string, string> = {
            "Government Agencies": "governmentAgencies",
            "International NGOs": "internationalNGOs",
            "Corporate Partners": "corporatePartners",
            "Trade Organizations": "tradeOrganizations",
            "Cultural Institutions": "culturalInstitutions",
            "Technology Leaders": "technologyLeaders",
            "Ethical Trade Orgs": "ethicalTradeOrganizations",
            "Academic Institutions": "academicInstitutions",
            "Policy Think Tanks": "policyThinkTanks"
        };

        for (const p of partners) {
            if (p.globalReachCategory && mapCatToKey[p.globalReachCategory]) {
                counts[mapCatToKey[p.globalReachCategory]]++;
            }
        }

        const statsArray = [
            { icon: "FaBuilding", count: counts.governmentAgencies, label: "Government Agencies" },
            { icon: "FaGlobe", count: counts.internationalNGOs, label: "International NGOs" },
            { icon: "FaHandshake", count: counts.corporatePartners, label: "Corporate Partners" },
            { icon: "FaExchangeAlt", count: counts.tradeOrganizations, label: "Trade Organizations" },
            { icon: "FaLandmark", count: counts.culturalInstitutions, label: "Cultural Institutions" },
            { icon: "FaMicrochip", count: counts.technologyLeaders, label: "Technology Leaders" },
            { icon: "FaLeaf", count: counts.ethicalTradeOrganizations, label: "Ethical Trade Orgs" },
            { icon: "FaUniversity", count: counts.academicInstitutions, label: "Academic Institutions" },
            { icon: "FaBrain", count: counts.policyThinkTanks, label: "Policy Think Tanks" }
        ];

        res.json(statsArray);
    } catch (error) {
        console.error("Get Partner Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch partner stats" });
    }
};
'''

content += new_func

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added getPartnerStats")
