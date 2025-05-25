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
        $this->call(UserSeeder::class);
        $this->call(PegawaiSeeder::class);
        $this->call(ProvinsiSeeder::class);
        $this->call(KabKotaSeeder::class);
        $this->call(KecamatanSeeder::class);
        $this->call(KelDesaSeeder::class);
        $this->call(SegmenSeeder::class);
        $this->call(BlokSensusSeeder::class);
        $this->call(SlsSeeder::class);
        $this->call(TemplatePesanSeeder::class);
        $this->call(TemplateNotifikasiSeeder::class);
        $this->call(MitraSeeder::class);
        $this->call(TimSeeder::class);
    }
}
