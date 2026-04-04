# Insurance MF Platform

## Structure

```
insurance-mf-platform/
├── apps-mf/           # Micro-frontends
│   ├── host/         # React + MUI (port 3000)
│   ├── mfe1/         # Angular Dommages (port 3001)
│   └── mfe2/         # Vue Individuelle (port 3002)
└── bff-mf/           # Laravel API
```

## Commands

```bash
# Frontend
cd apps-mf/host && pnpm dev      # Host: http://localhost:3000
cd apps-mf/mfe1 && pnpm dev      # MFE1: http://localhost:3001
cd apps-mf/mfe2 && pnpm dev      # MFE2: http://localhost:3002

# Backend
cd bff-mf && php artisan serve   # API: http://localhost:8000

# Or run all frontend in parallel
cd apps-mf && pnpm -r --parallel dev
```

## Login

- Email: test@example.com
- Password: password123