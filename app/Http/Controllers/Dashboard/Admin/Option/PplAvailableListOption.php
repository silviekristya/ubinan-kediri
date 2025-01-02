<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\Mitra;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PplAvailableListOption extends Controller
{
    /**
     * Display a listing of Mitra with related User data.
     */
    public function v1(Request $request): JsonResponse
    {
        // Ambil tim_id dari request
        $timId = $request->query('tim_id');

        $mitra = Mitra::query();

        // Jika tim_id diberikan, ambil PPL yang terkait dengan tim tersebut
        if ($timId) {
            $mitra->where('tim_id', $timId);
        } else {
            // Jika tidak, ambil yang belum terikat dengan tim
            $mitra->whereDoesntHave('tim');
        }

        return response()->json(['mitra' => $mitra->get()]);
    }
}
