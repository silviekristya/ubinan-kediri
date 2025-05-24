<?php

namespace App\Http\Controllers\Dashboard\Pml\Beranda;

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
        $pmlId = optional($user->pegawai)->id;

        $events = Pengecekan::with(['sampel.pcl','sampel.tim.pml'])
            ->where('status_sampel', '!=', 'NonEligible')
            ->whereNotNull('tanggal_panen')
            ->whereBetween('tanggal_panen', [
                now()->startOfMonth(),
                now()->addMonths(2)->endOfMonth(),
            ])
            ->whereHas('sampel.tim', fn($q) => $q->where('pml_id', $pmlId))
            ->get()
            ->map(fn($cek) => [
                'date'     => $cek->tanggal_panen,
                'title'    => "Panen PCL {$cek->sampel->pcl->nama}",
                'subtitle' => "Lokasi {$cek->sampel->nama_lok}",
            ]);

        return Inertia::render('Dashboard/Pml/Beranda/Dashboard', [
            'events' => $events,
        ]);
    }
}
