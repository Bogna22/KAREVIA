<?php
namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\KareviaNotification;
use App\Models\RendezVous;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    // Créer/MAJ une consultation (médecin)
    public function store(Request $request, RendezVous $rdv)
    {
        $user = $request->user();
        if ($user->id !== $rdv->medecin_id)
            return response()->json(['message' => 'Non autorisé.'], 403);

        $request->validate([
            'notes_medecin'             => 'nullable|string',
            'diagnostic'                => 'nullable|string',
            'prescriptions'             => 'nullable|string',
            'recommandations'           => 'nullable|string',
            'aide_alimentaire_demandee' => 'nullable|boolean',
        ]);

        $consultation = Consultation::updateOrCreate(
            ['rendez_vous_id' => $rdv->id],
            array_merge(
                $request->only(['notes_medecin','diagnostic','prescriptions','recommandations','aide_alimentaire_demandee']),
                ['medecin_id' => $rdv->medecin_id, 'patient_id' => $rdv->patient_id]
            )
        );

        $rdv->update(['statut' => 'termine']);
        if ($rdv->medecin && $rdv->medecin->medecin) {
            $rdv->medecin->medecin->increment('consultations_benevoles');
        }

        KareviaNotification::create(['user_id' => $rdv->patient_id, 'type' => 'prescription',
            'message' => 'Votre consultation est terminée. Une prescription a été émise.', 'lien' => '/patient/dashboard']);

        return response()->json(['message' => 'Consultation enregistrée.', 'consultation' => $consultation], 201);
    }

    // Valider ordonnance
    public function validerOrdonnance(Request $request, Consultation $consultation)
    {
        if ($request->user()->id !== $consultation->medecin_id)
            return response()->json(['message' => 'Non autorisé.'], 403);

        $consultation->update(['ordonnance_validee' => true]);

        KareviaNotification::create(['user_id' => $consultation->patient_id, 'type' => 'prescription',
            'message' => 'Votre ordonnance a été validée par votre médecin.', 'lien' => '/patient/dashboard']);

        return response()->json(['message' => 'Ordonnance validée.', 'consultation' => $consultation]);
    }

    // Historique patient
    public function historiquePatient(Request $request)
    {
        $consultations = Consultation::with(['medecin:id,name,avatar','rendezVous'])
            ->where('patient_id', $request->user()->id)
            ->orderByDesc('created_at')->get();
        return response()->json($consultations);
    }

    // Consultations médecin
    public function mesMedecin(Request $request)
    {
        if (!$request->user()->isMedecin())
            return response()->json(['message' => 'Non autorisé.'], 403);

        $consultations = Consultation::with(['patient:id,name,avatar,phone','rendezVous'])
            ->where('medecin_id', $request->user()->id)
            ->orderByDesc('created_at')->get();
        return response()->json($consultations);
    }

    // Détail d'une consultation
    public function show(Request $request, Consultation $consultation)
    {
        $user = $request->user();
        if ($user->id !== $consultation->patient_id && $user->id !== $consultation->medecin_id && !$user->isAdmin())
            return response()->json(['message' => 'Non autorisé.'], 403);

        return response()->json($consultation->load(['medecin','patient','rendezVous']));
    }
}
