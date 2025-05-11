<?php

namespace App\Imports;

use App\Models\Sampel;
use App\Models\Segmen;
use App\Models\BlokSensus;
use App\Models\Sls;
use App\Models\Provinsi;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDesa;
use App\Models\Mitra;
use App\Models\Tim;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class SampelImport implements ToModel, WithHeadingRow
{
    protected array $warnings = [];

    public function model(array $row)
    {
        // Bersihkan data
        $row = array_map(fn($v) => trim((string)$v), $row);
        $identifier = $row['nks'] ?? 'row_no_nks';
        $errors = [];

        // 1. Validasi provinsi
        if (empty($row['prop']) || !Provinsi::where('kode_provinsi', $row['prop'])->exists()) {
            $errors[] = "Prov '{$row['prop']}' invalid";
        }
        // 2. Validasi kabupaten/kota
        $kabModel = KabKota::where('kode_kab_kota', $row['kab'] ?? null)
            ->where('provinsi_id', $row['prop'])
            ->first();
        if (! $kabModel) {
            $errors[] = "Kab '{$row['kab']}' invalid";
        }
        // 3. Validasi kecamatan
        $kecModel = null;
        if ($kabModel) {
            $kecModel = Kecamatan::where('kode_kecamatan', $row['kec'] ?? null)
                ->where('kab_kota_id', $kabModel->id)
                ->first();
        }
        if (! $kecModel) {
            $errors[] = "Kec '{$row['kec']}' invalid";
        }
        // 4. Validasi desa/kelurahan (opsional, jika diperlukan)
        if (!empty($row['kel_desa'])) {
            $desaOk = KelDesa::where('kode_kel_desa', $row['kel_desa'])
                ->where('kecamatan_id', $kecModel?->id)
                ->exists();
            if (! $desaOk) {
                $errors[] = "Desa '{$row['kel_desa']}' invalid";
            }
        }

        if ($errors) {
            $msg = "[SampelImport] {$identifier}: " . implode('; ', $errors);
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }

        // 5. Validasi segmen dan blok sensus
        $seg = Segmen::find($row['idsegmen']);
        $blok = BlokSensus::where('nomor_bs', $row['frame_ksa'])->first();
        if (! $seg || ! $blok) {
            $msg = "[SampelImport] {$identifier}: segmen or blok not found";
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }
        $sls = Sls::updateOrCreate(
            ['bs_id' => $blok->id_bs, 'nama_sls' => $row['namalok']],
            []
        );

        // 6. Create atau ambil PCL dan Tim
        $pcl = Mitra::firstOrCreate([
            'nama' => $row['nama_pcs'],
            'no_telepon' => $row['hp_pcs'],
        ]);
        $tim = Tim::firstOrCreate(
            ['nama_tim' => $row['nama_pms']],
            ['pml_id' => null]
        );

        // Build Sampel
        return new Sampel([
            'segmen_id'       => $seg->id_segmen,
            'id_sls'          => $sls->id,
            'jenis_sampel'    => $row['jenis_sampel'],
            'frame_ksa'       => $row['frame_ksa'],
            'provinsi_id'     => $row['prop'],
            'kab_kota_id'     => $row['kab'],
            'kecamatan_id'    => $row['kec'],
            'nama_lok'        => $row['namalok'],
            'subsegmen'       => $row['subsegmen'],
            'strata'          => $row['strata'],
            'bulan_listing'   => (int) $row['bulan'],
            'tahun_listing'   => (int) $row['tahun'],
            'fase_tanam'      => $row['fasetanam'],
            'pcl_id'          => $pcl->id,
            'tim_id'          => $tim->id,
            'a_random'        => $row['a_random'],
            'nks'             => $row['nks'],
            'rilis'           => $row['rilis'],
            'long'            => (float) str_replace(',', '.', $row['x']),
            'lat'             => (float) str_replace(',', '.', $row['y']),
            'subround'        => $row['subround'],
        ]);
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
