<?php

namespace App\Http\Controllers\Dashboard\Admin\Tim;

use App\Http\Controllers\Controller;
use App\Models\Tim;
use Illuminate\Http\JsonResponse;

class TimDelete extends Controller
{
    /**
     * Hapus Tim berdasarkan ID.
     */
    public function v1(Tim $tim): JsonResponse
    {
        $tim->pcl()->update(['tim_id' => null]); // Reset tim_id di mitra terkait
        $tim->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tim berhasil dihapus.',
        ]);
    }
}
