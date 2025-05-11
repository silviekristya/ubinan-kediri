<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\KelDesa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class KelDesaAvailableListOption extends Controller
{
    public function v1(Request $request)
    {
        $kecamatan = $request->query('kecamatan');
        Log::info('Param kecamatan:', ['kecamatan' => $kecamatan]);

        try {
            // Query dasar ambil id + nama
            $query = KelDesa::select('id', 'nama_kel_desa as text');

            // Jika ada filter kecamatan, tambahkan where
            if ($kecamatan) {
                $query->where('kecamatan_id', $kecamatan);
            }

            // Urutkan dan eksekusi
            $desa = $query
                ->orderBy('nama_kel_desa')
                ->get();

            return response()->json(['kel_desa' => $desa]);
        } catch (\Exception $e) {
            Log::error('Error fetching KelDesa: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}