<?php 

namespace App\Http\Controllers\Dashboard\Pml\Sampel;

use App\Http\Controllers\Controller;
use App\Models\Sampel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SampelList extends Controller
{
    /**
     * Menampilkan daftar sampel yang sesuai dengan pml yang sedang login.
     */
    public function v1(Request $request)
    {
        $user = Auth::user();

        // Pastikan user memiliki relasi pegawai
        if (!$user->pegawai || !$user->pegawai->is_pml) {
            return redirect()->route('dashboard.beranda')
                ->with('error', 'Anda tidak memiliki akses ke halaman ini.');
        }

        // Ambil ID pml dari relasi user
        $pmlId = $user->pegawai->id;

        // Ambil data sampel yang hanya memiliki pml_id sama dengan ID pml
        $sampel = Sampel::with('pcl')
        ->whereHas('tim', function ($query) use ($pmlId) {
            $query->where('pml_id', $pmlId);
        })
        ->get();
    
        // Kembalikan view dengan data sampel   
        return Inertia::render('Dashboard/Pml/Sampel/ListSampel', [
            'sampel' => $sampel,
        ]);
    }
}