<?php

namespace App\Http\Controllers\Dashboard\Admin\Pegawai;

use App\Models\User;
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
    public function v1(Request $request): Response
    {
        $pegawai = Pegawai::with('user')->get(); // Ambil pegawai dengan data user terkait
        // Ambil user yang tidak memiliki pegawai
        // $users = User::whereDoesntHave('pegawai')->whereDoesntHave('mitra')->get();

        return Inertia::render('Dashboard/Admin/Pegawai/ListPegawai', [
            'pegawai' => $pegawai,
            // 'users' => $users,
        ]);
    }
}
