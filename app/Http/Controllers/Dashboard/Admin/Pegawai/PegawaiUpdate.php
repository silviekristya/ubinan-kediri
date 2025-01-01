<?php

namespace App\Http\Controllers\Dashboard\Admin\Pegawai;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PegawaiUpdate extends Controller
{
    /**
     * Update data Pegawai.
     */
    public function v1(Request $request, Pegawai $pegawai): JsonResponse
    {
        // Mulai transaksi untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make($request->all(), [
                'nama' => ['required', 'string', 'max:255'],
                'no_telepon' => ['nullable', 'string', 'max:15', 'unique:pegawai,no_telepon,' . $pegawai->id],
                'role' => ['required', 'in:ADMIN,PEGAWAI'], // Perbaikan validasi role
                'is_pml' => ['required', 'boolean'],
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

            // Update data Pegawai
            $pegawai->update([
                'nama' => $request->input('nama'),
                'no_telepon' => $request->input('no_telepon'),
                'role' => $request->input('role'),
                'is_pml' => $request->input('is_pml'),
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Data pegawai berhasil diperbarui.',
                'pegawai' => $pegawai, // Kirim data pegawai yang diperbarui
            ]);

        } catch (\Exception $e) {
            // Rollback transaksi jika ada kesalahan
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data pegawai.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
