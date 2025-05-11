<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\BlokSensus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class BsAvailableListOption extends Controller
{
    /**
     * Display a listing of Blok Sensus with related User data.
     */
    public function v1(Request $request)
    {
        $keldesa = $request->query('kel_desa');
        Log::info('Param kel_desa:', ['kel_desa' => $keldesa]);

        try {
            if ($keldesa) {
                $blok = BlokSensus::select('id_bs as id', 'nomor_bs as text')
                                  ->where('kel_desa_id', $keldesa)
                                  ->orderBy('nomor_bs')
                                  ->get();
            } else {
                $blok = collect([]);
            }

            return response()->json(['blok_sensus' => $blok]);
        } catch (\Exception $e) {
            Log::error('Error fetching BlokSensus: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}   