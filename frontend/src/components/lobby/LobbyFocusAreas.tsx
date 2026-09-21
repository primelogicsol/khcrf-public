import { Shield, Truck, Stamp, AlertTriangle } from "lucide-react";

const focusAreas = [
  {
    title: "GI Protection & Enforcement",
    icon: <Stamp className="h-10 w-10 text-white" />,
    img: "https://images.unsplash.com/photo-1606744888639-65239a2d3c59?q=80&w=2070&auto=format&fit=crop", // Seal/Stamp metaphor
    desc: "Safeguarding authenticity through strict GI enforcement.",
  },
  {
    title: "Raw Material Access",
    icon: <Truck className="h-10 w-10 text-white" />,
    img: "https://images.unsplash.com/photo-1590735234125-63026b911b33?q=80&w=2070&auto=format&fit=crop", // Raw materials/Wool
    desc: "Ensuring steady supply of quality raw materials.",
  },
  {
    title: "Skill Development & Training",
    icon: <Shield className="h-10 w-10 text-white" />,
    img: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1964&auto=format&fit=crop", // Hands working
    desc: "Empowering artisans with modern skills and techniques.",
  },
  {
    title: "Counterfeit Prevention",
    icon: <AlertTriangle className="h-10 w-10 text-white" />,
    img: "https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=2070&auto=format&fit=crop", // Security/Protection
    desc: "Zero tolerance for fake goods flooding the market.",
  },
];

const LobbyFocusAreas = () => {
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-10">
          <span className="w-12 h-1 bg-[#ca8a04] mr-4"></span>
          <h2 className="text-3xl font-playfair font-bold text-[#050A1E]">
            Key Focus Areas
          </h2>
          <span className="grow h-px bg-slate-300 ml-4"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-64"
            >
              {/* Background Image */}
              <img
                src={area.img}
                alt={area.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
                <div className="mb-2 bg-[#ca8a04] w-fit p-2 rounded-full shadow-lg">
                  {area.icon}
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  {area.title}
                </h3>
                <p className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {area.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LobbyFocusAreas;
