<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Don;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;

class UserController extends Controller
{
    // =====================================================================
    // SHOW PROFILE
    // =====================================================================
    public function show(): JsonResponse
    {
        $user = auth('api')->user()->load(['verification', 'appointments', 'payments']);
        return response()->json($user);
    }

    // =====================================================================
    // UPDATE PROFILE
    // =====================================================================
    public function update(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:255',
            'phone'        => 'sometimes|nullable|string|max:20',
            'address'      => 'sometimes|nullable|string|max:500',
            'zone'         => 'sometimes|nullable|string|max:100',
            'specialite'   => 'sometimes|nullable|string',
            'password'     => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'phone', 'address', 'zone', 'specialite']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user'    => $user->fresh(),
        ]);
    }

    // =====================================================================
    // UPLOAD AVATAR (Cloudinary)
    // =====================================================================
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate(['avatar' => 'required|image|max:2048']);

        $user = auth('api')->user();

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        $result = $cloudinary->uploadApi()->upload(
            $request->file('avatar')->getRealPath(),
            ['folder' => 'karevia/avatars', 'public_id' => 'user_' . $user->id]
        );

        $user->update(['avatar' => $result['secure_url']]);

        return response()->json([
            'message' => 'Avatar mis à jour.',
            'avatar'  => $result['secure_url'],
        ]);
    }

    // =====================================================================
    // PATIENT DASHBOARD — résumé
    // =====================================================================
    public function patientDashboard(): JsonResponse
    {
        $user = auth('api')->user();

        $appointments = Appointment::where('patient_id', $user->id)
            ->with('medecin:id,name,specialite,avatar')
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        $dons = Don::where('beneficiary_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $unreadNotifications = $user->notifications()
            ->where('read', false)
            ->count();

        return response()->json([
            'user'                 => $user->load('verification'),
            'appointments'         => $appointments,
            'recent_dons'          => $dons,
            'unread_notifications' => $unreadNotifications,
        ]);
    }

    // =====================================================================
    // HISTORIQUE complet du patient
    // =====================================================================
    public function history(): JsonResponse
    {
        $user = auth('api')->user();

        return response()->json([
            'appointments'  => Appointment::where('patient_id', $user->id)
                ->with('medecin:id,name,specialite')
                ->with('consultation')
                ->orderBy('date', 'desc')
                ->get(),
            'dons'          => Don::where('beneficiary_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get(),
            'payments'      => $user->payments()->orderBy('created_at', 'desc')->get(),
        ]);
    }
}
