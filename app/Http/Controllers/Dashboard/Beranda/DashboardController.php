<?php

namespace App\Http\Controllers\Dashboard\Beranda;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {

        return Inertia::render('Dashboard/Beranda/Dashboard', [
        ]);
    }
}
