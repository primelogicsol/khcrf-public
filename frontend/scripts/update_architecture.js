const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\4dce663f-a74c-4ef9-be09-47883a2ffd85";

function write(filename, content) {
    fs.writeFileSync(path.join(artifactDir, filename), content);
}

// 1. Updated hcrf_design_system_architecture.md with Foundation Layer
write('hcrf_design_system_architecture.md', `# HCRF Design System Architecture
## Executive Summary
This document outlines the six-layer token architecture designed to eliminate hardcoded values and fragmented design logic across the HCRF platform.

## Layer 1: Foundation Layer
Defines non-color primitives (spacing, radius, typography, elevation, z-index, opacity, motion, breakpoints).

## Layer 2: Primitive Tokens
Defines raw visual values (Navy scale, Slate scale, Gold scale, Neutral scales) visually curated for contrast and harmony.

## Layer 3: Brand Tokens
Defines brand identity decisions (brand-primary, brand-secondary, brand-accent). UI semantic tokens pull from these rather than directly from primitives.

## Layer 4: Semantic Tokens
Describes UI purpose, not color. (e.g., \`--surface-page\`, \`--action-primary-bg\`, \`--border-subtle\`).

## Layer 5: Component Tokens
Maps semantic tokens to specific interface families (e.g., \`--header-topbar-bg\`, \`--btn-primary-bg\`).

## Layer 6: Page & Theme Aliases
Provides conceptual aliases for future theme support (Public Light, Public Institutional, Public Dark, Dashboard Light).
`);

// 2. Visually Curated Primitive Palette
write('hcrf_primitive_palette_proposal.md', `# Visually Curated Primitive Palette
*Note: These scales are visually curated for perceptual uniformity, contrast, and adjacent harmony. They are not mathematically interpolated.*

## Institutional Navy
- navy-50: #EEF2FA
- navy-100: #D8E0F2
- navy-200: #B9C8E8
- navy-300: #93AAD8
- navy-400: #6B87C2
- navy-500: #4B68A6
- navy-600: #354E8A
- navy-700: #26386C
- navy-800: #16244C
- navy-900: #050A1E (Candidate Dark)
- navy-950: #020512

## Heritage Gold
- gold-50: #FBF8EA
- gold-100: #F5EDCA
- gold-200: #EADCA3
- gold-300: #DEC778
- gold-400: #D4B251
- gold-500: #6B2B08 (Candidate Accent)
- gold-600: #B09028
- gold-700: #8D711F
- gold-800: #71581A
- gold-900: #5D4719
- gold-950: #36280C

## Neutrals
- neutral-50: #FFFCF7 (Warm White)
- neutral-100: #F6F1E8 (Base Ivory)
- neutral-200: #E5DCCF
- neutral-800: #2C2622
- neutral-900: #1A1612 (Near Black)
`);

// 3. Updated Semantic Token Map with Brand Tokens, Data Viz, Publications, Images, Expanded Surfaces
write('hcrf_semantic_token_map.md', `# Semantic Token Map

## Brand Tokens (Layer 3)
- \`--brand-primary\`: navy-900
- \`--brand-accent\`: gold-500
- \`--brand-neutral\`: neutral-100

## UI Semantic Tokens (Layer 4)

### Expanded Surface Hierarchy
- \`--surface-base\`
- \`--surface-reading\`
- \`--surface-section\`
- \`--surface-section-alternate\`
- \`--surface-card\`
- \`--surface-card-raised\`
- \`--surface-card-interactive\`
- \`--surface-floating\`
- \`--surface-drawer\`
- \`--surface-modal\`
- \`--surface-tooltip\`
- \`--surface-hero\`
- \`--surface-brand\`
- \`--surface-dashboard\`
- \`--surface-chart\`
- \`--surface-disabled\`

### Data Visualization Tokens
- \`--chart-series-1\`, \`--chart-series-2\`, \`--chart-series-3\`
- \`--chart-positive\`, \`--chart-negative\`, \`--chart-neutral\`
- \`--heatmap\`
- \`--map-water\`, \`--map-land\`, \`--map-hazard\`
- \`--chart-grid\`, \`--chart-axis\`, \`--chart-legend\`, \`--chart-tooltip\`

### Publication & Research Tokens
- \`--pub-cover\`
- \`--pub-metadata\`
- \`--pub-citation\`
- \`--pub-abstract\`
- \`--pub-callout\`
- \`--pub-quote\`
- \`--pub-reference-note\`
- \`--pub-code-block\`
- \`--pub-footnote\`

### Image Treatment Tokens
- \`--overlay-hero\`
- \`--overlay-editorial\`
- \`--overlay-research\`
- \`--overlay-dark\`
- \`--overlay-light\`
- \`--image-card\`
- \`--image-thumbnail\`
- \`--image-avatar\`
- \`--image-profile\`
- \`--image-texture\`
`);

// 4. Expanded Asset Governance
write('hcrf_asset_governance.md', `# Asset Governance

## Asset Categories
1. **Photography:** Must follow strict aspect ratios and maintain accessibility when text is overlaid.
2. **Illustrations:** Must use \`currentColor\` where applicable, or adhere to brand primitives if fixed.
3. **Historical Images:** Require specific border treatments or framing to distinguish from modern photography.
4. **Maps:** Follow specific \`--map-*\` semantic tokens for water, land, and hazards.
5. **Icons:** UI icons strictly \`currentColor\`.
6. **Diagrams:** Must adapt to light/dark surfaces.
7. **Infographics:** Must utilize data visualization tokens.
8. **Partner Logos:** Requires bounding boxes and matte edge validation on dark surfaces.
9. **Certification Badges / Awards:** Must be tested against \`--surface-brand\`.
10. **Flags:** Retain original national colors.
11. **Social Assets:** Pre-rendered templates using brand primitives.
12. **Print Assets:** High resolution, CMYK profile equivalents mapped.
`);

// 5. Governance Rules
write('hcrf_governance_rules.md', `# HCRF Design System Governance Rules

## Mandatory Developer Rules

1. **No arbitrary hex values in JSX or CSS.**
   *Never:* \`text-[#071127]\`, \`bg-[#fafafa]\`.

2. **No direct usage of Primitive or Tailwind color utilities.**
   *Never:* \`text-gray-500\`, \`bg-white\`, \`border-gray-200\`.
   *Always:* \`text-primary\`, \`surface-card\`, \`border-default\`.

3. **No inline styles for colors.**
   *Never:* \`style={{ color: '#6B2B08' }}\`.
   *Exception:* Dynamic data visualization elements directly injecting chart token values via JS.

4. **New components must consume Semantic Tokens.**
   Buttons must not use \`brand-accent\`. They must use \`action-primary-bg\`.

5. **Brand assets may keep fixed colors ONLY if documented.**
   If an SVG has a hardcoded \`fill\`, it must be registered in the asset registry as a fixed-brand asset.

6. **Dashboard tokens must NEVER reference public-site semantic tokens.**
   The dashboard must strictly remain in the \`--dash-*\` or \`--chart-*\` namespace to ensure administrative interfaces never unexpectedly inherit public redesigns.
`);

// 6. Updated Migration Sequence (Batches 1A and 1B)
write('hcrf_migration_sequence.md', `# Migration Sequence

## Phase 1: The Invisible Foundation
- **Batch 1A (Primitives):** Inject Foundation layers and Visually Curated Primitives (\`--navy-900\`, etc.). No semantic aliases yet. Zero visual change.
- **Batch 1B (Semantic Aliases):** Inject Semantic Tokens mapped to existing legacy colors (e.g., \`--surface-page: #ffffff\`). Zero visual change.

## Phase 2: Component Architecture
- **Batch 2:** Map components to Semantic Tokens incrementally.
- **Batch 3:** Header and Navigation.
- **Batch 4:** Core Components (Buttons, Cards, Forms).

*(Further batches follow Phase D through H from the original blueprint)*
`);

console.log('Architecture refinements generated successfully.');
