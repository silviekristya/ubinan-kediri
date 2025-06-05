<?php

namespace App\Http\Controllers\Dashboard\Admin\Produktivitas;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use App\Models\Produktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ProduktivitasList extends Controller
{
    public function index(Request $request)
    {
        $konversi   = 10000 / 100; // konversi kw/ha
        $luasUbinan = 6.25;

        //
        // 1) Sinkronisasi tabel `produktivitas` dari `HasilUbinan`
        //
        HasilUbinan::all()->each(function ($h) use ($konversi, $luasUbinan) {
            $berat = $h->berat_hasil_ubinan;
            $prod  = $luasUbinan > 0
                ? round(($berat / $luasUbinan) * $konversi, 2)
                : null;

            Produktivitas::updateOrCreate(
                ['id_hasil_ubinan' => $h->id],
                [
                    'konversi'           => $konversi,
                    'jumlah_luas_ubinan' => $luasUbinan,
                    'produktivitas'      => $prod,
                ]
            );
        });

        //
        // Record per sampel
        //
        $records = Produktivitas::with('hasilUbinan.pengecekan.sampel.kecamatan')
            ->get()
            ->map(function ($p) {
                $h = $p->hasilUbinan;
                $s = optional($h)->pengecekan->sampel;
                return [
                    'id_hasil_ubinan'    => $p->id_hasil_ubinan,
                    'tanggal_ubinan'     => optional($h)->tanggal_pencacahan,
                    'kecamatan_id'       => optional($s)->kecamatan_id,
                    'nama_kecamatan'     => optional($s->kecamatan)->nama_kecamatan,
                    'nama_lok'           => optional($s)->nama_lok,
                    'konversi'           => $p->konversi,
                    'jumlah_luas_ubinan' => $p->jumlah_luas_ubinan,
                    'berat_hasil_ubinan' => $h->berat_hasil_ubinan,
                    'produktivitas'      => $p->produktivitas,
                ];
            })
            ->toArray();

        //
        // Siapkan data sumber untuk pivot (tahun_listing, subround, berat, kecamatan, kabupaten)
        //
        $allProd = Produktivitas::with([
                'hasilUbinan.pengecekan.sampel.kecamatan',
                'hasilUbinan.pengecekan.sampel.kabKota',
            ])
            ->get()
            ->map(function ($p) {
                $h = $p->hasilUbinan;
                $s = $h->pengecekan->sampel;

                return [
                    'tahun_listing'      => $s->tahun_listing,
                    'subround'           => $s->subround,
                    'kecamatan'          => optional($s->kecamatan)->nama_kecamatan,
                    'kecamatan_id'       => optional($s)->kecamatan_id,
                    'kabupaten'          => optional($s->kabKota)->nama_kab_kota,
                    'kabupaten_id'       => optional($s->kabKota)->id,
                    'berat_hasil_ubinan' => $h->berat_hasil_ubinan,
                ];
            })
            ->filter(fn($item) =>
                $item['tahun_listing'] !== null
                && $item['subround'] !== null
                && $item['kecamatan'] !== null
                && $item['kabupaten'] !== null
            );

        $prodRecordsCollection = collect($allProd);

        $byKecamatan = [];
        foreach ($prodRecordsCollection->groupBy('tahun_listing') as $tahun => $rowsInTahun) {
            foreach ($rowsInTahun->groupBy('subround') as $sub => $rowsInSub) {
                foreach ($rowsInSub->groupBy('kecamatan') as $kec => $vals) {
                    $avgBerat    = $vals->avg('berat_hasil_ubinan');
                    $prodRataKec = $avgBerat !== null
                        ? round(($avgBerat / $luasUbinan) * $konversi, 2)
                        : null;

                    $byKecamatan[] = [
                        'tahun_listing'  => $tahun,
                        'subround'       => $sub,
                        'kecamatan_id'   => $vals->first()['kecamatan_id'],
                        'kecamatan'      => $kec,
                        'jumlah_sampel'  => $vals->count(),
                        'rata2_berat'    => round($avgBerat, 2),
                        'produktivitas'  => $prodRataKec,
                    ];
                }
            }
        }

         $byKabupaten = [];
        foreach ($prodRecordsCollection->groupBy('tahun_listing') as $tahun => $rowsInTahun) {
            foreach ($rowsInTahun->groupBy('subround') as $sub => $rowsInSub) {
                foreach ($rowsInSub->groupBy('kabupaten') as $kab => $vals) {
                    $avgBerat    = $vals->avg('berat_hasil_ubinan');
                    $prodRataKab = $avgBerat !== null
                        ? round(($avgBerat / $luasUbinan) * $konversi, 2)
                        : null;

                    $byKabupaten[] = [
                        'tahun_listing'  => $tahun,
                        'subround'       => $sub,
                        'kabupaten_id'   => $vals->first()['kabupaten_id'],
                        'kabupaten'      => $kab,
                        'jumlah_sampel'  => $vals->count(),
                        'rata2_berat'    => round($avgBerat, 2),
                        'produktivitas'  => $prodRataKab,
                    ];
                }
            }
        }

        //
        // Kirim ke Inertia
        //
        return Inertia::render('Dashboard/Admin/Produktivitas/ListProduktivitas', [
            'records'               => $records,
            'byKecamatan'           => $byKecamatan,
            'byKabupaten'           => $byKabupaten,
            'availableTahunListing' => $prodRecordsCollection->pluck('tahun_listing')->unique()->sort()->values(),
            'availableSubrounds'    => $prodRecordsCollection->pluck('subround')->unique()->sort()->values(),
        ]);
    }
}
