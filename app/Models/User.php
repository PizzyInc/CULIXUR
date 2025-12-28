<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'role',
        'member_id',
        'qr_code',
        'membership_tier',
        'referral_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('ADMIN');
    }

    /**
     * Check if user is chef
     */
    public function isChef(): bool
    {
        return $this->hasRole('CHEF');
    }

    /**
     * Check if user is member
     */
    public function isMember(): bool
    {
        return $this->hasRole('MEMBER');
    }

    /**
     * Get orders as member
     */
    public function memberOrders()
    {
        return $this->hasMany(Order::class, 'member_id');
    }

    /**
     * Get orders as chef
     */
    public function chefOrders()
    {
        return $this->hasMany(Order::class, 'chef_id');
    }

    /**
     * Get chef profile
     */
    public function chefProfile()
    {
        return $this->hasOne(ChefProfile::class);
    }

    /**
     * Check if user is an Elite member
     */
    public function isElite(): bool
    {
        return $this->membership_tier === 'ELITE_MONTHLY' || $this->membership_tier === '6_MONTH' || $this->membership_tier === '12_MONTH';
    }

    /**
     * Generate QR code for member
     */
    public function generateQrCode(): string
    {
        if ($this->isMember() && !$this->qr_code) {
            $this->qr_code = 'CULIXUR_' . $this->id . '_' . time();
            $this->save();
        }
        return $this->qr_code;
    }
}
