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
    /**
     * Property to store skipped rows and warnings.
     */
    protected array $warnings = [];

    /**
     * Process each row from Excel.
     */
    public function model(array $row)
    {
        // Trim dan cast ke string untuk keamanan
        $row = array_map(fn($v) => trim((string)$v), $row);

        // 1. Validasi provinsi
        if (empty($row['provinsi_id']) || !Provinsi::where('kode_provinsi', $row['provinsi_id'])->exists()) {
            Log::warning("[SampelImport] Provinsi '{$row['provinsi_id']}' tidak valid. Baris dilewati.");
            $this->warnings[] = "Prov:{$row['provinsi_id']}";
            return null;
        }

        // 2. Validasi kabupaten/kota
        if (empty($row['kab_kota_id']) || !KabKota::where('id', $row['kab_kota_id'])->where('provinsi_id', $row['provinsi_id'])->exists()) {
            Log::warning("[SampelImport] Kab/Kota '{$row['kab_kota_id']}' tidak valid untuk Provinsi '{$row['provinsi_id']}'. Baris dilewati.");
            $this->warnings[] = "Kab:{$row['kab_kota_id']}";
            return null;
        }

        // 3. Validasi kecamatan
        if (empty($row['kecamatan_id']) || !Kecamatan::where('id', $row['kecamatan_id'])->where('kab_kota_id', $row['kab_kota_id'])->exists()) {
            Log::warning("[SampelImport] Kecamatan '{$row['kecamatan_id']}' tidak valid untuk Kab/Kota '{$row['kab_kota_id']}'. Baris dilewati.");
            $this->warnings[] = "Kec:{$row['kecamatan_id']}";
            return null;
        }

        // 4. Validasi desa/kelurahan
        if (empty($row['kel_desa_id']) || !KelDesa::where('id', $row['kel_desa_id'])->where('kecamatan_id', $row['kecamatan_id'])->exists()) {
            Log::warning("[SampelImport] Desa/Kelurahan '{$row['kel_desa_id']}' tidak valid untuk Kecamatan '{$row['kecamatan_id']}'. Baris dilewati.");
            $this->warnings[] = "Desa:{$row['kel_desa_id']}";
            return null;
        }

        // 5. Validasi segmen
        $segmen = Segmen::where('id_segmen', $row['id_segmen'] ?? null)
                        ->orWhere('nama_segmen', $row['nama_segmen'] ?? null)
                        ->first();
        if (! $segmen) {
            Log::warning("[SampelImport] Segmen '{$row['id_segmen']}' tidak ditemukan. Baris dilewati.");
            $this->warnings[] = "Seg:{$row['id_segmen']}";
            return null;
        }

        // 6. Validasi blok sensus
        $blok = BlokSensus::where('nomor_bs', $row['nomor_bs'] ?? null)->first();
        if (! $blok) {
            Log::warning("[SampelImport] Blok Sensus '{$row['nomor_bs']}' tidak ditemukan. Baris dilewati.");
            $this->warnings[] = "BS:{$row['nomor_bs']}";
            return null;
        }

        // 7. Create atau update SLS
        $sls = Sls::updateOrCreate(
            ['bs_id' => $blok->id_bs, 'nama_sls' => $row['nama_sls']],
            []
        );

        // 8. Validasi PCL jika ada
        if (!empty($row['pcl_id']) && !Mitra::where('id', $row['pcl_id'])->exists()) {
            Log::warning("[SampelImport] Mitra '{$row['pcl_id']}' tidak ditemukan. Baris dilewati.");
            $this->warnings[] = "PCL:{$row['pcl_id']}";
            return null;
        }

        // 9. Validasi Tim jika ada
        if (!empty($row['tim_id']) && !Tim::where('id', $row['tim_id'])->exists()) {
            Log::warning("[SampelImport] Tim '{$row['tim_id']}' tidak ditemukan. Baris dilewati.");
            $this->warnings[] = "Tim:{$row['tim_id']}";
            return null;
        }

        // 10. Semua validasi lulus, buat Sampel
        return new Sampel([
            'segmen_id'             => $segmen->id_segmen,
            'id_sls'                => $sls->id,
            'jenis_sampel'          => $row['jenis_sampel'],
            'jenis_tanaman'         => $row['jenis_tanaman'],
            'jenis_komoditas'       => $row['jenis_komoditas'] ?? null,
            'frame_ksa'             => $row['frame_ksa'] ?? null,
            'provinsi_id'           => $row['provinsi_id'],
            'kab_kota_id'           => $row['kab_kota_id'],
            'kecamatan_id'          => $row['kecamatan_id'],
            'kel_desa_id'           => $row['kel_desa_id'],
            'nama_lok'              => $row['nama_lok']      ?? null,
            'subsegmen'             => $row['subsegmen']     ?? null,
            'strata'                => $row['strata']        ?? null,
            'bulan_listing'         => $row['bulan_listing'],
            'tahun_listing'         => $row['tahun_listing'],
            'fase_tanam'            => $row['fase_tanam']    ?? null,
            'rilis'                 => $row['rilis'],
            'a_random'              => $row['a_random'],
            'nks'                   => $row['nks'],
            'long'                  => $row['long'],
            'lat'                   => $row['lat'],
            'subround'              => $row['subround'],
            'pcl_id'                => $row['pcl_id'] ?? null,
            'tim_id'                => $row['tim_id'] ?? null,
            'nama_krt'              => $row['nama_krt'] ?? null,
            'perkiraan_minggu_panen'=> $row['perkiraan_minggu_panen'] ?? null,
        ]);
    }

    /**
     * Ambil peringatan yang terjadi selama import
     */
    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
