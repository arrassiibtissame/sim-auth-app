# Application de Collecte de Lait (Milk Collection App)

Une application mobile React Native avec SQLite pour la gestion des collectes de lait par les agents d'une compagnie laitière.

## Fonctionnalités

### 🏗️ Architecture de la Base de Données

L'application gère les entités suivantes :

- **Utilisateurs (Users)** : Agents de collecte et conducteurs
- **Adhérents (Members)** : Propriétaires des fermes
- **Routes (Tournées)** : Itinéraires de collecte
- **Unités de Production** : Installations des adhérents
- **Bacs à Lait (MilkTanks)** : Conteneurs de stockage du lait
- **Missions** : Assignations des agents aux routes
- **Collectes (Collections)** : Opérations de collecte de lait
- **Détails de Collecte** : Enregistrements détaillés avec codes-barres

### 📱 Fonctionnalités de l'Application

1. **Authentification** : Connexion par nom d'utilisateur
2. **Tableau de bord** : Vue d'ensemble des statistiques et activités
3. **Gestion des missions** : Visualisation des missions assignées
4. **Gestion des collectes** : 
   - Suivi des collectes en cours
   - Ajout de détails de collecte avec codes-barres
   - Finalisation des collectes
5. **Profil utilisateur** : Informations et paramètres

## Installation et Configuration

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI
- Android Studio ou Xcode (pour les émulateurs)

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd MilkCollectionApp
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npm start
```

4. **Lancer sur un émulateur ou appareil**
```bash
# Android
npm run android

# iOS
npm run ios
```

## Utilisation

### Première utilisation

L'application se charge automatiquement avec des données d'exemple lors du premier démarrage :

**Utilisateurs de test :**
- Jean Dupont (actif)
- Marie Martin (actif)
- Pierre Durand (actif)
- Sophie Lefebvre (inactif)

### Connexion

1. Ouvrez l'application
2. Entrez un nom d'utilisateur (ex: "Jean Dupont")
3. Appuyez sur "Se connecter"

### Navigation

L'application utilise une navigation par onglets :

- **Tableau de bord** : Vue d'ensemble et statistiques
- **Missions** : Liste des missions assignées
- **Collectes** : Gestion des collectes de lait
- **Profil** : Paramètres utilisateur

### Gestion des Collectes

1. **Voir les collectes** : Onglet "Collectes"
2. **Voir les détails** : Toucher une collecte pour voir les détails
3. **Ajouter des détails** : 
   - Saisir les codes-barres A et B
   - Ajouter un code qualité (optionnel)
   - Appuyer sur "Ajouter Détail"
4. **Terminer une collecte** : Appuyer sur "Terminer la Collecte"

## Structure du Projet

```
src/
├── components/          # Composants réutilisables
├── context/            # Contextes React (Auth)
├── database/           # Service et repositories SQLite
│   ├── DatabaseService.ts
│   └── repositories/   # Repositories pour chaque entité
├── models/             # Interfaces TypeScript
├── navigation/         # Configuration de navigation
├── screens/            # Écrans de l'application
├── utils/              # Utilitaires (seeding, etc.)
└── App.tsx            # Point d'entrée
```

## Base de Données

### Schéma Principal

L'application utilise SQLite avec les tables suivantes :

- `users` : Agents de collecte
- `members` : Adhérents (fermes)
- `routes` : Routes de collecte
- `production_units` : Unités de production
- `milk_tanks` : Bacs à lait
- `missions` : Missions assignées
- `collections` : Collectes de lait
- `collection_details` : Détails des collectes

### Initialisation des Données

Les données d'exemple sont automatiquement chargées au premier démarrage via `src/utils/seedDatabase.ts`.

## Technologies Utilisées

- **React Native** : Framework mobile cross-platform
- **Expo** : Plateforme de développement
- **Expo SQLite** : Base de données locale
- **React Navigation** : Navigation entre écrans
- **TypeScript** : Typage statique
- **React Native Paper** : Composants UI

## Développement

### Scripts Disponibles

- `npm start` : Démarrer le serveur de développement
- `npm run android` : Lancer sur Android
- `npm run ios` : Lancer sur iOS
- `npm run web` : Lancer sur navigateur web

### Architecture

L'application suit une architecture modulaire avec :

- **Séparation des préoccupations** : UI, logique métier, accès aux données
- **Pattern Repository** : Abstraction de l'accès aux données
- **Context API** : Gestion de l'état global (authentification)
- **TypeScript** : Typage fort pour la maintenabilité

### Ajout de Nouvelles Fonctionnalités

1. **Nouvelle entité** :
   - Ajouter l'interface dans `src/models/`
   - Créer le repository dans `src/database/repositories/`
   - Mettre à jour le schéma de base de données

2. **Nouvel écran** :
   - Créer le composant dans `src/screens/`
   - Ajouter la route dans `src/navigation/`

## Fonctionnalités Futures

- Scanner de codes-barres
- Synchronisation avec serveur distant
- Mode hors-ligne avancé
- Rapports et statistiques détaillées
- Géolocalisation des collectes
- Photos des bacs à lait
- Notifications push

## Support

Pour toute question ou problème, contactez l'équipe de développement.

## Licence

© 2024 Compagnie Laitière - Tous droits réservés



