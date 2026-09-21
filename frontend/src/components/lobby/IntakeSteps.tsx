import { Users, Globe, ShieldCheck, LayoutDashboard } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Fill the Stakeholder Intake Form",
    desc: "Provide details about your craft, organization, certification, and products.",
    icon: null,
  },
  {
    number: 2,
    title: "Verification & Cluster Mapping",
    desc: "Our team will verify your information and map you with relevant craft clusters and GI registrations.",
    icon: <Users className="text-[#050A1E]" size={24} />,
    image:
      "https://images.unsplash.com/photo-1573869557438-e6d23469c462?q=80&w=2070&auto=format&fit=crop",
  },
  {
    number: 3,
    title: "Global Registry & B2B Enablement",
    desc: "Upon approval, get listed on Craftlore and access B2B & export opportunities.",
    icon: <Globe className="text-[#050A1E]" size={24} />,
    action: "Read More",
  },
  {
    number: 4,
    title: "Dashboard for Updates & Benefits",
    desc: "Track your registration status, access exclusive benefits and policy-linked opportunities.",
    icon: <LayoutDashboard className="text-[#050A1E]" size={24} />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
];

const IntakeSteps = () => {
  return (
    <div>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
        <h3 className="font-playfair font-bold text-xl text-[#050A1E] mb-4">
          Steps to Register with the CCSI Desk
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          The Constituency Craft & Stakeholder Intake (CCSI Desk) connects local
          artisans, cooperatives, exporters, and institutions with global craft
          platforms through a structured intake and verification process.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="font-playfair font-bold text-xl text-[#050A1E] mb-4 pl-2 border-l-4 border-[#ca8a04]">
          Steps to Register with the CCSI Desk
        </h3>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex gap-4">
              {/* Step Number */}
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#fcd34d] flex items-center justify-center text-[#78350f] font-bold text-lg shadow-sm">
                  {step.number}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-lg text-[#050A1E] mb-1">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-sm mb-4">{step.desc}</p>

                {(step.action || step.image) && (
                  <div className="flex justify-between items-end mt-2">
                    {step.action && (
                      <button className="bg-[#fcd34d] text-[#78350f] text-xs font-bold px-4 py-2 rounded shadow-sm hover:bg-[#fbbf24] transition-colors">
                        {step.action}
                      </button>
                    )}
                    {step.image && (
                      <div className="w-32 h-20 rounded border border-slate-200 overflow-hidden ml-auto">
                        <img
                          src={step.image}
                          alt="Step Visual"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntakeSteps;
