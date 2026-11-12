<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with default Admin and Viewer accounts.
     */
    public function run(): void
    {
        // 1. Admin Account (Full access)
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // 2. Viewer Account (Read-only access)
        User::updateOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Standard Viewer',
                'password' => Hash::make('password123'),
                'role' => 'viewer',
            ]
        );
    }
}
