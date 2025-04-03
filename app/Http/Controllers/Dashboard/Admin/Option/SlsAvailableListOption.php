<?php

namespace App\Http\Controllers\Dashboard\Admin\Option; 

use App\Http\Controllers\Controller;
use App\Models\NamaSls;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SlsAvailableListOption extends Controller 
    
    {
        public function v1(Request $request)
        {
            $blokSensus = $request->query('blok_sensus');
            Log::info('Param blok_sensus:', [$blokSensus]);

            try {
                if ($blokSensus) {
                    $namaSls = NamaSls::select('id', 'nama_sls')
                                    ->where('id_bs', $blokSensus)
                                    ->get();
                } else {
                    $namaSls = collect([]);
                }
                return response()->json(['nama_sls' => $namaSls]);
            } catch (\Exception $e) {
                Log::error('Error fetching NamaSls: ' . $e->getMessage());
                return response()->json([
                    'message' => 'Terjadi kesalahan server.',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }