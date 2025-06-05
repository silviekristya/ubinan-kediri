<?php 

namespace App\Http\Controllers\Dashboard\Admin\Alokasi;

use App\Models\Sampel;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use App\Models\TemplateNotifikasi;
use App\Http\Controllers\Controller;
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

        // Load relasi tim dan pml, pcl
        $sampel->load('tim.pml', 'pcl');

        // Ambil data PML dari tim
        $pml = $sampel->tim && $sampel->tim->pml ? $sampel->tim->pml : null;

        // Cari semua template_notifikasi untuk PengumumanSampelPML (email dan whatsapp)
        $templates = TemplateNotifikasi::where('tipe_notifikasi', 'PengumumanSampelPML')
            ->whereIn('jenis', ['Email', 'WhatsApp'])
            ->get();

        if ($pml) {
            foreach ($templates as $template) {
                Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $sampel->tim_id,
                    'pml_id'                 => $pml->id,
                    'pcl_id'                 => null,
                    'email'                  => $pml->user->email ?? '',
                    'no_wa'                  => $pml->no_telepon ?? '',
                    'sampel_id'              => $sampel->id,
                    'pengecekan_id'          => null, // isi jika ada data
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => now(),
                ]);
            }
        }

        return response()->json([
            'message' => 'PML berhasil diperbarui',
            'sampel'  => $sampel,
        ]);
    }
}

