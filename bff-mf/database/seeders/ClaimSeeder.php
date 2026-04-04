<?php

namespace Database\Seeders;

use App\Models\Claim;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClaimSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        
        if ($user) {
            Claim::create([
                'user_id' => $user->id,
                'type' => 'voiture',
                'status' => 'nouveau',
                'description' => 'Accident de circulation',
                'incident_date' => '2024-01-15',
                'estimated_amount' => 5000.00,
            ]);

            Claim::create([
                'user_id' => $user->id,
                'type' => 'habitation',
                'status' => 'en_cours',
                'description' => 'Dégât des eaux',
                'incident_date' => '2024-02-10',
                'estimated_amount' => 2500.00,
                'notes' => 'En attente d\'expert',
            ]);
        }
    }
}