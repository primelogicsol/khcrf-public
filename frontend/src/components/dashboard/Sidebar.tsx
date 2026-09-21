"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaChevronLeft, FaChevronRight, FaSignOutAlt,
  FaAngleDoubleLeft, FaAngleDoubleRight,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { dashboardMenu, DashboardMenuItem, ROLES } from "@/config/dashboard";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar({
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
  const { isRail, toggleRail } = useSidebar();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [filteredMenu, setFilteredMenu] = useState<DashboardMenuItem[]>([]);
  const [tooltip, setTooltip] = useState<{ name: string; y: number } | null>(null);
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null);

  // Filter menu based on user role
  useEffect(() => {
    if (!user) { setFilteredMenu([]); return; }
    const userRole = user.role || ROLES.USER;
    const isAdmin = user.isAdmin || userRole === ROLES.ADMIN || userRole === 'SYSTEM_ADMIN' || userRole === 'SUPER_ADMIN';
    const filterMenu = (items: DashboardMenuItem[]): DashboardMenuItem[] =>
      items.map(item => {
        const hasDirectAccess = isAdmin || !item.allowedRoles || item.allowedRoles.includes(userRole);
        if (!hasDirectAccess) return null;
        if (item.children) {
          const filteredChildren = filterMenu(item.children);
          return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
        }
        return item;
      }).filter(Boolean) as DashboardMenuItem[];
    setFilteredMenu(filterMenu(dashboardMenu));
  }, [user]);

  useEffect(() => { setActiveMenu(null); }, [pathname]);

  // When collapsing to rail, close any open submenu
  useEffect(() => { if (isRail) setActiveMenu(null); }, [isRail]);

  const isParentActive = (item: DashboardMenuItem) => {
    if (pathname === item.path) return true;
    if (item.children) return item.children.some(c => pathname === c.path || pathname.startsWith(c.path + "/"));
    return pathname.startsWith(item.path + "/");
  };

  const handleMenuClick = (item: DashboardMenuItem) => {
    if (isRail) {
      // In rail mode, clicking expands sidebar first
      toggleRail();
      setTimeout(() => setActiveMenu(item.children ? item.name : null), 50);
      return;
    }
    if (item.children) {
      setActiveMenu(activeMenu === item.name ? null : item.name);
    } else {
      setActiveMenu(null);
    }
  };

  const activeSubmenu = filteredMenu.find(item => item.name === activeMenu);

  const showTooltip = (name: string, e: React.MouseEvent) => {
    if (!isRail) return;
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ name, y: rect.top + rect.height / 2 });
  };
  const hideTooltip = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setTooltip(null), 150);
  };

  const railWidth = "w-[64px]";
  const fullWidth = "w-64";
  const sidebarWidth = isRail ? railWidth : fullWidth;

  return (
    <>
      {/* Tooltip for rail mode */}
      {tooltip && isRail && (
        <div
          className="fixed z-[200] bg-[#071127] text-white text-xs font-semibold px-2.5 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: "70px", top: tooltip.y - 12 }}
        >
          {tooltip.name}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#071127] rotate-45" />
        </div>
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-[#071127] text-white shadow-none
          ${
            isMobile
              ? isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
              : `translate-x-0 ${sidebarWidth}`
          }
        `}
      >
        <div className="flex flex-col h-full relative z-20">

          {/* Header */}
          <div className={`flex items-center border-b border-white/10 h-16 shrink-0 ${
            isRail ? "justify-center px-1" : "justify-between px-4"
          }`}>
            {!isRail && (
              <Link href="/" className="flex items-center gap-2">
                <Image src="/assets/images/HCRF_LOGO_1.png" alt="KHCRF Logo" width={28} height={28} className="object-contain brightness-0 invert" />
                <span className="text-sm font-bold tracking-widest text-white">KHCRF</span>
              </Link>
            )}
            {isRail && (
              <Link href="/" title="KHCRF Dashboard">
                <Image src="/assets/images/HCRF_LOGO_1.png" alt="KHCRF" width={24} height={24} className="object-contain brightness-0 invert" />
              </Link>
            )}
            {!isMobile && (
              <button
                onClick={toggleRail}
                title={isRail ? "Expand sidebar" : "Collapse sidebar"}
                className={`flex items-center justify-center w-6 h-6 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors ${
                  isRail ? "" : ""
                }`}
              >
                {isRail
                  ? <FaAngleDoubleRight size={11} />
                  : <FaAngleDoubleLeft size={11} />}
              </button>
            )}
            {isMobile && (
              <button onClick={() => router.back()} className="text-white/50 hover:text-white">
                <FaChevronLeft size={13} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="px-2 py-3 overflow-y-auto flex-1 no-scrollbar">
            <ul className="space-y-0.5">
              {filteredMenu.map(item => {
                const Icon = item.icon;
                const isActive = isParentActive(item);
                const isPanelOpen = activeMenu === item.name;

                if (isRail) {
                  // Icon-only rail
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => handleMenuClick(item)}
                        onMouseEnter={e => showTooltip(item.name, e)}
                        onMouseLeave={hideTooltip}
                        title={item.name}
                        className={`w-full flex items-center justify-center h-10 rounded transition-all duration-150 ${
                          isActive || isPanelOpen
                            ? "bg-white/10 text-white shadow-inner"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {Icon && <Icon size={14} />}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.name}>
                    {item.children ? (
                      <button
                        onClick={() => handleMenuClick(item)}
                        className={`w-full flex items-center justify-between px-3 h-10 rounded group transition-all duration-150 ${
                          isActive || isPanelOpen
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon size={13} className={isActive || isPanelOpen ? "text-white" : "text-white/50 group-hover:text-white"} />}
                          <span className={`text-[13px] tracking-wide ${isActive || isPanelOpen ? "font-semibold" : "font-medium"}`}>{item.name}</span>
                        </div>
                        <FaChevronRight size={9} className={`transition-transform duration-200 text-white/40 ${isPanelOpen ? "rotate-90 text-white" : ""}`} />
                      </button>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={() => { if (isMobile) setIsOpen(false); setActiveMenu(null); }}
                        className={`flex items-center gap-3 px-3 h-10 rounded group transition-all duration-150 ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {Icon && <Icon size={13} className={isActive ? "text-white" : "text-white/50 group-hover:text-white"} />}
                        <span className={`text-[13px] tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}>{item.name}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          {!isRail ? (
            <div className="p-2 border-t border-white/10 shrink-0">
              {user && (
                <div className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/5 transition-all group">
                  <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white truncate leading-tight">{user.name}</p>
                    <p className="text-[9px] text-white/50 truncate uppercase tracking-widest">{user.role || "Member"}</p>
                  </div>
                  <button
                    onClick={async () => { if (confirm("Logout?")) await logout(); }}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="Logout"
                  >
                    <FaSignOutAlt size={12} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2 border-t border-white/10 shrink-0 flex justify-center">
              {user && (
                <button
                  onClick={async () => { if (confirm("Logout?")) await logout(); }}
                  title={`Logout ${user.name}`}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                >
                  <FaSignOutAlt size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Secondary Flyout Panel */}
      <div
        className={`fixed top-0 z-50 h-screen bg-white border-r border-stone-200 shadow-xl shadow-black/5 transition-all duration-300 ease-in-out transform
          ${activeSubmenu && isOpen && !isRail ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
          ${isMobile ? "left-0 w-64" : isRail ? "left-[64px] w-[260px]" : "left-64 w-[260px]"}
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
                  <FaChevronLeft size={11} /> Back
                </button>
              )}
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                {activeSubmenu.icon && <activeSubmenu.icon className="text-brand-secondary" />}
                {activeSubmenu.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Select a module to manage</p>
            </div>
            <ul className="space-y-1 overflow-y-auto flex-1">
              {activeSubmenu.children?.map(child => {
                const isChildActive = pathname === child.path || pathname.startsWith(child.path + "/");
                if (child.children?.length) {
                  return (
                    <li key={child.path} className="mb-2">
                      <Link
                        href={child.path}
                        onClick={() => { if (isMobile) setIsOpen(false); setActiveMenu(null); }}
                        className={`flex items-center px-4 py-2 mb-1 rounded-lg transition-all ${
                          isChildActive ? "bg-brand-primary/5 text-brand-primary font-bold" : "text-gray-800 font-semibold hover:text-brand-primary"
                        }`}
                      >
                        {child.icon && <child.icon className="mr-2 w-4 h-4" />}
                        <span className="text-sm">{child.name}</span>
                      </Link>
                      <ul className="pl-6 space-y-1 border-l border-gray-100 ml-6">
                        {child.children.map(gc => (
                          <li key={gc.path}>
                            <Link
                              href={gc.path}
                              onClick={() => { if (isMobile) setIsOpen(false); setActiveMenu(null); }}
                              className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                                pathname === gc.path ? "text-brand-primary font-medium bg-brand-primary/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              {gc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }
                return (
                  <li key={child.path}>
                    <Link
                      href={child.path}
                      onClick={() => { if (isMobile) setIsOpen(false); setActiveMenu(null); }}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                        isChildActive
                          ? "bg-brand-primary/5 text-brand-primary font-bold border-l-4 border-brand-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                      }`}
                    >
                      <span className="text-sm">{child.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Overlay */}
      {((activeSubmenu && isOpen && !isRail) || (isMobile && isOpen)) && (
        <div
          className={`fixed inset-0 z-40 ${isMobile ? "bg-black/20" : "bg-black/5 lg:bg-transparent"}`}
          onClick={() => { setActiveMenu(null); if (isMobile) setIsOpen(false); }}
        />
      )}
    </>
  );
}
