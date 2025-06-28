<?php

namespace App\Http\Controllers\Dashboard\Kalender;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;

class KalenderPanenController extends Controller
{
    /**
     * Tampilkan kalender panen sesuai role: Admin, PML, atau Mitra
     */
    public function v1(Request $request): Response
    {
        $user      = $request->user();
        $role      = optional($user->pegawai)->role;
        $isPml     = optional($user->pegawai)->is_pml;
        $userMitra = optional($user->mitra);

        if ($role === 'ADMIN') {
            return app(\App\Http\Controllers\Dashboard\Admin\Kalender\KalenderPanenAdmin::class)
                       ->v1($request);
        }

        if ($role === 'PEGAWAI' && $isPml) {
            return app(\App\Http\Controllers\Dashboard\Pml\Kalender\KalenderPanenPml::class)
                       ->v1($request);
        }

        if ($userMitra) {
            return app(\App\Http\Controllers\Dashboard\Mitra\Kalender\KalenderPanenMitra::class)
                       ->v1($request);
        }

        abort(403);
    }
}
