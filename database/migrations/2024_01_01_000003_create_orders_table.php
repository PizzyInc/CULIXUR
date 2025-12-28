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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->enum('service_type', ['ATELIER', 'BOARDROOM', 'GATHERING', 'RENDEZVOUS']);
            $table->text('menu');
            $table->decimal('price', 10, 2);
            $table->dateTime('datetime');
            $table->text('address');
            $table->integer('guest_count');
            $table->text('allergies')->nullable();
            $table->enum('status', ['PENDING', 'ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'COMPLETED', 'CANCELLED'])->default('PENDING');
            $table->foreignId('member_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('chef_id')->nullable()->constrained('users')->onDelete('set null');
            $table->json('selected_chefs')->nullable(); // Array of chef IDs selected by member
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
