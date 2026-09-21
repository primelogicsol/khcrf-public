import { ADVOCACY_TOPICS } from "@/data/advocacy-data";
import { notFound } from "next/navigation";
import ResearchTopicDetail from "@/components/ResearchTopicDetail";
import { AdvocacyActionHub, AdvocacyFooter } from "@/components/research/AdvocacyEngagementBlocks";

export const dynamic = "force-dynamic";

export default async function AdvocacyTopicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const topic = ADVOCACY_TOPICS.find((t) => t.slug === slug);

    if (!topic) {
        notFound();
    }

    return (
        <ResearchTopicDetail
            topic={topic}
            backLink="/research/advocacy"
            backLabel="Back to All Advocacy"
            breadcrumbMiddle="Advocacy"
        >
            <AdvocacyActionHub topicSlug={slug} />
            <AdvocacyFooter topicSlug={slug} />
        </ResearchTopicDetail>
    );
}
