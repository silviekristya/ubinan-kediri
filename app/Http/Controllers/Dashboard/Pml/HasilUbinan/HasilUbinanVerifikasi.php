<?php
// app/Http/Controllers/Dashboard/Pml/HasilUbinan/VerifyController.php

namespace App\Http\Controllers\Dashboard\Pml\HasilUbinan;

use App\Http\Controllers\Controller;
use App\Models\HasilUbinan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HasilUbinanVerifikasi extends Controller
{
    public function v1(Request $request, $id)
    {
        $pmlId = Auth::user()->pegawai->id;
        $h     = HasilUbinan::with('pengecekan.sampel')->findOrFail($id);

        // pastikan pengecekan milik PML ini
        if ($h->pengecekan->sampel->tim_id !== $pmlId) {
            abort(403, 'Anda tidak berwenang memverifikasi ini.');
        }

        $data = $request->validate([
            'is_verif'           => 'required|boolean',
            'id_sampel_cadangan' => 'nullable|exists:sampel,id',
        ]);

        // tandai sudah diverifikasi
        $h->update(['is_verif' => $data['is_verif']]);

        // jika hasil “Gagal”, set sampel pengganti di pengecekan
        if (! $data['is_verif'] && $data['id_sampel_cadangan']) {
            $h->pengecekan->update([
                'id_sampel_cadangan' => $data['id_sampel_cadangan'],
            ]);
        }

        return response()->json([
            'message' => 'Verifikasi berhasil.',
            'data'    => $h], 
            200);
    }
}
