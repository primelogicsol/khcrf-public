"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  isMember: boolean;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch latest user profile from backend to sync role/isMember changes
    // _skipAuthRedirect prevents the axios 401 interceptor from doing a full-page redirect
    api.get("/auth/me", { _skipAuthRedirect: true } as any)
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        // If fetch fails (e.g. no token), keep localStorage data
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Import this dynamically or define it here to avoid circular dependency issues if config imports AuthContext (it doesn't, but safe practice)
    // Actually, we can just import from config since config doesn't use hooks.
    // However, for simplicity and to match the previous tool call structure, I'll inline the check logic based on the roles we know.
    // But better to import.

    // Checks for redirection
    const userRole = newUser.role || "USER";
    const isAdmin = newUser.isAdmin || userRole === "ADMIN";

    // We need to know if they have access.
    // Since we can't easily import DASHBOARD_ACCESS_ROLES inside this function replacement without adding the import at top,
    // I will check the list of roles manually or simple logic: "if not USER, go to dashboard".
    // Wait, the user provided a full list. USER is the only one excluded basically.
    // Actually, let's look at the logic.

    const hasDashboardAccess =
      isAdmin ||
      [
        "MODERATOR_MEMBERSHIP",
        "MODERATOR_DONATION",
        "MODERATOR_CAREER",
        "MODERATOR_CERTIFICATIONS",
        "MODERATOR_ACCREDITATION",
        "MODERATOR_EBOOKS",
        "COLLABORATOR_ADVOCACY",
        "COLLABORATOR_CAMPAIGNING",
        "COLLABORATOR_LOBBYING",
        "RESEARCH_CONTRIBUTOR",
        "FIELD_CONTRIBUTOR",
        "ARTISAN_CONTRIBUTOR",
        "INDUSTRY_CONTRIBUTOR",
        "POLICY_CONTRIBUTOR",
        "INSTITUTIONAL_PARTNER",
        "EDITOR_REVIEWER",
      ].includes(userRole);

    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get("redirect");
    const safeRedirect =
      redirectPath &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//")
        ? redirectPath
        : null;

    if (safeRedirect && safeRedirect.startsWith('/master-artisans/issues/') && safeRedirect !== '/master-artisans/issues') {
      // Evaluate membership status before sending them to the issue
      api.get("/membership/my-membership", { _skipAuthRedirect: true } as any)
        .then(res => {
          const mem = res.data;
          if (mem && mem.applicationStatus === 'APPROVED' && mem.membershipStatus === 'ACTIVE' && mem.permissions?.includes('MAGAZINE_ACCESS')) {
            window.location.href = safeRedirect;
          } else {
            window.location.href = `/about/memberships?returnTo=${encodeURIComponent(safeRedirect)}`;
          }
        })
        .catch(err => {
          console.error("Failed to check membership during login:", err);
          window.location.href = `/about/memberships?returnTo=${encodeURIComponent(safeRedirect)}`;
        });
      return;
    }

    if (safeRedirect) {
      window.location.href = safeRedirect;
    } else if (hasDashboardAccess) {
      router.replace("/dashboard");
    } else {
      router.replace("/");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

