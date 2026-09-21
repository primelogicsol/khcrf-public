import { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string;
  icon: IconType;
  trend: string;
  trendUp?: boolean;
  description: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
  color,
}: StatCardProps) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${trendUp ? "bg-green-50 text-green-600" : "bg-blue-50 text-icon-on-light"}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span
          className={`font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
        >
          {trend}
        </span>
        <span className="ml-2 text-gray-400">{description}</span>
      </div>
    </div>
  );
}
