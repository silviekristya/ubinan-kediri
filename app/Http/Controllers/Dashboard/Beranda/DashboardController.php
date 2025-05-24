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
        $user  = $request->user();
        $role  = optional($user->pegawai)->role;
        $isPml = optional($user->pegawai)->is_pml;
        $userMitra = optional($user->mitra);

        if ($role === 'ADMIN') {
            return app(\App\Http\Controllers\Dashboard\Admin\Beranda\DashboardController::class)
                      ->index($request);
        } elseif ($role === 'PEGAWAI' && $isPml) {
            return app(\App\Http\Controllers\Dashboard\Pml\Beranda\DashboardController::class)
                      ->index($request);
        } elseif ($userMitra) {
            return app(\App\Http\Controllers\Dashboard\Mitra\Beranda\DashboardController::class)
                      ->index($request);
        }
    }
}
