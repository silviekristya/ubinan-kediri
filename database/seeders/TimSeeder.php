<?php

namespace Database\Seeders;

use App\Models\Tim;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Matikan foreign key checks dan kosongkan tabel
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Tim::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $file = base_path('database/seeders/data/csv/tim.csv');
        if (! file_exists($file)) {
            $this->command->error("File not found: {$file}");
            return;
        }

        if (($csv = fopen($file, 'r')) !== false) {
            $headers = fgetcsv($csv, 0, ',');
            if ($headers !== null && isset($headers[0])) {
                $headers[0] = preg_replace('/\xEF\xBB\xBF/', '', $headers[0]);
            }

            while (($row = fgetcsv($csv, 0, ',')) !== false) {
                if (empty($row) || count($row) < 1) continue;
                $row = array_map('trim', $row);

                Tim::create([
                    'nama_tim' => $row[0],
                    'pml_id'   => $row[1] === '' ? null : $row[1],
                ]);
            }

            fclose($csv);
        }
    }
}
