<?php

namespace App\Http\Controllers\Dashboard\Admin\Pengecekan;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use App\Models\Pengecekan;
use App\Models\User;
use Inertia\Inertia;

class PengecekanList extends Controller
{
    public function index()
    {
        // Semua sampel utama (baik yang sudah dicek maupun belum)
        $samplesUtama = Sampel::with('kecamatan','pengecekan', 'tim.pml', 'pcl')
            ->where('jenis_sampel', 'utama')
            ->orderBy('nama_lok')
            ->get();

        // Kumpulkan semua id_sampel_cadangan yang sudah dipakai
        $usedCadIds = Pengecekan::whereNotNull('id_sampel_cadangan')
            ->pluck('id_sampel_cadangan')
            ->toArray();

        // Sampel cadangan yang belum dipakai
        $samplesCadangan = Sampel::with('kecamatan','pengecekan', 'tim.pml', 'pcl')
            ->where('jenis_sampel', 'cadangan')
            ->whereNotIn('id', $usedCadIds)
            ->orderBy('nama_lok')
            ->get();

            // dd($samplesUtama, $samplesCadangan, $usedCadIds);
        return Inertia::render('Dashboard/Admin/Pengecekan/ListPengecekan', [
            'samplesUtama'    => $samplesUtama,
            'samplesCadangan' => $samplesCadangan,
        ]);
    }
}
