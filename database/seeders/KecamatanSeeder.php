<?php

// database/seeders/KecamatanSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Kecamatan;

class KecamatanSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Disable foreign key checks for safe truncation
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Kecamatan::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $csvFile = fopen(base_path('database/seeders/data/csv/kecamatan.csv'), 'r');
        // Skip header row
        fgetcsv($csvFile);

        while (($row = fgetcsv($csvFile)) !== false) {
            // Each row: [id, kode_kecamatan, nama_kecamatan, kab_kota_id]
            Kecamatan::create([
                'id'             => $row[0],
                'kode_kecamatan' => $row[1],
                'nama_kecamatan' => $row[2],
                'kab_kota_id'    => $row[3],
            ]);
        }

        fclose($csvFile);
    }
}