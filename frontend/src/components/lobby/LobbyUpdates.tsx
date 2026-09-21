import { ArrowRight, Calendar } from "lucide-react";

const updates = [
  {
    category: "Cluster Visit",
    date: "March 24, 2024",
    location: "Srinagar",
    title: "Legislator's Visit to Srinagar Pashmina Cluster",
    desc: "Hon. [Legislator's Name] visited the Srinagar Pashmina cluster, held discussions with artisans about raw material challenges and GI compliance.",
    img: "https://images.unsplash.com/photo-1596468138760-705a8f4df849?q=80&w=2070&auto=format&fit=crop", // Carpets/Shawls
    link: "#",
  },
  {
    category: "Policy Note",
    date: "March 15, 2024",
    location: "Legislator's Office",
    title: "Policy Note: Enhancing GI Protection for Kashmir Crafts",
    desc: "A policy brief was issued discussing strategies to strengthen GI enforcement and combat counterfeit products in the craft sector.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop", // Documents
    link: "#",
  },
  {
    category: "Welfare Session",
    date: "March 30, 2024",
    location: "Ganderbal",
    title: "Craft Welfare Awareness Session Scheduled in Ganderbal",
    desc: "A welfare awareness session is organized in Ganderbal to inform artisans about health and financial support schemes.",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?q=80&w=1974&auto=format&fit=crop", // Community / gathering
    link: "#",
  },
];

const LobbyUpdates = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-[#050A1E]">
              Latest Legislative Updates
            </h2>
            <p className="text-slate-500 mt-2">
              Official Public Communications & Verified Updates
            </p>
          </div>
          <a
            href="/lobby/legislative-updates"
            className="hidden md:flex items-center text-[#ca8a04] hover:text-[#050A1E] transition-colors font-semibold"
          >
            View All Updates <ArrowRight size={16} className="ml-2" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {updates.map((update, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={update.img}
                  alt={update.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#ca8a04] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide shadow-sm">
                  {update.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-slate-500 text-xs mb-3 space-x-2">
                  <Calendar size={12} />
                  <span>{update.date}</span>
                  <span>•</span>
                  <span>{update.location}</span>
                </div>
                <h3 className="font-playfair font-bold text-lg text-[#050A1E] mb-3 leading-tight">
                  {update.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 grow">
                  {update.desc}
                </p>
                <a
                  href={update.link}
                  className="inline-block mt-auto text-[#050A1E] font-semibold text-sm hover:underline"
                >
                  Read Report
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <a
            href="/lobby/legislative-updates"
            className="inline-flex items-center text-[#ca8a04] hover:text-[#050A1E] transition-colors font-semibold"
          >
            View All Updates <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LobbyUpdates;
