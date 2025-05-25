<?php

namespace Database\Seeders;

use App\Models\Mitra;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MitraSeeder extends Seeder
{
    public function run(): void
    {
        // Matikan foreign key checks dan kosongkan tabel
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Mitra::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $file = base_path('database/seeders/data/csv/mitra.csv');
        if (! file_exists($file)) {
            $this->command->error("File not found: {$file}");
            return;
        }

        if (($csv = fopen($file, 'r')) !== false) {
            // Ambil header, hilangkan BOM
            $headers = fgetcsv($csv, 0, ',');
            if ($headers !== null && isset($headers[0])) {
                $headers[0] = preg_replace('/\xEF\xBB\xBF/', '', $headers[0]);
            }

            while (($row = fgetcsv($csv, 0, ',')) !== false) {
                if (empty($row) || count($row) < 4) continue;

                // Sesuaikan urutan dengan file CSV
                $user_id     = trim($row[0]);
                $nama        = trim($row[1]);
                $no_telepon  = trim($row[2]);
                $alamat      = trim($row[3]);
                $tim_id      = isset($row[4]) && $row[4] !== '' ? $row[4] : null;

                Mitra::create([
                    'user_id'     => $user_id,
                    'nama'        => $nama,
                    'no_telepon'  => $no_telepon,
                    'alamat'      => $alamat,
                    'tim_id'      => $tim_id,
                ]);
            }

            fclose($csv);
        }
    }
}
