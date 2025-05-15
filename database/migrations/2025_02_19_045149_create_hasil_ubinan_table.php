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
        Schema::create('hasil_ubinan', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_pencacahan');
            $table->foreignId('pengecekan_id')->constrained('pengecekan')->onDelete('cascade')->unique();
            $table->foreignId('fenomena_id')->constrained('fenomena')->onDelete('cascade');
            $table->double('berat_hasil_ubinan')->nullable();
            $table->integer('jumlah_rumpun')->nullable();
            $table->double('luas_lahan')->nullable();
            $table->string('cara_penanaman')->nullable();
            $table->string('jenis_pupuk')->nullable();
            $table->text('penanganan_hama')->nullable();
            $table->enum('status', ['Selesai', 'Gagal']);
            $table->boolean('is_verif')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_ubinan');
    }
};
