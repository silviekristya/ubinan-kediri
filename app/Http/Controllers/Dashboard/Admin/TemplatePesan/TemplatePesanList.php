<?php

namespace App\Http\Controllers\Dashboard\Admin\TemplatePesan;

use App\Http\Controllers\Controller;
use App\Models\TemplatePesan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplatePesanList extends Controller
{
    /**
     * Tampilkan semua template pesan.
     */
    public function v1(Request $request)
    {
        $templates = TemplatePesan::all();

        return Inertia::render('Dashboard/Admin/TemplatePesan/ListTemplatePesan', [
            'templatePesan' => $templates,
        ]);
    }
}
