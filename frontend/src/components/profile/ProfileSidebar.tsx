"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaClipboardList,
  FaFileAlt,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaBullhorn,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaCertificate,
  FaIdCard,
  FaCog,
  FaHandHoldingHeart,
  FaHandshake,
  FaUserGraduate,
  FaLandmark,
  FaBook,
  FaPlus,
} from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";

// Type definition for menu items
interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  children?: {
    name: string;
    path: string;
    icon?: React.ElementType;
    group?: string;
  }[];
}

const menuItems: MenuItem[] = [
  { name: "Overview", icon: FaHome, path: "/profile" },
  {
    name: "Research & Policy",
    icon: FaLandmark,
    path: "/legislative-dashboard",
    children: [
      {
        name: "Legislative Dashboard",
        path: "/legislative-dashboard",
        icon: FaLandmark,
      },
    ],
  },
  {
    name: "Reader Bookshelf",
    icon: FaBook,
    path: "/profile/library",
    children: [
      { name: "My Library", path: "/profile/library", icon: FaBook },
    ],
  },
  {
    name: "Business Support",
    icon: MdBusinessCenter,
    path: "/profile/activities",
    children: [
      {
        name: "My Evaluations",
        path: "/profile/evaluations",
        icon: FaClipboardCheck,
      },
      { name: "My Grants", path: "/profile/grants", icon: FaMoneyBillWave },
      {
        name: "My Accreditations",
        path: "/profile/accreditations",
        icon: FaCertificate,
      },
      {
        name: "My Certifications",
        path: "/profile/certifications",
        icon: FaCertificate,
      },
    ],
  },
  {
    name: "About KHCRF",
    icon: FaHandshake,
    path: "/profile/engagement",
    children: [
      { name: "My Membership", path: "/profile/membership", icon: FaIdCard },
      {
        name: "My Donations",
        path: "/profile/donations",
        icon: FaHandHoldingHeart,
      },
      {
        name: "My Partnership",
        path: "/profile/partner-network",
        icon: FaHandshake,
      },
      {
        name: "My Apprenticeship",
        path: "/profile/apprenticeship",
        icon: FaUserGraduate,
      },
      { name: "My Submissions", path: "/profile/submissions", icon: FaFileAlt },
    ],
  },
];

export default function ProfileSidebar({
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [sidebarStats, setSidebarStats] = useState<{
    hasPurchases: boolean;
    hasDonations: boolean;
    hasCertifications: boolean;
    hasAccreditations: boolean;
    hasGrants: boolean;
    hasEvaluations: boolean;
    hasLegislativeOffice: boolean;
    hasPartnership: boolean;
    hasApprenticeship: boolean;
    hasPublications: boolean;
    isMember: boolean;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Close submenu when path changes
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  // Fetch sidebar stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await userApi.getSidebarStats();
        console.log("Sidebar Stats Debug:", stats); // DEBUG: Check what the API returns
        setSidebarStats(stats);
      } catch (error) {
        console.error("Failed to load sidebar stats:", error);
        // On error, maybe show nothing or defaults? For now assume nothing.
      } finally {
        setLoadingStats(false);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  const filterMenu = (items: MenuItem[]) => {
    if (!sidebarStats) return items.filter((item) => item.name === "Overview"); // Show only Overview if loading or no data? Or maybe show "About KHCRF" always?

    const filtered: MenuItem[] = [];

    items.forEach((item) => {
      if (item.name === "Overview") {
        filtered.push(item);
        return;
      }

      // Check children
      if (item.children) {
        const visibleChildren = item.children.filter((child) => {
          if (
            child.name === "My Legislative Office" ||
            child.name === "CCSI Desk" ||
            child.name === "Overview Setup" ||
            child.name === "LCAD Updates" ||
            child.name === "Legislative Dashboard"
          ) {
            return sidebarStats?.hasLegislativeOffice || user?.role === "ADMIN";
          }
          if (child.name === "My Library") return sidebarStats?.hasPurchases;
          if (child.name === "My Publications")
            return (
              sidebarStats?.hasPublications ||
              user?.role === "COLLABORATOR_EBOOKS" ||
              user?.role === "ADMIN"
            );
          if (child.name === "Add Publication")
            return (
              user?.role === "COLLABORATOR_EBOOKS" || user?.role === "ADMIN"
            );
          if (child.name === "My Evaluations")
            return sidebarStats?.hasEvaluations;
          if (child.name === "My Grants") return sidebarStats?.hasGrants;
          if (child.name === "My Accreditations")
            return sidebarStats?.hasAccreditations;
          if (child.name === "My Certifications")
            return sidebarStats?.hasCertifications;
          if (child.name === "My Membership") return sidebarStats?.isMember;
          if (child.name === "My Donations") return sidebarStats?.hasDonations;
          if (child.name === "My Partnership")
            return sidebarStats?.hasPartnership;
          if (child.name === "My Apprenticeship")
            return sidebarStats?.hasApprenticeship;
          if (child.name === "My Submissions") return false; // Contact submissions not in user stats yet?
          return false;
        });

        if (visibleChildren.length > 0) {
          // Create a new object to avoid mutating original menuItems
          filtered.push({ ...item, children: visibleChildren });
        }
      }
    });

    return filtered;
  };

  // Only filter if we have stats, otherwise show loading skeleton or nothing?
  // User asked: "if user purchased any book then my library enable... else not"
  // So default should be hidden.
  const filteredItems = loadingStats
    ? menuItems.filter((i) => i.name === "Overview")
    : filterMenu(menuItems);

  // Determine active parent based on current path
  const isParentActive = (item: MenuItem) => {
    if (pathname === item.path) return true;
    if (item.children) {
      return item.children.some(
        (child) =>
          pathname === child.path || pathname.startsWith(child.path + "/"),
      );
    }
    return pathname.startsWith(item.path + "/");
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      if (activeMenu === item.name) {
        setActiveMenu(null);
      } else {
        setActiveMenu(item.name);
      }
    } else {
      setActiveMenu(null);
    }
  };

  const activeSubmenu = filteredItems.find((item) => item.name === activeMenu);

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
              <span className="text-xl font-bold text-brand-primary">KHCRF</span>
            </Link>
            {isMobile && (
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaChevronLeft />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="px-4 py-2 overflow-y-auto flex-1">
            <ul className="space-y-1.5 font-medium">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = isParentActive(item);
                const isPanelOpen = activeMenu === item.name;

                return (
                  <li key={item.name}>
                    {item.children ? (
                      <button
                        onClick={() => handleMenuClick(item)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl group transition-all duration-300 ease-out relative overflow-hidden
                                                ${
                                                  isActive || isPanelOpen
                                                    ? "bg-linear-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25"
                                                    : "text-gray-500 hover:bg-gray-50 hover:text-brand-primary"
                                                }`}
                      >
                        <div className="flex items-center">
                          <Icon
                            className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive || isPanelOpen ? "text-white" : "text-gray-400 group-hover:text-brand-primary"}`}
                          />
                          <span
                            className={`ml-3.5 tracking-wide text-[0.95rem] ${isActive || isPanelOpen ? "font-semibold" : "font-medium"}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <FaChevronRight
                          className={`w-3 h-3 transition-transform duration-300 ${isPanelOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={() => {
                          if (isMobile) setIsOpen(false);
                          setActiveMenu(null);
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
                    )}
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
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Secondary Flyout Panel */}
      <div
        className={`fixed top-0 z-50 h-screen bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out transform print:hidden
                ${activeSubmenu && isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
                ${isMobile ? "left-0 w-72" : "left-72 w-64"}
                `}
      >
        {activeSubmenu && (
          <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl p-6">
            <div className="mb-6 pb-4 border-b border-gray-100">
              {isMobile && (
                <button
                  onClick={() => setActiveMenu(null)}
                  className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-4 hover:text-brand-primary transition-colors"
                >
                  <FaChevronLeft className="w-3 h-3" /> Back to Main Menu
                </button>
              )}
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <activeSubmenu.icon className="text-brand-secondary" />
                {activeSubmenu.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Select an option</p>
            </div>

            <ul className="space-y-2">
              {activeSubmenu.children?.reduce(
                (acc: any[], child, index, array) => {
                  const isChildActive =
                    pathname === child.path ||
                    pathname.startsWith(child.path + "/");
                  const prevGroup = index > 0 ? array[index - 1].group : null;
                  const showGroupHeader =
                    child.group && child.group !== prevGroup;

                  if (showGroupHeader) {
                    acc.push(
                      <li key={`group-${child.group}`} className="pt-2 pb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pl-2">
                          {child.group}
                        </span>
                      </li>,
                    );
                  }

                  acc.push(
                    <li key={child.path}>
                      <Link
                        href={child.path}
                        onClick={() => {
                          if (isMobile) setIsOpen(false);
                          setActiveMenu(null);
                        }}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                            ${
                                              isChildActive
                                                ? "bg-brand-primary/5 text-brand-primary font-bold border-l-4 border-brand-primary"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                                            }`}
                      >
                        <span className="text-sm">{child.name}</span>
                      </Link>
                    </li>,
                  );
                  return acc;
                },
                [],
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Overlay to close panel when clicking outside */}
      {activeSubmenu && isOpen && (
        <div
          className={`fixed inset-0 z-40 ${isMobile ? "bg-black/20" : "bg-black/5 lg:bg-transparent"}`}
          onClick={() => setActiveMenu(null)}
        ></div>
      )}
    </>
  );
}
