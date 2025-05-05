<?php
namespace App\Http\Controllers\Dashboard\Beranda;

use App\Http\Controllers\Controller;
use App\Models\Pengecekan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function v1(Request $request)
    {
    $user = $request->user();

    $query = Pengecekan::with(['sampel.pcl','sampel.tim.pml'])
        ->whereNotNull('tanggal_panen')
        ->whereBetween('tanggal_panen', [
            now()->startOfMonth(),
            now()->addMonths(2)->endOfMonth(),
        ]);

    // Filter sesuai role
    if (optional($user->pegawai)->role === 'ADMIN') {
            // no filter
    }elseif (
        optional($user->pegawai)->role === 'PEGAWAI' &&
        optional($user->pegawai)->is_pml
    ) {
        $query->whereHas('sampel.tim', function($q) use ($user) {
        $q->where('pml_id', $user->pegawai->id);
        });
    }elseif ($user->mitra) {
        $query->whereHas('sampel', function($q) use ($user) {
            $q->where('pcl_id', $user->mitra->id);
        });    }else {
            abort(403, 'Anda tidak memiliki akses ke kalender ini.');
        }
    
    // Build array event
    $events = $query->get()->map(fn($cek) => [
        'date'        => $cek->tanggal_panen->toDateString(),
        'title'       => "Panen: PCL {$cek->sampel->pcl->nama}",
        'subtitle'    => $cek->sampel->tim->pml->nama, 
    ]);

    return Inertia::render('Dashboard/Beranda/Dashboard', [
        'events' => $events,
    ]);
    }

}
