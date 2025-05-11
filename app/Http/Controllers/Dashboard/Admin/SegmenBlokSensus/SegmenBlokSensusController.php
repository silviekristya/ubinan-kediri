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
        $segmen = Segmen::all();
        $blokSensus = BlokSensus::all();
        // Tambahkan eager loading untuk relasi blokSensus
        $namaSlsList = Sls::with('blokSensus')->get();

        // Mapping agar nomor_bs ikut terkirim
        $namaSls = $namaSlsList->map(function ($sls) {
        return [
            'id'        => $sls->id,
            'nama_sls'  => $sls->nama_sls,
            'id_bs'     => $sls->id_bs,
            'nomor_bs'  => optional($sls->blokSensus)->nomor_bs,
        ];
        });
        // Lalu kirim ke page Inertia, misalnya SegmenBlokSensusPage
        return Inertia::render('Dashboard/Admin/SegmenBlokSensus/SegmenBlokSensusPage', [
            'segmen' => $segmen,
            'blokSensus' => $blokSensus,
            'namaSls' => $namaSls,
        ]);
    }
}
