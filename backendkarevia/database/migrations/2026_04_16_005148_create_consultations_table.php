<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rendez_vous_id')->constrained('rendez_vous')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->text('notes_medecin')->nullable();
            $table->text('diagnostic')->nullable();
            $table->text('prescriptions')->nullable(); // ordonnances en texte
            $table->text('recommandations')->nullable();
            $table->boolean('ordonnance_validee')->default(false);
            $table->boolean('aide_alimentaire_demandee')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
