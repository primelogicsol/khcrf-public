import { ChevronRight, Search, ShieldCheck } from "lucide-react";

const CounterfeitSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Quick Links Section */}
      <div className="bg-[#050A1E] text-white rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-[#451d06] border-b border-[#78350f]">
          <h3 className="font-bold text-lg">Quick Links</h3>
        </div>
        <ul className="divide-y divide-[#78350f]/30">
          {["Identify Fake Goods", "Legal Info on Counterfeiting"].map(
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

      {/* Verify GI Mark Search */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex flex-col items-center text-center shadow-sm">
        <h3 className="font-bold text-[#050A1E] mb-3 text-lg">
          Verify GI Mark?
        </h3>

        <div className="w-24 h-24 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-3xl mb-3 border-4 border-[#ca8a04]">
          <ShieldCheck size={40} />
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
        <button className="w-full mt-3 bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] py-2 rounded font-bold text-sm shadow-sm transition-colors uppercase tracking-wide">
          Search
        </button>
      </div>

      {/* Report Alert - Small Sidebar Version */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-[#050A1E] mb-2 border-b border-slate-100 pb-2">
          Report Counterfeit Alerts
        </h3>
        <div className="w-24 h-24 mx-auto rounded-full bg-[#991b1b] text-white flex items-center justify-center font-bold text-3xl mb-3 border-4 border-[#ca8a04]">
          !
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter Product / Location"
            className="w-full p-2 pr-8 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#050A1E]"
          />
          <Search
            size={16}
            className="absolute right-2 top-2.5 text-slate-400"
          />
        </div>
        <button className="w-full mt-3 bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] py-2 rounded font-bold text-sm shadow-sm transition-colors uppercase tracking-wide">
          Search
        </button>
      </div>
    </div>
  );
};

export default CounterfeitSidebar;
