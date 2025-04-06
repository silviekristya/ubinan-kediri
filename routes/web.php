<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Auth\PasswordController;;
use App\Http\Controllers\Dashboard\Admin\Tim\TimList;
use App\Http\Controllers\Dashboard\Admin\Tim\TimStore;
use App\Http\Controllers\Home\Beranda\HomeBerandaList;
use App\Http\Controllers\Dashboard\Admin\Tim\TimDelete;
use App\Http\Controllers\Dashboard\Admin\Tim\TimUpdate;
use App\Http\Controllers\Dashboard\Admin\User\UserList;
use App\Http\Controllers\Dashboard\Admin\User\UserStore;
use App\Http\Controllers\Dashboard\Admin\Mitra\MitraList;
use App\Http\Controllers\Dashboard\Admin\User\UserDelete;
use App\Http\Controllers\Dashboard\Admin\User\UserUpdate;
use App\Http\Controllers\Dashboard\Admin\Mitra\MitraStore;
use App\Http\Controllers\Dashboard\Admin\Mitra\MitraDelete;
use App\Http\Controllers\Dashboard\Admin\Mitra\MitraUpdate;
use App\Http\Controllers\Dashboard\Profil\ProfilController;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiList;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiStore;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiDelete;
use App\Http\Controllers\Dashboard\Admin\Pegawai\PegawaiUpdate;
use App\Http\Controllers\Dashboard\Beranda\DashboardController;
use App\Http\Controllers\Dashboard\Admin\Option\PmlAvailableListOption;
use App\Http\Controllers\Dashboard\Admin\Option\PclAvailableListOption;
use App\Http\Controllers\Dashboard\Admin\Option\UserAvailableListOption;
use App\Http\Controllers\Dashboard\Admin\Sampel\SampelList; 
use App\Http\Controllers\Dashboard\Admin\Sampel\SampelStore;
use App\Http\Controllers\Dashboard\Admin\Sampel\SampelDelete;
use App\Http\Controllers\Dashboard\Admin\Sampel\SampelUpdate;
use App\Http\Controllers\Dashboard\Admin\Segmen\SegmenStore;
use App\Http\Controllers\Dashboard\Admin\Segmen\SegmenDelete;
use App\Http\Controllers\Dashboard\Admin\Segmen\SegmenUpdate;
use App\Http\Controllers\Dashboard\Admin\BlokSensus\BlokSensusStore;
use App\Http\Controllers\Dashboard\Admin\BlokSensus\BlokSensusDelete;
use App\Http\Controllers\Dashboard\Admin\BlokSensus\BlokSensusUpdate;
use App\Http\Controllers\Dashboard\Admin\NamaSls\NamaSlsStore;
use App\Http\Controllers\Dashboard\Admin\NamaSls\NamaSlsDelete;
use App\Http\Controllers\Dashboard\Admin\NamaSls\NamaSlsUpdate;
use App\Http\Controllers\Dashboard\Admin\SegmenBlokSensus\SegmenBlokSensusController;
use App\Http\Controllers\Dashboard\Admin\Option\BsAvailableListOption;
use App\Http\Controllers\Dashboard\Admin\Option\SlsAvailableListOption; // Ensure this class exists in the specified namespace
use App\Http\Controllers\Dashboard\Admin\Option\TimAvailableListOption; // Ensure this class exists in the specified namespace
use App\Http\Controllers\Dashboard\Admin\Option\TimPclAvailableListOption; // Ensure this class exists in the specified namespace
use App\Http\Controllers\Dashboard\Admin\Option\SegmenAvailableListOption;
use App\Http\Controllers\Dashboard\Admin\Alokasi\PclAllocationUpdate;
use App\Http\Controllers\Dashboard\Admin\Alokasi\PmlAllocationUpdate; // Ensure this class exists in the specified namespace


Route::get('/', [HomeBerandaList::class, 'v1'])->name('beranda.index');

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
                Route::post('store', [UserStore::class, 'v1']);
                Route::post('update/{user}', [UserUpdate::class, 'v1']);
                Route::delete('delete/{user}', [UserDelete::class, 'v1'])->name('delete');
            });
            // End: User

            // Start: Pegawai
            Route::prefix('pegawai')->name('pegawai.')->group(function () {
                Route::get('', [PegawaiList::class, 'v1'])->name('index');
                Route::post('store', [PegawaiStore::class, 'v1']);
                Route::post('update/{pegawai}', [PegawaiUpdate::class, 'v1']);
                Route::delete('delete/{pegawai}', [PegawaiDelete::class, 'v1'])->name('delete');
            });
            // End: Pegawai

            // Start: Mitra
            Route::prefix('mitra')->name('mitra.')->group(function () {
                Route::get('', [MitraList::class, 'v1'])->name('index');
                Route::post('store', [MitraStore::class, 'v1']);
                Route::post('update/{mitra}', [MitraUpdate::class, 'v1']);
                Route::delete('delete/{mitra}', [MitraDelete::class, 'v1'])->name('delete');
            });
            // End: Mitra

            // Start: Tim
            Route::prefix('tim')->name('tim.')->group(function () {
                Route::get('', [TimList::class, 'v1'])->name('index');
                // Route::post('store', [TimStore::class, 'v1']);
                // Route::post('update/{tim}', [TimUpdate::class, 'v1']);
                // Route::delete('delete/{tim}', [TimDelete::class, 'v1'])->name('delete');
            });
            // End: Tim

            // Start: Segmen & Blok Sensus
            Route::prefix('segmen-blok-sensus')->name('segmen-blok-sensus.')->group(function () {
                    
                // Tambahkan route index untuk halaman utama
                Route::get('', [SegmenBlokSensusController::class, 'index'])
                    ->name('index');
                
                // Sub-route segmen
                Route::prefix('segmen')->name('segmen.')->group(function () {
                    Route::post('store', [SegmenStore::class, 'v1']);
                    Route::post('update/{segmen}', [SegmenUpdate::class, 'v1']);
                    Route::delete('delete/{segmen}', [SegmenDelete::class, 'v1'])->name('delete');
                });
                
                // Sub-route blok-sensus
                Route::prefix('blok-sensus')->name('blok-sensus.')->group(function () {
                    Route::post('store', [BlokSensusStore::class, 'v1']);
                    Route::post('update/{blokSensus}', [BlokSensusUpdate::class, 'v1']);
                    Route::delete('delete/{blokSensus}', [BlokSensusDelete::class, 'v1'])->name('delete');
                });
                
                // Sub-route nama-sls
                Route::prefix('nama-sls')->name('nama-sls.')->group(function () {
                    Route::post('store', [NamaSlsStore::class, 'v1']);
                    Route::post('update/{namaSls}', [NamaSlsUpdate::class, 'v1']);
                    Route::delete('delete/{namaSls}', [NamaSlsDelete::class, 'v1'])->name('delete');
                });
            });
             // End: Segmen & Blok Sensus

            // Start: Sampel
            Route::prefix('sampel')->name('sampel.')->group(function () {
                Route::get('/', [SampelList::class, 'v1'])->name('index');
                Route::post('store', [SampelStore::class, 'v1']);
                Route::post('update/{sampel}', [SampelUpdate::class, 'v1']);
                Route::delete('delete/{sampel}', [SampelDelete::class, 'v1'])->name('delete');
            });
            // End: Sampel  

            // Start: Option
             Route::prefix('option')->name('option.')->group(function () {
                Route::get('user-available-list', [UserAvailableListOption::class, 'v1'])->name('user-available');
                Route::get('pml-available-list', [PmlAvailableListOption::class, 'v1'])->name('pml-available');
                Route::get('pcl-available-list', [PclAvailableListOption::class, 'v1'])->name('pcl-available');
                Route::get('bs-available-list', [BsAvailableListOption::class, 'v1'])->name('bs-available');
                Route::get('sls-available-list', [SlsAvailableListOption::class, 'v1'])->name('sls-available');
                Route::get('segmen-available-list', [SegmenAvailableListOption::class, 'v1'])->name('segmen-available');
                Route::get('tim-available-list', [TimAvailableListOption::class, 'v1'])->name('tim-available');
                Route::get('tim-pcl/{timId}/tim-pcl-available-list', [TimPclAvailableListOption::class, 'v1'])->name('tim-pcl-available');
            });
            // End: Option

            // Start: Alokasi
            Route::prefix('alokasi')->name('alokasi.')->group(function () {
                Route::put('update/sampel/{sampel}/pml', [PmlAllocationUpdate::class, 'v1']) -> name('alokasi-pml'); 
                Route::put('update/sampel/{sampel}/pcl', [PclAllocationUpdate::class, 'v1']) -> name('alokasi-pcl');
            });
            // End: Alokasi
        });
        // End: Admin
});

// Rute API khusus untuk operasi CRUD Tim (mengembalikan JSON)
// Endpoint ini tidak diproses oleh middleware Inertia
Route::middleware(['auth', 'check.admin'])
    ->prefix('api/admin/tim')
    ->name('api.admin.tim.')
    ->group(function () {
        Route::post('store', [TimStore::class, 'v1'])->name('store');
        Route::post('update/{tim}', [TimUpdate::class, 'v1'])->name('update');
        Route::delete('delete/{tim}', [TimDelete::class, 'v1'])->name('delete');
    });

require __DIR__.'/auth.php';