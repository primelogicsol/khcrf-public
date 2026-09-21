import React from "react";
import JoinCampaignClient from "./JoinCampaignClient";

export default async function JoinCampaignPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const type = searchParams.type || "supporter";

  return <JoinCampaignClient slug={slug} initialType={type} />;
}
