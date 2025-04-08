<?php

namespace App\Http\Controllers\Dashboard\Mitra\Sampel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sampel; 
use Inertia\Inertia;

class SampelList extends Controller
{
    /**
     * Menampilkan daftar sampel yang sesuai dengan mitra yang sedang login.
     */
    public function v1(Request $request)
    {
        $user = Auth::user();

        // Pastikan user memiliki relasi mitra
        if (!$user->mitra) {
            return redirect()->route('dashboard.beranda')
                ->with('error', 'Anda tidak memiliki akses ke halaman ini.');
        }

        // Ambil ID mitra dari relasi user
        $mitraId = $user->mitra->id;

        // Ambil data sampel yang hanya memiliki pcl_id sama dengan ID mitra
        $sampel = Sampel::with('tim.pml')->where('pcl_id', $mitraId)->get();

        // Kembalikan view dengan data sampel
        return Inertia::render('Dashboard/Mitra/Sampel/ListSampel', [
            'sampel' => $sampel,
        ]);
    }
}
