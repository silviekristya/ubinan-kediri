<?php

namespace App\Http\Controllers\Dashboard\Admin\BlokSensus;

use App\Http\Controllers\Controller;
use App\Models\BlokSensus;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class BlokSensusList extends Controller
{
    /**
     * Display a listing of Blok Sensus.
     */
    public function v1(Request $request): Response
    {
        $blokSensus = BlokSensus::with('namaSls')->get(); // Ambil semua data Blok Sensus

        return Inertia::render('Dashboard/Admin/BlokSensus/ListBlokSensus', [
            'blokSensus' => $blokSensus,
        ]);
    }
}