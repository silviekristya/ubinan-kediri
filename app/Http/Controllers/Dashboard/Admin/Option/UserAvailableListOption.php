<?php

namespace App\Http\Controllers\Dashboard\Admin\Option;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserAvailableListOption extends Controller
{
    /**
     * Display a listing of Mitra with related User data.
     */
    public function v1(Request $request): JsonResponse
    {
        $users = User::whereDoesntHave('pegawai')->whereDoesntHave('mitra')->get();
        return response()->json(['users' => $users]);
    }
}
