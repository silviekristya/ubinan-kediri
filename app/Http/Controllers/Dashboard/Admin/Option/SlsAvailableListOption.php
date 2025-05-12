<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SlsAvailableListOption extends Controller
{
    /**
     * Return daftar SLS; jika ada filter blok_sensus, hanya ambil SLS di blok itu,
     * kalau tidak, kembalikan seluruh SLS.
     */
    public function v1(Request $request)
    {
        $blok = $request->query('blok_sensus');
        Log::info('Param blok_sensus:', ['blok_sensus' => $blok]);

        try {
            // Bangun query dasar: id + nama_sls as text
            $query = Sls::select('id', 'nama_sls as text')->orderBy('nama_sls');

            // Jika ada filter blok_sensus, tambahkan where
            if ($blok) {
                $query->where('bs_id', $blok);
            }

            // Eksekusi query
            $sls = $query->get();

            // Kembalikan dengan key 'sls'
            return response()->json(['sls' => $sls]);
        } catch (\Exception $e) {
            Log::error('Error fetching Sls: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
