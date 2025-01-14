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

        $pegawaiQuery = Pegawai::query()
            ->where('is_pml', 1);

        // Jika tim_id diberikan, ambil PML terkait tim tersebut atau yang belum terikat tim
        if ($timId) {
            $pegawaiQuery->where(function ($query) use ($timId) {
                $query->whereHas('tim', function ($subQuery) use ($timId) {
                    $subQuery->where('id', $timId); // PML yang terkait dengan tim
                })
                ->orWhereDoesntHave('tim'); // Atau PML yang tidak terikat tim
            });
        } else {
            // Jika tim_id tidak diberikan, ambil PML yang belum terikat dengan tim
            $pegawaiQuery->whereDoesntHave('tim');
        }

        // Eksekusi query dan kembalikan hasil
        $pegawai = $pegawaiQuery->get();


        return response()->json(['pegawai' => $pegawai]);
    }
}
