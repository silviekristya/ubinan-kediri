<?php 

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\Segmen;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SegmenAvailableListOption extends Controller
{
    public function v1()
    {
        $segmen = Segmen::select('id_segmen')->get();
        return response()->json(['segmen' => $segmen]);
    }
}