<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
             // 1. buat pengecekan_id nullable
             $table->unsignedBigInteger('pengecekan_id')
             ->nullable()
             ->change();

            // 2. set default CURRENT_DATE untuk tanggal_terkirim
            $table->date('tanggal_terkirim')
                    ->default(DB::raw('CURRENT_DATE'))
                    ->change();

            // 3. set default 'Gagal' untuk status
            $table->enum('status', ['Terkirim', 'Gagal'])
                    ->default('Gagal')
                    ->change();

            // 4. index untuk tipe_notifikasi
            $table->index('tipe_notifikasi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifikasi', function (Blueprint $table) {
            // 1. rollback pengecekan_id ke not nullable
            $table->unsignedBigInteger('pengecekan_id')
                  ->nullable(false)
                  ->change();

            // 2. hapus default tanggal_terkirim
            $table->date('tanggal_terkirim')
                  ->default(null)
                  ->change();

            // 3. hapus default status
            $table->enum('status', ['Terkirim', 'Gagal'])
                  ->default(null)
                  ->change();

            // 4. drop index tipe_notifikasi
            $table->dropIndex(['tipe_notifikasi']);
        });
    }
};
