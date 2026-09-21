import { Download } from "lucide-react";

const briefs = [
  {
    title: "Raw Material Access & Sustainability",
    desc: "Ensuring stable supply of high-quality raw materials crucial for the handicraft sector's growth and sustainability.",
    image:
      "https://images.unsplash.com/photo-1605634563891-9c1753c23363?q=80&w=2070&auto=format&fit=crop", // Wool/Raw material like
  },
  {
    title: "Strengthening GI Enforcement",
    desc: "Implementation strategies for safeguarding Kashmiri GI crafts against unauthorized use and counterfeiting.",
    image:
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1964&auto=format&fit=crop", // Legal/Official document like
  },
  {
    title: "Enhancing Artisan Credit Access",
    desc: "Supporting artisans access to financial resources and affordable credit for business expansion.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop", // Finance/Banking like
  },
  {
    title: "Export Compliance & Readiness",
    desc: "Policy recommendations for boosting export readiness among local craft producers.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop", // Export/Map like
  },
  {
    title: "Counterfeit Mitigation Measures",
    desc: "Tracking and combating the circulation of fake craft products through strategic measures.",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ce7d02?q=80&w=2070&auto=format&fit=crop", // Security/Shield like
  },
  {
    title: "Skill Development & Youth Continuity",
    desc: "Promoting skill training and continuity of traditional crafts among youth.",
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop", // Training/Youth like
  },
];

const PolicyList = () => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-[#050A1E] border-l-4 border-[#ca8a04] pl-3">
          Craft Policy Briefs
        </h2>
      </div>

      <div className="space-y-4">
        {briefs.map((brief, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-24 h-24 shrink-0 rounded-full border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center p-2">
              {/* Using circular image style as per ref image, or icon if image not available */}
              <img
                src={brief.image}
                alt={brief.title}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-[#050A1E] text-lg mb-1">
                {brief.title}
              </h3>
              <p className="text-slate-600 text-sm">{brief.desc}</p>
            </div>

            <button className="shrink-0 bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors flex items-center">
              <Download size={16} className="mr-2" />
              Download Brief
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyList;
