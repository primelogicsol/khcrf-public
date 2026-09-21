import { Search, FileText, Scale, Users } from "lucide-react";

const CollaborationPrinciples = () => {
  const principles = [
    {
      title: "Transparency",
      desc: "Trusted and verified information made public.",
      icon: <Search size={28} className="text-white" />,
      gradient: "bg-gradient-to-br from-[#ca8a04] to-[#a16207]",
    },
    {
      title: "Accountability",
      desc: "Documentation of actions and outcomes.",
      icon: <FileText size={28} className="text-white" />,
      gradient: "bg-gradient-to-br from-[#d97706] to-[#b45309]",
    },
    {
      title: "Neutrality",
      desc: "Non-partisan, development focused approach.",
      icon: <Scale size={28} className="text-white" />,
      gradient: "bg-gradient-to-br from-[#b45309] to-[#92400e]",
    },
    {
      title: "Empowerment",
      desc: "Direct support for craft community development.",
      icon: <Users size={28} className="text-white" />,
      gradient: "bg-gradient-to-br from-[#d97706] to-[#b45309]",
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center">
          <h2 className="text-2xl font-playfair font-bold text-[#1e3a8a] bg-slate-50 px-4">
            Key Principles of this Initiative
          </h2>
        </div>
        <p className="text-sm text-slate-500 mt-4 max-w-2xl mx-auto">
          Report, existglats tnuize mitigation, handicrafts, exporters, training
          bodies, and craft startups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {principles.map((item, idx) => (
          <div
            key={idx}
            className={`${item.gradient} rounded-lg p-6 flex flex-col items-start shadow-md text-white h-full`}
          >
            <div className="bg-white/20 p-2 rounded-lg mb-4 backdrop-blur-sm">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-white/90 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationPrinciples;
