"use client";

import { useState } from "react";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b border-stone-200 z-30 h-16 transition-all duration-300 shadow-sm flex items-center">
      <div className="w-full px-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Open sidebar</span>
              <FaBars className="w-6 h-6" />
            </button>
            <span className="ml-4 text-xl font-bold md:hidden text-brand-primary">
              Visual<span className="text-brand-secondary">Vantage</span>
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 space-x-4">
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 relative">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                    {user?.name || "User"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    {user?.role || "Member"}
                  </div>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <div data-ui-icon className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center  ring-2 ring-transparent group-hover:ring-brand-primary/20 transition-all">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-6 h-6 opacity-50" />
                      )}
                    </div>
                    <FaChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-fade-in origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1 lg:hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
