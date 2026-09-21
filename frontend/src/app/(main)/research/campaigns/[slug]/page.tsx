
import React from "react";
import CampaignDetailClient from "./CampaignDetailClient";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Next.js 15+ params are async
export default async function CampaignDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    return <CampaignDetailClient slug={resolvedParams.slug} />;
}
