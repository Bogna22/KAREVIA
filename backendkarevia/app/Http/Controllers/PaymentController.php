<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\KareviaNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class PaymentController extends Controller
{
    private const PLANS = [
        'solidarity' => ['label' => 'Contribution solidaire', 'price' => 500,  'currency' => 'eur'],
        'premium'    => ['label' => 'Accès Premium',          'price' => 1500, 'currency' => 'eur'],
        'patron'     => ['label' => 'Grand mécène',           'price' => 5000, 'currency' => 'eur'],
    ];

    // =====================================================================
    // CREATE STRIPE CHECKOUT SESSION
    // =====================================================================
    public function createIntent(Request $request): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:solidarity,premium,patron',
        ]);

        $user = auth('api')->user();
        $plan = self::PLANS[$request->plan];

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            $session = StripeSession::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency'     => $plan['currency'],
                        'product_data' => ['name' => 'KAREVIA — ' . $plan['label']],
                        'unit_amount'  => $plan['price'],
                    ],
                    'quantity' => 1,
                ]],
                'mode'        => 'payment',
                'success_url' => env('FRONTEND_URL') . '/patient/dashboard?payment=success',
                'cancel_url'  => env('FRONTEND_URL') . '/paiement?payment=cancelled',
                'metadata'    => [
                    'user_id' => $user->id,
                    'plan'    => $request->plan,
                ],
            ]);

            // Créer un enregistrement payment en "pending"
            Payment::create([
                'user_id'            => $user->id,
                'plan'               => $request->plan,
                'amount'             => $plan['price'],
                'currency'           => $plan['currency'],
                'stripe_session_id'  => $session->id,
                'status'             => 'pending',
            ]);

            return response()->json(['url' => $session->url]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur Stripe : ' . $e->getMessage()], 500);
        }
    }

    // =====================================================================
    // HISTORIQUE DES PAIEMENTS
    // =====================================================================
    public function history(): JsonResponse
    {
        $payments = auth('api')->user()
            ->payments()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }

    // =====================================================================
    // WEBHOOK STRIPE — appelé par Stripe après paiement
    // =====================================================================
    public function webhook(Request $request): \Illuminate\Http\Response
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response('Signature invalide.', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $userId  = $session->metadata->user_id;
            $plan    = $session->metadata->plan;

            // Mettre à jour le paiement
            $payment = Payment::where('stripe_session_id', $session->id)->first();
            if ($payment) {
                $payment->update([
                    'status'                => 'paid',
                    'stripe_payment_intent' => $session->payment_intent,
                    'paid_at'               => now(),
                ]);
            }

            // Notifier l'utilisateur
            KareviaNotification::send(
                (int) $userId,
                'don',
                "Votre paiement pour le plan « {$plan} » a bien été reçu. Merci !",
                ['plan' => $plan]
            );
        }

        return response('OK', 200);
    }
}
