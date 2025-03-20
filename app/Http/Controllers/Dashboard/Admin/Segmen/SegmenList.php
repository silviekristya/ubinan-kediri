<?php

namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Segmen;
use Illuminate\Http\Request;

class SegmenList extends Controller
{
    /**
     * Display a listing of Segmen.
     */
    public function v1(Request $request): Response
    {
        $segmen = Segmen::all(); // Ambil semua data Segmen

        return inertia::render('Dasboard/Admin/Segmen/ListSegmen', [
            // 'status' => 'success',
            // 'message' => 'Berhasil mengambil data Segmen.',
            'segmen' => $segmen,
        ]);
    }
}