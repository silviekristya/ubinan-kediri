<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/StoreController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use Illuminate\Http\Request;

class HasilUbinanStore extends Controller
{
    /**
     * Simpan data hasil ubinan baru
     */
    public function v1(Request $request)
    {
        $messages = [
            'pengecekan_id.unique' => 'Hasil ubinan untuk pengecekan ini sudah ada sebelumnya.',
        ];

        $data = $request->validate([
            'tanggal_pencacahan'   => 'required|date',
            'pengecekan_id'        => 'required|exists:pengecekan,id|unique:hasil_ubinan,pengecekan_id',
            'berat_hasil_ubinan'   => 'nullable|numeric',
            'jumlah_rumpun'        => 'nullable|integer',
            'luas_lahan'           => 'nullable|numeric',
            'cara_penanaman'       => 'nullable|string',
            'jenis_pupuk'          => 'nullable|string',
            'penanganan_hama'      => 'nullable|string',
            'fenomena_id'          => 'nullable|exists:fenomena,id',
            'status'               => 'required|in:Selesai, Gagal',
            'is_verif'             => 'nullable|boolean',

        ], $messages
    );

        HasilUbinan::create($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Hasil ubinan berhasil disimpan.',
        ]);
    }
}
