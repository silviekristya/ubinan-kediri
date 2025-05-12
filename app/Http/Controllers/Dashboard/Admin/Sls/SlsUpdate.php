<?php

namespace App\Http\Controllers\Dashboard\Admin\Sls;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SlsUpdate extends Controller
{
    /**
     * Update data Sls.
     */
    public function v1(Request $request, Sls $sls): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = $request->validate([
                'nama_sls' => ['required', 'string', 'max:255'],
            ], [
                'nama_sls.required' => 'SLS tidak boleh kosong.',
            ]);

            // Update data Sls
            $sls->update([
                'nama_sls' => $validated['nama_sls'],
            ]);

            // Load relasi blokSensus agar nomor_bs tersedia
            $sls->load('blokSensus:id,nomor_bs');

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data SLS berhasil diperbarui.',
                'updatedNamaSls' => [
                    'id'        => $sls->id,
                    'nama_sls'  => $sls->nama_sls,
                    'id_bs'     => $sls->id_bs,
                    'nomor_bs'  => $sls->blokSensus->nomor_bs ?? null,
                ],
            ]);
        }
        catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->errors(),
            ], 422);
        }
        catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage(),
            ], 500);
        }
    }
}
