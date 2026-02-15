# Playdate MVP Audit + Execution Plan (Availability-First)

_Last updated: 2026-02-15_

## 1) Decision snapshot

**Product decision:** make the first meaningful action in the web MVP **“We’re available for a playdate”** and optimize the path for speed + safety.

**Why now:** the app had solid scheduling/invite scaffolding, but the most common parent intent (quickly signaling availability) was not the primary entry action.

---

## 2) Structured adversarial refinement (pre-implementation)

### PM persona — goal clarity + success metrics
- **Goal clarity:** parents want to notify trusted families with minimal effort when a window opens.
- **Core job-to-be-done:** “I have a free window right now; help me find a playdate fast.”
- **Success metrics (MVP):**
  - Time-to-broadcast from dashboard load: **< 10 seconds**
  - Availability action visible above fold on dashboard: **100%**
  - Broadcast completion (preview workflow): **high completion, low abandonment**

### UX persona — fastest happy-path + friction audit
- **Happy path:** open dashboard → tap primary CTA → confirm → broadcast sent.
- **Friction removed:** no multi-field required form for default path.
- **Optional depth:** details prompt is secondary and only shown on demand.
- **UI placement:** availability action moved to top-priority hero card before planning widgets.

### Safety/Privacy persona — abuse/spam/consent guardrails
- **Audience clarity:** explicit statement that broadcasts go only to connected families.
- **Consent boundary:** mention mutual connections as recipients.
- **Anti-spam control:** cooldown between broadcasts.
- **Accidental-send prevention:** confirmation step before dispatch.

### Architect persona — implementation tradeoffs + data/API impact
- **Tradeoff:** implement local state flow first (preview-safe) before backend persistence.
- **Data model impact (future):** add `availability_broadcasts` entity with sender family, audience snapshot, optional details payload, and sent timestamp.
- **API impact (future):** one mutation endpoint/server action for fast send + cooldown enforcement at server layer.
- **Current scope:** keep seeded dashboard data and local broadcast log for reliable preview behavior.

### QA persona — failure modes + edge cases
- **Critical cases covered:**
  - confirmation cancel path
  - cooldown disables repeat send
  - optional details rendered in history
  - missing preview session still redirects to auth
- **Regression risk controlled:** smoke tests now assert availability-first UI instead of just planner visibility.

---

## 3) Synthesis + final recommendation

**Recommendation adopted:**
1. Promote a dedicated availability-first card as the first dashboard module.
2. Support one-tap broadcast with optional detail enrichment.
3. Add guardrails (recipient clarity + confirmation + cooldown).
4. Keep planner/invite workflows, but demote them below availability action.

This maximizes speed for the primary parent intent while reducing spam and accidental sends.

---

## 4) OKR mapping (explicit)

| Objective | Key Result | Product tasks mapped |
|---|---|---|
| **O1: Make “We’re available” effortless** | **KR1:** availability CTA is first interactive module on dashboard | Availability-first hero card + CTA placement |
|  | **KR2:** user can send baseline availability in one primary action path | One-tap broadcast flow |
|  | **KR3:** optional detail enrichment does not block default send | Add-details prompt (optional form) |
| **O2: Reduce spam/abuse risk** | **KR1:** clear recipient scope before send | Audience clarity with connected-family context |
|  | **KR2:** prevent rapid repeated sends | Cooldown timer + disabled CTA |
|  | **KR3:** reduce accidental broadcasts | Confirmation prompt before send |

---

## 5) Milestones + acceptance criteria

## Milestone A — Availability-first surface (completed)
**Acceptance criteria**
- Dashboard first-view foregrounds “We’re available for a playdate”.
- CTA is visible without scrolling in normal desktop viewport.
- Landing copy aligns with availability-first value proposition.

## Milestone B — Broadcast flow with optional details (completed)
**Acceptance criteria**
- One-tap default broadcast path is available.
- Optional details prompt can be expanded and submitted.
- Broadcast history shows sent entries and included details (when provided).

## Milestone C — Guardrails (completed)
**Acceptance criteria**
- Audience clarity is explicit in UI.
- Confirmation is required prior to send.
- Cooldown blocks repeat sends and communicates remaining time.

## Milestone D — Persisted availability broadcasts (next)
**Acceptance criteria**
- Broadcast records persist in Supabase and survive reload.
- Server-side cooldown enforcement prevents client bypass.
- Connected-family audience resolution performed server-side.

---

## 6) Next execution order

1. Persist availability broadcasts via Supabase + RLS-safe server action
2. Add delivery/notification fan-out for connected families
3. Instrument analytics for time-to-broadcast and completion rates
4. Continue persistent planner + invite response workflows

