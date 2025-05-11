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
        Schema::create('produktivitas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_hasil_ubinan');
            $table->foreign('id_hasil_ubinan')->references('id')->on('hasil_ubinan')
                  ->onDelete('cascade')->unique();
            $table->double('luas_perhektar')->default(100000);
            $table->double('jumlah_luas_ubinan')->default(6.25);
            $table->double('produktivitas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produktivitas');
    }
};
