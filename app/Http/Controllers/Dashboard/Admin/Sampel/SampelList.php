<?php
namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Models\Sampel;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SampelList extends Controller
{
    public function v1(Request $request): Response
    {
        $raw = Sampel::with([
            'provinsi', 
            'kabKota', 
            'kecamatan', 
            'kelDesa',
            'sls.blokSensus',
            'tim.pml',
            'pcl'
        ])->get();

        // flatten supaya front-end bisa akses nama_prov, nama_kab, dst.
        $sampel = $raw->map(fn($s) => [
            'id'               => $s->id,
            'jenis_sampel'     => $s->jenis_sampel,
            'jenis_tanaman'    => $s->jenis_tanaman,
            'jenis_komoditas'  => $s->jenis_komoditas,
            'frame_ksa'        => $s->frame_ksa,
            // wilayah
            'provinsi_id'      => $s->provinsi_id,
            'nama_prov'        => $s->provinsi?->nama_provinsi,  // sesuaikan field di tabel provinsi
            'kab_kota_id'      => $s->kab_kota_id,
            'nama_kab_kota'    => $s->kabKota?->nama_kab_kota, // sesuaikan nama kolom
            'kecamatan_id'     => $s->kecamatan_id,
            'nama_kec'         => $s->kecamatan?->nama_kecamatan,
            'kel_desa_id'      => $s->kel_desa_id,
            'nama_kel_desa'    => $s->kelDesa?->nama_kel_desa,
            // ubinan
            'nama_lok'         => $s->nama_lok,
            // segmen
            'segmen_id'        => $s->segmen_id,
            'subsegmen'        => $s->subsegmen,
            'strata'           => $s->strata,
            // blok sensus & SLS
            'id_bs'         => $s->sls?->blokSensus?->id_bs,
            'nama_sls'         => $s->sls?->nama_sls,
            'nama_krt'         => $s->nama_krt,
            // listing
            'bulan_listing'    => $s->bulan_listing,
            'tahun_listing'    => $s->tahun_listing,
            'fase_tanam'       => $s->fase_tanam,
            'rilis'            => $s->rilis,
            'a_random'         => $s->a_random,
            'nks'              => $s->nks,
            'long'             => $s->long,
            'lat'              => $s->lat,
            'subround'         => $s->subround,
            'perkiraan_minggu_panen' => $s->perkiraan_minggu_panen,
            // alokasi
            'tim_id'           => $s->tim_id,
            'pml_nama'         => $s->tim?->pml?->nama,
            'pcl_id'           => $s->pcl_id,
            'pcl_nama'         => $s->pcl?->nama,
            'created_at'       => $s->created_at,
            'updated_at'       => $s->updated_at,
        ]);

        // dd($sampel);
        return Inertia::render('Dashboard/Admin/Sampel/ListSampel', [
            'sampel' => $sampel,
        ]);
    }
}
