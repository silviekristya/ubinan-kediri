<?php

namespace App\Http\Controllers\Dashboard\Admin\Wilayah;

use Inertia\Inertia;
use App\Models\Provinsi;
use App\Models\KabKota;
use App\Models\Kecamatan;
use App\Models\KelDesa;
use App\Models\Segmen;
use App\Models\BlokSensus;
use App\Models\Sls;
use App\Http\Controllers\Controller;

class WilayahController extends Controller
{
    public function provinsi()
    {
        $provinsi = Provinsi::all()->map(fn($p) => [
            'kode_provinsi' => $p->kode_provinsi,
            'nama_provinsi' => $p->nama_provinsi,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab'  => 'provinsi',
            'provinsi'   => $provinsi,
        ]);
    }

    public function kabKota()
    {
        $kabkota = KabKota::all()->map(fn($k) => [
            'id'             => $k->id,
            'kode_kab_kota'  => $k->kode_kab_kota,
            'nama_kab_kota'  => $k->nama_kab_kota,
            'provinsi_id'    => $k->provinsi_id,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab' => 'kab-kota',
            'kabKota'    => $kabkota,
        ]);
    }

    public function kecamatan()
    {
        $kecamatan = Kecamatan::all()->map(fn($c) => [
            'id'             => $c->id,
            'kode_kecamatan' => $c->kode_kecamatan,
            'nama_kecamatan' => $c->nama_kecamatan,
            'kab_kota_id'    => $c->kab_kota_id,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab' => 'kecamatan',
            'kecamatan'  => $kecamatan,
        ]);
    }

    public function kelDesa()
    {
        $kelurahanDesa = KelDesa::all()->map(fn($d) => [
            'id'            => $d->id,
            'kode_kel_desa' => $d->kode_kel_desa,
            'nama_kel_desa' => $d->nama_kel_desa,
            'kecamatan_id'  => $d->kecamatan_id,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab'      => 'kel-desa',
            'kelurahanDesa'  => $kelurahanDesa,
        ]);
    }

    public function segmen()
    {
        $segmen = Segmen::with('kecamatan')->get()->map(fn($s) => [
            'id_segmen'      => $s->id_segmen,
            'kode_segmen'    => $s->kode_segmen,
            'nama_segmen'    => $s->nama_segmen,
            'kecamatan_id'   => $s->kecamatan_id,
            'nama_kecamatan' => optional($s->kecamatan)->nama_kecamatan,
        ]);

        // tambahkan fetch provinsi, kabKota, kecamatan
        $provinsi  = Provinsi::orderBy('nama_provinsi')->get()->map(fn($p) => [
            'kode_provinsi' => $p->kode_provinsi,
            'nama_provinsi' => $p->nama_provinsi,
        ]);
        $kabKota   = KabKota::orderBy('nama_kab_kota')->get()->map(fn($k) => [
            'id'            => $k->id,
            'kode_kab_kota' => $k->kode_kab_kota,
            'nama_kab_kota' => $k->nama_kab_kota,
            'provinsi_id'   => $k->provinsi_id,
        ]);
        $kecamatan = Kecamatan::orderBy('nama_kecamatan')->get()->map(fn($c) => [
            'id'             => $c->id,
            'kode_kecamatan' => $c->kode_kecamatan,
            'nama_kecamatan' => $c->nama_kecamatan,
            'kab_kota_id'    => $c->kab_kota_id,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab'   => 'segmen',
            'segmen'      => $segmen,
            'provinsi'    => $provinsi,
            'kabKota'     => $kabKota,
            'kecamatan'   => $kecamatan,
        ]);
    }


    public function blokSensus()
    {
        $blok = BlokSensus::with('kelDesa')->get()->map(fn($b) => [
            'id_bs'        => $b->id_bs,
            'nomor_bs'     => $b->nomor_bs,
            'kel_desa_id'  => $b->kel_desa_id,
            'nama_kel_desa'=> optional($b->kelDesa)->nama_kel_desa,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab'   => 'blok-sensus',
            'blokSensus'  => $blok,
        ]);
    }

    public function sls()
    {
        $sls = Sls::with('blokSensus')->get()->map(fn($s) => [
            'id_sls'    => $s->id,
            'nama_sls'  => $s->nama_sls,
            'bs_id'     => $s->bs_id,
            'blokSensus'=> optional($s->blokSensus) ? [
                'id_bs'         => $s->blokSensus->id_bs,
                'nomor_bs'      => $s->blokSensus->nomor_bs,
                'nama_kel_desa' => optional($s->blokSensus->kelDesa)->nama_kel_desa,
            ] : null,
        ]);

        return Inertia::render('Dashboard/Admin/Wilayah/WilayahPage', [
            'activeTab' => 'sls',
            'sls'       => $sls,
        ]);
    }
}
