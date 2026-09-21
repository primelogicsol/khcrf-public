"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { FaBars } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Protect Dashboard Route
  useEffect(() => {
    if (!isLoading) {
      const allowedRoles = [
        "ADMIN",
        "MODERATOR_MEMBERSHIP",
        "MODERATOR_DONATION",
        "MODERATOR_CAREER",
        "MODERATOR_CERTIFICATIONS",
        "MODERATOR_ACCREDITATION",
        "MODERATOR_EBOOKS",
        "COLLABORATOR_ADVOCACY",
        "COLLABORATOR_CAMPAIGNING",
        "COLLABORATOR_LOBBYING",
      ];

      // If user is not logged in or role is not allowed, redirect to profile or home
      if (user && !allowedRoles.includes(user.role || "")) {
        // Prevent redirect loop or locking users out of their own profile sub-pages
        if (!window.location.pathname.startsWith("/profile")) {
          router.replace("/profile");
        }
      }
    }
  }, [user, isLoading, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-roboto">
      <ProfileSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 z-30 justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="text-xl" />
          </button>
          <span className="font-bold text-lg text-brand-primary">
            Member Profile
          </span>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 print:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`transition-all duration-300 min-h-screen pt-20 lg:pt-8 bg-gray-50 print:ml-0 print:pt-0
                ${sidebarOpen && !isMobile ? "ml-72" : "ml-0"}
                `}
      >
        <div className="p-4 md:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
