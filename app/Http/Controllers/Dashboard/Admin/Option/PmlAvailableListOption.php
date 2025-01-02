<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class PmlAvailableListOption extends Controller
{
    /**
     * Display a listing of Mitra with related User data.
     */
    public function v1(Request $request): JsonResponse
    {
        // Ambil tim_id dari request
        $timId = $request->query('tim_id');

        $pegawai = Pegawai::query()
            ->where('is_pml', 1);

        // Jika tim_id diberikan, ambil PML yang terkait dengan tim tersebut
        if ($timId) {
            $pegawai->whereHas('tim', function ($query) use ($timId) {
                $query->where('id', $timId);
            });
        } else {
            // Jika tidak, ambil PML yang belum terikat dengan tim
            $pegawai->whereDoesntHave('tim');
        }

        return response()->json(['pegawai' => $pegawai->get()]);
    }
}
