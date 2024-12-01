<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Auth\PasswordController;;
use App\Http\Controllers\Home\Beranda\HomeBerandaList;
use App\Http\Controllers\Dashboard\Admin\User\UserList;
use App\Http\Controllers\Dashboard\Admin\User\UserDelete;
use App\Http\Controllers\Dashboard\Admin\User\UserUpdate;
use App\Http\Controllers\Dashboard\Profil\ProfilController;
use App\Http\Controllers\Dashboard\Beranda\DashboardController;

Route::get('/', [HomeBerandaList::class, 'index'])->name('beranda.index');

Route::middleware('auth')
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('', [DashboardController::class, 'index'])->name('beranda');

        // Start: Profil
        Route::get('profil', [ProfilController::class, 'index'])->name('profil.index');
        Route::patch('profil', [ProfilController::class, 'update'])->name('profil.update');
        Route::put('password', [PasswordController::class, 'update'])->name('password.update');
        // End: Profil

        // Start: Admin
        Route::middleware('admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            // Start: User
            Route::prefix('user')->name('user.')->group(function () {
                Route::get('', [UserList::class, 'index'])->name('index');
                Route::post('update/{user}', [UserUpdate::class, 'update']);
                Route::delete('delete/{user}', [UserDelete::class, 'destroy'])->name('delete');
            });
            // End: User
        });
        // End: Admin
});

require __DIR__.'/auth.php';
