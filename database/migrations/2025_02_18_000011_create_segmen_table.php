<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('segmen', function (Blueprint $table) {
            $table->string('id_segmen', 9)->primary();
            $table->string('kode_segmen', 2);
            $table->string('nama_segmen')->nullable();
            $table->string('kecamatan_id', 7);
            $table->foreign('kecamatan_id')
                  ->references('id')->on('kecamatan')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('segmen');
    }
};
