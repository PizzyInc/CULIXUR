<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('description');
            $table->string('video_path')->nullable()->after('image_path');
            $table->text('ingredients')->nullable()->after('video_path');
        });
    }

    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'video_path', 'ingredients']);
        });
    }
};
