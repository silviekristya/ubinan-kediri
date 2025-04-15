<?php 

namespace App\Http\Controllers\Dashboard\Admin\TemplatePesan;

use App\Http\Controllers\Controller;
use App\Models\TemplatePesan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplatePesanDelete extends Controller
{
    /**
     * Hapus Template Pesan berdasarkan ID.
     */
    public function v1(TemplatePesan $templatePesan): JsonResponse
    {
        $templatePesan->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Template pesan berhasil dihapus',
        ]);
    }
}