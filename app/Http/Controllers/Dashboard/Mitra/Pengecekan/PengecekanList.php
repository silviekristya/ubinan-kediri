<?php
// app/Http/Controllers/Dashboard/Mitra/Pengecekan/PengecekanList.php

namespace App\Http\Controllers\Dashboard\Mitra\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Sampel;
use Inertia\Inertia;

class PengecekanList extends Controller
{
    /**
     * Tampilkan sampel utama:
     * – jika belum dicek atau status_sampel=Eligible → tampilkan sampel itu
     * – jika status_sampel=Non-eligible dan ada id_sampel_cadangan → ganti dengan sampel cadangan
     *
     * Juga tampilkan sampel cadangan yang belum dicek untuk opsi pengganti.
     */
    public function index()
    {
        $mitraId = Auth::user()->mitra->id;

        // ambil semua sampel utama milik Mitra
        $allUtama = Sampel::with('pengecekan')
            ->where('pcl_id', $mitraId)
            ->where('jenis_sampel', 'utama')
            ->get();

        $mainSamples = collect();

        foreach ($allUtama as $s) {
            $cek = $s->pengecekan;
            // jika sudah diverifikasi Non-eligible dan ada cadangan → pakai cadangan
            if ($cek
                && $cek->status_sampel === 'NonEligible'
                && $cek->id_sampel_cadangan
            ) {
                $cad = Sampel::with('pengecekan')
                    ->find($cek->id_sampel_cadangan);
                if ($cad) {
                    $mainSamples->push($cad);
                    continue;
                }
            }
            // selain itu, tampilkan sampel utama as‐is
            $mainSamples->push($s);
        }

        // ambil sampel cadangan yang belum dicek sama sekali
        $backupSamples = Sampel::where('pcl_id', $mitraId)
            ->where('jenis_sampel', 'cadangan')
            ->whereDoesntHave('pengecekan')
            ->get();

        return Inertia::render('Dashboard/Mitra/Pengecekan/ListPengecekan', [
            'mainSamples'   => $mainSamples->values(),
            'backupSamples' => $backupSamples,
        ]);
    }
}
