<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RendezVous extends Model {
    use SoftDeletes;
    protected $table    = 'rendez_vous';
    protected $fillable = ['patient_id','medecin_id','date_heure','duree_minutes','type','statut','motif','lien_video','tarif','est_gratuit','notes_patient'];
    protected $casts    = ['date_heure'=>'datetime','est_gratuit'=>'boolean'];
    public function patient()     { return $this->belongsTo(User::class, 'patient_id'); }
    public function medecin()     { return $this->belongsTo(User::class, 'medecin_id'); }
    public function consultation(){ return $this->hasOne(Consultation::class); }
}
