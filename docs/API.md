# Documentation de l'API GestEPI

Cette documentation décrit les endpoints disponibles dans l'API REST de GestEPI et comment les utiliser.

## Base URL

Par défaut, l'API est accessible à l'URL suivante:

```
http://localhost:5500/api
```

## Authentification

L'API utilise l'authentification par JWT (JSON Web Token). Tous les endpoints, à l'exception de l'authentification, nécessitent un token JWT valide.

### Obtenir un token

```
POST /auth/login
```

Paramètres de la requête:
```json
{
  "email": "utilisateur@example.com",
  "password": "mot_de_passe"
}
```

Réponse:
```json
{
  "user": {
    "id": 1,
    "firstName": "Prénom",
    "lastName": "Nom",
    "email": "utilisateur@example.com",
    "phone": "0601020304",
    "userTypeId": 1,
    "typeName": "Administrateur"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1649589821000
}
```

### Utilisation du token

Pour les requêtes authentifiées, ajoutez l'en-tête d'autorisation:

```
Authorization: Bearer <votre_token>
```

## Endpoints

### Utilisateurs

#### Récupérer tous les utilisateurs

```
GET /users
```

Droits requis: Administrateur

Réponse:
```json
[
  {
    "id": 1,
    "firstName": "Roméo",
    "lastName": "Giorgio",
    "email": "romeo.giorgio@edu.esiee-it.fr",
    "phone": "",
    "userTypeId": 1,
    "typeName": "Administrateur"
  },
  {
    "id": 2,
    "firstName": "Enzo",
    "lastName": "Pace",
    "email": "enzopace05@gmail.com",
    "phone": "",
    "userTypeId": 2,
    "typeName": "Vérificateur"
  }
]
```

#### Récupérer un utilisateur par ID

```
GET /users/:id
```

Droits requis: Administrateur ou l'utilisateur lui-même

Réponse:
```json
{
  "id": 1,
  "firstName": "Roméo",
  "lastName": "Giorgio",
  "email": "romeo.giorgio@edu.esiee-it.fr",
  "phone": "",
  "userTypeId": 1,
  "typeName": "Administrateur"
}
```

#### Créer un utilisateur

```
POST /users
```

Droits requis: Administrateur

Paramètres de la requête:
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0601020304",
  "userTypeId": 3,
  "password": "mot_de_passe"
}
```

Réponse:
```json
{
  "id": 7,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0601020304",
  "userTypeId": 3
}
```

#### Mettre à jour un utilisateur

```
PUT /users/:id
```

Droits requis: Administrateur ou l'utilisateur lui-même

Paramètres de la requête:
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0601020305",
  "userTypeId": 3,
  "password": "nouveau_mot_de_passe" // Optionnel
}
```

Réponse:
```json
{
  "id": 7,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0601020305",
  "userTypeId": 3
}
```

#### Supprimer un utilisateur

```
DELETE /users/:id
```

Droits requis: Administrateur

Réponse: 204 No Content

### EPIs

#### Récupérer tous les EPIs

```
GET /epis
```

Droits requis: Administrateur, Vérificateur

Réponse:
```json
[
  {
    "id": 1,
    "brand": "Petzl",
    "model": "Vertex",
    "serialNumber": "VX-123456",
    "size": "M/L",
    "color": "Rouge",
    "purchaseDate": "2024-01-15T00:00:00.000Z",
    "manufactureDate": "2023-11-20T00:00:00.000Z",
    "serviceStartDate": "2024-01-20T00:00:00.000Z",
    "periodicity": 12,
    "epiTypeId": 2,
    "statusId": 1,
    "endOfLifeDate": null,
    "typeName": "Casque",
    "statusName": "Opérationnel"
  },
  {
    "id": 2,
    "brand": "Black Diamond",
    "model": "Solution",
    "serialNumber": "BD-789012",
    "size": "L",
    "color": "Noir",
    "purchaseDate": "2023-08-10T00:00:00.000Z",
    "manufactureDate": "2023-06-15T00:00:00.000Z",
    "serviceStartDate": "2023-08-15T00:00:00.000Z",
    "periodicity": 6,
    "epiTypeId": 3,
    "statusId": 1,
    "endOfLifeDate": null,
    "typeName": "Baudrier",
    "statusName": "Opérationnel"
  }
]
```

#### Récupérer un EPI par ID

```
GET /epis/:id
```

Droits requis: Administrateur, Vérificateur

Réponse:
```json
{
  "id": 1,
  "brand": "Petzl",
  "model": "Vertex",
  "serialNumber": "VX-123456",
  "size": "M/L",
  "color": "Rouge",
  "purchaseDate": "2024-01-15T00:00:00.000Z",
  "manufactureDate": "2023-11-20T00:00:00.000Z",
  "serviceStartDate": "2024-01-20T00:00:00.000Z",
  "periodicity": 12,
  "epiTypeId": 2,
  "statusId": 1,
  "endOfLifeDate": null,
  "typeName": "Casque",
  "statusName": "Opérationnel"
}
```

#### Créer un EPI

```
POST /epis
```

Droits requis: Administrateur

Paramètres de la requête:
```json
{
  "brand": "Petzl",
  "model": "Astro",
  "serialNumber": "AS-123456",
  "size": "M",
  "color": "Bleu",
  "purchaseDate": "2024-01-15",
  "manufactureDate": "2023-11-20",
  "serviceStartDate": "2024-01-20",
  "periodicity": 12,
  "epiTypeId": 2,
  "statusId": 1,
  "endOfLifeDate": null
}
```

Réponse:
```json
{
  "id": 6,
  "brand": "Petzl",
  "model": "Astro",
  "serialNumber": "AS-123456",
  "size": "M",
  "color": "Bleu",
  "purchaseDate": "2024-01-15T00:00:00.000Z",
  "manufactureDate": "2023-11-20T00:00:00.000Z",
  "serviceStartDate": "2024-01-20T00:00:00.000Z",
  "periodicity": 12,
  "epiTypeId": 2,
  "statusId": 1,
  "endOfLifeDate": null
}
```

#### Mettre à jour un EPI

```
PUT /epis/:id
```

Droits requis: Administrateur

Paramètres de la requête: Similaires à la création, avec les champs à mettre à jour.

Réponse: L'objet EPI mis à jour

#### Supprimer un EPI

```
DELETE /epis/:id
```

Droits requis: Administrateur

Réponse: 204 No Content

### Types d'EPI

#### Récupérer tous les types d'EPI

```
GET /epi-types
```

Droits requis: Authentifié

Réponse:
```json
[
  {
    "id": 1,
    "typeName": "Corde",
    "isTextile": 1
  },
  {
    "id": 2,
    "typeName": "Casque",
    "isTextile": 0
  },
  {
    "id": 3,
    "typeName": "Baudrier",
    "isTextile": 1
  },
  {
    "id": 4,
    "typeName": "Sangle",
    "isTextile": 1
  },
  {
    "id": 5,
    "typeName": "Mousqueton",
    "isTextile": 0
  }
]
```

#### Récupérer un type d'EPI par ID

```
GET /epi-types/:id
```

Droits requis: Authentifié

Réponse:
```json
{
  "id": 1,
  "typeName": "Corde",
  "isTextile": 1
}
```

### Statuts d'EPI

#### Récupérer tous les statuts d'EPI

```
GET /epi-status
```

Droits requis: Authentifié

Réponse:
```json
[
  {
    "id": 1,
    "statusName": "Opérationnel"
  },
  {
    "id": 2,
    "statusName": "À réparer"
  },
  {
    "id": 3,
    "statusName": "Mis au rebut"
  }
]
```

#### Récupérer un statut d'EPI par ID

```
GET /epi-status/:id
```

Droits requis: Authentifié

Réponse:
```json
{
  "id": 1,
  "statusName": "Opérationnel"
}
```

### Vérifications d'EPI

#### Récupérer toutes les vérifications

```
GET /epi-checks
```

Droits requis: Administrateur, Vérificateur

Réponse:
```json
[
  {
    "id": 1,
    "checkDate": "2024-01-25",
    "userId": 2,
    "epiId": 1,
    "statusId": 1,
    "remarks": "Aucun défaut constaté",
    "userName": "Jean Dupont",
    "epiSerialNumber": "VX-123456",
    "statusName": "Opérationnel"
  },
  {
    "id": 2,
    "checkDate": "2023-11-15",
    "userId": 2,
    "epiId": 2,
    "statusId": 1,
    "remarks": "Légère usure des sangles mais toujours opérationnel",
    "userName": "Jean Dupont",
    "epiSerialNumber": "BD-789012",
    "statusName": "Opérationnel"
  }
]
```

#### Récupérer une vérification par ID

```
GET /epi-checks/:id
```

Droits requis: Administrateur, Vérificateur

Réponse:
```json
{
  "id": 1,
  "checkDate": "2024-01-25",
  "userId": 2,
  "epiId": 1,
  "statusId": 1,
  "remarks": "Aucun défaut constaté",
  "userName": "Jean Dupont",
  "epiSerialNumber": "VX-123456",
  "statusName": "Opérationnel"
}
```

#### Récupérer les vérifications d'un EPI spécifique

```
GET /epi-checks/epi/:epiId
```

Droits requis: Administrateur, Vérificateur

Réponse: Liste des vérifications pour l'EPI spécifié

#### Récupérer les EPIs à vérifier prochainement

```
GET /epi-checks/due
```

Droits requis: Administrateur, Vérificateur

Réponse:
```json
[
  {
    "id": 1,
    "brand": "Petzl",
    "model": "Vertex",
    "serialNumber": "VX-123456",
    "epiTypeId": 2,
    "statusId": 1,
    "typeName": "Casque",
    "statusName": "Opérationnel",
    "daysUntilNextCheck": -45
  },
  {
    "id": 4,
    "brand": "Singing Rock",
    "model": "W0010",
    "serialNumber": "SR-567890",
    "epiTypeId": 4,
    "statusId": 1,
    "typeName": "Sangle",
    "statusName": "Opérationnel",
    "daysUntilNextCheck": 7
  }
]
```

#### Créer une vérification

```
POST /epi-checks
```

Droits requis: Administrateur, Vérificateur

Paramètres de la requête:
```json
{
  "checkDate": "2024-04-11",
  "userId": 2,
  "epiId": 1,
  "statusId": 1,
  "remarks": "Aucun défaut constaté, EPI en bon état"
}
```

Réponse:
```json
{
  "id": 7,
  "checkDate": "2024-04-11T00:00:00.000Z",
  "userId": 2,
  "epiId": 1,
  "statusId": 1,
  "remarks": "Aucun défaut constaté, EPI en bon état"
}
```

#### Mettre à jour une vérification

```
PUT /epi-checks/:id
```

Droits requis: Administrateur, Vérificateur (qui a créé la vérification)

Paramètres de la requête: Similaires à la création, avec les champs à mettre à jour.

Réponse: L'objet de vérification mis à jour

#### Supprimer une vérification

```
DELETE /epi-checks/:id
```

Droits requis: Administrateur

Réponse: 204 No Content

### Tableau de bord

#### Récupérer les statistiques du tableau de bord

```
GET /dashboard
```

Droits requis: Authentifié

Réponse:
```json
{
  "epiCount": 5,
  "epiByType": [
    {
      "typeName": "Casque",
      "count": 1
    },
    {
      "typeName": "Baudrier",
      "count": 1
    },
    {
      "typeName": "Corde",
      "count": 1
    },
    {
      "typeName": "Sangle",
      "count": 1
    },
    {
      "typeName": "Mousqueton",
      "count": 1
    }
  ],
  "epiByStatus": [
    {
      "statusName": "Opérationnel",
      "count": 3
    },
    {
      "statusName": "À réparer",
      "count": 1
    },
    {
      "statusName": "Mis au rebut",
      "count": 1
    }
  ],
  "pendingChecks": {
    "count": 3,
    "urgent": 2,
    "soon": 1,
    "upcoming": 0
  },
  "checksHistory": [
    {
      "month": "2023-11",
      "count": 1
    },
    {
      "month": "2024-01",
      "count": 2
    },
    {
      "month": "2024-02",
      "count": 1
    },
    {
      "month": "2025-03",
      "count": 1
    }
  ]
}
```

## Codes d'erreur

L'API utilise les codes de statut HTTP standard:

- `200 OK`: Requête réussie
- `201 Created`: Ressource créée avec succès
- `204 No Content`: Requête réussie sans contenu à renvoyer (souvent pour les suppressions)
- `400 Bad Request`: Requête incorrecte (erreur de validation, paramètres manquants)
- `401 Unauthorized`: Authentification requise ou token invalide
- `403 Forbidden`: Authentifié mais pas autorisé à accéder à la ressource
- `404 Not Found`: Ressource non trouvée
- `500 Internal Server Error`: Erreur interne du serveur

Les réponses d'erreur incluent généralement un message explicatif:

```json
{
  "message": "Description de l'erreur",
  "stack": "..." // En mode développement uniquement
}
```

## Limites d'utilisation

Il n'y a pas actuellement de limites de taux mises en place pour l'API. Cependant, il est recommandé de limiter le nombre de requêtes pour éviter les surcharges du serveur.

## Versions de l'API

Cette documentation concerne la version actuelle de l'API (v1). Les versions futures incluront un préfixe de version dans l'URL (par exemple, `/api/v2/users`).

Pour toute question ou assistance concernant l'API, veuillez contacter l'équipe de support.