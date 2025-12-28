<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            // Elite status indicators
            $table->enum('elite_category', [
                'BUSINESS_LEADER',
                'INVESTOR',
                'ENTREPRENEUR', 
                'EXECUTIVE',
                'PROFESSIONAL',
                'INFLUENCER',
                'CELEBRITY',
                'OTHER'
            ])->after('company');
            
            $table->string('net_worth_range')->nullable()->after('elite_category');
            $table->string('annual_income_range')->nullable()->after('net_worth_range');
            $table->string('industry')->nullable()->after('annual_income_range');
            $table->string('position_title')->nullable()->after('industry');
            $table->text('achievements')->nullable()->after('position_title');
            $table->text('elite_credentials')->nullable()->after('achievements');
            $table->string('social_status')->nullable()->after('elite_credentials');
            $table->text('why_elite')->nullable()->after('social_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('membership_applications', function (Blueprint $table) {
            $table->dropColumn([
                'elite_category',
                'net_worth_range', 
                'annual_income_range',
                'industry',
                'position_title',
                'achievements',
                'elite_credentials',
                'social_status',
                'why_elite'
            ]);
        });
    }
};
