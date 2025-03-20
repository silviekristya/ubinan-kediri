<?php 

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SegmenStore extends Controller
{
    /**
     * Store a new Segment baru.
 */
    public function v1(Request $request): JsonResponse
    {
        // Mulai transaksi database untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make(
                $request->all(),
                [
                    'id_segmen' => ['required', 'string', 'max:100'],
                    'nama_segmen' => ['required','string'],
                ],
                [
                    'id_segmen.required' => 'ID Segmen tidak boleh kosong.',
                    'nama_segmen.required' => 'Nama Segmen tidak boleh kosong.',
                ]
            );
            // Jika validasi gagal
            if ($validated->fails()) {
                // Gabungkan semua pesan error menjadi string tunggal
                $errorMessages = [];
                foreach ($validated->errors()->all() as $error) {
                    $errorMessages[] = $error; // Tambahkan setiap pesan error ke dalam array
                }

                // Batalkan transaksi database
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal: ' . implode(', ', $validated->errors()->all()),
                    'errors' => $validated->errors(),
                ], 422);
            }
            
            // Simpan data segmen
            $segmen = Segmen::create([
                'id_segmen' => $request->input('id_segmen'),
                'nama_segmen' => $request->input('nama_segmen'),
            ]);

            // Commit transaksi database
            DB::commit();

            // Kirim response JSON
            return response()->json([
                'status' =>'success',
                'message' => 'Mitra berhasil ditambahkan.',
                'segmen' => $segmen,
            ]);
        } catch (\Exception $e) {
            // Rollback transaksi database
            DB::rollBack();

            // Kirim response JSON
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan segmen: ' . $e->getMessage(),
            ], 500);
        }
    }
}