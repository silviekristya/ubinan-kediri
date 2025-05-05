<?php 

namespace App\Http\Controllers\Dashboard\Admin\TemplatePesan;

use App\Http\Controllers\Controller;
use App\Models\TemplatePesan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TemplatePesanStore extends Controller
{
    /**
     * Simpan Template Pesan baru.
     */
    public function v1(Request $request): JsonResponse
    {
        // Mulai transaksi database untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input dengan custom message
            $validated= Validator::make(
                $request->all(),
                [
                    'nama' => ['required', 'string', 'max:255'],
                    'isi' => ['required', 'string'],
                ],
                [
                    // Custom error message
                    'nama.required' => 'Nama template pesan tidak boleh kosong.',
                    'isi.required' => 'Isi template pesan tidak boleh kosong.',
                ]
            );

            // Jika validasi gagal
            if ($validated->fails()) {
                $errors = $validated->errors()->all(); // Ambil semua pesan error

                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal: ' . implode(', ', $errors), // Gabungkan semua pesan error dengan koma
                    'errors' => $validated->errors(), // Kirim semua pesan error untuk debugging
                ], 422);
            }

            // Ambil data dari request
            $data = $validated->validated();

            // Simpan data ke dalam database
            $templatePesan = TemplatePesan::create([
                'nama_template' => $data['nama'],
                'text'          => $data['isi'],
            ]);

            // Commit transaksi jika berhasil
            DB::commit();
            return response()->json([
                'status' => 'success',
                'message' => 'Template pesan berhasil disimpan.',
                'data' => $templatePesan,
            ], 201);
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan template pesan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
