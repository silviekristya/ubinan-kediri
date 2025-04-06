<?php 

namespace App\Http\Controllers\Dashboard\Admin\Alokasi;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\Request;

class PclAllocationUpdate extends Controller
{
    public function v1(Request $request, $id)
    {
        $request->validate([
            'pcl_id' => 'required|exists:pcls,id',
        ]);

        $sampel = Sampel::findOrFail($id);
        if (!$sampel->tim_id) {
            return response()->json([
                'message' => 'Pilih PML terlebih dahulu'
            ], 400);
        }

        $sampel->pcl_id = $request->input('pcl_id');
        $sampel->save();

        return response()->json([
            'message' => 'PCL berhasil diperbarui',
            'sample'  => $sampel,
        ]);
    }
}