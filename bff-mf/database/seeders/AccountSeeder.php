<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        
        if ($user) {
            Account::create([
                'user_id' => $user->id,
                'type' => 'epargne',
                'provider' => 'Banque Populaire',
                'account_number' => 'FR7630006000011234567890189',
                'balance' => 15000.00,
                'status' => 'active',
            ]);

            Account::create([
                'user_id' => $user->id,
                'type' => 'placement',
                'provider' => 'AXA Assurance',
                'account_number' => 'PL-2024-001',
                'balance' => 25000.00,
                'status' => 'active',
            ]);

            Account::create([
                'user_id' => $user->id,
                'type' => 'retraite',
                'provider' => 'AG2R La Mondiale',
                'account_number' => 'RET-2024-042',
                'balance' => 75000.00,
                'status' => 'active',
            ]);
        }
    }
}