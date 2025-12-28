<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChefAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'chef_id',
        'date',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    /**
     * Get the chef that owns the availability
     */
    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    /**
     * Check if chef is available
     */
    public function isAvailable(): bool
    {
        return $this->status === 'AVAILABLE';
    }

    /**
     * Check if chef is booked
     */
    public function isBooked(): bool
    {
        return $this->status === 'BOOKED';
    }

    /**
     * Check if chef is unavailable
     */
    public function isUnavailable(): bool
    {
        return $this->status === 'UNAVAILABLE';
    }

    /**
     * Get status display name
     */
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'AVAILABLE' => 'Available',
            'BOOKED' => 'Booked',
            'UNAVAILABLE' => 'Unavailable',
            default => $this->status,
        };
    }
}
