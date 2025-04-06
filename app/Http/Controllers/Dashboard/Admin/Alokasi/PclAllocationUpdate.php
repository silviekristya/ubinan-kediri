<?php 

namespace App\Http\Controllers\Dashboard\Admin\Alokasi;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PclAllocationUpdate extends Controller
{
    public function v1(Request $request, $id)
    {
        $request->validate([
            'pcl_id' => 'required|exists:mitra,id',
        ]);

        $sampel = Sampel::findOrFail($id);
        if (!$sampel->tim_id) {
            return response()->json([
                'message' => 'Pilih PML terlebih dahulu'
            ], 400);
        }

        $sampel->pcl_id = $request->input('pcl_id');
        $sampel->save();

        // Load relasi agar data sampel punya info PML dan PCL
        $sampel->load('tim.pml', 'pcl');

        // Log data sampel setelah update
        Log::info("Sampel setelah update PCL:", $sampel->toArray());

        return response()->json([
            'message' => 'PCL berhasil diperbarui',
            'sampel'  => $sampel,
        ]);
    }
}