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
     * Tampilkan daftar Tim dengan data PML dan PPL.
     */
    public function v1(Request $request): Response
    {
        $tim = Tim::with(['pml.user', 'ppl'])->get(); // Ambil relasi PML dan PPL

        // Flatten data
        $tim = $tim->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_tim' => $item->nama_tim,
                'pml' => $item->pml ? $item->pml->nama : '-', // Ambil nama dari PML
                'ppl_count' => $item->ppl ? $item->ppl->count() : 0, // Hitung jumlah PPL
            ];
        });

        return Inertia::render('Dashboard/Admin/Tim/ListTim', [
            'tim' => $tim, // Kirim data yang sudah di-flatten
        ]);
    }

}
