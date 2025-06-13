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
        $komoditasRaw = strtoupper($row['jenis_komoditas'] ?? '');
        $komoditasMap = [
            'PADI'         => 'Padi',
            'JAGUNG'       => 'Jagung',
            'KEDELAI'      => 'Kedelai',
            'KACANG TANAH' => 'Kacang Tanah',
            'UBI KAYU'     => 'Ubi Kayu',
            'UBI JALAR'    => 'Ubi Jalar',
            'LAINNYA'      => 'Lainnya',
        ];
        $komoditas = $komoditasMap[$komoditasRaw] ?? null;
        if (! $komoditas) {
            $errors[] = "Jenis komoditas '{$row['jenis_komoditas']}' invalid";
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

        // Inisialisasi untuk conditional Palawija
        $desa = null;
        $blok = null;
        $weekNum = null;

        // 6. Validasi conditional berdasarkan jenis_tanaman
        if ($tanaman === 'Padi') {
            // Segmen, subsegmen, strata
            if (empty($row['idsegmen']) || ! Segmen::where('id_segmen', $row['idsegmen'])->exists()) {
                $errors[] = "Segmen '{$row['idsegmen']}' invalid or missing for Padi";
            }
            if (empty($row['subsegmen'])) {
                $errors[] = "Subsegmen missing for Padi";
            }
            if (empty($row['strata'])) {
                $errors[] = "Strata missing for Padi";
            }
            // Padi tidak boleh punya NBS
            if (! empty($row['nbs'])) {
                $errors[] = "NBS tidak boleh diisi untuk Padi";
            }
        }
        elseif ($tanaman === 'Palawija') {
            // Desa / Kelurahan
            $desa = KelDesa::where('nama_kel_desa', $row['desa_kel'] ?? null)
                ->where('kecamatan_id', $kec->id)
                ->first();
            if (! $desa) {
                $errors[] = "Desa/Kel '{$row['desa_kel']}' invalid or missing for Palawija";
            }
            // Blok Sensus
            // $blok = BlokSensus::where('nomor_bs', $row['nbs'] ?? null)->first();
            $blok = BlokSensus::where('kel_desa_id', $desa->id)
                ->where('nomor_bs', $row['nbs'] ?? null)
                ->first();
            if (!$blok) {
                $errors[] = "NBS '{$row['nbs']}' invalid or missing for Palawija";
            }

            // minggu panen: cek kolom "1","2","3","4","5"
            $weekNum = is_numeric($row['perkiraan_minggu_panen'])
                ? (int) $row['perkiraan_minggu_panen']
                : null;

            if (! $weekNum || $weekNum < 1 || $weekNum > 5) {
                $errors[] = "Perkiraan minggu panen '{$row['perkiraan_minggu_panen']}' invalid for Palawija";
            }
            // Nama KRT
            if (empty($row['nama_krt'])) {
                $errors[] = "Nama KRT missing for Palawija";
            }
        }

        // 8. Siapkan entitas SLS
        $slsId = null;
        if ($tanaman !== 'Padi') {
            if ($blok) {
                $namaSLS = $row['nama_sls'] ?? null;
                $sls = Sls::where('nama_sls', $namaSLS)
                    ->whereHas('blokSensus', function ($query) use ($blok) {
                        $query->where('id_bs', $blok->id_bs);
                    })
                    ->first();
                if ($sls) {
                    $slsId = $sls->id;
                } else {
                    $errors[] = "SLS '{$namaSLS}' invalid or missing untuk blok sensus '{$row['nbs']}'";
                }
            } else {
                $errors[] = "Blok sensus untuk Palawija tidak ditemukan. Tidak dapat mencari SLS.";
            }
        }

        if ($errors) {
            $msg = "[SampelImport] {$identifier}: " . implode('; ', $errors);
            Log::warning($msg);
            $this->warnings[] = $msg;
            return null; // Penting! Jangan lempar exception, biar lanjut baris berikutnya
        }


        $namaDesa  = $row['desa_kel'] ?? $row['nmdesa'] ?? null;
        $namaLokasi = $tanaman === 'Padi'
            ? ($row['namalok'] ?? null)
            : $namaDesa;

        // (opsional) validasi namaLokasi
        if (! $namaLokasi) {
            $errors[] = "Nama lokasi (namalok/desa_kel) missing for {$tanaman}";
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
            // 'nama_lok'               => $row['namalok'] ?? null,
            'nama_lok'               => $namaLokasi,
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
