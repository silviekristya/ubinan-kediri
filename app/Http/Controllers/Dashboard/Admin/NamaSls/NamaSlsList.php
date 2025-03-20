<?php

namespace App\Http\Controllers\Dashboard\Admin\NamaSls;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\NamaSls;
use Illuminate\Http\Request;

class NamaSlsList extends Controller
{
    /**
     * Display a listing of NamaSls.
     */
    public function v1(Request $request): Response
    {
        // Ambil semua data NamaSls
        $namaSls = NamaSls::all();

        // Tampilkan data NamaSls ke dalam view
        return inertia::render('Dashboard/Admin/NamaSls/ListNamaSls', [
            'namaSls' => NamaSls::all(),
        ]);
    }
}