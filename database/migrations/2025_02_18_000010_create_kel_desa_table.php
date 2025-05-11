<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kel_desa', function (Blueprint $table) {
            $table->string('id', 10)->primary();
            $table->string('kode_kel_desa', 3);
            $table->string('nama_kel_desa', 100);
            $table->string('kecamatan_id', 7);
            $table->foreign('kecamatan_id')
                  ->references('id')->on('kecamatan')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kel_desa');
    }
};
