<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameLuasPerhektarToKonversiInProduktivitasTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('produktivitas', function (Blueprint $table) {
            // Pastikan kamu sudah install doctrine/dbal jika menggunakan MySQL:
            // composer require doctrine/dbal
            $table->renameColumn('luas_perhektar', 'konversi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produktivitas', function (Blueprint $table) {
            $table->renameColumn('konversi', 'luas_perhektar');
        });
    }
}
