<?php

namespace App\Http\Controllers\Dashboard\Admin\Beranda;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // ADMIN: tidak ada filter, ambil semua yang panen dalam rentang
        $events = Pengecekan::with(['sampel.pcl','sampel.tim.pml'])
            ->where('status_sampel', '!=', 'NonEligible')
            ->whereNotNull('tanggal_panen')
            ->whereBetween('tanggal_panen', [
                now()->startOfMonth(),
                now()->addMonths(2)->endOfMonth(),
            ])
            ->get()
            ->map(fn($cek) => [
                'date'     => $cek->tanggal_panen,
                'nama_lok'  => $cek->sampel->nama_lok,
                'pml'       => $cek->sampel->tim->pml->nama,
                'pcl'       => $cek->sampel->pcl->nama,
            ]);

        return Inertia::render('Dashboard/Admin/Beranda/Dashboard', [
            'events' => $events,
        ]);
    }
}
