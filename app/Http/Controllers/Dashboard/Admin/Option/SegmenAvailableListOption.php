<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SegmenAvailableListOption extends Controller
{
    /**
     * Return daftar Segmen, optional difilter berdasarkan kecamatan.
     */
    public function v1(Request $request)
    {
        $kecamatan = $request->query('kecamatan');
        Log::info('Param kecamatan untuk segmen:', ['kecamatan' => $kecamatan]);

        try {
            // Query dasar: ambil id_segmen => id, nama_segmen => text
            $query = Segmen::select('id_segmen as id', 'nama_segmen as text');

            // Jika ada filter kecamatan, tambahkan where
            if ($kecamatan) {
                $query->where('kecamatan_id', $kecamatan);
            }

            // Urutkan dan eksekusi
            $segmen = $query
                ->orderBy('id_segmen')
                ->get();

            return response()->json(['segmen' => $segmen]);
        } catch (\Exception $e) {
            Log::error('Error fetching Segmen: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
