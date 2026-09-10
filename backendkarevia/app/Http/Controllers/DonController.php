<?php
namespace App\Http\Controllers;

use App\Models\Don;
use App\Models\KareviaNotification;
use App\Models\User;
use Illuminate\Http\Request;

class DonController extends Controller
{
    // Liste publique des dons
    public function index(Request $request)
    {
        return response()->json(
            Don::with(['donateur:id,name,avatar,zone'])
                ->when($request->type,   fn($q,$t) => $q->where('type',$t))
                ->when($request->zone,   fn($q,$z) => $q->where('zone_livraison',$z))
                ->when($request->statut, fn($q,$s) => $q->where('statut',$s))
                ->orderByDesc('created_at')->paginate(15)
        );
    }

    // Proposer un don
    public function store(Request $request)
    {
        $request->validate([
            'type'          => 'required|in:nourriture,medicaments,transport,financier,autre',
            'description'   => 'required|string|max:500',
            'quantite'      => 'nullable|numeric|min:0',
            'unite'         => 'nullable|string|max:50',
            'valeur_estimee'=> 'nullable|numeric|min:0',
            'zone_livraison'=> 'nullable|string|max:100',
        ]);

        $don = Don::create(array_merge(
            $request->only(['type','description','quantite','unite','valeur_estimee','zone_livraison']),
            ['donateur_id' => $request->user()->id, 'statut' => 'propose']
        ));

        return response()->json(['message' => 'Don proposé. En attente de validation.', 'don' => $don], 201);
    }

    // Demande d'aide (patient vulnérable vérifié)
    public function demanderAide(Request $request)
    {
        $user = $request->user();
        if ($user->isVulnerable() && !$user->is_verified)
            return response()->json(['message' => 'Votre compte doit être vérifié pour faire une demande.'], 403);

        $request->validate([
            'type'        => 'required|in:nourriture,medicaments,transport,autre',
            'description' => 'required|string|max:500',
        ]);

        $don = Don::where('type', $request->type)->where('statut','valide')
            ->whereNull('beneficiaire_id')
            ->when($user->zone, fn($q,$z) => $q->where(fn($q2) => $q2->where('zone_livraison',$z)->orWhereNull('zone_livraison')))
            ->first();

        if (!$don) {
            Don::create(['donateur_id' => $user->id, 'type' => $request->type,
                'description' => 'DEMANDE: '.$request->description, 'statut' => 'propose', 'beneficiaire_id' => $user->id]);
            return response()->json(['message' => 'Demande enregistrée. Une ONG vous contactera sous peu.'], 201);
        }

        $don->update(['beneficiaire_id' => $user->id, 'statut' => 'en_livraison']);
        KareviaNotification::create(['user_id' => $user->id, 'type' => 'don',
            'message' => 'Votre demande a été approuvée ! La livraison est en cours. 📦', 'lien' => '/patient/dashboard']);

        return response()->json(['message' => 'Don assigné à votre demande.', 'don' => $don]);
    }

    // ONG/Admin : valider un don
    public function valider(Request $request, Don $don)
    {
        if (!in_array($request->user()->role, ['admin','ong']))
            return response()->json(['message' => 'Non autorisé.'], 403);

        $don->update(['statut' => 'valide', 'association_id' => $request->user()->id]);
        KareviaNotification::create(['user_id' => $don->donateur_id, 'type' => 'don',
            'message' => 'Votre don a été validé par une ONG partenaire ! Merci pour votre générosité. ❤️']);

        return response()->json(['message' => 'Don validé.', 'don' => $don]);
    }

    // Confirmer livraison
    public function confirmerLivraison(Request $request, Don $don)
    {
        $don->update(['statut' => 'distribue', 'date_livraison' => now()]);
        if ($don->beneficiaire_id) {
            KareviaNotification::create(['user_id' => $don->beneficiaire_id, 'type' => 'don',
                'message' => 'Votre colis a été livré ! Merci de confirmer la réception. ✅', 'lien' => '/patient/dashboard']);
        }
        return response()->json(['message' => 'Livraison confirmée.']);
    }

    // Dashboard ONG
    public function dashboardOng(Request $request)
    {
        if ($request->user()->role !== 'ong') return response()->json(['message' => 'Non autorisé.'], 403);
        $id = $request->user()->id;
        return response()->json([
            'stats' => [
                'total'         => Don::where('association_id', $id)->count(),
                'beneficiaires' => Don::where('association_id', $id)->whereNotNull('beneficiaire_id')->distinct('beneficiaire_id')->count(),
                'zones'         => Don::where('association_id', $id)->distinct('zone_livraison')->count('zone_livraison'),
            ],
            'dons' => Don::where('association_id', $id)->with('donateur:id,name')->orderByDesc('created_at')->get(),
        ]);
    }

    // Détail
    public function show(Don $don)
    {
        return response()->json($don->load(['donateur:id,name,avatar','association:id,name','beneficiaire:id,name']));
    }
}
