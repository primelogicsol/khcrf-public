export default function MetricCard({ label, value, sub, highlight }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${highlight ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : "bg-white border-gray-200 shadow-sm"}`}
    >
      <h4
        className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? "text-white/80" : "text-gray-400"}`}
      >
        {label}
      </h4>
      <div className="text-3xl font-black mb-1 font-playfair">{value}</div>
      <div
        className={`text-xs font-medium ${highlight ? "text-white/90" : "text-gray-500"}`}
      >
        {sub}
      </div>
    </div>
  );
}
