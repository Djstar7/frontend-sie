# Service d'Immigration de l'Estuaire - Frontend

<p align="center">
  <img src="./public/logo.png" alt="SIE Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Plateforme de gestion des demandes de visa</strong>
</p>

<p align="center">
  <a href="#technologies">Technologies</a> •
  <a href="#fonctionnalités">Fonctionnalités</a> •
  <a href="#installation">Installation</a> •
  <a href="#utilisation">Utilisation</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#déploiement">Déploiement</a>
</p>

---

## 🎯 Présentation

Le **Service d'Immigration de l'Estuaire (SIE)** est une application web moderne de gestion des demandes de visa, conçue pour simplifier et automatiser le processus de demande, de traitement et de suivi des visas.

L'application propose une interface conviviale avec un système de gestion basé sur les rôles, permettant à trois types d'utilisateurs de naviguer efficacement : les administrateurs, les agents et les clients (demandeurs de visa).

---

## 🚀 Fonctionnalités principales

### Pour les clients (Demandeurs de visa)
- ✅ Inscription et connexion sécurisées
- ✅ Création et suivi des demandes de visa
- ✅ Téléchargement de documents
- ✅ Paiement en ligne sécurisé
- ✅ Chat en direct avec les agents
- ✅ Gestion des rendez-vous
- ✅ Consultation de l'historique des demandes
- ✅ Notifications en temps réel

### Pour les agents
- ✅ Gestion des dossiers clients
- ✅ Traitement des demandes de visa
- ✅ Communication avec les clients via chat
- ✅ Gestion des rendez-vous
- ✅ Accès aux documents clients
- ✅ Notifications de nouvelles demandes

### Pour les administrateurs
- ✅ Gestion complète des utilisateurs
- ✅ Supervision de toutes les demandes de visa
- ✅ Gestion des types de visa et des pays
- ✅ Configuration du système (FAQ, notifications)
- ✅ Tableau de bord administratif
- ✅ Gestion des paiements

---

## 🛠 Technologies

### Stack principale
- **Framework Frontend**: [Vue.js 3](https://vuejs.org/) avec Composition API
- **Langage**: TypeScript
- **Bundler**: [Vite](https://vite.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Navigation**: [Vue Router](https://router.vuejs.org/)

### Style & UI
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [daisyUI](https://daisyui.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/)

### Communication & API
- **HTTP Client**: [Axios](https://axios-http.com/)
- **API Backend**: Laravel (non inclus dans ce dépôt)

### Outils de développement
- **Vérification de type**: [Vue-TSC](https://github.com/vuejs/language-tools)
- **Linting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **Testing**: [Vitest](https://vitest.dev/)

### Autres bibliothèques
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Gestion des dates**: [date-fns](https://date-fns.org/)
- **Toast Notifications**: [vue3-toastify](https://github.com/wobsoriano/vue3-toastify)
- **Carrousel**: [Swiper](https://swiperjs.com/)
- **QR Code**: [qrcode](https://github.com/soldair/node-qrcode)
- **PDF Viewer**: [pdfjs-dist](https://github.com/mozilla/pdfjs-dist)

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Node.js](https://nodejs.org/) (version ^20.19.0 ou >=22.12.0)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## 🛠 Installation

1. **Cloner le dépôt**

   ```bash
   git clone <URL_DU_DÉPÔT>
   cd frontend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer les variables d'environnement**

   Créez un fichier `.env` à la racine du projet et définissez les variables nécessaires :

   ```env
   VITE_APP_BACKEND_URL=http://127.0.0.1:8000/api
   # Autres variables d'environnement si nécessaires
   ```

   > **Note**: L'API backend doit être disponible à l'URL spécifiée dans la variable `VITE_APP_BACKEND_URL`.

4. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Ouvrir l'application**

   L'application sera disponible à l'adresse suivante : [http://localhost:5173](http://localhost:5173)

---

## 🧪 Tests

Exécuter les tests unitaires :

```bash
npm run test:unit
# ou
yarn test:unit
```

---

## 🔧 Développement

### Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler le projet pour la production |
| `npm run preview` | Prévisualiser la build locale |
| `npm run lint` | Vérifier et corriger le code avec ESLint |
| `npm run format` | Formater le code avec Prettier |
| `npm run type-check` | Vérifier les types TypeScript |

### Structure du projet

```
src/
├── assets/                 # Ressources statiques (images, styles)
│   └── styles/             # Fichiers de styles (CSS, Tailwind)
├── components/             # Composants réutilisables
├── layouts/                # Mises en page (Auth, Admin, Agent, Client)
├── pages/                  # Pages de l'application
│   ├── Admin/              # Pages pour administrateurs
│   ├── Agent/              # Pages pour agents
│   └── Custom/             # Pages pour clients
├── router/                 # Configuration des routes
├── services/               # Services API et logique métier
├── stores/                 # Stores Pinia pour la gestion d'état
├── types/                  # Définitions de types TypeScript
├── utils/                  # Fonctions utilitaires
├── App.vue                 # Composant racine
└── main.ts                 # Point d'entrée de l'application
```

---

## 🔐 Rôles et permissions

L'application implémente un système de gestion basé sur les rôles avec trois types d'utilisateurs :

### 🧑‍💼 Administrateur
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs, des types de visa et des pays
- Supervision de toutes les demandes de visa
- Configuration avancée du système

### 👨‍💼 Agent
- Gestion des demandes de visa assignées
- Communication avec les clients
- Traitement des dossiers
- Consultation des rapports

### 👤 Client
- Création et suivi de ses demandes de visa
- Téléchargement de documents
- Paiement en ligne
- Communication avec les agents

---

## 📸 Aperçu de l'application

> [Insérer des captures d'écran ici une fois disponibles]

---

## 🚀 Déploiement

### Build pour la production

```bash
npm run build
```

Cela créera une version optimisée de votre application dans le dossier `dist/`.

### Configuration serveur

Pour servir l'application avec un serveur web comme Nginx ou Apache, assurez-vous que toutes les requêtes soient redirigées vers `index.html` pour permettre le bon fonctionnement du routage côté client.

### Exemple de configuration Nginx

```nginx
server {
    listen 80;
    server_name example.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour la fonctionnalité (`git checkout -b feature/FeatureName`)
3. Committez vos modifications (`git commit -m 'Add some FeatureName'`)
4. Poussez la branche (`git push origin feature/FeatureName`)
5. Ouvrez une Pull Request

---

## 📜 Licence

Ce projet est sous licence [MIT](./LICENSE).

---

## 📞 Support

Pour tout support technique ou question, veuillez contacter l'équipe de développement.

---

## ⚠️ Remerciements

- [Vue.js](https://vuejs.org/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [daisyUI](https://daisyui.com/) pour les composants UI
- [Laravel](https://laravel.com/) pour l'API backend (non inclus dans ce dépôt)