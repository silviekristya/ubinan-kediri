<?php

namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\Request;

class SampelStore extends Controller
{
    public function v1(Request $request)
    {
        $validated = $request->validate([
            // field umum
            'jenis_sampel'           => ['required','in:Utama,Cadangan'],
            'jenis_tanaman'          => ['required','in:Padi,Palawija'],
            'jenis_komoditas'        => ['nullable','in:Padi,Jagung,Kedelai,Kacang Tanah,Ubi Kayu,Ubi Jalar,Lainnya'],
            'frame_ksa'              => ['nullable','string','max:20'],

            'provinsi_id'            => ['required','string','exists:provinsi,kode_provinsi'],
            'kab_kota_id'            => ['required','string','exists:kab_kota,id'],
            'kecamatan_id'           => ['required','string','exists:kecamatan,id'],

            'nama_lok'               => ['required','string','max:255'],

            // hanya untuk Padi: wajib, tapi dilarang jika bukan Padi
            'segmen_id'              => [
                'required_if:jenis_tanaman,Padi',
                'nullable',
                'string',
                'exists:segmen,id_segmen',
                'prohibited_if:jenis_tanaman,Palawija',
            ],
            'subsegmen'              => [
                'required_if:jenis_tanaman,Padi',
                'nullable','string','max:5',
                'prohibited_if:jenis_tanaman,Palawija',
            ],
            'strata'                 => [
                'required_if:jenis_tanaman,Padi',
                'nullable','string','max:5',
                'prohibited_if:jenis_tanaman,Palawija',
            ],

            // daftar listing
            'bulan_listing'  => [
                'required',
                'string',
                'in:'.implode(',', array_map(fn($n)=>str_pad($n,2,'0',STR_PAD_LEFT), range(1,12)))
            ],
            'tahun_listing'          => ['required','digits:4'],

            'fase_tanam'             => ['nullable','string','max:255'],
            'rilis'                  => ['required','date'],
            'a_random'               => ['required','string','max:255'],
            'nks'                    => ['required','string','max:20'],
            'long'                   => ['required','string'],
            'lat'                    => ['required','string'],
            'subround'       => ['required','string','min:1','max:2'],

            // hanya untuk Palawija: wajib, tapi dilarang jika bukan Palawija
            'kel_desa_id'            => [
                'required_if:jenis_tanaman,Palawija',
                'nullable','string','exists:kel_desa,id'
            ],
            'id_sls'                 => [
                'required_if:jenis_tanaman,Palawija',
                'nullable','integer','exists:sls,id',
                'prohibited_if:jenis_tanaman,Padi',
            ],
            'nama_krt'               => [
                'required_if:jenis_tanaman,Palawija',
                'nullable','string','max:255',
                'prohibited_if:jenis_tanaman,Padi',
            ],
            'perkiraan_minggu_panen' => [
                'required_if:jenis_tanaman,Palawija',
                'nullable','integer',
                'prohibited_if:jenis_tanaman,Padi',
            ],

            // opsional lain
            'pcl_id'                 => ['nullable','integer','exists:mitra,id'],
            'tim_id'                 => ['nullable','integer','exists:tim,id'],
        ]);

        try {
            $sampel = Sampel::create($validated);
            $sampel->load('sls.blokSensus');

            return response()->json([
                'status'  => 'success',
                'message' => 'Data sampel berhasil disimpan.',
                'sampel'  => $sampel,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menyimpan data sampel: ' . $e->getMessage(),
            ], 500);
        }
    }
}
