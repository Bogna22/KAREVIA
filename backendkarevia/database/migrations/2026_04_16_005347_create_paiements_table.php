<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('stripe_payment_intent_id')->nullable()->unique();
            $table->string('stripe_session_id')->nullable()->unique();
            $table->decimal('montant', 10, 2);
            $table->string('devise', 3)->default('EUR');
            $table->enum('plan', ['solidarity', 'premium', 'patron']);
            $table->enum('statut', ['pending', 'succeeded', 'failed', 'refunded'])->default('pending');
            $table->string('methode_paiement')->nullable(); // card, sepa...
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
