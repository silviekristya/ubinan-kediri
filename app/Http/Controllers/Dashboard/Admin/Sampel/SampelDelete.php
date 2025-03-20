<?php

namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SampelDelete extends Controller
{
    /**
     * Hapus User berdasarkan ID.
     */
    public function v1(Sampel $sampel): JsonResponse
    {
        $sampel->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dihapus',
        ]);
    }
}
