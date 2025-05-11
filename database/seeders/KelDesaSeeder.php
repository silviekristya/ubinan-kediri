<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\KelDesa;

class KelDesaSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Disable FK checks, truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        KelDesa::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $csvFile = fopen(base_path('database/seeders/data/csv/kel_desa.csv'), 'r');
        fgetcsv($csvFile);

        while (($row = fgetcsv($csvFile)) !== false) {
            // Each row: [id, kode_kel_desa, nama_kel_desa, kecamatan_id]
            KelDesa::create([
                'id'            => $row[0],
                'kode_kel_desa' => $row[1],
                'nama_kel_desa' => $row[2],
                'kecamatan_id'  => $row[3],
            ]);
        }

        fclose($csvFile);
    }
}
