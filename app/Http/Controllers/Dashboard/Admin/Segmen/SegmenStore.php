<?php

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Models\Segmen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SegmenStore extends Controller
{
    /**
     * Store a new Segmen entry.
     */
    public function v1(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            // Validasi input
            $validator = Validator::make(
                $request->all(),
                [
                    'id_segmen'    => ['required', 'string', 'max:100'],
                    'kode_segmen'  => ['required', 'string', 'max:10'],
                    'nama_segmen'  => ['required', 'string', 'max:255'],
                    'kecamatan_id' => ['required', 'string', 'exists:kecamatan,id'],
                ],
                [
                    'id_segmen.required'    => 'ID Segmen tidak boleh kosong.',
                    'kode_segmen.required'  => 'Kode Segmen tidak boleh kosong.',
                    'nama_segmen.required'  => 'Nama Segmen tidak boleh kosong.',
                    'kecamatan_id.required' => 'Kecamatan tidak boleh kosong.',
                    'kecamatan_id.exists'   => 'Kecamatan yang dipilih tidak valid.',
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Validasi gagal: ' . implode(', ', $validator->errors()->all()),
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $nama_segmen = strtoupper($request->input('nama_segmen'));
            // Buat segmen baru
            $segmen = Segmen::create([
                'id_segmen'    => $request->input('id_segmen'),
                'kode_segmen'  => $request->input('kode_segmen'),
                'nama_segmen'  => $nama_segmen,
                'kecamatan_id' => $request->input('kecamatan_id'),
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Segmen berhasil ditambahkan.',
                'data'    => [
                    'id_segmen'      => $segmen->id_segmen,
                    'kode_segmen'    => $segmen->kode_segmen,
                    'nama_segmen'    => $segmen->nama_segmen,
                    'kecamatan_id'   => $segmen->kecamatan_id,
                    'nama_kecamatan' => optional($segmen->kecamatan)->nama_kecamatan,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menambahkan segmen: ' . $e->getMessage(),
            ], 500);
        }
    }
}
