<?php 

namespace App\Http\Controllers\Dashboard\Admin\Alokasi;

use App\Models\Sampel;
use App\Models\Notifikasi;
use Illuminate\Http\Request;
use App\Models\TemplateNotifikasi;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

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
        $pcl = $sampel->pcl;
        $pml = $sampel->tim && $sampel->tim->pml ? $sampel->tim->pml : null;

        // Cari semua template_notifikasi untuk PengumumanSampelPCL (email dan whatsapp)
        $templates = TemplateNotifikasi::where('tipe_notifikasi', 'PengumumanSampelPCL')
            ->whereIn('jenis', ['Email', 'WhatsApp'])
            ->get();

        if ($pcl && $pml) {
            foreach ($templates as $template) {
                Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $sampel->tim_id,
                    'pml_id'                 => $pml->id,
                    'pcl_id'                 => $pcl->id,
                    'email'                  => $pcl->user->email ?? '',
                    'no_wa'                  => $pcl->no_telepon ?? '',
                    'sampel_id'              => $sampel->id,
                    'pengecekan_id'          => null, // isi jika ada data
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => now(),
                ]);
            }
        }

        return response()->json([
            'message' => 'PCL berhasil diperbarui',
            'sampel'  => $sampel,
        ]);
    }
}