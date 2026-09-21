import Image from "next/image";
import { BiWorld } from "react-icons/bi";
import {
  FaTools,
  FaBullhorn,
  FaBalanceScale,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
export default function DonationMainSection() {
  return (
    <section className="pt-32 pb-24 bg-[#050A1E] text-white relative overflow-hidden">

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-white font-bold uppercase tracking-widest text-sm bg-brand-secondary/10 py-1 px-3 rounded-full border border-white/20">
              Support KHCRF
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-6 mb-8 leading-tight text-white">
              Igniting Change through Collective Action
            </h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">
              Your support isn't just a donation; it's a vote for the
              preservation of culture. We mobilize stakeholders, drive digital
              campaigns, and push for legislative attention to protection
              Kashmir's heritage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {/* Tools */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <FaTools className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Provides Tools For Artisans
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Essential equipment and modern tools.
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <HiUserGroup className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Supports Craft Education
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Training future master artisans.
                  </p>
                </div>
              </div>

              {/* Policy */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <FaBalanceScale className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Policy Advocacy
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Protecting GI tags and rights.
                  </p>
                </div>
              </div>

              {/* Fair Trade */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <BiWorld className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Fair Trade Certs
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Ensuring global ethical standards.
                  </p>
                </div>
              </div>

              {/* Awareness */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <FaBullhorn className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Digital Awareness
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Global storytelling campaigns.
                  </p>
                </div>
              </div>

              {/* Impact */}
              {/* Stakeholders - Renamed from Sustained Impact based on "missing stake" request */}
              <div className="group flex items-start gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 cursor-default shadow-lg hover:shadow-brand-primary/10">
                <div className="bg-brand-primary p-3 rounded-xl shadow-lg shrink-0">
                  <FaHandHoldingHeart className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                    Mobilizing Stakeholders
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Engaging communities for long-term impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 mt-8">
              <a
                id="donate-now-btn"
                href="/about/donations"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-brand-primary font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary hover:bg-brand-secondary shadow-lg hover:shadow-brand-secondary/50 uppercase tracking-widest overflow-hidden"
              >
                <span className="relative">Donate and Make an Impact</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="relative h-[700px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/5 transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Decorative Overlay */}
            <div className="absolute top-0 right-0 p-8 z-20 opacity-80">
              <FaBalanceScale className="text-white/20 text-9xl absolute top-10 right-10 rotate-12" />
            </div>

            <Image
              src="/assets/images/generated/why-support-v3.png"
              alt="Why Your Support Matters"
              fill
              className="object-cover"
            />

            <div className="absolute bottom-10 left-10 right-10 z-20">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-white font-serif text-2xl leading-relaxed italic">
                  "When you support the Hamadan Craft Revival Foundation - Kashmir, you aren't just saving a
                  craft—you are saving a{" "}
                  <span className="text-brand-secondary font-bold not-italic">
                    civilization's identity
                  </span>
                  ."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-1 bg-brand-secondary rounded-full"></div>
                  <span className="text-gray-300 text-sm uppercase tracking-widest font-bold">
                    The KHCRF Promise
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
