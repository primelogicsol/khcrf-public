import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function ContributorCTA() {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Images */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-transform duration-500">
              <Image
                src="/assets/images/craft_contributor_real.png"
                alt="Kashmir Craft Industry"
                width={800}
                height={600}
                className="w-full h-full object-cover "
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-brand-primary/20 rounded-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-secondary/10 rounded-full blur-2xl" />
          </div>

          {/* Right: Content */}
          <div>
            <div className="mb-6">
              <span className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                KNOWLEDGE SYSTEM COLLABORATION
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark leading-tight tracking-tight mb-6">
                Contribute to the Kashmir Craft Knowledge System
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                KHCRF invites researchers, artisans, exporters, institutions, policy experts, documentation specialists, and field practitioners to contribute verified knowledge to the Kashmir handicraft sector.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contributions may include:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Best practice notes",
                  "Field case studies",
                  "Research papers",
                  "Market intelligence",
                  "Technical documentation",
                  "Policy recommendations",
                  "Craft cluster reports",
                  "Industry Briefs"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <FaCheckCircle data-ui-icon  className=" text-base shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-brand-dark mb-1">
                Start Collaborating Today
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/publications/intake?role=contributor"
                  className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-brand-primary/10"
                >
                  Apply as Knowledge Contributor
                </Link>
                <Link
                  href="/publications/track"
                  className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Track Submission
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
