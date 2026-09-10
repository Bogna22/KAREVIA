<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medecins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('specialite');
            $table->string('numero_ordre')->nullable()->unique(); // numéro d'ordre médical
            $table->string('diplome')->nullable();
            $table->text('presentation')->nullable();
            $table->decimal('tarif_solidaire', 8, 2)->default(0); // tarif bénévole
            $table->json('disponibilites')->nullable(); // ex: {"lundi": ["09:00","10:00"], ...}
            $table->enum('statut_validation', ['en_attente', 'valide', 'refuse'])->default('en_attente');
            $table->integer('consultations_benevoles')->default(0);
            $table->boolean('teleconsultation_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medecins');
    }
};
