<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChefProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialty',
        'phone_number',
        'bio',
        'experience_years',
        'image',
    ];

    /**
     * Get the user that owns the chef profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
