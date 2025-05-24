<?php

namespace App\Http\Controllers\Dashboard\Mitra\Beranda;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $pclId = optional($user->mitra)->id;

        $events = Pengecekan::with(['sampel.pcl','sampel.tim.pml'])
            ->where('status_sampel', '!=', 'NonEligible')
            ->whereNotNull('tanggal_panen')
            ->whereBetween('tanggal_panen', [
                now()->startOfMonth(),
                now()->addMonths(2)->endOfMonth(),
            ])
            ->whereHas('sampel', fn($q) => $q->where('pcl_id', $pclId))
            ->get()
            ->map(fn($cek) => [
                'date'     => $cek->tanggal_panen,
                'title'    => "Panen: PCL {$cek->sampel->pcl->nama}",
                'subtitle' => $cek->sampel->tim->pml->nama,
            ]);

        return Inertia::render('Dashboard/Mitra/Beranda/Dashboard', [
            'events' => $events,
        ]);
    }
}
