<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\TemplateNotifikasi;
use SplFileObject;

class TemplateNotifikasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Matikan FK, truncate, hidupkan FK
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        TemplateNotifikasi::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $path = base_path('database/seeders/data/csv/template_notifikasi.csv');
        if (!file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        $file = new SplFileObject($path);
        $file->setFlags(
            SplFileObject::READ_CSV |
            SplFileObject::SKIP_EMPTY |
            SplFileObject::READ_AHEAD |
            SplFileObject::DROP_NEW_LINE
        );
        $file->setCsvControl(',', '"', '\\');

        $first = true;
        foreach ($file as $row) {
            // Lewati header
            if ($first) { $first = false; continue; }
            if (!is_array($row) || count($row) < 3) {
                continue;
            }

            TemplateNotifikasi::create([
                'tipe_notifikasi'   => $row[0],
                'template_pesan_id' => $row[1],
                'jenis'             => $row[2],
            ]);
        }
    }
}
