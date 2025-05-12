<?php

// database/seeders/ProvinsiSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Provinsi;

class ProvinsiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks and truncate table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Provinsi::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $file = base_path('database/seeders/data/csv/provinsi.csv');
        if (!file_exists($file)) {
            $this->command->error("File not found: {$file}");
            return;
        }

        $csv = fopen($file, 'r');
        // Skip header
        fgetcsv($csv);

        while (($row = fgetcsv($csv)) !== false) {
            // CSV columns: [kode_provinsi, nama_provinsi]
            Provinsi::create([
                'kode_provinsi' => $row[0],
                'nama_provinsi' => $row[1],
            ]);
        }

        fclose($csv);
    }
}