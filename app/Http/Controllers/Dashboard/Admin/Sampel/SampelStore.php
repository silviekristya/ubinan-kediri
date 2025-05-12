<?php

namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use App\Models\Segmen;
use Illuminate\Http\Request;

class SampelStore extends Controller
{
    public function v1(Request $request)
    {
        // Validasi data sampel baru sesuai dengan struktur tabel terbaru
        $validated = $request->validate([
            'jenis_sampel'          => 'required|in:Utama,Cadangan',
            'jenis_tanaman'         => 'required|in:Padi,Palawija',
            'jenis_komoditas'       => 'required|in:Padi,Jagung,Kedelai,Kacang Tanah,Ubi Kayu,Ubi Jalar,Lainnya',
            'frame_ksa'             => 'nullable|string|max:20',
            'prov'                  => 'required|string|max:5',
            'kab'                   => 'required|string|max:5',
            'kec'                   => 'required|string|max:5',
            'nama_prov'             => 'required|string',
            'nama_kab'              => 'required|string',
            'nama_kec'              => 'required|string',
            'nama_lok'              => 'required|string',
            'segmen_id'             => 'nullable|string|exists:segmen,id_segmen',
            'subsegmen'             => 'nullable|string|max:5',
            'id_sls'                => 'nullable|integer|exists:nama_sls,id',
            'nama_krt'              => 'nullable|string',
            'strata'                => 'required|string|max:5',
            'bulan_listing'         => 'required|string',
            'tahun_listing'         => 'required|string',
            'fase_tanam'            => 'nullable|string',
            'rilis'                 => 'required|date',
            'a_random'              => 'required|string',
            'nks'                   => 'required|string',
            'long'                  => 'required|string',
            'lat'                   => 'required|string',
            'subround'              => 'required|string|max:2',
            'perkiraan_minggu_panen'=> 'nullable|numeric',
            'pcl_id'                => 'nullable|numeric',
            'tim_id'                => 'nullable|numeric',
        ]);

        try {
            // Simpan data sampel (hanya menyimpan id_sls sebagai FK)
            $sampel = Sampel::create($validated);
            // Eager load relasi untuk mengembalikan data lengkap
            $sampel->load('sls.blokSensus'); 

            return response()->json([
                'status'  => 'success',
                'message' => 'Data sampel berhasil disimpan.',
                'sampel'  => $sampel,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menyimpan data sampel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
