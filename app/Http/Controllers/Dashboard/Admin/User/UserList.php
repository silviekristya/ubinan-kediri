<?php

namespace App\Http\Controllers\Dashboard\Admin\User;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserList extends Controller
{
    /**
     *
     */
    public function index(Request $request): Response
    {
        $user = User::all();

        return Inertia::render('Dashboard/Admin/User/ListUser', [
            'user' => $user,
        ]);
    }
}
