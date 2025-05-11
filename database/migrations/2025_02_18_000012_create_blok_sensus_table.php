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
        Schema::create('blok_sensus', function (Blueprint $table) {
            $table->string('id_bs', 14)->primary();
            $table->string('nomor_bs', 4);
            $table->string('kel_desa_id', 10);
            $table->timestamps();
            $table->foreign('kel_desa_id')
                  ->references('id')->on('kel_desa')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blok_sensus');
    }
};
