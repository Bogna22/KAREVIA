<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('date_heure');
            $table->integer('duree_minutes')->default(30);
            $table->enum('type', ['presentiel', 'teleconsultation'])->default('teleconsultation');
            $table->enum('statut', ['en_attente', 'confirme', 'annule', 'termine', 'absent'])->default('en_attente');
            $table->text('motif')->nullable();
            $table->string('lien_video')->nullable(); // pour téléconsultation
            $table->decimal('tarif', 8, 2)->default(0);
            $table->boolean('est_gratuit')->default(false); // patient vulnérable vérifié
            $table->text('notes_patient')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
