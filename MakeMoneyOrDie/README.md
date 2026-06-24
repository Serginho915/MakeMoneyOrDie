# AI Blog Platform (OpenRouter + Next.js + Node.js)

Premium blog website with AI article generation through OpenRouter.

## Stack

- Frontend: Next.js (React + TypeScript)
- Backend: Node.js + Express + TypeScript
- Containers: Docker + Docker Compose

## Required structure

- /backend/Dockerfile
- /frontend/Dockerfile
- /docker-compose.yml (development)
- /docker-compose.prod.yml (production)

## Quick start (local)

1. Copy env files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Fill required values in env files:

- `OPENROUTER_API_KEY` in `backend/.env`
- `BACKEND_PORT` and `FRONTEND_PORT` in root `.env`
- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` in `frontend/.env`
- `OPENROUTER_SYSTEM_PROMPT_PATH` in `backend/.env` (default points to `backend/prompts/master-writer-prompt.md`)

3. Upload your images into `backend/media/`. The backend will pick a random local image for each new post.

4. Auto-publishing runs at 9:00, 14:00, and 20:00 Bulgaria time.

5. Start in dev:

```bash
docker compose up --build
```

6. Open app:

- Frontend: `${NEXT_PUBLIC_SITE_URL}`
- Backend API health: `http://localhost:${BACKEND_PORT}/api/health`

## Production compose

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Features

- AI article generation via OpenRouter (`POST /api/generate`)
- Articles list page with search and tag filtering
- Article page with related articles section
- SEO metadata, OpenGraph, robots and sitemap
