# 🌍 Orbitra — Every Satellite Has a Story

A cinematic satellite tracking experience. Orbitra treats every satellite as a living character with its own journey — part documentary, part mission control, part art installation.

> Not another satellite tracker. A storytelling platform for the skies.

---

## ✨ Features

- **🌐 3D Globe** — Rotating Earth with thousands of orbiting satellites, atmospheric glow, city lights, and starfield
- **🎬 Story Mode** — Click any satellite to enter "Now Orbiting" — cinematic panel with AI narration, journey chapters, and stats
- **⏳ Timeline Mode** — Scrub through space history from Sputnik to present
- **🔍 Explore Mode** — Filter satellites by country, mission, orbit type, constellation
- **📍 Personal Mode** — See satellites overhead, ISS pass countdown, daily space summary
- **🎨 Cinematic Design** — Dark theme, glassmorphism, bloom effects, smooth animations (Framer Motion + GSAP)

---

## 🏗️ Architecture

```
orbitra/
├── apps/web/          # Next.js 15 (App Router) — frontend + API routes
├── packages/database/ # Prisma schema, migrations, seed data
└── services/
    └── orbital-engine/ # Python FastAPI microservice for SGP4 propagation
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **3D Rendering** | React Three Fiber + Three.js + Drei |
| **Animations** | Framer Motion + GSAP |
| **State** | Zustand (client), TanStack Query (server) |
| **Database** | PostgreSQL + Prisma |
| **Orbital Math** | satellite.js + Python Skyfield |
| **Styling** | Tailwind CSS |
| **TLE Data** | CelesTrak API |

---

## 📦 What You Need to Install (Fresh Machine)

This is the complete list of everything required to run Orbitra on a new machine.

### 1. Node.js (v22 or later)

**macOS (Homebrew):**
```bash
brew install node@22
```

**macOS (official installer):**
Download from https://nodejs.org (LTS version, 22.x or later)

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify:**
```bash
node --version   # must be >= 22.0.0
npm --version
```

---

### 2. pnpm (v10 or later)

```bash
npm install -g pnpm
```

**Verify:**
```bash
pnpm --version   # must be >= 10.0.0
```

---

### 3. Docker (for PostgreSQL)

**macOS:** Download Docker Desktop from https://www.docker.com/products/docker-desktop

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER   # log out and back in after this
```

**Verify:**
```bash
docker --version
docker compose version
```

> If you already have PostgreSQL installed locally (v16+), you can skip Docker. Just create a database named `orbitra` and update the `.env.local` file with your connection string.

---

### 4. Python 3.12+ (optional — only for the orbital engine microservice)

The orbital engine is optional. The app uses `satellite.js` (JavaScript) as the primary orbital math library. Python is only needed if you want higher-precision SGP4 propagation via Skyfield.

**macOS (Homebrew):**
```bash
brew install python@3.12
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y python3 python3-pip python3-venv
```

**Verify:**
```bash
python3 --version   # must be >= 3.12
```

---

### 5. Git

```bash
git --version
```

Install from https://git-scm.com if not present.

---

## 🚀 Quick Start (After Installing Everything Above)

### Step 1: Clone the project

```bash
git clone <repo-url> orbitra
cd orbitra
```

---

### Step 2: Install all JavaScript dependencies

```bash
pnpm install
```

This installs all workspace packages:
- `apps/web` — Next.js, React, Three.js, R3F, Framer Motion, GSAP, Zustand, TanStack Query, Tailwind, etc.
- `packages/database` — Prisma client, migrations tool

---

### Step 3: Configure environment

```bash
cp .env.example .env.local
```

The default `.env.example` already has the correct values for local development:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/orbitra?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Only change these if your PostgreSQL setup differs from the default Docker setup.

---

### Step 4: Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 17 container with:
- **User:** postgres
- **Password:** postgres
- **Database:** orbitra
- **Port:** 5432

Wait a few seconds for the database to be ready, then verify:
```bash
docker compose ps   # should show "healthy" or "running"
```

---

### Step 5: Generate Prisma client + run migrations

```bash
pnpm --filter @orbitra/database db:generate
pnpm --filter @orbitra/database db:migrate
```

---

### Step 6: Seed the database

```bash
pnpm --filter @orbitra/database db:seed
```

This populates the database with:
- 15 countries
- 10 space organizations (NASA, SpaceX, ESA, ISRO, etc.)
- 5 satellite constellations (Starlink, OneWeb, GPS, Iridium, PlanetScope)
- 7 launch sites (Cape Canaveral, Baikonur, Jiuquan, etc.)
- 1 sample satellite (Landsat 9) with fun facts
- 4 historical launch events (Sputnik, Apollo 11, ISS, Starlink v1)

---

### Step 7: Start the dev server

```bash
pnpm dev
```

Open **http://localhost:3000**

You'll see:
1. 🎬 Cinematic loading sequence with orbital ring animation
2. 🌍 3D globe with 2,000 orbiting satellites
3. 🧭 Mode toggle at the top (Globe / Explore / Timeline / Personal)
4. 🔊 Audio toggle (top-right)

---

## 🐍 Optional: Start the Python Orbital Engine

The Python service provides higher-precision orbital calculations. The app works fine without it.

```bash
cd services/orbital-engine
python3 -m venv .venv
source .venv/bin/activate    # On Linux/macOS
# .venv\Scripts\activate     # On Windows
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

API endpoints:
- `GET /health` — Health check
- `POST /propagate` — Batch SGP4 propagation
- `POST /footprint` — Ground footprint polygon

---

## 🗄️ Available Commands (pnpm scripts)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js dev server with Turbopack |
| `pnpm build` | Build the production app |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint across all workspaces |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run all tests with Vitest |
| `pnpm format` | Format code with Prettier |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed the database |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |
| `pnpm db:generate` | Regenerate Prisma client |

---

## 📡 API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/satellites` | List with filters, pagination |
| `GET` | `/api/satellites/[id]` | Satellite detail |
| `GET` | `/api/satellites/[id]/story` | Story + chapters + narration |
| `GET` | `/api/tle` | TLE data proxy from CelesTrak |
| `GET` | `/api/orbital/positions` | Current satellite positions |
| `POST` | `/api/orbital/propagate` | Propagate positions to timestamp |
| `GET` | `/api/passes` | Overhead passes for a location |
| `GET` | `/api/explore` | Aggregated explore data |
| `GET` | `/api/personal` | User-specific space summary |

---

## 🔧 Troubleshooting

**`pnpm install` fails with build script errors:**
```bash
pnpm approve-builds
# Select: @prisma/client, @prisma/engines, prisma, esbuild, sharp
```

**Port 3000 is already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Port 5432 is already in use (PostgreSQL conflict):**
```bash
# Either stop your local PostgreSQL, or change the port in docker-compose.yml
docker compose down
# Edit docker-compose.yml, change "5432:5432" to "5433:5432"
# Then update DATABASE_URL in .env.local to use port 5433
```

**Database connection refused:**
- Make sure Docker is running (`docker compose ps`)
- Wait 5-10 seconds after `docker compose up -d` for PostgreSQL to initialize
- Check `docker compose logs postgres` for errors

---

## 📂 Project Structure

```
orbitra/
├── apps/web/                          # Next.js 15 App Router
│   ├── src/
│   │   ├── app/                       # Pages, layouts, API routes
│   │   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   │   ├── page.tsx               # Home page (3D globe)
│   │   │   ├── globals.css            # Tailwind + custom styles
│   │   │   ├── api/                   # 9 API route handlers
│   │   │   └── (modes)/               # explore, timeline, personal, story pages
│   │   ├── components/
│   │   │   ├── globe/                 # 8 3D components (Earth, stars, satellites, camera, effects)
│   │   │   ├── story/                 # 5 Story Mode components (panel, stats, narration, timeline, facts)
│   │   │   └── ui/                    # 5 shared UI components (glass panel, loading, toggles, counter)
│   │   ├── stores/                    # 6 Zustand stores (globe, story, ui, explore, personal, audio)
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/
│   │   │   ├── orbital/               # SGP4 propagation, coordinates, passes, footprint
│   │   │   ├── tle/                   # TLE parser + CelesTrak fetcher
│   │   │   ├── narration/             # AI narration prompt builder + generator
│   │   │   ├── geo/                   # Reverse geocoding (lat/lng → country)
│   │   │   ├── api/                   # Typed API client
│   │   │   ├── constants.ts           # Orbital, 3D, and UI constants
│   │   │   └── utils.ts               # General utilities + cn()
│   │   ├── workers/                   # Web Workers (WIP)
│   │   └── types/                     # TypeScript type definitions
│   └── public/                        # textures, audio, fonts, 3D models
├── packages/database/                 # Prisma schema, migrations, seed
│   ├── prisma/
│   │   ├── schema.prisma              # 10 models (Satellite, Country, Story, etc.)
│   │   └── seed.ts                    # 15 countries, 10 orgs, 5 constellations, sample data
│   └── src/index.ts                   # Prisma client singleton
├── services/orbital-engine/           # Python FastAPI microservice
│   ├── main.py                        # /propagate, /footprint, /health
│   ├── requirements.txt               # fastapi, uvicorn, skyfield, numpy
│   └── Dockerfile
├── docker-compose.yml                 # PostgreSQL 17
├── .env.example                       # Environment variable template
└── turbo.json                         # Turborepo pipeline config
```

---

## 📄 License

MIT

---

Built with ❤️ and stardust.
