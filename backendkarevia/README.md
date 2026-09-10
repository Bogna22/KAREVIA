# KAREVIA — Backend Laravel

## Stack
- Laravel 11
- MySQL
- JWT (tymon/jwt-auth)
- Stripe (stripe/stripe-php)
- Cloudinary (pour les uploads)

## Structure des dossiers
```
karevia-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── AppointmentController.php
│   │   │   ├── ConsultationController.php
│   │   │   ├── DonController.php
│   │   │   ├── NotificationController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── VerificationController.php
│   │   │   ├── AdminController.php
│   │   │   └── OngController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Appointment.php
│       ├── Consultation.php
│       ├── Don.php
│       ├── Notification.php
│       ├── Payment.php
│       └── Verification.php
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
```
