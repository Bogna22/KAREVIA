<?php
namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\KareviaNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // Upload justificatif
    public function upload(Request $request)
    {
        $request->validate([
            'type'    => 'required|in:carte_identite,justificatif_medical,justificatif_social,diplome,autre',
            'fichier' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $user    = $request->user();
        $fichier = $request->file('fichier');
        $path    = $fichier->store("documents/{$user->id}", 'public');

        $doc = Document::create([
            'user_id'    => $user->id,
            'type'       => $request->type,
            'nom_fichier'=> $fichier->getClientOriginalName(),
            'chemin'     => $path,
            'mime_type'  => $fichier->getMimeType(),
            'taille'     => $fichier->getSize(),
            'statut'     => 'en_attente',
        ]);

        // Notifier les admins
        User::where('role','admin')->each(fn($admin) =>
            KareviaNotification::create(['user_id' => $admin->id, 'type' => 'verification',
                'message' => "{$user->name} a soumis des justificatifs pour vérification.", 'lien' => '/admin/dashboard'])
        );

        return response()->json(['message' => 'Document soumis. En attente de vérification.', 'document' => array_merge($doc->toArray(), ['url' => $doc->url])], 201);
    }

    // Mes documents
    public function index(Request $request)
    {
        $docs = Document::where('user_id', $request->user()->id)->orderByDesc('created_at')->get();
        return response()->json($docs->map(fn($d) => array_merge($d->toArray(), ['url' => $d->url])));
    }

    // Admin : valider ou refuser
    public function valider(Request $request, Document $document)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);

        $request->validate([
            'statut'            => 'required|in:valide,refuse',
            'commentaire_admin' => 'nullable|string|max:500',
        ]);

        $document->update([
            'statut'            => $request->statut,
            'commentaire_admin' => $request->commentaire_admin,
            'verifie_par'       => $request->user()->id,
            'verifie_le'        => now(),
        ]);

        $owner = $document->user;
        if ($request->statut === 'valide') {
            $tousValides = $owner->documents()->where('statut','!=','valide')->doesntExist();
            if ($tousValides) {
                $owner->update(['is_verified' => true, 'status' => 'active']);
                KareviaNotification::create(['user_id' => $owner->id, 'type' => 'verification',
                    'message' => '🎉 Votre compte a été vérifié ! Vous accédez maintenant aux services gratuits.', 'lien' => '/patient/dashboard']);
            }
        } else {
            KareviaNotification::create(['user_id' => $owner->id, 'type' => 'alert',
                'message' => 'Un document a été refusé. Veuillez soumettre un nouveau justificatif.', 'lien' => '/verification']);
        }

        return response()->json(['message' => 'Document '.$request->statut.'.', 'document' => $document]);
    }

    // Admin : documents en attente
    public function enAttente(Request $request)
    {
        if (!$request->user()->isAdmin()) return response()->json(['message' => 'Non autorisé.'], 403);
        $docs = Document::with('user:id,name,email,role')->where('statut','en_attente')->orderBy('created_at')->get();
        return response()->json($docs->map(fn($d) => array_merge($d->toArray(), ['url' => $d->url])));
    }

    // Supprimer un document
    public function destroy(Request $request, Document $document)
    {
        if ($request->user()->id !== $document->user_id && !$request->user()->isAdmin())
            return response()->json(['message' => 'Non autorisé.'], 403);

        Storage::disk('public')->delete($document->chemin);
        $document->delete();
        return response()->json(['message' => 'Document supprimé.']);
    }
}
