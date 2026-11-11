# PromptPedia

PromptPedia is an open-source platform for discovering, crafting, and sharing creative AI prompts.

---

## 🏛️ Architecture Overview

The repository is structured as a monorepo consisting of two independent, decoupled applications:

```text
PromptPedia/
├── apps/
│   ├── api/       # @promptpedia/api: Production NestJS backend (PostgreSQL + TypeORM)
│   └── web/       # @promptpedia/web: Next.js App Router client (React + Tailwind CSS)
├── docs/          # Case studies & system design retrospectives
├── package.json   # Monorepo workspaces definition
└── .gitignore     # Workspace-wide git ignore rules
```

---

## 🚀 Applications

### 1. Backend API (`apps/api`)

Built with **NestJS 10**, **TypeScript**, **TypeORM**, and **PostgreSQL**.

* **Port:** `4000` (configurable via `PORT`)
* **API Prefix:** `/api/v1`
* **Swagger Documentation:** `http://localhost:4000/docs`
* **Key Features:**
  * **Health Check:** `GET /api/v1/health`
  * **Prompts Service:** Full CRUD (`GET /api/v1/prompts`, `POST /api/v1/prompts`, `PATCH /api/v1/prompts/:id`, `DELETE /api/v1/prompts/:id`, `GET /api/v1/prompts/user/:userId`) with pagination, tag filtering, and case-insensitive search.
  * **Users Service:** Management and OAuth sync (`GET /api/v1/users/:id`, `POST /api/v1/users/sync`).
  * **PostgreSQL GIN Full-Text Search Index:** Optimized search across prompt title, content, and tag.
  * **Security:** Helmet, Throttler rate limiting (100 req/60s), and strict DTO class validation.

#### Running the API:
```bash
cd apps/api
npm install
npm run build
npm run start:dev
```

---

### 2. Web Frontend (`apps/web`)

Built with **Next.js 13 (App Router)**, **React 18**, and **Tailwind CSS**.

* **Port:** `3000`
* **Key Features:**
  * **Discover & Feed:** Explore prompts with debounced real-time filtering by tag, title, prompt text, or author.
  * **Prompt Creation & Editing:** Interactive form for authoring prompts with category tags.
  * **Profile Management:** View authored posts, edit prompts, and copy prompts with one click.
  * **Dual Runtime Mode:**
    * **Connected Mode:** Proxies/delegates requests directly to `@promptpedia/api` when `NEST_API_URL` or `NEXT_PUBLIC_API_URL` is configured.
    * **Standalone Mode:** Uses internal route handlers with MongoDB for local/standalone operation.

#### Running the Web Client:
```bash
cd apps/web
npm install
npm run dev
```

---

## ⚙️ Monorepo Scripts (Root)

From the project root:

```bash
# Build API and Web
npm run build:api
npm run build:web

# Start in development mode
npm run dev:api
npm run dev:web

# Linting
npm run lint:api
npm run lint:web
```

---

## 🔒 Environment Variables

Copy the corresponding `.env.example` file in each app:

* `apps/api/.env.example` -> `apps/api/.env`
* `apps/web/.env.example` -> `apps/web/.env.local`

