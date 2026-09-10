<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['M', 'F', 'autre'])->nullable();
            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('pays')->default('Burkina Faso');
            $table->string('groupe_sanguin', 5)->nullable();
            $table->text('antecedents_medicaux')->nullable();
            $table->text('allergies')->nullable();
            $table->string('contact_urgence')->nullable(); // nom + téléphone
            $table->enum('niveau_acces', ['gratuit', 'solidaire', 'premium'])->default('solidaire');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
