<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Http\Controllers\Controller;
use App\Models\Mitra; // Model untuk PCL
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TimPclAvailableListOption extends Controller
{
    /**
     * Mengembalikan daftar PCL untuk tim tertentu.
     * Endpoint: GET /dashboard/admin/option/tim-pcl/{timId}/tim-pcl-available
     */
    public function v1(Request $request, $timId)
    {
        Log::info("Mengambil opsi PCL untuk tim ID: " . $timId);

        // Ambil semua PCL (Mitra) yang memiliki tim_id sesuai parameter
        $pcl = Mitra::where('tim_id', $timId)->get();

        if ($pcl->isEmpty()) {
            Log::info("Tidak ditemukan PCL untuk tim: " . $timId);
        } else {
            Log::info("Ditemukan " . $pcl->count() . " PCL untuk tim ID: " . $timId);
        }

        // Mapping data sehingga hanya mengembalikan id dan nama PCL
        $pclData = $pcl->map(function($pclItem) {
            return [
                'id'   => $pclItem->id,
                'nama' => $pclItem->nama,  // Pastikan model Mitra memiliki atribut 'nama'
            ];
        });

        Log::info("Opsi PCL untuk tim ID $timId:", $pclData->toArray());

        return response()->json([
            'pcl' => $pclData,
        ]);
    }
}
