<?php

namespace App\Http\Controllers\Dashboard\Admin\Tim;

use App\Models\Tim;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TimList extends Controller
{
    /**
     * Tampilkan daftar Tim dengan data PML dan PCL.
     */
    public function v1(Request $request): Response
    {
        $tim = Tim::with(['pml.user', 'pcl'])->get(); // Ambil relasi PML dan PCL

        // Flatten data
        $tim = $tim->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_tim' => $item->nama_tim,
                'pml' => $item->pml ? $item->pml->nama : '-', // Ambil nama dari PML
                'pcl_count' => $item->pcl ? $item->pcl->count() : 0, // Hitung jumlah PCL
            ];
        });

        return Inertia::render('Dashboard/Admin/Tim/ListTim', [
            'tim' => $tim, // Kirim data yang sudah di-flatten
        ]);
    }

}
