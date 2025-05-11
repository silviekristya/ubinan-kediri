<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class KecamatanAvailableListOption extends Controller
{
    public function v1(Request $request)
    {
        $kabkota = $request->query('kab_kota');
        Log::info('Param kab_kota:', ['kab_kota' => $kabkota]);

        try {
            // Bangun query dasarnya: ambil id + nama
            $query = Kecamatan::select('id', 'nama_kecamatan as text');

            // Kalau ada param kab_kota, tambahkan where-nya
            if ($kabkota) {
                $query->where('kab_kota_id', $kabkota);
            }

            // Urut dan eksekusi
            $kecamatan = $query
                ->orderBy('nama_kecamatan')
                ->get();

            return response()->json(['kecamatan' => $kecamatan]);
        } catch (\Exception $e) {
            Log::error('Error fetching Kecamatan: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}