# RAPPORT DE LIVRAISON : SPRINT 0
**Projet :** Application de gestion de bibliothèque  
**Promotion :** Master 2 - Informatique & Ingénierie Logicielle  
**Date :** 12 Janvier 2026

---

## 1. VUE D'ENSEMBLE DU SPRINT 0 (FOUNDATION)

### 1.1 Objectif du Sprint
L'objectif principal du Sprint 0 était d'établir les fondations techniques et fonctionnelles de l'application. Il s'agissait de mettre en place l'architecture, la gestion des utilisateurs, et le catalogue de base pour permettre une première utilisation de bout en bout ("First Usable Increment").

### 1.2 Informations Générales
*   **Période du Sprint :** 05/01/2026 au 12/01/2026 (1 semaine)
*   **Statut :** TERMINE
*   **Vélocité Réalisée :** 38 Points
*   **Outils utilisés :** Jira Software, GitHub, Docker, SonarQube

### 1.3 Rôles et Responsabilités
| Rôle | Responsabilité |
| :--- | :--- |
| **Product Owner** | Définition de la vision, priorisation du Backlog, validation des US. |
| **Scrum Master** | Facilitation des cérémonies, levée des obstacles, garantie du respect de la méthode Scrum. |
| **Tech Lead / Dev Team** | Conception technique (Architecture), développement Full-Stack, tests unitaires et intégration. |

### 1.4 Definition of Done (DoD) pour le Sprint 0
Pour qu'une User Story soit considérée comme "DONE", elle doit respecter les critères suivants :
*   [x] Code développé et commité sur la branche `main`.
*   [x] Tests unitaires passés (couverture > 80%).
*   [x] Revue de code effectuée par un pair.
*   [x] Fonctionnalité testée et validée sur l'environnement de "Staging".
*   [x] Aucune régression critique détectée.

---

## 2. EXTRAIT DU PRODUCT BACKLOG (ITEMS TERMINÉS)

Ci-dessous la liste des User Stories (US) priorisées et complétées durant ce sprint :

| ID | Titre | Description (En tant que... je veux...) | Priorité | Est. (PTS) | Statut |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **US-001** | Gestion des Rôles | En tant qu'Admin, je veux gérer 3 niveaux d'accès (Admin, Bibliothécaire, Membre) pour sécuriser l'application. | HIGH | 5 | **DONE** |
| **US-002** | Authentification | En tant qu'utilisateur, je veux m'inscrire et me connecter de manière sécurisée. | HIGH | 5 | **DONE** |
| **US-003** | Catalogue Livres | En tant que Bibliothécaire, je veux créer des fiches livres (Titre, Auteur, Genre) pour peupler la base. | HIGH | 8 | **DONE** |
| **US-004** | Recherche Avancée | En tant que Membre, je veux filtrer les livres par genre/année pour trouver rapidement un ouvrage. | MED | 5 | **DONE** |
| **US-005** | Gestion Emprunts | En tant que Bibliothécaire, je veux enregistrer un emprunt (Date début/fin) pour suivre les sorties. | HIGH | 8 | **DONE** |
| **US-006** | Statut Exemplaire | En tant qu'Admin, je veux marquer un livre comme "Perdu" ou "En réparation" pour la gestion des stocks. | MED | 3 | **DONE** |
| **US-007** | système d'Avis | En tant que Membre, je veux noter un livre pour partager mon opinion. | LOW | 4 | **DONE** |

**Total des Points de Story (SP) livrés : 38 / 38**

---

## 3. SPRINT BACKLOG (DÉCOUPAGE EN TÂCHES)

Pour réaliser les User Stories ci-dessus, le travail a été découpé en tâches techniques assignées aux développeurs.

### Focus : US-002 (Authentification)
*   **T-001 :** Modélisation de la table `Users` et `Roles` (SQL). *(Est: 2h)* - **FAIT**
*   **T-002 :** Implémentation de JWT (JSON Web Tokens) pour la sécurité. *(Est: 4h)* - **FAIT**
*   **T-003 :** Création des formulaires Front-End (Register/Login). *(Est: 4h)* - **FAIT**

### Focus : US-003 (Catalogue)
*   **T-004 :** Création de l'Entité `Book` et Repository associé. *(Est: 2h)* - **FAIT**
*   **T-005 :** API Endpoints (GET /books, POST /books). *(Est: 3h)* - **FAIT**
*   **T-006 :** Intégration de la liste des catégories (Fiction, Sci-Fi, etc.). *(Est: 1h)* - **FAIT**

*(Le reste des tâches est documenté dans notre outil de suivi Jira).*

---

## 4. INCRÉMENT LIVRÉ (VALEUR MÉTIER)

À l'issue de ce Sprint 0, nous livrons une **version Alpha fonctionnelle** de la plateforme *Library Manager*.

### Fonctionnalités Clés Disponibles :
1.  **Sécurité complète :** Le système de rôles est actif. Un membre ne peut pas accéder aux pages d'administration.
2.  **Base de connaissance :** Le catalogue supporte désormais 10 genres littéraires majeurs (Fiction, Essais, etc.) et permet une recherche multi-critères efficace.
3.  **Cycle de vie du livre :** Un livre peut être créé, emprunté, retourné, et passer par des états critiques (Perdu/Réparation).
4.  **Engagement utilisateur :** Les membres peuvent laisser des avis, créant une dimension communautaire.

**Contribution au Product Goal :** Ce sprint valide la faisabilité technique du cœur de métier (l'emprunt) et pose l'infrastructure nécessaire pour les futures fonctionnalités avancées (réservations, pénalités).

---

## 5. SPRINT REVIEW (DÉMONSTRATION)

**Tenue le :** 12 Janvier 2026 à 10h00.
**Présents :** Product Owner, Scrum Master, Équipe de développement, Parties prenantes académiques.

### Déroulement :
1.  **Présentation du but :** Rappel de l'objectif "Foundation".
2.  **Démonstration (Live Demo) :**
    *   Création d'un compte "Étudiant".
    *   Connexion en tant qu'Administrateur pour valider le compte.
    *   Recherche du livre "Clean Code".
    *   Simulation d'un emprunt.
    *   Déclaration d'un livre "Perdu" via le Dashboard Admin.
3.  **Feedback reçu :**
    *   *Positif :* La recherche est très rapide et réactive.
    *   *Amélioration :* Ajouter une photo de couverture pour les livres (Prévu Sprint 1).
    *   *Correction :* Le format de date dans l'historique d'emprunt était en US (MM/DD), demandé en FR (DD/MM). **[HOTFIX APPLIQUÉ]**.
4.  **Décision :** L'incrément est **VALIDÉ**. Passage au Sprint 1 autorisé.

---

## 6. SPRINT RETROSPECTIVE

**Tenue le :** 12 Janvier 2026 à 14h00.

### Ce qui s'est bien passé (Keep) :
*   La communication dans l'équipe a été fluide (Daily Scrum respectés).
*   L'architecture modulaire a facilité le développement parallèle (Front/Back).
*   L'objectif du Sprint a été atteint sans dette technique majeure.

### Ce qui a posé problème (Drop/Problem) :
*   Configuration initiale de l'environnement de CI/CD plus longue que prévue (perte d'une demi-journée).
*   Quelques ambiguïtés sur la gestion des statuts "Perdu" vs "Supprimé" au début du sprint.

### Actions d'amélioration pour le Sprint 1 (Try) :
*   [ ] Mettre à jour le fichier `README.md` avec les commandes de déploiement Docker précises.
*   [ ] Définir plus strictement les critères d'acceptation UI avant le début du développement.

---

## 7. MÉTRIQUES AGILES (SPRINT 0)

### 7.1 Velocity Chart
Sur les 38 points planifiés, **38 points ont été livrés**.
*   *Engagement respecté à 100%.*
*   Cela établit une vélocité de référence de **38** pour le prochain sprint.

### 7.2 Burndown Chart (Analyse)
*(Placeholder pour le graphique Burndown)*
> **Interprétation :** La courbe de progression (Reste à faire) a suivi une trajectoire idéale linéaire. Nous avons observé un léger plateau le jour 3 (blocage CI/CD), rattrapé le jour 4 grâce au "Swarming" (toute l'équipe sur le même problème).

### 7.3 Cumulative Flow Diagram
Les états des tickets ont montré un flux régulier :
*   **To Do :** S'est vidé progressivement.
*   **In Progress :** Jamais plus de 3 tâches en parallèle (respect du WIP Limit).
*   **Done :** Croissance constante jusqu'à la fin du sprint.

---

**Fin du Rapport Sprint 0**
