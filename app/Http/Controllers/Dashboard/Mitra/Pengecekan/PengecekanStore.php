<?php

namespace App\Http\Controllers\Dashboard\Mitra\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sampel;
use App\Models\Pengecekan;

class PengecekanStore extends Controller
{
    /**
     * Simpan data pengecekan (utama atau cadangan) yang di‑submit Mitra
     */
    public function v1(Request $request)
    {
        $data = $request->validate([
            'id_sampel'            => 'required|exists:sampel,id',
            'tanggal_pengecekan'   => 'required|date',
            'nama_responden'       => 'required|string',
            'alamat_responden'     => 'required|string',
            'no_telepon_responden' => 'required|string',
            'tanggal_panen'        => 'required|date',
            'keterangan'          => 'nullable|string',
        ]);

        // Pastikan sampel milik Mitra dan belum dicek
        $sampel = Sampel::where('id', $data['id_sampel'])
            ->where('pcl_id', Auth::user()->mitra->id)
            ->whereDoesntHave('pengecekan')
            ->firstOrFail();

        $pengecekan = Pengecekan::create($data);

        return response()->json([
            'status'      => 'success',
            'message'     => "Data pengecekan untuk sampel “{$sampel->jenis_tanaman}” berhasil disimpan.",
            'pengecekan'  => $pengecekan,
        ]);
    }
}
