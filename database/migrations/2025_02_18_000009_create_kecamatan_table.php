<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kecamatan', function (Blueprint $table) {
            $table->string('id', 7)->primary();
            $table->string('kode_kecamatan', 3);
            $table->string('nama_kecamatan', 100);
            $table->string('kab_kota_id', 4);
            $table->foreign('kab_kota_id')
                  ->references('id')->on('kab_kota')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kecamatan');
    }
};