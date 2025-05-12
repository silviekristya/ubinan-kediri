<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\BlokSensus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BsAvailableListOption extends Controller
{
    /**
     * Return daftar Blok Sensus, optional difilter berdasarkan kelurahan/desa.
     */
    public function v1(Request $request)
    {
        $keldesa = $request->query('kel_desa');
        Log::info('Param kel_desa:', ['kel_desa' => $keldesa]);

        try {
            // Query dasar: ambil id_bs => id, nomor_bs => text
            $query = BlokSensus::select('id_bs as id', 'nomor_bs as text');

            // Jika ada filter kelurahan/desa, tambahkan where
            if ($keldesa) {
                $query->where('kel_desa_id', $keldesa);
            }

            // Urutkan dan eksekusi
            $blok = $query
                ->orderBy('nomor_bs')
                ->get();

            // Kembalikan dengan key yang lebih ringkas
            return response()->json(['bs' => $blok]);
        } catch (\Exception $e) {
            Log::error('Error fetching BlokSensus: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
