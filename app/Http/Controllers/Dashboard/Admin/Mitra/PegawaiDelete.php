<?php

namespace App\Http\Controllers\Dashboard\Admin\Pegawai;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PegawaiDelete extends Controller
{
    /**
     * Hapus Pegawai berdasarkan ID.
     */
    public function v1(Pegawai $pegawai): JsonResponse
    {
        $pegawai->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Pegawai berhasil dihapus',
        ]);
    }
}
