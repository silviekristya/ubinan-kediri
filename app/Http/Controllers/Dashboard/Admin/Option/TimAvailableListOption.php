<?php 

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\Tim;
use App\Http\Controllers\Controller;
use App\Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TimAvailableListOption extends Controller
{
    public function v1()
    {
        // Mengambil data Tim beserta relasi pml (pegawai)
        $tim = Tim::with('pml')->get()->map(function ($tim) {
            $data = [
                'id'        => $tim->id,
                'nama_tim'  => $tim->nama_tim,
                'pml'    => $tim->pml,
            ];
            Log::info("Data tim: ", $data);
            return $data;
        });
        Log::info("Total tim ditemukan: " . count($tim));

        return response()->json([
            'tim' => $tim,
        ]);
    }
}