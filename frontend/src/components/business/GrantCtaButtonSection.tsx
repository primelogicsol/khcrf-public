import Link from "next/link";
import { FaArrowRight, FaPenNib, FaFileInvoiceDollar } from "react-icons/fa";

export default function GrantCtaButtonSection() {
    return (
        <section className="relative py-32 overflow-hidden bg-[#050A1E] text-white isolate">
            <div className="container mx-auto px-4 md:px-10 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#F6F2EC] font-bold tracking-[0.3em] uppercase text-xs mb-6 flex items-center justify-center gap-4">
                        <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
                        Craftlore's Submission Portal
                        <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto">
                        Empowering Artisans & Entrepreneurs for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6F2EC] to-[#FFF1AE] italic font-playfair font-normal">Sustainable Growth</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 justify-center max-w-6xl mx-auto">
                    {/* Grant Application Card */}
                    <div className="group relative bg-white/5 border border-white/10 p-10 md:p-12 rounded-3xl flex-1 text-left backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#F6F2EC]/50 hover:bg-white/10 hover:shadow-[0_0_50px_rgba(246,242,236,0.15)]">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#F6F2EC]/20 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                        
                        <div className="w-14 h-14 bg-[#F6F2EC]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] transition-colors duration-500">
                            <FaFileInvoiceDollar className="text-2xl text-[#F6F2EC] group-hover:text-[#050A1E] transition-colors duration-500" />
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-serif tracking-wide">Apply for Grants</h3>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed font-light">
                            Access financial support tailored for Kashmiri artisans and entrepreneurs. Submit a simple online application with essential documents.
                        </p>
                        
                        <Link
                            href="/business-support/grants/apply"
                            className="inline-flex items-center space-x-3 text-[#F6F2EC] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors group/link"
                        >
                            <span>Start Application</span> 
                            <FaArrowRight className="group-hover/link:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {/* Writing Assistance Card */}
                    <div className="group relative bg-white/5 border border-white/10 p-10 md:p-12 rounded-3xl flex-1 text-left backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#F6F2EC]/50 hover:bg-white/10 hover:shadow-[0_0_50px_rgba(246,242,236,0.15)]">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#F6F2EC]/20 to-transparent rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
                        
                        <div className="w-14 h-14 bg-[#F6F2EC]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#F6F2EC]/20 group-hover:bg-[#F6F2EC] transition-colors duration-500">
                            <FaPenNib className="text-2xl text-[#F6F2EC] group-hover:text-[#050A1E] transition-colors duration-500" />
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white font-serif tracking-wide">Grants Writing Assistance</h3>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed font-light">
                            Receive expert guidance in crafting compelling grant applications. Access resources and templates to strengthen your proposal.
                        </p>
                        
                        <Link
                            href="/about/contact"
                            className="inline-flex items-center space-x-3 text-[#F6F2EC] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors group/link"
                        >
                            <span>Contact Experts</span> 
                            <FaArrowRight className="group-hover/link:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
