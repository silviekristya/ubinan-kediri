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
        Schema::create('pengecekan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_sampel')->constrained('sampel')->onDelete('cascade');
            $table->date('tanggal_pengecekan');
            $table->string('nama_responden');
            $table->text('alamat_responden');
            $table->string('no_telepon_responden');
            $table->date('tanggal_panen');
            $table->enum('status_sampel', ['Eligible', 'NonEligible', 'Belum'])->nullable();
            $table->text('keterangan')->nullable();
            // Menggunakan nullable karena id_sampel_cadangan mungkin tidak ada
            $table->foreignId('id_sampel_cadangan')->nullable()->constrained('sampel')->onDelete('set null');
            $table->timestamp('verif_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengecekan');
    }
};
