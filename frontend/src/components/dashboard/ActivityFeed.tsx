import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaUserPlus,
  FaFileAlt,
  FaMoneyBillWave,
  FaHandshake,
  FaBriefcase,
} from "react-icons/fa";
import { adminApi } from "@/lib/api";

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await adminApi.getRecentActivity();
        
        // Safely unwrap unified formatter wrapper or fallback to empty array
        const rawActivities = response?.data?.data ?? response?.data ?? response;
        const activitiesArray = Array.isArray(rawActivities) ? rawActivities : [];
        
        setActivities(activitiesArray);
      } catch (error: any) {
        setActivities([]);
        console.error("[ACTIVITY FEED RENDER ERROR]", {
          message: error.message,
          stack: error.stack,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getIconAndColor = (type: string) => {
    switch (type) {
      case "user":
        return { icon: FaUserPlus, color: "bg-purple-100 text-purple-600" };
      case "partner":
        return { icon: FaHandshake, color: "bg-blue-100 text-blue-600" };
      case "grant":
        return { icon: FaFileAlt, color: "bg-green-100 text-green-600" };
      case "job":
        return { icon: FaBriefcase, color: "bg-orange-100 text-orange-600" };
      case "donation":
        return {
          icon: FaMoneyBillWave,
          color: "bg-yellow-100 text-yellow-600",
        };
      default:
        return { icon: FaCheckCircle, color: "bg-gray-100 text-gray-600" };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 1) return `Just now`;
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return `Yesterday`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm h-full max-h-[600px] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activities.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon: Icon, color } = getIconAndColor(activity.type);
            return (
              <div
                key={activity.id}
                className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(activity.time)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
