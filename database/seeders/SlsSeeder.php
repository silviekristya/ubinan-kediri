<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Sls;

class SlsSeeder extends Seeder
{
    public function run(): void
    {
        // Disable FK checks, truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Sls::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $csvFile = fopen(base_path('database/seeders/data/csv/sls.csv'), 'r');
        fgetcsv($csvFile); // skip header

        while (($row = fgetcsv($csvFile)) !== false) {
            // [id, bs_id, nama_sls]
            Sls::create([
                'id'      => $row[0],
                'bs_id'   => $row[1],
                'nama_sls'=> $row[2],
            ]);
        }

        fclose($csvFile);
    }
}
