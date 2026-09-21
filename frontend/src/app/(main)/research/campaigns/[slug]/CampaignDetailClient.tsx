"use client";

import React from "react";
import { notFound } from "next/navigation";
import { CAMPAIGN_TOPICS } from "@/data/campaigns-data";
import CampaignTopicDetail from "@/components/campaigns/CampaignTopicDetail";

interface CampaignDetailClientProps {
    slug: string;
}

export default function CampaignDetailClient({ slug }: CampaignDetailClientProps) {
    const topic = CAMPAIGN_TOPICS.find(t => t.slug === slug); // Changed id to slug to match new interface prop
    if (!topic) notFound();

    return (
        <CampaignTopicDetail
            topic={topic}
            backLink="/research/campaigns"
            backLabel="Back to All Campaigns"
            breadcrumbMiddle="Campaigns"
        />
    );
}
