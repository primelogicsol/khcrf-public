import React from "react";

export default function HiringProcess({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
}) {
  return (
    <section
      className={`${isEmbedded ? "py-8 bg-white text-gray-900 rounded-2xl" : "py-24 bg-brand-dark text-white"}`}
    >
      <div className={`${isEmbedded ? "" : "container mx-auto px-4 md:px-10"}`}>
        <div className="text-center mb-16">
          <span
            className={`font-bold uppercase tracking-widest text-xs py-1 px-3 rounded-full border ${isEmbedded ? "bg-brand-primary/5 text-brand-primary border-brand-primary/10" : "bg-brand-primary/10 text-white border-brand-primary/20"}`}
          >
            Our Process
          </span>
          <h2 className="text-4xl font-extrabold mt-3">Our Hiring Process</h2>
          <p
            className={`${isEmbedded ? "text-gray-600" : "text-gray-400"} mt-4 max-w-2xl mx-auto`}
          >
            Transparent, candidate-friendly process designed to find the best
            mutual fit.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              step: 1,
              title: "Application Review",
              desc: "We review all applications within 5-7 business days and respond to everyone.",
              time: "5-7 days",
            },
            {
              step: 2,
              title: "Initial Screening",
              desc: "A brief video call to discuss your background, interests, and the role.",
              time: "30 minutes",
            },
            {
              step: 3,
              title: "Technical/Skills Assessment",
              desc: "Depending on the role, this could be a coding challenge, case study, or portfolio review.",
              time: "1-3 days",
            },
            {
              step: 4,
              title: "Team Interview",
              desc: "Meet the team you'll work with. This is a two-way conversation to ensure mutual fit.",
              time: "45-60 minutes",
            },
            {
              step: 5,
              title: "Final Discussion",
              desc: "Chat with leadership about compensation, expectations, and answer any remaining questions.",
              time: "30 minutes",
            },
            {
              step: 6,
              title: "Offer & Onboarding",
              desc: "If we're a great match, we'll extend an offer and begin the onboarding process!",
              time: "Same day",
            },
          ].map((step) => (
            <div
              key={step.step}
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border rounded-xl transition-colors ${isEmbedded ? "bg-gray-50 border-gray-100 hover:shadow-md" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
            >
              <div
                className={`w-16 h-16 shrink-0 bg-brand-primary/10 rounded-full flex items-center justify-center text-2xl group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shadow-md ${isEmbedded ? "text-icon-on-light" : "text-white"}`}
              >
                {step.step}
              </div>
              <div className="grow">
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p
                  className={`${isEmbedded ? "text-gray-600" : "text-gray-400"} text-sm`}
                >
                  {step.desc}
                </p>
              </div>
              <div
                className={`text-xs font-mono bg-brand-primary/10 px-3 py-1 rounded border border-brand-primary/20 whitespace-nowrap ${isEmbedded ? "text-brand-primary" : "text-white"}`}
              >
                {step.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
