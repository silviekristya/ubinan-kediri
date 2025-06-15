<?php

namespace App\Imports;

use App\Models\Segmen;
use App\Models\Kecamatan;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SegmenImport implements ToModel, WithHeadingRow
{
    protected array $warnings = [];

    public function model(array $row)
    {
        // Bersihkan data
        $row = array_map(fn($v) => trim((string)$v), $row);
        $identifier = $row['idsegmen'] ?? $row['kode_segmen'] ?? $row['nama_segmen'] ?? json_encode($row);
        $errors = [];

        // 1. Validasi wajib
        if (empty($row['idsegmen'])) {
            $errors[] = "Kolom idsegmen wajib diisi";
        }
        if (empty($row['kode_segmen'])) {
            $errors[] = "Kolom kode_segmen wajib diisi";
        }
        if (empty($row['nama_segmen'])) {
            $errors[] = "Kolom nama_segmen wajib diisi";
        }
        if (empty($row['kecamatan_id'])) {
            $errors[] = "Kolom kecamatan_id wajib diisi";
        }

        // 2. Validasi foreign key kecamatan
        $kecamatan = null;
        if (!empty($row['kecamatan_id'])) {
            $kecamatan = Kecamatan::find($row['kecamatan_id']);
            if (!$kecamatan) {
                $errors[] = "Kecamatan dengan id '{$row['kecamatan_id']}' tidak ditemukan";
            }
        }

        // Jika error, warning dan return null
        if ($errors) {
            $msg = "[SegmenImport] {$identifier}: " . implode('; ', $errors);
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }

        if (Segmen::where('id_segmen', $row['idsegmen'])->exists()) {
            $msg = "[SegmenImport] {$identifier}: Segmen dengan id '{$row['idsegmen']}' sudah ada.";
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }
        // 3. Build Segmen baru
        return new Segmen([
            'id_segmen'     => $row['idsegmen'],
            'kode_segmen'   => $row['kode_segmen'],
            'nama_segmen'   => $row['nama_segmen'],
            'kecamatan_id'  => $row['kecamatan_id'],
        ]);
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
