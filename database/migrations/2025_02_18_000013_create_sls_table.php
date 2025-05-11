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
        Schema::create('sls', function (Blueprint $table) {
            $table->id();
            $table->string('bs_id', 14);
            $table->foreign('bs_id')
                  ->references('id_bs')->on('blok_sensus')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->string('nama_sls');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nama_sls');
    }
};
