<?php 

namespace App\Http\Controllers\Dashboard\Admin\Sls;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NamaSlsDelete extends Controller
{
    /**
     * Delete data Sls.
     */
    public function v1(Sls $namaSls): JsonResponse
    {
        $namaSls->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'Nama SLS berhasil dihapus',
        ]);
    }
}