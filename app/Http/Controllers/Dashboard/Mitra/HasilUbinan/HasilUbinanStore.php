<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/StoreController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasilUbinanStore extends Controller
{
    /**
     * Simpan data Hasil Ubinan baru
     */
    public function v1(Request $request)
    {
        $mitraId = Auth::user()->mitra->id;

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
            'status'               => 'required|in:Selesai,Gagal',
            'is_verif'             => 'nullable|boolean',
        ], $messages);

        // 1) Pastikan pengecekan milik mitra
        Pengecekan::where('id', $data['pengecekan_id'])
            ->where('pcl_id', $mitraId)
            ->firstOrFail();

        // 2) Simpan
        $hasil = HasilUbinan::create($data);

        // Karena client Anda pakai axios, return JSON 201
        return response()->json([
            'status'  => 'success',
            'message' => 'Hasil ubinan berhasil disimpan.',
            'data'    => $hasil,
        ], 201);
    }
}
