# Insurance MF Platform

## Structure

```
insurance-mf-platform/
├── apps-mf/           # Micro-frontends
│   └── host/         # React + MUI + TanStack Query + TypeScript (port 3000)
├── bff-mf/           # Laravel 12 API + SQLite/MySQL (port 8000)
└── run.sh           # Start all services
```

## Quick Start

```bash
./run.sh
```

This starts:
- Laravel API: http://localhost:8000
- React Host: http://localhost:3000

## Manual Commands

```bash
# Backend
cd bff-mf && php artisan serve --port=8000

# Frontend
cd apps-mf/host && pnpm dev
```

## Login (Test User)

- Email: test@example.com
- Password: password123

## Features

- **Dashboard**: Overview of claims and accounts
- **Sinistres (Dommages)**: Create and manage insurance claims
- **Comptes (Individuelle)**: Link and manage accounts/patrimony

## Tech Stack

- Frontend: React 18, MUI, TanStack Query, TypeScript
- Backend: Laravel 12, SQLite (dev), Sanctum
- CI: GitHub Actions (separate jobs for frontend/backend)