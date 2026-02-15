# Playdate MVP Audit + Execution Plan (Web + Mobile)

_Last updated: 2026-02-15_

## 1) Why expectations mismatched

The preview branch focused on **auth survivability for Vercel previews** (magic-link fallback + preview bypass). During that rollout, `/dashboard` was intentionally left as a temporary placeholder (`"Temporary dashboard placeholder for the preview-auth rollout"`).

Result: auth paths worked, but the first post-login product surface did not represent the MVP.

---

## 2) Current-state audit vs MVP scope

### Intended MVP scope (inferred from schema + existing code)
- Account/auth for parents
- Family profile + children
- Availability windows per child
- Family connections
- Playdate events + invites + responses
- Notification feed
- Web-first experience, mobile scaffold in parallel

### Web app audit

| Area | Status | Evidence | Gap |
|---|---|---|---|
| Landing + auth entry | ✅ Done | `src/app/page.tsx`, `src/app/auth/page.tsx` | None for MVP preview |
| Preview auth resiliency | ✅ Done | `auth-mode.ts`, `/auth/preview`, callback guard | Needs real auth in production env |
| Dashboard shell | ⚠️ Previously placeholder, now replaced | `src/app/dashboard/page.tsx` | Data still seeded for preview mode |
| Scheduling workflow | 🟡 Partial | New dashboard planner draft workflow | Missing persistence + invite send flow |
| Invite response flow | 🟡 Partial | New dashboard invite queue response controls | Missing server persistence |
| Availability + match visibility | 🟡 Partial | New availability + suggested overlaps section | Missing algorithm-backed API integration |
| API/data wiring | ❌ Not done | No web data access layer in routes/actions | Need Supabase-backed queries/mutations |

### Mobile app audit

| Area | Status | Evidence | Gap |
|---|---|---|---|
| Expo monorepo wiring | ✅ Baseline | `apps/mobile/package.json`, Expo config | Needs route/layout hardening |
| Availability screen scaffold | 🟡 Placeholder | `app/(tabs)/availability.tsx` | No real data/CRUD |
| Profile screen scaffold | 🟡 Placeholder | `app/(tabs)/profile.tsx` | Auth + profile wiring TODOs |
| Auth/session integration | ❌ Not done | TODO comments in profile screen | Build shared client + secure session flow |

### Backend/data audit

| Area | Status | Evidence | Gap |
|---|---|---|---|
| Core schema + RLS | ✅ Strong foundation | `supabase/migrations/20260213095115_initial_schema.sql` | Need app-layer queries and mutation API |
| Shared validation types | ✅ Baseline | `packages/shared-types/src/schemas.ts` | Extend schemas to exact DB shape alignment |
| Read/write app services | ❌ Not done | No server actions/routes in web app | Implement MVP service layer |

---

## 3) Milestones and acceptance criteria

## Milestone 0 — Preview no longer placeholder (completed in this run)
**Goal:** User sees real product-oriented dashboard immediately after preview auth.

**Acceptance criteria**
- `/dashboard` has no placeholder text
- Shows: schedule, invite queue, availability, match suggestions, quick planner
- Existing preview-auth smoke flow stays green

## Milestone 1 — Persistent web MVP workflows
**Goal:** Move dashboard from seeded preview UI to persisted data.

**Acceptance criteria**
- Draft playdate creation writes to Supabase
- Invite response updates persisted and reflected on reload
- Availability windows read from DB and render correctly
- Core dashboard queries protected by auth/RLS

## Milestone 2 — Family + child profile management
**Goal:** Enable profile completion and child management end-to-end.

**Acceptance criteria**
- Create/update family profile
- Create/update/deactivate children
- Validation + error states covered

## Milestone 3 — Mobile parity for core flows
**Goal:** Mobile supports at least read + lightweight update for profile/availability.

**Acceptance criteria**
- Mobile app routes/layout stable
- Auth/session works in mobile
- Availability and profile screens wired to backend

## Milestone 4 — Reliability and release hardening
**Goal:** Ship-ready quality gates and docs.

**Acceptance criteria**
- CI green for web/mobile on branch
- Preview E2E includes happy path + guardrails
- README + runbook updated for local + preview environments

---

## 4) Prioritized backlog (next execution order)

1. **Data service layer for dashboard** (Supabase reads for events/invites/availability)
2. **Persist planner drafts/events** (server action + validation)
3. **Persist invite responses**
4. **Profile + children CRUD (web)**
5. **Mobile route/layout stabilization + auth wiring**
6. **Mobile availability/profile data integration**

---

## 5) Work completed in this execution cycle

- Replaced dashboard placeholder with a functional **MVP scheduling workspace**
- Added quick planner form to create draft playdates in-session
- Added actionable invite queue controls (accept/maybe/decline)
- Added availability and suggested-overlap sections
- Updated smoke tests to assert new dashboard behavior and prevent placeholder regressions
- Added execution planning + task-board artifacts (`docs/`)
