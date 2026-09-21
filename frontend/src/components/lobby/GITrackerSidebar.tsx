import { ChevronRight, Search } from "lucide-react";

const GITrackerSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="bg-[#050A1E] text-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#451d06] border-b border-[#78350f]">
          <h3 className="font-bold text-lg">Quick Links</h3>
        </div>
        <ul className="divide-y divide-[#78350f]/30">
          {["Reported Violations", "GI Education", "Compliance Guidelines"].map(
            (item, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 hover:bg-[#78350f] transition-colors text-sm font-medium"
                >
                  <ChevronRight size={14} className="mr-2 text-[#ca8a04]" />
                  {item}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* Report Button */}
      <button className="w-full bg-[#ca8a04] hover:bg-[#a16207] text-white py-4 rounded-lg font-bold text-lg shadow-md uppercase tracking-wide transition-colors">
        Report GI Violation
      </button>

      {/* Resources Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-100 border-b border-slate-200">
          <h3 className="font-bold text-[#050A1E] text-lg">Resources</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          {[
            "GI Verification Tutorial",
            "Global Craftlore Directory",
            "Counterfeit Alert System",
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

      {/* GI Verification Badge Img Substitute */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm">
        <div className="w-24 h-24 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-3xl mb-3 border-4 border-[#ca8a04]">
          GI
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter GI Number..."
            className="w-full p-2 pr-8 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#050A1E]"
          />
          <Search
            size={16}
            className="absolute right-2 top-2.5 text-slate-400"
          />
        </div>
        <button className="w-full mt-3 bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] py-2 rounded font-bold text-sm shadow-sm">
          Search
        </button>
      </div>
    </div>
  );
};

export default GITrackerSidebar;
