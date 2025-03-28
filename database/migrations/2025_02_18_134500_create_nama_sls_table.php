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
        Schema::create('nama_sls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_bs')->constrained('blok_sensus')->cascadeOnDelete();
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
