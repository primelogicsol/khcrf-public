import { FileText, BarChart, ShieldCheck, AlertTriangle } from "lucide-react";

const highlights = [
  {
    title: "Craft Policy Briefs",
    desc: "Detailed briefs on raw material access, GI enforcement, credit access, and counterfeit mitigation.",
    icon: <FileText data-ui-icon  size={48} className="" />,
    iconBg: "bg-[#fef3c7]", // Amber-100
    action: "Explore",
  },
  {
    title: "Annual Craft Sector Report",
    desc: "Yearly report showcasing artisan mapping, export data, counterfeit cases, and policy impact analysis.",
    icon: <BarChart size={48} className="text-[#050A1E]" />,
    iconBg: "bg-[#e0e7ff]", // Indigo-100
    action: "Explore",
  },
  {
    title: "GI Protection Tracker",
    desc: "Live dashboard tracking GI registrations, unauthorized usage alerts, and enforcement actions.",
    icon: <ShieldCheck size={48} className="text-[#166534]" />,
    iconBg: "bg-[#dcfce7]", // Green-100
    action: "Explore",
  },
  {
    title: "Counterfeit Alert System",
    desc: "Report fake handicrafts, track enforcement status, and district-wise counterfeit mapping.",
    icon: <AlertTriangle size={48} className="text-[#ca8a04]" />,
    iconBg: "bg-[#fee2e2]", // Red-100
    action: "Explore",
  },
];

const PolicyHighlights = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-8">
        <span className="w-8 h-1 bg-[#ca8a04] mr-3"></span>
        <h2 className="text-2xl font-playfair font-bold text-[#050A1E]">
          Craft Policy Briefs
        </h2>
        <span className="grow h-px bg-slate-200 ml-3"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className={`mb-4 p-4 rounded-full ${item.iconBg}`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-[#050A1E] text-lg mb-3 leading-tight font-playfair">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm mb-6 grow">{item.desc}</p>
            <button className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors">
              {/* Note: In image buttons are dark blue. We can stick to standard brand primary #050A1E or use the dark blue #1e3a8a (brand dark-ish) from the old palette if we consider it an accent. 
                            Let's align with the new theme #050A1E. */}
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyHighlights;
