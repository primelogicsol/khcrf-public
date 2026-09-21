"use client";
import React, { useState } from "react";
import { PARTICIPANT_CATEGORIES } from "@/lib/skc/participant-categories";
import { FaTimes, FaCheckCircle, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

const DISTRICTS = [
  "Srinagar", "Ganderbal", "Budgam", "Anantnag", "Kulgam", "Pulwama",
  "Shopian", "Baramulla", "Bandipora", "Kupwara", "Outside Kashmir"
];

const CRAFTS = [
  "Pashmina", "Carpet Weaving", "Papier Mâché", "Wood Carving",
  "Copperware", "Crewel / Chainstitch", "Kani Shawl", "Khatamband",
  "Willow Wicker", "Other"
];

const TOPICS = [
  "Wages & Livelihoods", "Raw Materials", "Export & Trade",
  "GI & Authenticity", "Skill Development", "Women in Crafts",
  "Policy & Governance", "Digital Inclusion"
];

const STAKEHOLDERS = PARTICIPANT_CATEGORIES;

const HEARING_FORMATS = [
  "In-Person Hearings",
  "Online Hearings",
  "Hybrid Hearings"
];

export default function HearingSubscriptionModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    districtsOfInterest: [] as string[],
    craftsOfInterest: [] as string[],
    topicsOfInterest: [] as string[],
    stakeholderCategory: "",
    formatPreferences: [...HEARING_FORMATS] as string[],
    notificationFrequency: "all", // "all", "weekly", "major"
    consentToNotify: false,
    privacyConsent: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckboxChange = (field: "districtsOfInterest" | "craftsOfInterest" | "topicsOfInterest" | "formatPreferences", value: string) => {
    setForm(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(i => i !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.consentToNotify || !form.privacyConsent) {
      setError("You must provide consent to receive notifications and agree to the privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/skc/hearings/subscribe", form);
      if (res.data?.success) {
        setSuccess(true);
      } else {
        setError(res.data?.error || "Submission failed. Please try again.");
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.response?.data?.error || "An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl my-8 relative max-h-[90vh] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 transition z-10"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="p-8 overflow-y-auto flex-1">
          {success ? (
            <div className="text-center py-12">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-brand-dark mb-4">Check Your Email</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                We have sent a verification link to <strong>{form.email}</strong>. 
                Please click the link in the email to activate your notification subscription.
              </p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-brand-dark mb-2">Subscribe to Hearing Notifications</h2>
              <p className="text-gray-650 mb-8">
                Subscribe to receive email alerts when public hearings matching your interests are scheduled.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.fullName}
                      onChange={e => setForm({...form, fullName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary text-gray-850"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary text-gray-850"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Districts of Interest</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DISTRICTS.map(d => (
                      <label key={d} className="flex items-center gap-2 text-sm text-gray-655 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={form.districtsOfInterest.includes(d)}
                          onChange={() => handleCheckboxChange("districtsOfInterest", d)}
                          className="rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Craft Sectors of Interest</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CRAFTS.map(c => (
                      <label key={c} className="flex items-center gap-2 text-sm text-gray-655 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={form.craftsOfInterest.includes(c)}
                          onChange={() => handleCheckboxChange("craftsOfInterest", c)}
                          className="rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Topics of Interest</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TOPICS.map(t => (
                      <label key={t} className="flex items-center gap-2 text-sm text-gray-655 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={form.topicsOfInterest.includes(t)}
                          onChange={() => handleCheckboxChange("topicsOfInterest", t)}
                          className="rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stakeholder Category (Optional)</label>
                  <select 
                    value={form.stakeholderCategory}
                    onChange={e => setForm({...form, stakeholderCategory: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary text-gray-800"
                  >
                    <option value="">Select a category</option>
                    {STAKEHOLDERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="border-t border-gray-150 pt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Hearing Format Preferences</label>
                  <p className="text-xs text-gray-505 mb-3 font-medium">Select the hearing formats you would like to receive notifications about.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {HEARING_FORMATS.map(f => (
                      <label key={f} className="flex items-center gap-2 text-sm text-gray-655 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={form.formatPreferences.includes(f)}
                          onChange={() => handleCheckboxChange("formatPreferences", f)}
                          className="rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        {f}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-150 pt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notification Frequency</label>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "Notify me about all matching hearings" },
                      { id: "weekly", label: "Weekly digest" },
                      { id: "major", label: "Major announcements only" }
                    ].map(option => (
                      <label key={option.id} className="flex items-center gap-2 text-sm text-gray-655 cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name="notificationFrequency"
                          value={option.id}
                          checked={form.notificationFrequency === option.id}
                          onChange={e => setForm({...form, notificationFrequency: e.target.value})}
                          className="text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-150 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      required
                      checked={form.consentToNotify}
                      onChange={e => setForm({...form, consentToNotify: e.target.checked})}
                      className="mt-1 rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 select-none">
                      I consent to receive email notifications regarding scheduled public hearings and updates related to the State of Kashmir Crafts assessment.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      required
                      checked={form.privacyConsent}
                      onChange={e => setForm({...form, privacyConsent: e.target.checked})}
                      className="mt-1 rounded text-brand-primary focus:ring-brand-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 select-none">
                      I agree to the KHCRF Privacy Policy and understand that my information will not be publicly displayed or shared with third parties.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : "Subscribe for Updates"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
