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
        // $sampel = Sampel::with('nama_sls')->get();
        $sampel = Sampel::with('namaSls.blokSensus')->get();
        $sampel = Sampel::with('tim.pml')->get();
        
        return Inertia::render('Dashboard/Admin/Sampel/ListSampel', [
            'sampel' => $sampel,
        ]);
    }
}
