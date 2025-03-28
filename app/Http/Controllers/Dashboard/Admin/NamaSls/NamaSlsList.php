<?php

namespace App\Http\Controllers\Dashboard\Admin\NamaSls;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\NamaSls;
use Illuminate\Http\Request;

class NamaSlsList extends Controller
{
    /**
     * Display a listing of NamaSls.
     */
    public function v1(Request $request): Response
    {
        $namaSlsList = NamaSls::with('blokSensus')->get();

        // Debug relasi blokSensus dan nomor_bs (sementara untuk cek)
        // Hapus komentar ini setelah pengecekan
        // dd($namaSlsList->toArray());

        $data = $namaSlsList->map(function ($sls) {
            return [
                'id'        => $sls->id,
                'nama_sls'  => $sls->nama_sls,
                'id_bs'     => $sls->id_bs,
                'nomor_bs'  => optional($sls->blokSensus)->nomor_bs,
            ];
        });

        return Inertia::render('Dashboard/Admin/NamaSls/ListNamaSls', [
            'namaSls' => $data, // pastikan disesuaikan dengan FE props
        ]);
    }
}
