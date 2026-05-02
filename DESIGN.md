# Design Brief: Dental Clinic Management SaaS

## Overview
Production-grade dental clinic management platform with role-based dashboards (Admin, Doctor, Receptionist). Multi-clinic architecture with clinical-professional aesthetic — authoritative, trustworthy, efficient. Deep navy foundation with amber clinical accent, teal doctor actions, sage receptionist workflows.

## Palette

| Token | OKLCH | Usage |
|-------|-------|-------|
| background | 0.13 0.018 265 | Page foundation |
| foreground | 0.93 0.01 265 | Primary text |
| primary | 0.74 0.16 78 | Amber — clinical authority, admin actions |
| accent | 0.62 0.18 200 | Teal — doctor-specific workflows |
| success | 0.65 0.17 155 | Green — approved, completed, appointments |
| destructive | 0.58 0.22 25 | Red — rejections, cancellations |
| sidebar | 0.15 0.02 265 | Dark sidebar container |
| role-admin | 0.74 0.16 78 | Admin badge & navigation highlight |
| role-doctor | 0.62 0.18 200 | Doctor badge & navigation highlight |
| role-receptionist | 0.65 0.17 155 | Receptionist badge & navigation highlight |

## Typography
- **Display**: Cabinet Grotesk (headings, titles, module names) — bold, geometric, professional
- **Body**: Outfit (paragraphs, labels, form text) — balanced, readable, clean
- **Mono**: JetBrains Mono (patient IDs, invoice numbers, reference codes) — clinical precision

## Structural Zones

| Zone | Treatment | Rationale |
|------|-----------|-----------|
| Header/Navigation | `border-b border-border`, `bg-card`, role accent left-border in sidebar | Authority, clarity of user role |
| Content Area | `bg-background`, card-based layout with `bg-card` | Minimal, focused on data |
| Data Tables | `table-row-stripe` (alternating `bg-muted/10`), striped for scanability | Clinical data clarity |
| Status Badges | Role & context colored (pending: amber, approved: green, rejected: red) | Instant visual status recognition |
| Form Inputs | `border border-border`, `bg-input`, minimal padding | Functional, not decorative |
| Sidebar | `bg-sidebar` with role-colored left accent bar | Clear role identification |

## Spacing & Density
- **Compact**: Form fields, data tables — max 0.75rem gaps
- **Regular**: Card sections, module sections — 1–1.5rem gaps
- **Generous**: Top-level sections (Patient/Treatment/Billing blocks) — 2rem gaps
- **Mobile**: Collapse to single column, reduce gaps by 25%

## Component Patterns
- **Data Tables**: Header row `bg-muted/20`, body rows `table-row-stripe`, action buttons right-aligned
- **Status Badges**: `.badge-{status}` utility classes with border and low-opacity background
- **Action Buttons**: Primary (amber), secondary (teal for doctor), destructive (red), disabled (muted)
- **Role Indicators**: Sidebar left-border (3–4px) in role color, badge in top-right header
- **Card Elevation**: Clinical shadow (`0 4px 12px` dark overlay) for section separation
- **Modals/Overlays**: Semi-transparent dark backdrop, card-style content container

## Motion
- **Entrance**: fade-in (0.3s ease-out) for page load
- **Micro-interactions**: transition-all 0.2s for hover/focus states
- **Status Changes**: status-pulse (2s ease-in-out infinite) for alerts, approvals
- **Modal**: slide-in (0.3s ease-out) from below

## Constraints & Anti-patterns
- ❌ No gradients, no decorative orbs, no glassmorphism
- ❌ No rainbow or multi-color palettes
- ❌ No animations on data-heavy elements (tables, patient lists)
- ❌ No hover effects that hide/show critical information
- ✓ All color tokens via CSS variables, no raw hex
- ✓ Role colors used consistently across role badges, sidebar, action buttons
- ✓ Sufficient contrast (AA+ WCAG) in light and dark modes

## Signature Detail
**Role-Based Visual Hierarchy**: Left-border accent on sidebar navigation items (admin: amber, doctor: teal, receptionist: sage) creates immediate role recognition. Status badges with pulsing animation signal actionable items. Striped data tables with clinical shadows create professional, scannable information architecture.

## Dark Mode
Primary implementation. Light mode not implemented — clinical/professional context suits dark mode (reduced eye strain in clinical settings, premium aesthetic).
