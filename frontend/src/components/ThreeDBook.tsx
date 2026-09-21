import Link from "next/link";
import Image from "next/image";
import { FaLock, FaArrowRight } from "react-icons/fa";

interface ThreeDBookProps {
  title: string;
  imagePath: string; // e.g. "1.png"
  subtitle?: string;
  link: string;
}

export default function ThreeDBook({
  title,
  imagePath,
  subtitle = "Scientific Study",
  link,
}: ThreeDBookProps) {
  return (
    <div className="group perspective-2000">
      <div className="relative aspect-1410/2250">
        {/* The Book Content (Visible after flip) */}
        <div className="absolute inset-0 bg-[#fdfdfd] rounded-r-lg shadow-inner flex flex-col items-center justify-center p-6 text-center z-0 border-y border-r border-gray-100 overflow-hidden">
          {/* Faint Blurred Cover Preview Inside */}
          <div className="absolute inset-0 opacity-[0.07] blur-2xl scale-150 transform-gpu">
            <Image
              src={`/assets/images/craft_cover/${imagePath}`}
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div data-ui-icon className="bg-brand-primary/10  p-4 rounded-full mb-4 shadow-inner">
              <FaLock className="text-xl" />
            </div>
            <p data-editorial-accent-text className=" font-black uppercase tracking-widest text-[10px] mb-3">
              Members Only Content
            </p>
            <Link
              href={link}
              className="px-6 py-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-primary transition-all duration-300 shadow-lg"
            >
              Unlock Now
            </Link>
          </div>
        </div>

        {/* Front Cover Container (Flips Open) */}
        <div className="absolute inset-0 z-10 origin-left transition-all duration-800 ease-out preserve-3d group-hover:rotate-y-[-115deg]">
          {/* Front Face of Cover */}
          <div className="absolute inset-0 backface-hidden z-20 rounded-r-lg overflow-hidden border-y border-r border-gray-100 shadow-[10px_20px_40px_-15px_rgba(0,0,0,0.3)]">
            {/* Spine Shadow on Cover */}
            <div className="absolute top-0 left-0 w-6 h-full bg-linear-to-r from-black/20 via-black/10 to-transparent z-20" />
            <div className="absolute top-0 left-3 w-px h-full bg-white/10 z-20" />

            <Image
              src={`/assets/images/craft_cover/${imagePath}`}
              alt={title}
              fill
              className="object-cover"
            />

            {/* Gloss effect on cover */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Back Face of Cover (Visible when flipped) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-200 rounded-l-lg border-y border-l border-gray-300 z-10 flex items-center justify-center">
            {/* Paper Texture / Inner Cover Aesthetic */}
            {/* Removed background pattern per global rule */}
            <div className="absolute inset-0 bg-linear-to-r from-black/5 to-transparent shadow-inner" />
          </div>
        </div>

        {/* Pages Thickness Shadow (Visible when closed) */}
        <div className="absolute top-[2%] -right-2 w-2 h-[96%] bg-gray-200 rounded-r shadow-inner z-0 group-hover:opacity-0 transition-opacity duration-300" />
      </div>

      <div className="mt-10 text-center">
        <h4 className="text-xl font-black text-brand-dark tracking-tight mb-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h4>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
