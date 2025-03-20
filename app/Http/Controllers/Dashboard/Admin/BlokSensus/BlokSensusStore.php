<?php

namespace App\Http\Controllers\Dashboard\Admin\BlokSensus;

use App\Http\Controllers\Controller;
use App\Models\BlokSensus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BlokSensusStore extends Controller
{
    /**
     * Simpan Blok Sensus baru.
     */
    public function v1(Request $request): JsonResponse
    {
        //Mulai transaksi database untuk menjaga konsistensi data
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make(
                $request->all(), 
                [
                'nomor_bs' => ['required', 'string','unique:blok_sensus,nomor_bs'],
                ],
                [
                    'nomor_bs.unique' => 'Nomor Blok Sensus sudah terdaftar. Silakan gunakan nomor yang lain.',
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

            // Simpan Blok Sensus baru
            $blokSensus = BlokSensus::create([
                'nomor_bs' => $request->nomor_bs,
            ]);

            // Commit transaksi
            DB::commit();

            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Blok Sensus berhasil ditambahkan.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Blok Sensus gagal ditambahkan.',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}

