"use client";

import Image from "next/image";

interface FeatureSectionProps {
  category: string;
  title: string;
  description: string | React.ReactNode;
  quote?: string;
  imagePath: string;
  imageAlt: string;
  align?: "left" | "right"; // Image alignment
  overlayImage?: string; // Optional overlay image for depth
  isDark?: boolean; // Dark mode variant
  children?: React.ReactNode; // Extra content (lists, buttons)
}

export default function FeatureSection({
  category,
  title,
  description,
  quote,
  imagePath,
  imageAlt,
  align = "right",
  overlayImage,
  isDark,
  children,
}: FeatureSectionProps) {
  const bgColor = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-brand-dark";
  const subtextColor = isDark ? "text-gray-400" : "text-gray-600";
  const categoryColor = isDark ? "text-white" : "text-brand-primary";

  return (
    <section
      className={`py-16 lg:py-32 ${bgColor} relative overflow-hidden font-manrope`}
    >
      {isDark && (
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      )}

      <div className="container mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div
            className={`lg:col-span-6 ${align === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}
          >
            <span
              className={`${categoryColor} font-black uppercase tracking-widest text-sm mb-3 md:mb-4 block`}
            >
              {category}
            </span>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-black ${textColor} mb-6 md:mb-8 leading-tight`}
            >
              {title}
            </h2>

            <div
              className={`prose prose-stone md:prose-lg ${subtextColor} mb-8 md:mb-10`}
            >
              {typeof description === "string" ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            {quote && (
              <div
                className={`${isDark ? "bg-white/5" : "bg-[#f8f5f2]"} p-6 md:p-8 rounded-2xl border-l-4 border-[var(--card-left-accent)] mb-8`}
              >
                <p
                  className={`${isDark ? "text-white" : "text-brand-dark"} font-bold font-serif italic text-lg md:text-xl leading-relaxed`}
                >
                  "{quote}"
                </p>
              </div>
            )}

            {children}
          </div>

          {/* Image Content */}
          <div
            className={`lg:col-span-6 ${align === "left" ? "order-1 lg:order-1" : "order-1 lg:order-2"} relative`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 group hover:scale-[1.01]">
              <div
                className={`absolute inset-0 ${isDark ? "bg-brand-dark/10" : "bg-brand-dark/5"} z-10 pointer-events-none group-hover:bg-transparent transition-colors`}
              ></div>
              <Image
                src={imagePath}
                alt={imageAlt}
                width={800}
                height={1000}
                className="w-full h-auto object-cover"
              />
            </div>
            {overlayImage && (
              <div className="absolute -bottom-10 -right-10 w-[60%] border-4 border-white dark:border-gray-800 rounded-xl shadow-2xl z-20 hidden md:block">
                <Image
                  src={overlayImage}
                  alt="Detail View"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
