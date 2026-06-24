# SummerScholar 🌟

An interactive summer learning web app built for a 5-year-old entering kindergarten. Covers 8 subjects across 8 progressive weeks, with animated activities, progress tracking, and achievement badges. No login required.

## Features

- **8 learning subjects**: Sight Words, Spelling, Rhyming, Counting, Letters, Patterns, Reading, and Addition
- **192 total lessons**: 24 lessons per subject across 8 weeks of progressive content
- **20 achievement badges** to earn along the way
- **Star ratings** to track progress per lesson
- **Child profile** with customizable name and avatar emoji
- **Animated UI** powered by Framer Motion
- No login required, as the app auto-loads a single child profile

## Activity Types

| Subject | Activity |
|---------|----------|
| Sight Words | Flash card: see the word, pick from choices |
| Spelling | Tap letters in the correct order |
| Rhyming | Pick the word that rhymes |
| Counting | Count emoji objects and pick the number |
| Letters | Match uppercase to lowercase letters |
| Patterns | Complete the AB/ABC pattern |
| Reading | Read a short story and answer a comprehension question |
| Addition | Visual addition problems using emoji objects |

## Tech Stack

- **Frontend**: React + Vite (TypeScript)
- **Backend**: Express API server
- **Database**: PostgreSQL via Drizzle ORM
- **API Contract**: OpenAPI spec with Orval codegen
- **Routing**: Wouter (client-side) + reverse proxy for `/api`
- **Animations**: Framer Motion
- **Monorepo**: pnpm workspace

## Project Structure

/
├── artifacts/
│   ├── learn-app/        # React + Vite frontend
│   ├── api-server/       # Express backend
│   └── mockup-sandbox/   # Design mockups
├── lib/
│   ├── db/               # Drizzle ORM schema & migrations
│   ├── api-spec/         # OpenAPI spec
│   ├── api-zod/          # Zod validators (generated)
│   └── api-client-react/ # React query client (generated)
└── scripts/              # Seed script and utilities

## Getting Started

**Install dependencies**
```bash
pnpm install
```

**Set up the database**
```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run seed
```

**Run the app**
```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend (in a separate terminal)
pnpm --filter @workspace/learn-app run dev
```

**Other commands**
```bash
# Type check everything
pnpm run typecheck

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

## Database Schema

Tables: `profile`, `categories`, `lessons`, `activities`, `progress`, `achievements`

## About

Built as a fun summer project to help a kindergartener get a head start, mixing a little parenting with a little product management and a lot of TypeScript.
