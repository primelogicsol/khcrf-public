import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface CampaignPreviewCardProps {
  title: string;
  hashtags: string[]; // Expecting array of strings or comma-separated string handled by parent
  link?: string;
  className?: string;
  overlayText?: string;
}

export default function CampaignPreviewCard({
  title,
  hashtags,
  link,
  className = "",
  overlayText = "KHCRF Campaigning",
}: CampaignPreviewCardProps) {
  // Ensure we have something to display
  const displayTitle = title || "Campaign Title";
  const displayHashtags =
    hashtags.length > 0 ? hashtags : ["#HashtagOne", "#HashtagTwo"];

  const CardContent = () => (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg aspect-[4/5] bg-linear-to-br from-brand-blue/90 to-black ${className} group`}
    >
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 opacity-20  mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[50px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-secondary/20 blur-[60px] rounded-full" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
        {/* Top Label */}
        <div className="border-l-4 border-[var(--card-left-accent)] pl-4">
          <span className="block text-white/50 font-bold tracking-widest uppercase text-xs mb-1">
            {overlayText}
          </span>
          <h2 className="text-white font-playfair font-black text-2xl leading-tight line-clamp-3">
            {displayTitle}
          </h2>
        </div>

        {/* Dynamic Center Element (Optional visual balance) */}
        <div className="grow flex items-center justify-center opacity-10">
          <div className="text-9xl font-black text-white stroke-text tracking-tighter">
            #
          </div>
        </div>

        {/* Bottom Hashtags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {displayHashtags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs md:text-sm font-bold tracking-wide border border-white/5"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>

          {link && (
            <div className="inline-flex items-center text-white/50 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-colors">
              <span>View Campaign</span>
              <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link
        href={link}
        className="block h-full"
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
