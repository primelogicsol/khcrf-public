import { Metadata } from "next";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { aboutSharedPrincipleHeroFallback } from "@/config/heroFallbacks";
import CTASection from "@/components/common/CTASection";
import ScrollReveal from "@/components/ScrollReveal";
import { FaExternalLinkAlt } from "react-icons/fa";
import PlatformUpgradeButton from "@/components/common/PlatformUpgradeButton";
import Image from "next/image";

export const metadata: Metadata = {
  title: "A Shared Principle | Kashmir Hamadan Craft Revival Foundation",
  description: "The human relationships, responsibilities, and realities that inspired the Kashmir Hamadan Craft Revival Foundation.",
};

export default function SharedPrinciplePage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <UniversalEditorialHero pageKey="shared-principle" fallbackConfig={aboutSharedPrincipleHeroFallback as any} />

      <section className="py-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="bg-white rounded-[40px] shadow-xl p-10 md:p-16 border border-gray-100 mb-16 relative overflow-hidden">
              <div className="absolute top-0 left-10 w-20 h-2 bg-brand-secondary rounded-b-lg"></div>
              
              <div className="space-y-6 text-xl text-gray-700 leading-relaxed font-manrope font-medium">
                <p>
                  The Dr. Kumar Foundation USA and the Kashmir Hamadan Craft Revival Foundation (KHCRF) serve different missions, operate in different domains, and pursue distinct institutional objectives.
                </p>
                <p>
                  The Dr. Kumar Foundation USA is dedicated to education, knowledge, research, human development, public service, institutional continuity, and the preservation of the teachings and legacy of Dr. G. M. Kumar.
                </p>
                <p>
                  KHCRF is dedicated to artisan welfare, cultural preservation, craft intelligence, traditional knowledge systems, research, documentation, policy engagement, enterprise development, and the long-term sustainability of Kashmir's handicraft sector.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 my-8 p-8 bg-gray-50 rounded-3xl border border-gray-100 italic">
                  <div className="flex-1 text-center">
                    <span className="text-brand-dark font-bold text-lg">These institutions are independent.</span>
                  </div>
                  <div className="hidden sm:block w-px bg-gray-300"></div>
                  <div className="flex-1 text-center">
                    <span className="text-brand-dark font-bold text-lg">One was not created to serve the other.</span>
                  </div>
                  <div className="hidden sm:block w-px bg-gray-300"></div>
                  <div className="flex-1 text-center">
                    <span className="text-brand-dark font-bold text-lg">One is not an extension of the other.</span>
                  </div>
                </div>

                <p>
                  Yet the origins of KHCRF cannot be understood without understanding the human relationships that developed around Dr. Kumar over many decades and the realities those relationships revealed.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="mb-16 relative w-full aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white group">
              <Image 
                src="/assets/images/dr_kumar_image.png" 
                alt="Dr. G. M. Kumar" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
            </div>
          </ScrollReveal>

          <div className="space-y-16">
            
            {/* Section 1 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">Relationships Built Across Generations</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>For decades, Dr. G. M. Kumar travelled extensively throughout Kashmir.</p>
                  <p>Throughout this journey, he was welcomed into homes, villages, workshops, and communities by people from all walks of life.</p>
                  <p>Among those who hosted, supported, and served him were generations of artisans, weavers, woodcarvers, carpet makers, embroiderers, papier-mâché artists, copper craftsmen, traders, laborers, and families whose lives revolved around traditional crafts.</p>
                  <p className="font-bold text-gray-800">These were not institutional relationships.</p>
                  <p>There were no programs, grants, projects, or formal partnerships. They were relationships built upon trust, respect, hospitality, and human connection.</p>
                  <p>Many artisan families remained connected to Dr. Kumar across decades. Children became parents. Apprentices became masters. Workshops passed from one generation to the next. Yet the relationships endured.</p>
                  <p>Over time, these interactions provided a rare and intimate view into the lives of the people responsible for preserving some of Kashmir's most celebrated cultural traditions.</p>
                  <p>It was through these relationships that the founder of KHCRF came to witness a reality largely invisible to consumers, tourists, policymakers, and even many institutions.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 2 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">Beyond The Beauty Of The Product</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>The world sees the finished product.</p>
                  
                  <div className="flex flex-wrap gap-3 py-4">
                    {["A Pashmina shawl", "A hand-knotted carpet", "A walnut wood masterpiece", "A copper vessel", "An embroidered textile", "A papier-mâché artwork"].map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">{item}</span>
                    ))}
                  </div>

                  <p>People admire the beauty. They admire the craftsmanship. They admire the heritage.</p>
                  <p>But very few see the lives behind these creations. Very few see the years of apprenticeship required to master the craft. Very few see the uncertainty faced by artisan households. Very few see the sacrifices made to preserve traditions that can take generations to learn and only moments to lose.</p>
                  
                  <div className="p-8 bg-brand-dark rounded-3xl mt-8 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                      <p className="text-xl font-medium opacity-90">Behind every craft stood a family.</p>
                      <p className="text-xl font-medium opacity-90">Behind every family stood a struggle.</p>
                      <p className="text-xl font-medium opacity-90 mb-4">And behind every struggle stood a growing question:</p>
                      <p className="text-2xl font-black font-playfair text-brand-secondary">How could communities responsible for creating so much cultural wealth continue to experience so much economic insecurity?</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 3 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">Witnessing Hardship Behind Heritage</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>The founder of KHCRF, who is a student, <em>Salik</em>, and traveler on the spiritual path, and whose Teacher, <em>Murshid</em>, <em>Shaykh</em>, <em>Pir</em>, and Spiritual Guide is Dr. Kumar—who has lived a <em>Qalandar</em> life hosted and served by artisan communities in Kashmir for decades—encountered master craftsmen whose skills commanded international admiration yet whose incomes remained uncertain.</p>
                  <p>He met artisans whose work traveled across continents while their own households struggled to secure stable futures.</p>
                  <p>He saw families preserving centuries of knowledge while facing increasing pressures from inflation, market instability, declining demand, and changing consumer behavior.</p>
                  <p>He met younger generations questioning whether they could afford to continue traditions inherited from their parents and grandparents.</p>
                  <p>Many were proud of their heritage. Many loved their craft. Yet an increasing number doubted whether the craft could continue to sustain their lives.</p>
                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl text-orange-900 mt-6">
                    <p className="font-medium mb-1">The problem was not talent.</p>
                    <p className="font-medium mb-1">The problem was not dedication.</p>
                    <p className="font-medium mb-3">The problem was not the quality of the work.</p>
                    <p className="text-xl font-black">The problem was that the systems surrounding the artisan were often weaker than the artisan himself.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 4 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">The Counterfeit Crisis</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>One of the most alarming realities was the growing spread of counterfeit and imitation products.</p>
                  <p>Machine-made products were increasingly marketed as handmade. Synthetic products were sold as authentic. Imitations exploited reputations that genuine artisans had spent generations building.</p>
                  <p>Consumers struggled to distinguish authenticity from imitation. Markets became increasingly confused. Trust eroded.</p>
                  <p>Authentic artisans found themselves competing against products that required only a fraction of the skill, time, labor, and knowledge invested in genuine craftsmanship.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                      <p className="font-bold text-gray-800">A threat to livelihoods.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                      <p className="font-bold text-gray-800">A threat to reputation.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                      <p className="font-bold text-gray-800">A threat to cultural continuity.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm border-l-4 border-l-red-500">
                      <p className="font-bold text-gray-800">A threat to future communities.</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800 mt-4">Every counterfeit product represented more than a fraudulent sale.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 5 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">The Invisible Cost Of Intermediaries</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>Another reality became impossible to ignore. In many cases, the artisan carried the greatest burden while receiving the smallest share of the final value.</p>
                  <p>Months of skilled labor often passed through multiple layers of intermediaries, traders, distributors, wholesalers, retailers, and exporters before reaching consumers.</p>
                  <p>At every stage, value increased. Yet the artisan frequently remained trapped at the lowest end of the value chain.</p>
                  <p>Those who created the product often possessed the least influence over pricing, branding, marketing, distribution, and consumer engagement.</p>
                  <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-700">
                    <li>Many artisans knew how to create exceptional products.</li>
                    <li>Few had direct access to markets.</li>
                    <li>Few had access to market intelligence.</li>
                    <li>Few had access to branding systems.</li>
                    <li>Few had access to international buyers.</li>
                  </ul>
                  <p className="font-bold text-gray-800 italic">The imbalance was structural. And its effects were visible across generations.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 6 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">Poverty Amid Global Recognition</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>Perhaps the greatest contradiction was this: <strong className="font-bold text-gray-900">Communities responsible for producing some of the world's most admired handmade products often remained economically vulnerable.</strong></p>
                  <p>The founder encountered families preserving extraordinary cultural wealth while struggling with financial uncertainty.</p>
                  <p>He met aging masters worried that their knowledge would disappear with them. He met younger artisans uncertain whether traditional occupations could provide a dignified future.</p>
                  <p>He saw cultural treasures being celebrated while the people responsible for creating them remained largely invisible.</p>
                  <div className="bg-gray-900 text-white p-8 rounded-3xl mt-8">
                    <p className="text-xl font-medium mb-3">The issue was no longer simply about preserving crafts.</p>
                    <ul className="space-y-2 text-lg text-gray-300">
                      <li>&bull; It was about preserving livelihoods.</li>
                      <li>&bull; It was about preserving dignity.</li>
                      <li>&bull; It was about preserving communities.</li>
                      <li className="text-brand-secondary font-bold text-xl mt-4">&bull; It was about preserving people.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 7 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">From Observation To Responsibility</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>Over time, these experiences created a profound sense of responsibility.</p>
                  <p>The founder came to understand that admiration alone was insufficient. Recognition alone was insufficient. Good intentions alone were insufficient.</p>
                  <p>If artisan communities were to survive and thrive, they required more than appreciation.</p>
                  
                  <div className="flex flex-wrap gap-2 py-4">
                    {["Documentation", "Research", "Visibility", "Authentication systems", "Knowledge preservation", "Market intelligence", "Policy engagement", "Public awareness", "Institutional advocacy", "Enterprise support", "Long-term strategic thinking"].map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-bold border border-blue-100">{item}</span>
                    ))}
                  </div>

                  <p className="text-2xl font-black text-brand-dark font-playfair mt-4">The challenge demanded more than sympathy. It demanded institutions.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 8 */}
            <ScrollReveal delay={100}>
              <div className="group pl-8 md:pl-12 border-l-4 border-gray-200 hover:border-[var(--card-left-accent)] transition-colors duration-500">
                <h2 className="text-4xl font-black text-brand-dark mb-6 font-playfair tracking-tight">The Birth Of KHCRF</h2>
                <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                  <p>The Kashmir Hamadan Craft Revival Foundation emerged from this realization.</p>
                  <p>Not as a commercial enterprise. Not as a marketplace. Not as a trade body. Not as a replacement for existing institutions.</p>
                  <p className="text-xl font-medium text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 my-6">
                    But as an independent public-interest institution dedicated to understanding, documenting, preserving, strengthening, and advancing the people, knowledge systems, communities, and traditions that form the foundation of Kashmir's craft civilization.
                  </p>
                  <p>KHCRF was established because preserving a craft requires preserving the artisan. Protecting a tradition requires protecting the community that carries it.</p>
                  <p className="font-bold text-gray-800">And safeguarding heritage requires safeguarding the people whose lives remain inseparable from that heritage.</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Section 9 */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-16 border border-gray-100 mt-24 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/5 rounded-tr-full"></div>
                
                <h2 className="text-4xl font-black text-brand-dark mb-8 font-playfair tracking-tight relative z-10">A Shared Principle</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed relative z-10">
                  <p>The Dr. Kumar Foundation USA and KHCRF continue to serve different missions.</p>
                  <p>One focuses on education, knowledge, research, human development, and institutional stewardship. The other focuses on artisans, cultural heritage, traditional knowledge systems, craft intelligence, advocacy, and community development.</p>
                  <p className="font-bold text-xl text-gray-900 mt-8">Yet both remain connected by a shared principle:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left my-10 max-w-3xl mx-auto">
                    {["That service carries responsibility.", "That knowledge carries obligations.", "That communities deserve dignity.", "That heritage deserves protection.", "That future generations deserve institutions willing to act before what is valuable is lost."].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-[var(--card-left-accent)] transition-colors">
                        <div data-editorial-accent-bg className="w-3 h-3 rounded-full  shrink-0"></div>
                        <span className="font-semibold text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p>The artisan communities of Kashmir helped shape the journey that ultimately led to the creation of KHCRF.</p>
                  <p>This page exists to acknowledge that contribution. It exists to recognize the families who welcomed, hosted, supported, and inspired a deeper understanding of Kashmir's craft realities.</p>
                  <p className="font-bold text-gray-800 mt-10 uppercase tracking-widest text-sm">And it exists to affirm a continuing commitment:</p>
                  <div className="relative mt-8 pt-6">
                    <span className="text-8xl text-brand-secondary/10 absolute -top-4 left-1/2 -translate-x-1/2 font-playfair">&ldquo;</span>
                    <p className="font-black text-brand-primary text-2xl md:text-3xl font-playfair leading-tight relative z-10">
                      To ensure that the people who preserve Kashmir's heritage are never forgotten in the effort to preserve the heritage itself.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <section className="py-32 bg-[#fcfcfc] border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h5 data-editorial-accent-text className=" font-black uppercase tracking-[0.4em] text-[11px] mb-4">
              A Connected Ecosystem
            </h5>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-brand-dark mb-8 font-manrope">
              Dr. Kumar Foundation USA Ecosystem
            </h2>
            <p className="text-gray-600 font-medium text-lg leading-relaxed mb-6">
              A connected ecosystem of spiritual legacy, consciousness research, sacred media, interfaith dialogue, environmental intelligence, and faith-based commerce.
            </p>
          </div>

          <div className="space-y-16">
            {/* DKF USA */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  DR. KUMAR FOUNDATION ECOSYSTEM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Dr. Kumar Foundation USA</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  The institutional expression of Dr. G. M. Kumar’s continuing mission in knowledge, service, ethical stewardship, spiritual legacy, and long-term public-interest institutional development.
                </p>
                <a
                  href="https://dkf.sufisciencecenter.info/"
                  target="_blank"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-secondary hover:text-white transition-all w-fit"
                >
                  <span>VISIT WEBSITE</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Legacy Preservation", "Ethical Stewardship", "Teaching Frameworks", "Community Service", "Institutional Continuity", "Public-Interest Initiatives"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sufi Science Center USA */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  CONSCIOUSNESS RESEARCH INSTITUTE
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Sufi Science Center USA</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A research and learning platform exploring consciousness, Sufi knowledge systems, inner development, contemplative practice, epistemology, and the relationship between scientific inquiry and spiritual transformation.
                </p>
                <a
                  href="https://sufisciencecenter.info/"
                  target="_blank"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-primary hover:text-white transition-all w-fit"
                >
                  <span>VISIT WEBSITE</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Consciousness Studies", "Sufi Knowledge Systems", "Inner Development", "Research & Publications", "Assessment Tools", "Civilizational Learning"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SufiPulse USA */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  SACRED MUSIC & MEDIA INSTITUTION
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">SufiPulse USA</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A governed sacred media platform dedicated to Sufi music, poetry, kalam, literary expression, contributor rights, transparent production workflows, and responsible digital preservation of devotional content.
                </p>
                <a
                  href="https://www.sufipulse.com/"
                  target="_blank"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-dark hover:text-white transition-all w-fit"
                >
                  <span>VISIT WEBSITE</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Sacred Kalam", "Music Production", "Literary Archive", "Contributor Governance", "Royalty Transparency", "Institutional Media"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interfaith Peace Bridge */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  INTERFAITH PEACE PLATFORM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Interfaith Peace Bridge</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A peace and understanding platform created to reduce hatred, clarify misconceptions, and highlight the universal truths shared across faith traditions through compassion, dialogue, sacred teachings, and divine love.
                </p>
                <a
                  href="https://ifpb.sufisciencecenter.info/"
                  target="_blank"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-secondary hover:text-white transition-all w-fit"
                >
                  <span>VISIT WEBSITE</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Interfaith Dialogue", "Sacred Texts", "Peace Education", "Faith Assessment", "Shared Humanity", "Compassionate Understanding"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kashmir EcoWatch */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  ENVIRONMENTAL INTELLIGENCE PLATFORM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Kashmir EcoWatch</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A scientific environmental intelligence platform for Kashmir’s protected areas, biodiversity, water systems, monitoring, field intelligence, conservation alerts, GIS mapping, and ecological risk documentation.
                </p>
                <PlatformUpgradeButton
                  platformName="Kashmir EcoWatch"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-primary hover:text-white transition-all w-fit"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Protected Areas", "Biodiversity Intelligence", "Water Systems", "Field Reports", "Risk Monitoring", "Conservation Mapping"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purple Soul USA */}
            <div className="bg-white rounded-4xl p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]" />
              <div className="lg:w-1/2 flex flex-col">
                <span data-editorial-accent-text className=" font-black uppercase tracking-[0.25em] text-[10px] mb-3 block">
                  FAITH-BASED MARKETPLACE ECOSYSTEM
                </span>
                <h3 className="text-4xl font-black text-brand-dark mb-6">Purple Soul USA</h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-[15px] grow">
                  A faith-based e-commerce platform connecting conscious buyers with products inspired by spirituality, sacred traditions, ethical craftsmanship, and meaningful living. Purple Soul USA brings together faith, purpose, heritage, and commerce to support artisans, creators, authors, spiritual organizations, and values-driven communities.
                </p>
                <PlatformUpgradeButton
                  platformName="Purple Soul USA"
                  className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-brand-dark font-black tracking-widest text-[12px] uppercase hover:bg-brand-dark hover:text-white transition-all w-fit"
                />
              </div>
              <div className="lg:w-1/2 lg:pl-12 lg:border-l border-gray-100 flex flex-col justify-center">
                <h4 className="font-playfair font-black text-xl mb-8 text-gray-900">Core Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  {["Faith-Based Commerce", "Spiritual Living Products", "Sacred Art & Heritage", "Books & Knowledge", "Ethical & Conscious Shopping", "Global Faith Communities"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div data-editorial-accent-bg className="w-2 h-2 rounded-full /50" />
                      <span className="text-[15px] font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
