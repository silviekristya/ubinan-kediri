<?php

namespace App\Http\Controllers\Dashboard\Mitra\Beranda;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard Mitra (kosongan)
     */
    public function index(Request $request): Response
    {
        // Kalau nanti mau kirim data, tambahkan di array kedua
        return Inertia::render('Dashboard/Mitra/Beranda/Dashboard', [
            // 'foo' => 'bar',
        ]);
    }
}
