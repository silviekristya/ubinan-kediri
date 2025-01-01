<?php

namespace App\Http\Controllers\Dashboard\Admin\Pegawai;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pegawai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PegawaiStore extends Controller
{
    /**
     * Store a new Pegawai with User.
     */
    public function v1(Request $request): JsonResponse
    {
        // Mulai transaksi database untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input dengan custom message
            $validated = Validator::make(
                $request->all(),
                [
                    'user_id' => ['required', 'exists:users,id'], // Pastikan user_id valid
                    'nama' => ['required', 'string', 'max:255'],
                    'no_telepon' => ['nullable', 'string', 'max:15', 'unique:pegawai,no_telepon'],
                    'role' => ['required', 'in:ADMIN,PEGAWAI'],
                    'is_pml' => ['required', 'boolean'],
                ],
                [
                    // Custom error message
                    'no_telepon.unique' => 'Nomor telepon sudah terdaftar. Silakan gunakan nomor yang lain.',
                    'user_id.exists' => 'User tidak ditemukan.',
                ]
            );

            // Jika validasi gagal
            if ($validated->fails()) {
                // Gabungkan semua pesan error menjadi string tunggal
                $errorMessages = [];
                foreach ($validated->errors()->all() as $error) {
                    $errorMessages[] = $error; // Tambahkan setiap pesan error ke dalam array
                }

                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal: ' . implode(', ', $errorMessages), // Gabungkan semua pesan error dengan koma
                    'errors' => $validated->errors(), // Kirim semua pesan error untuk debugging
                ], 422);
            }


            // Ambil user berdasarkan ID
            $user = User::findOrFail($request->input('user_id'));

            // Periksa apakah user sudah menjadi pegawai
            if ($user->pegawai) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User sudah memiliki data pegawai.',
                ], 400);
            }

            // Simpan data pegawai baru
            $pegawai = Pegawai::create([
                'user_id' => $user->id,
                'nama' => $request->input('nama'),
                'no_telepon' => $request->input('no_telepon') ?? null, // Pastikan null jika kosong
                'role' => $request->input('role'),
                'is_pml' => $request->input('is_pml'),
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Pegawai berhasil ditambahkan.',
                'pegawai' => $pegawai->load('user'),
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi error
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menambahkan pegawai. Periksa kembali data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
