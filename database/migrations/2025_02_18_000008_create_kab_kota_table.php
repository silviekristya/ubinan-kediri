<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kab_kota', function (Blueprint $table) {
            $table->string('id', 4)->primary();
            $table->string('kode_kab_kota', 2);
            $table->string('nama_kab_kota', 100);
            $table->string('provinsi_id', 2);
            $table->foreign('provinsi_id')
                  ->references('kode_provinsi')->on('provinsi')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kab_kota');
    }
};
