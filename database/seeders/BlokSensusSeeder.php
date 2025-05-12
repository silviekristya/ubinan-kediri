<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\BlokSensus;

class BlokSensusSeeder extends Seeder
{
    public function run(): void
    {
        // Disable FK checks, truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        BlokSensus::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $csvFile = fopen(base_path('database/seeders/data/csv/blok_sensus.csv'), 'r');
        fgetcsv($csvFile); // skip header

        while (($row = fgetcsv($csvFile)) !== false) {
            // [id_bs, nomor_bs, kel_desa_id]
            BlokSensus::create([
                'id_bs'        => $row[0],
                'nomor_bs'     => $row[1],
                'kel_desa_id'  => $row[2],
            ]);
        }

        fclose($csvFile);
    }
}
