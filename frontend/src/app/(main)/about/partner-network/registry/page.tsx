import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import RegistryClient from "./RegistryClient";
import CommonCta from "@/components/common/CommonCta";
import SubmissionPortalSection from "@/components/SubmissionPortalSection";

export const metadata = {
    title: "Collaboration Registry | KHCRF",
    description: "A transparent record of our partnerships and collaborations across the KHCRF ecosystem.",
};

export default async function RegistryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const sp = await searchParams;
    const initialCollection = (sp.collection as string) || "All";

    return (
        <main className="min-h-screen bg-gray-50">
            <UniversalEditorialHero 
                pageKey="partner-network-registry" 
                fallbackConfig={{
                  id: 'partner-registry-hero-fallback',
                  pageKey: 'partner-network-registry',
                  autoplayEnabled: true,
                  autoplayIntervalMs: 6000,
                  slides: [
                    {
                      id: 'partner-registry-slide-1',
                      internalName: 'Official Collaborations',
                      eyebrow: 'OFFICIAL REGISTRY',
                      titleLineOne: 'GLOBAL & LOCAL',
                      titleConnector: 'network of',
                      titleLineTwo: 'COLLABORATORS',
                      description: 'Access the definitive registry of institutional, governmental, corporate, and cultural partners working alongside KHCRF to empower the Kashmir craft ecosystem.',
                      primaryCtaLabel: 'Browse Registry',
                      primaryCtaUrl: '#registry',
                      secondaryCtaLabel: 'Become a Partner',
                      secondaryCtaUrl: '/about/partner-network/join',
                      tertiaryLinkLabel: 'Our Network',
                      tertiaryLinkUrl: '/about/partner-network',
                      meta1: 'Alliances',
                      meta2: 'Impact',
                      meta3: 'Growth',
                      meta4: 'Registry'
                    },
                    {
                      id: 'partner-registry-slide-2',
                      internalName: 'Strategic Impact',
                      eyebrow: 'STRATEGIC IMPACT',
                      titleLineOne: 'SYNERGIZING',
                      titleConnector: 'efforts for',
                      titleLineTwo: 'SUSTAINABLE CHANGE',
                      description: 'Explore active collaborations focusing on policy reform, artisan welfare, and heritage preservation. See how our partners contribute to tangible outcomes.',
                      primaryCtaLabel: 'Apply for Partnership',
                      primaryCtaUrl: '/about/partner-network/join',
                      secondaryCtaLabel: 'Search Directory',
                      secondaryCtaUrl: '#registry',
                      tertiaryLinkLabel: 'Shared Principles',
                      tertiaryLinkUrl: '/about/shared-principle',
                      meta1: 'Strategy',
                      meta2: 'Policy',
                      meta3: 'Preservation',
                      meta4: 'Action'
                    },
                    {
                      id: 'partner-registry-slide-3',
                      internalName: 'Transparent Ecosystem',
                      eyebrow: 'TRANSPARENT ECOSYSTEM',
                      titleLineOne: 'BUILDING',
                      titleConnector: 'a foundation of',
                      titleLineTwo: 'MUTUAL TRUST',
                      description: 'A transparent public record detailing the areas of engagement and collaboration status with each partner organization within our ecosystem.',
                      primaryCtaLabel: 'Learn More',
                      primaryCtaUrl: '/about/partner-network',
                      secondaryCtaLabel: 'View Partners',
                      secondaryCtaUrl: '#registry',
                      tertiaryLinkLabel: 'Projects',
                      tertiaryLinkUrl: '/about/hcrf-project',
                      meta1: 'Trust',
                      meta2: 'Transparency',
                      meta3: 'Public Record',
                      meta4: 'Network'
                    },
                    {
                      id: 'partner-registry-slide-4',
                      internalName: 'Join the Movement',
                      eyebrow: 'JOIN THE MOVEMENT',
                      titleLineOne: 'AMPLIFYING',
                      titleConnector: 'the voices of',
                      titleLineTwo: 'MASTER ARTISANS',
                      description: 'We welcome organizations sharing our vision for ethical commerce, fair wages, and the protection of Kashmir\'s Geographical Indications to join our growing network.',
                      primaryCtaLabel: 'Submit Application',
                      primaryCtaUrl: '/about/partner-network/join',
                      secondaryCtaLabel: 'Read Case Studies',
                      secondaryCtaUrl: '/publications',
                      tertiaryLinkLabel: 'About KHCRF',
                      tertiaryLinkUrl: '/about/mission',
                      meta1: 'Movement',
                      meta2: 'Advocacy',
                      meta3: 'Wages',
                      meta4: 'GI Tags'
                    }
                  ]
            }} />

            <section className="py-20" id="registry">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Link
                        href="/about/partner-network"
                        className="inline-flex items-center text-gray-500 hover:text-brand-primary mb-8 transition-colors text-sm font-bold uppercase tracking-wider group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Partner Network
                    </Link>
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-brand-dark mb-4">KHCRF Partner Registry</h2>
                        <p className="text-gray-600 max-w-2xl">
                            Browse through our detailed records of organizational engagements. Use the filters below to narrow down by collection, ecosystem or collaboration type or search for specific partners.
                        </p>
                    </div>

                    <RegistryClient key={initialCollection} initialCollection={initialCollection} />
                </div>
            </section>

            <SubmissionPortalSection />
            <CommonCta
                title={{ firstPart: "Ready to", highlightedPart: "Collaborate?" }}
                description="Join our network of organizations making a lasting impact on Kashmir's craft heritage."
                primaryAction={{
                    label: "Apply for Partnership",
                    href: "/about/partner-network/join"
                }}
            />
        </main>
    );
}
