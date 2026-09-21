import React from "react";
import Link from "next/link";
import { FaUserPlus, FaHandsHelping, FaHandshake, FaBookOpen, FaDownload, FaCertificate } from "react-icons/fa";

export function CampaignActionHub({ campaignSlug }: { campaignSlug: string }) {
  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-sm mb-2">
            Get Involved
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
            Join The Campaign
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            Become an active participant in our mission to protect and elevate Kashmiri craftsmanship.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Supporter */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaUserPlus className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Become A Supporter</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Follow campaign updates</li>
              <li>• Receive alerts</li>
              <li>• Join awareness initiatives</li>
            </ul>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=supporter`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Join Campaign
            </Link>
          </div>

          {/* Volunteer */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaHandsHelping className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Become A Volunteer</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Participate in events</li>
              <li>• Community outreach</li>
              <li>• Educational programs</li>
            </ul>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=volunteer`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Apply as Volunteer
            </Link>
          </div>

          {/* Partner */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaHandshake className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Become A Partner</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Schools & Universities</li>
              <li>• NGOs & Museums</li>
              <li>• Cultural groups</li>
            </ul>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=partner`} className="block text-center w-full py-3 px-4 bg-stone-900 text-white font-bold text-sm rounded-xl hover:bg-stone-800 transition-colors">
              Partner With Us
            </Link>
          </div>

          {/* Submit Story */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all hover:border-brand-primary flex flex-col">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <FaBookOpen className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-4 font-playfair">Submit Heritage Story</h3>
            <ul className="text-stone-600 text-sm space-y-2 mb-8 flex-grow">
              <li>• Share memories</li>
              <li>• Family traditions</li>
              <li>• Oral histories</li>
            </ul>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=story`} className="block text-center w-full py-3 px-4 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-amber-500 transition-colors">
              Submit Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampaignProgress() {
  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-stone-900 font-playfair">
            Campaign Progress
          </h2>
          <p className="text-stone-500 text-lg">Real-time metrics on our collective impact.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: "Supporters Registered", value: "1,240" },
            { label: "Volunteer Applications", value: "84" },
            { label: "Partner Organizations", value: "17" },
            { label: "Schools Engaged", value: "42" },
            { label: "Districts Covered", value: "9" },
            { label: "Stories Submitted", value: "386" },
          ].map((stat, i) => (
            <div key={i} className="bg-stone-50 p-6 rounded-2xl text-center border border-stone-100 shadow-sm">
              <div className="text-3xl font-black text-brand-primary mb-2">{stat.value}</div>
              <div className="text-xs font-bold text-stone-600 uppercase tracking-widest leading-relaxed">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CampaignPledge({ campaignSlug }: { campaignSlug: string }) {
  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 "></div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-8 font-playfair">
          Take The Heritage Pledge
        </h2>
        <div className="bg-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-white/10 mb-8 inline-block text-left">
          <p className="text-xl md:text-2xl font-playfair italic leading-relaxed text-amber-100">
            "I pledge to support, preserve, promote, and celebrate Kashmir's craft heritage."
          </p>
        </div>
        <div>
          <Link href={`/research/campaigns/${campaignSlug}/join?type=pledge`} className="inline-block px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-amber-400 transition-colors shadow-lg mb-6">
            Sign The Pledge
          </Link>
          <p className="text-stone-400 text-sm tracking-widest uppercase font-bold">
            <span className="text-white">12,842</span> pledges signed
          </p>
        </div>
      </div>
    </section>
  );
}

export function CampaignExtras({ campaignSlug }: { campaignSlug: string }) {
  return (
    <section className="py-20 bg-[#fdfbf7] border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Schools */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-2xl font-bold font-playfair text-stone-900 mb-4">School Participation</h3>
            <p className="text-stone-600 text-sm mb-6">Enroll your school to bring heritage education to classrooms.</p>
            <div className="space-y-4 mb-8">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <p className="font-bold text-stone-900 text-sm">Govt. Higher Secondary</p>
                <p className="text-stone-500 text-xs">Srinagar • 450 Students</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <p className="font-bold text-stone-900 text-sm">Valley Heritage Academy</p>
                <p className="text-stone-500 text-xs">Anantnag • 320 Students</p>
              </div>
            </div>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=school`} className="block text-center w-full py-3 border-2 border-stone-900 text-stone-900 font-bold text-sm rounded-xl hover:bg-stone-900 hover:text-white transition-colors">
              Enroll School
            </Link>
          </div>

          {/* Toolkit */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-2xl font-bold font-playfair text-stone-900 mb-4">Campaign Toolkit</h3>
            <p className="text-stone-600 text-sm mb-6">Download assets to help spread the word in your community.</p>
            <div className="space-y-3 mb-8">
              {['Campaign Posters', 'Social Media Graphics', 'Presentation Slides', 'School Activity Guides'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-stone-700">{item}</span>
                  <FaDownload className="text-stone-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Ambassador */}
          <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-amber-400 mx-auto mb-6">
              <FaCertificate className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold font-playfair mb-4">Heritage Ambassador</h3>
            <p className="text-stone-300 text-sm mb-8 leading-relaxed">
              Approved ambassadors receive dashboard access, reporting tools, and event management permissions.
            </p>
            <Link href={`/research/campaigns/${campaignSlug}/join?type=ambassador`} className="w-full py-3 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition-colors inline-block text-center">
              Apply Now
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export function CampaignActivityTimeline() {
  const activities = [
    { title: "Story archive milestone", date: "Today", desc: "Reached 350+ published artisan stories." },
    { title: "Partner announcement", date: "Yesterday", desc: "Craft Council joins as official partner." },
    { title: "School workshop completed", date: "3 Days Ago", desc: "120 students participated in Srinagar." },
    { title: "New district enrolled", date: "Last Week", desc: "Campaign expanded to Pulwama district." },
  ];

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black mb-10 text-stone-900 font-playfair text-center">
          Latest Campaign Activity
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
          {activities.map((item, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-stone-200 group-[.is-active]:bg-brand-primary group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-stone-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-stone-900">{item.title}</h4>
                  <span className="text-xs font-bold text-stone-400">{item.date}</span>
                </div>
                <p className="text-sm text-stone-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JoinMovementFooter({ campaignSlug }: { campaignSlug: string }) {
  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden text-center">
      <div className="absolute inset-0 opacity-10 "></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 font-playfair">
          Join The Movement
        </h2>
        <p className="text-xl text-stone-400 mb-12 flex flex-wrap justify-center gap-4 font-medium">
          <span>Supporters</span> • <span>Volunteers</span> • <span>Schools</span> • <span>Partners</span> • <span>Ambassadors</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/research/campaigns/${campaignSlug}/join?type=supporter`} className="px-6 py-3 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors">
            Join Campaign
          </Link>
          <Link href={`/research/campaigns/${campaignSlug}/join?type=volunteer`} className="px-6 py-3 bg-white text-stone-900 font-bold text-sm rounded-xl hover:bg-stone-100 transition-colors">
            Become Volunteer
          </Link>
          <Link href={`/research/campaigns/${campaignSlug}/join?type=story`} className="px-6 py-3 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors">
            Submit Heritage Story
          </Link>
          <Link href={`/research/campaigns/${campaignSlug}/join?type=pledge`} className="px-6 py-3 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors">
            Sign Heritage Pledge
          </Link>
        </div>
      </div>
    </section>
  );
}
