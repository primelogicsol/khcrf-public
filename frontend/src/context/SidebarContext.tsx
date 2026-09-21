"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isRail: boolean;
  setIsRail: (v: boolean | ((prev: boolean) => boolean)) => void;
  toggleRail: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isRail: false,
  setIsRail: () => {},
  toggleRail: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isRail, setIsRail] = useState(false);
  const toggleRail = () => setIsRail(v => !v);
  return (
    <SidebarContext.Provider value={{ isRail, setIsRail, toggleRail }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
