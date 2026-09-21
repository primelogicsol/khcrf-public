"use client";

import { useState } from "react";
import LegislativeSidebar from "@/components/legislative/LegislativeSidebar";
import { useAuth } from "@/context/AuthContext";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userApi } from "@/lib/api";

export default function LegislativeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (isLoading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role === "ADMIN") {
        setHasAccess(true);
        return;
      }

      try {
        const stats = await userApi.getSidebarStats();
        if (stats.hasLegislativeOffice) {
          setHasAccess(true);
        } else {
          router.push("/profile");
        }
      } catch (error) {
        setHasAccess(false);
        router.push("/profile");
      }
    };
    checkAccess();
  }, [user, isLoading, router]);

  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar (hidden on smaller screens) */}
      <div className="hidden lg:block lg:w-72 shrink-0">
        <LegislativeSidebar
          isOpen={true} // Always open on desktop
          setIsOpen={() => {}} // No-op on desktop
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <LegislativeSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isMobile={true}
        />
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 z-30 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
            >
              <FaBars className="text-xl" />
            </button>
            <span className="font-bold text-lg text-brand-primary">
              Legislative Dashboard
            </span>
          </div>
        </div>
        <main className="flex-1 p-4 pt-20 md:p-8 lg:p-10 lg:pt-10 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
