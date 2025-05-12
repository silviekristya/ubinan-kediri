<?php

namespace App\Http\Controllers\Dashboard\Admin\SegmenBlokSensus;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Segmen;
use App\Models\BlokSensus;
use App\Models\Sls;

class SegmenBlokSensusController extends Controller
{
    public function index()
    {
        // mengambil data segmen, blok sensus, dan nama sls
        $segmen = Segmen::with('kecamatan')->get()->map(function ($segmen) {
            return [
                'id_segmen'     => $segmen->id_segmen,
                'kode_segmen'   => $segmen->kode_segmen,
                'nama_segmen'   => $segmen->nama_segmen,
                'kecamatan_id'  => $segmen->kecamatan_id,
                'nama_kecamatan'=> optional($segmen->kecamatan)->nama_kecamatan,
            ];
        });
        $blokSensus = BlokSensus::with('kelDesa')->get()->map(function ($blok) {
            return [
                'id_bs'        => $blok->id_bs,
                'nomor_bs'     => $blok->nomor_bs,
                'kel_desa_id'  => $blok->kel_desa_id,
                'nama_kel_desa'=> optional($blok->kelDesa)->nama_kel_desa,
            ];
        });
        // Tambahkan eager loading untuk relasi blokSensus
        $sls = Sls::with('blokSensus')->get()->map(function ($item) {
            $bs = $item->blokSensus; // this is a single model, not a collection

            return [
                'id_sls'   => $item->id,
                'nama_sls' => $item->nama_sls,
                'bs_id'    => $item->bs_id,
                'blokSensus' => $bs
                    ? [
                        'id_bs'         => $bs->id_bs,
                        'nomor_bs'      => $bs->nomor_bs,
                        'kel_desa_id'   => $bs->kel_desa_id,
                        'nama_kel_desa' => optional($bs->kelDesa)->nama_kel_desa,
                    ]
                    : null,
            ];
        });
        // Mapping agar nomor_bs ikut terkirim
        // Lalu kirim ke page Inertia, misalnya SegmenBlokSensusPage
        return Inertia::render('Dashboard/Admin/SegmenBlokSensus/SegmenBlokSensusPage', [
            'segmen' => $segmen,
            'blokSensus' => $blokSensus,
            'sls' => $sls,
        ]);
    }
}
