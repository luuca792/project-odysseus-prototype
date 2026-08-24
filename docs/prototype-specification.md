# UI Prototype Specification

> **Purpose:** Define a clickable, locally-runnable UI prototype covering every feature in [`specification.md`](./specification.md), so stakeholders (Student Association / BCH representatives) can review and validate the product idea before real backend/architecture work begins.
>
> **Not in scope for this prototype:** real authentication, a real database, file storage, real PDF/Word generation, or production-grade security. This is a **visual and interaction review tool**, not an MVP.

## 1. Goals & Non-Goals

**Goals:**
- Every feature listed in `specification.md` sections 3.1–3.7 has at least one reachable screen.
- A reviewer can log in as a mock account for each role (Member, BCH, Admin) and see role-appropriate screens/actions.
- Visual style reflects Can Tho University branding (see [Section 6](#6-branding--design-tokens)) so reviewers judge it in-context, not as generic wireframes.
- Runs locally with a single command, no external services or accounts needed.

**Non-Goals (explicitly deferred):**
- Real data persistence beyond the browser session (see [Section 4](#4-data-strategy)).
- Real file upload/storage — image and document "uploads" are simulated (either placeholder previews or picking from a bundled mock asset).
- Real Word/PDF export — the print/export screen renders a preview and a disabled/mock "Download" button.
- Resolving the open questions in `specification.md` §5 — where the spec is ambiguous, the prototype makes a **visible, labeled assumption** (see [Section 7](#7-assumptions-for-ambiguous-areas)) so reviewers can react to it directly rather than the prototype silently guessing.

## 2. Tech Stack & Project Setup

| Aspect | Choice | Notes |
|---|---|---|
| Framework | React 18 + TypeScript | Component-based, matches likely production direction. |
| Build tool | Vite 6 | Fast local dev server (`npm run dev`), minimal config. Pinned to v6 rather than latest — Vite 8's default bundler needs a Node engine (≥20.19) newer than what's installed locally (20.18); v6 uses the stable esbuild/rollup pipeline and needs no native binaries. |
| Routing | React Router (client-side) | One route per page (see §5). |
| Styling | Plain CSS (CSS Modules) + shared design tokens file | No heavy UI framework dependency, keeps full control over CTU branding; avoids fighting a component library's default look. |
| State | React Context + local component state | No Redux/Zustand needed at this scale — see §4. |
| Icons | A single open-source icon set (e.g. Lucide) | Consistent icon style without custom SVG work. |
| Fonts | Self-hosted `K2D` (headings) + `Readex Pro` (body), from `/resources/fonts` | Loaded as `@font-face` locally — no external font CDN calls needed. |
| Package manager | npm | Default, no assumption of pnpm/yarn availability. |

**Run commands (target):**
```
npm install
npm run dev      # starts local dev server, opens in browser
```

**Folder structure (target):**
```
/prototype
  /src
    /assets          -> logo, fonts, mock images
    /components       -> shared UI building blocks (see §5.2)
    /pages            -> one file/folder per page (see §5.1)
    /mock-data        -> seed data: members, activities, badges, posts, funds...
    /context          -> AuthContext (mock role/session), other shared state
    /styles           -> design tokens (colors, type scale), global CSS
    App.tsx
    main.tsx
  index.html
  package.json
  vite.config.ts
```

## 3. Role Simulation (Mock Login)

- A **mock login page** lists demo accounts to pick from, e.g.:
  - "Trần Văn A — Executive Committee (BCH), Chi hội CNTT"
  - "Nguyễn Thị B — Member, Chi hội CNTT"
  - "System Administrator"
- Clicking a demo account signs in as that role (no password) and routes to that role's default landing page (Dashboard).
- A persistent "Signed in as: [Name] ([Role]) · Switch account" control in the header lets reviewers jump between roles without re-navigating to the login page each time.
- Auth state lives in `AuthContext`, resets on full page reload (no token persistence needed).

## 4. Data Strategy

- **Static mock data only**, defined as TypeScript fixtures in `/src/mock-data` (e.g. `members.ts`, `activities.ts`, `badges.ts`, `forumPosts.ts`, `feedback.ts`, `funds.ts`, `subAssociation.ts`).
- Seed at least: 2 sub-associations (to make role-boundary assumptions visible), ~10–15 members, ~8–10 activities across all 4 types, a handful of badges, a handful of forum posts with comments, a few feedback entries, and one term-of-office fund ledger.
- CRUD actions (create activity, assign badge, post comment, etc.) update **in-memory React state** for the duration of the session, so the UI feels alive when clicked through — but nothing survives a page refresh. This matches the "static mock data only" review purpose: fast to build, no persistence-layer complexity, while still letting reviewers see forms/actions actually reflect back in lists.
- No network calls, no `.env`, no external API keys.

## 5. Pages & Components

### 5.1 Page Inventory

Each row maps to spec section(s) so nothing is missed.

| # | Page | Route | Roles | Spec ref |
|---|---|---|---|---|
| 1 | Login (mock account picker) | `/login` | all | §3 role simulation |
| 2 | Dashboard (home) | `/` | Member, BCH, Admin | overview landing, links into everything below |
| 3 | My Profile | `/profile` | Member, BCH | §3.1 |
| 4 | Sub-Association Info | `/sub-association` | Member, BCH | §3.7 info page |
| 5 | Activities — List | `/activities` | Member, BCH | §3.2 |
| 6 | Activity — Detail | `/activities/:id` | Member, BCH | §3.2 |
| 7 | Activity — Create/Edit form | `/activities/new`, `/activities/:id/edit` | BCH only | §3.2 |
| 8 | Members — List | `/members` | BCH | §3.3 |
| 9 | Member — Detail | `/members/:id` | BCH | §3.3 |
| 10 | Badges — Management | `/badges` | BCH | §3.4 |
| 11 | Feedback — List/Submit | `/feedback` | Member, BCH | §3.5 |
| 12 | Forum — List | `/forum` | Member, BCH | §3.6 |
| 13 | Forum — Post Detail + Comments | `/forum/:id` | Member, BCH | §3.6 |
| 14 | Forum — Create Post | `/forum/new` | Member, BCH | §3.6 |
| 15 | Forum — Moderation Queue | `/forum/moderation` | BCH | §3.6 moderation |
| 16 | Quota Tracker | `/quota` | BCH | §3.7 |
| 17 | Fund Tracker | `/funds` | BCH | §3.7 |
| 18 | Document Generator | `/documents` | BCH | §3.7 print/export |
| 19 | Admin — Sub-Associations overview | `/admin` | Admin | role placeholder (see §7 assumption) |
| 20 | Not Found / 403 | `*` | all | fallback for role-guarded routes |

**Total: 20 routes**, covering every functional requirement bullet in the spec.

### 5.2 Shared Components

| Component | Purpose |
|---|---|
| `AppShell` | Header (logo, sub-association name, nav, account switcher) + sidebar/nav + content area. Responsive: sidebar collapses to bottom/hamburger nav on mobile. |
| `RoleGuard` | Wraps a route; redirects/shows 403 page if current mock role lacks access. |
| `Card` | Generic content card (used for activities, members, badges, posts). |
| `DataTable` | Sortable table (used for Members list — sortable by activity count — and Fund ledger). |
| `Badge` (UI chip) | Small colored tag — used both for literal "badges/huy hiệu" and for status tags (e.g. activity type, post status). |
| `ActivityTypeTag` | Color-coded tag for the 4 activity types. |
| `Modal` / `Drawer` | Used for quick actions (assign badge, mark core member, confirm delete). |
| `FormField` set | Text input, textarea, select, date picker, file-picker (mocked), reused across all create/edit forms. |
| `ImagePicker` (mock) | Simulates image upload by letting users pick from a small bundled gallery of placeholder images, or shows a preview thumbnail. |
| `DocumentPicker` (mock) | Simulates attaching a document — shows a fake filename/size, no real file handling. |
| `ProgressStat` | Used for quota completion (%) and fund remaining — a labeled progress bar/ring. |
| `CommentThread` | Nested/flat comment list + reply box, used in Forum post detail. |
| `EmptyState` | Consistent "nothing here yet" placeholder across lists. |
| `Toast` | Lightweight confirmation feedback for mock actions ("Activity created", "Badge assigned"). |

### 5.3 Page-Level Notes

**Dashboard** — role-aware summary cards:
- Member: recent activities participated in, badges earned, recent forum posts.
- BCH: quota progress snapshot, fund snapshot, pending moderation count, recent member activity.
- Admin: list of sub-associations with basic stats (member count, activity count).

**Activities List** — filter by type (4 categories) and term of office; card or table view toggle; "Create Activity" button visible only to BCH.

**Activity Detail** — shows images gallery, description, type tag, participant list; a **Documents** section visible only when viewing as BCH (enforces the "BCH-only" visibility rule from spec §3.2).

**Members List** — sortable by activity count (default: descending, per spec §3.3); core-member flag shown as a star/highlight; row action to open Member Detail.

**Member Detail** — profile summary, activity history list, badges held, and BCH-only actions: mark as core member, award badge/medal (opens modal).

**Badges Management** — grid of existing badge types with a "Create Badge" action (name + icon/color + description, per the "Hội viên tiêu biểu T10" example); clicking a badge shows which members hold it, with assign/remove actions.

**Feedback** — simple submission form (topic select + free text) plus a list view; since the spec doesn't define a response workflow (§7 open question), the list shows a status tag (`New` / `Reviewed`) that BCH can manually toggle — flagged in the UI as a provisional flow for stakeholder feedback.

**Forum List/Detail/Create** — post list with topic/category tag; detail page with nested comments; BCH sees moderation controls (approve/hide/delete) inline as well as in the dedicated Moderation Queue page.

**Quota Tracker** — since "quota" definition is ambiguous (§7), the prototype shows a simple "X of Y activities organized this term" progress bar with a visible note: *"Definition of quota pending confirmation — placeholder metric."*

**Fund Tracker** — starting balance, a table of per-activity expenditures, computed remaining balance.

**Document Generator** — template picker (Plan / Budget Estimate / Official Document), a form for template fields, and a preview pane; "Download as Word/PDF" buttons are present but show a toast ("Export not implemented in prototype") instead of producing a real file.

**Admin overview** — minimal placeholder page listing mock sub-associations, since the spec doesn't detail admin-specific features beyond "system administration" (§7 assumption AD-1).

## 6. Branding & Design Tokens

Sourced from `/resources`:

- **Logo:** `resources/logo/CTU_logo.png` (full color, for header/login) and `CTU_logo_singlecolor.png` (for footer/watermark or dark backgrounds).
- **Colors:**
  - `--color-primary-bold: #1f5ca9` (primary brand blue — buttons, header, links)
  - `--color-primary-light: #00afef` (accents, highlights, secondary actions)
  - Supporting neutrals (grays for text/background) and semantic colors (success/warning/error/info) to be defined in `/src/styles/tokens.css` — not specified in source, prototype will pick a standard accessible neutral scale.
- **Fonts:**
  - `K2D` — headings, nav labels, buttons (geometric, youthful — matches "trẻ trung, bắt mắt" requirement).
  - `Readex Pro` — body text, form inputs, table content (designed for strong multilingual/Vietnamese-diacritic support and readability).
  - Both bundled locally from `/resources/fonts`, loaded via `@font-face` — verify Vietnamese diacritics render correctly for both before finalizing (**check needed**, see §7).
- **Style references:** `resources/references.txt` points to `ctu.edu.vn/branding` and `ctu.edu.vn` for header/footer layout and general styling cues — to be reviewed visually during build, not copied verbatim.
- **Responsive breakpoints:** mobile (< 640px), tablet (640–1024px), desktop (> 1024px) — standard breakpoints, per non-functional requirement of responsive support.

## 7. Assumptions for Ambiguous Areas

Since `specification.md` §5 lists open questions, the prototype resolves each one with a **visible, labeled placeholder** rather than silently guessing, so reviewers can react directly:

| ID | Ambiguity | Prototype assumption |
|---|---|---|
| AD-1 | Admin role scope undefined | Minimal read-only "sub-associations overview" page; not fleshed out until clarified. |
| AD-2 | Feedback response workflow undefined | Manual `New`/`Reviewed` status toggle, no notifications. |
| AD-3 | "Quota" definition undefined | Placeholder "activities organized / target" ratio with an on-screen disclaimer note. |
| AD-4 | Forum pre-approval vs. post-hoc moderation | Prototype implements **post-hoc** moderation (post goes live immediately, BCH can hide/delete after) since it's simpler to demo both states; a visible note flags this as an assumption to confirm. |
| AD-5 | Cross-sub-association visibility | Assume **no cross-visibility** for BCH/Member roles; Admin role can see all sub-associations. |
| AD-6 | Term-of-office rollover behavior | Not modeled in this prototype — only one active term of office exists in mock data; a note states rollover behavior is TBD. |
| AD-7 | Font Vietnamese-diacritic rendering | To be visually verified during build; fallback to a system font stack if issues found. |

Each of these will appear as a small inline note or tooltip in the relevant screen (e.g., a muted banner: "⚠ Placeholder logic — pending stakeholder confirmation") so the review session naturally surfaces these decisions for discussion.

## 8. Build Plan (Milestones)

1. **Scaffold** — Vite + React + TS project, folder structure, design tokens, fonts/logo wired in, `AppShell` with responsive nav.
2. **Auth & routing shell** — mock login page, `AuthContext`, `RoleGuard`, route table, Dashboard skeleton per role.
3. **Core content pages** — Sub-Association Info, Activities (list/detail/create/edit), Members (list/detail).
4. **Achievement + engagement pages** — Badges management, Feedback, Forum (list/detail/create/moderation).
5. **BCH utilities** — Quota Tracker, Fund Tracker, Document Generator (mocked export).
6. **Admin placeholder + Profile page + polish pass** — Admin overview, My Profile, empty states, toasts, responsive QA across breakpoints.
7. **Review pass** — walk every page against the spec's functional requirement checklist (§9) before handing off for stakeholder review.

## 9. Feature Coverage Checklist

To be used as a final sign-off checklist before presenting the prototype:

- [ ] 3.1 Personal info: view/update profile, view participated activities, view own posts, view badges
- [ ] 3.2 Activities: create/edit/delete, 4 activity types selectable, image attach (mock), BCH-only documents
- [ ] 3.3 Members: list view, activity history, sort by participation, mark core member, award badge/medal
- [ ] 3.4 Badges: create badge type, assign to member, remove from member
- [ ] 3.5 Feedback: create with topic + content, list view
- [ ] 3.6 Forum: create post, comment, BCH approve/hide/delete
- [ ] 3.7 Utilities: sub-association info, quota tracker, fund tracker, document generator (mock export)
- [ ] Non-functional: responsive layout verified at mobile/tablet/desktop; CTU branding (colors/fonts/logo) applied consistently

## 10. Source Documents

- Feature scope: [`specification.md`](./specification.md)
- Branding assets: `/resources/logo`, `/resources/color-code.txt`, `/resources/fonts`, `/resources/references.txt`
