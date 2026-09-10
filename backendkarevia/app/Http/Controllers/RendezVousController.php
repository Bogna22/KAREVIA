<?php
namespace App\Http\Controllers;

use App\Models\KareviaNotification;
use App\Models\RendezVous;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RendezVousController extends Controller
{
    // Liste RDV du user connecté
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->isMedecin()) {
            $rdvs = RendezVous::with(['patient:id,name,email,phone,avatar'])
                ->where('medecin_id', $user->id)
                ->orderBy('date_heure')->get();
        } else {
            $rdvs = RendezVous::with(['medecin:id,name,email,avatar','medecin.medecin'])
                ->where('patient_id', $user->id)
                ->orderBy('date_heure')->get();
        }
        return response()->json($rdvs);
    }

    // Créneaux disponibles d'un médecin
    public function creneaux(Request $request, $medecinId)
    {
        $request->validate(['date' => 'required|date|after_or_equal:today']);
        $medecin = User::with('medecin')->findOrFail($medecinId);

        $joursMap = ['monday'=>'lundi','tuesday'=>'mardi','wednesday'=>'mercredi',
                     'thursday'=>'jeudi','friday'=>'vendredi','saturday'=>'samedi','sunday'=>'dimanche'];
        $jourFr = $joursMap[strtolower(date('l', strtotime($request->date)))] ?? 'lundi';

        $dispo = $medecin->medecin?->disponibilites ?? [];
        $slots = $dispo[$jourFr] ?? ['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00'];

        $reserves = RendezVous::where('medecin_id', $medecinId)
            ->whereDate('date_heure', $request->date)
            ->whereIn('statut', ['confirme','en_attente'])
            ->pluck('date_heure')
            ->map(fn($d) => $d->format('H:i'))->toArray();

        return response()->json([
            'date'     => $request->date,
            'creneaux' => array_values(array_filter($slots, fn($s) => !in_array($s, $reserves))),
        ]);
    }

    // Prendre un RDV
    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'medecin_id' => 'required|exists:users,id',
            'date_heure' => 'required|date|after:now',
            'type'       => 'required|in:presentiel,teleconsultation',
            'motif'      => 'nullable|string|max:500',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $patient = $request->user();
        $medecin = User::findOrFail($request->medecin_id);
        if ($medecin->role !== 'medecin') return response()->json(['message' => 'Ce compte n\'est pas un médecin.'], 400);

        $conflit = RendezVous::where('medecin_id', $medecin->id)
            ->where('date_heure', $request->date_heure)
            ->whereIn('statut', ['confirme','en_attente'])->exists();
        if ($conflit) return response()->json(['message' => 'Ce créneau n\'est plus disponible.'], 409);

        $estGratuit = $patient->isVulnerable() && $patient->is_verified;
        $rdv = RendezVous::create([
            'patient_id'  => $patient->id,
            'medecin_id'  => $medecin->id,
            'date_heure'  => $request->date_heure,
            'type'        => $request->type,
            'motif'       => $request->motif,
            'est_gratuit' => $estGratuit,
            'tarif'       => $estGratuit ? 0 : ($medecin->medecin?->tarif_solidaire ?? 0),
            'statut'      => 'en_attente',
        ]);

        KareviaNotification::create(['user_id' => $patient->id, 'type' => 'rdv',
            'message' => "Votre RDV du {$rdv->date_heure->format('d/m/Y à H:i')} est en attente de confirmation.", 'lien' => '/patient/dashboard']);
        KareviaNotification::create(['user_id' => $medecin->id, 'type' => 'rdv',
            'message' => "Nouveau RDV de {$patient->name} le {$rdv->date_heure->format('d/m/Y à H:i')}.", 'lien' => '/medecin/dashboard']);

        return response()->json(['message' => 'Rendez-vous créé.', 'rdv' => $rdv->load(['patient:id,name,email','medecin:id,name,email'])], 201);
    }

    // Détail d'un RDV
    public function show(Request $request, RendezVous $rdv)
    {
        $user = $request->user();
        if ($user->id !== $rdv->patient_id && $user->id !== $rdv->medecin_id && !$user->isAdmin())
            return response()->json(['message' => 'Non autorisé.'], 403);
        return response()->json($rdv->load(['patient','medecin','consultation']));
    }

    // Changer statut (médecin / admin)
    public function updateStatut(Request $request, RendezVous $rdv)
    {
        $request->validate(['statut' => 'required|in:confirme,annule,termine,absent']);
        $user = $request->user();
        if ($user->id !== $rdv->medecin_id && !$user->isAdmin())
            return response()->json(['message' => 'Non autorisé.'], 403);

        $rdv->update(['statut' => $request->statut]);

        if ($request->statut === 'confirme') {
            KareviaNotification::create(['user_id' => $rdv->patient_id, 'type' => 'rdv',
                'message' => "Votre RDV du {$rdv->date_heure->format('d/m/Y à H:i')} est confirmé ✅", 'lien' => '/patient/dashboard']);
        } elseif ($request->statut === 'annule') {
            KareviaNotification::create(['user_id' => $rdv->patient_id, 'type' => 'alert',
                'message' => "Votre RDV du {$rdv->date_heure->format('d/m/Y à H:i')} a été annulé.", 'lien' => '/patient/dashboard']);
        }
        return response()->json(['message' => 'Statut mis à jour.', 'rdv' => $rdv]);
    }

    // Annuler son propre RDV (patient)
    public function annuler(Request $request, RendezVous $rdv)
    {
        if ($request->user()->id !== $rdv->patient_id)
            return response()->json(['message' => 'Non autorisé.'], 403);
        if (in_array($rdv->statut, ['termine','annule']))
            return response()->json(['message' => 'Impossible d\'annuler ce rendez-vous.'], 400);

        $rdv->update(['statut' => 'annule']);
        KareviaNotification::create(['user_id' => $rdv->medecin_id, 'type' => 'alert',
            'message' => "{$request->user()->name} a annulé le RDV du {$rdv->date_heure->format('d/m/Y à H:i')}.", 'lien' => '/medecin/dashboard']);
        return response()->json(['message' => 'Rendez-vous annulé.']);
    }

    // Liste des médecins disponibles
    public function medecins(Request $request)
    {
        $query = User::where('role','medecin')->where('status','active')->with('medecin')
            ->when($request->specialite, fn($q,$s) => $q->whereHas('medecin', fn($m) => $m->where('specialite',$s)))
            ->when($request->zone, fn($q,$z) => $q->where('zone',$z))
            ->when($request->type === 'online', fn($q) => $q->whereHas('medecin', fn($m) => $m->where('teleconsultation_active',true)));

        return response()->json($query->get()->map(fn($u) => [
            'id'                     => $u->id,
            'name'                   => $u->name,
            'specialite'             => $u->medecin?->specialite,
            'presentation'           => $u->medecin?->presentation,
            'zone'                   => $u->zone,
            'avatar_url'             => $u->avatar_url,
            'teleconsultation_active'=> $u->medecin?->teleconsultation_active,
            'tarif_solidaire'        => $u->medecin?->tarif_solidaire,
        ]));
    }

    // Planning médecin (dashboard)
    public function dashboardMedecin(Request $request)
    {
        $user = $request->user();
        if (!$user->isMedecin()) return response()->json(['message' => 'Non autorisé.'], 403);

        return response()->json([
            'rdvs_a_venir' => RendezVous::with('patient:id,name,email,phone,avatar')
                ->where('medecin_id', $user->id)
                ->where('date_heure', '>=', now())
                ->whereIn('statut', ['en_attente','confirme'])
                ->orderBy('date_heure')->get(),
            'stats' => [
                'consultations_benevoles' => $user->medecin?->consultations_benevoles ?? 0,
                'rdvs_total'              => RendezVous::where('medecin_id', $user->id)->count(),
                'rdvs_ce_mois'            => RendezVous::where('medecin_id', $user->id)->whereMonth('date_heure', now()->month)->count(),
            ],
        ]);
    }
}
