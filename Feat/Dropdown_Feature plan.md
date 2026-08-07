# Development Plan: Country Dropdown with Search

## 1. Feature Overview

**Name:** UI Country Dropdown List with Search

**Problem:** Standard `<select>` dropdowns with 190+ countries force users to scroll through a long list. This is slow and frustrating on both desktop and mobile.

**Goal:**
- User can successfully pick a country from the dropdown.
- User can type to search/filter countries instead of scrolling.

**Non-goals (for v1):**
- Multi-select (picking more than one country)
- Grouping by region/continent
- Custom flag icon uploads

---

## 2. Success Criteria

| # | Criteria | Definition of Done |
|---|----------|---------------------|
| 1 | Pick country by click/tap | Selecting a country closes dropdown and updates the field value |
| 2 | Pick country by keyboard | Arrow keys + Enter select without touching mouse |
| 3 | Search by typing | Typing filters list in real time, case-insensitive |
| 4 | Empty state | No match shows a clear "no results" message, not a blank list |
| 5 | Works on mobile | Touch-friendly tap targets, no layout break on small screens |
| 6 | Accessible | Keyboard-navigable, screen-reader labels, focus trap while open |

---

## 3. Scope & Requirements

### Functional Requirements
- Searchable input embedded at top of the dropdown (or the trigger itself becomes the search input on focus).
- Filter matches on:
  - Country name (primary)
  - Optional: country code (ID, US, JP) and dial code (+62) as secondary match
- Debounce search input (~150ms) if list is large or filtering is async.
- Highlight matching substring in results (nice-to-have, not blocking).
- Show flag icon + country name (+ optional dial code) per row.
- Selected value reflected in the trigger/input after close.
- Keyboard support: `↓/↑` to navigate, `Enter` to select, `Esc` to close.
- Click outside / tap outside closes dropdown without changing selection.

### Data Requirements
- Static country list (ISO 3166-1) bundled locally — no API call needed for the list itself.
- Fields needed: `name`, `iso2`/`iso3` code, `dialCode` (if used for phone forms), `flagAsset` (emoji or SVG).

### Non-Functional Requirements
- Render performance: dropdown must stay smooth with ~250 items (virtualize list if performance testing shows jank).
- Bundle size: avoid pulling in a heavy country-data package if a lightweight JSON will do.
- Reusable as a shared component — used in forms across multiple projects (per your stack pattern of shared UI primitives).

---

## 4. Technical Approach

**Stack assumption:** React / Next.js + TypeScript + Tailwind (adjust if this belongs to a different stack).

### Component Structure
```
CountryDropdown/
├── CountryDropdown.tsx      # main component, controls open/close + selected state
├── CountrySearchInput.tsx   # search box, debounced onChange
├── CountryList.tsx          # renders filtered list, handles keyboard nav
├── CountryListItem.tsx      # single row: flag + name + code
├── countries.data.ts        # static country dataset
├── useCountryFilter.ts      # hook: search term -> filtered list
└── index.ts
```

### State
- `isOpen: boolean`
- `searchTerm: string`
- `selectedCountry: Country | null`
- `highlightedIndex: number` (for keyboard nav)

### Filtering Logic
- Simple case-insensitive `includes()` match on name first.
- If list grows or fuzzy match is desired later, consider `fuse.js` — but start simple, don't over-engineer v1.

### Performance Consideration
- Full country list (~195 items) generally doesn't need virtualization, but if the design includes extra metadata per row (flag image, dial code, subtext), consider `react-window` if scroll perf becomes an issue in testing.

---

## 5. Milestones

| Phase | Deliverable | Est. Effort |
|-------|-------------|--------------|
| 1. Data & Design | Finalize country dataset (JSON), confirm UI mockup (trigger style, dropdown style, mobile behavior) | 0.5 day |
| 2. Static Dropdown | Build dropdown that opens/closes and lists all countries, click-to-select works | 1 day |
| 3. Search | Add search input, live filtering, empty state | 0.5 day |
| 4. Keyboard & A11y | Arrow key nav, Enter/Esc, focus management, ARIA roles | 0.5–1 day |
| 5. Mobile Polish | Touch targets, responsive layout, test on small viewport | 0.5 day |
| 6. Integration | Wire into target form(s), replace old `<select>` | 0.5 day |
| 7. QA & Edge Cases | No-match search, rapid typing, long country names, pre-filled value | 0.5 day |

**Total estimate:** ~3.5–4.5 days depending on how many forms it needs to be integrated into.

---

## 6. Edge Cases to Test

- Country names with special characters (Côte d'Ivoire, São Tomé and Príncipe)
- Very short search terms (single letter matching many countries)
- Search term matching zero countries
- Pre-selected/default country on load (e.g. default to Indonesia)
- Dropdown open near bottom of viewport (should flip upward if no room)
- Rapid open/close/reopen (state should reset search term or persist — decide UX intent explicitly)
- Screen reader announces selected value and open/close state

---

## 7. Open Questions (need decision before/during build)

1. Should search also match by country **code** (e.g. typing "ID" finds Indonesia) or dial code?
2. Should there be a **default/pinned country** at the top of the list (e.g. Indonesia first, since primary user base is ID)?
3. Does this need to support **phone dial codes** (+62) or is it purely a country name picker?
4. Single reusable component across projects, or scoped to one app for now?
5. Design system reference — is there an existing dropdown/select pattern to match visually, or is this net-new?

---

## 8. Acceptance Test Checklist (for QA sign-off)

- [ ] Can select a country by clicking
- [ ] Can select a country using only keyboard
- [ ] Typing filters the list correctly and instantly
- [ ] Typing a non-existent country shows "no results" state
- [ ] Selected country persists and displays correctly after closing dropdown
- [ ] Component is usable on mobile viewport (375px width baseline)
- [ ] Screen reader can announce dropdown state and selection
- [ ] No console errors/warnings on mount, search, or select
