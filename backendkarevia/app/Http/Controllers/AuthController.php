<?php
namespace App\Http\Controllers;

use App\Models\KareviaNotification;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // ── Inscription ──────────────────────────────────────────────────────────
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => ['required','confirmed', Password::min(8)],
            'role'      => 'required|in:patient,vulnerable,standard,medecin,ong',
            'phone'     => 'nullable|string|max:20',
            'zone'      => 'nullable|string|max:100',
            'specialite'=> 'nullable|string|max:100',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $status = in_array($request->role, ['vulnerable','medecin']) ? 'pending' : 'active';

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'status'   => $status,
            'phone'    => $request->phone,
            'zone'     => $request->zone,
        ]);

        // Profil spécifique au rôle
        if ($request->role === 'medecin') {
            Medecin::create(['user_id' => $user->id, 'specialite' => $request->specialite ?? 'Généraliste']);
        } elseif (in_array($request->role, ['patient','vulnerable','standard'])) {
            Patient::create(['user_id' => $user->id, 'niveau_acces' => $request->role === 'vulnerable' ? 'gratuit' : 'solidaire']);
        }

        KareviaNotification::create([
            'user_id' => $user->id, 'type' => 'info',
            'message' => 'Bienvenue sur Karevia ! Votre compte a bien été créé.',
        ]);

        $token = $user->createToken('karevia-token')->plainTextToken;
        return response()->json(['message' => 'Compte créé avec succès.', 'token' => $token, 'user' => $this->fmt($user)], 201);
    }

    // ── Connexion ────────────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $v = Validator::make($request->all(), ['email' => 'required|email', 'password' => 'required']);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password))
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        if ($user->status === 'rejected')
            return response()->json(['message' => 'Compte désactivé. Contactez le support.'], 403);

        $user->tokens()->delete();
        $token = $user->createToken('karevia-token')->plainTextToken;
        return response()->json(['message' => 'Connexion réussie.', 'token' => $token, 'user' => $this->fmt($user->load(['medecin','patient']))]);
    }

    // ── Déconnexion ──────────────────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ── Profil courant ───────────────────────────────────────────────────────
    public function me(Request $request)
    {
        return response()->json($this->fmt($request->user()->load(['medecin','patient'])));
    }

    // ── Modifier profil ──────────────────────────────────────────────────────
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $v = Validator::make($request->all(), [
            'name'  => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'zone'  => 'nullable|string|max:100',
            'bio'   => 'nullable|string|max:1000',
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
        $user->update($request->only(['name','phone','zone','bio']));

        // Médecin : mise à jour du profil médical
        if ($user->isMedecin() && $request->has('specialite')) {
            $user->medecin?->update($request->only(['specialite','presentation','tarif_solidaire','teleconsultation_active','disponibilites']));
        }
        // Patient : mise à jour infos médicales
        if ($user->isVulnerable() || $user->role === 'patient') {
            $user->patient?->update($request->only(['date_naissance','sexe','adresse','ville','groupe_sanguin','antecedents_medicaux','allergies','contact_urgence']));
        }
        return response()->json(['message' => 'Profil mis à jour.', 'user' => $this->fmt($user->fresh()->load(['medecin','patient']))]);
    }

    // ── Changer mot de passe ─────────────────────────────────────────────────
    public function changePassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'current_password' => 'required',
            'password'         => ['required','confirmed', Password::min(8)],
        ]);
        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password))
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 400);
        $user->update(['password' => Hash::make($request->password)]);
        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    // ── Upload avatar ────────────────────────────────────────────────────────
    public function uploadAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048']);
        $user = $request->user();
        if ($user->avatar) Storage::disk('public')->delete($user->avatar);
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);
        return response()->json(['message' => 'Avatar mis à jour.', 'avatar_url' => $user->avatar_url]);
    }

    // ── Formatter réponse ────────────────────────────────────────────────────
    private function fmt(User $u): array {
        return [
            'id'          => $u->id,
            'name'        => $u->name,
            'email'       => $u->email,
            'role'        => $u->role,
            'status'      => $u->status,
            'is_verified' => $u->is_verified,
            'phone'       => $u->phone,
            'zone'        => $u->zone,
            'bio'         => $u->bio,
            'avatar_url'  => $u->avatar_url,
            'medecin'     => $u->medecin,
            'patient'     => $u->patient,
            'created_at'  => $u->created_at,
        ];
    }
}
