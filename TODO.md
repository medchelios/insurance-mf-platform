# Plan Monorepo Vite + Module Federation

## Structure

```
react-mf-project/
├── apps/
│   ├── host/      # Application principale (React + Vite)
│   ├── mfe1/      # Micro-frontend 1 (React + Vite + Federation)
│   └── mfe2/      # Micro-frontend 2 (React + Vite + Federation)
├── pnpm-workspace.yaml
└── package.json (root)
```

## Questions à trancher

### 1. Git séparé ou monorepo ?

- **Monorepo (pnpm workspaces)** : Tous les projets dans un seul repo git
  - Avantages: Gestion centralisée, partage de code facile, un seul CI/CD
  - Inconvénients: Plus gros repo, besoin de coordination
- **Git séparé** : Chaque projet dans son propre repo
  - Avantages: Déploiement indépendant, équipes autonomes
  - Inconvénients: Partage de code plus complexe (npm link ou package npm)

### 2. Federation: qui consume qui ?

- **Option A** (recommandé): `host` = consumer seul, `mfe1`/`mfe2` = remotes uniquement
- **Option B**: Chaque projet peut être à la fois host et remote (plus complexe)

## Stack technique

- **Build tool**: Vite 6
- **Plugin Federation**: @originjs/vite-plugin-federation
- **Package manager**: pnpm avec workspaces

## Étapes

1. [x] Créer apps/host avec Vite + React
2. [x] Créer apps/mfe1 avec Vite + Angular (@analogjs/vite-plugin-angular)
3. [x] Créer apps/mfe2 avec Vite + Vue.js
4. [x] Configurer vite-plugin-federation sur mfe1 et mfe2
5. [x] Configurer host pour charger les remotes
6. [x] Tester en dev (ports 3000, 3001, 3002)
7. [ ] Tester le build et le preview
