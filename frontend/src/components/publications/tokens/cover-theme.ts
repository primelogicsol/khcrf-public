export const HCRFCoverTheme = {
  // Brand Colors
  colors: {
    background: "#0d1629", // Deep Institutional Navy
    goldFoil: "#b89557",   // Antique Gold
    textLight: "rgba(255, 255, 255, 0.9)", // White/90 for subtitle
  },
  
  // Typography
  typography: {
    header: "font-sans font-bold tracking-[0.2em] uppercase",
    title: "font-serif font-bold uppercase drop-shadow-sm",
    subtitle: "font-serif leading-snug",
  },
  
  // Text Sizes (Mapped to title breakpoints)
  titleSizes: {
    sizeA: "text-[22px] md:text-[28px] leading-[1.15]", // ≤ 45 chars
    sizeB: "text-[18px] md:text-[24px] leading-[1.18]", // 46-60 chars
    sizeC: "text-[16px] md:text-[21px] leading-[1.20]", // 61+ chars
  },
  
  // Effects
  shadows: {
    foilTextShadow: "0 2px 4px rgba(0,0,0,0.4)",
    cardShadow: "shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
  }
} as const;
