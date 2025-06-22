<?php

namespace App\Http\Controllers\Dashboard\Mitra\Pengecekan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Pengecekan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class PengecekanUpdate extends Controller
{
    public function v1(Request $request, Pengecekan $pengecekan)
    {
        Log::info('Pengecekan:', [$pengecekan]);
        // Data baru yang ingin diupdate
        $data = $request->validate([
            'tanggal_panen' => 'required|date',
        ]);

        // Tanggal panen sebelumnya
        $tanggal_panen_lama = $pengecekan->tanggal_panen 
            ? Carbon::parse($pengecekan->tanggal_panen)->startOfDay()
            : null;

        $today = now()->startOfDay();

        // Hitung selisih hari
        $diff = $today->diffInDays($tanggal_panen_lama, false);

        // Validasi: hanya boleh update H-3 hingga H-1 sebelum tanggal panen lama
        if (!in_array($diff, [3, 2, 1])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tanggal panen hanya bisa diubah pada H-3 hingga H-1 sebelum panen.',
            ], 403);
        }

        // Update tanggal_panen
        $pengecekan->tanggal_panen = $data['tanggal_panen'];
        $pengecekan->touch(); // Update timestamp
        $pengecekan->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tanggal panen berhasil diperbarui.',
            'pengecekan' => $pengecekan,
        ]);
    }
}
