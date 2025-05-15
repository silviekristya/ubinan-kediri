<?php
// app/Http/Controllers/Dashboard/Pml/HasilUbinan/StoreController.php

namespace App\Http\Controllers\Dashboard\Pml\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasilUbinanStore extends Controller
{
    public function v1(Request $request)
    {
        $pmlId = Auth::user()->pegawai->id;

        $data = $request->validate([
            'pengecekan_id'      => 'required|exists:pengecekan,id',
            'tanggal_pencacahan' => 'required|date',
            'status'             => 'required|in:Selesai,Gagal',
            'berat_hasil_ubinan' => 'nullable|numeric',
            'jumlah_rumpun'      => 'nullable|integer',
            'luas_lahan'         => 'nullable|numeric',
            'cara_penanaman'     => 'nullable|string',
            'jenis_pupuk'        => 'nullable|string',
            'penanganan_hama'    => 'nullable|string',
            'fenomena_id'        => 'nullable|exists:fenomena,id',
        ]);

        // pastikan pengecekan berada di bawah PML ini
        $cek = Pengecekan::where('id', $data['pengecekan_id'])
            ->whereHas('sampel.tim', function($q) use ($pmlId) {
                $q->where('pml_id', $pmlId);
            })
            ->firstOrFail();
        
        // Jika pengecekan tidak ditemukan, abort 403
        if (! $cek) {
            abort(403, 'Anda tidak berwenang menambah di pengecekan ini.');
        }

        $h = HasilUbinan::create($data);

        return response()->json([
            'message' => 'Hasil ubinan berhasil disimpan oleh PML.',
            'data'    => $h,
        ], 201);
    }
}
