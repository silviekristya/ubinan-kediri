<?php

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SegmenUpdate extends Controller
{
    /**
     * Update data Segmen.
     */
    public function v1(Request $request, Segmen $segmen): JsonResponse
    {
        // Mulai transaksi untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make($request->all(), [
                'id_segmen' => ['required', 'string', 'max:100'],
                'nama_segmen' => ['required', 'string'],
            ]);

            // Jika validasi gagal
            if ($validated->fails()) {
                // Ubah pesan error agar lebih jelas
                $customErrors = [];
                foreach ($validated->errors()->toArray() as $key => $error) {
                    $customErrors[$key] = $error;
                }

                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal.',
                    'errors' => $customErrors,
                ], 422);
            }

            // Update data segmen
            $segmen->update([
                'id_segmen' => $request->input('id_segmen'),
                'nama_segmen' => $request->input('nama_segmen'),
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Data segmen berhasil diperbarui.',
                'segmen' => $segmen, // Kirim data segmen yang diperbarui
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi error
            DB::rollBack();

            // Kembalikan response error
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data segmen.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}