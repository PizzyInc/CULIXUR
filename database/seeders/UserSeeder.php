<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ChefProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@culixur.com',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
            'email_verified_at' => now(),
        ]);

        // Create Chef Users
        $chef1 = User::create([
            'name' => 'Chef Emmanuel',
            'email' => 'chef1@culixur.com',
            'password' => Hash::make('password123'),
            'role' => 'CHEF',
            'email_verified_at' => now(),
        ]);

        ChefProfile::create([
            'user_id' => $chef1->id,
            'specialty' => 'French Cuisine',
            'phone_number' => '+234 801 234 5678',
        ]);

        $chef2 = User::create([
            'name' => 'Chef Sarah',
            'email' => 'chef2@culixur.com',
            'password' => Hash::make('password123'),
            'role' => 'CHEF',
            'email_verified_at' => now(),
        ]);

        ChefProfile::create([
            'user_id' => $chef2->id,
            'specialty' => 'Italian Cuisine',
            'phone_number' => '+234 802 345 6789',
        ]);

        // Create Member Users
        $member1 = User::create([
            'name' => 'John Doe',
            'email' => 'member1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'MEMBER',
            'member_id' => 'MEM001',
            'qr_code' => 'CULIXUR_' . time() . '_001',
            'email_verified_at' => now(),
        ]);

        $member2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'member2@example.com',
            'password' => Hash::make('password123'),
            'role' => 'MEMBER',
            'member_id' => 'MEM002',
            'qr_code' => 'CULIXUR_' . time() . '_002',
            'email_verified_at' => now(),
        ]);

        $member3 = User::create([
            'name' => 'Michael Johnson',
            'email' => 'member3@example.com',
            'password' => Hash::make('password123'),
            'role' => 'MEMBER',
            'member_id' => 'MEM003',
            'qr_code' => 'CULIXUR_' . time() . '_003',
            'email_verified_at' => now(),
        ]);
    }
}
