<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Administrador Sistema',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Medico user
        User::create([
            'name' => 'Dr. Médico Evaluador',
            'email' => 'medico@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medico',
            'specialty' => 'Medicina Interna',
            'license_number' => 'MED-12345',
            'email_verified_at' => now(),
        ]);

        // Additional medico users
        User::create([
            'name' => 'Dra. María González',
            'email' => 'maria.gonzalez@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medico',
            'specialty' => 'Cardiología',
            'license_number' => 'MED-12346',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Dr. Carlos Rodríguez',
            'email' => 'carlos.rodriguez@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medico',
            'specialty' => 'Neurología',
            'license_number' => 'MED-12347',
            'email_verified_at' => now(),
        ]);
    }
}
