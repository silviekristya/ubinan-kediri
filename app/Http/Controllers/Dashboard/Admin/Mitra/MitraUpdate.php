<?php

namespace App\Http\Controllers\Dashboard\Admin\Mitra;

use App\Http\Controllers\Controller;
use App\Models\Mitra;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MitraUpdate extends Controller
{
    /**
     * Update data Mitra.
     */
    public function v1(Request $request, Mitra $mitra): JsonResponse
    {
        // Mulai transaksi untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make($request->all(), [
                'nama' => ['required', 'string', 'max:255'],
                'no_telepon' => ['nullable', 'string', 'max:15', 'unique:pegawai,no_telepon,' . $mitra->id],
                'identitas' => ['nullable', 'string', 'max:255'],
            ]);

            // Jika validasi gagal
            if ($validated->fails()) {
                // Ubah pesan error agar lebih jelas
                $customErrors = [];
                foreach ($validated->errors()->toArray() as $key => $error) {
                    $customErrors[$key] = $error;
                    if ($key === 'role') {
                        $customErrors[$key] = ['Role yang dipilih tidak valid. Pilih antara ADMIN atau PEGAWAI.'];
                    }
                }

                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal.',
                    'errors' => $customErrors,
                ], 422);
            }

            // Update data mitra
            $mitra->update([
                'nama' => $request->input('nama'),
                'no_telepon' => $request->input('no_telepon'),
                'identitas' => $request->input('identitas'),
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Data mitra berhasil diperbarui.',
                'mitra' => $mitra, // Kirim data mitra yang diperbarui
            ]);

        } catch (\Exception $e) {
            // Rollback transaksi jika ada kesalahan
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data mitra.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
