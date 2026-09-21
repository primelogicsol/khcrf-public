"use client";

import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function ImpersonationBanner() {
  const { user, login } = useAuth();

  // @ts-ignore - isImpersonating is added dynamically
  if (!user || !user.isImpersonating) return null;

  const handleStopImpersonation = async () => {
    try {
      const data = await userApi.stopImpersonation();
      login(data.user);
      window.location.href = "/dashboard/users"; // Go back to user management
    } catch (error) {
      console.error("Failed to stop impersonation", error);
      alert("Failed to stop impersonation");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 bg-brand-dark/90 backdrop-blur-md text-white py-3 px-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 animate-slide-up flex items-center gap-6 min-w-[400px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
          <FaUserCircle data-ui-icon  className=" text-xl" />
        </div>
        <div>
          <div data-editorial-accent-text className="text-[10px] uppercase tracking-widest font-black /60 leading-none mb-1">
            Impersonating
          </div>
          <div className="text-sm font-bold">{user.name}</div>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10" />

      <button
        onClick={handleStopImpersonation}
        className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-brand-dark px-5 py-2 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 border border-white/20 whitespace-nowrap"
      >
        <FaSignOutAlt /> Back to Admin
      </button>
    </div>
  );
}
