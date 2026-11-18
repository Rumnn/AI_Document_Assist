---
name: AI Document Assistant
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a high-performance, tool-first interface tailored for knowledge workers, legal analysts, and enterprise operators. Blending the computational clarity of developer tools with the balanced precision of modern financial dashboards, it prioritizes density, visual quietness, and immediate legibility.

### Aesthetic Foundation
- **Modern Enterprise Utility:** Restrained surfaces, crisp structural divisions, and neutral tones ensure content and extracted intelligence remain the focal point.
- **Micro-Delight through Precision:** Tactile feedback, seamless micro-transitions (150ms ease-out), and subtle optical alignments convey quality without decorative excess.
- **Information Architecture:** Compact layouts support high data density while maintaining structural air through disciplined vertical rhythm and low-contrast boundaries.

## Colors

The palette leverages an authoritative indigo primary anchor balanced against structured slate neutrals and functional status indicators.

### Roles & Tokens
- **Canvas & Base:** Pristine pure white (`#FFFFFF`) for primary cards and focus panels; faint slate tint (`#F9FAFB`) for app canvases and secondary backdrops; muted inset (`#F1F5F9`) for code blocks, toolbars, and inactive track surfaces.
- **Brand Primary (`#4F46E5`):** Reserved for primary calls to action, active document state indicators, focus rings, and high-priority generative actions. Interactive hover transitions directly to `#4338CA`.
- **Text & Structure Hierarchy:**
  - Primary Content / Headers: `#0F172A` (Slate 900)
  - Secondary Content / Labels: `#334155` (Slate 700)
  - Muted / Meta / Supporting: `#64748B` (Slate 500)
  - Placeholder / Subdued: `#94A3B8` (Slate 400)
  - Structural Hairlines: `#E2E8F0` (Slate 200)
- **Status & Semantic Signals:**
  - **Success / Verified Citations:** `#10B981` (Emerald) with soft tinted backing (`#ECFDF5`).
  - **Processing / In-Flight Extraction:** `#F59E0B` (Amber) with warm backing (`#FFFBEB`).
  - **Destructive / Parsing Failures:** `#EF4444` (Rose) with muted alert backing (`#FEF2F2`).

## Typography

The type system is powered entirely by Inter, chosen for its neutral tone, tabular figures, and exceptional legibility across dense enterprise dashboards.

### Execution Standards
- **Optical Kerning & Tight Tracking:** Headlines utilize subtle negative tracking (`-0.01em` to `-0.02em`) to produce a tailored, modern editorial presence.
- **Tabular Figures:** All numeric metrics, citation numbers, data tables, and token usages must enable OpenType `tnum` (tabular figures) to eliminate horizontal jitter during live state transitions.
- **Monospace Code Anchors:** JetBrains Mono is utilized for raw extracted parameters, regex matches, and API key references.

## Layout & Spacing

The layout philosophy follows a responsive multi-pane fluid workspace. Structural panels (document library, active reader, conversational intelligence pane) align along strict 1px hairlines without wasted gutter gaps.

### Spacing Principles
- **Base Grid:** Built on an absolute 4px/8px modular base. Compact gaps (`space-xs` = 4px, `space-sm` = 8px) drive toolbars, nested list rows, and inline badges.
- **Section Margins:** Canvas padding adjusts progressively from 16px on mobile views, 24px on tablets, to 32px on wide desktop screens.
- **Pane Reflow:**
  - **Desktop (≥ 1280px):** Three-column layout—Left navigation/document list (fixed 280px), center viewport (fluid flex), right AI analysis sidebar (fixed 400px).
  - **Tablet (768px - 1279px):** Two-pane layout with collapsible navigation rail and slide-over conversation sheet.
  - **Mobile (< 768px):** Single active view with bottom sheet switching between document preview and assistant chat.

## Elevation & Depth

Visual hierarchy relies on structural hairlines complemented by soft, multi-tier ambient shadows. Surfaces do not rely on aggressive z-plane separation; depth is clean, flat, and tactile.

### Layering Hierarchy
- **Level 0 (Flat / Canvas):** Main background `#F9FAFB`. Hairline boundary `1px solid #E2E8F0`.
- **Level 1 (Card & Workspace Panels):** Surface `#FFFFFF`. Elevation: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`. Edge definition: `1px solid #E2E8F0`.
- **Level 2 (Dropdowns, Popovers & Context Menus):** Surface `#FFFFFF`. Elevation: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`. Edge definition: `1px solid #CBD5E1`.
- **Level 3 (Modals, Overlays & Dragged Elements):** Surface `#FFFFFF`. Elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`.

## Shapes

The design system adopts a consistent, refined curvature model using level `2` roundedness (8px base), striking the right balance between crisp enterprise tooling and modern software polish.

### Curvature Tokens
- **Base (8px / `rounded-md`):** Standard inputs, primary buttons, select dropdowns, search triggers, and conversational message bubbles.
- **Large (12px / `rounded-lg`):** Content cards, preview panels, multi-layered document frames, and modal bodies.
- **Extra Large (16px / `rounded-xl`):** Flyout sidebars, detached notification cards, and onboarding overlays.
- **Pill (9999px / `rounded-full`):** Citation chips, state status dots, counter pills, and interactive micro-tags.

## Components

### Buttons
- **Primary:** Background `#4F46E5`, foreground `#FFFFFF`, border none. Hover `#4338CA`. Active scale `0.98`. Focus ring: 2px offset with 2px ring `#4F46E5`. Height 36px (compact) or 40px (regular). Corner radius 8px.
- **Secondary:** Background `#FFFFFF`, foreground `#0F172A`, border `1px solid #E2E8F0`. Hover `#F8FAFC` and border `#CBD5E1`.
- **Ghost:** Transparent background, foreground `#334155`. Hover `#F1F5F9`. Ideal for toolbar actions and window pane toggles.

### Inputs & Search Bars
- Background `#FFFFFF`, border `1px solid #E2E8F0`, padding 8px 12px. Font size 14px. Placeholder `#94A3B8`.
- Focus state: border `#4F46E5`, box-shadow `0 0 0 3px rgba(79, 70, 229, 0.12)`.
- Global AI Query Input: Inset multi-line input box inside panel with an attached bottom utility bar housing token counters and model switchers.

### Citation Pills & Badges
- **Citation Pill:** Pill-shaped (`rounded-full`), height 22px, padding 2px 8px. Background `#EEF2FF`, text `#4338CA`, border `1px solid #C7D2FE`, font size 11px, font weight 600. On hover: background `#E0E7FF`, displaying interactive popover anchor to exact document coordinates.
- **Status Badges:** Small dot indicator (6px circle) paired with text. Success: `#ECFDF5` background, `#065F46` text. Pending: `#FFFBEB` background, `#92400E` text.

### Cards & Document Nodes
- Base background `#FFFFFF`, border `1px solid #E2E8F0`, corner radius 12px. Padding 16px to 20px.
- Hoverable document list cards gain an elevated highlight: border transitions to `#CBD5E1` with shadow elevation Level 1.

### Segmented Controls & Tabs
- Container `#F1F5F9` with 4px inner padding, radius 8px.
- Active Tab: Background `#FFFFFF`, text `#0F172A`, radius 6px, elevation `0 1px 2px rgba(15, 23, 42, 0.06)`.
- Inactive Tab: Transparent background, text `#64748B`, hover text `#0F172A`.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: 16x16px, 4px corner radius, border `1.5px solid #CBD5E1`. Checked state: background `#4F46E5`, border `#4F46E5`, check icon `#FFFFFF`.
- Radio Buttons: 16x16px, circular, checked state displays centered 6px dot `#4F46E5`.