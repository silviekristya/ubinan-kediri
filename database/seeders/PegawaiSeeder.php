<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PegawaiSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Matikan dulu FK checks, truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Pegawai::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $file = base_path('database/seeders/data/csv/pegawai.csv');
        if (! file_exists($file)) {
            $this->command->error("File not found: {$file}");
            return;
        }

        if (($csv = fopen($file, 'r')) !== false) {
            // Baca header, hilangkan BOM jika ada
            $headers = fgetcsv($csv, 0, ',');
            if ($headers !== null && isset($headers[0])) {
                $headers[0] = preg_replace('/\xEF\xBB\xBF/', '', $headers[0]);
            }

            // Loop tiap baris data
            while (($row = fgetcsv($csv, 0, ',')) !== false) {
                // Skip baris kosong atau yang kolomnya kurang
                if (empty($row) || count($row) < 5) {
                    continue;
                }

                // Trim semua kolom
                $row = array_map('trim', $row);

                // Sekarang aman akses $row[0]..$row[4]
                Pegawai::create([
                    'user_id'    => $row[0],
                    'nama'       => $row[1],
                    'role'       => strtoupper($row[2]),  // ADMIN atau PEGAWAI
                    'is_pml'     => (int) $row[3],        // 0 atau 1
                    'no_telepon' => $row[4],
                ]);
            }

            fclose($csv);
        }
    }
}