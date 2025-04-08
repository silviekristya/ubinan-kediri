<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckMitra
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan pengguna sudah terautentikasi
        if (Auth::check()) {
            $user = Auth::user();

            // Periksa apakah data mitra
            if ($user->mitra) {
                return $next($request);
            }
        }

        // Jika role tidak sesuai, redirect dengan pesan error
        return redirect()->route('dashboard.beranda')
            ->with('error', 'Anda tidak memiliki akses ke halaman ini.');
    }
}
