import { globalStatistics } from "@/config/statistics";

export const calculateGrowthStats = () => {
    // Replaced estimated numbers with 0 as per requirements: "Do not invent or estimate numbers."
    return {
        artisans: globalStatistics.craftArtisans,
        individuals: 0,
        professionals: 0,
        patrons: 0,
        students: 0
    };
};
