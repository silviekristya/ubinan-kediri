<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Periksa apakah pengguna terautentikasi dan memiliki peran 'ADMIN'
        if (Auth::check() && Auth::user()->role === 'ADMIN') {
            return $next($request);
        }

        // Jika tidak, redirect atau kembalikan response yang sesuai
        return redirect()->route('dashboard.beranda')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    }
}
