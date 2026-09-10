<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use App\Models\KareviaNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    // =====================================================================
    // INDEX — liste des rendez-vous (selon le rôle)
    // =====================================================================
    public function index(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $query = Appointment::with([
            'patient:id,name,email,avatar',
            'medecin:id,name,specialite,avatar',
        ]);

        if ($user->role === 'medecin') {
            $query->where('medecin_id', $user->id);
        } elseif ($user->isAdmin()) {
            // L'admin voit tout
        } else {
            $query->where('patient_id', $user->id);
        }

        // Filtres optionnels
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }

        $appointments = $query->orderBy('date', 'desc')->paginate(15);

        return response()->json($appointments);
    }

    // =====================================================================
    // STORE — créer un rendez-vous
    // =====================================================================
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'medecin_id'  => 'required|exists:users,id',
            'date'        => 'required|date|after:today',
            'time'        => 'required|date_format:H:i',
            'type'        => 'required|in:online,presentiel',
            'reason'      => 'nullable|string|max:1000',
            'email_confirm' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier que le médecin existe et a le bon rôle
        $medecin = User::where('id', $request->medecin_id)
            ->where('role', 'medecin')
            ->firstOrFail();

        // Vérifier qu'il n'y a pas de conflit de créneau
        $conflict = Appointment::where('medecin_id', $request->medecin_id)
            ->whereDate('date', $request->date)
            ->where('time', $request->time)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Ce créneau est déjà réservé.'], 409);
        }

        $user = auth('api')->user();

        $appointment = Appointment::create([
            'patient_id'    => $user->id,
            'medecin_id'    => $request->medecin_id,
            'date'          => $request->date,
            'time'          => $request->time,
            'type'          => $request->type,
            'specialty'     => $medecin->specialite,
            'reason'        => $request->reason,
            'email_confirm' => $request->email_confirm ?? $user->email,
            'status'        => 'pending',
        ]);

        // Notifier le médecin
        KareviaNotification::send(
            $medecin->id,
            'rdv',
            "Nouveau rendez-vous demandé par {$user->name} le {$request->date} à {$request->time}.",
            ['appointment_id' => $appointment->id]
        );

        // Notifier le patient
        KareviaNotification::send(
            $user->id,
            'rdv',
            "Votre rendez-vous du {$request->date} à {$request->time} est en attente de confirmation.",
            ['appointment_id' => $appointment->id]
        );

        return response()->json([
            'message'     => 'Rendez-vous créé avec succès.',
            'appointment' => $appointment->load(['patient', 'medecin']),
        ], 201);
    }

    // =====================================================================
    // SHOW
    // =====================================================================
    public function show(int $id): JsonResponse
    {
        $user = auth('api')->user();

        $appointment = Appointment::with(['patient', 'medecin', 'consultation'])
            ->findOrFail($id);

        // Vérifier l'accès
        if (!$user->isAdmin() && $appointment->patient_id !== $user->id && $appointment->medecin_id !== $user->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json($appointment);
    }

    // =====================================================================
    // UPDATE
    // =====================================================================
    public function update(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $user = auth('api')->user();

        // Seul le patient propriétaire ou l'admin peut modifier
        if ($appointment->patient_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'date'   => 'sometimes|date|after:today',
            'time'   => 'sometimes|date_format:H:i',
            'reason' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $appointment->update($request->only(['date', 'time', 'reason', 'status']));

        if ($request->status === 'cancelled') {
            KareviaNotification::send(
                $appointment->medecin_id,
                'rdv',
                "Le rendez-vous du {$appointment->date} a été annulé par le patient.",
                ['appointment_id' => $appointment->id]
            );
        }

        return response()->json([
            'message'     => 'Rendez-vous mis à jour.',
            'appointment' => $appointment->fresh(),
        ]);
    }

    // =====================================================================
    // DESTROY
    // =====================================================================
    public function destroy(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $user = auth('api')->user();

        if ($appointment->patient_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $appointment->delete();

        return response()->json(['message' => 'Rendez-vous supprimé.']);
    }

    // =====================================================================
    // SLOTS — créneaux disponibles d'un médecin pour une date donnée
    // =====================================================================
    public function slots(Request $request): JsonResponse
    {
        $request->validate([
            'medecin_id' => 'required|exists:users,id',
            'date'       => 'required|date',
        ]);

        $allSlots = ['08:00','08:30','09:00','09:30','10:00','10:30',
                     '11:00','11:30','14:00','14:30','15:00','15:30',
                     '16:00','16:30','17:00'];

        // Créneaux déjà pris
        $takenSlots = Appointment::where('medecin_id', $request->medecin_id)
            ->whereDate('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->pluck('time')
            ->toArray();

        $available = array_values(array_diff($allSlots, $takenSlots));

        return response()->json([
            'date'      => $request->date,
            'available' => $available,
            'taken'     => $takenSlots,
        ]);
    }

    // =====================================================================
    // VALIDATE — le médecin confirme un rendez-vous
    // =====================================================================
    public function validate(int $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $medecin = auth('api')->user();

        if ($appointment->medecin_id !== $medecin->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $appointment->update(['status' => 'confirmed']);

        KareviaNotification::send(
            $appointment->patient_id,
            'rdv',
            "Votre rendez-vous du {$appointment->date} à {$appointment->time} a été confirmé par le Dr. {$medecin->name}.",
            ['appointment_id' => $appointment->id]
        );

        return response()->json([
            'message'     => 'Rendez-vous confirmé.',
            'appointment' => $appointment->fresh()->load('patient'),
        ]);
    }
}
