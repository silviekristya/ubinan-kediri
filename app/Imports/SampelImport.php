<?php

namespace App\Imports;

use App\Models\Sls;
use App\Models\Tim;
use App\Models\Mitra;
use App\Models\Sampel;
use App\Models\Segmen;
use App\Models\KabKota;
use App\Models\KelDesa;
use App\Models\Pegawai;
use App\Models\Provinsi;
use App\Models\Kecamatan;
use App\Models\BlokSensus;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SampelImport implements ToModel, WithHeadingRow
{
    protected array $warnings = [];

    public function model(array $row)
    {
        // 0. Bersihkan data
        $row = array_map(fn($v) => trim((string)$v), $row);
        $identifier = $row['nks'] ?? json_encode($row);
        $errors = [];

        // 1. Konversi dan validasi bulan
        $rawBulan = $row['bulan'] ?? '';
        $monthMap = [
            'Januari'   => 1,
            'Februari'  => 2,
            'Maret'     => 3,
            'April'     => 4,
            'Mei'       => 5,
            'Juni'      => 6,
            'Juli'      => 7,
            'Agustus'   => 8,
            'September' => 9,
            'Oktober'   => 10,
            'November'  => 11,
            'Desember'  => 12,
        ];
        $bulanKey = ucfirst(strtolower($rawBulan));
        if (isset($monthMap[$bulanKey])) {
            $bulanListing = $monthMap[$bulanKey];
        } elseif (is_numeric($rawBulan)) {
            $bulanListing = (int) $rawBulan;
        } else {
            $errors[] = "Bulan '{$rawBulan}' invalid";
            $bulanListing = null;
        }

        // 2. Mapping & validasi jenis_sampel
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

        // 3. Mapping & validasi jenis_tanaman
        $tanamanRaw = strtoupper($row['jenis_tanaman'] ?? '');
        if ($tanamanRaw === 'PADI') {
            $tanaman = 'Padi';
        } elseif ($tanamanRaw === 'PALAWIJA') {
            $tanaman = 'Palawija';
        } else {
            $tanaman = null;
        }
        if (! in_array($tanaman, ['Padi','Palawija'], true)) {
            $errors[] = "Jenis tanaman '{$row['jenis_tanaman']}' invalid";
        }

        // 4. Validasi jenis_komoditas
        $komoditas = $row['jenis_komoditas'] ?? null;
        if ($komoditas !== null
            && ! in_array($komoditas, ['Padi','Jagung','Kedelai','Kacang Tanah','Ubi Kayu','Ubi Jalar','Lainnya'], true)
        ) {
            $errors[] = "Jenis komoditas '{$komoditas}' invalid";
        }

        // 5. Validasi wilayah
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

        // 6. Validasi conditional berdasarkan jenis_tanaman
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
        } elseif ($tanaman === 'Palawija') {
            $desa = KelDesa::where('nama_kel_desa', $row['desa_kel'] ?? null)
                ->where('kecamatan_id', $kec->id)
                ->first();
            if (! $desa) {
                $errors[] = "Desa/Kel '{$row['desa_kel']}' invalid or missing for Palawija";
            }

            $blok = BlokSensus::where('nomor_bs', $row['nbs'] ?? null)->first();
            if (! $blok) {
                $errors[] = "NBS '{$row['nbs']}' invalid or missing for Palawija";
            }

            $weekNum = null;
            foreach (range(1, 5) as $i) {
                if (isset($row["m$i"]) && strtoupper($row["m$i"]) === 'V') {
                    $weekNum = $i;
                    break;
                }
            }
            if (! $weekNum) {
                $errors[] = "Perkiraan minggu panen (M1–M5) missing or invalid for Palawija";
            }

            if (empty($row['nama_krt'])) {
                $errors[] = "Nama KRT missing for Palawija";
            }
        }

        // 8. Siapkan entitas SLS
        if ($tanaman === 'Padi') {
            // $sls = Sls::updateOrCreate([
            //     'bs_id'    => $blok->id_bs,
            //     'nama_sls' => $row['namalok']
            // ], []);
            // $slsId = $sls->id;
            $slsId = null;
        } else {
            $sls = Sls::firstOrCreate([
                'bs_id'    => $blok->id_bs,
                'nama_sls' => $row['nama_krt'],
            ]);
            $slsId = $sls->id;
        }

        if ($errors) {
            $msg = "[SampelImport] {$identifier}: " . implode('; ', $errors);
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null;
        }
        // 10. Bangun data Sampel
        return new Sampel([
            'jenis_sampel'           => $jenisSampel,
            'jenis_tanaman'          => $tanaman,
            'jenis_komoditas'        => $komoditas,
            'frame_ksa'              => $row['nbs'] ?? $row['frame_ksa'],
            'provinsi_id'            => $prov->kode_provinsi,   // tetap 2-digit kode
            'kab_kota_id'            => $kab->id,               // pakai ID model
            'kecamatan_id'           => $kec->id,               // pakai ID model
            'kel_desa_id'            => $desa->id ?? null,
            'nama_lok'               => $row['namalok'] ?? null,
            'segmen_id'              => $tanaman === 'Padi' ? $row['idsegmen'] : null,
            'subsegmen'              => $tanaman === 'Padi' ? $row['subsegmen'] : null,
            'strata'                 => $tanaman === 'Padi' ? $row['strata']    : null,
            'id_sls'                 => $slsId,
            'nama_krt'               => $tanaman === 'Palawija' ? $row['nama_krt'] : null,
            'perkiraan_minggu_panen' => $tanaman === 'Palawija' ? $weekNum : null,
            'bulan_listing'          => $bulanListing,
            'tahun_listing'          => (int)($row['tahun'] ?? 0),
            'fase_tanam'             => $row['fasetanam'] ?? null,
            'rilis'                  => $row['rilis'] ?? null,
            'a_random'               => $row['a_random'] ?? null,
            'nks'                    => $row['nks'] ?? null,
            'long'                   => isset($row['x']) ? (float) str_replace(',', '.', $row['x']) : null,
            'lat'                    => isset($row['y']) ? (float) str_replace(',', '.', $row['y']) : null,
            'subround'               => $row['subround'] ?? null,
        ]);
    }

    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
