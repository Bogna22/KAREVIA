<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Laravel a sa propre table notifications mais on crée une custom
        Schema::create('karevia_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['rdv', 'don', 'info', 'alert', 'verification', 'paiement', 'prescription']);
            $table->string('message');
            $table->string('lien')->nullable(); // URL de redirection
            $table->boolean('lue')->default(false);
            $table->json('data')->nullable(); // données supplémentaires
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('karevia_notifications');
    }
};
