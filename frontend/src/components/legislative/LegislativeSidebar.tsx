"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaClipboardList,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaBullhorn,
  FaCog,
  FaLandmark,
  FaChartPie,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    name: "My Legislative Office",
    icon: FaLandmark,
    path: "/legislative-dashboard",
  },
  {
    name: "Overview",
    icon: FaChartPie,
    path: "/legislative-dashboard/overview",
  },
  {
    name: "LCAD Updates",
    icon: FaBullhorn,
    path: "/legislative-dashboard/lcad-updates",
  },
  {
    name: "CCSI Desk",
    icon: FaClipboardList,
    path: "/legislative-dashboard/ccsi",
  },
];

export default function LegislativeSidebar({
  isOpen,
  setIsOpen,
  isMobile,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isMobile: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Quick validation check, in real app rely on global state or similar
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === "ADMIN") {
        setHasAccess(true);
        setLoading(false);
        return;
      }
      try {
        const stats = await userApi.getSidebarStats();
        setHasAccess(stats.hasLegislativeOffice);
      } catch (error) {
        console.error("Failed to load sidebar stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  // If loading, just show the shell
  if (loading) return null;

  return (
    <>
      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] print:hidden
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                ${isMobile ? "w-72" : "w-72 translate-x-0"} 
                `}
      >
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl relative z-20">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/HCRF_LOGO_1.png"
                alt="KHCRF Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-brand-primary">
                Legislative Desk
              </span>
            </Link>
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaChevronLeft />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="px-4 py-6 overflow-y-auto flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 mb-4">
              Menu
            </div>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link
                  href="/profile"
                  onClick={() => {
                    if (isMobile) setIsOpen(false);
                  }}
                  className="flex items-center px-4 py-3.5 rounded-xl group transition-all duration-300 ease-out text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                >
                  <FaChevronLeft className="w-4 h-4 shrink-0 transition-colors duration-300 text-gray-400 group-hover:text-brand-primary" />
                  <span className="ml-3.5 tracking-wide text-[0.95rem] font-medium">
                    Back to Profile
                  </span>
                </Link>
              </li>
              <li className="my-2 border-t border-gray-100"></li>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      onClick={() => {
                        if (isMobile) setIsOpen(false);
                      }}
                      className={`flex items-center px-4 py-3.5 rounded-xl group transition-all duration-300 ease-out relative overflow-hidden
                          ${
                            isActive
                              ? "bg-linear-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25"
                              : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                          }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-brand-primary"}`}
                      />
                      <span
                        className={`ml-3.5 tracking-wide text-[0.95rem] ${isActive ? "font-semibold" : "font-medium"}`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div data-ui-icon className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center  text-xl overflow-hidden">
                {user?.name?.[0]?.toUpperCase() || <FaUserCircle />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {user?.role || "Member"}
                </p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
