<?php

namespace App\Http\Controllers;

use App\Models\Verification;
use App\Models\User;
use App\Models\KareviaNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Cloudinary\Cloudinary;

class VerificationController extends Controller
{
    // =====================================================================
    // UPLOAD DES JUSTIFICATIFS
    // =====================================================================
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'carte_id'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'justificatif'  => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $user = auth('api')->user();

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        // Upload carte d'identité
        $carteResult = $cloudinary->uploadApi()->upload(
            $request->file('carte_id')->getRealPath(),
            [
                'folder'     => 'karevia/verifications',
                'public_id'  => 'carte_' . $user->id . '_' . time(),
                'resource_type' => 'auto',
            ]
        );

        // Upload justificatif médical/social
        $justifResult = $cloudinary->uploadApi()->upload(
            $request->file('justificatif')->getRealPath(),
            [
                'folder'     => 'karevia/verifications',
                'public_id'  => 'justif_' . $user->id . '_' . time(),
                'resource_type' => 'auto',
            ]
        );

        // Créer ou mettre à jour la vérification
        $verification = Verification::updateOrCreate(
            ['user_id' => $user->id],
            [
                'carte_id_path'     => $carteResult['secure_url'],
                'justificatif_path' => $justifResult['secure_url'],
                'status'            => 'pending',
                'reviewed_by'       => null,
                'reviewed_at'       => null,
                'rejection_reason'  => null,
            ]
        );

        // Notifier l'admin (user_id = 1 par convention)
        KareviaNotification::send(
            1,
            'alert',
            "Nouvelle demande de vérification de {$user->name} — à examiner.",
            ['user_id' => $user->id, 'verification_id' => $verification->id]
        );

        return response()->json([
            'message'      => 'Documents envoyés. Votre demande sera traitée sous 24 à 48h.',
            'verification' => $verification,
        ]);
    }

    // =====================================================================
    // STATUS — le patient consulte l'état de sa vérification
    // =====================================================================
    public function status(): JsonResponse
    {
        $verification = Verification::where('user_id', auth('api')->id())->first();

        if (!$verification) {
            return response()->json(['status' => 'not_submitted']);
        }

        return response()->json($verification);
    }
}
