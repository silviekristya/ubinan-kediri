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
        DB::beginTransaction();

        try {
            // validasi nomor_bs & kel_desa_id dasar
            $validator = Validator::make($request->all(), [
                'nomor_bs'    => ['required', 'string', 'size:4'],
                'kel_desa_id' => ['required', 'string', 'size:10', 'exists:kel_desa,id'],
            ], [
                'nomor_bs.size'      => 'Nomor Blok Sensus harus 4 karakter.',
                'kel_desa_id.exists' => 'Kelurahan/desa tidak ditemukan.',
                'kel_desa_id.size'   => 'Format kode kelurahan/desa tidak valid.',
            ]);

            // hitung id_bs kandidat
            $idBs = $request->input('kel_desa_id') . $request->input('nomor_bs');

            // setelah validasi dasar, cek uniknya id_bs
            $validator->after(function ($validator) use ($idBs) {
                if (BlokSensus::where('id_bs', $idBs)->exists()) {
                    $validator->errors()->add(
                        'nomor_bs',
                        "Blok Sensus dengan kombinasi desa+nomor ({$idBs}) sudah terdaftar."
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
            
            // Buat primary key: gabungkan kel_desa_id + nomor_bs
            $idBs = $request->kel_desa_id . $request->nomor_bs;

            $blok = BlokSensus::create([
                'id_bs'       => $idBs,
                'nomor_bs'    => $request->nomor_bs,
                'kel_desa_id' => $request->kel_desa_id,
            ]);

            $blok->load('kelDesa');

            DB::commit();


            return response()->json([
                'status'  => 'success',
                'message' => 'Blok Sensus berhasil ditambahkan.',
                'data'    => $blok,           // <-- tambahkan ini
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Blok Sensus gagal ditambahkan.',
                'errors'  => $e->getMessage(),
            ], 500);
        }
    }
}
