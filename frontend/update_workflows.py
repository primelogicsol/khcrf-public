import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Nominate an Artisan
nominate_content = """'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function NominateWorkflow() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center pt-32 pb-24">
        <div className="text-center max-w-2xl px-6">
          <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-serif text-[#3E2723] mb-4">Nomination Received</h1>
          <p className="text-gray-600 text-lg mb-8">Thank you for helping us document Kashmir's heritage. Our research team will review the nomination and reach out to the artisan for verification.</p>
          <Link href="/master-artisans/artisans" className="bg-[#3E2723] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F6F2EC] transition-colors">
            Return to Directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl flex flex-col lg:flex-row gap-16">
        
        {/* Context Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-6">Nominate a Master</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We rely on the community to help us find the hidden masters of Kashmiri craft. Many true masters do not have digital footprints. 
              By nominating an artisan, you ensure their legacy, techniques, and oral histories are permanently archived.
            </p>
            <div className="bg-white p-6 border border-gray-200">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-4">What happens next?</h4>
              <ol className="space-y-4 text-sm text-gray-500 relative border-l border-gray-200 ml-2">
                <li className="pl-6 relative">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-[#F6F2EC]"></div>
                  <strong className="text-[#3E2723] block">1. Initial Review</strong>
                  Our curation board evaluates the artisan's experience.
                </li>
                <li className="pl-6 relative">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                  <strong className="text-[#3E2723] block">2. Field Visit</strong>
                  A researcher visits their Karkhana (workshop) to document their work.
                </li>
                <li className="pl-6 relative">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-gray-300"></div>
                  <strong className="text-[#3E2723] block">3. Archiving</strong>
                  The artisan's profile and techniques are added to the public database.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="lg:w-2/3 bg-white p-8 md:p-12 shadow-sm border border-[#3E2723]/10">
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-12">
            <div className={`h-1 flex-1 ${step >= 1 ? 'bg-[#3E2723]' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 ${step >= 2 ? 'bg-[#3E2723]' : 'bg-gray-200'}`}></div>
            <div className={`h-1 flex-1 ${step >= 3 ? 'bg-[#3E2723]' : 'bg-gray-200'}`}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Artisan Details */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-serif text-[#3E2723] mb-6">Artisan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Artisan Name *</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Craft Specialization *</label>
                    <select required className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" defaultValue="">
                      <option value="" disabled>Select Craft</option>
                      <option value="pashmina">Pashmina Spinning & Weaving</option>
                      <option value="embroidery">Sozni / Crewel / Tilla</option>
                      <option value="woodwork">Walnut / Khatam-band</option>
                      <option value="metalwork">Copperware / Silverware</option>
                      <option value="papier-mache">Papier-Mâché</option>
                      <option value="carpet">Carpet Weaving</option>
                      <option value="other">Other Heritage Craft</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Location / Workshop Address *</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" placeholder="e.g., Safa Kadal, Srinagar" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Years of Experience</label>
                    <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" placeholder="e.g., 35" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)} className="mt-8 bg-[#3E2723] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F6F2EC] transition-colors">Next Step &rarr;</button>
              </div>
            )}

            {/* Step 2: Rationale */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-serif text-[#3E2723] mb-6">Nomination Rationale</h3>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Why are you nominating this artisan? *</label>
                  <p className="text-xs text-gray-400 mb-3">Please describe their unique techniques, their role in the community, or any historic lineage they belong to.</p>
                  <textarea required rows={6} className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" placeholder="Detail their mastery here..."></textarea>
                </div>
                <div className="mb-6 border-2 border-dashed border-gray-300 p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <div className="text-sm font-bold text-gray-600">Upload Photos of their work (Optional)</div>
                  <div className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="bg-gray-200 text-gray-600 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">&larr; Back</button>
                  <button type="button" onClick={() => setStep(3)} className="bg-[#3E2723] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F6F2EC] transition-colors">Next Step &rarr;</button>
                </div>
              </div>
            )}

            {/* Step 3: Nominator Details */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-serif text-[#3E2723] mb-6">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Name *</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address *</label>
                    <input required type="email" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" />
                  </div>
                </div>
                <div className="mb-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input required type="checkbox" className="mt-1 accent-[#3E2723]" />
                    <span className="text-xs text-gray-500 leading-relaxed">I consent to the HCR Foundation contacting me regarding this nomination. I verify that the information provided is accurate to the best of my knowledge.</span>
                  </label>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="bg-gray-200 text-gray-600 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors">&larr; Back</button>
                  <button type="submit" disabled={isSubmitting} className="bg-[#F6F2EC] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#3E2723] transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Complete Nomination'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
"""
write_page("nominate", nominate_content)

# 2. Submit a Story
story_content = """'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SubmitStoryWorkflow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <main className="bg-[#1A1A1A] min-h-screen flex items-center justify-center pt-32 pb-24 text-white">
        <div className="text-center max-w-2xl px-6">
          <div className="w-20 h-20 border border-[#F6F2EC] text-[#F6F2EC] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-serif text-[#F6F2EC] mb-4">Manuscript Received</h1>
          <p className="text-white/60 text-lg mb-8">Thank you for submitting your research to the Editorial board. Our editors will review your piece and contact you within 14 days.</p>
          <Link href="/master-artisans/editorial" className="bg-[#F6F2EC] text-[#1A1A1A] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
            Read Current Editorials
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#F6F2EC] mb-4">Submit a Story or Essay</h1>
          <p className="text-white/60 text-lg">We welcome submissions from historians, anthropologists, writers, and journalists focusing on Kashmiri heritage arts.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Submission Guidelines */}
          <div className="lg:w-1/3">
            <div className="bg-white/5 border border-white/10 p-6 md:p-8">
              <h3 className="text-xl font-serif text-[#F6F2EC] mb-4">Editorial Guidelines</h3>
              <ul className="space-y-4 text-sm text-white/60">
                <li><strong className="text-white">Word Count:</strong> Features should be between 1,200 and 3,000 words.</li>
                <li><strong className="text-white">Tone:</strong> Scholarly but accessible. We appreciate deep research intertwined with human narrative.</li>
                <li><strong className="text-white">Originality:</strong> Submissions must be original and unpublished elsewhere.</li>
                <li><strong className="text-white">Formatting:</strong> Please submit as a PDF or DOCX file with clear headings.</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-black/50 border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Author Name *</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#F6F2EC]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#F6F2EC]" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Story Title / Working Headline *</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#F6F2EC]" />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Pitch or Synopsis (Max 300 words) *</label>
                <textarea required rows={5} className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-[#F6F2EC]" placeholder="Briefly explain the angle and core thesis of your piece..."></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upload Manuscript or Portfolio (Optional)</label>
                <div className="border-2 border-dashed border-white/20 p-8 text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <div className="text-sm font-bold text-white/80">Click to upload DOCX or PDF</div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#F6F2EC] hover:bg-white text-[#1A1A1A] py-4 font-bold uppercase tracking-widest text-sm transition-colors disabled:opacity-50">
                {isSubmitting ? 'Sending to Editors...' : 'Submit Pitch'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("submit-story", story_content)

# 3. Become a Contributor
contrib_content = """'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ContributorWorkflow() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <main className="bg-[#FAF9F6] min-h-screen flex items-center justify-center pt-32 pb-24">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-4xl font-serif text-[#3E2723] mb-4">Application Received</h1>
          <p className="text-gray-600 text-lg mb-8">Thank you for volunteering your skills. Our curation team will review your portfolio and be in touch to discuss potential projects.</p>
          <Link href="/master-artisans" className="bg-[#3E2723] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#F6F2EC] transition-colors">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Become a Contributor</h1>
          <p className="text-gray-600 text-lg">We are actively seeking photographers, filmmakers, translators, and researchers to join our documentation efforts on the ground.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 shadow-sm border border-[#3E2723]/10">
          <h3 className="text-2xl font-serif text-[#3E2723] mb-8 border-b border-gray-100 pb-4">Professional Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name *</label>
              <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address *</label>
              <input required type="email" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Area of Expertise *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {['Photography', 'Videography', 'Translation (Kashmiri/English)', 'Field Research'].map(skill => (
                <label key={skill} className="flex items-center gap-2 text-sm text-gray-600 p-3 border border-gray-200 hover:border-[#F6F2EC] cursor-pointer transition-colors bg-gray-50">
                  <input type="checkbox" className="accent-[#3E2723]" />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Link to Portfolio / Work Samples *</label>
            <input required type="url" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]" placeholder="https://" />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Why do you want to contribute to the archive?</label>
            <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#F6F2EC]"></textarea>
          </div>

          <button type="submit" className="bg-[#3E2723] hover:bg-[#F6F2EC] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors w-full">
            Submit Application
          </button>
        </form>
      </div>
    </main>
  );
}
"""
write_page("contributor", contrib_content)

# 4. Support Documentation (Donate)
support_content = """'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function SupportWorkflow() {
  const amounts = [50, 100, 250, 500, 1000];
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(100);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#F6F2EC] mb-6">Support the Archive</h1>
          <p className="text-white/60 text-lg leading-relaxed">
            The Heritage & Craft Revival Foundation is a non-profit initiative. Documenting oral histories, producing masterclass videos, 
            and cataloging rare objects requires significant resources. Your support directly funds our field researchers and film crews.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 max-w-4xl mx-auto">
          {/* Donation Form */}
          <div className="lg:w-2/3 bg-white p-8 md:p-12 text-[#111]">
            <h3 className="text-2xl font-serif text-[#111] mb-6 border-b border-gray-200 pb-4">Make a Contribution</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Select Amount (USD)</label>
              <div className="flex flex-wrap gap-3">
                {amounts.map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`flex-1 py-3 text-lg font-bold border transition-colors ${
                      selectedAmount === amt ? 'bg-[#111] text-[#F6F2EC] border-[#111]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#111]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <button 
                    onClick={() => setSelectedAmount('custom')}
                    className={`flex-1 py-3 text-sm font-bold border transition-colors uppercase ${
                      selectedAmount === 'custom' ? 'bg-[#111] text-[#F6F2EC] border-[#111]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#111]'
                    }`}
                  >
                    Custom
                  </button>
              </div>
            </div>

            {selectedAmount === 'custom' && (
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 p-4 pl-8 text-xl font-bold focus:outline-none focus:border-[#F6F2EC]" placeholder="Enter amount" />
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Where should this go?</label>
              <select className="w-full bg-gray-50 border border-gray-200 p-4 focus:outline-none focus:border-[#F6F2EC]">
                <option>General Documentation Fund</option>
                <option>Direct Artisan Grants</option>
                <option>Film & Video Production</option>
              </select>
            </div>

            <button className="w-full bg-[#F6F2EC] hover:bg-[#111] text-[#111] hover:text-[#F6F2EC] py-4 font-bold uppercase tracking-widest text-sm transition-colors">
              Proceed to Secure Payment
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Payments are processed securely via Stripe. KHCRF is a registered 501(c)(3) organization.</p>
          </div>

          {/* Impact Info */}
          <div className="lg:w-1/3 space-y-8">
            <div>
              <div className="text-[#F6F2EC] text-3xl font-serif mb-2">$500</div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Funds a Masterclass</h4>
              <p className="text-white/60 text-sm">Covers the cost of filming, translating, and editing a 30-minute instructional video of a dying technique.</p>
            </div>
            <div>
              <div className="text-[#F6F2EC] text-3xl font-serif mb-2">$150</div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Documents an Oral History</h4>
              <p className="text-white/60 text-sm">Sends a researcher to record and transcribe the personal history of an elder artisan.</p>
            </div>
            <div className="border-t border-white/20 pt-8 mt-8">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Corporate Partnerships</h4>
              <p className="text-white/60 text-sm mb-4">We work with brands and institutions to sponsor entire heritage collections.</p>
              <Link href="mailto:partners@khcrf.org" className="text-[#F6F2EC] text-xs font-bold uppercase tracking-widest hover:underline">Contact Us &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("support", support_content)

print("Updated Nominate, Submit Story, Contributor, and Support pages with interactive workflows.")
