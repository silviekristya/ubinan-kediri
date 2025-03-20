<?php

namespace App\Http\Controllers\Dashboard\Admin\NamaSls;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\NamaSls;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class NamaSlsStore extends Controller
{
    /**
     * Store data NamaSls.
     */
    public function v1(Request $request): JsonResponse
    {
        // Validasi input
        try {
            $validated = Validator::make(
                $request->all(), 
                [
                'id' => ['required', 'string', 'max:100'],
                'nama_sls' => ['required', 'string'],
                ],
                [
                    'id.required' => 'ID Nama SLS tidak boleh kosong.',
                    'nama_sls.required' => 'Nama SLS tidak boleh kosong.',
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
                   'message' => $validated->errors(),
                ], 422);
            }

            // Simpan data NamaSls
            $namaSls = NamaSls::create([
                'id' => $request->input('id_nama_sls'),
                'nama_sls' => $request->input('nama_sls'),
            ]);

            // Commit transaksi database
            DB::commit();

            // Kirim response JSON
            return response()->json([
                'status' => 'success',
                'message' => 'Data Nama SLS berhasil disimpan.',
                'namaSls' => $namaSls,
            ]);
        } catch (\Exception $e) {
            // Batalkan transaksi database
            DB::rollBack();

            // Kirim response error
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data Nama SLS.',
            ], 500);
        }
    }
}