"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeroOverlayContextType {
  isOverlay: boolean;
  setOverlay: (val: boolean) => void;
}

const HeroOverlayContext = createContext<HeroOverlayContextType>({
  isOverlay: false,
  setOverlay: () => {},
});

export function HeroOverlayProvider({ children }: { children: ReactNode }) {
  const [isOverlay, setOverlay] = useState(false);

  return (
    <HeroOverlayContext.Provider value={{ isOverlay, setOverlay }}>
      {children}
    </HeroOverlayContext.Provider>
  );
}

export function useHeroOverlay() {
  return useContext(HeroOverlayContext);
}
