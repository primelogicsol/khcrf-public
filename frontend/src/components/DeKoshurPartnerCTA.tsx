import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function DeKoshurPartnerCTA() {
  return (
    <section className="py-20 text-left">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="relative h-full min-h-[400px]">
            <div className="rounded-2xl overflow-hidden shadow-2xl relative h-full w-full">
              <img
                src="/assets/images/generated/dekoshur_partner_v2.png"
                alt="Certifications and Partnership"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <span data-editorial-accent-text className="font-bold tracking-wider uppercase text-sm mb-2 block">
              Alternative Compliance Models
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 font-manrope">
              Certification Access &amp; Partnership Pathways
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              For craft enterprises unable to independently bear the cost of international certification, KHCRF may provide information on collaborative, consortium, shared-compliance, white-label and institutional partnership pathways available across the sector.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              De Koshur Crafts USA is one independent commercial platform that may offer shared-compliance or partnership arrangements subject to its own eligibility criteria. KHCRF does not require, exclusively endorse, or condition any KHCRF service, evaluation, recognition or support upon participation with DKC or any other commercial entity.
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-brand-primary mb-6 ml-[-10px] md:ml-0">
                Shared-Compliance Options:
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <FaCheckCircle data-ui-icon className="text-xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-secondary text-lg">
                      Explore Consortium Structures:
                    </h4>
                    <p className="text-gray-600">
                      Allows groups of craft enterprises to meet the highest industry quality, ethical, and environmental standards collectively.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <FaCheckCircle data-ui-icon className="text-xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-secondary text-lg">
                      Leverage Established Certifications:
                    </h4>
                    <p className="text-gray-600">
                      Understand how white-label models offered by external commercial entities allow indirect verification.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <FaCheckCircle data-ui-icon className="text-xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-brand-secondary text-lg">
                      Evaluate Institutional Readiness:
                    </h4>
                    <p className="text-gray-600">
                      Review independent commercial partnership requirements to ensure alignment with your own ethical standards.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <a
              href="http://www.b2b.dekoshurcrafts.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-dark transition-colors transform hover:-translate-y-1">
              Explore Commercial Partnerships
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
