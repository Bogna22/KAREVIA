<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model {
    protected $fillable = ['user_id','stripe_session_id','montant','devise','plan','statut','methode_paiement','metadata'];
    protected $casts    = ['metadata'=>'array'];
    public function user() { return $this->belongsTo(User::class); }
}
