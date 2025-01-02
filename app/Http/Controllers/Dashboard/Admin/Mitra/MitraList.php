<?php

namespace App\Http\Controllers\Dashboard\Admin\Mitra;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Mitra;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MitraList extends Controller
{
    /**
     * Display a listing of Mitra with related User data.
     */
    public function v1(Request $request): Response
    {
        $mitra = Mitra::with('user')->get(); // Ambil Mitra dengan data user terkait
        // Ambil user yang tidak memiliki Mitra
        // $users = User::whereDoesntHave('pegawai')->whereDoesntHave('mitra')->get();

        return Inertia::render('Dashboard/Admin/Mitra/ListMitra', [
            'mitra' => $mitra,
            // 'users' => $users,
        ]);
    }
}
