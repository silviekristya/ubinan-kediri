<?php

namespace App\Imports;

use App\Models\Sampel;
use App\Models\Segmen;
use App\Models\BlokSensus;
use App\Models\NamaSls;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Log;

class SampelImport implements ToModel, WithHeadingRow
{
    /**
     * Property to store skipped rows.
     */
    protected array $warnings = [];

    /**
     * Setiap baris Excel (kecuali header) masuk ke sini.
     * Pastikan header Excel berisi: id_segmen, nama_segmen, nomor_bs, nama_sls, dan kolom Sampel lainnya.
     */
    public function model(array $row)
    {
        // Lookup Segmen (by id or nama)
        $segmen = Segmen::where('id_segmen',    $row['id_segmen']    ?? null)
                        ->orWhere('nama_segmen', $row['nama_segmen'] ?? null)
                        ->first();

        // Lookup BlokSensus by nomor_bs (harus ada)
        $blok = BlokSensus::where('nomor_bs', $row['nomor_bs'] ?? null)->first();
        if (! $blok) {
            Log::warning("[SampelImport] Baris dengan nomor_bs “{$row['nomor_bs']}” tidak ditemukan, dilewati.");
            $this->warnings[] = $row['nomor_bs'];
            return null;  // skip baris ini
        }

        // Lookup atau buat NamaSls di BlokSensus tsb.
        //  menggunakan updateOrCreate agar jika nama sama tapi blok berubah, bisa di-update.
        $sls = NamaSls::updateOrCreate(
            [
                'nama_sls' => $row['nama_sls'],
                'id_bs'    => $blok->id,
            ],
            // jika ada kolom lain di nama_sls yang ingin di-set saat create, tambahkan di array ini
            []
        );

        // Buat instance Sampel dengan only foreign keys & kolom sampel
        return new Sampel([
            'segmen_id'             => $segmen?->id,
            'id_sls'                => $sls->id,
            'jenis_sampel'          => $row['jenis_sampel'],
            'jenis_tanaman'         => $row['jenis_tanaman'],
            'jenis_komoditas'       => $row['jenis_komoditas'],
            'frame_ksa'             => $row['frame_ksa'] ?? null,
            'prov'                  => $row['prov']      ?? null,
            'kab'                   => $row['kab']       ?? null,
            'kec'                   => $row['kec']       ?? null,
            'nama_prov'             => $row['nama_prov'] ?? null,
            'nama_kab'              => $row['nama_kab']  ?? null,
            'nama_kec'              => $row['nama_kec']  ?? null,
            'nama_lok'              => $row['nama_lok']  ?? null,
            'subsegmen'             => $row['subsegmen'] ?? null,
            'strata'                => $row['strata']    ?? null,
            'bulan_listing'         => $row['bulan_listing'] ?? null,
            'tahun_listing'         => $row['tahun_listing'] ?? null,
            'fase_tanam'            => $row['fase_tanam']    ?? null,
            'rilis'                 => $row['rilis']         ?? null,
            'a_random'              => $row['a_random']      ?? null,
            'nks'                   => $row['nks']           ?? null,
            'long'                  => $row['long']          ?? null,
            'lat'                   => $row['lat']           ?? null,
            'subround'              => $row['subround']      ?? null,
            'nama_krt'              => $row['nama_krt']      ?? null,
            'perkiraan_minggu_panen'=> $row['perkiraan_minggu_panen'] ?? null,
            // … tambahkan field lain sesuai schema Tabel Sampel …
        ]);
    }
    public function getWarnings(): array
    {
        return $this->warnings;
    }
}
