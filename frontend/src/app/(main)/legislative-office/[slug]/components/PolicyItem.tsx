export default function PolicyItem({ issue, status, color }: any) {
  return (
    <li className="flex justify-between items-center text-sm">
      <span className="font-bold text-gray-700">{issue}</span>
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${color}`}
      >
        {status}
      </span>
    </li>
  );
}
