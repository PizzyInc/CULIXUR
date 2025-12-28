<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // The Atelier Menus
        Menu::create([
            'name' => 'The Atelier - Premium Tasting Menu',
            'description' => 'An exquisite 8-course tasting menu featuring the finest ingredients and culinary techniques. Perfect for special celebrations and intimate dining experiences.',
            'service_type' => 'ATELIER',
            'fixed_price' => 1500000.00,
        ]);

        Menu::create([
            'name' => 'The Atelier - Chef\'s Signature',
            'description' => 'A 6-course signature menu showcasing the chef\'s most celebrated dishes with wine pairings.',
            'service_type' => 'ATELIER',
            'fixed_price' => 1800000.00,
        ]);

        // The Boardroom Menus
        Menu::create([
            'name' => 'The Boardroom - Executive Lunch',
            'description' => 'A sophisticated 4-course business lunch menu designed for executive meetings and corporate dining.',
            'service_type' => 'BOARDROOM',
            'fixed_price' => 1000000.00,
        ]);

        Menu::create([
            'name' => 'The Boardroom - Executive Dinner',
            'description' => 'An elegant 5-course dinner menu perfect for closing deals and entertaining clients.',
            'service_type' => 'BOARDROOM',
            'fixed_price' => 1500000.00,
        ]);

        // The Gathering Menus
        Menu::create([
            'name' => 'The Gathering - Family Feast',
            'description' => 'A hearty 3-course family-style menu perfect for gatherings of 6-12 people.',
            'service_type' => 'GATHERING',
            'fixed_price' => 400000.00,
        ]);

        Menu::create([
            'name' => 'The Gathering - Celebration Menu',
            'description' => 'A festive 4-course menu with appetizers, mains, and desserts for special occasions.',
            'service_type' => 'GATHERING',
            'fixed_price' => 750000.00,
        ]);

        // The Rendez-Vous Menus
        Menu::create([
            'name' => 'The Rendez-Vous - Romantic Dinner',
            'description' => 'An intimate 3-course romantic dinner for two with candlelight ambiance.',
            'service_type' => 'RENDEZVOUS',
            'fixed_price' => 400000.00,
        ]);

        Menu::create([
            'name' => 'The Rendez-Vous - Anniversary Special',
            'description' => 'A luxurious 5-course anniversary menu with champagne service and special touches.',
            'service_type' => 'RENDEZVOUS',
            'fixed_price' => 750000.00,
        ]);
    }
}
