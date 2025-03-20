<?php 

namespace App\Http\Controllers\Dashboard\Admin\NamaSls;

use App\Http\Controllers\Controller;
use App\Models\NamaSls;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class NamaSlsUpdate extends Controller
{
    /**
     * Update data NamaSls.
     */
    public function v1(Request $request, NamaSls $namaSls): JsonResponse
    {
        // Mulai transaksi untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make($request->all(), [
                'id' => ['required', 'string', 'max:100'],
                'nama_sls' => ['required', 'string'],
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

            // Update data NamaSls
            $namaSls->update([
                'id' => $request->input('id'),
                'nama_sls' => $request->input('nama_sls'),
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Data Nama SLS berhasil diperbarui.',
                'namaSls' => $namaSls, // Kirim data Nama SLS yang diperbarui
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi error
            DB::rollBack();

            // Kembalikan response error
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data Nama SLS.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}