# Playdate MVP Task Board

_Last updated: 2026-02-15_

## Now (active)
- [x] Replace dashboard placeholder with real user-facing MVP workspace
- [x] Add tracked plan + execution artifacts to repository
- [x] Update smoke coverage to prevent placeholder regressions

## Next up (P0)
- [ ] Wire dashboard data to Supabase (events, invites, availability)
- [ ] Persist quick planner drafts/events to backend
- [ ] Persist invite response actions

## P1
- [ ] Implement family profile CRUD (web)
- [ ] Implement child CRUD (web)
- [ ] Add connection management workflow (request/accept/decline)

## P2
- [ ] Stabilize mobile routing/layout for expo-router
- [ ] Implement mobile auth/session wiring
- [ ] Wire mobile availability/profile screens to backend

## Quality gates
- [x] Web lint passes
- [x] Web type-check passes
- [x] Web build passes
- [x] Web Playwright smoke passes
- [ ] Mobile lint/type-check/build checks (run when mobile changes in scope)

## Blockers requiring Andrew decisions
- [ ] Decide if preview mode should use demo seed data only, or write to a dedicated preview Supabase project
- [ ] Confirm preferred first persistent scope: (A) playdate planning + invite responses, or (B) profile + children CRUD
