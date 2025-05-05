<?php

namespace App\Http\Controllers\Dashboard\Admin\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HasilUbinanList extends Controller
{
    public function index(Request $request)
    {
        // ambil semua pengecekan beserta sampel dan fenomena
        $hasilUbinan = Pengecekan::with([
                'sampel.pcl',
                'sampel.tim.pml',
                'hasilUbinan.fenomena'
            ])
            ->where('status_sampel', '!=', 'NonEligible')
            ->get();

        // kirim ke Inertia
        return Inertia::render('Dashboard/Admin/HasilUbinan/ListHasilUbinan', [
            'hasilUbinan' => $hasilUbinan,
        ]);
    }
}
