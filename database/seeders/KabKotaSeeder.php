<?php

// database/seeders/KabKotaSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\KabKota;

class KabKotaSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks and truncate table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        KabKota::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // CSV import
        $file = base_path('database/seeders/data/csv/kab_kota.csv');
        if (!file_exists($file)) {
            $this->command->error("File not found: {$file}");
            return;
        }

        $csv = fopen($file, 'r');
        // Skip header
        fgetcsv($csv);

        while (($row = fgetcsv($csv)) !== false) {
            // CSV columns: [id, kode_kab_kota, nama_kab_kota, provinsi_id]
            KabKota::create([
                'id'            => $row[0],
                'kode_kab_kota' => $row[1],
                'nama_kab_kota' => $row[2],
                'provinsi_id'   => $row[3],
            ]);
        }

        fclose($csv);
    }
}
