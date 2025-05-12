<?php

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SegmenUpdate extends Controller
{
    /**
     * Update data Segmen.
     */
    public function v1(Request $request, Segmen $segmen): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validasi input
            $validator = Validator::make($request->all(), [
                'kode_segmen'  => ['required', 'string', 'size:2'],
                'nama_segmen'  => ['nullable', 'string', 'max:255'],
                'kecamatan_id' => ['required', 'string', 'size:7', 'exists:kecamatan,id'],
            ], [
                'kode_segmen.size'      => 'Kode Segmen harus tepat 2 karakter.',
                'kecamatan_id.size'     => 'Format Kecamatan ID tidak valid.',
                'kecamatan_id.exists'   => 'Kecamatan yang dipilih tidak ditemukan.',
                'nama_segmen.max'       => 'Nama Segmen maksimal 255 karakter.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Validasi gagal.',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            // Hitung ulang primary key id_segmen
            $newIdSegmen = $request->input('kecamatan_id') . $request->input('kode_segmen');

            // Update fields
            $segmen->update([
                'id_segmen'    => $newIdSegmen,
                'kode_segmen'  => $request->input('kode_segmen'),
                'nama_segmen'  => $request->input('nama_segmen'),
                'kecamatan_id' => $request->input('kecamatan_id'),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Segmen berhasil diperbarui.',
                'data'    => $segmen->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui segmen: ' . $e->getMessage(),
            ], 500);
        }
    }
}
