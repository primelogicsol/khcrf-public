export const HCRFCoverTokens = {
  // Base Geometry (per Engineering Spec v1.0)
  aspectRatio: "2/3",
  borderRadius: "0.5rem", // rounded-lg
  
  // Safe Areas & Margins
  paddingX: "14%", // to allow max-width 72% center
  paddingTop: "0%", 
  paddingBottom: "3.46%", // 52px / 1500px
  
  // Typography Anchors
  headerTop: "10.666%", // Y: 160 / 1500
  gapAfterHeader: "10%", // 3x the original 50px gap (150px / 1500)
  titleTop: "23.333%", // Y: 350 / 1500 (Header Top 160 + Header Height 40 + Gap 150 = 350)
  titleMaxWidth: "72%",
  titleMaxHeight: "28%",
  gapAfterTitle: "4.6%", // 70px / 1500px

  // Subtitle Placement
  subtitleTop: "56%", // Y: 840 / 1500 (Center between Title Bottom 770 and Logo Top 996)
  subtitleLineHeight: "1.4",
  titleSubtitleGap: "32px",
  
  // Footer Placement
  footerStart: "68%", // Top of footer zone
  
  // Logo dimensions (100px)
  logoMaxWidth: "10%", // 100px / 1000px
  
  // Footer Internal Layout (Absolute Y coordinates inside the 360px Footer)
  footerLogoTop: "-6.66%", // -24px / 360px (Shifted up into white space to accommodate 100px logo)
  footerPublisherTop: "26.11%", // 94px / 360px
  footerDivisionTop: "36.66%", // 132px / 360px
  footerEditionTop: "46.94%", // 169px / 360px
  footerCodeTop: "52.5%", // 189px / 360px
  
  // Text Scaling Breakpoints
  titleBreakpoints: {
    large: 45,   // Up to 45 chars -> normal size
    medium: 60,  // Up to 60 chars -> reduced size
    small: Infinity // 61+ chars -> Size C
  }
} as const;
