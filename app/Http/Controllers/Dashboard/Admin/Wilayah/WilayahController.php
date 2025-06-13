<?php

namespace App\Http\Controllers\Dashboard\Admin\Wilayah;

use App\Models\Sls;
use Inertia\Inertia;
use App\Models\Segmen;
use App\Models\KabKota;
use App\Models\KelDesa;
use App\Models\Provinsi;
use App\Models\Kecamatan;
use App\Models\BlokSensus;
use App\Http\Controllers\Controller;

class WilayahController extends Controller
{
    public function index()
    {
        // mengambil data segmen, blok sensus, dan nama sls
        $provinsi = Provinsi::all()->map(function ($prov) {
            return [
                'kode_provinsi' => $prov->kode_provinsi,
                'nama_provinsi' => $prov->nama_provinsi,
            ];
        });

        $kabkota = KabKota::all()->map(function ($kab) {
            return [
                'id' => $kab->id,
                'kode_kab_kota' => $kab->kode_kab_kota,
                'nama_kab_kota' => $kab->nama_kab_kota,
                'provinsi_id' => $kab->provinsi_id,
            ];
        });

        $kecamatan = Kecamatan::all()->map(function ($kec) {
            return [
                'id' => $kec->id,
                'kode_kecamatan' => $kec->kode_kecamatan,
                'nama_kecamatan' => $kec->nama_kecamatan,
                'kab_kota_id' => $kec->kab_kota_id,
            ];
        });

        $kelurahanDesa = KelDesa::all()->map(function ($kel) {
            return [
                'id' => $kel->id,
                'kode_kel_desa' => $kel->kode_kel_desa,
                'nama_kel_desa' => $kel->nama_kel_desa,
                'kecamatan_id' => $kel->kecamatan_id,
            ];
        });

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
        // Lalu kirim ke page Inertia, misalnya WilayahPage
        // dd($provinsi, $kabkota, $kecamatan, $kelurahanDesa, $segmen, $blokSensus, $sls);
        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'provinsi'   => $provinsi,
            'kabKota'    => $kabkota,
            'kecamatan'  => $kecamatan,
            'kelurahanDesa'  => $kelurahanDesa,
            'segmen'     => $segmen,
            'blokSensus' => $blokSensus,
            'sls'        => $sls,
        ]);
    }
}
