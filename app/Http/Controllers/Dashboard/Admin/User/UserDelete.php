<?php

namespace App\Http\Controllers\Dashboard\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserDelete extends Controller
{
    /**
     * Hapus User berdasarkan ID.
     */
    public function v1(User $user): JsonResponse
    {
        $user->delete();

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil dihapus',
        ]);
    }
}
