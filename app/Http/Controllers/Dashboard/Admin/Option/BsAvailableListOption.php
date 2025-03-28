<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\BlokSensus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class BsAvailableListOption extends Controller
{
    /**
     * Display a listing of Blok Sensus with related User data.
     */
    public function v1(Request $request): JsonResponse
    {
        $blokSensus = BlokSensus::select('id', 'nomor_bs')->get();
        return response()->json(['blok_sensus' => $blokSensus]);
    }
}   