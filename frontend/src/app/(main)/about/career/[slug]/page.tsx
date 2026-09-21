import { notFound } from "next/navigation";
import JobDetailClient from "./JobDetailClient";
import { Job } from "@/types/career";

async function getJob(slug: string): Promise<Job | null> {
  // 1. Try fetching from API
  if (process.env.NEXT_PUBLIC_API_BASE) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/career/jobs/${slug}`,
        {
          cache: "no-store",
        },
      );
      if (res.ok) {
        return res.json();
      }
    } catch (error) {
      console.error(
        "Failed to fetch job from API, falling back to static data.",
      );
    }
  }

  // 2. Fallback to static data
  try {
    const { jobs } = await import("@/data/jobs");
    const staticJob = jobs.find((j) => j.slug === slug);
    if (staticJob) {
      return {
        ...staticJob,
        postedAt: staticJob.postedDate,
        salaryRange: staticJob.salaryRange,
        // Ensure compatibility
      } as unknown as Job;
    }
  } catch (e) {
    console.error("Failed to load static jobs", e);
  }

  return null;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return notFound();
  }

  return <JobDetailClient job={job} />;
}
