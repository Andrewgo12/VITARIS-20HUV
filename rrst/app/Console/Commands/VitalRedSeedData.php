<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class VitalRedSeedData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vital-red:seed {--fresh : Drop all data and reseed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed VITAL RED system with sample data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌱 Seeding VITAL RED System Data...');
        $this->newLine();

        if ($this->option('fresh')) {
            $this->warn('⚠️  This will delete all existing data!');
            if (!$this->confirm('Are you sure you want to continue?')) {
                $this->info('Operation cancelled.');
                return;
            }

            $this->line('🗑️  Clearing existing data...');
            User::truncate();
            $this->info('   ✅ Existing data cleared');
        }

        // Seed users
        $this->line('👥 Creating users...');
        $this->seedUsers();
        $this->info('   ✅ Users created');

        $this->newLine();
        $this->info('✅ VITAL RED system seeded successfully!');
        $this->newLine();

        // Show created users
        $this->showUsers();
    }

    private function seedUsers()
    {
        $users = [
            [
                'name' => 'Administrador Sistema',
                'email' => 'admin@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Médico Evaluador',
                'email' => 'medico@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'medico',
                'specialty' => 'Medicina Interna',
                'license_number' => 'MED-12345',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dra. María González',
                'email' => 'maria.gonzalez@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'medico',
                'specialty' => 'Cardiología',
                'license_number' => 'MED-12346',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Carlos Rodríguez',
                'email' => 'carlos.rodriguez@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'medico',
                'specialty' => 'Neurología',
                'license_number' => 'MED-12347',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dra. Ana Martínez',
                'email' => 'ana.martinez@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'medico',
                'specialty' => 'Pediatría',
                'license_number' => 'MED-12348',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dr. Luis Hernández',
                'email' => 'luis.hernandez@hospital.com',
                'password' => Hash::make('password'),
                'role' => 'medico',
                'specialty' => 'Ginecología',
                'license_number' => 'MED-12349',
                'email_verified_at' => now(),
            ]
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }

    private function showUsers()
    {
        $this->line('👥 Created Users:');
        $this->newLine();

        $users = User::all();

        $headers = ['Name', 'Email', 'Role', 'Specialty'];
        $rows = [];

        foreach ($users as $user) {
            $rows[] = [
                $user->name,
                $user->email,
                ucfirst($user->role),
                $user->specialty ?? 'N/A'
            ];
        }

        $this->table($headers, $rows);

        $this->newLine();
        $this->info('🔑 Default password for all users: password');
        $this->newLine();
        $this->line('🌐 Access URLs:');
        $this->line('   - Login: http://127.0.0.1:8000/login');
        $this->line('   - Admin Dashboard: http://127.0.0.1:8000/admin/dashboard');
        $this->line('   - Medico Dashboard: http://127.0.0.1:8000/medico/dashboard');
    }
}
