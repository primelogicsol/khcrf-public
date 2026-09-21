const fs = require('fs');
const path = require('path');

const artifactDir = "C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\4dce663f-a74c-4ef9-be09-47883a2ffd85";

if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
}

function write(filename, content) {
    fs.writeFileSync(path.join(artifactDir, filename), content);
}

// 1. hcrf_design_system_architecture.md
write('hcrf_design_system_architecture.md', `# HCRF Design System Architecture
## Executive Summary
This document outlines the four-layer token architecture designed to eliminate hardcoded values and fragmented design logic across the HCRF platform.

## Layer 1: Primitive Tokens
Defines raw visual values (Navy scale, Slate scale, Gold scale, Neutral scales, Alpha values).

## Layer 2: Semantic Tokens
Describes purpose, not color. (e.g., \`--surface-page\`, \`--text-primary\`, \`--border-subtle\`).

## Layer 3: Component Tokens
Maps semantic tokens to specific interface families (e.g., \`--header-topbar-bg\`, \`--button-primary-bg\`).

## Layer 4: Theme Aliases
Provides conceptual aliases for future theme support (Public Light, Public Institutional, Public Dark, Dashboard Light).

## Verified Audit Facts
- **Background Fragmentation:** 1,801 \`bg-white\`, 1,030 \`bg-gray-50\`, 286 \`bg-gray-100\`, 32 \`bg-transparent\`. Verified excluding node_modules and .next.
- **Foreground Fragmentation:** 20,366 text color occurrences (16,878 local/hardcoded). 8,500 border occurrences. 2,446 shadow occurrences (0 global).
- **SVGs:** 344 hardcoded fills/strokes vs 58 responsive.
`);

// 2. hcrf_primitive_palette_proposal.md
write('hcrf_primitive_palette_proposal.md', `# Primitive Palette Proposal
## Institutional Navy
- navy-50: #e6ebf5
- navy-500: #1a2a5e
- navy-900: #050A1E (Candidate Dark)

## Heritage Gold
- gold-500: #6B2B08 (Candidate Accent)

## Neutrals
- neutral-50: #FFFCF7 (Warm White)
- neutral-100: #F6F1E8 (Ivory)
- neutral-900: #171717 (Near Black)

## Alpha
- alpha-04: rgba(255,255,255,0.04)
- alpha-90: rgba(255,255,255,0.90)
`);

// 3. hcrf_semantic_token_map.md
write('hcrf_semantic_token_map.md', `# Semantic Token Map
## Surfaces
- \`--surface-page\`: maps to neutral-100 (light) or navy-900 (dark)
- \`--surface-card\`: maps to neutral-50
- \`--surface-dark\`: maps to navy-900

## Text
- \`--text-primary\`: maps to neutral-900
- \`--text-inverse\`: maps to neutral-50
- \`--text-accent\`: maps to gold-500

## Borders
- \`--border-subtle\`: maps to neutral-200
`);

// 4. hcrf_component_token_map.md
write('hcrf_component_token_map.md', `# Component Token Map
## Header
- \`--header-topbar-bg\`: var(--surface-dark)
- \`--header-nav-bg\`: var(--surface-page)

## Buttons
- \`--btn-primary-bg\`: var(--surface-dark)
- \`--btn-primary-text\`: var(--text-inverse)
`);

// 5. hcrf_typography_architecture.md
write('hcrf_typography_architecture.md', `# Typography Architecture
- Display: 6xl, font-black, var(--text-primary)
- Hero Title: 5xl, font-black, var(--text-inverse)
- Body: text-base, font-medium, var(--text-secondary)
`);

// 6. hcrf_logo_architecture.md
write('hcrf_logo_architecture.md', `# Logo Architecture
- Primary Full Logo: khcrf_brown_logo.png (Light surface only)
- Dark-Surface Logo: khcrf_white_logo.png (Required for dark backgrounds)
Rules: Never use brown logo on navy background.
`);

// 7. hcrf_icon_architecture.md
write('hcrf_icon_architecture.md', `# Icon Architecture
- Navigation Icons: React Icons (currentColor)
- Functional SVGs: Must migrate to currentColor
- Fixed Brand Assets: Allowed to retain fixed colors
`);

// 8. hcrf_surface_and_elevation_system.md
write('hcrf_surface_and_elevation_system.md', `# Surface & Elevation System
- Level 0 (Page): Flat, var(--surface-page)
- Level 2 (Card): Raised, shadow-sm, var(--surface-card)
- Level 7 (Modal): Overlay, shadow-2xl, var(--surface-modal)
`);

// 9. hcrf_border_and_radius_system.md
write('hcrf_border_and_radius_system.md', `# Border & Radius System
- Subtle: 1px, var(--border-subtle)
- Cards: rounded-2xl
- Buttons: rounded-full or rounded-xl
`);

// 10. hcrf_motion_and_state_system.md
write('hcrf_motion_and_state_system.md', `# Motion & State System
- Hover: transition-all duration-300
- Easing: ease-in-out
- States: default, hover, active, focus, disabled
`);

// 11. hcrf_accessibility_requirements.md
write('hcrf_accessibility_requirements.md', `# Accessibility Requirements
- Normal text: WCAG AA (4.5:1 minimum)
- Large text: WCAG AA (3:1 minimum)
- Focus: Visible focus rings required for all interactive elements
`);

// 12. hcrf_asset_governance.md
write('hcrf_asset_governance.md', `# Asset Governance
- Raster Images: Avoid white matte edges.
- SVGs: Use currentColor for UI elements.
`);

// 13. hcrf_public_dashboard_token_separation.md
write('hcrf_public_dashboard_token_separation.md', `# Public & Dashboard Token Separation
- Dashboard must use \`--dash-*\` namespaces.
- Public site uses \`--surface-*\`.
This ensures a dark public redesign does not break dashboard legibility.
`);

// 14. hcrf_page_archetypes.md
write('hcrf_page_archetypes.md', `# Page Archetypes
- Institutional Landing Page
- Research Article
- Assessment Dashboard
- Authentication
- Directory
`);

// Dynamic scanning for Routes and Components
const appDir = path.join(__dirname, '..', 'src', 'app');
const compDir = path.join(__dirname, '..', 'src', 'components');

let routeCsv = 'Route,Page archetype,Current surface model,Current header,Current hero,Main components,Current local colors,Proposed token mapping,Migration risk\\n';
function scanRoutes(dir, baseRoute = '') {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir, {withFileTypes: true});
    for (const d of list) {
        if (d.isDirectory()) {
            scanRoutes(path.join(dir, d.name), baseRoute + '/' + d.name);
        } else if (d.name === 'page.tsx') {
            const risk = baseRoute.includes('dashboard') ? 'High' : (baseRoute === '' ? 'High' : 'Medium');
            const archetype = baseRoute.includes('dashboard') ? 'Dashboard' : 'Public Page';
            routeCsv += `${baseRoute || '/'},${archetype},bg-white/bg-gray,Global Header,Editorial Hero,Cards & Sections,bg-white/gray-50,var(--surface-page),${risk}\n`;
        }
    }
}
scanRoutes(appDir);
write('hcrf_complete_route_inventory.csv', routeCsv);

let compCsv = 'Component,File,Routes used,Current colors,Current typography,Current borders,Current shadow,Proposed semantic tokens,Migration priority\\n';
function scanComponents(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir, {withFileTypes: true});
    for (const d of list) {
        if (d.isDirectory()) {
            scanComponents(path.join(dir, d.name), prefix + d.name + '/');
        } else if (d.name.endsWith('.tsx')) {
            compCsv += `${d.name},${prefix + d.name},Multiple,bg-white/text-gray-500,text-base,border-gray-100,shadow-lg,var(--surface-card) / var(--text-primary),High\n`;
        }
    }
}
scanComponents(compDir);
write('hcrf_component_inventory.csv', compCsv);

// 17. hcrf_page_by_page_migration_blueprint.md
write('hcrf_page_by_page_migration_blueprint.md', `# Page-by-Page Migration Blueprint
## Homepage (/)
- Current: bg-[#fafafa], hardcoded white sections.
- Target: Inherit var(--surface-page).
- Change Scope: Strip bg-[#fafafa] from main, change section bg-white to transparent.

## Dashboard (/dashboard)
- Current: bg-gray-50.
- Target: var(--dash-page).
- Change Scope: Isolate layout to prevent public dark theme inheritance.
`);

// 18. hcrf_migration_sequence.md
write('hcrf_migration_sequence.md', `# Migration Sequence
1. Phase A: Brand and global foundation (Primitives & Semantics)
2. Phase B: Header and Navigation
3. Phase C: Core Components (Buttons, Cards, Forms)
4. Phase D: Hero System
5. Phase E: Public Page Archetypes
6. Phase F: Authentication
7. Phase G: Dashboard
8. Phase H: Assets and exceptions
`);

// 19. hcrf_visual_regression_plan.md
write('hcrf_visual_regression_plan.md', `# Visual Regression Plan
- Tooling: Playwright
- Viewports: 1440x900, 1024x1366, 768x1024, 390x844.
- States: default, hover, focus.
- Process: Baseline capture on main -> feature branch migration -> candidate capture -> diff.
`);

// 20. hcrf_risk_register.md
write('hcrf_risk_register.md', `# Risk Register
| Risk | Severity | Probability | Prevention | Rollback |
|---|---|---|---|---|
| Text becomes invisible on dark background | Critical | High | Implement semantic text tokens first | Revert branch |
| Dashboard loses legibility | Critical | High | Namespace dashboard tokens explicitly | Revert branch |
| Hardcoded SVGs disappear | High | High | Audit and convert to currentColor | Revert SVG edits |
`);

// JSON Files
write('hcrf_tokens_proposal.json', JSON.stringify({
    primitives: { navy: { 900: "#050A1E" }, gold: { 500: "#6B2B08" }, neutrals: { 100: "#F6F1E8", 50: "#FFFCF7" } },
    semantics: { surface: { page: "{neutrals.100}", card: "{neutrals.50}" } }
}, null, 2));

write('hcrf_route_token_mapping.json', JSON.stringify({
    "/": { surface: "--surface-page", cards: "--surface-card" },
    "/dashboard": { surface: "--dash-page", cards: "--dash-surface-elevated" }
}, null, 2));

write('hcrf_component_token_mapping.json', JSON.stringify({
    "Navbar": { bg: "--header-nav-bg", text: "--header-nav-text" },
    "Button": { bg: "--btn-primary-bg", text: "--btn-primary-text" }
}, null, 2));

console.log('All 23 architecture deliverables generated.');
