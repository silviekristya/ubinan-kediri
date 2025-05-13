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
        // 0. Bersihkan semua value jadi string tanpa spasi tepi
        $row = array_map(fn($v) => trim((string)$v), $row);
        $identifier = $row['nks'] ?? json_encode($row);
        $errors = [];

        //
        // 1. Mapping & validasi jenis_sampel
        //
        $code = strtoupper($row['jenis_sampel'] ?? '');
        if ($code === 'U') {
            $jenisSampel = 'Utama';
        } elseif ($code === 'C') {
            $jenisSampel = 'Cadangan';
        } else {
            $jenisSampel = $row['jenis_sampel'] ?? null;
        }
        if (! in_array($jenisSampel, ['Utama','Cadangan'], true)) {
            $errors[] = "Jenis sampel '{$row['jenis_sampel']}' invalid";
        }

        //
        // 2. Validasi jenis_tanaman & jenis_komoditas
        //
        $tanaman = $row['jenis_tanaman'] ?? null;
        if (! in_array($tanaman, ['Padi','Palawija'], true)) {
            $errors[] = "Jenis tanaman '{$tanaman}' invalid";
        }
        $komoditas = $row['jenis_komoditas'] ?? null;
        if ($komoditas !== null
            && ! in_array($komoditas, ['Padi','Jagung','Kedelai','Kacang Tanah','Ubi Kayu','Ubi Jalar','Lainnya'], true)
        ) {
            $errors[] = "Jenis komoditas '{$komoditas}' invalid";
        }

        //
        // 3. Validasi wilayah
        //
        $prov = Provinsi::where('kode_provinsi', $row['prop'] ?? null)->first();
        if (! $prov) {
            $errors[] = "Prov '{$row['prop']}' invalid";
        }
        $kab = KabKota::where('kode_kab_kota', $row['kab'] ?? null)
                      ->where('provinsi_id', $row['prop'])
                      ->first();
        if (! $kab) {
            $errors[] = "Kab '{$row['kab']}' invalid";
        }
        $kec = $kab
            ? Kecamatan::where('kode_kecamatan', $row['kec'] ?? null)
                       ->where('kab_kota_id', $kab->id)
                       ->first()
            : null;
        if (! $kec) {
            $errors[] = "Kec '{$row['kec']}' invalid";
        }

        //
        // 4. Validasi conditional berdasarkan jenis_tanaman
        //
        if ($tanaman === 'Padi') {
            if (empty($row['idsegmen']) || ! Segmen::where('id_segmen', $row['idsegmen'])->exists()) {
                $errors[] = "Segmen '{$row['idsegmen']}' invalid or missing for Padi";
            }
            if (empty($row['subsegmen'])) {
                $errors[] = "Subsegmen missing for Padi";
            }
            if (empty($row['strata'])) {
                $errors[] = "Strata missing for Padi";
            }
        } else { // Palawija
            if (empty($row['kel_desa']) || ! KelDesa::where('id', $row['kel_desa'])->exists()) {
                $errors[] = "KelDesa '{$row['kel_desa']}' invalid or missing for Palawija";
            }
            if (empty($row['id_sls']) || ! Sls::where('id', $row['id_sls'])->exists()) {
                $errors[] = "SLS ID '{$row['id_sls']}' invalid or missing for Palawija";
            }
            if (empty($row['nama_krt'])) {
                $errors[] = "Nama KRT missing for Palawija";
            }
            if (! isset($row['perkiraan_minggu_panen']) || ! is_numeric($row['perkiraan_minggu_panen'])) {
                $errors[] = "Perkiraan minggu panen '{$row['perkiraan_minggu_panen']}' invalid or missing for Palawija";
            }
        }

        //
        // 5. Validasi blok sensus (frame_ksa)
        //
        $blok = ! empty($row['frame_ksa'])
            ? BlokSensus::where('nomor_bs', $row['frame_ksa'])->first()
            : null;
        if (! $blok) {
            $errors[] = "Blok sensus '{$row['frame_ksa']}' invalid";
        }

        // kalau ada error, log dan abort
        if ($errors) {
            $msg = "[SampelImport] {$identifier}: " . implode('; ', $errors);
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }

        //
        // 6. Siapkan entitas SLS
        //
        if ($tanaman === 'Padi') {
            // untuk Padi: boleh create/update
            $sls = Sls::updateOrCreate(
                ['bs_id' => $blok->id_bs, 'nama_sls' => $row['namalok']],
                []
            );
            $slsId = $sls->id;
        } else {
            // untuk Palawija: ambil yang sudah ada
            $slsModel = Sls::find($row['id_sls']);
            $slsId = $slsModel->id;
        }

        //
        // 7. PCL & Tim (sama seperti sebelumnya)
        //
        $pcl = Mitra::firstOrCreate([
            'nama'        => $row['nama_pcs'] ?? null,
            'no_telepon'  => $row['hp_pcs']   ?? null,
        ]);
        $tim = Tim::firstOrCreate(
            ['nama_tim' => $row['nama_pms'] ?? null],
            ['pml_id'   => null]
        );

        //
        // 8. Bangun data Sampel
        //
        return new Sampel([
            'jenis_sampel'         => $jenisSampel,
            'jenis_tanaman'        => $tanaman,
            'jenis_komoditas'      => $komoditas,
            'frame_ksa'            => $row['frame_ksa'],
            'provinsi_id'          => $row['prop'],
            'kab_kota_id'          => $row['kab'],
            'kecamatan_id'         => $row['kec'],
            'kel_desa_id'          => $row['kel_desa']          ?? null,
            'nama_lok'             => $row['namalok']           ?? null,
            'segmen_id'            => $tanaman === 'Padi' ? $row['idsegmen'] : null,
            'subsegmen'            => $tanaman === 'Padi' ? $row['subsegmen'] : null,
            'strata'               => $tanaman === 'Padi' ? $row['strata']    : null,
            'id_sls'               => $slsId,
            'nama_krt'             => $tanaman === 'Palawija' ? $row['nama_krt'] : null,
            'perkiraan_minggu_panen'=> $tanaman === 'Palawija' ? (int)$row['perkiraan_minggu_panen'] : null,
            'bulan_listing'        => (int) ($row['bulan']  ?? 0),
            'tahun_listing'        => (int) ($row['tahun']  ?? 0),
            'fase_tanam'           => $row['fasetanam']         ?? null,
            'rilis'                => $row['rilis']             ?? null,
            'a_random'             => $row['a_random']          ?? null,
            'nks'                  => $row['nks']               ?? null,
            'long'                 => isset($row['x']) ? (float) str_replace(',', '.', $row['x']) : null,
            'lat'                  => isset($row['y']) ? (float) str_replace(',', '.', $row['y']) : null,
            'subround'             => $row['subround']          ?? null,
            'pcl_id'               => $pcl->id,
            'tim_id'               => $tim->id,
        ]);
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
