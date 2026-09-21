import re

path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will use a regex to replace everything from '<div className="space-y-6">\n          <h2 className="text-lg font-black text-stone-900'
# up to '{/* Support & Quick Links */}'
pattern = re.compile(r'<div className="space-y-6">\s*<h2 className="text-lg font-black text-stone-900.*?\{/\* Support & Quick Links \*/\}', re.DOTALL)

new_tasks = """<div className="space-y-6">
          <h2 className="text-lg font-black text-stone-900 uppercase tracking-[0.15em] border-b border-stone-200 pb-3 flex items-center gap-2">
            <FaClipboardList className="text-brand-primary text-xl" /> Active Authorized Tasks
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Online Survey Card */}
            {showSurveyTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-indigo-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaClipboardList className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Complete {participantCat} Assessment</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Status</span>
                        <span className="text-indigo-600">Not Started</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Due Date</span>
                        <span className="text-stone-700">15 September 2026</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Progress</span>
                        <span className="text-stone-700">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button 
                    onClick={() => { setActivePathway(participantCat); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 group-hover:text-indigo-700 transition-colors uppercase tracking-[0.15em]"
                  >
                    Open Survey <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Field Consultation Card */}
            {showConsultationTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-emerald-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaUsers className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Field Consultation</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold gap-4">
                        <span className="text-stone-500 whitespace-nowrap">Location</span>
                        <span className="text-stone-700 text-right text-[9px]">Srinagar District Consultation Centre</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Date</span>
                        <span className="text-stone-700 text-[10px]">22 September 2026</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Status</span>
                        <span className="text-emerald-600">Invitation Issued</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 group-hover:text-emerald-700 transition-colors uppercase tracking-[0.15em]">
                    View Invitation <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Public Hearing Card */}
            {showHearingTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-purple-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaBullhorn className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Public Hearing Registration</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold gap-4">
                        <span className="text-stone-500 whitespace-nowrap">Hearing</span>
                        <span className="text-stone-700 text-right text-[9px]">Craft Economy and Artisan Welfare</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Date</span>
                        <span className="text-stone-700 text-[10px]">5 October 2026</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Status</span>
                        <span className="text-purple-600">Eligible</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button className="inline-flex items-center gap-2 text-[10px] font-black text-purple-600 group-hover:text-purple-700 transition-colors uppercase tracking-[0.15em]">
                    Register Now <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Validation Review Card */}
            {showValidationTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-cyan-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 shadow-sm group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Draft Findings Validation</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold gap-4">
                        <span className="text-stone-500 whitespace-nowrap">Brief</span>
                        <span className="text-stone-700 text-right text-[9px]">Artisan Livelihoods and Market Access</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Deadline</span>
                        <span className="text-stone-700 text-[10px]">20 November 2026</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Status</span>
                        <span className="text-cyan-600">Open</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button className="inline-flex items-center gap-2 text-[10px] font-black text-cyan-600 group-hover:text-cyan-700 transition-colors uppercase tracking-[0.15em]">
                    Review Findings <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Expert Review Card */}
            {showExpertTask && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-pink-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100 shadow-sm group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaBrain className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Expert Review Assignment</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold gap-4">
                        <span className="text-stone-500 whitespace-nowrap">Topic</span>
                        <span className="text-stone-700 text-right text-[9px]">Traditional Craft Production & Market Systems</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Status</span>
                        <span className="text-pink-600">Assigned</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button className="inline-flex items-center gap-2 text-[10px] font-black text-pink-600 group-hover:text-pink-700 transition-colors uppercase tracking-[0.15em]">
                    Begin Review <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Written Submission / Evidence Card */}
            {(showWrittenTask || showEvidenceTask) && (
              <div className="group bg-white border border-stone-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-amber-200 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-0"></div>
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 ease-out">
                    <FaFileAlt className="text-xl" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black text-stone-900 text-lg tracking-tight leading-tight">Written Evidence Submission</h4>
                    <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold gap-4">
                        <span className="text-stone-500 whitespace-nowrap">Accepted Formats</span>
                        <span className="text-stone-700 text-right text-[9px]">PDF, DOCX, XLSX, JPG, PNG</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                        <span className="text-stone-500">Maximum Size</span>
                        <span className="text-stone-700 text-[10px]">25 MB</span>
                      </div>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mt-2 pt-2 border-t border-stone-200">
                        <span className="text-stone-500">Status</span>
                        <span className="text-amber-600">Open</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 relative z-10">
                  <button className="inline-flex items-center gap-2 text-[10px] font-black text-amber-600 group-hover:text-amber-700 transition-colors uppercase tracking-[0.15em]">
                    Submit Document <FaArrowRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Support & Quick Links */}"""

content = re.sub(pattern, new_tasks, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated task cards successfully")

