<?php

namespace App\Http\Controllers\Dashboard\Admin\Sls;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class NamaSlsStore extends Controller
{
    public function v1(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_bs'    => ['required', 'exists:blok_sensus,id'],
                'nama_sls' => ['required', 'string', 'max:255'],
            ], [
                'id_bs.required'    => 'Pilih Blok Sensus terlebih dahulu.',
                'id_bs.exists'      => 'Blok Sensus tidak valid.',
                'nama_sls.required' => 'Nama SLS tidak boleh kosong.',
            ]);

            // Simpan data
            $new = Sls::create([
                'id_bs'    => $validated['id_bs'],
                'nama_sls' => $validated['nama_sls'],
            ]);

            // Load relasi blokSensus untuk ambil nomor_bs
            $new->load(['blokSensus:id,nomor_bs']);

            // Pastikan blokSensus ditemukan
            $nomorBs = optional($new->blokSensus)->nomor_bs;

            return response()->json([
                'status'     => 'success',
                'message'    => 'Nama SLS berhasil ditambahkan.',
                'newNamaSls' => [
                    'id'        => $new->id,
                    'nama_sls'  => $new->nama_sls,
                    'id_bs'     => $new->id_bs,
                    'nomor_bs'  => $nomorBs ?? '-',  // fallback aman
                ],
            ], 200);
        }
        catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->errors(),
            ], 422);
        }
        catch (\Throwable $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage(),
            ], 500);
        }
    }
}
