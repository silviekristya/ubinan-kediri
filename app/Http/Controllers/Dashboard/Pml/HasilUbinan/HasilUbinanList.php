<?php
// app/Http/Controllers/Dashboard/Pml/HasilUbinan/HasilUbinanListController.php

namespace App\Http\Controllers\Dashboard\Pml\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use App\Models\Sampel;
use App\Models\Fenomena;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HasilUbinanList extends Controller
{
    // app/Http/Controllers/Dashboard/Pml/HasilUbinan/HasilUbinanList.php

public function index()
{
    $pmlId = Auth::user()->pegawai->id;

    $pengecekans = Pengecekan::with([
        'sampel',
        'hasilUbinan.fenomena',
        ])
        ->whereHas('sampel.tim', fn($q) => 
            $q->where('pml_id', $pmlId)
        )
        ->where(function($q) {
            $q->where('status_sampel', 'Eligible')
            ->orWhereHas('hasilUbinan');
        })
        ->get();

    $fenomenas = Fenomena::orderBy('nama')->get(['id','nama']);

    $usedCadIds = Pengecekan::whereNotNull('id_sampel_cadangan')
        ->pluck('id_sampel_cadangan')
        ->toArray();

    $cadanganOptions = Sampel::whereHas('tim', fn($q)=> $q->where('pml_id',$pmlId))
        ->where('jenis_sampel','cadangan')
        ->whereNotIn('id',$usedCadIds)
        ->get(['id','jenis_tanaman','nama_lok'])
        ->map(fn($s)=>[
            'id'    => $s->id,
            'label' => "{$s->jenis_tanaman} — {$s->nama_lok}",
        ]);

    return Inertia::render('Dashboard/Pml/HasilUbinan/ListHasilUbinan', [
        'pengecekans'     => $pengecekans,
        'fenomenas'       => $fenomenas,
        'cadanganOptions' => $cadanganOptions,
    ]);
}

}
