# Habit Tracker - Frontend

## Description

Ce projet correspond au frontend de l’application **Habit Tracker**, développée dans le cadre de ma formation Graduate Développeur Web Full Stack.

L’application permet à un utilisateur connecté de gérer ses habitudes quotidiennes : création, modification, suppression, validation par jour, filtrage, consultation des statistiques et suivi de l’historique. Elle ne contient pas de page d'inscription.

Le frontend communique avec une API REST développée en Symfony.

## Fonctionnalités principales

- Connexion utilisateur
- Déconnexion
- Affichage des habitudes
- Création d’une habitude
- Modification d’une habitude
- Suppression d’une habitude
- Validation d’une habitude selon une date
- Filtres par statut : aujourd’hui, toutes, à faire, terminées
- Filtres par jour de la semaine
- Affichage de statistiques du jour
- Consultation de l’historique

## Stack technique

- React
- JavaScript
- Vite
- CSS
- Fetch API
- Docker

## Architecture du projet

```txt
src/
|__ components/
│   |__ HabitForm.jsx
│   |__ HabitList.jsx
│   |__ HabitItem.jsx
│   |__ LoginForm.jsx
│   |__ Stats.jsx
│   |__ History.jsx
|__ services/
│   |__ api.js
│   |__ auth.js
│   |__ habitService.js
│   |__ statsService.js
|__ App.jsx
|__ main.jsx
|__ main.css
```

## Installation
Cloner le projet:
```bash
git clone <https://github.com/Milady28002/habit-tracker.git>
```

Se placer dans le dossier frontend :
```
cd HABIT-TRACKER
```

Installer les dépendances :
```bash
npm install
```

Lancer le projet en local :
```bash
npm run dev
```
Application :
http://localhost:5173/

## Configuration

L’URL de l’API est centralisée dans le fichier :

`src/services/api.js`

```js
const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;
```
L’application utilise une variable d’environnement Vite afin de distinguer les environnements local et production.

### En local

Créer un fichier `.env` à la racine du frontend :
```bash
VITE_API_URL=http://localhost:8000/api
```
Le fichier `.env` n’est pas versionné dans Git.

### En production

La variable `VITE_API_URL` est définie directement dans Vercel :
```bash
VITE_API_URL=https://habit-tracker-api-production-f931.up.railway.app/api
```


## Déploiement

L’application Habit Tracker est déployée avec une architecture séparant le frontend, l’API et les bases de données.

### Frontend

Le frontend React / Vite est déployé sur **Vercel**.

URL de production :

https://habit-tracker-ten-sepia.vercel.app/

Le build de production est généré avec :

```bash
npm run build
```
Le dossier de sortie utilisé par Vercel est :
`dist`

### Backend
L’API Symfony est déployée sur **Railway**.

URL de production :

https://habit-tracker-api-production-f931.up.railway.app

L’API utilise notamment les variables d’environnement suivantes :

* `APP_ENV`
* `APP_SECRET`
* `DATABASE_URL`
* `MONGODB_URL`
* `MONGODB_DB`
* `CORS_ALLOW_ORIGIN`

### Bases de données

Deux bases sont utilisées en production :

* MariaDB 10.11 pour les données relationnelles ;
* MongoDB pour les données d’historique et de statistiques.

**MariaDB** dispose d’un volume persistant Railway.

**MongoDB** dispose également d’un volume persistant.

Les migrations Doctrine sont exécutées sur la base MariaDB avec :
```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

## Communication frontend / backend

Le frontend communique avec l’API Symfony via HTTPS.

L’authentification repose sur un token retourné après connexion et stocké côte frontend dans le `localStorage`.

Le token est envoyé dans les requêtes HTTP avec le header :
`X-AUTH-TOKEN`
Cela permet de sécuriser les données et de récupérer uniquement les habitudes de l’utilisateur connecté.

Le CORS du backend autorise le domaine Vercel utilisé par le frontend.

## Communication avec l'API

Le frontend utilise `fetch()` pour communiquer avec le backend Symfony.

Les appels API sont regroupés dans le dossier :
src/services/

Exemples de services :

- auth.js : gestion de la connexion, du token et de la déconnexion
- habitService.js : gestion des habitudes
- statsService.js : fichier conservé pour une évolution future des statistiques avancées


## Gestion des habitudes
Les habitudes sont chargées depuis l’API selon la date sélectionnée.

Chaque habitude contient notamment :

- un identifiant
- un titre
- une liste de jours associés
- un statut de validation pour la date consultée

La validation d’une habitude est liée à une date précise afin d’éviter qu’une habitude cochée aujourd’hui soit automatiquement cochée sur les autres jours.

## Statistiques
Les statistiques du jour sont calculées directement côté frontend à partir des habitudes déjà chargées.

Ce choix permet :

- d’éviter un appel API supplémentaire
- d’améliorer les performances
- d’éviter les incohérences entre l’affichage principal et la page statistiques

Le fichier **statsService.js** est conservé pour une évolution future, notamment pour des statistiques avancées sur plusieurs jours.


## Docker
Docker est utilisé pour reproduire l’environnement complet du projet en local.

L’environnement local comprend notamment :

* le backend Symfony
* MariaDB
* MongoDB
* Nginx
* le frontend React
* les outils d’administration des bases

Le lancement local peut être effectué avec :

```bash
docker compose up --build
```
En production, l’architecture est répartie entre **Vercel** pour le frontend et **Railway** pour l’API Symfony, MariaDB et MongoDB.

## Points techniques travaillés
Ce projet m'a permis de travailler plusieurs compétences importantes :
- structuration d'une application React
- création et organisation de composants
- gestion des états avec **useState**
- changement des données avec **useEffect**
- consommation d'une API REST
- gestion d'une authentification par token
- gestion des erreurs côté interface
- filtrage dynamique des données
- séparation entre logique d'affichage et appels API
- optimisation des performances côté frontend

## Evolutions possibles
- ajout d'un formulaire d'inscription
- amélioration de l'interface utilisateur
- ajout de statistiques sur 7 ou 30 jours
- ajout de graphiques
- amélioration de l'historique
- gestion d'objectifs personnalisés

### Auteur
Projet réalisé par Sylvie Mendez dans le cadre de ma formation Graduate Développeur Web Full Stack.
