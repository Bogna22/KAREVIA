# 🏥 KAREVIA — Guide d'installation du Backend Laravel

## ──────────────────────────────────────────────────
## STRUCTURE DES FICHIERS — OÙ PLACER CHAQUE FICHIER
## ──────────────────────────────────────────────────

```
karevia/                          ← Dossier racine Laravel (créé avec composer)
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          ✅ Inscription, connexion, profil
│   │   │   ├── RendezVousController.php    ✅ RDV, médecins, planning
│   │   │   ├── ConsultationController.php  ✅ Consultations, ordonnances
│   │   │   ├── DocumentController.php      ✅ Upload justificatifs
│   │   │   ├── DonController.php           ✅ Dons, demandes aide
│   │   │   ├── PaiementController.php      ✅ Stripe, paiements
│   │   │   ├── NotificationController.php  ✅ Notifications
│   │   │   └── AdminController.php         ✅ Dashboard admin
│   │   └── Middleware/
│   │       └── RoleMiddleware.php          ✅ Guard par rôle
│   └── Models/
│       ├── User.php
│       ├── Medecin.php
│       ├── Patient.php
│       ├── Document.php
│       ├── RendezVous.php
│       ├── Consultation.php
│       ├── Don.php
│       ├── Paiement.php
│       └── KareviaNotification.php
├── database/
│   ├── migrations/               ✅ 10 fichiers de migration
│   └── seeders/
│       └── DatabaseSeeder.php    ✅ Données de démo
├── routes/
│   └── api.php                   ✅ Toutes les routes API
├── config/
│   ├── services.php              ✅ Config Stripe
│   └── cors.php                  ✅ Config CORS
├── bootstrap/
│   └── app.php                   ✅ Enregistrement middleware
└── .env                          ✅ Variables d'environnement
```

---

## ÉTAPE 1 — Prérequis
- PHP 8.2+
- Composer
- MySQL (ou XAMPP/WAMP/MAMP)
- Node.js (pour le frontend)

---

## ÉTAPE 2 — Créer le projet Laravel

```bash
composer create-project laravel/laravel karevia-backend
cd karevia-backend
```

---

## ÉTAPE 3 — Installer les dépendances

```bash
composer require laravel/sanctum
composer require stripe/stripe-php
```

---

## ÉTAPE 4 — Copier les fichiers fournis

Copie tous les fichiers de ce ZIP dans les dossiers correspondants.

---

## ÉTAPE 5 — Créer la base de données MySQL

**Tu n'as pas besoin d'écrire de SQL manuellement.**

Option A — phpMyAdmin (XAMPP) :
1. Ouvre http://localhost/phpmyadmin
2. Clique "Nouvelle base de données"
3. Nom : `karevia_db`
4. Clique "Créer"

Option B — Terminal MySQL :
```bash
mysql -u root -p
CREATE DATABASE karevia_db;
EXIT;
```

---

## ÉTAPE 6 — Configurer le .env

```bash
cp .env.example .env
php artisan key:generate
```

Édite `.env` :
```env
DB_DATABASE=karevia_db
DB_USERNAME=root
DB_PASSWORD=        # ton mot de passe MySQL (vide si XAMPP par défaut)
```

---

## ÉTAPE 7 — Lancer les migrations et le seeder

```bash
# Crée toutes les tables automatiquement
php artisan migrate

# Remplit la base avec des données de démo
php artisan db:seed
```

---

## ÉTAPE 8 — Lier le storage (pour les uploads)

```bash
php artisan storage:link
```

---

## ÉTAPE 9 — Démarrer le serveur

```bash
php artisan serve
# → http://localhost:8000
```

---

## COMPTES DE TEST (après le seed)

| Rôle    | Email                    | Mot de passe  |
|---------|--------------------------|---------------|
| Admin   | admin@karevia.com        | password123   |
| Médecin | dr.kabore@karevia.com    | password123   |
| Patient | awa@test.com             | password123   |
| ONG     | ong@karevia.com          | password123   |

---

## ROUTES API COMPLÈTES

### Publiques
```
POST /api/register          Inscription
POST /api/login             Connexion
GET  /api/medecins          Liste médecins
GET  /api/medecins/{id}/creneaux?date=2026-05-10  Créneaux dispo
GET  /api/dons              Liste dons
```

### Protégées (token Bearer requis)
```
POST   /api/logout
GET    /api/user
PUT    /api/user/profile
PUT    /api/user/password
POST   /api/user/avatar

GET    /api/notifications
PATCH  /api/notifications/{id}/read
POST   /api/notifications/read-all

GET    /api/documents
POST   /api/documents/upload          (multipart/form-data : type + fichier)

GET    /api/rendez-vous
POST   /api/rendez-vous
PATCH  /api/rendez-vous/{id}/statut
PATCH  /api/rendez-vous/{id}/annuler

POST   /api/rendez-vous/{id}/consultation
PATCH  /api/consultations/{id}/valider-ordonnance
GET    /api/consultations/historique

POST   /api/dons
POST   /api/dons/demander-aide
PATCH  /api/dons/{id}/valider
PATCH  /api/dons/{id}/livraison

POST   /api/payment/intent
GET    /api/paiements
```

### Admin uniquement
```
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/users/{id}/toggle
PATCH  /api/admin/users/{id}/verifier
GET    /api/admin/documents/en-attente
PATCH  /api/admin/documents/{id}/valider
```

---

## STRIPE (Paiement)
1. Créer un compte sur https://stripe.com
2. Dashboard → Développeurs → Clés API
3. Copier `Publishable key` → `STRIPE_KEY` dans .env
4. Copier `Secret key` → `STRIPE_SECRET` dans .env
5. En mode test, les paiements fonctionnent avec la carte `4242 4242 4242 4242`

---

## FAQ

**Q : Est-ce que je dois ouvrir MySQL / écrire du SQL ?**
R : Non ! Juste créer la base (`karevia_db`) une seule fois dans phpMyAdmin.
Ensuite `php artisan migrate` crée toutes les tables automatiquement.

**Q : Le frontend appelle quelle URL ?**
R : `http://localhost:8000/api` — c'est la valeur de `REACT_APP_API_URL` dans le .env de ton React.

**Q : Comment tester les routes ?**
R : Utilise Postman ou Insomnia. Importe les routes depuis INSTALLATION.md.
Pour les routes protégées : ajoute le header `Authorization: Bearer {token}`.
