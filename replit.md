# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite (TanStack Query, Wouter, Tailwind CSS, Shadcn UI)

## Project: Orbi

**Orbi** is a Brazilian employer branding and job platform for startups and tech companies — inspired by Welcome to the Jungle, adapted for the Brazilian market.

### Features (MVP)
- Home page with hero search, stats, featured companies, categories, recent jobs, articles
- Companies directory with search and category/size filters
- Company profiles with description, values, benefits, photos, and job listings
- Jobs listing with advanced filters (modality, contract type, level, category)
- Job detail page with requirements, benefits, and apply CTA
- Articles/media section with career content
- Full Brazilian Portuguese UI (CLT/PJ, R$ salary, Brazilian cities)

### Brand
- Primary: Orbi Yellow (#FFD100)
- Theme: Yellow hero + black stats bar + white content areas
- Typography: Inter (bold, editorial feel)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── orbi/               # React + Vite frontend (Orbi app)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
│   └── src/seed.ts         # Database seed script
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- **companies** — Company profiles (name, slug, logo, cover, tagline, description, category, size, city, benefits, values, photos)
- **jobs** — Job listings (title, company_id, category, description, requirements, benefits, city, modality, contract_type, level, salary)
- **articles** — Career articles (title, slug, excerpt, content, cover_image, category, author, read_time)

## API Routes

All routes under `/api`:
- `GET /healthz` — Health check
- `GET /companies` — List companies (filters: category, search, size, featured)
- `GET /companies/:id` — Company detail
- `GET /jobs` — List jobs (filters: search, location, modality, contractType, level, category)
- `GET /jobs/:id` — Job detail (includes company info)
- `GET /articles` — List articles (filter: category)
- `GET /articles/:id` — Article detail
- `GET /categories` — Company categories with counts
- `GET /stats` — Platform stats (jobs, companies, candidates, cities)

## Frontend Routes

- `/` — Home (hero search, stats, featured companies, categories, jobs, articles)
- `/empresas` — Companies directory
- `/empresas/:id` — Company profile
- `/vagas` — Jobs listing
- `/vagas/:id` — Job detail
- `/artigos` — Articles

## Development Commands

- `pnpm --filter @workspace/orbi run dev` — Start frontend (port 24332)
- `pnpm --filter @workspace/api-server run dev` — Start API (port 8080)
- `pnpm --filter @workspace/db run push` — Push DB schema
- `pnpm --filter @workspace/scripts run seed` — Seed sample data
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client from OpenAPI spec
