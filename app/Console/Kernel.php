<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Schedule the command to run daily at 08:00 AM
        $schedule->command('notifications:send-daily')->dailyAt('08:00');
        // Schedule the command to run monthly on the first day of the month at 08:00
        $schedule->command('notifications:send-monthly')->monthlyOn(1, '08:00');
        // Schedule the command to run daily on D-1 panen at 08:00 AM
        $schedule->command('notifications:send-h1-notifications')->dailyAt('08:00');
        // Schedule the command to run daily on D-3 panen at 08:00 AM
        $schedule->command('notifications:send-h3-notifications')->dailyAt('08:00');

    
        // debugging purpose
        $schedule->call(function () {
            Log::info("Scheduler OK di " . now()->toDateTimeString());
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}