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
    /**
     * Perbarui Blok Sensus.
     */
    public function v1(Request $request, BlokSensus $blokSensus): JsonResponse
    {
        DB::beginTransaction();

        try {
            // hitung calon primary key baru
            $newIdBs = $request->input('kel_desa_id') . $request->input('nomor_bs');

            // validasi dasar nomor_bs & kel_desa_id
            $validator = Validator::make($request->all(), [
                'nomor_bs'    => ['required', 'string', 'size:4'],
                'kel_desa_id' => ['required', 'string', 'size:10', 'exists:kel_desa,id'],
            ], [
                'nomor_bs.size'      => 'Nomor Blok Sensus harus 4 karakter.',
                'kel_desa_id.exists' => 'Kelurahan/desa tidak ditemukan.',
                'kel_desa_id.size'   => 'Format kode kelurahan/desa tidak valid.',
            ]);

            // setelah itu, cek uniknya id_bs
            $validator->after(function ($validator) use ($newIdBs, $blokSensus) {
                // jika id berubah dan sudah ada
                if ($newIdBs !== $blokSensus->id_bs
                    && BlokSensus::where('id_bs', $newIdBs)->exists()
                ) {
                    $validator->errors()->add(
                        'nomor_bs',
                        "Kombinasi Kelurahan/Desa + Nomor ({$newIdBs}) sudah terdaftar."
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

            // update record
            $blokSensus->update([
                'id_bs'       => $newIdBs,
                'nomor_bs'    => $request->input('nomor_bs'),
                'kel_desa_id' => $request->input('kel_desa_id'),
            ]);

            $blokSensus->load('kelDesa');
            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Blok Sensus berhasil diperbarui.',
                'data'    => $blokSensus->fresh()->load('kelDesa'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Blok Sensus gagal diperbarui.',
                'errors'  => $e->getMessage(),
            ], 500);
        }
    }
}
