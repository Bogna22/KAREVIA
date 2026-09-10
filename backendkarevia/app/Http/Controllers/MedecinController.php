<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedecinController extends Controller
{
    // =====================================================================
    // DASHBOARD MÉDECIN
    // =====================================================================
    public function dashboard(): JsonResponse
    {
        $medecin = auth('api')->user();

        $upcomingAppointments = Appointment::where('medecin_id', $medecin->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('date', '>=', now()->toDateString())
            ->with('patient:id,name,email,avatar,status')
            ->orderBy('date')
            ->orderBy('time')
            ->take(10)
            ->get();

        $stats = [
            'total_consultations' => Consultation::where('medecin_id', $medecin->id)
                ->where('status', 'completed')->count(),
            'pending_appointments'=> Appointment::where('medecin_id', $medecin->id)
                ->where('status', 'pending')->count(),
            'confirmed_today'     => Appointment::where('medecin_id', $medecin->id)
                ->whereDate('date', today())
                ->where('status', 'confirmed')
                ->count(),
        ];

        return response()->json([
            'medecin'              => $medecin,
            'upcoming_appointments'=> $upcomingAppointments,
            'stats'                => $stats,
        ]);
    }

    // =====================================================================
    // LISTE DES PATIENTS SUIVIS
    // =====================================================================
    public function patients(): JsonResponse
    {
        $medecin = auth('api')->user();

        $patientIds = Consultation::where('medecin_id', $medecin->id)
            ->distinct()
            ->pluck('patient_id');

        $patients = User::whereIn('id', $patientIds)
            ->select('id', 'name', 'email', 'avatar', 'phone', 'status')
            ->withCount([
                'consultations as nb_consultations' => function ($q) use ($medecin) {
                    $q->where('medecin_id', $medecin->id);
                }
            ])
            ->get();

        return response()->json($patients);
    }

    // =====================================================================
    // PLANNING — créneaux disponibles du médecin
    // =====================================================================
    public function planning(): JsonResponse
    {
        $medecin = auth('api')->user();

        $appointments = Appointment::where('medecin_id', $medecin->id)
            ->whereDate('date', '>=', now()->toDateString())
            ->with('patient:id,name,avatar')
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return response()->json([
            'planning'      => $appointments,
            'custom_slots'  => $medecin->planning ?? [],
        ]);
    }

    // =====================================================================
    // UPDATE PLANNING — le médecin définit ses disponibilités
    // =====================================================================
    public function updatePlanning(Request $request): JsonResponse
    {
        $request->validate([
            'planning' => 'required|array',
        ]);

        $medecin = auth('api')->user();
        $medecin->update(['planning' => $request->planning]);

        return response()->json([
            'message' => 'Planning mis à jour.',
            'planning'=> $medecin->planning,
        ]);
    }
}
