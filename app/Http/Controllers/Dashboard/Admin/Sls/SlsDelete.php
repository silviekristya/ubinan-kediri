<?php 

namespace App\Http\Controllers\Dashboard\Admin\Sls;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlsDelete extends Controller
{
    /**
     * Delete data Sls.
     */
    public function v1(Sls $sls): JsonResponse
    {
        $sls->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'SLS berhasil dihapus',
        ]);
    }
}