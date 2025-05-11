<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\Provinsi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProvinsiAvailableListOption extends Controller
{
    public function v1(Request $request)
    {
        try {
            $provinsi = Provinsi::select('kode_provinsi as id', 'nama_provinsi as text')
                                ->orderBy('nama_provinsi')
                                ->get();

            return response()->json(['provinsi' => $provinsi]);
        } catch (\Exception $e) {
            Log::error('Error fetching Provinsi: ' . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi kesalahan server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}