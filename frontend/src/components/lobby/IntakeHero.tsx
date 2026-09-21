import { FileText } from "lucide-react";

const IntakeHero = () => {
  // Placeholder image URL
  const heroImage =
    "https://images.unsplash.com/photo-1590735214064-0f8c3c22b9b5?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="relative bg-[#050A1E] text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src={heroImage}
          alt="Artisan background"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#050A1E] via-[#050A1E]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold leading-tight">
            Constituency Craft & Stakeholder Intake
            <span className="flex items-center text-xl md:text-2xl mt-4 font-light text-slate-200">
              <FileText className="mr-2" size={28} />
              CCSI Desk <span className="mx-2 text-slate-400">|</span>
              <span className="text-lg italic text-slate-300">
                Connecting Constituency Artisans & Enterprises
              </span>
            </span>
          </h1>
          <p className="max-w-xl text-lg text-slate-200 italic pt-2">
            "Connecting Constituency Artisans & Enterprises to Global Craft
            Platforms"
          </p>
          <div className="pt-4 flex items-center space-x-4 text-sm text-[#ca8a04] font-semibold">
            <span>Term: 202X — 202X</span>
            <span>|</span>
            <span>Contact: [Phone Number]</span>
          </div>
        </div>

        {/* Legislator Image - Placeholder */}
        <div className="hidden md:block flex-1 mt-8 md:mt-0 relative">
          <div className="relative w-full max-w-md ml-auto aspect-4/3 rounded-lg overflow-hidden shadow-2xl border-4 border-white/10">
            <img
              src="https://images.unsplash.com/photo-1552345376-749c9519c235?q=80&w=2074&auto=format&fit=crop"
              alt="Legislator with Stakeholders"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeHero;
