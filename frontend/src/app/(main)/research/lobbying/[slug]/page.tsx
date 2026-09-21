import { lobbyingTopics } from "@/data/lobbying-data";
import { notFound } from "next/navigation";
import ResearchTopicDetail from "@/components/ResearchTopicDetail";

export const dynamic = "force-dynamic";

export default async function LobbyingTopicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const topic = lobbyingTopics.find((t) => t.slug === slug);

    if (!topic) {
        notFound();
    }

    return (
        <ResearchTopicDetail
            topic={topic}
            backLink="/research/lobbying"
            backLabel="Back to All Lobbying"
            breadcrumbMiddle="Lobbying"
        />
    );
}
