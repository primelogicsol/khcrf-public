import { ClipboardList, Users, ShieldCheck, Award } from "lucide-react";

const benefits = [
  {
    title: "Craftlore Global Registry",
    desc: "Listing in craftlore.org for global visibility.",
    icon: <ClipboardList size={40} className="text-[#ca8a04]" />,
    action: "Register Online",
    primary: true,
  },
  {
    title: "B2B Export Channels",
    desc: "Connect with institutional and commercial buyers.",
    icon: <Users size={40} className="text-[#050A1E]" />,
    action: "Apply Online",
    primary: true,
  },
  {
    title: "Compliance Guidance",
    desc: "Assistance with GI compliance and export regulations.",
    icon: <ShieldCheck size={40} className="text-[#ca8a04]" />,
    action: "Apply Now",
    primary: true,
  },
  {
    title: "Craft Development Schemes",
    desc: "Access to government welfare programs and training schemes.",
    icon: <Award size={40} className="text-[#050A1E]" />,
    action: "Read More",
    primary: true,
  },
];

const IntakeBenefits = () => {
  return (
    <div className="py-12 border-t border-slate-200 mt-12">
      <div className="flex items-center mb-8">
        <span className="w-8 h-1 bg-[#ca8a04] mr-3"></span>
        <h2 className="text-2xl font-playfair font-bold text-[#050A1E]">
          Verification & Global Opportunities
        </h2>
        <span className="grow h-px bg-slate-200 ml-3"></span>
      </div>

      <p className="text-slate-600 mb-8 max-w-3xl">
        We ensure that all registered stakeholders undergo a thorough{" "}
        <span className="font-bold text-slate-800">verification</span> process
        for authenticity and compliance. Once verified, stakeholders gain access
        to:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center text-center"
          >
            <div className="mb-4 p-3 bg-slate-50 rounded-full">
              {benefit.icon}
            </div>
            <h3 className="font-bold text-[#050A1E] mb-2">{benefit.title}</h3>
            <p className="text-slate-500 text-sm mb-6 grow">{benefit.desc}</p>
            <button
              className={`w-full py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors ${benefit.primary ? "bg-[#1e3a8a] hover:bg-[#172554] text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-700"}`}
            >
              {/* Note: In image buttons are dark blue. Changing to Brand Dark/Primary? 
                           The image has dark blue buttons. Let's use Brand Dark #050a1e for consistency with the new theme. */}
              {benefit.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntakeBenefits;
