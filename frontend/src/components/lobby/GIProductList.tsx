import { ShieldCheck, AlertTriangle, Users } from "lucide-react";

const products = [
  {
    title: "Kashmiri Pashmina",
    image:
      "https://images.unsplash.com/photo-1596468138760-705a8f4df849?q=80&w=2070&auto=format&fit=crop",
    status: 6,
    producers: 6,
    violations: 28,
  },
  {
    title: "Kashmir Hand-knotted Carpets",
    image:
      "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2076&auto=format&fit=crop",
    status: 6,
    producers: 2,
    violations: 14,
  },
  {
    title: "Kashmiri Papier-mâché",
    image:
      "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1964&auto=format&fit=crop",
    status: 8,
    producers: 4,
    violations: 14,
  },
  {
    title: "Kashmiri Walnut Wood Carving",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop",
    status: 6,
    producers: 23,
    violations: 2,
  },
  {
    title: "Kani Shawls",
    image:
      "https://images.unsplash.com/photo-1605634563891-9c1753c23363?q=80&w=2070&auto=format&fit=crop",
    status: 6,
    producers: 2,
    violations: 2,
  },
  {
    title: "Kashmiri Sozni Embroidery",
    image:
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop",
    status: 43,
    producers: 14,
    violations: 14,
  },
];

const GIProductList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        >
          <div className="h-48 relative overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-[#166534] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              GI-Certified
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-playfair font-bold text-[#050A1E] text-lg mb-4">
              {product.title}
            </h3>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="flex items-center">
                <ShieldCheck size={14} className="text-[#ca8a04] mr-2" />
                <span className="font-semibold mr-1">
                  GI Registration Status:
                </span>{" "}
                {product.status}
              </div>
              <div className="flex items-center">
                <Users size={14} className="text-[#a16207] mr-2" />
                <span className="font-semibold mr-1">
                  Authorized Producers:
                </span>{" "}
                {product.producers}
              </div>
              <div className="flex items-center">
                <AlertTriangle size={14} className="text-[#991b1b] mr-2" />
                <span className="font-semibold mr-1">
                  Recent Violations Flagged:
                </span>{" "}
                {product.violations}
              </div>
            </div>

            <button className="w-full bg-[#050A1E] hover:bg-[#451d06] text-white py-2 rounded text-sm font-bold uppercase tracking-wide transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GIProductList;
