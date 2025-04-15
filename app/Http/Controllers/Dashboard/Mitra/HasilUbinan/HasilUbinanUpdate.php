<?php
// app/Http/Controllers/Dashboard/Mitra/HasilUbinan/UpdateController.php

namespace App\Http\Controllers\Dashboard\Mitra\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use Illuminate\Http\Request;

class HasilUbinanUpdate extends Controller
{
    /**
     * Perbarui data hasil ubinan yang sudah ada
     */
    public function v1(Request $request, $id)
    {
        $hasil = HasilUbinan::findOrFail($id);

        $data = $request->validate([
            'tanggal_pencacahan'   => 'required|date',
            // pengecekan_id tidak diubah di update
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

        $hasil->update($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Hasil ubinan berhasil diperbarui.',
        ]);
    }
}
