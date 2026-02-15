# Playdate MVP Task Board

_Last updated: 2026-02-15_

## Availability-first objective (active)
**Objective:** make it effortless to say **“We’re available for a playdate.”**

### OKR mapping
- **O1 / KR1:** Availability CTA is first dashboard interaction
  - [x] Promote availability card to top of dashboard
  - [x] Update landing copy to reflect availability-first promise
- **O1 / KR2:** Baseline broadcast flow is near-instant
  - [x] Add one-tap broadcast CTA
  - [x] Add broadcast activity history panel
- **O1 / KR3:** Optional depth without friction
  - [x] Add optional details prompt (time window/location/note)
- **O2 / KR1:** Audience clarity prior to send
  - [x] Show connected-family audience scope in broadcast card
- **O2 / KR2:** Anti-spam throttle
  - [x] Add cooldown with remaining-time UI
- **O2 / KR3:** Accidental-send reduction
  - [x] Add confirmation before sending broadcast

## Milestones

### Milestone A — Availability-first UX (Done)
- [x] Availability action appears first in dashboard hierarchy
- [x] Dashboard copy emphasizes immediate availability signal

### Milestone B — Broadcast workflow (Done)
- [x] One-tap broadcast path works in preview mode
- [x] Optional detail prompt can enrich outgoing broadcast
- [x] Broadcast history reflects recent sends

### Milestone C — Safety guardrails (Done)
- [x] Audience clarity present
- [x] Confirmation prompt enforced
- [x] Cooldown throttles repeated sends

### Milestone D — Persistence + delivery (Next)
- [ ] Persist broadcasts to Supabase
- [ ] Enforce cooldown server-side
- [ ] Deliver notifications to connected families

## QA and quality gates
- [x] Update Playwright smoke coverage for availability-first UI
- [x] Cover one-tap broadcast + cooldown behavior
- [x] Cover optional details broadcast behavior
- [ ] Run mobile checks when mobile scope changes

## Command validation (web)
- [x] `npm run lint --workspace=apps/web`
- [x] `npm run type-check --workspace=apps/web`
- [x] `npm run build --workspace=apps/web`
- [x] `npm run test:e2e --workspace=apps/web`

## Blockers requiring Andrew decisions
- [ ] Choose backend rollout order for persistence: (A) availability broadcasts first, or (B) planner/invite persistence first
