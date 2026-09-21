import { FaDesktop, FaSearchDollar, FaAward } from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";

export default function SubmissionPortalSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <span data-editorial-accent-text className=" font-bold tracking-wider uppercase text-sm mb-2 block">KHCRF VERIFICATION PORTAL</span>
                        <h2 className="text-3xl font-black text-gray-900 mb-6">
                            Verify Your Craft Practice, Business or Institution for Global Trust
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Apply for independent verification of your artisan practice, business, or institution and provide supporting evidence through the secure application process.
                        </p>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <FeatureCard
                                icon={FaDesktop}
                                title="Submit Your Application"
                                description="Complete the online verification form, provide your claims, and upload supporting documentation. Save your progress and return at any time."
                            >
                                <a href="/business-support/evaluation/form" className="text-brand-secondary font-bold text-sm hover:underline mt-4 inline-block">Apply Now &rarr;</a>
                            </FeatureCard>
                            {/* Card 2 */}
                            <FeatureCard
                                icon={FaSearchDollar}
                                title="Independent Verification"
                                description="KHCRF reviews submitted claims, supporting evidence, authenticity and provenance, responsible practices, and other applicable verification factors. Ground verification may be conducted where required."
                            />
                            {/* Card 3 */}
                            <FeatureCard
                                icon={FaAward}
                                title="Verified Findings & Trade Intelligence"
                                description="Once verification is completed, KHCRF records the verified findings. Craftlore independently uses those findings for Performance Trust scoring, rankings, and trade intelligence."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
