import React from "react";
import Link from "next/link";
import { FaUserShield, FaLandmark, FaHandshake, FaBullhorn } from "react-icons/fa6";

export function AdvocacyActionHub({ topicSlug }: { topicSlug: string }) {
  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
            Support This Advocacy Action
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Your voice strengthens our mandate. Choose how you can help advance this policy priority.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Support Policy */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaUserShield className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Endorse Policy</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Add your signature</li>
              <li>• Join stakeholder list</li>
              <li>• Receive updates</li>
            </ul>
            <Link href={`/research/campaigns/${topicSlug}/join?type=pledge`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Sign Petition
            </Link>
          </div>

          {/* Contact Rep */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaLandmark className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Engage Office</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Find local representative</li>
              <li>• Track constituency updates</li>
              <li>• Request intervention</li>
            </ul>
            <Link href={`/legislative-office`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Find Office
            </Link>
          </div>

          {/* Become A Partner */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaHandshake className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Institutional Support</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• NGOs & Think Tanks</li>
              <li>• Industry Guilds</li>
              <li>• Joint task forces</li>
            </ul>
            <Link href={`/about/partner-network/join`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Partner With Us
            </Link>
          </div>

          {/* Share & Campaign */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaBullhorn className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Amplify Impact</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Download toolkit</li>
              <li>• Share on social media</li>
              <li>• Raise awareness</li>
            </ul>
            <Link href={`/research/campaigns`} className="block text-center w-full py-3 px-4 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-amber-500 transition-colors">
              Join Campaigns
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AdvocacyFooter({ topicSlug }: { topicSlug: string }) {
  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden text-center">
      <div className="absolute inset-0 opacity-10 "></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 font-playfair">
          Drive Policy Change
        </h2>
        <p className="text-xl text-stone-400 mb-12 flex flex-wrap justify-center gap-4 font-medium">
          <span>Signatures</span> • <span>Briefings</span> • <span>Roundtables</span> • <span>Legislation</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/research/lobbying/register`} className="px-6 py-3 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors">
            Endorse Initiative
          </Link>
          <Link href={`/research/lobbying/explore`} className="px-6 py-3 bg-white text-stone-900 font-bold text-sm rounded-xl hover:bg-stone-100 transition-colors">
            View Updates
          </Link>
        </div>
      </div>
    </section>
  );
}
