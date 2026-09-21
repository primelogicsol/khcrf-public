import React from 'react';

export const metadata = {
  title: 'Photo-Essays | Hamadan Craft Revival Foundation',
  description: 'Documenting the living custodians of Kashmir’s craft traditions.',
};

export default function Page() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A]">
      <section className="pt-32 pb-16 px-4 md:px-10 container-fluid mx-auto universal-hero">
        <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">Photo-Essays</h1>
        <p className="text-xl max-w-3xl">Welcome to the Photo-Essays page.</p>
      </section>
    </main>
  );
}
