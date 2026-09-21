"use client";

import React from "react";
import { CanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import { FaShieldAlt, FaHistory, FaDatabase, FaCopyright, FaInfoCircle, FaFileCode } from "react-icons/fa";

interface PublicationCanonicalSectionsProps {
  vm: CanonicalPublicationPresentation;
}

export default function PublicationCanonicalSections({
  vm,
}: PublicationCanonicalSectionsProps) {
  return (
    <div className="space-y-12 mt-12 pt-12 border-t border-stone-200/60">
      
      {/* 9. Rights & Permissions */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
          <FaCopyright data-ui-icon  className="" /> Rights & Permissions
        </h2>
        <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-stone-700 leading-relaxed mb-4">
            Copyright © {vm.publicationYear} {vm.publisher}. All rights reserved.
          </p>
          <p className="text-sm text-stone-700 leading-relaxed">
            This publication is protected by copyright. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.
          </p>
        </div>
      </section>

      {/* 12. Disclaimer */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
          <FaShieldAlt data-ui-icon  className="" /> Disclaimer
        </h2>
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-stone-600 leading-relaxed">
            The information contained in this publication is for general information purposes only. The information is provided by KHCRF Press and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the publication or the information, products, services, or related graphics contained within.
          </p>
        </div>
      </section>

      {/* 13. Version History */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
          <FaHistory data-ui-icon  className="" /> Version History
        </h2>
        <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200/60 text-xs uppercase text-stone-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Version</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="px-6 py-4 font-mono">{vm.edition}</td>
                <td className="px-6 py-4">{vm.publicationYear}</td>
                <td className="px-6 py-4">Original Publication ({vm.publicationCode})</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 11. Acknowledgements */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
          <FaInfoCircle data-ui-icon  className="" /> Acknowledgements
        </h2>
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-stone-700 leading-relaxed">
            The Hamadan Craft Revival Foundation (KHCRF) gratefully acknowledges the invaluable contributions of the master artisans, exporter organizations, and policy researchers who participated in the data collection and peer review for this publication. Their commitment to authentic Kashmiri luxury crafts made this research possible.
          </p>
        </div>
      </section>

      {/* 14. & 15. Digital Object & Download-ready Metadata */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-serif font-black text-brand-dark uppercase tracking-wider border-b border-stone-150 pb-2">
          <FaDatabase data-ui-icon  className="" /> Digital Object Metadata
        </h2>
        
        {/* Invisible JSON-LD Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              "name": vm.title,
              "author": vm.authors.map(a => ({ "@type": "Person", "name": a })),
              "publisher": {
                "@type": "Organization",
                "name": vm.publisher
              },
              "datePublished": vm.publicationYear,
              ...(vm.isbn ? { "isbn": vm.isbn } : {}),
              "identifier": vm.publicationCode,
              "inLanguage": vm.language,
              "bookEdition": vm.edition,
              "url": `https://khcrf.org/publications/${vm.slug}`
            })
          }}
        />

        <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
          <details className="group">
            <summary className="cursor-pointer bg-stone-50 p-4 font-black text-xs uppercase tracking-widest text-stone-600 hover:text-brand-primary flex items-center justify-between list-none">
              <span>Technical Metadata (JSON-LD)</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 border-t border-stone-200/60 bg-[#1e1e1e] overflow-x-auto">
              <pre className="text-[11px] text-green-400 font-mono">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Book",
  "name": vm.title,
  "author": vm.authors.map(a => ({ "@type": "Person", "name": a })),
  "publisher": {
    "@type": "Organization",
    "name": vm.publisher
  },
  "datePublished": vm.publicationYear,
  "isbn": vm.isbn || undefined,
  "identifier": vm.publicationCode,
  "inLanguage": vm.language,
  "bookEdition": vm.edition
}, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </section>

    </div>
  );
}
