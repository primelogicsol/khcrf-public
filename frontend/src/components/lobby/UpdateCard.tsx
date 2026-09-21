import Link from "next/link";

interface UpdateCardProps {
  title: string;
  description: string;
  tag: string;
  date: string;
  location: string;
  image: string;
  variant?: "default" | "highlight"; // Highlight for "Policy Note" style
}

const UpdateCard = ({
  title,
  description,
  tag,
  date,
  location,
  image,
  variant = "default",
}: UpdateCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="p-6 pb-2">
        <h2 className="text-xl px-1 font-bold text-[#1e3a8a] mb-3">
          {/* Note: Title color in image is blue. Changing to brand primary. */}
          <span className="text-[#050A1E] text-xl font-bold font-playfair">
            {title}
          </span>
        </h2>

        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-[#fcd34d] text-[#78350f] text-xs font-bold px-3 py-1 rounded">
            {tag}
          </span>
          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {date} <span className="mx-1">:</span> {location}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {description}
            </p>
            <div className="flex items-center text-xs text-slate-500 space-x-4 mb-4">
              <span className="font-semibold">Dated :</span>
              <span>Mar</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-48 h-32 shrink-0 rounded overflow-hidden relative border border-slate-100">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
        <button className="bg-[#050A1E] hover:bg-[#451d06] text-white text-xs font-bold py-2 px-4 rounded transition-colors">
          {tag === "Policy Statement"
            ? "Read More"
            : tag === "Meeting Alert"
              ? "View Details"
              : "View Report"}
        </button>
      </div>
    </div>
  );
};

export default UpdateCard;
