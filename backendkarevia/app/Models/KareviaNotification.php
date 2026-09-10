<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class KareviaNotification extends Model {
    protected $table    = 'karevia_notifications';
    protected $fillable = ['user_id','type','message','lien','lue','data'];
    protected $casts    = ['lue'=>'boolean','data'=>'array'];
    public function user() { return $this->belongsTo(User::class); }
}
