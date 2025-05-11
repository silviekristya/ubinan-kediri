<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\KabKota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class KabKotaAvailableListOption extends Controller
{
    public function v1(Request $request)
    {
        $provinsi = $request->query('provinsi');
        Log::info('Param provinsi:', ['provinsi' => $provinsi]);

        try {
            // Query dasar: ambil id + nama
            $query = KabKota::select('id', 'nama_kab_kota as text');

            // Jika ada filter provinsi, tambahkan where
            if ($provinsi) {
                $query->where('provinsi_id', $provinsi);
            }

            // Urutkan dan eksekusi
            $kabkota = $query
                ->orderBy('nama_kab_kota')
                ->get();

            return response()->json(['kab_kota' => $kabkota]);
        } catch (\Exception $e) {
            Log::error('Error fetching KabKota: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}