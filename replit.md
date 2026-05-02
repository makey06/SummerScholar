# Summer Learning Adventure

An interactive summer learning web app for a 5-year-old girl entering kindergarten.

## Architecture

- **Monorepo**: pnpm workspace
- **Frontend**: React + Vite (`artifacts/learn-app`) at path `/`
- **Backend**: Express API server (`artifacts/api-server`) at path `/api`
- **Database**: PostgreSQL via Drizzle ORM (`lib/db`)
- **API Contract**: OpenAPI spec → Orval codegen (`lib/api-spec`, `lib/api-zod`, `lib/api-client-react`)
- **Routing**: Wouter (client-side), reverse proxy for `/api`

## Features

- 8 learning subjects: Sight Words, Spelling, Rhyming, Counting, Letters, Patterns, Reading, Addition
- 8 weeks of progressive content per subject (24 lessons per subject = 192 total lessons)
- 8 activity types per subject
- Progress tracking with star ratings
- 20 achievement badges
- Child profile with customizable name + avatar emoji
- Animated UI with Framer Motion
- No login required — auto-loads single profile

## Subjects & Activity Types

| Subject | Activity Type |
|---------|--------------|
| Sight Words | `sight_word_flash` — display word, pick from choices |
| Spelling | `spelling_drag` — tap letters in order |
| Rhyming | `rhyme_match` — pick the rhyming word |
| Counting | `counting_tap` — count emoji objects, pick number |
| Letters | `letter_match` — match uppercase to lowercase |
| Patterns | `pattern_fill` — complete the AB/ABC pattern |
| Reading | `reading_passage` — read story, answer comprehension question |
| Addition | `addition_basic` — visual addition with emoji objects |

## Database

Tables: `profile`, `categories`, `lessons`, `activities`, `progress`, `achievements`

Seed: `pnpm --filter @workspace/scripts run seed`

## Key Files

- `artifacts/learn-app/src/App.tsx` — routing setup
- `artifacts/learn-app/src/pages/` — all pages (home, categories, category, lesson, achievements, profile)
- `artifacts/learn-app/src/components/` — shared components
- `artifacts/api-server/src/routes/` — all API routes
- `lib/api-spec/openapi.yaml` — API spec
- `lib/db/src/schema/index.ts` — database schema
- `scripts/src/seed.ts` — seed script

## Development

- API server: `pnpm --filter @workspace/api-server run dev`
- Frontend: `pnpm --filter @workspace/learn-app run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Seed: `pnpm --filter @workspace/scripts run seed`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
