<?php

namespace App\Http\Controllers\Dashboard\Admin\Tim;

use App\Models\Tim;
use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class TimStore extends Controller
{
    /**
     * Simpan Tim baru.
     */
    public function v1(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validasi data
            $validated = Validator::make($request->all(), [
                'nama_tim' => ['required', 'string', 'max:255', 'unique:tim,nama_tim'],
                'pml_id' => ['required', 'exists:pegawai,id'], // Validasi PML
                'ppl_ids' => ['required', 'array'], // Daftar PPL
                'ppl_ids.*' => ['exists:mitra,id', 'distinct', function ($attribute, $value, $fail) {
                    if (Mitra::where('id', $value)->whereNotNull('tim_id')->exists()) {
                        $fail('Mitra dengan ID ' . $value . ' sudah terdaftar di tim lain.');
                    }
                }],
            ]);

            // Jika validasi gagal
            if ($validated->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validated->errors()], 422);
            }

            // Buat tim baru
            $tim = Tim::create([
                'nama_tim' => $request->nama_tim,
                'pml_id' => $request->pml_id,
            ]);

            // Update tim_id di tabel mitra secara batch (lebih cepat dan efisien)
            Mitra::whereIn('id', $request->ppl_ids)->update(['tim_id' => $tim->id]);

            DB::commit();

            // Kembalikan respons sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Tim berhasil dibuat.',
                'tim' => $tim->load(['pml', 'ppl']),
            ]);
        } catch (\Exception $e) {
            // Rollback jika terjadi kesalahan
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan tim.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
