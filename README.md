# CNC-Connect

Plateforme complète de gestion de concours et candidatures avec dashboard analytique, gestion multi-écoles et suivi des états en temps réel.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.2-764ABC?logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

---

## Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Contribution](#-contribution)

---

## Fonctionnalités

### Pour les Candidats

- **Consultation des concours**
  - Liste paginée avec recherche et filtres
  - Détails complets (filières, dates, frais, documents requis)
  - Informations bancaires pour le paiement

- **Inscription aux concours**
  - Formulaire multi-étapes (6 étapes)
  - Validation en temps réel
  - Prévisualisation avant soumission
  - Upload de documents (photo, fiche de paiement)

- **Gestion des candidatures**
  - Tableau de bord des candidatures
  - Filtrage par statut, école, date
  - Tri personnalisable
  - Téléchargement des fiches de candidature (PDF)

- **Système de rappels**
  - Définir des rappels par email
  - Personnalisation date/heure
  - Notifications automatiques

### Authentification

- Inscription utilisateur
- Connexion sécurisée
- Gestion de session avec tokens JWT
- Déconnexion

---

## Technologies

### Core

- **[React 18.3](https://react.dev/)** - Bibliothèque UI
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - Typage statique
- **[Vite 5.4](https://vitejs.dev/)** - Build tool ultra-rapide

### État et Gestion des Données

- **[Redux Toolkit 2.2](https://redux-toolkit.js.org/)** - Gestion d'état globale
- **[React Hook Form 7.53](https://react-hook-form.com/)** - Gestion de formulaires
- **[Axios](https://axios-http.com/)** - Client HTTP

### UI et Styling

- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI réutilisables
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[Sonner](https://sonner.emilkowal.ski/)** - Notifications toast

### Routing

- **[React Router 6](https://reactrouter.com/)** - Navigation côté client

---

## Prérequis

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 ou **yarn** >= 1.22.0
- **Git**

---

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-org/concours-frontend.git
cd concours-frontend
```

### 2. Installer les dépendances

```bash
pnpm install
```

ou avec yarn :

```bash
yarn install
```

---

## Configuration

### 1. Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# API Backend
VITE_API_URL=http://localhost:8000/api/v1
```

### 2. Configuration Axios

Le fichier `src/api/axios.ts` configure automatiquement :
- Base URL depuis `VITE_API_URL`
- Intercepteur pour ajouter le token JWT
- Gestion globale des erreurs

```typescript
// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Démarrage

### Mode développement

```bash
pnpm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
pnpm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

### Prévisualiser le build

```bash
npm run preview
```

---

## Contribution

### Workflow Git

1. Créer une branche depuis `develop`
```bash
git checkout develop
git pull
git checkout -b feature/ma-fonctionnalite
```

2. Développer et commiter
```bash
git add .
git commit -m "feat: ajouter la fonctionnalité X"
```

3. Pousser et créer une Pull Request
```bash
git push origin feature/ma-fonctionnalite
```

### Format des commits

Suivre la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage du code
- `refactor:` Refactorisation
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

