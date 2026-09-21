import { Share2, Tag, Search, ShieldAlert } from "lucide-react";

const tips = [
  {
    title: "Check the GI Label",
    desc: "Genuine Kashmiri handicrafts often carry a GI (Geographical Indication) tag. Use the secure QR code on the tag to verify authenticity instantly on our portal.",
    icon: <Tag size={32} className="text-[#166534]" />,
  },
  {
    title: "Inspect the Weave/Texture",
    desc: "Handmade Pashmina has a distinct irregular weave pattern when held against light. Machine-made versions are perfectly uniform. Feel for softness and warmth.",
    icon: <Search size={32} className="text-[#ca8a04]" />,
  },
  {
    title: "Price Discrepancies",
    desc: "Authentic craftsmanship takes time and skill. If a price seems too good to be true, it likely is. Counterfeits are often sold at a fraction of the market value.",
    icon: <ShieldAlert size={32} className="text-[#991b1b]" />,
  },
  {
    title: "Test the Material",
    desc: "Real silk and wool burn differently than synthetic fibers. While we don't recommend burning merchandise, learning about fiber properties can help identification.",
    icon: <Share2 size={32} className="text-[#050A1E]" />,
  },
];

const CounterfeitTips = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
      <h2 className="text-2xl font-playfair font-bold text-[#050A1E] mb-6">
        How to Identify Fake Goods
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded shadow-sm flex items-start space-x-4"
          >
            <div className="shrink-0 p-3 bg-slate-100 rounded-full">
              {tip.icon}
            </div>
            <div>
              <h3 className="font-bold text-[#050A1E] text-lg mb-2">
                {tip.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {tip.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#e0e7ff] p-6 rounded-lg flex flex-col md:flex-row items-center justify-between border border-[#c7d2fe]">
        <div className="mb-4 md:mb-0">
          <h4 className="font-bold text-[#1e3a8a] text-lg">Still unsure?</h4>
          <p className="text-sm text-[#1e3a8a]/80">
            Our experts can help verify your purchase.
          </p>
        </div>
        <button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-2 rounded font-bold text-sm shadow-sm transition-colors">
          Contact Verification Cell
        </button>
      </div>
    </div>
  );
};

export default CounterfeitTips;
