import { ChevronRight, Filter } from "lucide-react";

const PolicySidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="bg-[#050A1E] text-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#451d06] border-b border-[#78350f]">
          <h3 className="font-bold text-lg">Quick Links</h3>
        </div>
        <ul className="divide-y divide-[#78350f]/30">
          {[
            "Craft Policy Briefs",
            "Annual Report",
            "GI Tracker",
            "Counterfeit Alert",
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

      {/* Filter Section */}
      <div className="bg-[#f0f9ff] rounded-lg overflow-hidden shadow-sm border border-slate-200">
        <div className="bg-[#e0e7ff] p-4 flex items-center justify-between border-b border-slate-200">
          <h3 className="font-bold text-[#050A1E] text-lg">
            Filter Policy Briefs
          </h3>
        </div>
        <div className="p-4 space-y-4 bg-slate-50">
          <div>
            <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
              <option>By Category</option>
            </select>
          </div>
          <div>
            <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
              <option>All</option>
            </select>
          </div>
          <div>
            <select className="w-full p-2 border border-slate-300 rounded text-sm text-slate-600 focus:outline-none focus:border-[#050A1E]">
              <option>Year: 2024 (All)</option>
            </select>
          </div>

          <button className="w-full bg-[#050A1E] hover:bg-[#451d06] text-white py-2 rounded font-bold text-sm transition-colors cursor-pointer flex justify-center items-center shadow-sm">
            <Filter size={14} className="mr-2" /> Filter
          </button>
        </div>
      </div>

      {/* More Resources Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-100 border-b border-slate-200">
          <h3 className="font-bold text-[#050A1E] text-lg">More Resources</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          {[
            "Legislative Updates Archive",
            "GI Compliance Guide",
            "Craftlore Global Registry",
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

export default PolicySidebar;
