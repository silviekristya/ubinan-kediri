<?php 

namespace App\Http\Controllers\Dashboard\Admin\NamaSls;

use App\Http\Controllers\Controller;
use App\Models\NamaSls;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NamaSlsDelete extends Controller
{
    /**
     * Delete data NamaSls.
     */
    public function v1(NamaSls $namaSls): JsonResponse
    {
        $namaSls->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Nama SLS berhasil dihapus',
        ]);
    }
}