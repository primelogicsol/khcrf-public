const GIDashboardInfo = () => {
  return (
    <div className="mt-12 py-12 border-t border-slate-200">
      <div className="flex items-center mb-6">
        <span className="w-8 h-1 bg-[#050A1E] mr-3"></span>
        <h2 className="text-2xl font-playfair font-bold text-[#050A1E]">
          Live GI Protection Dashboard
        </h2>
        <span className="grow h-px bg-slate-200 ml-3"></span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-lg border border-slate-200">
        <div className="flex-1 text-slate-700 space-y-4">
          <p className="font-bold text-[#050A1E]">
            Geographical Indication (GI) signifies a product originating from a
            specific region, known for its quality and reputation.
          </p>
          <p className="text-sm leading-relaxed">
            In Kashmir, GI protects traditional handicrafts, ensuring
            authenticity, accessing pricing. GI certification helps artisans
            safeguard their centuries-old skills and cultural heritage in the
            global market.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          {/* Visual Placeholder for Dashboard Badge/Logo */}
          <div className="w-full max-w-sm h-48 bg-[#fefce8] border-2 border-dashed border-[#ca8a04]/50 rounded-lg flex items-center justify-center text-[#ca8a04] font-bold text-center p-4">
            [Interactive GI Map & Dashboard Visualization]
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center justify-center">
        <button className="bg-[#ca8a04] hover:bg-[#a16207] text-white px-8 py-3 rounded font-bold uppercase tracking-wide shadow-md w-full md:w-auto text-center text-lg">
          Report GI Violation
        </button>
        <button className="bg-[#7f1d1d] hover:bg-[#991b1b] text-white px-8 py-3 rounded font-bold uppercase tracking-wide shadow-md w-full md:w-auto text-center text-lg">
          Counterfeit Alert System
        </button>
      </div>
    </div>
  );
};

export default GIDashboardInfo;
