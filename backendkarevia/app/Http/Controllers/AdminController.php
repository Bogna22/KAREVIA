<?php
namespace App\Http\Controllers;

use App\Models\Don;
use App\Models\Document;
use App\Models\KareviaNotification;
use App\Models\Paiement;
use App\Models\RendezVous;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Stats globales
    public function stats(Request $request)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        return response()->json([
            'stats' => [
                'users'        => User::count(),
                'pendingVerif' => Document::where('statut','en_attente')->count(),
                'appointments' => RendezVous::count(),
                'donations'    => Don::where('statut','valide')->count(),
            ],
            'recent_users' => User::with('medecin')->latest()->take(10)->get()->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'status'     => $u->status,
                'is_verified'=> $u->is_verified,
                'created_at' => $u->created_at,
            ]),
        ]);
    }

    // Liste complète des users (avec filtres)
    public function users(Request $request)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        $users = User::with('medecin')
            ->when($request->role,   fn($q,$r) => $q->where('role',$r))
            ->when($request->status, fn($q,$s) => $q->where('status',$s))
            ->when($request->search, fn($q,$s) => $q->where(fn($q2) => $q2->where('name','like',"%$s%")->orWhere('email','like',"%$s%")))
            ->latest()->paginate(20);

        return response()->json($users);
    }

    // Activer/désactiver un user
    public function toggleUser(Request $request, User $user)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        $request->validate(['status' => 'required|in:active,pending,rejected']);
        $user->update(['status' => $request->status]);

        KareviaNotification::create(['user_id' => $user->id, 'type' => 'info',
            'message' => 'Le statut de votre compte a été mis à jour par un administrateur.']);

        return response()->json(['message' => 'Statut mis à jour.', 'user' => $user]);
    }

    // Vérifier manuellement un user
    public function verifierUser(Request $request, User $user)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        $user->update(['is_verified' => true, 'status' => 'active']);
        KareviaNotification::create(['user_id' => $user->id, 'type' => 'verification',
            'message' => '🎉 Votre compte a été vérifié manuellement par un administrateur !', 'lien' => '/patient/dashboard']);

        return response()->json(['message' => 'Utilisateur vérifié.']);
    }

    // Paiements
    public function paiements(Request $request)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        return response()->json(Paiement::with('user:id,name,email')->orderByDesc('created_at')->paginate(20));
    }
    public function deleteUser(User $user)
{
    $user->delete();
    return response()->json(['message' => 'Utilisateur supprimé.']);
}
}
