import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

support_content = """import React from 'react';
import DonationFormClient from "@/app/(main)/about/donations/donate/DonationFormClient";

export default function SupportWorkflow() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">Support the Archive</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            The Heritage & Craft Revival Foundation is a non-profit initiative. Documenting oral histories, producing masterclass videos, 
            and cataloging rare objects requires significant resources. Your support directly funds our field researchers and film crews.
          </p>
        </header>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-5xl mx-auto">
          <DonationFormClient />
        </div>
      </div>
    </main>
  );
}
"""
write_page("support", support_content)

print("Updated Support page to use the full DonationFormClient wizard.")
