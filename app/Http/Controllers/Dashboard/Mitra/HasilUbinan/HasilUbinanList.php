<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/IndexController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\Fenomena;
use App\Models\Pengecekan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HasilUbinanList extends Controller
{
    public function index()
    {
        $mitraId = Auth::user()->mitra->id;

        $pengecekans = Pengecekan::with(['sampel', 'hasilUbinan'])
            ->where('status_sampel', 'Eligible')
            ->whereHas('sampel', fn($q) => 
                $q->where('pcl_id', $mitraId)
            )
            ->get();

        // Untuk dropdown fenomena di UI
        $fenomenas = Fenomena::orderBy('nama')
            ->get(['id', 'nama']);

        return Inertia::render('Dashboard/Mitra/HasilUbinan/ListHasilUbinan', [
            // Kirim daftar pengecekan, bukan HasilUbinan
            'pengecekans' => $pengecekans,
            'fenomenas'   => $fenomenas,
        ]);
    }
}
