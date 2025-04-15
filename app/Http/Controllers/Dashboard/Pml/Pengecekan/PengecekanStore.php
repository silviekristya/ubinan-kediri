<?php
// app/Http/Controllers/Dashboard/Pml/Pengecekan/PengecekanStore.php

namespace App\Http\Controllers\Dashboard\Pml\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pengecekan;
use App\Models\Sampel;

class PengecekanStore extends Controller
{
    public function v1(Request $request)
    {
        $data = $request->validate([
            'id'                 => 'required|exists:pengecekan,id',
            'status_sampel'      => 'required|in:Eligible,NonEligible,Belum',
            'id_sampel_cadangan' => 'nullable|exists:sampel,id',
        ]);

        // Cari record pengecekan dan sampel utama
        $cek    = Pengecekan::findOrFail($data['id']);
        $sampel = Sampel::findOrFail($cek->id_sampel);

        // Pastikan sampel ini milik tim PML yang login
        if ($sampel->tim_id !== Auth::user()->pegawai->id) {
            abort(403, 'Anda tidak berwenang memverifikasi ini.');
        }

        // Set status
        $cek->status_sampel = $data['status_sampel'];

        // Jika Non‑eligible, validasi cadangan dan set id_sampel_cadangan
        if ($data['status_sampel'] === 'NonEligible') {
            // Pastikan id_sampel_cadangan milik mitra yang sama (pcl_id)
            $cad = Sampel::where('id', $data['id_sampel_cadangan'])
                ->where('pcl_id', $sampel->pcl_id)
                ->where('jenis_sampel', 'cadangan')
                ->first();

            if (! $cad) {
                abort(422, 'Sampel cadangan tidak valid atau bukan milik mitra yang sama.');
            }

            $cek->id_sampel_cadangan = $cad->id;
        } else {
            // Bersihkan jika sebelumnya ada
            $cek->id_sampel_cadangan = null;
        }

        $cek->save();

        return response()->json([
            'status'     => 'success',
            'message'    => 'Verifikasi berhasil disimpan.',
            'pengecekan' => $cek,
        ]);
    }
}
