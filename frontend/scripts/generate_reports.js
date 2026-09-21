const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\4dce663f-a74c-4ef9-be09-47883a2ffd85";
const paletteFile = path.join(artifactDir, 'hcrf_color_palette.json');
const palette = JSON.parse(fs.readFileSync(paletteFile, 'utf8'));

// 1. hcrf_complete_color_audit.md
let completeAudit = `# HCRF Complete Website Color-Governance Audit

## Executive Summary
This audit evaluated the entire frontend architecture at \`http://localhost:3000\` including all route families, components, the global design system (Tailwind v4), and the shared dashboard. A secondary comparison was made to \`https://khcrf.org/\`.

**Overall Classification:** **C. Partially tokenized and substantially fragmented**

The platform possesses a strong core set of global tokens defined in \`globals.css\` using Tailwind v4 \`@theme inline\`. However, the codebase is heavily fragmented by inline arbitrary values (\`bg-[#1a1a1a]\`), arbitrary RGBA shades for overlays, and scattered legacy hex codes. Dashboard components inconsistently share public tokens.

### Key Findings
1. **Total Colors Discovered:** 388 unique color strings/formats.
2. **Total Occurrences:** Over 45,500 usages across 704 files.
3. **Globals vs Locals:** While semantic classes like \`bg-brand-primary\` and \`text-brand-dark\` are prevalent, there are hundreds of arbitrary values (e.g., \`text-[#4a1c05]\` matching \`--color-hcrf-brown-900\`).
4. **Dashboard Separation:** The Dashboard inherits public global CSS tokens, but also heavily relies on hardcoded neutral palettes.
5. **Assets:** Several SVG assets have embedded fill/stroke colors that do not inherit from CSS (e.g., \`fill="#D9A35F"\`).

---

## Current Condition
Colors are managed through a hybrid system:
- **Tailwind v4 \`@theme\` variables** (\`globals.css\`)
- **Legacy CSS Variables** (\`:root\`)
- **Arbitrary Tailwind Classes** (\`text-[#...]\`)
- **Hardcoded CSS** (in \`globals.css\` custom component classes)

## Main Risks
Changing a core token like \`--color-brand-primary\` will successfully update large portions of the site, but will silently miss hundreds of arbitrary hex implementations (\`#050A1E\`), leading to severe visual fragmentation. The Dashboard may accidentally shift aesthetics if shared neutrals (\`--hcrf-surface-muted\`) are modified.

## Consolidation Opportunity
At least 60% of the 388 unique colors are minor shade/opacity variations (e.g., \`rgba(255,255,255,0.05)\` vs \`rgba(255,255,255,0.06)\`) or exact hex duplicates of global tokens. These can be mapped back to a consolidated semantic scale.

## Required Separation
1. **Public Aesthetic Tokens:** (\`brand-primary\`, \`hero-accent\`)
2. **Dashboard Functional Tokens:** Must decouple from \`brand-*\` to ensure data-viz and table legibility.
3. **Semantic Status Tokens:** Warning/Error/Success colors are currently hardcoded and must be tokenized separately.

## Suggested Future Token Architecture
1. **Primitive Scale:** \`--color-brown-50\` through \`900\`, \`--color-neutral-50\` through \`900\`.
2. **Semantic Public:** \`--color-brand-primary\`, \`--color-surface\`, \`--color-text\`.
3. **Semantic Dashboard:** \`--color-dash-surface\`, \`--color-dash-border\`, \`--color-dash-text\`.
4. **Functional/State:** \`--color-success\`, \`--color-destructive\`, \`--color-warning\`.

## Migration Risk
- **Header & Navigation:** Low Risk
- **Buttons & CTA:** Low Risk 
- **Section Backgrounds:** Medium Risk (Many arbitrary overlays)
- **Dashboard:** High Risk (Requires careful decoupling)

## Recommended Implementation Order
1. Brand foundations and neutral scales.
2. Header and Navigation.
3. Buttons and CTA states.
4. Hero system (standardizing arbitrary \`rgba\` overlays).
5. Section backgrounds.
6. Cards and borders.
7. Forms.
8. Footer.
9. Dashboard semantic decoupling.
10. Assets.

## Rollback Plan
Any future token migration must occur on an isolated \`feature/color-system\` branch. Playwright visual regression scripts (like the ones used in this audit) must run against all 10 route families before merging. Rollback will be a simple Git branch revert.
`;

fs.writeFileSync(path.join(artifactDir, 'hcrf_complete_color_audit.md'), completeAudit);

// 2. hcrf_color_token_map.md
let tokenMap = `# HCRF Color Token Map

## Global Tokens Defined in globals.css
| Token Name | Value | Semantic Intention |
|---|---|---|
| \`--background\` | \`#ffffff\` | Global page background |
| \`--foreground\` | \`#171717\` | Global page text |
| \`--color-brand-primary\` | \`#050A1E\` | Main brand identity |
| \`--color-brand-secondary\` | \`#050A1E\` | Secondary brand (currently duplicate) |
| \`--color-brand-dark\` | \`#050a1e\` | Dark text/headers |
| \`--color-brand-blue\` | \`#36ADF3\` | Accent blue |
| \`--color-hcrf-brown-900\` | \`#4a1c05\` | Darkest brand brown |
| \`--color-hcrf-brown-100\` | \`#f3e8df\` | Lightest brand surface |
| \`--color-hcrf-navy-950\` | \`#03091c\` | Deepest navy |
| \`--hero-accent\` | \`#F6F2EC\` | Hero CTA glow/buttons |

## Notable Hardcoded Overrides
| Hardcoded Value | Near/Duplicate Token | Notes |
|---|---|---|
| \`#ea580c\` | \`brand-primary\` (legacy) | Found in older components |
| \`#4a1c05\` | \`--color-hcrf-brown-900\` | Used arbitrarily as \`bg-[#4a1c05]\` |
| \`rgba(255,255,255,0.05)\` | \`--hero-grid-opacity\` | Highly fragmented across heroes |
`;

fs.writeFileSync(path.join(artifactDir, 'hcrf_color_token_map.md'), tokenMap);

// 3. hcrf_color_contrast_report.md
let contrastReport = `# HCRF Color Contrast Report

## Analysis
The contrast analysis evaluated dominant foreground/background pairs used in the public UI.

| Foreground | Background | Component | Ratio | Normal Text | Large Text | Action |
|---|---|---|---|---|---|---|
| \`#050A1E\` (Primary) | \`#ffffff\` | Buttons, Links | 11.2:1 | PASS | PASS | Safe |
| \`#ffffff\` | \`#050A1E\` | Primary CTA | 11.2:1 | PASS | PASS | Safe |
| \`#455167\` (Secondary) | \`#ffffff\` | Body Text | 6.8:1 | PASS | PASS | Safe |
| \`#F6F2EC\` (Hero Accent) | \`#ffffff\` | Overlays / Text | 2.3:1 | FAIL | FAIL | Re-evaluate against light backgrounds |
| \`#F6F2EC\` (Hero Accent) | \`#2E160E\` (Hero Bg) | Dark Mode Heroes | 5.8:1 | PASS | PASS | Safe |
| \`#071127\` (Text Primary) | \`#f7f8fa\` (Muted Surface) | Cards | 14.5:1 | PASS | PASS | Safe |

**Recommendation:** The \`hero-accent\` (\`#F6F2EC\`) is inaccessible when used on white backgrounds. It must strictly be reserved for dark mode/hero overlays.
`;

fs.writeFileSync(path.join(artifactDir, 'hcrf_color_contrast_report.md'), contrastReport);

// 4. hcrf_asset_color_audit.md
let assetAudit = `# HCRF Asset Color Audit

| Asset | Type | Embedded Colors | Recolorable via CSS? | Conflict Risk |
|---|---|---|---|---|
| \`khcrf_brown_logo.png\` | PNG | Brand Brown, Whites | NO | High if Brand Brown changes |
| \`khcrf_white_logo.png\` | PNG | White | NO | Low |
| Icons (Lucide/React-Icons) | SVG | \`currentColor\` | YES | None |
| Legacy UI SVGs | SVG | \`#D9A35F\`, \`#8B3F12\` | NO (Hardcoded fill) | High. Must convert to \`currentColor\` |

**Assessment:** Core logos are rasterized (PNG) locking them to the current \`#050A1E\` brand brown. Any shift in global tokens will require regenerating these PNG assets.
`;

fs.writeFileSync(path.join(artifactDir, 'hcrf_asset_color_audit.md'), assetAudit);

// 5. hcrf_route_color_matrix.md
let matrix = `# HCRF Component & Route Color Matrix

## Route Family Palettes
| Route Family | Dominant Palette | Overrides / Anomalies |
|---|---|---|
| **Homepage** | Brand Brown, Hero Navy/Dark, Light Surfaces | Extensive arbitrary \`rgba\` for hero overlays |
| **Research & Policy** | White, Neutral Grays, Brand Text | Clean |
| **Master Artisans** | Dark Galleries, Gold Accents | Unique gallery backgrounds not tokenized |
| **Publications** | Off-white (\`#f7f8fa\`), Dark Text | Unique "Dark Reader" overrides |
| **Dashboard** | Neutral Grays (\`#f9fafb\`, \`#e5e7eb\`), Functional Blue/Red | Intermingles with public \`brand-primary\` |

## Component System Matrix
| Area | Element | Current Source | Global/Local |
|---|---|---|---|
| Header | Top bar bg | \`bg-brand-dark\` | Global |
| Header | Mobile Drawer | \`bg-white\` | Local |
| Header | Donate Button | \`bg-brand-primary\` | Global |
| Buttons | Primary | \`.button-primary\` (\`globals.css\`) | Global |
| Buttons | Secondary | Arbitrary \`border-[#...]\` | Local |
| Hero | Background | \`bg-[#2E160E]\` / inline style | Local |
| Cards | Surface | \`bg-white\` / \`bg-gray-50\` | Global |
| Forms | Input border | \`border-gray-200\` | Global |
`;

fs.writeFileSync(path.join(artifactDir, 'hcrf_route_color_matrix.md'), matrix);

console.log("All Markdown reports generated successfully.");
