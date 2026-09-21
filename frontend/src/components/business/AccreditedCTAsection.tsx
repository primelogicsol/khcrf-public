import { FaArrowRight, FaAward, FaCheckCircle } from "react-icons/fa";

export default function AccreditedCTAsection() {
    return (
        <section className="relative py-32 overflow-hidden bg-[#050A1E] text-white isolate">
            <div className="container mx-auto px-4 md:px-10 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#F6F2EC]/10 border border-[#F6F2EC]/30 rounded-2xl flex items-center justify-center mb-8 relative">
                            <FaAward className="text-3xl text-[#F6F2EC]" />
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F6F2EC] rounded-full animate-ping opacity-75"></div>
                        </div>
                        
                        <span className="text-[#F6F2EC] font-bold tracking-[0.3em] uppercase text-xs mb-6 flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
                            Apply For Accreditation
                            <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
                        </span>
                        
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            Ready to Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6F2EC] to-[#FFF1AE] italic font-playfair font-normal">Accredited?</span>
                        </h2>
                        
                        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg md:text-xl font-light leading-relaxed">
                            Showcase your commitment to ethical trade and craftsmanship. The application process is simple, transparent, and globally recognized.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                            <a
                                href="/business-support/accreditation/apply"
                                className="group relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#F6F2EC] to-[#FFFFFF] text-[#050A1E] font-black py-5 px-12 rounded-[24px] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(246,242,236,0.4)] w-full sm:w-auto"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10 uppercase tracking-widest text-sm">Start Your Application</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                            </a>
                        </div>
                        
                        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 md:gap-16">
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                <FaCheckCircle className="text-[#F6F2EC]" /> Transparent Process
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                <FaCheckCircle className="text-[#F6F2EC]" /> Ethical Trade
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                                <FaCheckCircle className="text-[#F6F2EC]" /> Authentic Craftsmanship
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
