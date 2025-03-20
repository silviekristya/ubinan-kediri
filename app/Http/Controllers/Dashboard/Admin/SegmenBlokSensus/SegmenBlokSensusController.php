<?php

namespace App\Http\Controllers\Dashboard\Admin\SegmenBlokSensus;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Segmen;
use App\Models\BlokSensus;
use App\Models\NamaSls;

class SegmenBlokSensusController extends Controller
{
    public function index()
    {
        // mengambil data segmen, blok sensus, dan nama sls
        $segmen = Segmen::all();
        $blokSensus = BlokSensus::all();
        $namaSls = NamaSls::all();

        // Lalu kirim ke page Inertia, misalnya SegmenBlokSensusPage
        return Inertia::render('Dashboard/Admin/SegmenBlokSensus/SegmenBlokSensusPage', [
            'segmen' => $segmen,
            'blokSensus' => $blokSensus,
            'namaSls' => $namaSls,
        ]);
    }
}
