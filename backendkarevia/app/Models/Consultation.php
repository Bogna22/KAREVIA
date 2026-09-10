<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model {
    protected $fillable = ['rendez_vous_id','medecin_id','patient_id','notes_medecin','diagnostic','prescriptions','recommandations','ordonnance_validee','aide_alimentaire_demandee'];
    protected $casts    = ['ordonnance_validee'=>'boolean','aide_alimentaire_demandee'=>'boolean'];
    public function rendezVous(){ return $this->belongsTo(RendezVous::class); }
    public function medecin()  { return $this->belongsTo(User::class, 'medecin_id'); }
    public function patient()  { return $this->belongsTo(User::class, 'patient_id'); }
}
