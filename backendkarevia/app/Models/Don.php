<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Don extends Model {
    protected $fillable = ['donateur_id','type','description','quantite','unite','valeur_estimee','zone_livraison','statut','association_id','partenaire_livraison_id','beneficiaire_id','date_livraison','notes'];
    protected $casts    = ['date_livraison'=>'datetime'];
    public function donateur()           { return $this->belongsTo(User::class, 'donateur_id'); }
    public function association()        { return $this->belongsTo(User::class, 'association_id'); }
    public function partenaireLivraison(){ return $this->belongsTo(User::class, 'partenaire_livraison_id'); }
    public function beneficiaire()       { return $this->belongsTo(User::class, 'beneficiaire_id'); }
}
