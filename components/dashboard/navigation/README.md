# Admin Navigation

Three components that make up the admin navigation shell: sidebar, module bar, and top bar.

## Structure

```
navigation/
  sidebar.tsx       — AdminSidebar (left panel, rsuite Sidenav)
  module-bar.tsx    — ModuleBar (horizontal per-section nav below top bar)
  top-bar.tsx       — AdminTopBar (user menu, notifications, top-right)
  hooks/
    use-navigation.ts  — useActiveSection() hook
  config/
    sections.ts     — Shared config: sidebarGroups + sectionModules + detectSection
  index.ts          — Public exports
```

## Config-driven

Both `sidebar.tsx` and `module-bar.tsx` read from `config/sections.ts`:

- **`sidebarGroups`** — defines all sidebar groups (Overview, Commerce, Content, etc.) with their links and expandable menus. The sidebar component renders this array generically with zero hardcoded JSX.

- **`sectionModules`** — defines per-section entries for the module bar. Each section key (inventory, sales, customers, etc.) contains an array of link/group entries.

- **`detectSection(pathname)`** — maps URL paths to section keys.

## Add a new page

1. Add a section entry in `sectionModules` (for module bar) or `sidebarGroups` (for sidebar), or both.
2. Add the path detection in `detectSection`.
3. Create the page route under `app/admin/`.

The sidebar open-keys are derived automatically from `sidebarGroups` — no manual key management needed.
