<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'service_type',
        'menu',
        'price',
        'datetime',
        'address',
        'guest_count',
        'allergies',
        'status',
        'member_id',
        'chef_id',
        'selected_chefs',
    ];

    protected $casts = [
        'datetime' => 'datetime',
        'price' => 'decimal:2',
        'selected_chefs' => 'array',
    ];

    /**
     * Get the member who placed the order
     */
    public function member()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    /**
     * Get the chef assigned to the order
     */
    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    /**
     * Get selected chefs for this order
     */
    public function selectedChefs()
    {
        if (!$this->selected_chefs) {
            return collect();
        }
        return User::whereIn('id', $this->selected_chefs)->get();
    }

    /**
     * Get selected chef names
     */
    public function getSelectedChefNamesAttribute(): string
    {
        return $this->selectedChefs()->pluck('name')->join(', ');
    }

    /**
     * Check if order is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    /**
     * Check if order is assigned
     */
    public function isAssigned(): bool
    {
        return $this->status === 'ASSIGNED';
    }

    /**
     * Check if order is accepted
     */
    public function isAccepted(): bool
    {
        return $this->status === 'ACCEPTED';
    }

    /**
     * Check if order is en route
     */
    public function isEnRoute(): bool
    {
        return $this->status === 'EN_ROUTE';
    }

    /**
     * Check if order is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'COMPLETED';
    }

    /**
     * Check if order is cancelled
     */
    public function isCancelled(): bool
    {
        return $this->status === 'CANCELLED';
    }

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
     * Get status display name
     */
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'Pending',
            'ASSIGNED' => 'Assigned',
            'ACCEPTED' => 'Accepted',
            'EN_ROUTE' => 'En Route',
            'COMPLETED' => 'Completed',
            'CANCELLED' => 'Cancelled',
            default => $this->status,
        };
    }
}
