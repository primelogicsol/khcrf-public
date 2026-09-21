import Image from "next/image";

const LobbyHero = () => {
  // Placeholder image URL - user to replace
  const heroImage =
    "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop";

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-[#ca8a04] font-bold text-lg tracking-widest uppercase mb-2">
            Constituency Name
          </h2>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold leading-tight">
            HON. [LEGISLATOR'S NAME]
            <span className="block text-2xl md:text-3xl mt-2 font-light text-slate-200">
              Legislative Constituency Artisan Desk
            </span>
          </h1>
          <p className="max-w-xl text-lg text-slate-200 border-l-4 border-[#ca8a04] pl-4 italic">
            "Strengthening our handicraft economy through policy oversight and
            stakeholder collaboration."
          </p>
          <div className="pt-4 flex items-center space-x-4 text-sm text-[#ca8a04] font-semibold">
            <span>Term: 202X — 202X</span>
            <span>|</span>
            <span>Contact: [Phone Number]</span>
          </div>
        </div>

        {/* Legislator Image - Placeholder */}
        <div className="hidden md:block flex-1 mt-10 md:mt-0 relative">
          <div className="relative w-full max-w-lg ml-auto aspect-4/3 rounded-lg overflow-hidden shadow-2xl border-4 border-white/10">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              alt="Legislator with Artisans"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-sm">Engaging with the community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyHero;
