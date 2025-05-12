<?php

namespace App\Http\Controllers\Dashboard\Admin\Sls;

use App\Http\Controllers\Controller;
use App\Models\Sls;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SlsStore extends Controller
{
    public function v1(Request $request): JsonResponse
    {
        try {
            // Validasi dasar
            $validator = Validator::make($request->all(), [
                'bs_id'    => ['required', 'exists:blok_sensus,id_bs'],
                'nama_sls' => ['required', 'string', 'max:255'],
            ], [
                'bs_id.required'    => 'Pilih Blok Sensus terlebih dahulu.',
                'bs_id.exists'      => 'Blok Sensus tidak valid.',
                'nama_sls.required' => 'SLS tidak boleh kosong.',
            ]);

            // Cek duplikat: sama bs_id dan nama_sls
            $validator->after(function ($validator) use ($request) {
                if (Sls::where('bs_id', $request->input('bs_id'))
                       ->where('nama_sls', $request->input('nama_sls'))
                       ->exists()) {
                    $validator->errors()->add(
                        'nama_sls',
                        'SLS "' . $request->input('nama_sls') . '" untuk blok sensus ini sudah terdaftar.'
                    );
                }
            });

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Validasi gagal.',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            // Simpan data
            $new = Sls::create([
                'bs_id'    => $request->input('bs_id'),
                'nama_sls' => $request->input('nama_sls'),
            ]);

            // Load relasi untuk nomor_bs
            $new->load(['blokSensus:id_bs,nomor_bs']);

            return response()->json([
                'status'     => 'success',
                'message'    => 'SLS berhasil ditambahkan.',
                'newNamaSls' => [
                    'id'       => $new->id,
                    'nama_sls' => $new->nama_sls,
                    'bs_id'    => $new->bs_id,
                    'nomor_bs' => optional($new->blokSensus)->nomor_bs ?: '-',
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
