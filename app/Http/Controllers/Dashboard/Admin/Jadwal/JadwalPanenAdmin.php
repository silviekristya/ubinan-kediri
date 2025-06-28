<?php

namespace App\Http\Controllers\Dashboard\Admin\Jadwal;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class JadwalPanenAdmin extends Controller
{
    public function v1(Request $request): Response
    {
        // Ambil jadwal panen bulan ini s.d. dua bulan ke depan
        $events = Pengecekan::with(['sampel.pcl', 'sampel.tim.pml'])
            ->where('status_sampel', '!=', 'NonEligible')
            ->whereNotNull('tanggal_panen')
            ->whereBetween('tanggal_panen', [
                now()->startOfMonth(),
                now()->addMonths(2)->endOfMonth(),
            ])
            ->get()
            ->map(fn($cek) => [
                'date'     => Carbon::parse($cek->tanggal_panen)->format('DD-MM-YYYY'),
                'nama_lok' => $cek->sampel->nama_lok,
                'pml'      => $cek->sampel->tim->pml->nama,
                'pcl'      => $cek->sampel->pcl->nama,
            ]);

        return Inertia::render('Dashboard/Admin/Jadwal/JadwalPanenPage', [
            'events' => $events,
        ]);
    }
}
