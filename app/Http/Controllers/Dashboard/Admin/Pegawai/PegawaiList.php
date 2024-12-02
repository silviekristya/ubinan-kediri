<?php

namespace App\Http\Controllers\Dashboard\Admin\Pegawai;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PegawaiList extends Controller
{
    /**
     * Display a listing of Pegawai with related User data.
     */
    public function index(Request $request): Response
    {
        $pegawai = Pegawai::with('user')->get(); // Ambil pegawai dengan data user terkait

        return Inertia::render('Dashboard/Admin/Pegawai/ListPegawai', [
            'pegawai' => $pegawai,
        ]);
    }
}
