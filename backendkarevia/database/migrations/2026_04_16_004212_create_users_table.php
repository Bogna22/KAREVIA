
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['patient','vulnerable','standard','medecin','ong','admin'])->default('standard');
            $table->enum('status', ['pending','active','rejected'])->default('active');
            $table->string('phone', 20)->nullable();
            $table->string('avatar')->nullable();
            $table->string('zone')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->text('bio')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }
    public function down(): void { Schema::dropIfExists('users'); }
};
