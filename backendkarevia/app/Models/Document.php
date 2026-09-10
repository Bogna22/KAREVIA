<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Document extends Model {
    protected $fillable = ['user_id','type','nom_fichier','chemin','mime_type','taille','statut','commentaire_admin','verifie_par','verifie_le'];
    protected $casts    = ['verifie_le'=>'datetime'];
    public function user()        { return $this->belongsTo(User::class); }
    public function verificateur(){ return $this->belongsTo(User::class, 'verifie_par'); }
    public function getUrlAttribute(): string { return Storage::url($this->chemin); }
}
