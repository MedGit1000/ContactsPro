# Gestionnaire de Contacts (CRUD)

Une application web monopage (SPA) développée avec Vue.js 3 permettant de gérer une liste de contacts avec les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer).

## Fonctionnalités

- **Affichage (Read)**: Liste des contacts avec nom, email et téléphone
- **Ajout (Create)**: Formulaire pour ajouter un nouveau contact
- **Modification (Update)**: Édition des informations d'un contact existant
- **Suppression (Delete)**: Possibilité de supprimer un contact avec confirmation

## Technologies utilisées

- **Frontend**: Vue.js 3 (Composition API)
- **Styling**: TailwindCSS
- **Backend**: json-server (API REST fictive)
- **HTTP Client**: Axios
- **Bundler**: Vite.js

## Prérequis

- Node.js (v14.0.0 ou supérieur)
- npm (v6.0.0 ou supérieur)

## Installation

1. Clonez ce dépôt:

```bash
git clone <URL_DU_REPO>
cd contact-manager
```

2. Installez les dépendances:

```bash
npm install
```

3. Installez json-server globalement (si ce n'est pas déjà fait):

```bash
npm install -g json-server
```

## Lancement de l'application

1. Démarrez le serveur backend (json-server):

```bash
npm run backend
```

2. Dans un autre terminal, démarrez l'application frontend:

```bash
npm run dev
```

3. Accédez à l'application dans votre navigateur:

```
http://localhost:5173
```

## Structure du projet

```
contact-manager/
│
├── public/               # Fichiers statiques
│
├── src/
│   ├── assets/           # Ressources (images, etc.)
│   ├── components/       # Composants Vue
│   ├── services/         # Services (API, etc.)
│   ├── App.vue           # Composant racine
│   ├── main.js           # Point d'entrée
│   └── style.css         # Styles globaux
│
├── backend/
│   └── db.json           # Base de données JSON pour json-server
│
└── ...                   # Autres fichiers de configuration
```

## Développement

- **Components**: Le projet utilise une architecture par composants où chaque élément fonctionnel est isolé.
- **Composition API**: Les composants sont implémentés en utilisant la Composition API de Vue 3.
- **Gestion d'état**: L'état est géré localement dans le composant App.vue et transmis aux composants enfants via les props.
- **Communaction entre composants**: Les composants communiquent via les props et les événements personnalisés (emits).

## Auteur

\***\* Mehdi REZ \*\***
