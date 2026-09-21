import { Filter } from "lucide-react";

const CounterfeitStats = () => {
  return (
    <div className="mb-8">
      {/* Tabs Row REMOVED - Managed by Parent */}

      <div className="bg-slate-50 p-4 border border-slate-200 rounded mb-6 flex items-center justify-between">
        <h2 className="font-bold text-[#050A1E] text-lg">
          Case Reported Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-600">Year:</span>
          <select className="p-1 border border-slate-300 rounded text-sm bg-white">
            <option>2024</option>
          </select>
          <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-4 py-1 rounded text-sm font-bold shadow-sm transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-[#ca8a04] text-white p-6 rounded shadow-sm flex items-center">
          <div className="mr-4 text-5xl font-bold opacity-80">47</div>
          <div>
            <span className="block text-lg font-bold">Counterfeit</span>
            <span className="text-sm font-medium opacity-90">
              Cases Reported
            </span>
          </div>
        </div>

        <div className="flex-1 bg-[#b45309] text-white p-6 rounded shadow-sm flex items-center">
          <div className="mr-4 text-5xl font-bold opacity-80">25</div>
          <div>
            <span className="block text-lg font-bold">Cases</span>
            <span className="text-sm font-medium opacity-90">
              Under Investigation
            </span>
          </div>
        </div>

        <div className="flex-1 bg-[#1e3a8a] text-white p-6 rounded shadow-sm flex items-center">
          <div className="mr-4 text-5xl font-bold opacity-80">14</div>
          <div>
            <span className="block text-lg font-bold">Cases</span>
            <span className="text-sm font-medium opacity-90">
              Closed / Proven
            </span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-slate-100 p-4 rounded mt-6 border border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <span className="font-bold text-[#050A1E] text-lg whitespace-nowrap">
          Filter Counterfeit Alerts
        </span>

        <div className="flex-1 flex gap-4 w-full">
          <select className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-[#050A1E] text-slate-600">
            <option>All</option>
          </select>
          <select className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-[#050A1E] text-slate-600">
            <option>2024</option>
          </select>
        </div>

        <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] font-bold px-6 py-2 rounded shadow-sm transition-colors flex items-center">
          <Filter size={16} className="mr-2" />
          Filter
        </button>
      </div>
    </div>
  );
};

export default CounterfeitStats;
