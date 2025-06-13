<?php

namespace App\Http\Controllers\Dashboard\Admin\Beranda;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use App\Models\HasilUbinan;
use App\Models\Produktivitas;
use App\Models\Sampel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
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
                'date'     => $cek->tanggal_panen,
                'nama_lok' => $cek->sampel->nama_lok,
                'pml'      => $cek->sampel->tim->pml->nama,
                'pcl'      => $cek->sampel->pcl->nama,
            ]);

        // Hitung progress pengecekan & ubinan
        $totalPengecekan = Sampel::with('pengecekan')
                            ->whereNotNull('tim_id')
                            ->whereNotNull('pcl_id')
                            ->count();
        $donePengecekan  = Sampel::with('pengecekan')
                            ->whereHas('pengecekan')
                            ->count();
        $totalUbinan     = HasilUbinan::count();
        $doneUbinan      = HasilUbinan::whereNotNull('berat_hasil_ubinan')->count();

        // Siapkan data produktivitas per kecamatan per subround
        $prodRecords = Produktivitas::with('hasilUbinan.pengecekan.sampel.kecamatan')
            ->get()
            ->map(fn($p) => (object)[
                'subround'     => $p->hasilUbinan->pengecekan->sampel->subround,
                'kecamatan'    => $p->hasilUbinan->pengecekan->sampel->kecamatan->nama_kecamatan,
                'produktivitas'=> $p->produktivitas,
            ]);

        // Pivot untuk chart
        foreach ($prodRecords->groupBy(fn($item) => $item->subround) as $round => $items) {
            $row = ['subround' => $round];
            // group by property kecamatan
            foreach ($items->groupBy(fn($item) => $item->kecamatan) as $kec => $vals) {
                $row[$kec] = round($vals->avg('produktivitas'), 2);
            }
            $chartData[] = $row;
        }

        if (!isset($chartData)) {
            $chartData = [];
        }

        return Inertia::render('Dashboard/Admin/Beranda/Dashboard', [
            'events'            => $events,
            'progress'          => [
                'pengecekan' => [
                    'label' => 'Pengecekan',
                    'done'  => $donePengecekan,
                    'total' => $totalPengecekan,
                ],
                'ubinan' => [
                    'label' => 'Hasil Ubinan',
                    'done'  => $doneUbinan,
                    'total' => $totalUbinan,
                ],
            ],
            'productivityChart' => $chartData,
        ]);
    }
}
