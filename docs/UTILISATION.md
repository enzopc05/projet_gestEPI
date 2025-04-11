# Manuel d'utilisation de GestEPI

Ce manuel explique l'utilisation de l'application GestEPI, un système de gestion des Équipements de Protection Individuelle (EPI). L'application permet de suivre les EPI, leurs vérifications périodiques et de gérer les utilisateurs selon différents niveaux d'accès.

## Table des matières

1. [Connexion à l'application](#connexion-à-lapplication)
2. [Navigation et interface](#navigation-et-interface)
3. [Tableau de bord](#tableau-de-bord)
4. [Gestion des EPIs](#gestion-des-epis)
5. [Gestion des vérifications](#gestion-des-vérifications)
6. [Gestion des utilisateurs](#gestion-des-utilisateurs)
7. [Profil utilisateur](#profil-utilisateur)
8. [Déconnexion](#déconnexion)
9. [Droits d'accès selon les rôles](#droits-daccès-selon-les-rôles)

## Connexion à l'application

1. Ouvrez votre navigateur web et accédez à l'URL de l'application GestEPI
2. Sur la page de connexion, saisissez votre adresse e-mail et votre mot de passe
3. Cliquez sur le bouton "Se connecter"

**Comptes par défaut**:
- Administrateur: romeo.giorgio@edu.esiee-it.fr / password
- Vérificateur: enzopace05@gmail.com / password
- Utilisateur: pierre.durand@example.com / password

![Écran de connexion](https://via.placeholder.com/800x450.png?text=Écran+de+connexion)

## Navigation et interface

Une fois connecté, vous accédez à la page d'accueil. La barre de navigation supérieure permet d'accéder aux différentes fonctionnalités selon vos droits d'accès:

- **Accueil**: Retour à la page d'accueil
- **Tableau de bord**: Statistiques et indicateurs
- **EPIs**: Gestion des équipements (si autorisé)
- **Vérifications**: Suivi des vérifications (si autorisé)
- **Utilisateurs**: Gestion des utilisateurs (administrateurs uniquement)
- **Profil**: Accès à votre profil utilisateur (icône utilisateur en haut à droite)

## Tableau de bord

Le tableau de bord présente une vue synthétique sur:

- Le nombre total d'EPIs dans le système
- Le pourcentage d'EPIs opérationnels
- Les vérifications urgentes à effectuer
- La répartition des EPIs par type
- La répartition des EPIs par statut
- L'historique des vérifications

![Tableau de bord](https://via.placeholder.com/800x450.png?text=Tableau+de+bord)

## Gestion des EPIs

### Liste des EPIs

La page de liste des EPIs affiche tous les équipements enregistrés dans le système avec leurs informations principales:
- Marque
- Modèle
- Numéro de série
- Type
- Statut

Des boutons d'action permettent de:
- Voir les détails d'un EPI
- Modifier un EPI (administrateurs uniquement)
- Supprimer un EPI (administrateurs uniquement)

![Liste des EPIs](https://via.placeholder.com/800x450.png?text=Liste+des+EPIs)

### Détails d'un EPI

La page de détail d'un EPI affiche toutes les informations sur l'équipement:
- Informations générales (marque, modèle, numéro de série)
- Caractéristiques (taille, couleur)
- Dates importantes (achat, fabrication, mise en service)
- Périodicité des vérifications
- Type et statut

### Ajouter un EPI (Administrateurs)

Pour ajouter un nouvel EPI:
1. Cliquez sur le bouton "Ajouter un EPI" depuis la liste
2. Remplissez le formulaire avec les informations requises
3. Cliquez sur "Créer" pour enregistrer l'EPI

### Modifier un EPI (Administrateurs)

Pour modifier un EPI existant:
1. Cliquez sur l'icône de modification dans la liste des EPIs
2. Modifiez les informations dans le formulaire
3. Cliquez sur "Mettre à jour" pour enregistrer les changements

## Gestion des vérifications

### Liste des vérifications

La page des vérifications comporte deux onglets:
- **Historique des vérifications**: Toutes les vérifications effectuées
- **Vérifications à effectuer**: EPIs dont la vérification est due ou à venir

![Liste des vérifications](https://via.placeholder.com/800x450.png?text=Liste+des+vérifications)

### Détails d'une vérification

Pour chaque vérification, vous pouvez consulter:
- Date de la vérification
- Équipement concerné
- Vérificateur
- Statut attribué
- Remarques éventuelles

### Effectuer une vérification

Pour effectuer une nouvelle vérification:
1. Depuis l'onglet "Vérifications à effectuer", cliquez sur le bouton "Vérifier" à côté de l'EPI concerné
   OU
   Cliquez sur "Nouvelle vérification" depuis la liste des vérifications
2. Remplissez le formulaire:
   - Date de vérification (par défaut la date du jour)
   - Sélectionnez l'équipement à vérifier
   - Statut attribué (Opérationnel, À réparer, Mis au rebut)
   - Ajoutez des remarques si nécessaire
3. Cliquez sur "Enregistrer"

## Gestion des utilisateurs (Administrateurs uniquement)

### Liste des utilisateurs

La liste des utilisateurs affiche tous les comptes enregistrés dans le système avec:
- Nom et prénom
- Email
- Téléphone
- Rôle dans le système

### Ajouter un utilisateur

Pour ajouter un nouvel utilisateur:
1. Cliquez sur "Ajouter un utilisateur"
2. Remplissez le formulaire avec les informations requises:
   - Prénom et nom
   - Email
   - Téléphone (optionnel)
   - Rôle (Administrateur, Vérificateur, Utilisateur)
   - Mot de passe
3. Cliquez sur "Créer"

### Modifier un utilisateur

Pour modifier un utilisateur:
1. Cliquez sur l'icône de modification dans la liste
2. Mettez à jour les informations nécessaires
3. Si vous souhaitez modifier le mot de passe, remplissez les champs correspondants
4. Cliquez sur "Mettre à jour"

## Profil utilisateur

Tous les utilisateurs peuvent accéder et modifier leur propre profil:
1. Cliquez sur l'avatar en haut à droite dans la barre de navigation
2. Sélectionnez "Mon profil"
3. Vous pouvez modifier vos informations personnelles et votre mot de passe
4. Cliquez sur "Mettre à jour" pour enregistrer les changements

## Déconnexion

Pour vous déconnecter:
1. Cliquez sur l'avatar en haut à droite dans la barre de navigation
2. Sélectionnez "Déconnexion"

## Droits d'accès selon les rôles

GestEPI utilise un système de contrôle d'accès basé sur les rôles. Voici ce que chaque type d'utilisateur peut faire:

### Administrateur

- Accès complet à toutes les fonctionnalités
- Peut créer, modifier et supprimer des EPIs
- Peut créer, modifier et supprimer des vérifications
- Peut gérer tous les utilisateurs

### Vérificateur

- Peut consulter les EPIs mais pas les créer ou les modifier
- Peut créer et gérer des vérifications
- Peut voir le tableau de bord
- Ne peut pas gérer les utilisateurs (sauf son propre profil)

### Utilisateur simple

- Peut consulter le tableau de bord
- Peut consulter son propre profil
- Ne peut pas accéder à la gestion des EPIs
- Ne peut pas accéder aux vérifications

| Fonctionnalité | Administrateur | Vérificateur | Utilisateur |
|----------------|----------------|--------------|-------------|
| Accueil | ✅ | ✅ | ✅ |
| Tableau de bord | ✅ | ✅ | ✅ |
| Liste des EPIs | ✅ | ✅ | ❌ |
| Détail d'un EPI | ✅ | ✅ | ❌ |
| Création/modification d'EPI | ✅ | ❌ | ❌ |
| Liste des vérifications | ✅ | ✅ | ❌ |
| Détail d'une vérification | ✅ | ✅ | ❌ |
| Création/modification de vérification | ✅ | ✅ | ❌ |
| Liste des utilisateurs | ✅ | ❌ | ❌ |
| Création/modification d'utilisateur | ✅ | ❌ | ❌ |
| Son propre profil | ✅ | ✅ | ✅ |