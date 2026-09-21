import { ChevronRight } from "lucide-react";

const IntakeSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="bg-[#050A1E] text-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#451d06] border-b border-[#78350f]">
          <h3 className="font-bold text-lg">Quick Links</h3>
        </div>
        <ul className="divide-y divide-[#78350f]/30">
          {[
            "Register as Stakeholder",
            "Verification Process",
            "Post-Approval Benefits",
            "Opportunities Dashboard",
          ].map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center px-4 py-3 hover:bg-[#78350f] transition-colors text-sm font-medium"
              >
                <ChevronRight size={14} className="mr-2 text-[#ca8a04]" />
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Apply Button */}
      <button className="w-full bg-[#ca8a04] hover:bg-[#a16207] text-white py-4 rounded-lg font-bold text-lg shadow-md uppercase tracking-wide transition-colors">
        Apply Online
      </button>

      {/* Resources Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-100 border-b border-slate-200">
          <h3 className="font-bold text-[#050A1E] text-lg">Resources</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          {[
            "Craftlore Global Registry",
            "Constituency GI Information",
            "Compliance & Export Guidelines",
          ].map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
              >
                <ChevronRight size={14} className="mr-2 text-[#050A1E]" />
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IntakeSidebar;
