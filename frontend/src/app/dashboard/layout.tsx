"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { FaSpinner } from "react-icons/fa6";
import { DASHBOARD_ACCESS_ROLES, dashboardMenu, ROLES } from "@/config/dashboard";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isRail } = useSidebar();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.push("/login?redirect=/dashboard"); return; }
      const userRole = user.role || ROLES.USER;
      const isAdmin = user.isAdmin || userRole === ROLES.ADMIN || userRole === 'SYSTEM_ADMIN' || userRole === 'SUPER_ADMIN';
      if (!isAdmin && !DASHBOARD_ACCESS_ROLES.includes(userRole)) { router.push("/"); return; }
      if (isAdmin) { setIsAuthorized(true); return; }
      const isPathAllowed = (_: string, allowedRoles?: string[]) => !allowedRoles || allowedRoles.includes(userRole);
      const checkAccess = (items: any[]): boolean => {
        for (const item of items) {
          if (pathname === item.path || pathname.startsWith(item.path + "/")) {
            if (!isPathAllowed(item.path, item.allowedRoles)) continue;
            if (item.children) {
              const mc = item.children.find((c: any) => pathname === c.path || pathname.startsWith(c.path + "/"));
              if (mc) return checkAccess([mc]);
            }
            return true;
          }
          if (item.children) { const r = checkAccess(item.children); if (r) return true; }
        }
        return false;
      };
      // Contributor roles: redirect /dashboard to Publications Hub instead of rejecting
      const contributorRoles = [ROLES.RESEARCH_CONTRIBUTOR, ROLES.FIELD_CONTRIBUTOR, ROLES.ARTISAN_CONTRIBUTOR, ROLES.INDUSTRY_CONTRIBUTOR, ROLES.POLICY_CONTRIBUTOR, ROLES.INSTITUTIONAL_PARTNER];
      if (contributorRoles.includes(userRole) && (pathname === "/dashboard" || pathname === "/dashboard/")) {
        router.replace("/dashboard/business/publications"); return;
      }
      if (checkAccess(dashboardMenu)) setIsAuthorized(true);
      else router.push("/");
    }
  }, [user, isLoading, router, pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
      </div>
    );
  }

  // Sidebar pixel width for main content offset
  const sidebarOffset = isMobile ? "ml-0" : isRail ? "ml-[64px]" : "ml-64";

  return (
    <div className="bg-white min-h-screen">
      <Header toggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
      <main className={`pt-16 transition-all duration-300 min-h-screen ${sidebarOffset} border-l border-stone-200`}>
        <div className="p-5 md:p-8">
          <Breadcrumb />
          <ErrorBoundary key={pathname}>
            {children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
}
