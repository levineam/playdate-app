# Playdate App (Monorepo)

Playdate helps families coordinate kids' playdates with shared availability, invite workflows, and lightweight scheduling.

## Apps

- `apps/web` — Next.js web application (primary preview/deploy target)
- `apps/mobile` — Expo mobile scaffold
- `packages/shared-types` — Shared Zod schemas and TypeScript types

## Local development

```bash
npm install
npm run dev
```

Useful scoped commands:

```bash
npm run lint --workspace=apps/web
npm run type-check --workspace=apps/web
npm run build --workspace=apps/web
npm run test:e2e --workspace=apps/web
```

## Deployments

`vercel.json` is configured to build from `apps/web`.

## Planning + execution tracking

- Audit and milestone plan: `docs/mvp-audit-and-execution-plan.md`
- Task board: `docs/mvp-task-board.md`
