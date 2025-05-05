<?php

namespace App\Http\Controllers\Dashboard\Admin\Produktivitas;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use App\Models\Produktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduktivitasList extends Controller
{
    public function index(Request $request)
    {
        $luasPerHektar     = 10000;
        $luasUbinan  = 6.25;

        // 1) Sinkronisasi tabel produktivitass dari HasilUbinan
        HasilUbinan::all()->each(function($h) use ($luasPerHektar, $luasUbinan) {
            $berat = $h->berat_hasil_ubinan;  
            $prod  = $luasUbinan > 0
                ? round(($berat / $luasUbinan) * $luasPerHektar, 2)
                : null;

            Produktivitas::updateOrCreate(
                ['id_hasil_ubinan' => $h->id],
                [
                    'luas_perhektar'     => $luasPerHektar,
                    'luas_ubinan' => $luasUbinan,
                    'produktivitas'      => $prod,
                ]
            );
        });

        // 2) Ambil semua record + eager-load relasi ke HasilUbinan
        $records = Produktivitas::with('hasilUbinan')
            ->get()
            ->map(function($p) {
                return [
                    'id_hasil_ubinan'     => $p->id_hasil_ubinan,
                    'luas_perhektar'      => $p->luas_perhektar,
                    'jumlah_luas_ubinan'  => $p->jumlah_luas_ubinan,
                    // ambil berat langsung dari HasilUbinan
                    'berat_hasil_ubinan'  => optional($p->hasilUbinan)->berat_hasil_ubinan,
                    // produktivitas sudah di‐sync di tabel produktivitass
                    'produktivitas'       => $p->produktivitas,
                ];
            });

        // 3) Kirim ke Inertia
        return Inertia::render(
            'Dashboard/Admin/Produktivitas/ListProduktivitas',
            ['records' => $records]
        );
    }
}
