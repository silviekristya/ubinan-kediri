<?php
namespace App\Http\Controllers\Dashboard\Pml\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Sampel;
use App\Models\Pengecekan;
use Inertia\Inertia;

class PengecekanList extends Controller
{
    public function index()
    {
        $pmlId = Auth::user()->pegawai->id;

        // Kumpulkan semua id_sampel_cadangan yang sudah dipakai (NonEligible)
        $usedCadIds = Pengecekan::query()
            ->whereNotNull('id_sampel_cadangan')
            ->pluck('id_sampel_cadangan')
            ->toArray();

        // Filter "belum dicek"
        $unChecked = function($q) {
            $q->doesntHave('pengecekan')
              ->orWhereHas('pengecekan', fn($q2) => $q2->whereNull('status_sampel'));
        };

        // Sampel Utama asli (jenis_sampel = 'utama' & belum dicek)
        $utama = Sampel::with('pengecekan')
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where('jenis_sampel', 'utama')
            ->where($unChecked)
            ->get();

        // Sampel Cadangan yang sudah dipilih → kita tampilkan di tabel Utama juga
        $cadPromote = Sampel::with('pengecekan')
            ->whereIn('id', $usedCadIds)
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where($unChecked)
            ->get();

        // Merge jadi Sampel Utama yang perlu dicek
        $samplesUtama = $utama
            ->merge($cadPromote)
            ->unique('id')
            ->values();

        // Sampel Cadangan (belum dicek & belum dipakai)
        $samplesCadangan = Sampel::with('pengecekan')
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where('jenis_sampel', 'cadangan')
            ->where($unChecked)
            ->whereNotIn('id', $usedCadIds)
            ->get();

        // Sampel Terverifikasi (status_sampel ≠ null)
        $samplesVerified = Sampel::with('pengecekan')
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->whereHas('pengecekan', fn($q) => $q->whereNotNull('status_sampel'))
            ->get();

        // Opsi cadangan untuk setiap sampelUtama
        $samplesUtama->each(function($s) use ($usedCadIds) {
            $s->cadanganOptions = Sampel::where('pcl_id', $s->pcl_id)
                ->where('jenis_sampel', 'cadangan')
                ->whereNotIn('id', $usedCadIds)
                ->get(['id','jenis_tanaman','nama_lok'])
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
