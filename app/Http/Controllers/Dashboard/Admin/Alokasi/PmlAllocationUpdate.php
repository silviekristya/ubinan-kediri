<?php 

namespace App\Http\Controllers\Dashboard\Admin\Alokasi;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; 

class PmlAllocationUpdate extends Controller
{
    public function v1(Request $request, $id)
    {
        $request->validate([
            'tim_id' => 'required|exists:tim,id',
        ]);

        $sampel = Sampel::findOrFail($id);
        Log::info("Sampel ditemukan: ", $sampel->toArray());
        $sampel->tim_id = $request->input('tim_id');
        // Reset PCL apabila PML diubah
        $sampel->pcl_id = null;
        $sampel->save();

        Log::info("Sampel setelah update: ", $sampel->toArray());

        // Load relasi tim dan pml
        $sampel->load('tim.pml');

        return response()->json([
            'message' => 'PML berhasil diperbarui',
            'sampel'  => $sampel,
        ]);
    }
}

