<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DonController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\RendezVousController;
use Illuminate\Support\Facades\Route;

/*
|────────────────────────────────────────────────────────────────
|  KAREVIA API  —  prefix: /api
|────────────────────────────────────────────────────────────────
*/

// ══════════════════════════════════════════════════════════════
//  ROUTES PUBLIQUES (sans authentification)
// ══════════════════════════════════════════════════════════════
Route::post('/register',      [AuthController::class, 'register']);
Route::post('/login',         [AuthController::class, 'login']);
Route::post('/payment/webhook', [PaiementController::class, 'webhook']);  // Stripe webhook (pas d'auth)

// Médecins publics (pour la page prise de RDV)
Route::get('/medecins',       [RendezVousController::class, 'medecins']);
Route::get('/medecins/{medecinId}/creneaux', [RendezVousController::class, 'creneaux']);

// Dons publics
Route::get('/dons',           [DonController::class, 'index']);
Route::get('/dons/{don}',     [DonController::class, 'show']);


// ══════════════════════════════════════════════════════════════
//  ROUTES PROTÉGÉES (auth Sanctum obligatoire)
// ══════════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ─────────────────────────────────────────────────
    Route::post('/logout',                [AuthController::class, 'logout']);
    Route::get('/user',                   [AuthController::class, 'me']);
    Route::put('/user/profile',           [AuthController::class, 'updateProfile']);
    Route::put('/user/password',          [AuthController::class, 'changePassword']);
    Route::post('/user/avatar',           [AuthController::class, 'uploadAvatar']);

    // ── Notifications ─────────────────────────────────────────
    Route::get('/notifications',              [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',    [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // ── Documents / Upload justificatifs ──────────────────────
    Route::get('/documents',               [DocumentController::class, 'index']);
    Route::post('/documents/upload',       [DocumentController::class, 'upload']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    // ── Rendez-vous ───────────────────────────────────────────
    Route::get('/rendez-vous',                        [RendezVousController::class, 'index']);
    Route::post('/rendez-vous',                       [RendezVousController::class, 'store']);
    Route::get('/rendez-vous/{rdv}',                  [RendezVousController::class, 'show']);
    Route::patch('/rendez-vous/{rdv}/statut',         [RendezVousController::class, 'updateStatut']);
    Route::patch('/rendez-vous/{rdv}/annuler',        [RendezVousController::class, 'annuler']);

    // ── Consultations ─────────────────────────────────────────
    Route::get('/consultations/historique',                         [ConsultationController::class, 'historiquePatient']);
    Route::post('/rendez-vous/{rdv}/consultation',                  [ConsultationController::class, 'store']);
    Route::patch('/consultations/{consultation}/valider-ordonnance',[ConsultationController::class, 'validerOrdonnance']);
    Route::get('/consultations/{consultation}',                     [ConsultationController::class, 'show']);

    // ── Dons ──────────────────────────────────────────────────
    Route::post('/dons',                        [DonController::class, 'store']);
    Route::post('/dons/demander-aide',          [DonController::class, 'demanderAide']);
    Route::patch('/dons/{don}/valider',         [DonController::class, 'valider']);
    Route::patch('/dons/{don}/livraison',       [DonController::class, 'confirmerLivraison']);

    // ── Paiements ────────────────────────────────────────────
    Route::post('/payment/intent',  [PaiementController::class, 'createIntent']);
    Route::get('/paiements',        [PaiementController::class, 'index']);

    // ══════════════════════════════════════════════════════════
    //  MÉDECIN
    // ══════════════════════════════════════════════════════════
    Route::middleware('role:medecin,admin')->group(function () {
        Route::get('/medecin/dashboard',          [RendezVousController::class, 'dashboardMedecin']);
        Route::get('/medecin/consultations',      [ConsultationController::class, 'mesMedecin']);
    });

    // ══════════════════════════════════════════════════════════
    //  ONG
    // ══════════════════════════════════════════════════════════
    Route::middleware('role:ong,admin')->group(function () {
        Route::get('/ong/dashboard', [DonController::class, 'dashboardOng']);
    });

    // ══════════════════════════════════════════════════════════
    //  ADMIN UNIQUEMENT
    // ══════════════════════════════════════════════════════════
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/stats',                          [AdminController::class, 'stats']);
        Route::get('/admin/users',                          [AdminController::class, 'users']);
        Route::patch('/admin/users/{user}/toggle',          [AdminController::class, 'toggleUser']);
        Route::patch('/admin/users/{user}/verifier',        [AdminController::class, 'verifierUser']);
        Route::get('/admin/paiements',                      [AdminController::class, 'paiements']);
        Route::get('/admin/documents/en-attente',           [DocumentController::class, 'enAttente']);
        Route::patch('/admin/documents/{document}/valider', [DocumentController::class, 'valider']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
    });
});
