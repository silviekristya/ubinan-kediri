<?php

namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Models\Sampel;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SampelList extends Controller
{
    /**
     *
     */
    public function v1(Request $request): Response
    {
        $sampel = Sampel::all();

        return Inertia::render('Dashboard/Admin/Sampel/ListSampel', [
            'sampel' => $sampel,
        ]);
    }
}
