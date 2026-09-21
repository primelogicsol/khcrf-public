export const PUBLICATION_BLUEPRINTS: Record<string, {
  label: string;
  defaultStructure: Array<{ section: string; items: string[]; type: "front-matter" | "chapter" | "back-matter" }>;
}> = {
  "Best Practices": {
    label: "Best Practices",
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "Copyright", "Foreword", "Preface", "Executive Summary"], type: "front-matter" },
      { section: "Main Chapters", items: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"], type: "chapter" },
      { section: "Back Matter", items: ["Appendices", "Glossary", "References", "Citation Page"], type: "back-matter" },
    ],
  },
  "Case Studies": {
    label: "Case Studies",
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "Executive Summary", "Case Snapshot"], type: "front-matter" },
      { section: "Case Body", items: ["Background", "Problem", "Stakeholders", "Intervention", "Implementation", "Results", "Challenges", "Lessons Learned", "Replicability"], type: "chapter" },
      { section: "Back Matter", items: ["Evidence Gallery", "Appendices", "References"], type: "back-matter" },
    ],
  },
  "Research Papers": {
    label: "Research Papers",
    defaultStructure: [
      { section: "Research Paper", items: ["Title Page", "Abstract", "Keywords", "Introduction", "Literature Review", "Research Questions", "Methodology", "Results", "Discussion", "Conclusion", "References", "Appendices"], type: "chapter" },
    ],
  },
  "E-Publications": {
    label: "E-Publications",
    defaultStructure: [
      { section: "Front Matter", items: ["Cover Page", "About This Book", "Acknowledgements", "Introduction"], type: "front-matter" },
      { section: "Main Chapters", items: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"], type: "chapter" },
      { section: "Back Matter", items: ["FAQ", "Glossary", "Credits", "References", "Further Reading"], type: "back-matter" },
    ],
  },
  "Policy Briefs": {
    label: "Policy Briefs",
    defaultStructure: [
      { section: "Policy Brief", items: ["Title", "Policy Summary", "Key Message", "Problem Statement", "Evidence Snapshot", "Policy Gap", "Recommendations", "Implementation Pathway", "Expected Outcomes", "References"], type: "chapter" },
    ],
  },
  "Market Intelligence": {
    label: "Market Intelligence",
    defaultStructure: [
      { section: "Market Intelligence Report", items: ["Executive Summary", "Market Overview", "Craft Sector Profile", "Demand Analysis", "Export Trends", "Pricing Intelligence", "Buyer Segmentation", "Competitor Analysis", "Risk Assessment", "Opportunity Map", "Strategic Recommendations", "Data Tables", "Appendices", "References"], type: "chapter" },
    ],
  }
};
