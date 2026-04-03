# Module Federation Insurance Platform

Monorepo multi-framework avec Module Federation pour une plateforme d'assurance.

## Architecture

```
insurance-mf-platform/
├── apps/
│   ├── host/           # Application principale (React + MUI)
│   │   └── Port 3000   # Login, Dashboard, routing
│   ├── mfe1/           # Micro-frontend Angular
│   │   └── Port 3001   # Formulaire réclamation dommages
│   └── mfe2/           # Micro-frontend Vue.js
│       └── Port 3002   # Formulaire liaison compte épargne
├── pnpm-workspace.yaml
└── package.json
```

## Stack Technique

- **Build**: Vite 6
- **Federation**: @originjs/vite-plugin-federation
- **Package Manager**: pnpm (workspaces)
- **Frameworks**:
  - Host: React 18 + MUI
  - MFE1: Angular 18 (@analogjs/vite-plugin-angular)
  - MFE2: Vue 3

## Installation

```bash
pnpm install
```

## Développement

```bash
# Lancer tous les apps en mode dev (sans Federation)
pnpm dev

# Lancer un app spécifique
pnpm dev:host   # localhost:3000
pnpm dev:mfe1   # localhost:3001
pnpm dev:mfe2   # localhost:3002
```

## Build + Preview (avec Federation)

```bash
# Build tous les apps
pnpm build

# Lancer les 3 en mode preview (requiert build préalable)
pnpm start
```

## Authentification

- Login: `test@example.com`
- Password: `password123`

## Routes

- `/login` - Page de connexion
- `/dashboard` - Dashboard principal
- `/assurance-dommages` - Formulaire réclamation (Angular MFE)
- `/assurance-individuelle` - Liaison compte épargne (Vue MFE)

## MF Skill

Ce projet inclut un skill Module Federation dans `.agents/skills/mf/`:

```bash
# Utiliser le skill
opencode mf <sub-command>

# Exemples
opencode mf docs
opencode mf config-check
opencode mf runtime-error
```

## GitHub Actions

CI/CD configuré dans `.github/workflows/ci.yml` - Build et test sur push/PR.

## License

MIT