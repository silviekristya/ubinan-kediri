<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Segmen;

class SegmenSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Disable FK checks, truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Segmen::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $csvFile = fopen(base_path('database/seeders/data/csv/segmen.csv'), 'r');
        fgetcsv($csvFile); // skip header

        while (($row = fgetcsv($csvFile)) !== false) {
            // [id_segmen, kode_segmen, nama_segmen, kecamatan_id]
            Segmen::create([
                'id_segmen'    => $row[0],
                'kode_segmen'  => $row[1],
                'nama_segmen'  => $row[2],
                'kecamatan_id' => $row[3],
            ]);
        }

        fclose($csvFile);
    }
}
