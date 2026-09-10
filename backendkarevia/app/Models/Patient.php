<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model {
    protected $fillable = ['user_id','date_naissance','sexe','adresse','ville','pays','groupe_sanguin','antecedents_medicaux','allergies','contact_urgence','niveau_acces'];
    protected $casts    = ['date_naissance'=>'date'];
    public function user() { return $this->belongsTo(User::class); }
}
