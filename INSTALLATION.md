# Guide d'installation de GestEPI

Ce document explique en détail comment installer et configurer l'application GestEPI, tant pour le développement que pour la production.

## Prérequis

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre système:

- Node.js (version 14 ou supérieure)
- NPM (ou Yarn)
- MariaDB (version 10.5 ou supérieure)
- Git

## Installation pour le développement

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/gestepi.git
cd gestepi
```

### 2. Configuration de la base de données

1. Créez une base de données nommée `gestepi` dans MariaDB:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE gestepi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gestepi_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON gestepi.* TO 'gestepi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

2. Importez le schéma de base de données:

```bash
mysql -u gestepi_user -p gestepi < gestepi.sql
```

3. Exécutez le script d'ajout de l'authentification:

```bash
mysql -u gestepi_user -p gestepi < db_update_auth.sql
```

### 3. Configuration et lancement du backend

1. Allez dans le dossier du backend:

```bash
cd GestEPIBack
```

2. Installez les dépendances:

```bash
npm install
```

3. Créez un fichier `.env` à la racine du dossier backend:

```
DB_HOST=localhost
DB_USER=gestepi_user
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gestepi
PORT=5500
JWT_SECRET=une_cle_secrete_longue_et_complexe
NODE_ENV=development
```

4. Lancez le serveur de développement:

```bash
npm run dev
```

Le serveur backend devrait maintenant être accessible sur http://localhost:5500.

### 4. Configuration et lancement du frontend

1. Dans un nouveau terminal, allez dans le dossier du frontend:

```bash
cd GestEPIFront
```

2. Installez les dépendances:

```bash
npm install
```

3. Créez un fichier `.env` pour le frontend (optionnel):

```
REACT_APP_API_URL=http://localhost:5500/api
```

4. Lancez l'application frontend:

```bash
npm start
```

L'application devrait maintenant être accessible à l'adresse http://localhost:3000.

## Installation pour la production

### 1. Préparation du serveur de production

Assurez-vous que votre serveur dispose des éléments suivants:
- Node.js (v14+)
- Nginx (ou Apache)
- MariaDB (v10.5+)
- PM2 (pour la gestion des processus Node.js)

```bash
# Installation de PM2
npm install -g pm2
```

### 2. Configuration de la base de données en production

Suivez les mêmes étapes que pour le développement, mais avec un mot de passe fort et des restrictions de sécurité supplémentaires.

### 3. Construction du frontend

Sur votre machine de développement (ou sur le serveur si vous préférez):

```bash
cd GestEPIFront
npm run build
```

Cela créera un dossier `build` contenant les fichiers statiques à déployer.

### 4. Construction du backend

```bash
cd GestEPIBack
npm run build
```

### 5. Déploiement

1. Transférez les fichiers sur votre serveur:
   - Le dossier `build` du frontend
   - Le dossier `dist` du backend
   - Le fichier `package.json` du backend

2. Sur le serveur, installez les dépendances de production du backend:

```bash
cd /chemin/vers/backend
npm install --production
```

3. Créez un fichier `.env` pour la production:

```
DB_HOST=localhost
DB_USER=gestepi_user
DB_PASSWORD=votre_mot_de_passe_securise
DB_NAME=gestepi
PORT=5500
JWT_SECRET=une_cle_secrete_longue_et_complexe
NODE_ENV=production
```

4. Configurez PM2 pour gérer le processus Node.js:

```bash
pm2 start dist/index.js --name "gestepi-api"
pm2 save
pm2 startup
```

5. Configurez Nginx pour servir le frontend et faire un proxy vers l'API:

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Redirection vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name votre-domaine.com;

    # Configuration SSL
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Frontend
    location / {
        root /chemin/vers/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. Redémarrez Nginx:

```bash
sudo service nginx restart
```

## Configuration supplémentaire

### Sécurisation de la base de données

Pour sécuriser davantage votre base de données en production:

```sql
REVOKE ALL PRIVILEGES ON *.* FROM 'gestepi_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestepi.* TO 'gestepi_user'@'localhost';
FLUSH PRIVILEGES;
```

### Configuration CORS

Si votre API et votre frontend sont hébergés sur des domaines différents, vous devrez configurer CORS correctement dans `app.ts`.

### Mise en place d'une sauvegarde automatique

Configurez des sauvegardes automatiques de la base de données:

```bash
# Exemple de script de sauvegarde
mysqldump -u root -p --databases gestepi > /chemin/vers/sauvegarde/gestepi_$(date +%Y%m%d).sql
```

Ajoutez ce script à un cronjob pour l'exécuter régulièrement:

```bash
crontab -e
# Ajouter la ligne suivante pour une sauvegarde quotidienne à 2h du matin
0 2 * * * /chemin/vers/script_sauvegarde.sh
```

## Dépannage

### Problèmes de connexion à la base de données

Vérifiez que:
- Les identifiants de connexion sont corrects dans le fichier `.env`
- L'utilisateur de la base de données a les droits nécessaires
- MariaDB est en cours d'exécution

### Problèmes d'authentification

Si les utilisateurs ne peuvent pas se connecter:
- Vérifiez que la table `users` contient bien la colonne `password`
- Assurez-vous que les mots de passe sont correctement hachés
- Vérifiez la valeur de `JWT_SECRET` dans le fichier `.env`

### Le frontend ne peut pas accéder à l'API

Vérifiez que:
- L'URL de l'API est correctement configurée
- CORS est correctement configuré
- Les requêtes ne sont pas bloquées par un pare-feu

### Utilisation de la mémoire

Pour les environnements à ressources limitées, ajustez la configuration de Node.js:

```bash
# Exemple pour PM2
pm2 start dist/index.js --name "gestepi-api" --node-args="--max-old-space-size=512"
```

## Mises à jour

Pour mettre à jour l'application:

1. Récupérez les dernières modifications:
```bash
git pull origin main
```

2. Reconstruisez et redéployez le frontend et le backend
3. Appliquez les migrations de base de données si nécessaire
4. Redémarrez les services:
```bash
pm2 restart gestepi-api
```