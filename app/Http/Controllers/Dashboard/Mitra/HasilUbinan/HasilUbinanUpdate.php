<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/UpdateController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasilUbinanUpdate extends Controller
{
    /**
     * Perbarui data Hasil Ubinan yang sudah ada
     */
    public function v1(Request $request, $id)
    {
        // Ambil HasilUbinan dan eager relasi untuk cek kepemilikan
        $hasil = HasilUbinan::with('pengecekan.sampel')->findOrFail($id);

        // Pastikan mitra yang login adalah owner
        $mitraId = Auth::user()->mitra->id;
        if ($hasil->pengecekan->sampel->pcl_id !== $mitraId) {
            abort(403, 'Anda tidak berwenang mengubah data ini.');
        }

        $data = $request->validate([
            'tanggal_pencacahan'   => 'required|date',
            // pengecekan_id tidak boleh diubah di sini
            'berat_hasil_ubinan'   => 'nullable|numeric',
            'jumlah_rumpun'        => 'nullable|integer',
            'luas_lahan'           => 'nullable|numeric',
            'cara_penanaman'       => 'nullable|string',
            'jenis_pupuk'          => 'nullable|string',
            'penanganan_hama'      => 'nullable|string',
            'fenomena_id'          => 'nullable|exists:fenomena,id',
            'status'               => 'required|in:Selesai,Gagal',
            'is_verif'             => 'nullable|boolean',
        ]);

        // Lakukan update
        $hasil->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Hasil ubinan berhasil diperbarui.',
            'data'    => $hasil->fresh(),  // kembalikan data terbaru (opsional)
        ], 200);
    }
}
