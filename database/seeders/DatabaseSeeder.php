<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user with admin role
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
        
        // Create a root user
        User::factory()->create([
            'name' => 'Root User',
            'email' => 'root@example.com',
            'password' => bcrypt('password'),
            'role' => 'root',
        ]);
        
        // Create a student user for testing
        $studentUser = User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@example.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);
        
        // Create student profile for the student user
        \App\Models\Student::create([
            'code' => 'STU-' . rand(10000, 99999),
            'user_id' => $studentUser->id,
        ]);
    }
}