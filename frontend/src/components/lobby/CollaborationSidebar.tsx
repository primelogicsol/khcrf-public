import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";

const CollaborationSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="bg-[#050A1E] text-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#451d06] border-b border-[#78350f]">
          <h3 className="font-bold text-lg">Quick Links</h3>
        </div>
        <ul className="divide-y divide-[#78350f]/30">
          {[
            {
              name: "Register as Stakeholder",
              href: "/lobby/stakeholder-intake",
            },
            { name: "Legislative Updates", href: "/lobby/legislative-updates" },
            { name: "Craft Policy Briefs", href: "/lobby/craft-policy" },
            { name: "GI Protection Tracker", href: "/lobby/gi-tracker" },
          ].map((item, i) => (
            <li key={i}>
              <a
                href={item.href}
                className="flex items-center px-4 py-3 hover:bg-[#78350f] transition-colors text-sm font-medium"
              >
                <ChevronRight size={14} className="mr-2 text-[#ca8a04]" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact The Desk */}
      <div className="bg-[#f8fafc] border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-[#e2e8f0] border-b border-slate-300">
          <h3 className="font-bold text-[#050A1E] text-lg">Contact the Desk</h3>
        </div>

        {/* Placeholder for Map/Image */}
        <div className="h-32 bg-slate-200 flex items-center justify-center border-b border-slate-200 overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1577086663218-615bbcd9e691?q=80&w=1965&auto=format&fit=crop"
            alt="Map"
            className="w-full h-full object-cover opacity-60"
          />
          <MapPin size={32} className="absolute text-[#050A1E]" />
        </div>

        <div className="p-4 space-y-4 text-sm text-slate-600">
          <div className="flex items-start space-x-3">
            <MapPin size={16} className="mt-1 text-[#ca8a04] shrink-0" />
            <span>
              [Office Address]
              <br />
              Civil Secretariat, Srinagar / Jammu
              <br />
              J&K, India
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-[#ca8a04] shrink-0" />
            <span>[Phone Number]</span>
          </div>

          <div className="flex items-center space-x-3">
            <Mail size={16} className="text-[#ca8a04] shrink-0" />
            <span>contact@hcrf-legislator.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationSidebar;
