export default function Indicator({ label, value, type }: { label: string; value: string | number; type?: string }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <span className="text-sm font-bold text-gray-600">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {type === "trend-up" && (
          <span className="text-green-500 text-xs">▲</span>
        )}
      </span>
    </div>
  );
}
