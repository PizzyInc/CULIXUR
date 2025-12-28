<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // First, we change the enum to include the new types if needed, 
        // or just allow string/null if we want more flexibility.
        // For simplicity, we'll keep it as enum but expand it.
        Schema::table('users', function (Blueprint $table) {
            $table->string('membership_tier')->default('CULIXUR_MEMBER')->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('membership_tier', ['12_MONTH', '6_MONTH'])->nullable()->change();
        });
    }
};
