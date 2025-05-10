<?php

namespace App\Http\Controllers\Dashboard\Admin\Tim;

use App\Models\Tim;
use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class TimUpdate extends Controller
{
    /**
     * Perbarui Tim yang ada.
     */
    public function v1(Request $request, Tim $tim): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validasi data
            $validated = Validator::make($request->all(), [
                'nama_tim' => ['required', 'string', 'max:255', 'unique:tim,nama_tim,' . $tim->id],
                'pml_id' => ['required', 'exists:pegawai,id'],
                'pcl_ids' => ['required', 'array'],
                'pcl_ids.*' => ['exists:mitra,id', 'distinct', function ($attribute, $value, $fail) use ($tim) {
                    // Periksa apakah mitra sudah memiliki tim lain kecuali tim ini sendiri
                    if (Mitra::where('id', $value)->where('tim_id', '!=', $tim->id)->exists()) {
                        $fail('Mitra dengan ID ' . $value . ' sudah terdaftar di tim lain.');
                    }
                }],
            ]);

            if ($validated->fails()) {
                return response()->json(['status' => 'error', 'errors' => $validated->errors()], 422);
            }

            // Update data tim
            $tim->update([
                'nama_tim' => $request->nama_tim,
                'pml_id' => $request->pml_id,
            ]);

            // Reset tim_id untuk semua mitra yang sebelumnya terkait dengan tim ini
            Mitra::where('tim_id', $tim->id)->update(['tim_id' => null]);

            // Update anggota tim (pcl)
            Mitra::whereIn('id', $request->pcl_ids)->update(['tim_id' => $tim->id]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Tim berhasil diperbarui.',
                // 'tim' => $tim->load(['pml', 'pcl']),
                'tim' => $tim->load(['pml']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['status' => 'error', 'message' => 'Gagal memperbarui tim.', 'error' => $e->getMessage()], 500);
        }
    }
}
