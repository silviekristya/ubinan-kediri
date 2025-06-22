<?php
// app/Http/Controllers/Dashboard/Pml/Pengecekan/PengecekanStore.php

namespace App\Http\Controllers\Dashboard\Pml\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pengecekan;
use App\Models\Sampel;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PengecekanStore extends Controller
{
    public function v1(Request $request)
    {
        $data = $request->validate([
            'id'                 => 'required|exists:pengecekan,id',
            'status_sampel'      => 'required|in:Eligible,NonEligible,Belum',
            'id_sampel_cadangan' => 'nullable|exists:sampel,id',
        ]);

        DB::transaction(function () use ($data) {
            $cek    = Pengecekan::findOrFail($data['id']);
            $sampel = Sampel::findOrFail($cek->id_sampel);

            // Cek kepemilikan tim
            if ($sampel->tim->pml_id !== Auth::user()->pegawai->id) {
                abort(403, 'Anda tidak berwenang memverifikasi ini.');
            }

            $tanggalPanen = Carbon::parse($cek->tanggal_panen)->startOfDay();
            $today        = now()->startOfDay();
            $verifAt      = $cek->verif_at ? Carbon::parse($cek->verif_at)->startOfDay() : null;
            $updatedAt    = Carbon::parse($cek->updated_at)->startOfDay();

            $diffTodayToPanen = $tanggalPanen->diffInDays($today, false); // H-3, H-1

            $isVerifikasiAwal = $cek->status_sampel === 'Belum' || $cek->status_sampel === null;

            // Kunci logika di sini:
            $mitraSudahUpdate = $verifAt && $updatedAt->gt($verifAt);
            $isVerifikasiUlang = !$isVerifikasiAwal && $mitraSudahUpdate && in_array($diffTodayToPanen, [3, 1]);

            // Simpan status & waktu verifikasi
            $cek->status_sampel = $data['status_sampel'];
            $cek->verif_at = now();
            $cek->save();

            // Handle cadangan jika NonEligible
            if ($data['status_sampel'] === 'NonEligible') {
                $cad = Sampel::where('id', $data['id_sampel_cadangan'])
                    ->where('pcl_id', $sampel->pcl_id)
                    ->where('jenis_sampel', 'cadangan')
                    ->first();

                if (! $cad) abort(422, 'Sampel cadangan tidak valid atau bukan milik mitra yang sama.');
                $cek->id_sampel_cadangan = $cad->id;
                $cek->save();
                $cad->update(['jenis_sampel' => 'utama']);
            } else {
                $cek->id_sampel_cadangan = null;
                $cek->save();
            }
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Verifikasi berhasil disimpan.',
        ]);
    }
}
