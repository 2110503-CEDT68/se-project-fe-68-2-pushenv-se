# Frontend

Next.js 16 frontend scaffold for the Job Fair platform.

## Stack

- Next.js 16.2.2 with App Router
- React 19
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm typecheck`

## Notes

- Route groups are split by role under `src/app`.
- `src/proxy.ts` contains the initial role-based guard setup for Next.js 16.
- Shared API/auth/query helpers live in `src/lib`.
- This repo is intentionally scaffolded only inside `project/frontend`.
