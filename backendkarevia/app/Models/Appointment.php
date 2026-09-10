<?php
// ============================================================
// app/Models/Appointment.php
// ============================================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'medecin_id',
        'date',
        'time',
        'type',         // online | présentiel
        'specialty',
        'zone',
        'reason',
        'status',       // pending | confirmed | cancelled | completed
        'email_confirm',
    ];

    protected $casts = ['date' => 'date'];

    public function patient()  { return $this->belongsTo(User::class, 'patient_id'); }
    public function medecin()  { return $this->belongsTo(User::class, 'medecin_id'); }
    public function consultation() { return $this->hasOne(Consultation::class); }
}
