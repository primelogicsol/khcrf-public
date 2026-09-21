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
  console.log("FIRST 500 CHARACTERS:");
  console.log(content.slice(0, 500));
} catch (e: any) {
  console.error("Error:", e.message);
}
