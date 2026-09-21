import type { Metadata } from "next";
import ArtisanProfileClient from "./ArtisanProfileClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <ArtisanProfileClient params={params} />;
}
