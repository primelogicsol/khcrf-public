"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaUpload } from "react-icons/fa";
import { CAMPAIGN_TOPICS } from "@/data/campaigns-data";
import { ADVOCACY_TOPICS } from "@/data/advocacy-data";
import { notFound } from "next/navigation";

interface JoinCampaignClientProps {
  slug: string;
  initialType: string;
}

export default function JoinCampaignClient({ slug, initialType }: JoinCampaignClientProps) {
  const [formType, setFormType] = useState(initialType);
  const [submitted, setSubmitted] = useState(false);

  const campaign = CAMPAIGN_TOPICS.find((t) => t.slug === slug) || ADVOCACY_TOPICS.find((t) => t.slug === slug);
  if (!campaign) return notFound();

  const isAdvocacy = ADVOCACY_TOPICS.some((t) => t.slug === slug);
  const backLink = isAdvocacy ? `/research/advocacy/${slug}` : `/research/campaigns/${slug}`;

  const handleTypeChange = (type: string) => {
    setFormType(type);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formTitles: Record<string, string> = {
    supporter: "Join as Campaign Supporter",
    volunteer: "Apply as Campaign Volunteer",
    partner: "Become a Campaign Partner",
    story: "Submit a Heritage Story",
    school: "Enroll Your School",
    ambassador: "Apply as Heritage Ambassador",
    pledge: "Sign The Heritage Pledge",
  };

  const currentTitle = formTitles[formType] || formTitles.supporter;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-primary font-bold text-sm uppercase tracking-widest transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Campaign
          </Link>
          <div className="bg-white p-6 md:p-10 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-1">
              <span data-editorial-accent-text className="block  font-bold tracking-widest uppercase text-xs mb-2">
                Campaign Enrollment
              </span>
              <h1 className="text-2xl md:text-3xl font-black mb-2 text-stone-900 font-playfair">
                {campaign.title}
              </h1>
              <p className="text-stone-500 text-sm">
                Select how you'd like to participate in this campaign.
              </p>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:w-64">
              <button
                onClick={() => handleTypeChange("supporter")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "supporter"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Supporter
              </button>
              <button
                onClick={() => handleTypeChange("volunteer")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "volunteer"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Volunteer
              </button>
              <button
                onClick={() => handleTypeChange("partner")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "partner"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Partner
              </button>
              <button
                onClick={() => handleTypeChange("story")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "story"
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Submit Story
              </button>
              <button
                onClick={() => handleTypeChange("ambassador")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "ambassador"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Ambassador
              </button>
              <button
                onClick={() => handleTypeChange("school")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "school"
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                School
              </button>
              <button
                onClick={() => handleTypeChange("pledge")}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-bold rounded border transition-colors ${
                  formType === "pledge"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-white text-stone-600 border-stone-200 hover:border-brand-primary"
                }`}
              >
                Pledge
              </button>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="bg-stone-900 text-white p-6 md:p-8">
            <h2 className="text-2xl font-playfair font-bold">{currentTitle}</h2>
          </div>

          {submitted ? (
            <div className="p-12 text-center">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-stone-900 mb-2 font-playfair">
                {formType === "story" ? "Story Submitted!" : formType === "pledge" ? "Pledge Signed!" : "Application Received!"}
              </h3>
              <p className="text-stone-500 max-w-md mx-auto mb-8">
                {formType === "supporter" && "You are now officially a campaign supporter. You will start receiving updates soon."}
                {formType === "volunteer" && "Thank you for applying to volunteer! Our campaign coordinators will review your application and reach out shortly."}
                {formType === "partner" && "Thank you for your interest in partnering. The KHCRF team will review your organization's application."}
                {formType === "school" && "Thank you for enrolling your school! Our education coordinators will contact you with toolkit details."}
                {formType === "story" && "Thank you for sharing your heritage story! It is currently under review by our editorial team."}
                {formType === "ambassador" && "Your ambassador application has been submitted for review."}
                {formType === "pledge" && "Thank you for taking the Heritage Pledge! Your commitment makes a difference."}
              </p>
              <Link
                href={backLink}
                className="inline-block px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
              >
                Return to Campaign
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              {/* Supporter Form */}
              {formType === "supporter" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Full Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="jane@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Phone Number (Optional)</label>
                      <input type="tel" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="+91..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Country / Region</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Kashmir, India" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Craft Interest</label>
                    <input type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. Pashmina, Walnut Wood Carving" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-4">How would you like to support?</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {["Receive updates", "Share campaign", "Attend online events", "Support awareness drives"].map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:border-brand-primary">
                          <input type="checkbox" className="w-5 h-5 accent-brand-primary" />
                          <span className="text-sm text-stone-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg text-sm text-stone-500 flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                    <p>By joining, you will be auto-approved as a <strong>Campaign Supporter</strong>.</p>
                  </div>
                </>
              )}

              {/* Volunteer Form */}
              {formType === "volunteer" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Full Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Phone</label>
                      <input required type="tel" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Location</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Availability</label>
                    <select required className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white">
                      <option value="">Select availability...</option>
                      <option>A few hours a week</option>
                      <option>10+ hours a week</option>
                      <option>Event-based only</option>
                      <option>Weekends only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-4">Skills (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Community outreach", "Social media", "Writing", "Design", "Events", "Translation", "Photography", "Research"].map((skill, i) => (
                        <label key={i} className="flex items-center gap-2 p-2 border border-stone-200 rounded-lg cursor-pointer hover:border-brand-primary text-xs">
                          <input type="checkbox" className="w-4 h-4 accent-brand-primary" />
                          <span className="text-stone-700 font-medium">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Previous volunteer experience</label>
                    <textarea rows={3} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Briefly describe your experience..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Why do you want to volunteer for this campaign?</label>
                    <textarea required rows={4} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Share your motivation..."></textarea>
                  </div>
                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
                    <p>Volunteer applications require admin review before approval. Upon approval, you will receive the <strong>Campaign Volunteer</strong> role.</p>
                  </div>
                </>
              )}

              {/* Partner Form */}
              {formType === "partner" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Organization Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Organization Type</label>
                      <select required className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white">
                        <option value="">Select type...</option>
                        {["School", "University", "NGO", "Museum", "Cultural group", "Media organization", "Corporate sponsor", "Artisan collective"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Contact Person</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Official Email</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Phone</label>
                      <input required type="tel" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Website</label>
                      <input type="url" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="https://" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Country / District</label>
                    <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Partnership Type</label>
                    <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. Funding, Educational, Media, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">How can your organization support?</label>
                    <textarea required rows={4} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Describe the proposed collaboration..."></textarea>
                  </div>
                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
                    <p>Partner applications require KHCRF review. Once approved, your organization will hold the <strong>Campaign Partner</strong> role.</p>
                  </div>
                </>
              )}

              {/* Story Form */}
              {formType === "story" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-900 mb-2">Story Title</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-lg font-playfair" placeholder="A Masterpiece Lost to Time..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Your Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Craft Type</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. Papier-mâché, Copperware" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Village / District</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Person or Family Connected to the Story</label>
                    <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Names of the artisans or ancestors..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Story Text</label>
                    <textarea required rows={8} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed" placeholder="Share the heritage, the memories, and the legacy..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Upload Photo (Optional)</label>
                    <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center hover:bg-stone-50 hover:border-brand-primary transition-colors cursor-pointer">
                      <FaUpload className="text-3xl text-stone-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-stone-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-stone-500 mt-1">PNG, JPG, or PDF up to 10MB</p>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer">
                      <input required type="checkbox" className="w-5 h-5 accent-brand-primary mt-0.5" />
                      <span className="text-sm text-stone-700">
                        <strong>Consent to Publish:</strong> I verify that I own the rights to this story and any provided media, and I grant the campaign permission to publish this story in the Heritage Story Archive.
                      </span>
                    </label>
                  </div>
                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
                    <p>Submitted stories enter an editorial review queue. Status progression: Submitted &rarr; Under Review &rarr; Published.</p>
                  </div>
                </>
              )}

              {/* Ambassador Form (Bonus, mapping similar to Volunteer but higher stakes) */}
              {formType === "ambassador" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Full Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-900 mb-2">Professional Background / Influence Area</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. Journalist, Academic, Social Media Influencer" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-900 mb-2">Why do you want to be an Ambassador?</label>
                      <textarea required rows={4} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"></textarea>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
                    <p>Ambassador applications undergo strict review. Approved ambassadors receive dashboard access, reporting tools, and event management permissions.</p>
                  </div>
                </>
              )}

              {/* School Form */}
              {formType === "school" && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">School Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Principal / Contact Person</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Phone</label>
                      <input required type="tel" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">District / City</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Number of Students</label>
                      <input required type="number" min="1" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. 500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-900 mb-2">Integration Plan</label>
                      <textarea required rows={4} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="How do you plan to bring the campaign to your classrooms? (e.g. workshops, assemblies)"></textarea>
                    </div>
                  </div>
                  <div className="bg-stone-50 p-4 border border-stone-200 rounded-lg text-sm text-stone-500 flex items-start gap-3">
                    <i className="fa-solid fa-graduation-cap text-brand-primary mt-0.5 shrink-0" />
                    <p>Enrolled schools will receive the official Campaign Education Toolkit and be listed in our public progress report.</p>
                  </div>
                </>
              )}

              {/* Pledge Form */}
              {formType === "pledge" && (
                <>
                  <div className="bg-stone-900 p-8 rounded-xl text-center mb-8 relative overflow-hidden">
                    
                    <p className="text-xl md:text-2xl font-playfair italic leading-relaxed text-amber-100 relative z-10">
                      "I pledge to support, preserve, promote, and celebrate Kashmir's craft heritage."
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Full Name</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-900 mb-2">Email Address</label>
                      <input required type="email" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-stone-900 mb-2">Country / Region</label>
                      <input required type="text" className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none" placeholder="e.g. Kashmir, India" />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-200 rounded-lg cursor-pointer">
                      <input required type="checkbox" className="w-5 h-5 accent-brand-primary mt-0.5" />
                      <span className="text-sm text-stone-700">
                        <strong>I agree:</strong> By submitting this form, my name will be added to the public register of Heritage Pledges.
                      </span>
                    </label>
                  </div>
                </>
              )}

              <hr className="border-stone-200" />
              
              <div className="flex justify-end">
                <button type="submit" className="px-8 py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-amber-500 transition-colors shadow-lg">
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
