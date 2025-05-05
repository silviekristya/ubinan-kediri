<?php
// app/Http/Controllers/Dashboard/Pml/HasilUbinan/UpdateController.php

namespace App\Http\Controllers\Dashboard\Pml\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasilUbinanUpdate extends Controller
{
    public function v1(Request $request, $id)
    {
        $pmlId = Auth::user()->pegawai->id;

        $h = HasilUbinan::with('pengecekan.sampel')->findOrFail($id);

        // pastikan pengecekan → sampel → tim_id milik PML
        if ($h->pengecekan->sampel->tim_id !== $pmlId) {
            abort(403, 'Anda tidak berwenang mengubah data ini.');
        }

        $data = $request->validate([
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

        $h->update($data);

        return response()->json([
            'message' => 'Hasil ubinan berhasil diperbarui oleh PML.',
            'data'    => $h,
        ]);
    }
}
