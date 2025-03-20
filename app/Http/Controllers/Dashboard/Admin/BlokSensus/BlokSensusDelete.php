<?php

namespace App\Http\Controllers\Dashboard\Admin\BlokSensus;

use App\Http\Controllers\Controller;
use App\Models\BlokSensus;
use Illuminate\Http\JsonResponse;
use illuminate\Http\Request;

class BlokSensusDelete extends Controller
{
    /**
     * Hapus Blok Sensus berdasarkan ID.
     */
    public function v1(BlokSensus $blokSensus): JsonResponse
    {
        $blokSensus->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Blok Sensus berhasil dihapus',
        ]);
    }
}