<?php

namespace App\Http\Controllers\Dashboard\Admin\Option; 

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SlsAvailableListOption extends Controller     
{
    public function v1(Request $request)
    {
        $blok = $request->query('blok_sensus');
        Log::info('Param blok_sensus:', ['blok_sensus' => $blok]);

        try {
            if ($blok) {
                $sls = Sls::select('id', 'nama_sls as text')
                            ->where('bs_id', $blok)
                            ->orderBy('nama_sls')
                            ->get();
            } else {
                $sls = collect([]);
            }
            return response()->json(['nama_sls' => $sls]);
        } catch (\Exception $e) {
            Log::error('Error fetching Sls: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}