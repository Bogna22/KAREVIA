<?php
namespace App\Http\Controllers;

use App\Models\KareviaNotification;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaiementController extends Controller
{
    private const PLANS = [
        'solidarity' => ['label' => 'Contribution solidaire', 'montant' => 500],  // centimes
        'premium'    => ['label' => 'Accès Premium',          'montant' => 1500],
        'patron'     => ['label' => 'Grand mécène',           'montant' => 5000],
    ];

    // Créer une session Stripe Checkout
    public function createIntent(Request $request)
    {
        $request->validate(['plan' => 'required|in:solidarity,premium,patron']);

        $user    = $request->user();
        $plan    = $request->plan;
        $planData = self::PLANS[$plan];

        // Enregistrement en attente
        $paiement = Paiement::create([
            'user_id' => $user->id,
            'montant' => $planData['montant'] / 100,
            'devise'  => 'EUR',
            'plan'    => $plan,
            'statut'  => 'pending',
        ]);

        // Stripe (nécessite STRIPE_SECRET_KEY dans .env)
        if (config('services.stripe.secret')) {
            try {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                $session = \Stripe\Checkout\Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [[
                        'price_data' => [
                            'currency'     => 'eur',
                            'unit_amount'  => $planData['montant'],
                            'product_data' => ['name' => 'KAREVIA – '.$planData['label']],
                        ],
                        'quantity' => 1,
                    ]],
                    'mode'        => 'payment',
                    'success_url' => config('app.frontend_url').'/patient/dashboard?payment=success',
                    'cancel_url'  => config('app.frontend_url').'/paiement?payment=cancel',
                    'metadata'    => ['paiement_id' => $paiement->id, 'user_id' => $user->id, 'plan' => $plan],
                ]);

                $paiement->update(['stripe_session_id' => $session->id]);
                return response()->json(['url' => $session->url, 'session_id' => $session->id]);
            } catch (\Exception $e) {
                Log::error('Stripe error: '.$e->getMessage());
                // Fallback mode démo
                $paiement->update(['statut' => 'succeeded']);
                $this->onSuccess($user, $plan, $paiement);
                return response()->json(['message' => 'Paiement simulé (mode démo).', 'success' => true]);
            }
        }

        // Mode démo (sans Stripe)
        $paiement->update(['statut' => 'succeeded']);
        $this->onSuccess($user, $plan, $paiement);
        return response()->json(['message' => 'Paiement simulé (mode démo).', 'success' => true]);
    }

    // Webhook Stripe
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig     = $request->header('Stripe-Signature');
        $secret  = config('services.stripe.webhook_secret');

        try {
            if ($secret) {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                $event = \Stripe\Webhook::constructEvent($payload, $sig, $secret);
            } else {
                $event = json_decode($payload, true);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Webhook invalide.'], 400);
        }

        $type = is_array($event) ? ($event['type'] ?? '') : $event->type;

        if ($type === 'checkout.session.completed') {
            $session  = is_array($event) ? $event['data']['object'] : $event->data->object;
            $meta     = is_array($session) ? $session['metadata'] : $session->metadata;
            $paiement = Paiement::find($meta['paiement_id'] ?? null);
            if ($paiement) {
                $paiement->update(['statut' => 'succeeded']);
                $user = $paiement->user;
                if ($user) $this->onSuccess($user, $paiement->plan, $paiement);
            }
        }

        return response()->json(['received' => true]);
    }

    // Historique paiements
    public function index(Request $request)
    {
        $paiements = Paiement::where('user_id', $request->user()->id)->orderByDesc('created_at')->get();
        return response()->json($paiements);
    }

    // Logique post-paiement
    private function onSuccess($user, string $plan, Paiement $paiement): void
    {
        if ($plan === 'premium') {
            $user->patient?->update(['niveau_acces' => 'premium']);
        }
        KareviaNotification::create([
            'user_id' => $user->id, 'type' => 'paiement',
            'message' => "Merci pour votre contribution ! Paiement de {$paiement->montant} € reçu. 💙",
            'lien'    => '/patient/dashboard',
        ]);
    }
}
