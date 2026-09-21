import { getBaseUrl, getBaseUrlNoApi } from "@/lib/api";
import { Suspense } from "react";
import { Metadata } from "next";
import PublicationList from "@/components/publications/PublicationList";
import ContributorCTA from "@/components/publications/ContributorCTA";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { publicationsKnowledgeBooksHeroFallback } from "@/config/heroFallbacks";
import api from "@/lib/api";
import {
  FaShieldAlt,
  FaBookOpen,
  FaChartLine,
  FaUsers,
  FaFileContract,
  FaBookmark,
} from "react-icons/fa";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Knowledge Books & E-Publications | KHCRF Knowledge Hub",
  description: "Global Reference Reference Library for Kashmir Handicrafts. Access peer-reviewed papers, case audits, policy briefs, and market intelligence on Pashmina, Kani, and handloom traditions.",
};

// Helper to fetch publications using next.js cached fetch
async function getPublications() {
  const API_BASE = getBaseUrl();
  try {
    const res = await fetch(`${API_BASE}/publications`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("Error fetching publications:", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching publications:", error);
    return [];
  }
}

// Helper to fetch categories using next.js cached fetch
async function getCategories() {
  const API_BASE = getBaseUrl();
  try {
    const res = await fetch(`${API_BASE}/publications/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("Error fetching categories:", res.status);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function PublicationsCategoryPage() {
  // Parallel data fetching
  const [publications, categories] = await Promise.all([
    getPublications(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <main className="grow">
        <UniversalEditorialHero pageKey="knowledge-books" fallbackConfig={publicationsKnowledgeBooksHeroFallback as any} />

        {/* Authority Strip Below Hero */}
        <section className="bg-white py-12 border-b border-gray-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <span data-editorial-accent-text className="text-xs font-bold  uppercase tracking-widest block mb-2">
                Knowledge Authority System
              </span>
              <p className="text-sm font-medium text-gray-600">
                Built for global buyers, researchers, policymakers, museums, certification bodies, exporters, and artisans.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                {
                  title: "Authentication",
                  desc: "Science & standards",
                  icon: <FaShieldAlt data-ui-icon  className=" text-xl" />,
                },
                {
                  title: "Scholarly Research",
                  desc: "Peer-reviewed insights",
                  icon: <FaBookOpen data-ui-icon  className=" text-xl" />,
                },
                {
                  title: "Market Intelligence",
                  desc: "Export & consumer trends",
                  icon: <FaChartLine data-ui-icon  className=" text-xl" />,
                },
                {
                  title: "Artisan Livelihoods",
                  desc: "Fair trade & cooperative growth",
                  icon: <FaUsers data-ui-icon  className=" text-xl" />,
                },
                {
                  title: "Policy Guidance",
                  desc: "Legislative briefs & actions",
                  icon: <FaFileContract data-ui-icon  className=" text-xl" />,
                },
                {
                  title: "GI Protection",
                  desc: "Geographical indicators",
                  icon: <FaBookmark data-ui-icon  className=" text-xl" />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow"
                >
                  <div className="mb-2.5 p-2.5 bg-white rounded-lg shadow-2xs">
                    {item.icon}
                  </div>
                  <h4 className="text-xs font-bold text-brand-dark mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Listing Component */}
        <section className="py-16">
          <Suspense
            fallback={
              <div className="text-center py-20 text-gray-400">
                Loading publications library...
              </div>
            }
          >
            <PublicationList
              initialPublications={publications}
              categories={categories}
              defaultCategory="E-Publications"
            />
          </Suspense>
        </section>

        {/* Contributor CTA */}
        <ContributorCTA />
      </main>
    </div>
  );
}
