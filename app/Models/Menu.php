<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'ingredients',
        'service_type',
        'fixed_price',
        'image_path',
        'video_path',
    ];

    protected $casts = [
        'fixed_price' => 'decimal:2',
    ];

    /**
     * Get service type display name
     */
    public function getServiceTypeDisplayAttribute(): string
    {
        return match($this->service_type) {
            'ATELIER' => 'The Atelier',
            'BOARDROOM' => 'The Boardroom',
            'GATHERING' => 'The Gathering',
            'RENDEZVOUS' => 'The Rendez-Vous',
            default => $this->service_type,
        };
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return '₦' . number_format($this->fixed_price, 2);
    }
}
