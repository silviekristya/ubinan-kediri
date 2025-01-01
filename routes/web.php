<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Auth\PasswordController;;
use App\Http\Controllers\Home\Beranda\HomeBerandaList;
use App\Http\Controllers\Dashboard\Admin\User\UserList;
use App\Http\Controllers\Dashboard\Admin\User\UserStore;
use App\Http\Controllers\Dashboard\Admin\Mitra\MitraList;
use App\Http\Controllers\Dashboard\Admin\User\UserDelete;
use App\Http\Controllers\Dashboard\Admin\User\UserUpdate;
use App\Http\Controllers\Dashboard\Profil\ProfilController;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiList;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiStore;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiDelete;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiUpdate;
use App\Http\Controllers\Dashboard\Beranda\DashboardController;

Route::get('/', [HomeBerandaList::class, 'index'])->name('beranda.index');

Route::middleware('auth')
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('', [DashboardController::class, 'v1'])->name('beranda');

        // Start: Profil
        Route::get('profil', [ProfilController::class, 'index'])->name('profil.index');
        Route::patch('profil', [ProfilController::class, 'update'])->name('profil.update');
        Route::put('password', [PasswordController::class, 'v1'])->name('password.update');
        // End: Profil

        // Start: Admin
        Route::middleware('check.admin')
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            // Start: User
            Route::prefix('user')->name('user.')->group(function () {
                Route::get('', [UserList::class, 'v1'])->name('index');
                Route::post('create', [UserStore::class, 'v1']);
                Route::post('update/{user}', [UserUpdate::class, 'v1']);
                Route::delete('delete/{user}', [UserDelete::class, 'v1'])->name('delete');
            });
            // End: User

            // Start: Pegawai
            Route::prefix('pegawai')->name('pegawai.')->group(function () {
                Route::get('', [PegawaiList::class, 'v1'])->name('index');
                Route::post('create', [PegawaiStore::class, 'v1']);
                Route::post('update/{pegawai}', [PegawaiUpdate::class, 'v1']);
                Route::delete('delete/{pegawai}', [PegawaiDelete::class, 'v1'])->name('delete');
            });
            // End: Pegawai

            // Start: Mitra
            Route::prefix('mitra')->name('mitra.')->group(function () {
                Route::get('', [MitraList::class, 'v1'])->name('index');
                Route::post('create', [MitraStore::class, 'v1']);
                Route::post('update/{mitra}', [MitraUpdate::class, 'v1']);
                Route::delete('delete/{mitra}', [MitraDelete::class, 'v1'])->name('delete');
            });
            // End: Mitra
        });
        // End: Admin
});

require __DIR__.'/auth.php';
