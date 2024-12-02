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
            'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
            'email'=> ['required', 'string','email','max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validated->errors(),
            ], 422);
        }


        // Update user data
        $user->username = $request->input('username');
        $user->email = $request->input('email');

        // Update password hanya jika diisi
        if (!empty($request->input('password'))) {
            $user->password = bcrypt($request->input('password'));
        }

        $user->save();


        // Kembalikan response JSON dengan status sukses
        return response()->json([
            'status' => 'success',
            'message' => 'User berhasil diperbarui',
        ]);
    }
}
