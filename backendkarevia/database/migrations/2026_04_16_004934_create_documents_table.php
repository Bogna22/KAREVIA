<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['carte_identite', 'justificatif_medical', 'justificatif_social', 'diplome', 'autre']);
            $table->string('nom_fichier');
            $table->string('chemin'); // path relatif storage
            $table->string('mime_type')->nullable();
            $table->bigInteger('taille')->nullable(); // bytes
            $table->enum('statut', ['en_attente', 'valide', 'refuse'])->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->foreignId('verifie_par')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verifie_le')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
