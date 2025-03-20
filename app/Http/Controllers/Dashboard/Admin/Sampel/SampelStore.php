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
        // Contoh validasi sederhana:
        $validated = $request->validate([
            'jenis_sampel'   => 'required|in:Utama,Cadangan',
            'jenis_tanaman'  => 'required|in:Padi,Palawija',
            'frame_ksa'      => 'nullable|string',
            'prov'           => 'required|string|max:5',
            'kab'            => 'required|string|max:5',
            'kec'            => 'required|string|max:5',
            'nama_prov'      => 'required|string',
            'nama_kab'       => 'required|string',
            'nama_kec'       => 'required|string',
            'nama_lok'       => 'required|string',
            'segmen_id'      => 'nullable|string|max:10',
            'subsegmen'      => 'required|string|max:5',
            'id_sls'         => 'nullable|string|max:20',
            'nama_krt'       => 'nullable|string',
            'strata'         => 'required|string|max:5',
            'bulan_listing'  => 'required|string',
            'tahun_listing'  => 'required|string',
            'fase_tanam'     => 'nullable|string',
            'rilis'          => 'nullable|date',
            'a_random'       => 'nullable|string',
            'nks'            => 'required|string|max:20',
            'long'           => 'required|string', // Atau numeric jika sesuai
            'lat'            => 'required|string', // Atau numeric jika sesuai
            'subround'       => 'required|string|max:2',
            'perkiraan_minggu_panen' => 'nullable|numeric',
            // Jika diperlukan, tambahkan validasi untuk pcl_id dan tim_id
            'pcl_id'         => 'nullable|numeric',
            'tim_id'         => 'nullable|numeric',
        ]);

        // Jika segmen_id tidak null, cek apakah segmen ini sudah ada
        if (!empty($validated['segmen_id'])) {
            $segmenId = $validated['segmen_id'];

            // Cek apakah segmen belum ada
            $segmen = Segmen::where('id_segmen', $segmenId)->first();
            if (!$segmen) {
                // Buat segmen baru dengan data minimal
                $segmen = Segmen::create([
                    'id_segmen'   => $segmenId,
                    'nama_segmen' => 'Segmen ' . $segmenId, // isi default
                ]);
            }
        }
        try {
            // Lakukan penyimpanan data sampel baru
            $sampel = Sampel::create($validated);

            // Jika berhasil, kembalikan respons sukses (bisa JSON atau redirect)
            return response()->json([
                'status' => 'success',
                'message' => 'Data sampel berhasil disimpan.',
                'sampel' => $sampel,
            ], 200);

        } catch (\Exception $e) {
            // Tangani jika ada error
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan data sampel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
