<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'company',
        'elite_category',
        'net_worth_range',
        'industry',
        'position_title',
        'achievements',
        'social_status',
        'why_elite',
        'membership_tier',
        'referral_code',
        'message',
        'status',
        'user_id',
    ];

    /**
     * Get the user associated with this application
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get membership tier display name
     */
    public function getMembershipTierDisplayAttribute(): string
    {
        return match($this->membership_tier) {
            '12_MONTH' => '12-Month Elite ($25,000)',
            '6_MONTH' => '6-Month Elite ($12,500)',
            default => $this->membership_tier,
        };
    }

    /**
     * Get status display name
     */
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'PENDING' => 'Pending Review',
            'APPROVED' => 'Approved',
            'REJECTED' => 'Rejected',
            default => $this->status,
        };
    }

    /**
     * Get elite category display name
     */
    public function getEliteCategoryDisplayAttribute(): string
    {
        return match($this->elite_category) {
            'BUSINESS_LEADER' => 'Business Leader',
            'INVESTOR' => 'Investor',
            'ENTREPRENEUR' => 'Entrepreneur',
            'EXECUTIVE' => 'Executive',
            'PROFESSIONAL' => 'Professional',
            'INFLUENCER' => 'Influencer',
            'CELEBRITY' => 'Celebrity',
            'OTHER' => 'Other',
            default => $this->elite_category,
        };
    }
}
