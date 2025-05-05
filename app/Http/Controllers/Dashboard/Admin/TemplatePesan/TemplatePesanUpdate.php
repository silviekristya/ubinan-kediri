<?php

namespace App\Http\Controllers\Dashboard\Admin\TemplatePesan;

use App\Http\Controllers\Controller;
use App\Models\TemplatePesan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TemplatePesanUpdate extends Controller
{
    /**
     * Update template pesan berdasarkan ID.
     */
    public function v1(Request $request, int $id): JsonResponse
    {
        // Mulai transaksi
        DB::beginTransaction();

        try {
            // Validasi input
            $validated = Validator::make(
                $request->all(),
                [
                    'nama' => ['required', 'string', 'max:255'],
                    'isi'  => ['required', 'string'],
                ],
                [
                    'nama.required' => 'Nama template pesan tidak boleh kosong.',
                    'isi.required'  => 'Isi template pesan tidak boleh kosong.',
                ]
            );

            if ($validated->fails()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Validasi gagal: ' . implode(', ', $validated->errors()->all()),
                    'errors'  => $validated->errors(),
                ], 422);
            }

            // Cari template yang akan diupdate
            $template = TemplatePesan::find($id);
            if (! $template) {
                return response()->json([
                    'status'  => 'error',
                    'message' => "Template dengan ID {$id} tidak ditemukan.",
                ], 404);
            }

            // Update data
            $data = $validated->validated();
            $template->update([
                'nama_template' => $data['nama'],
                'text'          => $data['isi'],
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Template pesan berhasil diperbarui.',
                'data'    => $template,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui template pesan.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
