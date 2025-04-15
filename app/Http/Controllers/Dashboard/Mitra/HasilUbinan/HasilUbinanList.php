<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/IndexController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use App\Models\Fenomena;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HasilUbinanList extends Controller
{
    /**
     * Tampilkan semua sampel mitra dengan status_sampel = 'Eligible'
     * plus relasi pengecekan.hasilUbinan
     */
    public function index()
    {
        $mitraId = Auth::user()->mitra->id;

        $samples = Sampel::with('pengecekan.hasilUbinan')
            ->where('pcl_id', $mitraId)
            ->whereHas('pengecekan', fn($q) =>
                $q->where('status_sampel', 'Eligible')
            )
            ->get();

        // ambil semua fenomena untuk dropdown
        $fenomenas = Fenomena::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('Dashboard/Mitra/HasilUbinan/ListHasilUbinan', [
            'samples' => $samples,
        ]);
    }
}
