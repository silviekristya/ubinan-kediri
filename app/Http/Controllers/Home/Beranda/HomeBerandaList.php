<?php

namespace App\Http\Controllers\Home\Beranda;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Application;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class HomeBerandaList extends Controller
{
    public function v1()
    {
        return Inertia::render('Home/Index', [
            'canLogin' => Route::has('login'),
        ]);
    }
}
