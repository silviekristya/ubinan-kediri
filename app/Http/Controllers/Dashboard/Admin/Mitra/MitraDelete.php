<?php

namespace App\Http\Controllers\Dashboard\Admin\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Mitra;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MitraDelete extends Controller
{
    /**
     * Hapus Mitra berdasarkan ID.
     */
    public function v1(Mitra $mitra): JsonResponse
    {
        $mitra->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Mitra berhasil dihapus',
        ]);
    }
}
