# GestEPI - Système de Gestion des Équipements de Protection Individuelle

![Logo GestEPI](https://via.placeholder.com/150x150.png?text=GestEPI)

GestEPI est une application web permettant de gérer et suivre les équipements de protection individuelle (EPI), leurs vérifications périodiques et les utilisateurs du système.

## Fonctionnalités

- **Gestion des EPI**: Inventaire, suivi, détail des EPI
- **Vérifications périodiques**: Planification et suivi des vérifications obligatoires
- **Tableau de bord**: Visualisation des statistiques et des EPI à vérifier
- **Gestion des utilisateurs**: Administration des utilisateurs et des droits d'accès
- **Système d'authentification**: Contrôle d'accès basé sur les rôles

## Architecture technique

L'application est composée de deux parties:

- **Backend**: API REST en Node.js (Express + TypeScript + MariaDB)
- **Frontend**: Application React (TypeScript + Material UI)

## Prérequis

- Node.js (v14+)
- MariaDB (v10.5+)
- NPM ou Yarn

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/gestepi.git
cd gestepi
```

### 2. Base de données

Importez le fichier SQL `gestepi.sql` dans votre serveur MariaDB:

```bash
mysql -u root -p < gestepi.sql
```

Puis exécutez le script d'ajout de l'authentification:

```bash
mysql -u root -p < db_update_auth.sql
```

### 3. Backend

```bash
# Se déplacer dans le dossier backend
cd GestEPIBack

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifiez le fichier .env avec vos informations de connexion à la base de données

# Lancer le serveur de développement
npm run dev
```

### 4. Frontend

```bash
# Dans un nouveau terminal, se déplacer dans le dossier frontend
cd GestEPIFront

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Comptes utilisateurs par défaut

| Type | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | romeo.giorgio@edu.esiee-it.fr | password |
| Vérificateur | enzopace05@gmail.com | password |
| Utilisateur | pierre.durand@example.com | password |

## Déploiement en production

Pour déployer l'application en production:

1. Compilez le frontend: `cd GestEPIFront && npm run build`
2. Compilez le backend: `cd GestEPIBack && npm run build`
3. Configurez un serveur web (nginx, Apache) pour servir les fichiers statiques du frontend
4. Configurez un process manager (PM2) pour le backend
5. Mettez à jour les variables d'environnement pour la production

Pour plus de détails, consultez le [guide de déploiement](docs/DEPLOIEMENT.md).

## Documentation

- [Manuel d'utilisation](docs/UTILISATION.md)
- [Documentation API](docs/API.md)
- [Sécurité](docs/SECURITE.md)

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Auteurs

- Roméo Giorgio
- Enzo Pace
- Autres contributeurs

## Contact

Pour toute question ou support, veuillez contacter: support@gestepi.fr