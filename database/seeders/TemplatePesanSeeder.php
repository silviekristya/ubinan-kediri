<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\TemplatePesan;
use SplFileObject;

class TemplatePesanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        TemplatePesan::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $path = base_path('database/seeders/data/csv/template_pesan.csv');
        if (!file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        // Buka via SplFileObject agar bisa baca record CSV dengan embedded newlines
        $file = new SplFileObject($path);
        $file->setFlags(
            SplFileObject::READ_CSV |
            SplFileObject::SKIP_EMPTY |
            SplFileObject::READ_AHEAD |
            SplFileObject::DROP_NEW_LINE
        );
        $file->setCsvControl(',', '"', '\\');

        // Loop
        $first = true;
        foreach ($file as $row) {
            // Lewati header
            if ($first) { $first = false; continue; }

            // Skip jika row kosong atau column kurang dari 3
            if (!is_array($row) || count($row) < 3) {
                continue;
            }

            TemplatePesan::create([
                'id'            => $row[0],
                'nama_template' => $row[1],
                'text'          => $row[2],
            ]);
        }
    }
}
