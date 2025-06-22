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

        // Semua id_sampel_cadangan yg sudah dipakai
        $usedCadIds = Pengecekan::query()
            ->whereNotNull('id_sampel_cadangan')
            ->pluck('id_sampel_cadangan')
            ->toArray();

        // Sampel "belum dicek": 
        // - belum ada pengecekan sama sekali 
        // - atau status_sampel = null 
        // - atau status_sampel = 'Belum'
        $unChecked = function($q) {
            $q->doesntHave('pengecekan')
              ->orWhereHas('pengecekan', function($q2) {
                  $q2->whereNull('status_sampel')
                     ->orWhere('status_sampel', 'Belum');
              });
        };

       // Untuk sample utama, menampilkan yang sudah diverifikasi tapi ADA UPDATE DARI MITRA setelah verifikasi (perlu verif ulang)
        $utama = Sampel::with(['pengecekan', 'kecamatan'])
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where('jenis_sampel', 'utama')
            ->where(function($q) {
                $q->doesntHave('pengecekan')
                ->orWhereHas('pengecekan', function($q2) {
                    $q2->whereNull('status_sampel')
                        ->orWhere('status_sampel', 'Belum')
                        // Tambahan: perlu verifikasi ulang!
                        ->orWhere(function($q3) {
                            $q3->whereIn('status_sampel', ['Eligible', 'NonEligible'])
                                ->whereColumn('updated_at', '>', 'verif_at');
                        });
                });
            })
            ->get();

        // Sampel Cadangan yg sudah dipromote (tampil di tabel Utama juga)
        $cadPromote = Sampel::with('pengecekan', 'kecamatan')
            ->whereIn('id', $usedCadIds)
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where($unChecked)
            ->get();

        // Merge jadi sampel utama utk dicek
        $samplesUtama = $utama
            ->merge($cadPromote)
            ->unique('id')
            ->values();

        // Sampel Cadangan (belum dicek & belum dipakai)
        $samplesCadangan = Sampel::with('pengecekan', 'kecamatan')
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->where('jenis_sampel', 'cadangan')
            ->where($unChecked)
            ->whereNotIn('id', $usedCadIds)
            ->get();

        // Sampel Terverifikasi: status_sampel hanya Eligible atau NonEligible atau sudah dicek, TIDAK ADA update setelah verifikasi
        $samplesVerified = Sampel::with(['pengecekan', 'kecamatan'])
            ->whereHas('tim', fn($q) => $q->where('pml_id', $pmlId))
            ->whereHas('pengecekan', function($q) {
                $q->whereIn('status_sampel', ['Eligible', 'NonEligible'])
                ->whereColumn('updated_at', '<=', 'verif_at'); // Tidak ada update setelah verifikasi
            })
            ->get();

        // Opsi cadangan utk setiap sampelUtama
        $samplesUtama->each(function($s) use ($usedCadIds) {
            $s->cadanganOptions = Sampel::with('kecamatan')->where('pcl_id', $s->pcl_id)
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
