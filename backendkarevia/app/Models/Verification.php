<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'carte_id_path',        // chemin Cloudinary
        'justificatif_path',    // chemin Cloudinary
        'status',               // pending | approved | rejected
        'reviewed_by',          // admin user_id
        'reviewed_at',
        'rejection_reason',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function user()     { return $this->belongsTo(User::class); }
    public function reviewer() { return $this->belongsTo(User::class, 'reviewed_by'); }
}
