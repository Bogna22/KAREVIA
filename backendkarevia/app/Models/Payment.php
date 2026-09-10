<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan',             // solidarity | premium | patron
        'amount',           // en centimes
        'currency',
        'stripe_session_id',
        'stripe_payment_intent',
        'status',           // pending | paid | failed | refunded
        'paid_at',
    ];

    protected $casts = ['paid_at' => 'datetime'];

    public function user() { return $this->belongsTo(User::class); }
}
