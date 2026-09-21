const CollaborationWorkModel = () => {
  return (
    <div className="mb-12">
      <div className="relative text-center mb-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center">
          <h2 className="text-2xl font-playfair font-bold text-[#1e3a8a] bg-slate-50 px-6">
            How the Platform Works
          </h2>
        </div>
        <p className="text-slate-600 max-w-3xl mx-auto mt-4 relative bg-slate-50 inline-block px-4">
          KHCRF provides the institutional structure, technical tools, and data
          verification mechanisms, acting as the operational backbone for the
          Legislator's initiative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-white mb-4 rounded overflow-hidden border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2000&auto=format&fit=crop"
              alt="Institution"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-3">
            KHCRF as Institutional Framework
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            KHCRF provides the institutional structure, technical tools, and data
            verification mechanisms for the desk.
          </p>
          <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors uppercase tracking-wide">
            View Details
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-white mb-4 rounded overflow-hidden border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"
              alt="Legislator"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-3">
            Legislator as Economic Steward
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            The Legislator provides representation, oversight, and raises policy
            issues affecting artisans.
          </p>
          <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors uppercase tracking-wide">
            View Details
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-white mb-4 rounded overflow-hidden border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop"
              alt="Verification"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-3">
            Stakeholder Verification Workflow
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Intake forms submitted by artisans and producers are authenticated
            through KHCRF's verification procedures.
          </p>
          <button className="bg-[#fcd34d] hover:bg-[#fbbf24] text-[#78350f] px-4 py-2 rounded text-sm font-bold shadow-sm transition-colors uppercase tracking-wide">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkModel;
