# Routine

Suivi de routine sportive (sport libre : rameur, VTT, footing, etc. + sorties
chien), de poids et d'humeur. Front React + Mantine, hébergé sur GitHub Pages,
données stockées dans Supabase.

## Setup

### 1. Créer le projet Supabase

1. Créer un compte / projet sur [supabase.com](https://supabase.com) (gratuit).
2. Dans l'éditeur SQL du projet, exécuter dans l'ordre les fichiers du dossier
   [`migrations/`](./migrations) : `001_init.sql`, `002_activity_details.sql`,
   `003_mood_entries.sql`, `004_strava_link.sql`, puis
   `005_workout_distance.sql`. (Pour un projet déjà initialisé, exécute
   uniquement les migrations manquantes.)
3. Dans **Project Settings → API** (ou **Data API**), récupérer l'**URL** du
   projet et la clé **Publishable key** (remplaçante de l'ancienne clé `anon`).
4. Renseigner ces deux valeurs dans [`src/config.ts`](./src/config.ts).
   > Cette clé n'est pas un secret — elle est faite pour être publique. La
   > sécurité vient des policies RLS définies dans les migrations, qui limitent
   > chaque utilisateur à ses propres données.
5. Dans **Authentication → URL Configuration**, renseigner le **Site URL** avec
   l'URL GitHub Pages finale (ex : `https://<ton-user>.github.io/fitness-tracker/`).
   C'est l'URL vers laquelle Supabase redirige après un clic sur le lien magique.

### 2. Dev local

```bash
nvm use   # utilise Node 22 (voir .nvmrc)
npm install
npm run dev
```

### 3. Déploiement GitHub Pages

Le repo doit être **public** (requis pour GitHub Pages gratuit sur un compte
personnel).

1. Pousser le repo sur GitHub.
2. Dans **Settings → Pages**, choisir la source **GitHub Actions**.
3. Chaque push sur `main` déclenche le workflow
   [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), qui build et
   déploie automatiquement.
