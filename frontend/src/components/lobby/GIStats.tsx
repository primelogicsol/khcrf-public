const GIStats = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold bg-slate-100 p-4 border-b border-slate-200 text-[#050A1E]">
        GI Products in [Constituency]
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1 bg-[#ca8a04] text-white p-4 rounded shadow-sm flex items-center justify-center text-center">
          <div>
            <span className="block text-3xl font-bold">6</span>
            <span className="text-sm font-medium opacity-90">
              Active GI-Certified Products
            </span>
          </div>
        </div>

        <div className="flex-1 bg-[#b45309] text-white p-4 rounded shadow-sm flex items-center justify-center text-center">
          <div>
            <span className="block text-3xl font-bold">28</span>
            <span className="text-sm font-medium opacity-90">
              GI Producers Mapped
            </span>
          </div>
        </div>

        <div className="flex-1 bg-[#1e1e24] text-white p-4 rounded shadow-sm flex items-center justify-center text-center">
          <div>
            <span className="block text-3xl font-bold">14</span>
            <span className="text-sm font-medium opacity-90">
              Unauthorized Usage Alerts
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="bg-slate-100 p-4 rounded mt-4 border border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <span className="font-bold text-[#050A1E] whitespace-nowrap">
          Search for GI products...
        </span>
        <input
          type="text"
          placeholder="Search for GI products..."
          className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-[#050A1E]"
        />
        <select className="p-2 border border-slate-300 rounded focus:outline-none focus:border-[#050A1E] min-w-[150px]">
          <option>Craft Type: All</option>
        </select>
        <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] font-bold px-6 py-2 rounded shadow-sm transition-colors">
          Search
        </button>
      </div>
    </div>
  );
};

export default GIStats;
