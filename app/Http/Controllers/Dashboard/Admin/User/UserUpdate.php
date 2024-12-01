<?php

namespace App\Http\Controllers\Dashboard\Admin\User;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserUpdate extends Controller
{
    /**
     * Update User data.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        // Validasi input yang masuk
        $validated = Validator::make($request->all(), [
            'role' => ['required', 'string', 'max:20'],
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validated->errors(),
            ], 422);
        }

        $user->update([
            'role' => $request->role,
        ]);

        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diperbarui',
        ]);
    }
}
