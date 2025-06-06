<?php

use App\Http\Middleware\CheckAdmin;
use App\Http\Middleware\CheckMitra;
use App\Http\Middleware\CheckPml;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Contracts\Console\Kernel as ConsoleKernelContract;

// Buat Application instance via builder
$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Menambahkan alias middleware
        $middleware->alias([
            'check.admin' => CheckAdmin::class,
            'check.pml'   => CheckPml::class,
            'check.mitra' => CheckMitra::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

// Bind Console Kernel secara manual agar Artisan memanggil App\Console\Kernel
$app->singleton(
    ConsoleKernelContract::class,
    App\Console\Kernel::class
);

// Kembalikan Application instance
return $app;