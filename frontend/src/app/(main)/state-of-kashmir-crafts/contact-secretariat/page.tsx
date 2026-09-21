import React from 'react';
import { Metadata } from 'next';
import SecretariatContactClient from './SecretariatContactClient';

export const metadata: Metadata = {
  title: 'Contact the Assessment Secretariat | State of Kashmir Crafts | KHCRF',
  description: 'Contact the State of Kashmir Crafts assessment secretariat for Official Message submission assistance, verification queries, editorial questions, or institutional correspondence.',
};

export default function SecretariatContactPage() {
  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden bg-brand-primary text-white shadow-md">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-amber-300 uppercase border border-amber-300/30 rounded-[12px] bg-amber-500/10">
            STATE OF KASHMIR CRAFTS
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Contact the Assessment Secretariat
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto leading-relaxed font-semibold">
            For Official Message submission assistance, verification queries, editorial questions, or institutional correspondence.
          </p>
        </div>
      </section>

      {/* Main Support Client Accordion, Search and Forms */}
      <section className="-mt-8 relative z-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 md:p-4">
            <SecretariatContactClient />
          </div>
        </div>
      </section>
    </main>
  );
}
