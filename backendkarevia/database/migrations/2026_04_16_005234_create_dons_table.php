<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donateur_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['nourriture', 'medicaments', 'transport', 'financier', 'autre']);
            $table->string('description');
            $table->decimal('quantite', 10, 2)->nullable();
            $table->string('unite')->nullable(); // kg, litres, comprimés...
            $table->decimal('valeur_estimee', 10, 2)->nullable();
            $table->string('zone_livraison')->nullable();
            $table->enum('statut', ['propose', 'valide', 'en_livraison', 'distribue', 'annule'])->default('propose');
            $table->foreignId('association_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('partenaire_livraison_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('beneficiaire_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('date_livraison')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dons');
    }
};
