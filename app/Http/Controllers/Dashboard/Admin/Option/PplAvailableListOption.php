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

        $mitraQuery = Mitra::query();

        // Jika tim_id diberikan, ambil PPL yang terkait dengan tim tersebut atau yang belum terikat dengan tim
        if ($timId) {
            $mitraQuery->where(function ($query) use ($timId) {
                $query->where('tim_id', $timId) // PPL yang terkait dengan tim
                    ->orWhereNull('tim_id'); // Atau yang belum terikat dengan tim
            });
        } else {
            // Jika tidak ada tim_id, ambil hanya yang belum terikat dengan tim
            $mitraQuery->whereNull('tim_id');
        }

        // Eksekusi query dan kembalikan hasil dalam format JSON
        $mitra = $mitraQuery->get();

        return response()->json(['mitra' => $mitra]);
    }
}
