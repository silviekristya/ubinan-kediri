<?php

namespace App\Http\Controllers\Dashboard\Mitra\Kalender;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class KalenderPanenMitra extends Controller
{
    public function v1(Request $request): Response
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
                'date'     => Carbon::parse($cek->tanggal_panen)->format('d-m-Y'),
                'title'    => "Panen: PCL {$cek->sampel->pcl->nama}",
                'subtitle' => $cek->sampel->tim->pml->nama,
            ]);

        return Inertia::render('Dashboard/Mitra/Kalender/KalenderMitraPage', [
            'events' => $events,
        ]);
    }
}
