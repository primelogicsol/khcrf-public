import Link from "next/link";
import { FaArrowRight, FaBoxOpen, FaRegCompass } from "react-icons/fa";

export default function GetKitCTASection({ useExploreButton = false }: { useExploreButton?: boolean }) {
  return (
    <section className="relative py-32 overflow-hidden bg-[#050A1E] text-white isolate">
      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#F6F2EC]/10 border border-[#F6F2EC]/30 rounded-2xl flex items-center justify-center mb-8 relative group">
                <FaBoxOpen className="text-3xl text-[#F6F2EC] group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#F6F2EC] rounded-full flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(246,242,236,0.8)]">
                    <FaRegCompass data-ui-icon  className=" text-[10px]" />
                </div>
            </div>
            
            <span className="text-[#F6F2EC] font-bold tracking-[0.3em] uppercase text-xs mb-6 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
                Empowering Kashmir's Entrepreneurs
                <span className="w-12 h-[1px] bg-[#F6F2EC]/50 block hidden md:block"></span>
            </span>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6F2EC] to-[#FFF1AE] italic font-playfair font-normal">Success</span>
            </h2>
            
            <p className="text-gray-400 max-w-3xl mx-auto mb-12 text-lg md:text-xl font-light leading-relaxed">
                Whether you're a startup, a seasoned business owner, or an artisan looking to scale, the KHCRF kit is tailored to help you navigate the challenges of entrepreneurship while promoting ethical and sustainable growth. Each module covers crucial aspects such as Technology, Legal Compliance, and Networking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                {useExploreButton ? (
                    <Link
                        href="/business-support/entrepreneur-kits"
                        className="group relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#F6F2EC] to-[#FFFFFF] text-[#050A1E] font-black py-5 px-12 rounded-[24px] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(246,242,236,0.4)] w-full sm:w-auto"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 uppercase tracking-widest text-sm">Explore</span>
                        <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                ) : (
                    <>
                        <a
                            href="mailto:support@khcrf.org"
                            className="group relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#F6F2EC] to-[#FFFFFF] text-[#050A1E] font-black py-5 px-10 rounded-[24px] overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(246,242,236,0.4)] w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <span className="relative z-10 uppercase tracking-widest text-sm">Request Your Free Kit</span>
                            <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                        </a>
                        <Link
                            href="/about/contact"
                            className="inline-flex items-center justify-center gap-2 text-white font-medium hover:text-[#F6F2EC] transition-colors py-5 px-10 border border-white/10 rounded-[24px] hover:bg-white/5 w-full sm:w-auto uppercase tracking-wider text-sm"
                        >
                            Contact Support
                        </Link>
                    </>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
