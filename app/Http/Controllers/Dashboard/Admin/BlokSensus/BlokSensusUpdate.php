<?php
namespace App\Http\Controllers\Dashboard\Admin\BlokSensus;

use App\Http\Controllers\Controller;
use App\Models\BlokSensus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BlokSensusUpdate extends Controller
{
    public function v1(Request $request, BlokSensus $blokSensus) : JsonResponse
    {
        // Mulai transaksi untuk menjaga konsistensi data
        DB::beginTransaction();
        // Jika terdapat error saat melakukan update, transaksi akan dibatalkan
        try {
            // Validasi input
            $validated = Validator::make(request()->all(), [
                'nomor_bs' => ['required', 'string'],
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
                    'errors' => $validated->errors(),
                ], 422);
            }
    
            // Update Blok Sensus berdasarkan ID
            $blokSensus->update([
                'nomor_bs' => request()->input('nomor_bs'),
            ]);
    
    
            // Commit transaksi
            DB::commit();
    
            // Kembalikan response sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Blok Sensus berhasil diperbarui.',
                'data' => $blokSensus, // Kirim data Blok Sensus yang diperbarui
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Blok Sensus gagal diperbarui.',
                'errors' => $e->getMessage(),
            ], 500);
        }
    } 
}