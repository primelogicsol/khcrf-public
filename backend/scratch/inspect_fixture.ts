import fs from "fs";

const fixturePath = "C:/Users/Fayaz/Sufipulseupdate2026/HCRF 2026/hcr_foundation_full_govind/backend/scratch/fixtures/khcrf_reviving_trust_baseline.json";

try {
  const buffer = fs.readFileSync(fixturePath);
  let content = "";
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString("utf16le");
  } else {
    content = buffer.toString("utf8");
  }
  
  // Find the first curly brace
  const firstBraceIdx = content.indexOf("{");
  if (firstBraceIdx === -1) {
    throw new Error("Could not find start of JSON object.");
  }
  
  const cleanJson = content.slice(firstBraceIdx);
  const data = JSON.parse(cleanJson);
  console.log("PUBLICATION TITLE:", data.title);
  console.log("CHAPTERS IN FIXTURE:");
  if (data.chapters) {
    data.chapters.forEach((ch: any, i: number) => {
      console.log(`${i + 1}. Title: "${ch.title}", SectionType: "${ch.sectionType}", Order: ${ch.order}`);
    });
  } else {
    console.log("No chapters array in root JSON.");
  }
} catch (e: any) {
  console.error("Error reading fixture:", e.message);
}
