<?php

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SegmenDelete extends Controller
{
    /**
     * Hapus Segmen berdasarkan ID.
     */
    public function v1(Segmen $segmen): JsonResponse
    {
        $segmen->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Segmen berhasil dihapus',
        ]);
    }
}