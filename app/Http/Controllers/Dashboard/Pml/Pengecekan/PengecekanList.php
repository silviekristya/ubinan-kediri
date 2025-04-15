<?php

namespace App\Http\Controllers\Dashboard\Pml\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Sampel;
use Inertia\Inertia;

class PengecekanList extends Controller
{
    /**
     * Tampilkan semua sampel PML ini, 
     * baik yang belum dicek maupun yang sudah dicek tapi status_sampel masih null.
     */
    public function index()
{
    $pmlId = Auth::user()->pegawai->id;

    // Basis query: semua sampel milik PML ini
    $baseQuery = Sampel::with('pengecekan')
        ->where('tim_id', $pmlId);

    // 1. Sampel Utama (jenis_sampel = 'utama', belum dicek atau status null)
    $samplesUtama = (clone $baseQuery)
        ->where('jenis_sampel', 'utama')
        ->where(function($q) {
            $q->whereDoesntHave('pengecekan')
              ->orWhereHas('pengecekan', fn($q2) => $q2->whereNull('status_sampel'));
        })
        ->get();

    // 2. Sampel Cadangan (jenis_sampel = 'cadangan', belum dicek atau status null)
    $samplesCadangan = (clone $baseQuery)
        ->where('jenis_sampel', 'cadangan')
        ->where(function($q) {
            $q->whereDoesntHave('pengecekan')
              ->orWhereHas('pengecekan', fn($q2) => $q2->whereNull('status_sampel'));
        })
        ->get();

    // 3. Sampel Terverifikasi (sudah ada pengecekan dan status_sampel ≠ null)
    $samplesVerified = (clone $baseQuery)
        ->whereHas('pengecekan', fn($q) => $q->whereNotNull('status_sampel'))
        ->get();

    // Opsi cadangan hanya perlu di-attach ke sampel utama, jika masih dipakai
    $samplesUtama->each(function($s) {
        $s->cadanganOptions = Sampel::where('pcl_id', $s->pcl_id)
            ->where('jenis_sampel', 'cadangan')
            ->get(['id', 'jenis_tanaman', 'nama_lok'])
            ->map(fn($c) => [
                'id'    => $c->id,
                'label' => "{$c->jenis_tanaman} — {$c->nama_lok}",
            ]);
    });

    return Inertia::render('Dashboard/Pml/Pengecekan/ListPengecekan', [
        'samplesUtama'    => $samplesUtama,
        'samplesCadangan' => $samplesCadangan,
        'samplesVerified' => $samplesVerified,
    ]);
}
}
