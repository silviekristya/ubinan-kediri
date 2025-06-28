<?php

namespace App\Http\Controllers\Dashboard\Pml\Kalender;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class KalenderPanenPml extends Controller
{
    public function v1(Request $request): Response
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
                'date'     => Carbon::parse($cek->tanggal_panen)->format('d-m-Y'),
                'title'    => "Panen PCL {$cek->sampel->pcl->nama}",
                'subtitle' => "Lokasi {$cek->sampel->nama_lok}",
            ]);

        return Inertia::render('Dashboard/Pml/Kalender/KalenderPmlPage', [
            'events' => $events,
        ]);
    }
}
