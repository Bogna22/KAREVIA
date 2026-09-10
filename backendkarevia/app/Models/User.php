<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = ['name','email','password','role','status','phone','avatar','zone','is_verified','bio'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['email_verified_at'=>'datetime','password'=>'hashed','is_verified'=>'boolean'];

    public function medecin()            { return $this->hasOne(Medecin::class); }
    public function patient()            { return $this->hasOne(Patient::class); }
    public function documents()          { return $this->hasMany(Document::class); }
    public function kareviaNotifications(){ return $this->hasMany(KareviaNotification::class); }
    public function paiements()          { return $this->hasMany(Paiement::class); }
    public function rendezVousPatient()  { return $this->hasMany(RendezVous::class, 'patient_id'); }
    public function rendezVousMedecin()  { return $this->hasMany(RendezVous::class, 'medecin_id'); }
    public function dons()               { return $this->hasMany(Don::class, 'donateur_id'); }

    public function isAdmin(): bool     { return $this->role === 'admin'; }
    public function isMedecin(): bool   { return $this->role === 'medecin'; }
    public function isVulnerable(): bool{ return $this->role === 'vulnerable'; }
    public function isOng(): bool       { return $this->role === 'ong'; }

    public function getAvatarUrlAttribute(): string {
        return $this->avatar
            ? asset('storage/'.$this->avatar)
            : 'https://ui-avatars.com/api/?name='.urlencode($this->name).'&background=3a86ff&color=fff';
    }
}
